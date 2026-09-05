import * as doctorService from "./doctors.service.js";

export async function createDoctor(req, res) {
  try {
    const doctor = await doctorService.createDoctorService(req.body);
    res.status(201).json({ success: true, message: "Doctor created", data: doctor });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function getDoctorById(req, res) {
  try {
    const doctor = await doctorService.getDoctorService(req.params.id);
    res.status(200).json({ success: true, data: doctor });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
}

export async function listDoctors(req, res) {
  try {
    const doctors = await doctorService.listDoctorsService(req.query);
    res.status(200).json({ success: true, data: doctors });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function updateDoctor(req, res) {
  try {
    const doctor = await doctorService.updateDoctorService(req.params.id, req.body);
    res.status(200).json({ success: true, message: "Doctor updated", data: doctor });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function resetDoctorPassword(req, res) {
  try {
    const result = await doctorService.resetDoctorPasswordService(req.params.id, req.body.password);
    res.status(200).json({ success: true, message: "Password reset", data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function setDoctorStatus(req, res) {
  try {
    const result = await doctorService.setDoctorStatusService(req.params.id, req.body.status);
    res.status(200).json({ success: true, message: "Status updated", data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function deleteDoctor(req, res) {
  try {
    const result = await doctorService.deleteDoctorService(req.params.id);
    res.status(200).json({ success: true, message: "Doctor deleted", data: result });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
}