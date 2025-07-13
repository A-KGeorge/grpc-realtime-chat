import { publisherClient, subscriberClient } from "./data";
import { StreamMessage } from "./proto/randomPackage/StreamMessage";
import { User } from "./proto/randomPackage/User";

const REDIS_CHANNELS = {
  mainRoom: "MAIN_ROOM",
  userChange: "USER_CHANGE",
};

export type listenFnCB<T> = (data: T, channel: string) => void;

export const emitMainChatRoomUpdate = async (
  msg: StreamMessage
): Promise<void> => {
  try {
    await publisherClient.publish(REDIS_CHANNELS.mainRoom, JSON.stringify(msg));
  } catch (error) {
    console.error("Error emitting message:", error);
    throw error;
  }
};

export const listenMainChatRoomUpdate = async (
  fn: listenFnCB<StreamMessage>
): Promise<void> => {
  try {
    await subscriberClient.subscribe(
      REDIS_CHANNELS.mainRoom,
      (data: string) => {
        try {
          const msg: StreamMessage = JSON.parse(data);
          fn(msg, REDIS_CHANNELS.mainRoom);
        } catch (error) {
          console.error("Error processing message:", error);
        }
      }
    );
  } catch (error) {
    console.error("Error setting up message listener:", error);
    throw error;
  }
};

export const emitUserUpdateEvent = async (user: User): Promise<void> => {
  try {
    await publisherClient.publish(
      REDIS_CHANNELS.userChange,
      JSON.stringify(user)
    );
  } catch (error) {
    console.error("Error emitting user update:", error);
    throw error;
  }
};

export const listenUserUpdate = async (fn: listenFnCB<User>): Promise<void> => {
  try {
    await subscriberClient.subscribe(
      REDIS_CHANNELS.userChange,
      (data: string) => {
        try {
          const user: User = JSON.parse(data);
          fn(user, REDIS_CHANNELS.userChange);
        } catch (error) {
          console.error("Error processing user change:", error);
        }
      }
    );
  } catch (error) {
    console.error("Error setting up user change listener:", error);
    throw error;
  }
};
