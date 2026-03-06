process.env.NODE_ENV = "test";

import emailService from "../../src/services/email.service";
import { getMailer } from "../../src/config/mail";

describe("email.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("uses mock transport in test environment", () => {
    const mailer = getMailer();

    expect(mailer).toBeDefined();
    expect(typeof mailer.sendMail).toBe("function");
  });

  it("sends welcome email with correct recipient, subject and body", async () => {
    const mailer = getMailer();
    const spy = jest.spyOn(mailer, "sendMail");

    await emailService.sendWelcomeEmail(
      "rithi@example.com",
      "Rithi",
      "verify123",
    );

    expect(spy).toHaveBeenCalledTimes(1);
    const payload = spy.mock.calls[0][0] as any;

    expect(payload.to).toBe("rithi@example.com");
    expect(payload.subject).toContain("Welcome");
    expect(payload.html).toContain("Rithi");
    expect(payload.html).toContain("verify123");
  });

  it("sends reset password email with correct recipient, subject and body", async () => {
    const mailer = getMailer();
    const spy = jest.spyOn(mailer, "sendMail");

    await emailService.sendResetEmail("rithi@example.com", "Rithi", "reset123");

    expect(spy).toHaveBeenCalledTimes(1);
    const payload = spy.mock.calls[0][0] as any;

    expect(payload.to).toBe("rithi@example.com");
    expect(payload.subject).toContain("Reset");
    expect(payload.html).toContain("Rithi");
    expect(payload.html).toContain("reset123");
  });

  it("sends task assignment email with correct recipient, subject and body", async () => {
    const mailer = getMailer();
    const spy = jest.spyOn(mailer, "sendMail");

    await emailService.sendTaskAssigned("rithi@example.com", "Finish API");

    expect(spy).toHaveBeenCalledTimes(1);
    const payload = spy.mock.calls[0][0] as any;

    expect(payload.to).toBe("rithi@example.com");
    expect(payload.subject).toContain("Assigned");
    expect(payload.html).toContain("Finish API");
  });

  it("sends daily digest email with overdue task list", async () => {
    const mailer = getMailer();
    const spy = jest.spyOn(mailer, "sendMail");

    await emailService.sendDailyDigest("rithi@example.com", [
      { title: "Overdue 1" },
      { title: "Overdue 2" },
    ]);

    expect(spy).toHaveBeenCalledTimes(1);
    const payload = spy.mock.calls[0][0] as any;

    expect(payload.to).toBe("rithi@example.com");
    expect(payload.subject).toContain("Daily");
    expect(payload.html).toContain("Overdue 1");
    expect(payload.html).toContain("Overdue 2");
  });

  it("never sends real email in test environment", async () => {
    const mailer = getMailer();
    const spy = jest.spyOn(mailer, "sendMail");

    await emailService.sendWelcomeEmail("test@example.com", "Test", "token999");

    expect(spy).toHaveBeenCalled();
    const payload = spy.mock.calls[0][0] as any;

    expect(payload.to).toBe("test@example.com");
    expect(payload.subject).toContain("Welcome");
  });
});
