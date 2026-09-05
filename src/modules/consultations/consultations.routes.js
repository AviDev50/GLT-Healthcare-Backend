import express from "express";
import * as consultationController from "./consultations.controller.js";
import { verifyToken, requireRole } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.use(verifyToken);

router.post("/", requireRole("admin"), consultationController.scheduleConsultation);
router.get("/", requireRole("admin", "doctor"), consultationController.listConsultations);
router.get("/:id", requireRole("admin", "doctor"), consultationController.getConsultation);
router.put("/:id/schedule", requireRole("admin"), consultationController.updateSchedule);
router.put("/:id/clinical", requireRole("doctor"), consultationController.submitClinicalDetails);
router.put("/:id/cancel", requireRole("admin"), consultationController.cancelConsultation);

export default router;