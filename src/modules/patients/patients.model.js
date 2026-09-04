import db from "../../config/db.js";

export async function insertPatient(data) {
  const [result] = await db.query(
    `INSERT INTO patients 
       (name, mobile, dob, age, gender, address, email, emergency_contact, registered_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.name,
      data.mobile,
      data.dob || null,
      data.age || null,
      data.gender,
      data.address || null,
      data.email || null,
      data.emergency_contact || null,
      data.registered_by,
    ]
  );
  return result.insertId;
}

export async function getPatientById(patientId) {
  const [rows] = await db.query(
    `SELECT * FROM patients WHERE patient_id = ? AND deleted_at IS NULL LIMIT 1`,
    [patientId]
  );
  return rows[0];
}

export async function getAllPatients({ limit, offset, search }) {
  let query = `SELECT * FROM patients WHERE deleted_at IS NULL`;
  const params = [];

  if (search) {
    query += ` AND (name LIKE ? OR mobile LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`);
  }

  query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
  params.push(Number(limit), Number(offset));

  const [rows] = await db.query(query, params);
  return rows;
}

export async function updatePatientById(patientId, data) {
  const [result] = await db.query(
    `UPDATE patients SET
       name = ?, mobile = ?, dob = ?, age = ?, gender = ?,
       address = ?, email = ?, emergency_contact = ?
     WHERE patient_id = ? AND deleted_at IS NULL`,
    [
      data.name,
      data.mobile,
      data.dob || null,
      data.age || null,
      data.gender,
      data.address || null,
      data.email || null,
      data.emergency_contact || null,
      patientId,
    ]
  );
  return result.affectedRows;
}

export async function softDeletePatient(patientId) {
  const [result] = await db.query(
    `UPDATE patients SET deleted_at = NOW(), status = 'Inactive'
     WHERE patient_id = ? AND deleted_at IS NULL`,
    [patientId]
  );
  return result.affectedRows;
}