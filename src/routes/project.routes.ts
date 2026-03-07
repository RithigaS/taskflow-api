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

/**
 * @swagger
 * /api/projects/{id}/report:
 *   get:
 *     summary: Download project report as PDF
 *     description: Generates and downloads a PDF report for the given project ID.
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Project ID
 *         schema:
 *           type: string
 *           example: 67c123abc456def789000111
 *     responses:
 *       200:
 *         description: PDF report downloaded successfully
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Project not found
 *       500:
 *         description: Failed to generate PDF report
 */
router.get("/:id/report", async (req, res) => {
  const buffer = await generateProjectReport(req.params.id);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=report.pdf");

  res.send(buffer);
});

/* CSV EXPORT */

/**
 * @swagger
 * /api/projects/{id}/export:
 *   get:
 *     summary: Export project tasks as CSV
 *     description: Exports the tasks of a project in CSV format. Pass format=csv as a query parameter.
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Project ID
 *         schema:
 *           type: string
 *           example: 67c123abc456def789000111
 *       - in: query
 *         name: format
 *         required: true
 *         description: Export format
 *         schema:
 *           type: string
 *           enum: [csv]
 *           example: csv
 *     responses:
 *       200:
 *         description: CSV exported successfully
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Invalid export format
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Project not found
 *       500:
 *         description: Failed to export CSV
 */
router.get("/:id/export", async (req, res) => {
  if (req.query.format === "csv") {
    const csv = await generateCSV(req.params.id);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=tasks.csv");

    res.send(csv);
  }
});

export default router;
