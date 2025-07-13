import { createClient } from "redis";

import { User } from "./proto/randomPackage/User";
import { StreamMessage } from "./proto/randomPackage/StreamMessage";

const client = createClient();

client.on("error", (err) => {
  console.error("Redis Client Error", err);
});

client.on("connect", () => {
  console.log("Connected to Redis");
});

const REDIS_KEYS = {
  broadcastRoom: "room:0:messages",
  users: "users",
};

(async () => {
  await client.connect();
})();

export const addUser = async (user: User): Promise<number> => {
  try {
    return await client.rPush(REDIS_KEYS.users, JSON.stringify(user));
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
};

export const listUsers = async (): Promise<Array<User>> => {
  try {
    const rows = await client.lRange(REDIS_KEYS.users, 0, -1);
    const users: Array<User> = [];
    for (const row of rows) {
      const user = JSON.parse(row) as User;
      users.push(user);
    }
    return users;
  } catch (error) {
    console.error("Error listing users:", error);
    throw error;
  }
};

export const updateUser = async (user: User): Promise<void> => {
  try {
    const users = await listUsers();
    const index = users.findIndex((u) => u.id === user.id);
    if (index === -1) {
      throw new Error("User not found");
    }
    await client.lSet(REDIS_KEYS.users, index, JSON.stringify(user));
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const getUser = async (id: number): Promise<User> => {
  try {
    const users = await listUsers();
    const idx = users.findIndex((u) => u.id === id);

    if (idx === -1) return new Error("User not found");

    return users[idx];
  } catch (error) {
    console.log("Error getting user:", error);
    throw error;
  }
};

export const addMessageToRoom = async (msg: StreamMessage): Promise<number> => {
  try {
    return await client.rPush(REDIS_KEYS.broadcastRoom, JSON.stringify(msg));
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
};

export const listMessagesInRoom = async (): Promise<StreamMessage[]> => {
  try {
    const rows = await client.lRange(REDIS_KEYS.broadcastRoom, 0, -1);
    const msgs: Array<StreamMessage> = [];
    for (const row of rows) {
      const msg = JSON.parse(row) as StreamMessage;
      msgs.push(msg);
    }
    return msgs;
  } catch (error) {
    console.log("Error listing messages in room:", error);
    throw error;
  }
};

// Create Redis clients for pub/sub
const publisherClient = createClient();
const subscriberClient = createClient();

// Connect the pub/sub clients
(async () => {
  try {
    await publisherClient.connect();
    await subscriberClient.connect();
    console.log("Redis pub/sub clients connected");
  } catch (error) {
    console.error("Error connecting Redis pub/sub clients:", error);
  }
})();

export { publisherClient, subscriberClient };
