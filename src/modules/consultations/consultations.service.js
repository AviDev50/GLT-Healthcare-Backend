import * as consultationModel from "./consultations.model.js";
import { getPatientById } from "../patients/patients.model.js";

function validateScheduleInput(data) {
  if (!data.patient_id) throw new Error("patient_id is required");
  if (!data.doctor_id) throw new Error("doctor_id is required");
  if (!data.consultation_date) throw new Error("consultation_date is required");
  if (!data.consultation_time) throw new Error("consultation_time is required");

  const givenDateTime = new Date(`${data.consultation_date}T${data.consultation_time}`);
  if (isNaN(givenDateTime.getTime())) {
    throw new Error("Invalid consultation_date or consultation_time");
  }
  if (givenDateTime < new Date()) {
    throw new Error("Cannot schedule a consultation in the past");
  }

  const type = data.consultation_type || "Online";

  if (type === "Online") {
    if (!data.meet_link || !data.meet_link.trim()) {
      throw new Error("Google Meet link is required for online consultations");
    }
    if (!/^https:\/\/meet\.google\.com\/[a-z-]+$/i.test(data.meet_link.trim())) {
      throw new Error("Invalid Google Meet link format");
    }
  }
}

async function assertPatientAndDoctorActive(patientId, doctorId) {
  const patient = await getPatientById(patientId);
  if (!patient) throw new Error("Patient not found");
  if (patient.status !== "Active") throw new Error("Patient is inactive");

  const doctor = await consultationModel.getDoctorForValidation(doctorId);
  if (!doctor) throw new Error("Doctor not found");
  if (doctor.status !== "Active") throw new Error("Doctor is inactive");
}

export async function scheduleConsultationService(data, createdBy) {
  validateScheduleInput(data);
  await assertPatientAndDoctorActive(data.patient_id, data.doctor_id);

  const consultationId = await consultationModel.insertConsultation({
    ...data,
    created_by: createdBy,
  });
  return consultationModel.getConsultationById(consultationId);
}

export async function getConsultationService(consultationId, requester) {
  const consultation = await consultationModel.getConsultationById(consultationId);
  if (!consultation) throw new Error("Consultation not found");

  if (requester.role === "doctor" && consultation.doctor_id !== requester.doctor_id) {
    throw new Error("You are not assigned to this consultation");
  }
  return consultation;
}

export async function listConsultationsService(filters, requester) {
  const { page = 1, limit = 20, ...rest } = filters;
  const offset = (page - 1) * limit;

  // doctor sirf apni consultations dekh sakta hai — filter force karo, chahe query mein kuch aur ho
  if (requester.role === "doctor") {
    rest.doctor_id = requester.doctor_id;
  }

  return consultationModel.getConsultations({ ...rest, limit, offset });
}

export async function updateScheduleService(consultationId, data, requester) {
  validateScheduleInput(data);
  const existing = await consultationModel.getConsultationById(consultationId);
  if (!existing) throw new Error("Consultation not found");
  if (existing.status !== "Scheduled") {
    throw new Error(`Cannot reschedule a consultation with status '${existing.status}'`);
  }

  await assertPatientAndDoctorActive(existing.patient_id, data.doctor_id);

  const affected = await consultationModel.updateSchedule(consultationId, data);
  if (!affected) throw new Error("Unable to update consultation");
  return consultationModel.getConsultationById(consultationId);
}

export async function submitClinicalDetailsService(consultationId, data, requester) {
  const existing = await consultationModel.getConsultationById(consultationId);
  if (!existing) throw new Error("Consultation not found");

  if (requester.role !== "doctor" || existing.doctor_id !== requester.doctor_id) {
    throw new Error("Only the assigned doctor can submit consultation details");
  }
  if (existing.status !== "Scheduled") {
    throw new Error(`Cannot submit details for a consultation with status '${existing.status}'`);
  }
  if (!data.diagnosis || !data.diagnosis.trim()) {
    throw new Error("Diagnosis is required to complete the consultation");
  }

  const affected = await consultationModel.updateClinicalDetails(consultationId, data);
  if (!affected) throw new Error("Unable to save consultation details");
  return consultationModel.getConsultationById(consultationId);
}

export async function cancelConsultationService(consultationId) {
  const existing = await consultationModel.getConsultationById(consultationId);
  if (!existing) throw new Error("Consultation not found");
  if (existing.status === "Completed") {
    throw new Error("Cannot cancel a completed consultation");
  }
  if (existing.status === "Cancelled") {
    throw new Error("Consultation is already cancelled");
  }

  await consultationModel.updateStatus(consultationId, "Cancelled");
  return { consultation_id: consultationId, status: "Cancelled" };
}