import path from "path";
import * as grpc from "@grpc/grpc-js";
import * as protoloader from "@grpc/proto-loader";
import { ProtoGrpcType } from "./proto/random";
import { ChatServiceHandlers } from "./proto/randomPackage/ChatService";
import {
  listUsers,
  addUser,
  updateUser,
  getUser,
  addMessageToRoom,
  listMessagesInRoom,
} from "./data";
import {
  listenMainChatRoomUpdate,
  listenUserUpdate,
  emitMainChatRoomUpdate,
  emitUserUpdateEvent,
} from "./pubsub";
import { User } from "./proto/randomPackage/User";
import { StreamMessage } from "./proto/randomPackage/StreamMessage";
import { StreamRequest__Output } from "./proto/randomPackage/StreamRequest";
import { UserStreamResponse } from "./proto/randomPackage/UserStreamResponse";

// Global error handlers
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

const PORT = 8082;
const PROTO_FILE = "./proto/random.proto";

let packageDef: any;
let grpcObj: ProtoGrpcType;
let randomPackage: any;

try {
  packageDef = protoloader.loadSync(path.resolve(__dirname, PROTO_FILE));
  grpcObj = grpc.loadPackageDefinition(packageDef) as unknown as ProtoGrpcType;
  randomPackage = grpcObj.randomPackage;
} catch (error) {
  console.error("Error loading proto files:", error);
  process.exit(1);
}

function main() {
  const server = getServer();
  server.bindAsync(
    `0.0.0.0:${PORT}`,
    grpc.ServerCredentials.createInsecure(),
    async (err, port) => {
      if (err) {
        console.error("Error binding server:", err);
        return;
      }
      console.log(`Server running at http://localhost:${port}`);

      // Setup pub/sub listeners after server is successfully bound
      await setupPubSub();
      console.log("Pub/Sub listeners initialized");
    }
  );
}

const messageStreamByUserId = new Map<
  number,
  grpc.ServerWritableStream<StreamRequest__Output, StreamMessage>
>();

const userStreamByUserId = new Map<
  number,
  grpc.ServerWritableStream<StreamRequest__Output, UserStreamResponse>
>();

