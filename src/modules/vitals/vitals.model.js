import db from "../../config/db.js";

export async function insertVitals(data) {
  const [result] = await db.query(
    `INSERT INTO vitals
       (patient_id, consultation_id, blood_pressure, pulse_rate, temperature,
        spo2, weight, height, bmi, recorded_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.patient_id,
      data.consultation_id || null,
      data.blood_pressure || null,
      data.pulse_rate || null,
      data.temperature || null,
      data.spo2 || null,
      data.weight || null,
      data.height || null,
      data.bmi || null,
      data.recorded_by,
    ]
  );
  return result.insertId;
}

export async function getVitalsById(vitalId) {
  const [rows] = await db.query(
    `SELECT * FROM vitals WHERE vital_id = ? AND deleted_at IS NULL LIMIT 1`,
    [vitalId]
  );
  return rows[0];
}

export async function getVitalsByPatient(patientId) {
  const [rows] = await db.query(
    `SELECT * FROM vitals 
     WHERE patient_id = ? AND deleted_at IS NULL 
     ORDER BY created_at DESC`,
    [patientId]
  );
  return rows;
}

export async function getVitalsByConsultation(consultationId) {
  const [rows] = await db.query(
    `SELECT * FROM vitals 
     WHERE consultation_id = ? AND deleted_at IS NULL 
     ORDER BY created_at DESC`,
    [consultationId]
  );
  return rows;
}

export async function updateVitals(vitalId, data) {
  const [result] = await db.query(
    `UPDATE vitals SET
       blood_pressure = ?, pulse_rate = ?, temperature = ?,
       spo2 = ?, weight = ?, height = ?, bmi = ?, consultation_id = ?
     WHERE vital_id = ? AND deleted_at IS NULL`,
    [
      data.blood_pressure || null,
      data.pulse_rate || null,
      data.temperature || null,
      data.spo2 || null,
      data.weight || null,
      data.height || null,
      data.bmi || null,
      data.consultation_id || null,
      vitalId,
    ]
  );
  return result.affectedRows;
}

export async function softDeleteVitals(vitalId) {
  const [result] = await db.query(
    `UPDATE vitals SET deleted_at = NOW(), status = 'Inactive'
     WHERE vital_id = ? AND deleted_at IS NULL`,
    [vitalId]
  );
  return result.affectedRows;
}