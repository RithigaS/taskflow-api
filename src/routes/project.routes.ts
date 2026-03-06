import { Router } from "express";
import { generateProjectReport } from "../services/pdf.service";
import { generateCSV } from "../services/csv.service";
import { createProject } from "../controllers/project.controller";
import { isAuth } from "../middleware/auth.middleware";

const router = Router();

/* CREATE PROJECT */
/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Project created
 */
router.post("/", isAuth, createProject);

/* PDF REPORT */
router.get("/:id/report", async (req, res) => {
  const buffer = await generateProjectReport(req.params.id);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=report.pdf");

  res.send(buffer);
});

/* CSV EXPORT */
router.get("/:id/export", async (req, res) => {
  if (req.query.format === "csv") {
    const csv = await generateCSV(req.params.id);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=tasks.csv");

    res.send(csv);
  }
});

export default router;
