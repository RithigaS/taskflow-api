"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadAttachment = exports.uploadAttachment = exports.getAllTasks = exports.deleteTask = exports.updateTaskStatus = exports.updateTask = exports.listTasks = exports.getTasksByProject = exports.createTask = void 0;
const taskService = __importStar(require("../services/task.service"));
const fileService = __importStar(require("../services/file.service"));
const task_query_service_1 = require("../services/task.query.service");
const fs_1 = __importDefault(require("fs"));
const socket_1 = require("../socket");
const createTask = async (req, res) => {
    try {
        const task = await taskService.createTask(req.body);
        try {
            if (task.project) {
                (0, socket_1.getIO)()
                    .to(`project:${task.project.toString()}`)
                    .emit("task:created", {
                    taskId: task._id,
                    projectId: task.project,
                    title: task.title,
                    status: task.status,
                });
            }
        }
        catch { }
        return res.status(201).json({
            success: true,
            data: task,
        });
    }
    catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({
            success: false,
            message: error.message,
        });
    }
};
exports.createTask = createTask;
const getTasksByProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const tasks = await taskService.getTasksByProject(projectId);
        return res.status(200).json({
            success: true,
            data: tasks,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getTasksByProject = getTasksByProject;
const listTasks = async (req, res) => {
    const useCursor = Boolean(req.query.cursor);
    const result = useCursor
        ? await (0, task_query_service_1.getTasksCursor)(req.query)
        : await (0, task_query_service_1.getTasksOffset)(req.query);
    if (result.status === 400) {
        return res.status(400).json({
            success: false,
            message: result.error,
        });
    }
    return res.status(200).json({
        success: true,
        data: result.data,
        meta: result.meta,
    });
};
exports.listTasks = listTasks;
const updateTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const updatedTask = await taskService.updateTask(taskId, req.body);
        try {
            if (updatedTask.projectId) {
                (0, socket_1.getIO)()
                    .to(updatedTask.projectId.toString())
                    .emit("task:updated", {
                    taskId: updatedTask._id,
                    projectId: updatedTask.projectId,
                    updates: req.body,
                });
            }
        }
        catch { }
        return res.status(200).json({
            success: true,
            data: updatedTask,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.updateTask = updateTask;
const updateTaskStatus = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { status } = req.body;
        const updatedTask = await taskService.updateTaskStatus(taskId, status);
        try {
            if (updatedTask.projectId) {
                (0, socket_1.getIO)()
                    .to(updatedTask.projectId.toString())
                    .emit("task:status-changed", {
                    taskId: updatedTask._id,
                    projectId: updatedTask.projectId,
                    status: updatedTask.status,
                });
            }
        }
        catch { }
        return res.status(200).json({
            success: true,
            data: updatedTask,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.updateTaskStatus = updateTaskStatus;
const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        await taskService.softDeleteTask(taskId);
        try {
            (0, socket_1.getIO)().emit("task:updated", { taskId, deleted: true });
        }
        catch { }
        return res.status(200).json({
            success: true,
            message: "Task deleted successfully",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.deleteTask = deleteTask;
const getAllTasks = async (_req, res) => {
    try {
        const tasks = await taskService.getAllTasks();
        return res.status(200).json({
            success: true,
            data: tasks,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getAllTasks = getAllTasks;
const uploadAttachment = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }
        const task = await fileService.addAttachment(req.params.id, req.file);
        try {
            if (task.projectId) {
                (0, socket_1.getIO)()
                    .to(task.projectId.toString())
                    .emit("task:updated", {
                    taskId: task._id,
                    projectId: task.projectId,
                    attachmentAdded: true,
                });
            }
        }
        catch { }
        return res.status(200).json({
            success: true,
            data: task,
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
exports.uploadAttachment = uploadAttachment;
const downloadAttachment = async (req, res) => {
    try {
        const attachment = await fileService.getAttachment(req.params.id, req.params.attachmentId);
        if (!fs_1.default.existsSync(attachment.path)) {
            return res.status(404).json({
                message: "File not found",
            });
        }
        res.setHeader("Content-Type", attachment.mimetype);
        res.setHeader("Content-Disposition", `attachment; filename="${attachment.filename}"`);
        const stream = fs_1.default.createReadStream(attachment.path);
        stream.on("error", () => {
            return res.status(500).json({ message: "File stream error" });
        });
        stream.pipe(res);
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
};
exports.downloadAttachment = downloadAttachment;
