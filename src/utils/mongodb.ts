import { FindCursor, MongoClient, WithId } from "mongodb";
import { Conversation, OutgoingChat } from "../types/schemas";

const connectionURI = process.env.CONNECTION_URI;

const client = new MongoClient(connectionURI ?? "");

export const startMongoClient = async () => {
  await client.connect();
  console.log("Connected to MongoDB");
};

export const getMongoClientInstance = () => {
  return client;
};

export const stopMongoClient = () => {
  client.close();
};

export const formatChatData = async (
  data: FindCursor<WithId<Conversation>>
): Promise<OutgoingChat[]> => {
  const payload = await data
    .map((item) => ({
      chat_id: item.chat_id,
      userId: item.user_id,
      takeover: item.takeover,
      closed: item.closed,
      messages: item.messages,
      lastMessage:
        item.messages.length > 0
          ? item.messages[item.messages.length - 1].content
          : "",
    }))
    .toArray();
  return payload;
};
