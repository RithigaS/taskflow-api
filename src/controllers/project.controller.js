"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProject = void 0;
const Project_1 = require("../models/Project");
const createProject = async (req, res) => {
    try {
        const { name, description } = req.body;
        const project = await Project_1.Project.create({
            name,
            description,
            members: [req.userId],
            createdBy: req.userId,
        });
        res.status(201).json({
            success: true,
            data: project,
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
exports.createProject = createProject;
