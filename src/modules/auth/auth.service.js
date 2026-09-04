import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as authModel from "./auth.model.js";

export async function loginService(email, password, role) {
  role = String(role || "").toLowerCase().trim();

  let user;

  if (role === "admin") {
    user = await authModel.getAdminByEmail(email);
  } else if (role === "doctor") {
    user = await authModel.getDoctorByEmail(email);
  } else {
    throw new Error("Invalid role");
  }

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (user.status !== "Active") {
    throw new Error("Account is inactive. Contact administrator.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // role ke hisaab se correct PK column pick karo
  const userId = role === "admin" ? user.admin_id : user.doctor_id;

  const tokenPayload =
    role === "admin"
      ? { admin_id: userId, role }
      : { doctor_id: userId, role };

  const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return {
    token,
    user: {
      ...(role === "admin" ? { admin_id: userId } : { doctor_id: userId }),
      name: user.name,
      email: user.email,
      role,
    },
  };
}