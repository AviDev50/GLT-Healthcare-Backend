import * as patientModel from "./patients.model.js";
import { isDoctorAssignedToPatient } from "../consultations/consultations.model.js";

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

// getPatientService — ab requester leta hai, ownership check karta hai
export async function getPatientService(patientId, requester) {
  const patient = await patientModel.getPatientById(patientId);
  if (!patient) {
    throw new Error("Patient not found");
  }

  if (requester.role === "doctor") {
    const assigned = await isDoctorAssignedToPatient(requester.doctor_id, patientId);
    if (!assigned) {
      throw new Error("You are not assigned to this patient");
    }
  }

  return patient;
}

// naya — sirf doctor ke apne patients
export async function listMyPatientsService(requester, { page = 1, limit = 20 }) {
  const offset = (page - 1) * limit;
  return patientModel.getPatientsAssignedToDoctor(requester.doctor_id, { limit, offset });
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