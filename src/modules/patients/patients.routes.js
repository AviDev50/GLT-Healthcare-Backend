import express from "express";
import * as patientController from "./patients.controller.js";
import { verifyToken, requireRole } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.use(verifyToken, requireRole("admin"));

router.post("/", patientController.registerPatient);
router.get("/", patientController.listPatients);
router.get("/:id", patientController.getPatientById);
router.put("/:id", patientController.updatePatient);
router.delete("/:id", patientController.deletePatient);

export default router;