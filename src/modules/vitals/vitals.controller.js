import * as vitalsService from "./vitals.service.js";
import { getUserId } from "../../utils/getUserId.js";

export async function recordVitals(req, res) {
  try {
    const recordedBy = getUserId(req);
    const vitals = await vitalsService.recordVitalsService(req.body, recordedBy);
    res.status(201).json({ success: true, message: "Vitals recorded", data: vitals });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function getVitalsById(req, res) {
  try {
    const vitals = await vitalsService.getVitalsService(req.params.id);
    res.status(200).json({ success: true, data: vitals });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
}

export async function getPatientVitals(req, res) {
  try {
    const vitals = await vitalsService.getPatientVitalsService(req.params.patientId);
    res.status(200).json({ success: true, data: vitals });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
}

export async function getConsultationVitals(req, res) {
  try {
    const vitals = await vitalsService.getConsultationVitalsService(req.params.consultationId);
    res.status(200).json({ success: true, data: vitals });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function updateVitals(req, res) {
  try {
    const vitals = await vitalsService.updateVitalsService(req.params.id, req.body);
    res.status(200).json({ success: true, message: "Vitals updated", data: vitals });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function deleteVitals(req, res) {
  try {
    const result = await vitalsService.deleteVitalsService(req.params.id);
    res.status(200).json({ success: true, message: "Vitals deleted", data: result });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
}