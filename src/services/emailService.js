import nodemailer from "nodemailer";
import pug from "pug";
import { convert } from "html-to-text";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class Email {
  constructor(user, options = {}) {
    this.name = user.name ?? "Користувач";
    this.to = user.email;
    this.url = options.url ?? null;
    this.resetCode = user.resetPasswordCode ?? null;
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
      path.join(__dirname, "../views/email", `${template}.pug`),
      {
        name: this.name,
        url: this.url,
        resetCode: this.resetCode,
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

  async sendUserFeedback(feedback) {
    const html = pug.renderFile(
      path.join(__dirname, "../views/email", "user-feedback.pug"),
      {
        feedback,
        email: this.to,
      }
    );

    const emailConfig = {
      from: this.from,
      to: this.from,
      subject: "Новий запит від користувача",
      html,
      text: convert(html),
    };

    await this._initTransporter().sendMail(emailConfig);
  }

  async sendSupportReply() {
    await this._send("support-reply", "Дякуємо за ваш зворотній зв'язок")
  }
}