function getServer() {
  const server = new grpc.Server();

  try {
    server.addService(randomPackage.ChatService.service, {
      ChatInitiate: (call, callback) => {
        const sessionName = call.request.name || "";
        const avatar = call.request.avatarUrl || "";

        if (!sessionName || !avatar)
          return callback(new Error("Name and avatar URL are required"));

        // reach into database
        (async () => {
          try {
            const users = await listUsers();

            // check if the user with name already exists and is online
            let dbUser = users.find(
              (u) => u?.name?.toLowerCase() === sessionName.toLowerCase()
            );

            console.log(dbUser);

            if (dbUser && dbUser.status === "ONLINE") {
              return callback(
                new Error("User with name already exists and is online")
              );
            }

            if (dbUser) {
              dbUser.status = "ONLINE";
              dbUser.avatarUrl = avatar; // Update avatar URL when user logs in again
              await updateUser(dbUser);
              await emitUserUpdateEvent(dbUser);
              return callback(null, { id: dbUser.id || 0 });
            } else {
              const user: User = {
                id: Math.floor(Math.random() * 10000000),
                name: sessionName,
                avatarUrl: avatar,
                status: "ONLINE",
              };
              await addUser(user);
              await emitUserUpdateEvent(user);

              return callback(null, { id: user.id });
            }
          } catch (error) {
            return callback(
              error instanceof Error ? error : new Error(String(error))
            );
          }
        })();
      },
      SendMessage: (call, callback) => {
        const { id = -1, message = "" } = call.request;
        if (!id || !message) return callback(new Error("IDK WHO YOU ARE"));
        (async () => {
          try {
            const user: User = await getUser(id);
            if (!user) return callback(new Error("User not found"));

            const msg: StreamMessage = {
              userId: user.id ?? -1,
              message,
              userAvatar: user.avatarUrl || "",
              userName: user.name || "",
            };

            const result = await addMessageToRoom(msg);
            if (result === -1) {
              return callback(new Error("Failed to add message to room"));
            }

            emitMainChatRoomUpdate(msg);

            // Notify all connected message streams about the new message
            for (const [userId, stream] of messageStreamByUserId.entries()) {
              try {
                stream.write(msg);
              } catch (writeError) {
                console.error(
                  `Error writing to stream for user ${userId}:`,
                  writeError
                );
                messageStreamByUserId.delete(userId);
              }
            }

            // Return success response
            callback(null, {});
          } catch (error) {
            console.error("Error in SendMessage:", error);
            return callback(
              error instanceof Error ? error : new Error(String(error))
            );
          }
        })();
      },
      ChatStream: (call) => {
        const { id = -1 } = call.request;
        if (!id) return call.end();
        (async () => {
          try {
            const user: User = await getUser(id);
            if (!user) {
              console.error(`User not found for ChatStream: ${id}`);
              return call.end();
            }

            const msgs = await listMessagesInRoom();
            for (const msg of msgs) {
              try {
                call.write(msg); // write the message to the stream i.e. the user
              } catch (writeError) {
                console.error(
                  `Error writing message to stream for user ${id}:`,
                  writeError
                );
                return call.end();
              }
            }
            messageStreamByUserId.set(id, call);

            call.on("cancelled", async () => {
              console.log(`Stream cancelled for user ID: ${id}`);
              try {
                user.status = "OFFLINE";
                await updateUser(user);
                await emitUserUpdateEvent(user);
                messageStreamByUserId.delete(user.id ?? -1);

                // Notify all user streams about the status change
                for (const [
                  userId,
                  userStream,
                ] of userStreamByUserId.entries()) {
                  try {
                    const users = await listUsers();
                    userStream.write({ users });
                  } catch (userStreamError) {
                    console.error(
                      `Error updating user stream ${userId}:`,
                      userStreamError
                    );
                    userStreamByUserId.delete(userId);
                  }
                }
              } catch (cancelError) {
                console.error(
                  `Error handling stream cancellation for user ${id}:`,
                  cancelError
                );
              }
            });

            call.on("error", (error) => {
              console.error(`Stream error for user ${id}:`, error);
              messageStreamByUserId.delete(id);
            });
          } catch (error) {
            console.error(`Error in ChatStream for user ${id}:`, error);
            call.end();
          }
        })();
      },
      UserStream: (call) => {
        const { id = -1 } = call.request;
        if (!id) return call.end();
        (async () => {
          try {
            const user: User = await getUser(id);
            if (!user) {
              console.error(`User not found for UserStream: ${id}`);
              return call.end();
            }

            const users: User[] = await listUsers();
            try {
              call.write({ users });
            } catch (writeError) {
              console.error(
                `Error writing users to stream for user ${id}:`,
                writeError
              );
              return call.end();
            }

            userStreamByUserId.set(user.id ?? -1, call);

            call.on("cancelled", async () => {
              try {
                user.status = "OFFLINE";
                await updateUser(user);
                await emitUserUpdateEvent(user);
                console.log(`User stream cancelled for user ID: ${id}`);
                userStreamByUserId.delete(user.id ?? -1);
              } catch (error) {
                console.error(
                  `Error handling user stream cancellation for user ${id}:`,
                  error
                );
              }
            });

            call.on("error", async (error) => {
              try {
                console.error(`User stream error for user ${id}:`, error);
                user.status = "OFFLINE";
                await updateUser(user);
                await emitUserUpdateEvent(user);
                userStreamByUserId.delete(user.id ?? -1);
              } catch (updateError) {
                console.error(
                  `Error updating user status on stream error for user ${id}:`,
                  updateError
                );
              }
            });
          } catch (error) {
            console.error(`Error in UserStream for user ${id}:`, error);
            call.end();
          }
        })();
      },
    } as ChatServiceHandlers);
  } catch (error) {
    console.error("Error setting up gRPC service:", error);
    throw error;
  }

  return server;
}

const setupPubSub = async () => {
  try {
    await listenUserUpdate((user, channel) => {
      try {
        (async () => {
          const users = await listUsers();
          for (const [, userCall] of userStreamByUserId) {
            userCall.write({ users }); // write the updated user list to the stream
          }
        })();
      } catch (error) {
        console.error(
          `Error handling user update on channel ${channel}:`,
          error
        );
      }
    });

    await listenMainChatRoomUpdate((msg, channel) => {
      console.log(`Message received on channel: ${channel}`);
      for (const [, userCall] of messageStreamByUserId) {
        userCall.write(msg); // write the message to the stream
      }
    });

    console.log("Pub/Sub listeners set up successfully");
  } catch (error) {
    console.error("Error setting up pub/sub listeners:", error);
  }
};

main();
