import express from "express";
import * as doctorController from "./doctors.controller.js";
import { verifyToken, requireRole } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.use(verifyToken);

// list/get — admin ke saath-saath doctor bhi apni profile / colleague list dekh sakta hai (optional; abhi admin-only rakha)
router.get("/", requireRole("admin"), doctorController.listDoctors);
router.get("/:id", requireRole("admin"), doctorController.getDoctorById);

// full CRUD — admin only
router.post("/", requireRole("admin"), doctorController.createDoctor);
router.put("/:id", requireRole("admin"), doctorController.updateDoctor);
router.put("/:id/password", requireRole("admin"), doctorController.resetDoctorPassword);
router.put("/:id/status", requireRole("admin"), doctorController.setDoctorStatus);
router.delete("/:id", requireRole("admin"), doctorController.deleteDoctor);

export default router;