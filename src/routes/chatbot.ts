import { Router } from "express";
import { addDocument, saveUser } from "../utils/node-json-db";

const router = Router();

router.post("/documento", async (req, res) => {
  await addDocument(req.body);
  res.send("OK");
});

router.post("/reclamo", async (req, res) => {
  await saveUser(req.body);
  res.send("OK");
});

export default router;
