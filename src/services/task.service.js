"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.softDeleteTask = exports.updateTaskStatus = exports.updateTask = exports.getTasksByProject = exports.createTask = exports.getAllTasks = void 0;
const Task_1 = require("../models/Task");
const getAllTasks = async () => {
    return await Task_1.Task.find({ isDeleted: false });
};
exports.getAllTasks = getAllTasks;
const createTask = async (data) => {
    return await Task_1.Task.create(data);
};
exports.createTask = createTask;
const getTasksByProject = async (projectId) => {
    return await Task_1.Task.find({
        project: projectId,
        deletedAt: null,
    })
        .populate("assignedTo project")
        .sort({ createdAt: -1 });
};
exports.getTasksByProject = getTasksByProject;
const updateTask = async (id, updates) => {
    const task = await Task_1.Task.findOne({ _id: id, deletedAt: null });
    if (!task)
        throw new Error("Task not found");
    Object.assign(task, updates);
    await task.save();
    return task;
};
exports.updateTask = updateTask;
const updateTaskStatus = async (id, status) => {
    const task = await Task_1.Task.findOne({ _id: id, deletedAt: null });
    if (!task)
        throw new Error("Task not found");
    task.status = status;
    await task.save();
    return task;
};
exports.updateTaskStatus = updateTaskStatus;
const softDeleteTask = async (id) => {
    const task = await Task_1.Task.findOne({ _id: id, deletedAt: null });
    if (!task)
        throw new Error("Task not found");
    task.deletedAt = new Date();
    await task.save();
    return task;
};
exports.softDeleteTask = softDeleteTask;
