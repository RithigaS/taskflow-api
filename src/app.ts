import express from "express";
import healthRoutes from "./routes/health.routes";
import taskRoutes from "./routes/task.routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(express.json());

// ✅ VERY IMPORTANT
app.use("/api", healthRoutes);
app.use("/api/tasks", taskRoutes);

app.use(errorHandler);

export default app;
