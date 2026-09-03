import * as authService from "./auth.service.js";

export async function login(req, res) {
  try {
    const { email, password, role } = req.body;

    const result = await authService.loginService(
      email,
      password,
      role
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
}