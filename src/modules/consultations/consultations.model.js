import db from "../../config/db.js";

export async function getDoctorForValidation(doctorId) {
  const [rows] = await db.query(
    `SELECT doctor_id, name, status FROM doctors 
     WHERE doctor_id = ? AND deleted_at IS NULL LIMIT 1`,
    [doctorId]
  );
  return rows[0];
}

export async function insertConsultation(data) {
  const [result] = await db.query(
    `INSERT INTO consultations
       (patient_id, doctor_id, created_by, consultation_date, consultation_time,
        consultation_type, meet_link, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'Scheduled')`,
    [
      data.patient_id,
      data.doctor_id,
      data.created_by,
      data.consultation_date,
      data.consultation_time,
      data.consultation_type || "Online",
      data.meet_link || null,
    ]
  );
  return result.insertId;
}

export async function getConsultationById(consultationId) {
  const [rows] = await db.query(
    `SELECT * FROM consultations WHERE consultation_id = ? AND deleted_at IS NULL LIMIT 1`,
    [consultationId]
  );
  return rows[0];
}

export async function getConsultations({ doctor_id, patient_id, status, date, limit, offset }) {
  let query = `SELECT * FROM consultations WHERE deleted_at IS NULL`;
  const params = [];

  if (doctor_id) {
    query += ` AND doctor_id = ?`;
    params.push(doctor_id);
  }
  if (patient_id) {
    query += ` AND patient_id = ?`;
    params.push(patient_id);
  }
  if (status) {
    query += ` AND status = ?`;
    params.push(status);
  }
  if (date) {
    query += ` AND consultation_date = ?`;
    params.push(date);
  }

  query += ` ORDER BY consultation_date DESC, consultation_time DESC LIMIT ? OFFSET ?`;
  params.push(Number(limit), Number(offset));

  const [rows] = await db.query(query, params);
  return rows;
}

export async function updateSchedule(consultationId, data) {
  const [result] = await db.query(
    `UPDATE consultations SET
       doctor_id = ?, consultation_date = ?, consultation_time = ?,
       consultation_type = ?, meet_link = ?
     WHERE consultation_id = ? AND deleted_at IS NULL AND status = 'Scheduled'`,
    [
      data.doctor_id,
      data.consultation_date,
      data.consultation_time,
      data.consultation_type || "Online",
      data.meet_link || null,
      consultationId,
    ]
  );
  return result.affectedRows;
}

export async function updateClinicalDetails(consultationId, data) {
  const [result] = await db.query(
    `UPDATE consultations SET
       chief_complaint = ?, medical_history = ?, examination_notes = ?,
       diagnosis = ?, consultation_notes = ?, advice = ?,
       follow_up_recommendation = ?, status = 'Completed'
     WHERE consultation_id = ? AND deleted_at IS NULL AND status = 'Scheduled'`,
    [
      data.chief_complaint || null,
      data.medical_history || null,
      data.examination_notes || null,
      data.diagnosis || null,
      data.consultation_notes || null,
      data.advice || null,
      data.follow_up_recommendation || null,
      consultationId,
    ]
  );
  return result.affectedRows;
}

export async function updateStatus(consultationId, status) {
  const [result] = await db.query(
    `UPDATE consultations SET status = ?
     WHERE consultation_id = ? AND deleted_at IS NULL`,
    [status, consultationId]
  );
  return result.affectedRows;
}

export async function softDeleteConsultation(consultationId) {
  const [result] = await db.query(
    `UPDATE consultations SET deleted_at = NOW()
     WHERE consultation_id = ? AND deleted_at IS NULL`,
    [consultationId]
  );
  return result.affectedRows;
}

// Access-control helper — vitals module (aur aage prescriptions) isi ko use karenge
export async function isDoctorAssignedToPatient(doctorId, patientId) {
  const [rows] = await db.query(
    `SELECT consultation_id FROM consultations
     WHERE doctor_id = ? AND patient_id = ? AND deleted_at IS NULL LIMIT 1`,
    [doctorId, patientId]
  );
  return rows.length > 0;
}