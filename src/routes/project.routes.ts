import { Router } from "express";
import { generateProjectReport } from "../services/pdf.service";
import { generateCSV } from "../services/csv.service";

const router = Router();

router.get("/:id/report", async (req, res) => {
  const buffer = await generateProjectReport(req.params.id);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=report.pdf");

  res.send(buffer);
});

router.get("/:id/export", async (req, res) => {
  if (req.query.format === "csv") {
    const csv = await generateCSV(req.params.id);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=tasks.csv");

    res.send(csv);
  }
});

export default router;
