"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMailer = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
let transporter;
const getMailer = () => {
    if (!transporter) {
        if (process.env.NODE_ENV === "test") {
            transporter = nodemailer_1.default.createTransport({
                jsonTransport: true,
            });
        }
        else {
            transporter = nodemailer_1.default.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                auth: {
                    user: "test",
                    pass: "test",
                },
            });
        }
    }
    return transporter;
};
exports.getMailer = getMailer;
