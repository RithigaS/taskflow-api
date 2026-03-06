import nodemailer from "nodemailer";

let transporter: any;

export const getMailer = () => {
  if (!transporter) {
    if (process.env.NODE_ENV === "test") {
      transporter = nodemailer.createTransport({
        jsonTransport: true,
      });
    } else {
      transporter = nodemailer.createTransport({
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
