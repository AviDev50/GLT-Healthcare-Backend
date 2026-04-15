import express from "express";
import { } from "./auth.controller.js";
import upload from "../../middlewares/upload.js";

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ message: "Auth working" });
});

export default router;