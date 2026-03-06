import express, { Request, Response } from "express";
import compression from "compression";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import healthRoutes from "./routes/health.routes";
import { createTaskValidator } from "./validators/task.validators";
import { validateRequest } from "./middleware/validateRequest";
import projectRoutes from "./routes/project.routes";
import maintenanceRoutes from "./routes/maintenance.routes";
import { logger } from "./middleware/logger";
import { apiLimiter, authLimiter } from "./middleware/rateLimit";
import { requestId } from "./middleware/requestId";
import commentRoutes from "./routes/comment.routes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
const app = express();

app.use(requestId);
app.use(logger);
app.use(compression());
app.use(express.json());
app.use(apiLimiter);

/* ================= MAIN ROUTES ================= */

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/maintenance", maintenanceRoutes);

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
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
