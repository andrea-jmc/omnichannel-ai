import { Router } from "express";

const router = Router();

router.post("/formulario", async (req, res) => {
  console.log(req.body);
  res.send("OK");
});

router.post("/recibo-consulta", async (req, res) => {
  console.log(req.body);
  res.send("OK");
});

router.post("/receta", async (req, res) => {
  console.log(req.body);
  res.send("OK");
});

router.post("/factura-farmacia", async (req, res) => {
  console.log(req.body);
  res.send("OK");
});

router.post("/orden-lab", async (req, res) => {
  console.log(req.body);
  res.send("OK");
});

router.post("/factura-lab", async (req, res) => {
  console.log(req.body);
  res.send("OK");
});

router.post("/resultado", async (req, res) => {
  console.log(req.body);
  res.send("OK");
});

export default router;
