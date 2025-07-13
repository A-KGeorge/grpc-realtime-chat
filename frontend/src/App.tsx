import { useEffect, useState } from "react";
import "./App.css";
import Greeting from "./components/Greeting";
import Chat from "./components/Chat";
import {
  ChatServiceClient,
  StreamMessage,
  StreamRequest,
  UserStreamResponse,
  MessageRequest,
} from "./proto/random_grpc_web_pb";
import { InitiateRequest, User } from "./proto/random_grpc_web_pb";

const client = new ChatServiceClient("http://localhost:8080", null, null);

function App() {
  const [msgs, setMsgs] = useState<Array<StreamMessage.AsObject>>();
  const [users, setUsers] = useState<Array<User.AsObject>>();
  const [user, setUser] = useState<User>();

  useEffect(() => {
    if (!user) return;
    const req = new StreamRequest();
    req.setId(user.getId());

    //for chat stream
    (() => {
      const stream = client.chatStream(req, {});
      stream.on("data", (chunk: StreamMessage) => {
        const msg = chunk.toObject();
        setMsgs((prev) => {
          const existing = prev || [];
          // Prevent duplicates by checking if message already exists
          const isDuplicate = existing.some(
            (existingMsg) =>
              existingMsg.userId === msg.userId &&
              existingMsg.message === msg.message &&
              existingMsg.userName === msg.userName
          );
          return isDuplicate ? existing : [...existing, msg];
        });
      });
    })();

    //for user stream
    (() => {
      const stream = client.userStream(req, {});
      stream.on("data", (chunk: UserStreamResponse) => {
        const users = chunk.toObject().usersList;
        setUsers(users);
      });
    })();
  }, [user]);

  const handleUsernameSubmit = (name: string, avatar: string) => {
    try {
      console.log(name, avatar);
      if (!name || !avatar) return;
      const req = new InitiateRequest();
      req.setName(name);
      req.setAvatarUrl(avatar);

      console.log("Sending request:", req.toObject());

      client.chatInitiate(req, {}, (err, response) => {
        if (err) {
          console.error("gRPC Error details:", {
            message: err.message,
            code: err.code,
            metadata: err.metadata,
          });
        } else {
          const respObj = response.toObject();
          const newUser = new User();
          newUser.setId(respObj.id);
          newUser.setName(name);
          newUser.setStatus("ONLINE");
          newUser.setAvatarUrl(avatar);
          setUser(newUser);
        }
      });
    } catch (error) {
      console.error("Error during username submission:", error);
      return;
    }
  };

  const handleMessageSubmit = (msg: string, onSuccess: () => void) => {
    if (!user || !msg.trim()) return;
    const msgReq = new MessageRequest();
    msgReq.setId(user?.getId());
    msgReq.setMessage(msg);
    client.sendMessage(msgReq, {}, (err, resp) => {
      if (err) {
        console.error("Error sending message:", err);
      } else {
        console.log(resp);
        onSuccess(); // Call the success callback to clear the input
      }
    });
  };

  return (
    <div className="App">
      <div className="App-container">
        {!user ? (
          <Greeting onUsernameEnter={handleUsernameSubmit} />
        ) : (
          <Chat
            user={user.toObject()}
            userList={users || []}
            messages={msgs || []}
            onMessageSubmit={handleMessageSubmit}
          />
        )}
      </div>
    </div>
  );
}

export default App;
