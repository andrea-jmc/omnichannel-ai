import { Router } from "express";
import { IncomingMessage } from "../types/main";
import { handleIncomingMessage } from "../handlers/main";

const router = Router();

// subscribe to webhooks
router.get("/", (req, res) => {
  if (
    req.query?.["hub.mode"] === "subscribe" &&
    req.query?.["hub.verify_token"] === process.env.VERIFY_TOKEN
  ) {
    res.send(req.query?.["hub.challenge"]);
  } else {
    res.status(400).json({ message: "ERROR" });
  }
});

// recieve message
router.post("/", async (req, res) => {
  // When bot replies endpoint is called with messages = undefined
  if (req.body.entry[0].changes[0].value.messages) {
    const messageType = req.body.entry[0].changes[0].value.messages[0].type;
    let mediaId = null;
    let content = "";
    switch (messageType) {
      case "image":
        mediaId = req.body.entry[0].changes[0].value.messages[0].image.id;
        content =
          req.body.entry[0].changes[0].value.messages[0].image.caption ?? "";
        break;
      case "document":
        mediaId = req.body.entry[0].changes[0].value.messages[0].document.id;
        content =
          req.body.entry[0].changes[0].value.messages[0].document.caption ?? "";
        break;
      case "text":
        content = req.body.entry[0].changes[0].value.messages[0].text.body;
        break;
      default:
    }
    // create user message object
    const incomingMessage: IncomingMessage = {
      chatId: req.body.entry[0].id,
      from: req.body.entry[0].changes[0].value.messages[0].from,
      messageId: req.body.entry[0].changes[0].value.messages[0].id,
      timestamp: req.body.entry[0].changes[0].value.messages[0].timestamp,
      content,
      mediaId,
    };
    handleIncomingMessage(incomingMessage);
  }
  res.send("OK");
});

export default router;
