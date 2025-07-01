import sgMail from "@sendgrid/mail";
import config from "../config/env.js";

sgMail.setApiKey(config.SENDGRID_API_KEY);
const logoUrl = `https://drive.google.com/uc?export=view&id=1ZD2vjgvWKmdIi43zeoQcMrxWj9N7FifC`;

async function sendVerificationEmail(email: string, code: string, name: string): Promise<void> {
    const subject = "Verify Your Email Address";
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
      <div style="text-align: left; padding-bottom: 20px;">
        <img src="${logoUrl}" alt="EnergiQ Logo" style="max-width: 150px;">
      </div>
      <div style="background-color: #ffffff; padding: 30px; border-radius: 5px;">
        <h2 style="color: #333; font-size: 24px;">Verify Your Email Address</h2>
        <p style="color: #555;">Dear ${name},</p>
        <p style="color: #555;">Thank you for registering with EnergiQ! Please use the following code to verify your email address:</p>
        <div style="background-color: #BF4E30; color: #1D1D1D; padding: 12px 20px; margin: 20px 0; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 4px; border-radius: 5px;">
          ${code}
        </div>
        <p style="color: #555;">This code will expire in 10 minutes.</p>
        <p style="color: #555;">If you didn't request this verification, please ignore this email.</p>
      </div>
      <div style="text-align: center; padding-top: 20px; color: #777; font-size: 12px;">
        <p>This Is An Automated Message, Please Do Not Reply.</p>
      </div>
    </div>
    `;
    await sgMail.send({
        from: config.EMAIL_SENDER,
        to: email,
        subject,
        html,
    });
}

async function sendResetPasswordEmail(email: string, code: string, name: string): Promise<void> {
    const subject = "Reset Your Password";

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
      <div style="text-align: left; padding-bottom: 20px;">
        <img src="${logoUrl}" alt="EnergiQ Logo" style="max-width: 150px;">
      </div>
      <div style="background-color: #ffffff; padding: 30px; border-radius: 5px;">
        <h2 style="color: #333; font-size: 24px;">Reset Your Password</h2>
        <p style="color: #555;">Dear ${name},</p>
        <p style="color: #555;">Please use the following code to reset your password:</p>
        <div style="background-color: #BF4E30; color: #1D1D1D; padding: 12px 20px; margin: 20px 0; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 4px; border-radius: 5px;">
          ${code}
        </div>
        <p style="color: #555;">This code will expire in 10 minutes.</p>
        <p style="color: #555;">If you didn't request this reset password, please ignore this email.</p>
      </div>
      <div style="text-align: center; padding-top: 20px; color: #777; font-size: 12px;">
        <p>This Is An Automated Message, Please Do Not Reply.</p>
      </div>
    </div>
  `;

    await sgMail.send({
        from: config.EMAIL_SENDER,
        to: email,
        subject,
        html,
    });
}

async function sendWelcomeEmail(email: string): Promise<void> {
    const subject = "Welcome to EnergiQ!";
    const carIconUrl = "https://drive.google.com/uc?export=view&id=1oj77rhS0Rh2W80BID-9oEZgIWogmiDP-"; // TODO: Replace with actual car icon URL
    const middlePhotoUrl = "https://drive.google.com/uc?export=view&id=160Md0rwLD9GNQJEsQOqlyooA5nANpEP3"; // TODO: Replace with actual middle photo URL

    const html = `
    <link href="https://fonts.googleapis.com/css2?family=Bungee&display=swap" rel="stylesheet" type="text/css">
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
        <div style="text-align: left; padding-bottom: 20px;">
            <img src="${logoUrl}" alt="EnergiQ Logo" style="max-width: 150px;">
        </div>
        <div style="background-color: #ffffff; padding: 30px; border-radius: 5px; text-align: center;">
            <h1 style="font-family: 'Bungee', sans-serif; color: #BF4E30; font-size: 36px; margin: 20px 0;">YOUR JOURNEY BEGINS NOW!</h1>
            <img src="${middlePhotoUrl}" alt="Electric Car" style="max-width: 100%; height: auto; margin-bottom: 20px;">
            <p style="color: #555; font-size: 16px;">Thank you for verifying your email address. Your account is now fully active!</p>
        </div>
        <div style="background-color: #f2f2f2; padding: 30px; margin-top: 20px; border-radius: 5px; text-align: center;">
            <h2 style="font-family: 'Bungee', sans-serif; color: #BF4E30; font-size: 24px; margin-bottom: 30px;">WHAT CAN YOU DO WITH ENERGIQ?</h2>
            
            <!-- Table for icon and line -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
                <tr>
                    <td style="width: 50px; text-align: right; vertical-align: middle; padding: 0;">
                        <img src="${carIconUrl}" alt="Spot" style="width: 50px; display: block;">
                    </td>
                    <td style="width: auto; vertical-align: middle; padding: 0;">
                        <hr style="border: none; border-top: 2px dashed #BF4E30; margin: 0;">
                    </td>
                </tr>
            </table>

            <!-- Table for text content -->
            <table style="width: 100%; border-collapse: collapse; text-align: left;">
                <tr>
                    <td style="width: 33.33%; padding-right: 15px; vertical-align: top;">
                        <h3 style="color: #333; font-size: 18px; margin: 0 0 10px 0;">Spot</h3>
                        <p style="color: #555; font-size: 14px; margin: 0;">Find nearby EV charging stations and navigate to them effortlessly.</p>
                    </td>
                    <td style="width: 33.33%; padding-left: 15px; padding-right: 15px; vertical-align: top;">
                        <h3 style="color: #333; font-size: 18px; margin: 0 0 10px 0;">Charge</h3>
                        <p style="color: #555; font-size: 14px; margin: 0;">Monitor your EV's charging status and optimize your power-up with ease.</p>
                    </td>
                    <td style="width: 33.33%; padding-left: 15px; vertical-align: top;">
                         <h3 style="color: #333; font-size: 18px; margin: 0 0 10px 0;">Go</h3>
                         <p style="color: #555; font-size: 14px; margin: 0;">Complete your charging payments quickly and securely with just a few taps.</p>
                    </td>
                </tr>
            </table>
        </div>
        <div style="text-align: center; margin-top: 30px;">
            <a href="https://energiq.net" style="background-color: #BF4E30; color: #ffffff; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Let's Power Your First Ride!</a>
        </div>
        <div style="text-align: center; padding-top: 30px; color: #777; font-size: 14px;">
            <p style="margin: 0 0 10px 0;">If you have any questions or need assistance, please contact our support team.</p>
            <p style="margin: 0;">We're glad to have you onboard!</p>
        </div>
        <div style="text-align: center; padding-top: 20px; color: #777; font-size: 12px;">
            <p>This Is An Automated Message From Our System.</p>
        </div>
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
