import {
  buildWelcomeEmail,
  buildResetPasswordEmail,
  buildTaskAssignedEmail,
} from "../../src/services/email.templates";

describe("Email templates", () => {
  it("builds welcome email", () => {
    const email = buildWelcomeEmail("Rithi", "link");

    expect(email.subject).toContain("Welcome");
    expect(email.html).toContain("Rithi");
  });

  it("builds reset email", () => {
    const email = buildResetPasswordEmail("Rithi", "token");

    expect(email.subject).toContain("Reset");
  });

  it("builds assignment email", () => {
    const email = buildTaskAssignedEmail("Test Task");

    expect(email.html).toContain("Test Task");
  });
});
