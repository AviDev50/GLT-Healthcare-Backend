import express from "express";
import * as patientController from "./patients.controller.js";
import { verifyToken, requireRole } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.use(verifyToken);

// admin-only: full list + create + update + delete
router.get("/", requireRole("admin"), patientController.listPatients);
router.post("/", requireRole("admin"), patientController.registerPatient);
router.put("/:id", requireRole("admin"), patientController.updatePatient);
router.delete("/:id", requireRole("admin"), patientController.deletePatient);

// doctor-only: sirf apne assigned patients
router.get("/my-patients", requireRole("doctor"), patientController.listMyPatients);

// admin + doctor dono — but service level pe ownership check hai (doctor ke liye)
router.get("/:id", requireRole("admin", "doctor"), patientController.getPatient);

export default router;