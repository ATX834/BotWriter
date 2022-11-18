import nodemailer from "nodemailer";
import { MailType } from "../types/EmailType";

export default async function sendMail(mail: MailType) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.AUTH_MAIL,
      pass: process.env.AUTH_MAIL_PASS,
    },
  });
  await transporter.sendMail(mail);
}
