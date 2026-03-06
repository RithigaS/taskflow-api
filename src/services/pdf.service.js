"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateProjectReport = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
const Project_1 = require("../models/Project");
const Task_1 = require("../models/Task");
const generateProjectReport = async (projectId) => {
    const project = await Project_1.Project.findById(projectId).populate("members");
    const tasks = await Task_1.Task.find({
        project: projectId,
    }).lean();
    const doc = new pdfkit_1.default();
    const buffers = [];
    doc.on("data", (chunk) => buffers.push(chunk));
    // ✅ FIXED: Added backticks
    doc.fontSize(18).text(`Project Report: ${project?.name}`);
    doc.moveDown();
    doc.text("Members:");
    project?.members.forEach((m) => {
        // ✅ FIXED: Added backticks
        doc.text(`- ${m.name}`);
    });
    doc.moveDown();
    doc.text("Task Summary:");
    Object.values(Task_1.TaskStatus).forEach((status) => {
        const count = tasks.filter((t) => t.status === status).length;
        // ✅ FIXED: Added backticks
        doc.text(`${status}: ${count}`);
    });
    const overdue = tasks.filter((t) => t.dueDate &&
        t.status !== Task_1.TaskStatus.DONE &&
        new Date(t.dueDate) < new Date());
    doc.moveDown();
    doc.text("Overdue Tasks:");
    overdue.forEach((t) => {
        // ✅ FIXED: Added backticks
        doc.text(`- ${t.title}`);
    });
    doc.end();
    return new Promise((resolve) => {
        doc.on("end", () => {
            resolve(Buffer.concat(buffers));
        });
    });
};
exports.generateProjectReport = generateProjectReport;
