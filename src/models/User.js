"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const userSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^\S+@\S+\.\S+$/,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    avatar: { type: String, default: "" },
    resetToken: String,
    resetTokenExp: Date,
}, { timestamps: true });
/**
 * Hash password before saving
 */
userSchema.pre("save", async function () {
    if (!this.isModified("password"))
        return;
    const salt = await bcryptjs_1.default.genSalt(10);
    this.password = await bcryptjs_1.default.hash(this.password, salt);
});
/**
 * Compare password
 */
userSchema.methods.comparePassword = async function (candidate) {
    const user = this;
    return bcryptjs_1.default.compare(candidate, user.password);
};
/**
 * Generate reset token
 */
userSchema.methods.generateResetToken = function () {
    const user = this;
    const token = crypto_1.default.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExp = new Date(Date.now() + 60 * 60 * 1000);
    return token;
};
exports.User = mongoose_1.default.models.User || mongoose_1.default.model("User", userSchema);
