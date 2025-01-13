import { Router } from "express";
import { deleteThread } from "../handlers/assistant";
// import { sendMail } from "../utils/nodemailer";
import {
  addForm,
  addToArray,
  createUser,
  sendUserData,
} from "../utils/node-json-db";

const router = Router();

// delete thread
router.delete("/", async (req, res) => {
  const threadId = req.body.threadId;
  await deleteThread(threadId);
  res.send("OK");
});

router.post("/info-usuario", async (req, res) => {
  await createUser(req.body);
  res.send("OK");
});

router.post("/formulario", async (req, res) => {
  await addForm(req.body);
  res.send("OK");
});

// resultados: [],

router.post("/recetas", async (req, res) => {
  await addToArray(req.body, "recetas");
  res.send("OK");
});

router.post("/factura-farmacia", async (req, res) => {
  await addToArray(req.body, "facturasFarmacia");
  res.send("OK");
});

router.post("/facturas-lab", async (req, res) => {
  await addToArray(req.body, "facturasLab");
  res.send("OK");
});

router.post("/ordenes-lab", async (req, res) => {
  await addToArray(req.body, "ordenesLab");
  res.send("OK");
});

router.post("/recibos-consulta", async (req, res) => {
  await addToArray(req.body, "recibosConsultas");
  res.send("OK");
});

router.post("/resultados", async (req, res) => {
  await addToArray(req.body, "resultados");
  res.send("OK");
});

router.post("/commit", async (req, res) => {
  await sendUserData(req.body.id);
  res.send("OK");
});

export default router;
