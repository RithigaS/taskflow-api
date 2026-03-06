"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCSV = void 0;
const Task_1 = require("../models/Task");
const mongoose_1 = __importDefault(require("mongoose"));
const generateCSV = async (projectId) => {
    const tasks = await Task_1.Task.find({
        project: new mongoose_1.default.Types.ObjectId(projectId),
    }).lean();
    const header = "Title,Status,Priority,CreatedAt\n";
    const rows = tasks
        .map((t) => {
        return `${t.title},${t.status},${t.priority || ""},${t.createdAt ? t.createdAt.toISOString() : ""}`;
    })
        .join("\n");
    return header + rows;
};
exports.generateCSV = generateCSV;
