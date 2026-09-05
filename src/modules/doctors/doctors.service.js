import bcrypt from "bcryptjs";
import * as doctorModel from "./doctors.model.js";

function validateDoctorInput(data, { isCreate }) {
  if (!data.name || !data.name.trim()) {
    throw new Error("Doctor name is required");
  }
  if (isCreate) {
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      throw new Error("Valid email is required");
    }
    if (!data.password || data.password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }
  }
  if (data.mobile && !/^[0-9]{10}$/.test(data.mobile)) {
    throw new Error("Mobile must be a valid 10-digit number");
  }
}

export async function createDoctorService(data) {
  validateDoctorInput(data, { isCreate: true });

  const existing = await doctorModel.getDoctorByEmailRaw(data.email);
  if (existing) {
    throw new Error("A doctor with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const doctorId = await doctorModel.insertDoctor({ ...data, password: hashedPassword });
  return doctorModel.getDoctorById(doctorId);
}

export async function getDoctorService(doctorId) {
  const doctor = await doctorModel.getDoctorById(doctorId);
  if (!doctor) throw new Error("Doctor not found");
  return doctor;
}

export async function listDoctorsService({ page = 1, limit = 20, search, specialization }) {
  const offset = (page - 1) * limit;
  return doctorModel.getAllDoctors({ limit, offset, search, specialization });
}

export async function updateDoctorService(doctorId, data) {
  validateDoctorInput(data, { isCreate: false });
  const existing = await doctorModel.getDoctorById(doctorId);
  if (!existing) throw new Error("Doctor not found");

  await doctorModel.updateDoctorById(doctorId, data);
  return doctorModel.getDoctorById(doctorId);
}

export async function resetDoctorPasswordService(doctorId, newPassword) {
  if (!newPassword || newPassword.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }
  const existing = await doctorModel.getDoctorById(doctorId);
  if (!existing) throw new Error("Doctor not found");

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await doctorModel.updateDoctorPassword(doctorId, hashedPassword);
  return { doctor_id: doctorId };
}

export async function setDoctorStatusService(doctorId, status) {
  if (!["Active", "Inactive"].includes(status)) {
    throw new Error("Status must be Active or Inactive");
  }
  const existing = await doctorModel.getDoctorById(doctorId);
  if (!existing) throw new Error("Doctor not found");

  await doctorModel.updateDoctorStatus(doctorId, status);
  return { doctor_id: doctorId, status };
}

export async function deleteDoctorService(doctorId) {
  const existing = await doctorModel.getDoctorById(doctorId);
  if (!existing) throw new Error("Doctor not found");

  await doctorModel.softDeleteDoctor(doctorId);
  return { doctor_id: doctorId };
}