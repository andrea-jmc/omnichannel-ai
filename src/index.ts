import dotenv from "dotenv";

dotenv.config();

import express from "express";
import cors from "cors";
import mainRouter from "./routes/main";
import dashboardRouter from "./routes/dashboard";
import bodyParser from "body-parser";
import { startMongoClient, stopMongoClient } from "./utils/mongodb";

const app = express();
const PORT = 3000;

app.use(cors());
app.use("/webhooks", bodyParser.json(), mainRouter);
app.use("/dashboard", bodyParser.json(), dashboardRouter);

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
