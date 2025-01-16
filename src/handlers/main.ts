import { IncomingMessage } from "../types/main";
import { parseFinalMessage } from "../utils/assistant";
import { sendWhatsappMessage } from "../utils/whatsapp";
import { stageAssistantPayload, getThread, runAssistant } from "./assistant";
import { downloadMedia, getImageUrl } from "./axios";
import {
  getLatestStagedMessage,
  saveAssistantMessage,
  saveMessage,
  saveUser,
  updateThreadId,
} from "./mongo";

export const handleIncomingMessage = async (userMessage: IncomingMessage) => {
  let image;
  if (userMessage.imageId) {
    image = await handleImage(userMessage.imageId);
  }
  // save or create conversation
  const { takeover, threadId } = await saveMessage(userMessage, image);

  // if (!takeover) {
  //   // get or create thread. if new thread, update conversation to have thread_id
  //   const thread = await getThread(threadId);
  //   if (!threadId) await updateThreadId(userMessage.from, thread.id);

  //   // generate message to assistant, version 2: generate array of messages since takeover.
  //   await stageAssistantPayload(userMessage.content, thread);

  //   setTimeout(async () => {
  //     // check if latest message
  //     const latestMessage = await getLatestStagedMessage(userMessage.from);

  //     if (
  //       latestMessage.timestamp === userMessage.timestamp &&
  //       latestMessage.content === userMessage.content
  //     ) {
  //       // run assistant
  //       const assistantResponse = await runAssistant(thread.id);

  //       // check if final message and save data
  //       const finalData = parseFinalMessage(assistantResponse);
  //       if (finalData) {
  //         await saveUser(finalData);
  //       }

  //       // reply to user and save message
  //       await Promise.all([
  //         saveAssistantMessage(userMessage.from, assistantResponse, false),
  //         sendWhatsappMessage(assistantResponse, userMessage.from),
  //       ]);
  //     }
  //   }, 8000);
  // }
};

export const handleImage = async (imageId: string) => {
  const imageUrl = await getImageUrl(imageId);
  const imageObject = await downloadMedia(imageUrl);
  return imageObject;
};
