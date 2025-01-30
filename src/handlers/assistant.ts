// import OpenAI from "openai";
// import { ConversationMessage } from "../types/schemas";
// import { getPdfImageUrls } from "../utils/pdf";
// const apiKey = process.env.OPENAI_API_KEY;
// const assistantId = process.env.OPENAI_ASSISTANT_ID;

// const client = new OpenAI({ apiKey: apiKey });

// export const deleteThread = async (threadId: string) => {
//   await client.beta.threads.del(threadId);
// };

// export const stageAssistantPayload = async (
//   messageContent: string,
//   thread: OpenAI.Beta.Threads.Thread & {
//     _request_id?: string | null;
//   },
//   media: string,
//   pdfImages: string[]
// ) => {
//   if (media) {
//     // add message text
//     const content: OpenAI.Beta.Threads.Messages.MessageContentPartParam[] = [];
//     if (messageContent) content.push({ type: "text", text: messageContent });

//     if (pdfImages.length > 0)
//       //add pdf pages
//       pdfImages.forEach((pageUrl) => {
//         content.push({
//           type: "image_url",
//           image_url: { url: pageUrl, detail: "auto" },
//         });
//       });
//     // add image
//     else
//       content.push({
//         type: "image_url",
//         image_url: { url: media, detail: "auto" },
//       });

//     // stage message
//     await client.beta.threads.messages.create(thread.id, {
//       content,
//       role: "user",
//     });
//   } else {
//     // stage text only message
//     await client.beta.threads.messages.create(thread.id, {
//       content: messageContent,
//       role: "user",
//     });
//   }
// };

// // if there are more than one assistant, add assistantId as param for this function
// export const runAssistant = async (threadId: string) => {
//   if (assistantId && threadId) {
//     const run = await client.beta.threads.runs.createAndPoll(threadId, {
//       assistant_id: assistantId,
//     });

//     if (run.status === "completed") {
//       const messages = await client.beta.threads.messages.list(threadId);
//       if (messages.data[0].content[0].type === "text") {
//         const latestMessage = messages.data[0].content[0].text.value;
//         return latestMessage;
//       }
//     } else {
//       console.log(`Error updating messages. Run Status: ${run.status}`);
//     }
//   }
//   return "";
// };

// export const getThread = async (threadId: string) => {
//   let thread;
//   if (threadId) {
//     thread = await client.beta.threads.retrieve(threadId);
//   } else {
//     thread = await client.beta.threads.create();
//   }
//   return thread;
// };

// export const stageMultipleMessages = async (
//   thread_id: string,
//   messages: ConversationMessage[]
// ) => {
//   messages.forEach(async (message) => {
//     if (message.media) {
//       // create a message with media
//       const mediaContent: OpenAI.Beta.Threads.Messages.MessageContentPartParam[] =
//         [];

//       // media has a caption
//       if (message.content)
//         mediaContent.push({ type: "text", text: message.content });

//       // media is a pdf
//       if (message.media.includes(".pdf")) {
//         const urlList = await getPdfImageUrls(message.media);

//         // add all pages to message
//         urlList.forEach((url) => {
//           mediaContent.push({
//             type: "image_url",
//             image_url: { url, detail: "auto" },
//           });
//         });
//       } else {
//         // media is an image
//         mediaContent.push({
//           type: "image_url",
//           image_url: { url: message.media, detail: "auto" },
//         });
//       }
//       await client.beta.threads.messages.create(thread_id, {
//         content: mediaContent,
//         role: message.author === "user" ? "user" : "assistant",
//       });
//     } else {
//       await client.beta.threads.messages.create(thread_id, {
//         content: message.content,
//         role: message.author === "user" ? "user" : "assistant",
//       });
//     }
//   });
// };
