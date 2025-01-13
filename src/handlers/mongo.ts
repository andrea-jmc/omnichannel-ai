// import { Collection, ObjectId } from "mongodb";
// import { IncomingMessage, SaveMessageResponse } from "../types/main";
// // import { getMongoClientInstance } from "../utils/mongodb";
// import { Conversation, User } from "../types/schemas";

// // returns the current value of takeover
// // export const saveMessage = async (
// //   message: IncomingMessage
// // ): Promise<SaveMessageResponse> => {
//   // const mongoClient = getMongoClientInstance();
//   // const collection: Collection<Conversation> = mongoClient
//   //   .db("local")
//   //   .collection("WA");
//   // const conversation = await collection.findOne(
//   //   { chat_id: message.chatId },
//   //   { projection: { chat_id: 1, takeover: 1, thread_id: 1 } }
//   // );

//   // if (conversation) {
//   //   await collection.updateOne(
//   //     { chat_id: message.chatId },
//   //     {
//   //       $push: {
//   //         messages: {
//   //           timestamp: message.timestamp,
//   //           author: "user",
//   //           content: message.content,
//   //           takeover: conversation.takeover,
//   //         },
//   //       },
//   //       $set: { updated_at: new Date() },
//   //     }
//   //   );
//   //   return {
//   //     takeover: conversation.takeover,
//   //     threadId: conversation.thread_id,
//   //   };
//   // } else {
//   //   await collection.insertOne({
//   //     chat_id: message.chatId,
//   //     assigned_agent_id: null,
//   //     messages: [
//   //       {
//   //         author: "user",
//   //         content: message.content,
//   //         takeover: false,
//   //         timestamp: message.timestamp,
//   //       },
//   //     ],
//   //     takeover: false,
//   //     thread_id: "",
//   //     user_id: message.from,
//   //     created_at: new Date(),
//   //     updated_at: new Date(),
//   //   });
//   //   return { takeover: false, threadId: "" };
//   // }
// };

// export const saveAssistantMessage = async (
//   chatId: string,
//   message: string,
//   takeover: boolean
// ) => {
//   const mongoClient = getMongoClientInstance();
//   const collection: Collection<Conversation> = mongoClient
//     .db("local")
//     .collection("WA");

//   await collection.updateOne(
//     { chat_id: chatId },
//     {
//       $push: {
//         messages: {
//           timestamp: Math.floor(new Date().getTime() / 1000).toString(),
//           author: "assistant",
//           content: message,
//           takeover: takeover,
//         },
//       },
//       $set: { updated_at: new Date() },
//     }
//   );
// };

// export const updateThreadId = async (chatId: string, threadId: string) => {
//   const mongoClient = getMongoClientInstance();
//   const collection: Collection<Conversation> = mongoClient
//     .db("local")
//     .collection("WA");

//   await collection.updateOne(
//     { chat_id: chatId },
//     {
//       $set: { thread_id: threadId, updated_at: new Date() },
//     }
//   );
// };

// export const saveUser = async (data: User) => {
//   const mongoClient = getMongoClientInstance();
//   const collection: Collection<User> = mongoClient
//     .db("local")
//     .collection("Users");

//   await collection.insertOne(data);
// };
