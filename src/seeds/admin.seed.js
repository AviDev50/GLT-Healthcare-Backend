import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcryptjs';
import db from "../config/db.js";

async function createAdmin() {
  try {
    const passwordHash = await bcrypt.hash(
      process.env.ADMIN_PASSWORD,
      10
    );

    await db.query(
      `INSERT INTO admins
       (name, email, password)
       VALUES (?, ?, ?)`,
      [
        process.env.ADMIN_NAME,
        process.env.ADMIN_EMAIL,
        passwordHash,
      ]
    );

    console.log("Admin created successfully");
    process.exit(0);
  } catch (error) {
    console.error("Admin creation failed:", error);
    process.exit(1);
  }
}

createAdmin();