"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOverdueTasks = void 0;
const Task_1 = require("../models/Task");
const getOverdueTasks = async () => {
    const now = new Date();
    const tasks = await Task_1.Task.find({
        dueDate: { $lt: now },
        status: { $ne: "done" },
    });
    return tasks;
};
exports.getOverdueTasks = getOverdueTasks;
