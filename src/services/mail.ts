import sgMail from "@sendgrid/mail";
import config from "../config/env";

sgMail.setApiKey(config.SENDGRID_API_KEY);

async function sendEmail(options: { to: string; subject: string; html: string; text: string }) {
  const mailOptions = {
    from: config.EMAIL_SENDER,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  };
  await sgMail.send(mailOptions);
}

async function sendVerificationEmail(email: string, code: string): Promise<void> {
  const subject = "Verify Your Email Address";

  const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Email Verification</h2>
        <p>Thank you for registering! Please use the following code to verify your email address:</p>
        <div style="background-color: #f4f4f4; padding: 12px 20px; margin: 20px 0; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 4px;">
          ${code}
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this verification, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #777; font-size: 12px;">This is an automated message, please do not reply.</p>
      </div>
    `;

  // Plain text version as fallback
  const text = `
      Email Verification
      
      Thank you for registering! Please use the following code to verify your email address:
      
      ${code}
      
      This code will expire in 10 minutes.
      
      If you didn't request this verification, please ignore this email.
      
      This is an automated message, please do not reply.
    `;

  await sendEmail({
    to: email,
    subject,
    html,
    text,
  });
}

export { sendVerificationEmail };
