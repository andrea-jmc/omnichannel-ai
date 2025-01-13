import dotenv from "dotenv";

dotenv.config();

import express from "express";
import mainRouter from "./routes/main";
import chatbotRouter from "./routes/chatbot";
import testingRouter from "./routes/testing";
import bodyParser from "body-parser";
import { startMongoClient, stopMongoClient } from "./utils/mongodb";

const app = express();
const PORT = 3000;

app.use("/webhooks", bodyParser.json(), mainRouter);
app.use("/chatbot", bodyParser.json(), chatbotRouter);
app.use("/testing", bodyParser.json(), testingRouter);

const server = app.listen(PORT, async () => {
  try {
    await startMongoClient();
    console.log(`Running on port ${PORT}`);
  } catch (error) {
    console.error(error);
  }
});

process.on("SIGTERM", () => {
  server.close(() => {
    stopMongoClient();
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  server.close(() => {
    stopMongoClient();
    process.exit(0);
  });
});
