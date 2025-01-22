import { IncomingMessage } from "../types/main";
import { parseFinalMessage } from "../utils/assistant";
import { uploadMedia } from "../utils/aws";
import { pdfToImgage } from "../utils/pdf-img-convert";
import { sendWhatsappMessage } from "../utils/whatsapp";
import { stageAssistantPayload, getThread, runAssistant } from "./assistant";
import { downloadMedia, getMediaUrl } from "./axios";
import {
  getLatestStagedMessage,
  saveAssistantMessage,
  saveMessage,
  saveUser,
  updateThreadId,
} from "./mongo";

export const handleIncomingMessage = async (userMessage: IncomingMessage) => {
  // check if media message
  let media = "";
  let imageArray: string[] = [];
  if (userMessage.mediaId) {
    try {
      const { url, urlArray } = await handleMedia(userMessage.mediaId);
      media = url;
      imageArray = [...urlArray];
    } catch (error) {
      console.error(error);
    }
  }
  // save or create conversation
  const { takeover, threadId } = await saveMessage(userMessage, media);

  if (!takeover) {
    // get or create thread. if new thread, update conversation to have thread_id
    const thread = await getThread(threadId);
    if (!threadId) await updateThreadId(userMessage.from, thread.id);

    // generate message to assistant, version 2: generate array of messages since takeover.
    await stageAssistantPayload(userMessage.content, thread, media, imageArray);

    setTimeout(async () => {
      // check if latest message
      const latestMessage = await getLatestStagedMessage(userMessage.from);

      if (
        latestMessage.timestamp === userMessage.timestamp &&
        latestMessage.content === userMessage.content
      ) {
        // run assistant
        const assistantResponse = await runAssistant(thread.id);

        // check if final message and save data
        const finalData = parseFinalMessage(assistantResponse);
        if (finalData) {
          await saveUser(finalData);
        }

        // reply to user and save message
        await Promise.all([
          saveAssistantMessage(userMessage.from, assistantResponse, false),
          sendWhatsappMessage(assistantResponse, userMessage.from),
        ]);
      }
    }, 8000);
  }
};

export const handleMedia = async (
  mediaId: string
): Promise<{ url: string; urlArray: string[] }> => {
  // get downloadUrl
  const { url: whatsappUrl, mime_type } = await getMediaUrl(mediaId);

  let extension = "";
  switch (mime_type) {
    case "image/jpeg":
      extension = ".jpeg";
      break;
    case "image/jpg":
      extension = ".jpg";
      break;
    case "image/png":
      extension = ".png";
      break;
    case "application/pdf":
      extension = ".pdf";
      break;
    default:
      extension = ".txt";
  }
  const imageObject = await downloadMedia(whatsappUrl);
  const urls: string[] = [];
  if (extension === "pdf") {
    // array of images
    const imageObjects = await pdfToImgage(imageObject);
    imageObjects.forEach(async (element, index) => {
      const imageUrl = await uploadMedia({
        Key: "Omnichat/" + mediaId + `-${index}` + extension,
        Body: element,
        ContentType: "image/png",
      });
      urls.push(imageUrl);
    });
  }
  const url = await uploadMedia({
    Key: "Omnichat/" + mediaId + extension,
    Body: imageObject,
    ContentType: mime_type,
  });
  return { url, urlArray: urls };
};
