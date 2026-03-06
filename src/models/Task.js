"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = exports.TaskStatus = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["TODO"] = "todo";
    TaskStatus["IN_PROGRESS"] = "in-progress";
    TaskStatus["DONE"] = "done";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
const AttachmentSchema = new mongoose_1.default.Schema({
    filename: String,
    path: String,
    size: Number,
    mimetype: String,
});
const TaskSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: {
        type: String,
        enum: Object.values(TaskStatus),
        default: TaskStatus.TODO,
    },
    priority: { type: String },
    assignedTo: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    project: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Project" },
    deletedAt: { type: Date, default: null },
    attachments: [AttachmentSchema], // ✅ ADD THIS
    dueDate: { type: Date },
}, { timestamps: true });
exports.Task = mongoose_1.default.models.Task || mongoose_1.default.model("Task", TaskSchema);
