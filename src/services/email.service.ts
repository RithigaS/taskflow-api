import { getMailer } from "../config/mail";
import {
  buildWelcomeEmail,
  buildResetPasswordEmail,
  buildTaskAssignedEmail,
  buildDailyDigestEmail,
} from "./email.templates";

class EmailService {
  async sendWelcomeEmail(email: string, name: string, token: string) {
    const { subject, html } = buildWelcomeEmail(
      name,
      `http://localhost:3000/verify?token=${token}`,
    );

    return getMailer().sendMail({
      to: email,
      subject,
      html,
    });
  }

  async sendResetEmail(email: string, name: string, token: string) {
    const { subject, html } = buildResetPasswordEmail(
      name,
      `http://localhost:3000/reset?token=${token}`,
    );

    return getMailer().sendMail({
      to: email,
      subject,
      html,
    });
  }

  async sendTaskAssigned(email: string, taskName: string) {
    const { subject, html } = buildTaskAssignedEmail(taskName);

    return getMailer().sendMail({
      to: email,
      subject,
      html,
    });
  }

  async sendDailyDigest(email: string, tasks: any[]) {
    const { subject, html } = buildDailyDigestEmail(tasks);

    return getMailer().sendMail({
      to: email,
      subject,
      html,
    });
  }
}

export default new EmailService();
