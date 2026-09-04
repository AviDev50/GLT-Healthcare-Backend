import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./src/modules/auth/auth.routes.js"
import patientRoutes from "./src/modules/patients/patients.routes.js"
import vitalsRoutes from "./src/modules/vitals/vitals.routes.js"

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/vitals", vitalsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

export default app;