import db from "../../config/db.js";

export async function getAdminByEmail(email) {
  const [rows] = await db.query(
    `SELECT 
       admin_id,
       name,
       email,
       password,
       status
     FROM admins
     WHERE email = ?
     LIMIT 1`,
    [email]
  );

  return rows[0];
}

export async function getDoctorByEmail(email) {
  const [rows] = await db.query(
    `SELECT 
       doctor_id,
       name,
       email,
       password,
       status
     FROM doctors
     WHERE email = ?
     LIMIT 1`,
    [email]
  );

  return rows[0];
}