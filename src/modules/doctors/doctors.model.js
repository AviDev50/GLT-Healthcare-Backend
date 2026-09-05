import db from "../../config/db.js";

export async function insertDoctor(data) {
  const [result] = await db.query(
    `INSERT INTO doctors (name, email, password, mobile, specialization)
     VALUES (?, ?, ?, ?, ?)`,
    [data.name, data.email, data.password, data.mobile || null, data.specialization || null]
  );
  return result.insertId;
}

export async function getDoctorByEmailRaw(email) {
  const [rows] = await db.query(
    `SELECT doctor_id FROM doctors WHERE email = ? AND deleted_at IS NULL LIMIT 1`,
    [email]
  );
  return rows[0];
}

export async function getDoctorById(doctorId) {
  const [rows] = await db.query(
    `SELECT doctor_id, name, email, mobile, specialization, status, created_at, updated_at
     FROM doctors WHERE doctor_id = ? AND deleted_at IS NULL LIMIT 1`,
    [doctorId]
  );
  return rows[0];
}

export async function getAllDoctors({ limit, offset, search, specialization }) {
  let query = `SELECT doctor_id, name, email, mobile, specialization, status, created_at
               FROM doctors WHERE deleted_at IS NULL`;
  const params = [];

  if (search) {
    query += ` AND (name LIKE ? OR email LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`);
  }
  if (specialization) {
    query += ` AND specialization = ?`;
    params.push(specialization);
  }

  query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
  params.push(Number(limit), Number(offset));

  const [rows] = await db.query(query, params);
  return rows;
}

export async function updateDoctorById(doctorId, data) {
  const [result] = await db.query(
    `UPDATE doctors SET name = ?, mobile = ?, specialization = ?
     WHERE doctor_id = ? AND deleted_at IS NULL`,
    [data.name, data.mobile || null, data.specialization || null, doctorId]
  );
  return result.affectedRows;
}

export async function updateDoctorPassword(doctorId, hashedPassword) {
  const [result] = await db.query(
    `UPDATE doctors SET password = ? WHERE doctor_id = ? AND deleted_at IS NULL`,
    [hashedPassword, doctorId]
  );
  return result.affectedRows;
}

export async function updateDoctorStatus(doctorId, status) {
  const [result] = await db.query(
    `UPDATE doctors SET status = ? WHERE doctor_id = ? AND deleted_at IS NULL`,
    [status, doctorId]
  );
  return result.affectedRows;
}

export async function softDeleteDoctor(doctorId) {
  const [result] = await db.query(
    `UPDATE doctors SET deleted_at = NOW(), status = 'Inactive'
     WHERE doctor_id = ? AND deleted_at IS NULL`,
    [doctorId]
  );
  return result.affectedRows;
}