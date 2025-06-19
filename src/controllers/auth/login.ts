import bcrypt from "bcrypt";
import { Request, Response } from "express";
import config from "../../config/env.js";
import { Token } from "../../models/token.js";
import { User } from "../../models/user.js";
import { OTPType } from "../../schemas/OTP.js";
import { loginSchema } from "../../schemas/controllers/auth/auth.js";
import { sendVerificationEmail } from "../../utils/mail.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/token.js";
import { generateOTP } from "../../utils/OTP.js";
import { Static } from "@sinclair/typebox";
import { OTP } from "../../models/OTP.js";
import { AppDataSource } from "../../config/dbConnection.js";

async function loginController(req: Request<unknown, unknown, Static<typeof loginSchema>>, res: Response) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ msg: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ msg: "Invalid credentials" });
        }

        const isUserVerified = user.email_verified;
        if (!isUserVerified) {
            const verificationCode = generateOTP();
            const expires_at = new Date(new Date().setMinutes(new Date().getMinutes() + config.OTP_LIFETIME));

            const otp = OTP.create({
                user_id: user.id,
                email,
                code: verificationCode,
                expires_at,
                type: OTPType.VERIFICATION,
            });
            await otp.save();
            await sendVerificationEmail(email, verificationCode);

            return res.status(401).json({ msg: "user is not verified and verification code has been sent" });
        }

        const accessToken = generateAccessToken({ email: user.email, userId: user.id });
        const refreshToken = generateRefreshToken();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now
        await AppDataSource.manager.save(Token, {
            refresh_token: refreshToken,
            user_id: user.id,
            expires_at: expiresAt,
        });

        return res.status(200).json({
            access_token: accessToken,
            refresh_token: refreshToken,
        });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ msg: error.message });
        }
        return res.status(500).json({ msg: "An unknown error occurred" });
    }
}

export { loginController };
