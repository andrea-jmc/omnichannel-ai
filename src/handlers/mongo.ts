import { Collection, ObjectId } from "mongodb";
import { IncomingMessage, SaveMessageResponse } from "../types/main";
import { formatChatData, getMongoClientInstance } from "../utils/mongodb";
import {
  AgentMessage,
  Conversation,
  TakeoverRequest,
  User,
} from "../types/schemas";
import { sendWhatsappMessage } from "../utils/whatsapp";
import { runAssistant, stageMultipleMessages } from "./assistant";
import { parseFinalMessage } from "../utils/assistant";

// returns the current value of takeover
export const saveMessage = async (
  message: IncomingMessage
): Promise<SaveMessageResponse> => {
  const mongoClient = getMongoClientInstance();
  const collection: Collection<Conversation> = mongoClient
    .db("local")
    .collection("WA");
  const conversation = await collection.findOne(
    { chat_id: message.chatId },
    { projection: { chat_id: 1, takeover: 1, thread_id: 1 } }
  );

  if (conversation) {
    await collection.updateOne(
      { chat_id: message.chatId },
      {
        $push: {
          messages: {
            timestamp: message.timestamp,
            author: "user",
            content: message.content,
            takeover: conversation.takeover,
          },
        },
        $set: { updated_at: new Date() },
      }
    );
    return {
      takeover: conversation.takeover,
      threadId: conversation.thread_id,
    };
  } else {
    await collection.insertOne({
      chat_id: message.chatId,
      assigned_agent_id: null,
      messages: [
        {
          author: "user",
          content: message.content,
          takeover: false,
          timestamp: message.timestamp,
        },
      ],
      takeover: false,
      thread_id: "",
      user_id: message.from,
      created_at: new Date(),
      updated_at: new Date(),
    });
    return { takeover: false, threadId: "" };
  }
};

export const saveAssistantMessage = async (
  chatId: string,
  message: string,
  takeover: boolean
) => {
  const mongoClient = getMongoClientInstance();
  const collection: Collection<Conversation> = mongoClient
    .db("local")
    .collection("WA");

  await collection.updateOne(
    { chat_id: chatId },
    {
      $push: {
        messages: {
          timestamp: Math.floor(new Date().getTime() / 1000).toString(),
          author: takeover ? "agent" : "assistant",
          content: message,
          takeover: takeover,
        },
      },
      $set: { updated_at: new Date() },
    }
  );
};

export const updateThreadId = async (chatId: string, threadId: string) => {
  const mongoClient = getMongoClientInstance();
  const collection: Collection<Conversation> = mongoClient
    .db("local")
    .collection("WA");

  await collection.updateOne(
    { chat_id: chatId },
    {
      $set: { thread_id: threadId, updated_at: new Date() },
    }
  );
};

export const saveUser = async (data: User) => {
  const mongoClient = getMongoClientInstance();
  const collection: Collection<User> = mongoClient
    .db("local")
    .collection("Users");

  await collection.insertOne(data);
};

export const handleOutgoingMessages = async () => {
  const mongoClient = getMongoClientInstance();
  const collection: Collection<Conversation> = mongoClient
    .db("local")
    .collection("WA");
  const data = collection.find({});
  const result = formatChatData(data);
  return result;
};

export const handleAgentMessage = async ({
  chat_id,
  content,
  userId,
}: AgentMessage) => {
  const mongoClient = getMongoClientInstance();
  const collection: Collection<Conversation> = mongoClient
    .db("local")
    .collection("WA");

  await Promise.all([
    saveAssistantMessage(chat_id, content, true),
    sendWhatsappMessage(content, userId),
  ]);
};

export const handleTakeover = async ({
  takeover,
  chat_id,
  userId,
}: TakeoverRequest) => {
  const mongoClient = getMongoClientInstance();
  const collection: Collection<Conversation> = mongoClient
    .db("local")
    .collection("WA");
  if (takeover) {
    collection.updateOne(
      { chat_id },
      { $set: { updated_at: new Date(), takeover } }
    );
  } else {
    // get all takeover messages and thread_id
    const conversation = await collection.findOne(
      {
        chat_id,
      },
      { projection: { messages: 1, thread_id: 1 } }
    );
    if (conversation) {
      const takeoverMessages = conversation.messages.filter(
        (message) => message.takeover
      );
      // update all takeover messages and convo
      await collection.updateOne(
        { chat_id },
        {
          $set: {
            takeover: false,
            "messages.$[].takeover": false,
          },
        }
      );
      // send to assistant
      await stageMultipleMessages(conversation.thread_id, takeoverMessages);
      const assistantResponse = await runAssistant(conversation.thread_id);
      // check if final message and save data
      const finalData = parseFinalMessage(assistantResponse);
      if (finalData) {
        await saveUser(finalData);
      }

      // reply to user and save message
      await Promise.all([
        saveAssistantMessage(chat_id, assistantResponse, false),
        sendWhatsappMessage(assistantResponse, userId),
      ]);
    }
  }
};
