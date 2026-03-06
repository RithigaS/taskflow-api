"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const digest_service_1 = require("../services/digest.service");
const router = (0, express_1.Router)();
router.post("/digest", async (req, res) => {
    const tasks = await (0, digest_service_1.getOverdueTasks)();
    res.json({
        success: true,
        overdue: tasks.length,
    });
});
exports.default = router;
