import { Router } from "express";
import { deleteThread } from "../handlers/assistant";

const router = Router();

// delete thread
router.post("/", async (req, res) => {
  const threadId = req.body.threadId;
    await deleteThread(threadId)
  res.send("OK");
});

export default router;
