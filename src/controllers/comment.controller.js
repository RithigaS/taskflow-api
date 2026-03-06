"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addComment = void 0;
const Comment_1 = require("../models/Comment");
const addComment = async (req, res) => {
    try {
        const { taskId, content } = req.body;
        const comment = await Comment_1.Comment.create({
            task: taskId,
            content,
            author: req.userId,
        });
        res.status(201).json({
            success: true,
            data: comment,
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
exports.addComment = addComment;
