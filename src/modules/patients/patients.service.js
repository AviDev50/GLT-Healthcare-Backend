import * as patientModel from "./patients.model.js";

const VALID_GENDERS = ["Male", "Female", "Other"];

function validatePatientInput(data) {
  if (!data.name || !data.name.trim()) {
    throw new Error("Patient name is required");
  }
  if (!data.mobile || !/^[0-9]{10}$/.test(data.mobile)) {
    throw new Error("Valid 10-digit mobile number is required");
  }
  if (!data.gender || !VALID_GENDERS.includes(data.gender)) {
    throw new Error("Gender must be Male, Female or Other");
  }
  if (!data.dob && !data.age) {
    throw new Error("Either DOB or age is required");
  }
}

export async function registerPatientService(data, registeredBy) {
  validatePatientInput(data);
  const patientId = await patientModel.insertPatient({
    ...data,
    registered_by: registeredBy,
  });
  return patientModel.getPatientById(patientId);
}

export async function getPatientService(patientId) {
  const patient = await patientModel.getPatientById(patientId);
  if (!patient) {
    throw new Error("Patient not found");
  }
  return patient;
}

export async function listPatientsService({ page = 1, limit = 20, search }) {
  const offset = (page - 1) * limit;
  return patientModel.getAllPatients({ limit, offset, search });
}

export async function updatePatientService(patientId, data) {
  validatePatientInput(data);
  const existing = await patientModel.getPatientById(patientId);
  if (!existing) {
    throw new Error("Patient not found");
  }
  await patientModel.updatePatientById(patientId, data);
  return patientModel.getPatientById(patientId);
}

export async function deletePatientService(patientId) {
  const existing = await patientModel.getPatientById(patientId);
  if (!existing) {
    throw new Error("Patient not found");
  }
  await patientModel.softDeletePatient(patientId);
  return { patient_id: patientId };
}