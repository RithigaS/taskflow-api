"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAttachment = exports.addAttachment = void 0;
const Task_1 = require("../models/Task");
const addAttachment = async (taskId, file) => {
    const task = await Task_1.Task.findById(taskId);
    if (!task) {
        throw new Error("Task not found");
    }
    // ensure attachments array exists
    if (!task.attachments) {
        task.attachments = [];
    }
    task.attachments.push({
        filename: file.filename,
        path: file.path,
        size: file.size,
        mimetype: file.mimetype,
    });
    await task.save();
    return task;
};
exports.addAttachment = addAttachment;
const getAttachment = async (taskId, attachmentId) => {
    const task = await Task_1.Task.findById(taskId);
    if (!task) {
        throw new Error("Task not found");
    }
    if (!task.attachments) {
        throw new Error("No attachments found");
    }
    const attachment = task.attachments.id(attachmentId);
    if (!attachment) {
        throw new Error("Attachment not found");
    }
    return attachment;
};
exports.getAttachment = getAttachment;
