import { UUID } from "crypto";
import { Request, Response } from "express";
import config from "../../config/env.js";
import { User } from "../../models/user.js";
import { signupSchema, updateUserSchema } from "../../schemas/controllers/users/user.js";
import * as jdenticon from "jdenticon";
import { awsFolderNames, s3Handler } from "../../utils/s3.js";
import { AppDataSource } from "../../config/dbConnection.js";
import { Static } from "@sinclair/typebox";
import { signup } from "../../utils/external/be_auth/requests/signup.js";
import { updateUser, type UpdateUserResponse } from "../../utils/external/be_auth/requests/updateUser.js";
import { SignupErrorCode } from "../../utils/external/be_auth/schemas/signup.js";
import { UpdateUserErrorCode } from "../../utils/external/be_auth/schemas/updateUser.js";
import logger from "../../utils/logging.js";

async function signupController(req: Request<unknown, unknown, Static<typeof signupSchema>>, res: Response) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const { first_name, last_name, email, password } = req.body;

        const authResponse = await signup({
            first_name,
            last_name,
            email,
            password,
        });

        if (!authResponse.success) {
            if (authResponse.error.code === SignupErrorCode.EMAIL_ALREADY_EXISTS) {
                return res.status(409).json({ msg: "user with this email already exists" });
            }
            logger.error("Auth service signup failed:", authResponse.error);
            return res.status(500).json({ msg: "Failed to create user account" });
        }

        const userId = authResponse.data.userId;

        const profile_picture = jdenticon.toPng(userId, 400);
        const fileUrl = await s3Handler.uploadFile(
            config.S3_BUCKET_NAME,
            awsFolderNames.userProfile(userId),
            profile_picture
        );

        await queryRunner.manager.save(User, {
            id: userId,
            profile_picture: fileUrl,
        });

        await queryRunner.commitTransaction();

        return res.status(201).json({ msg: "user created successfully" });
    } catch (error) {
        logger.error("Signup controller error:", error);
        await queryRunner.rollbackTransaction();
        return res.status(500).json({ msg: (error as Error).message });
    } finally {
        await queryRunner.release();
    }
}

async function updateUserController(req: Request<unknown, unknown, Static<typeof updateUserSchema>>, res: Response) {
    const userId = req["userId"] as UUID;
    try {
        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ msg: "user not found" });
        }

        const localUpdateData: Partial<User> = {};
        const authUpdateData: { [key: string]: string | null } = {};

        // Separate local updates from auth service updates
        const { first_name, last_name, email, phone_number } = req.body;

        if (first_name !== undefined) authUpdateData.first_name = first_name;
        if (last_name !== undefined) authUpdateData.last_name = last_name;
        if (email !== undefined) authUpdateData.email = email;
        if (phone_number !== undefined) authUpdateData.phone_number = phone_number;

        // Handle profile picture update (local)
        if (req.file) {
            localUpdateData.profile_picture = await s3Handler.uploadFile(
                config.S3_BUCKET_NAME,
                awsFolderNames.userProfile(userId),
                req.file.buffer
            );
        }

        // Check if there's anything to update
        const hasAuthUpdates = Object.keys(authUpdateData).length > 0;
        const hasLocalUpdates = Object.keys(localUpdateData).length > 0;

        if (!hasAuthUpdates && !hasLocalUpdates) {
            return res.status(400).json({ msg: "no data to update" });
        }

        // Update auth service data if needed
        if (hasAuthUpdates) {
            const authResponse: UpdateUserResponse = await updateUser({
                userId: userId,
                ...authUpdateData,
            });

            if (!authResponse.success) {
                if (authResponse.error.code === UpdateUserErrorCode.EMAIL_ALREADY_EXISTS) {
                    return res.status(409).json({ msg: "this email is already in use" });
                }
                if (authResponse.error.code === UpdateUserErrorCode.PHONE_NUMBER_ALREADY_EXISTS) {
                    return res.status(409).json({ msg: "this phone number is already in use" });
                }
                if (authResponse.error.code === UpdateUserErrorCode.SAME_EMAIL_PROVIDED) {
                    return res.status(400).json({ msg: "new email cannot be the same as the current email" });
                }
                logger.error("Auth service update failed:", authResponse.error);
                return res.status(500).json({ msg: "Failed to update user data" });
            }
        }

        // Update local data if needed
        if (hasLocalUpdates) {
            await User.update(userId, localUpdateData);
        }

        return res.status(200).json({ msg: "user updated successfully" });
    } catch (error) {
        logger.error("Update user controller error:", error);
        return res.status(500).json({ msg: (error as Error).message });
    }
}

async function getUserController(req: Request, res: Response) {
    const userId = req["userId"] as UUID;
    const userFromToken = req["user"]; // User data from the JWT token

    try {
        // Get local user data (profile picture, vehicles)
        const localUser = await User.findOne({
            where: { id: userId },
        });

        if (!localUser) {
            return res.status(404).json({ msg: "user not found in local database" });
        }

        const vehicles = await localUser.getVehiclesTransformed();

        // Merge token user data with local user data - no need to call auth service
        const userData = {
            ...userFromToken, // User data from token (id, email, first_name, etc.)
            profile_picture: localUser.profile_picture,
            local_created_at: localUser.created_at,
            vehicles,
        };

        return res.status(200).json(userData);
    } catch (error) {
        logger.error("Get user controller error:", error);
        return res.status(500).json({ msg: (error as Error).message });
    }
}

// async function deleteUserController(req: Request, res: Response) {
//     const userId = req["userId"] as UUID;
//     try {
//         // Delete local user data
//         await User.delete(userId);

//         // TODO: Delete user from auth service
//         // This would require implementing deleteUser in the auth service client

//         return res.status(200).json({ msg: "user deleted successfully" });
//     } catch (error) {
//         return res.status(500).json({ msg: (error as Error).message });
//     }
// }

async function getUserVehiclesController(req: Request, res: Response) {
    const userId = req["userId"] as UUID;
    try {
        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ msg: "user not found" });
        }

        const vehicles = await user.getVehiclesTransformed();
        return res.status(200).json(vehicles);
    } catch (error) {
        return res.status(500).json({ msg: (error as Error).message });
    }
}

export {
    signupController,
    updateUserController,
    getUserController,
    /*deleteUserController*/ getUserVehiclesController,
};
