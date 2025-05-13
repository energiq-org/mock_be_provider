import sgMail from "@sendgrid/mail";
import config from "../config/env.js";

sgMail.setApiKey(config.SENDGRID_API_KEY);

async function sendVerificationEmail(email: string, code: string): Promise<void> {
  const subject = "Verify Your Email Address";

  const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Email Verification</h2>
        <p>Thank you for registering in EnergiQ! Please use the following code to verify your email address:</p>
        <div style="background-color: #f4f4f4; padding: 12px 20px; margin: 20px 0; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 4px;">
          ${code}
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this verification, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #777; font-size: 12px;">This is an automated message, please do not reply.</p>
      </div>
    `;

  await sgMail.send({
    from: config.EMAIL_SENDER,
    to: email,
    subject,
    html,
  });
}
async function sendResetPasswordEmail(email: string, code: string): Promise<void> {
  const subject = "Reset Your Password";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Reset Password</h2>
      <p>Please use the following code to reset your password:</p>
      <div style="background-color: #f4f4f4; padding: 12px 20px; margin: 20px 0; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 4px;">
        ${code}
      </div>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't request this reset password, please ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="color: #777; font-size: 12px;">This is an automated message, please do not reply.</p>
    </div>
  `;

  await sgMail.send({
    from: config.EMAIL_SENDER,
    to: email,
    subject,
    html,
  });
}

async function sendWelcomeEmail(email: string, name: string): Promise<void> {
  const subject = "Welcome to EnergiQ!";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Welcome, ${name}!</h2>
      <p>Thank you for verifying your email address. Your account is now fully active.</p>
      <p>You can now log in and start using our services.</p>
      <div style="background-color: #f4f4f4; padding: 15px; margin: 20px 0;">
        <p>If you have any questions or need assistance, please contact our support team.</p>
      </div>
      <p>We're glad to have you onboard!</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="color: #777; font-size: 12px;">This is an automated message from our system.</p>
    </div>
  `;

  await sgMail.send({
    from: config.EMAIL_SENDER,
    to: email,
    subject,
    html,
  });
}

export { sendVerificationEmail, sendWelcomeEmail, sendResetPasswordEmail };
