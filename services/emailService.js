import nodemailer from "nodemailer";
import pug from "pug";
import { convert } from "html-to-text";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

export class Email {
  constructor(user, options = {}) {
    this.name = user.name;
    this.to = user.email;
    this.url = options.url || null;
    this.resetCode = user.resetPasswordCode;
    this.from = process.env.META_USER;
  }

  _initTransporter() {
    const transportConfig = {
      host: process.env.META_HOST,
      port: process.env.META_PORT,
      secure: true,
      auth: {
        user: process.env.META_USER,
        pass: process.env.META_PASS,
      },
    };

    return nodemailer.createTransport(transportConfig);
  }

  async _send(template, subject) {
    const html = pug.renderFile(
      path.join(process.cwd(), "views", "email", `${template}.pug`),
      {
        name: this.name,
        url: this.url,
        resetCode: this.resetCode,
        subject,
      },
    );

    const emailConfig = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html),
    };

    await this._initTransporter().sendMail(emailConfig);
  }

  async sendVerification() {
    await this._send("verify", "Підтвердження акаунта");
  }

  async sendResetPasswordCode() {
    await this._send("reset-password", "Скидання пароля")
  }
}