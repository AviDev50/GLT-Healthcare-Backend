import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import * as authModel from "./auth.model.js";

export async function loginService(email, password, role) {
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

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role,
    },
  };
}