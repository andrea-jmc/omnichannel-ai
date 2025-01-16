import { Router } from "express";
import { IncomingMessage } from "../types/main";
import { handleIncomingMessage } from "../handlers/main";
import {
  handleAgentMessage,
  handleOutgoingMessages,
  handleTakeover,
} from "../handlers/mongo";

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
    if (messageType === "text" || messageType === "image") {
      // create user message object
      const incomingMessage: IncomingMessage = {
        chatId: req.body.entry[0].id,
        from: req.body.entry[0].changes[0].value.messages[0].from,
        messageId: req.body.entry[0].changes[0].value.messages[0].id,
        timestamp: req.body.entry[0].changes[0].value.messages[0].timestamp,
        content:
          messageType === "image"
            ? req.body.entry[0].changes[0].value.messages[0].image.caption ?? ""
            : req.body.entry[0].changes[0].value.messages[0].text.body,
        imageId:
          messageType === "image"
            ? req.body.entry[0].changes[0].value.messages[0].image.id
            : null,
      };
      await handleIncomingMessage(incomingMessage);
    }
  }
  res.send("OK");
});

router.get("/dashboard", async (_, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const result = await handleOutgoingMessages();
  res.status(200).json({ chats: result });
});

router.post("/dashboard", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  await handleAgentMessage(req.body);
  res.send("OK");
});

router.post("/takeover", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  await handleTakeover(req.body);
  res.send("OK");
});

export default router;
