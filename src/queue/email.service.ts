import * as nodemailer from 'nodemailer';
import { config } from 'dotenv';

// Load environment variables
config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export interface SendEmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(options: SendEmailOptions): Promise<void> {
  const mailOptions = {
    from: `"${process.env.GMAIL_FROM_NAME || 'My App'}" <${process.env.GMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('📧 Email sent:', info.messageId);
}

export async function sendWelcomeEmail(
  email: string,
  name: string,
): Promise<void> {
  await sendEmail({
    to: email,
    subject: 'Welcome to Our App!',
    html: `
      <h1>Welcome, ${name}!</h1>
      <p>Thank you for registering with us.</p>
      <p>We're excited to have you on board!</p>
    `,
    text: `Welcome, ${name}! Thank you for registering with us.`,
  });
}
