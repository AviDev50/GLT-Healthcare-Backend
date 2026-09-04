import express from "express";
import * as vitalsController from "./vitals.controller.js";
import { verifyToken, requireRole } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.use(verifyToken);

// write operations — admin only (schema FK: recorded_by -> admins)
router.post("/", requireRole("admin"), vitalsController.recordVitals);
router.put("/:id", requireRole("admin"), vitalsController.updateVitals);
router.delete("/:id", requireRole("admin"), vitalsController.deleteVitals);

// read operations — admin + doctor dono (doctor ko apne patient ki vitals dikhni chahiye)
router.get("/:id", requireRole("admin", "doctor"), vitalsController.getVitalsById);
router.get("/patient/:patientId", requireRole("admin", "doctor"), vitalsController.getPatientVitals);
router.get("/consultation/:consultationId", requireRole("admin", "doctor"), vitalsController.getConsultationVitals);

export default router;