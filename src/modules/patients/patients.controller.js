import * as patientService from "./patients.service.js";
import { getUserId } from "../../utils/getUserId.js";

export async function registerPatient(req, res) {
  try {
    const registeredBy = getUserId(req);
    const patient = await patientService.registerPatientService(req.body, registeredBy);
    res.status(201).json({ success: true, message: "Patient registered", data: patient });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function getPatientById(req, res) {
  try {
    const patient = await patientService.getPatientService(req.params.id);
    res.status(200).json({ success: true, data: patient });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
}

export async function listPatients(req, res) {
  try {
    const { page, limit, search } = req.query;
    console.log(req.query)
    const patients = await patientService.listPatientsService({ page, limit, search });
    res.status(200).json({ success: true, data: patients });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function updatePatient(req, res) {
  try {
    const patient = await patientService.updatePatientService(req.params.id, req.body);
    res.status(200).json({ success: true, message: "Patient updated", data: patient });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function deletePatient(req, res) {
  try {
    const result = await patientService.deletePatientService(req.params.id);
    res.status(200).json({ success: true, message: "Patient deleted", data: result });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
}