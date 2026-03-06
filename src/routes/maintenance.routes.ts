import { Router } from "express";
import { getOverdueTasks } from "../services/digest.service";

const router = Router();

router.post("/digest", async (req, res) => {
  const tasks = await getOverdueTasks();

  res.json({
    success: true,
    overdue: tasks.length,
  });
});

export default router;
