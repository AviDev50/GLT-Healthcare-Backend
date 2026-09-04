import * as vitalsModel from "./vitals.model.js";
import { getPatientById } from "../patients/patients.model.js";

function calculateBMI(weight, height) {
  // weight in kg, height in cm
  if (!weight || !height) return null;
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  return Math.round(bmi * 10) / 10; // 1 decimal
}

function validateVitalsInput(data) {
  if (data.pulse_rate != null && (data.pulse_rate < 20 || data.pulse_rate > 250)) {
    throw new Error("Pulse rate seems invalid (expected 20-250 bpm)");
  }
  if (data.spo2 != null && (data.spo2 < 0 || data.spo2 > 100)) {
    throw new Error("SpO2 must be between 0 and 100");
  }
  if (data.temperature != null && (data.temperature < 90 || data.temperature > 110)) {
    throw new Error("Temperature seems invalid (expected 90-110 °F)");
  }
  if (data.weight != null && (data.weight < 1 || data.weight > 300)) {
    throw new Error("Weight seems invalid (expected 1-300 kg)");
  }
  if (data.height != null && (data.height < 30 || data.height > 250)) {
    throw new Error("Height seems invalid (expected 30-250 cm)");
  }
  if (
    data.blood_pressure &&
    !/^\d{2,3}\/\d{2,3}$/.test(data.blood_pressure)
  ) {
    throw new Error("Blood pressure must be in format e.g. 120/80");
  }
}

export async function recordVitalsService(data, recordedBy) {
  const patient = await getPatientById(data.patient_id);
  if (!patient) {
    throw new Error("Patient not found");
  }

  validateVitalsInput(data);

  const bmi = data.bmi || calculateBMI(data.weight, data.height);

  const vitalId = await vitalsModel.insertVitals({
    ...data,
    bmi,
    recorded_by: recordedBy,
  });

  return vitalsModel.getVitalsById(vitalId);
}

export async function getVitalsService(vitalId) {
  const vitals = await vitalsModel.getVitalsById(vitalId);
  if (!vitals) {
    throw new Error("Vitals record not found");
  }
  return vitals;
}

export async function getPatientVitalsService(patientId) {
  const patient = await getPatientById(patientId);
  if (!patient) {
    throw new Error("Patient not found");
  }
  return vitalsModel.getVitalsByPatient(patientId);
}

export async function getConsultationVitalsService(consultationId) {
  return vitalsModel.getVitalsByConsultation(consultationId);
}

export async function updateVitalsService(vitalId, data) {
  const existing = await vitalsModel.getVitalsById(vitalId);
  if (!existing) {
    throw new Error("Vitals record not found");
  }
  validateVitalsInput(data);
  const bmi = data.bmi || calculateBMI(data.weight, data.height);
  await vitalsModel.updateVitals(vitalId, { ...data, bmi });
  return vitalsModel.getVitalsById(vitalId);
}

export async function deleteVitalsService(vitalId) {
  const existing = await vitalsModel.getVitalsById(vitalId);
  if (!existing) {
    throw new Error("Vitals record not found");
  }
  await vitalsModel.softDeleteVitals(vitalId);
  return { vital_id: vitalId };
}