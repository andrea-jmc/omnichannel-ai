// import { Router } from "express";
// import {
//   handleAgentMessage,
//   handleClose,
//   handleOutgoingMessages,
//   handleTakeover,
// } from "../handlers/mongo";

// const router = Router();

// // get chats
// router.get("/", async (_, res) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   const result = await handleOutgoingMessages();
//   res.status(200).json({ chats: result });
// });

// //post chat message
// router.post("/", async (req, res) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   await handleAgentMessage(req.body);
//   res.send("OK");
// });

// // set takeover
// router.post("/takeover", async (req, res) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   await handleTakeover(req.body);
//   res.send("OK");
// });

// // close conversation
// router.post("/close", async (req, res) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   await handleClose(req.body);
//   res.send("OK");
// });

// export default router;
