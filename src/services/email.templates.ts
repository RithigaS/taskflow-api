export const buildWelcomeEmail = (name: string, link: string) => {
  return {
    subject: "Welcome to TaskFlow",
    html: `<h1>Hello ${name}</h1>
           <p>Welcome to TaskFlow.</p>
           <a href="${link}">Verify Email</a>`,
  };
};

export const buildResetPasswordEmail = (name: string, link: string) => {
  return {
    subject: "Reset your password",
    html: `<p>Hello ${name}</p>
           <p>Reset your password here:</p>
           <a href="${link}">Reset Password</a>`,
  };
};

export const buildTaskAssignedEmail = (taskName: string) => {
  return {
    subject: "New Task Assigned",
    html: `<p>You have been assigned to: <b>${taskName}</b></p>`,
  };
};

export const buildDailyDigestEmail = (tasks: any[]) => {
  const list = tasks.map((t) => `<li>${t.title}</li>`).join("");

  return {
    subject: "Daily Overdue Tasks",
    html: `<h3>Overdue Tasks</h3><ul>${list}</ul>`,
  };
};
