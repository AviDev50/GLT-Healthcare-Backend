import * as consultationService from "./consultations.service.js";
import { getUserId } from "../../utils/getUserId.js";

export async function scheduleConsultation(req, res) {
  try {
    const createdBy = getUserId(req);
    const consultation = await consultationService.scheduleConsultationService(req.body, createdBy);
    res.status(201).json({ success: true, message: "Consultation scheduled", data: consultation });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function getConsultation(req, res) {
  try {
    const consultation = await consultationService.getConsultationService(req.params.id, req.user);
    res.status(200).json({ success: true, data: consultation });
  } catch (error) {
    res.status(error.message.includes("not found") ? 404 : 403).json({ success: false, message: error.message });
  }
}

export async function listConsultations(req, res) {
  try {
    const consultations = await consultationService.listConsultationsService(req.query, req.user);
    res.status(200).json({ success: true, data: consultations });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function updateSchedule(req, res) {
  try {
    const consultation = await consultationService.updateScheduleService(req.params.id, req.body, req.user);
    res.status(200).json({ success: true, message: "Consultation rescheduled", data: consultation });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function submitClinicalDetails(req, res) {
  try {
    const consultation = await consultationService.submitClinicalDetailsService(req.params.id, req.body, req.user);
    res.status(200).json({ success: true, message: "Consultation completed", data: consultation });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function cancelConsultation(req, res) {
  try {
    const result = await consultationService.cancelConsultationService(req.params.id);
    res.status(200).json({ success: true, message: "Consultation cancelled", data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}