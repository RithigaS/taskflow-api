"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildDailyDigestEmail = exports.buildTaskAssignedEmail = exports.buildResetPasswordEmail = exports.buildWelcomeEmail = void 0;
const buildWelcomeEmail = (name, link) => {
    return {
        subject: "Welcome to TaskFlow",
        html: `<h1>Hello ${name}</h1>
           <p>Welcome to TaskFlow.</p>
           <a href="${link}">Verify Email</a>`,
    };
};
exports.buildWelcomeEmail = buildWelcomeEmail;
const buildResetPasswordEmail = (name, link) => {
    return {
        subject: "Reset your password",
        html: `<p>Hello ${name}</p>
           <p>Reset your password here:</p>
           <a href="${link}">Reset Password</a>`,
    };
};
exports.buildResetPasswordEmail = buildResetPasswordEmail;
const buildTaskAssignedEmail = (taskName) => {
    return {
        subject: "New Task Assigned",
        html: `<p>You have been assigned to: <b>${taskName}</b></p>`,
    };
};
exports.buildTaskAssignedEmail = buildTaskAssignedEmail;
const buildDailyDigestEmail = (tasks) => {
    const list = tasks.map((t) => `<li>${t.title}</li>`).join("");
    return {
        subject: "Daily Overdue Tasks",
        html: `<h3>Overdue Tasks</h3><ul>${list}</ul>`,
    };
};
exports.buildDailyDigestEmail = buildDailyDigestEmail;
