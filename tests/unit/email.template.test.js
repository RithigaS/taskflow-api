"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const email_templates_1 = require("../../src/services/email.templates");
describe("Email templates", () => {
    it("builds welcome email", () => {
        const email = (0, email_templates_1.buildWelcomeEmail)("Rithi", "link");
        expect(email.subject).toContain("Welcome");
        expect(email.html).toContain("Rithi");
    });
    it("builds reset email", () => {
        const email = (0, email_templates_1.buildResetPasswordEmail)("Rithi", "token");
        expect(email.subject).toContain("Reset");
    });
    it("builds assignment email", () => {
        const email = (0, email_templates_1.buildTaskAssignedEmail)("Test Task");
        expect(email.html).toContain("Test Task");
    });
});
