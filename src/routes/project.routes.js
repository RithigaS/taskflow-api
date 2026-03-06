"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pdf_service_1 = require("../services/pdf.service");
const csv_service_1 = require("../services/csv.service");
const project_controller_1 = require("../controllers/project.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
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
router.post("/", auth_middleware_1.isAuth, project_controller_1.createProject);
/* PDF REPORT */
router.get("/:id/report", async (req, res) => {
    const buffer = await (0, pdf_service_1.generateProjectReport)(req.params.id);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=report.pdf");
    res.send(buffer);
});
/* CSV EXPORT */
router.get("/:id/export", async (req, res) => {
    if (req.query.format === "csv") {
        const csv = await (0, csv_service_1.generateCSV)(req.params.id);
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=tasks.csv");
        res.send(csv);
    }
});
exports.default = router;
