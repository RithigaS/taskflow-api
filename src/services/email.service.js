"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mail_1 = require("../config/mail");
const email_templates_1 = require("./email.templates");
class EmailService {
    async sendWelcomeEmail(email, name, token) {
        const { subject, html } = (0, email_templates_1.buildWelcomeEmail)(name, `http://localhost:3000/verify?token=${token}`);
        return (0, mail_1.getMailer)().sendMail({
            to: email,
            subject,
            html,
        });
    }
    async sendResetEmail(email, name, token) {
        const { subject, html } = (0, email_templates_1.buildResetPasswordEmail)(name, `http://localhost:3000/reset?token=${token}`);
        return (0, mail_1.getMailer)().sendMail({
            to: email,
            subject,
            html,
        });
    }
    async sendTaskAssigned(email, taskName) {
        const { subject, html } = (0, email_templates_1.buildTaskAssignedEmail)(taskName);
        return (0, mail_1.getMailer)().sendMail({
            to: email,
            subject,
            html,
        });
    }
    async sendDailyDigest(email, tasks) {
        const { subject, html } = (0, email_templates_1.buildDailyDigestEmail)(tasks);
        return (0, mail_1.getMailer)().sendMail({
            to: email,
            subject,
            html,
        });
    }
}
exports.default = new EmailService();
