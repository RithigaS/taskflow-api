import express, { Request, Response } from "express";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import healthRoutes from "./routes/health.routes";
import { createTaskValidator } from "./validators/task.validators";
import { validateRequest } from "./middleware/validateRequest";

const app = express();

app.use(express.json());

/* ================= MAIN ROUTES ================= */

// MUST match test paths exactly
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/health", healthRoutes);

/* ================= TEST ROUTE FOR VALIDATOR ================= */

app.post(
  "/test",
  createTaskValidator,
  validateRequest,
  (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      body: req.body,
    });
  },
);

export default app;
