"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const commentSchema = new mongoose_1.default.Schema({
    content: {
        type: String,
        required: true,
        trim: true,
    },
    task: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Task",
        required: true,
    },
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    parent: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Comment",
        default: null,
    },
}, { timestamps: true });
exports.Comment = mongoose_1.default.models.Comment || mongoose_1.default.model("Comment", commentSchema);
