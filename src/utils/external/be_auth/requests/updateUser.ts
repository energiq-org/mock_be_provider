import { Static } from "@sinclair/typebox";
import {
    updateUserSchema,
    updateUserSuccessResponseSchema,
    updateUserErrorResponseSchema,
    UpdateUserErrorCode,
} from "../schemas/updateUser.js";
import config from "../../../../config/env.js";
import logger from "../../../../utils/logging.js";

export type UpdateUserRequest = Static<typeof updateUserSchema> & {
    userId: string;
};

export type UpdateUserResponse =
    | { success: true; data: Static<typeof updateUserSuccessResponseSchema> }
    | { success: false; error: { code: UpdateUserErrorCode; message: string } };

export async function updateUser(request: UpdateUserRequest): Promise<UpdateUserResponse> {
    try {
        const { userId, ...updateData } = request;

        const response = await fetch(`${config.AUTH_SERVICE_BASE_URL}/api/v1/users/${userId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updateData),
        });

        if (!response.ok) {
            const errorData = (await response.json()) as Static<typeof updateUserErrorResponseSchema>;
            return {
                success: false,
                error: {
                    code: errorData.code,
                    message: errorData.message,
                },
            };
        }

        const successData = (await response.json()) as Static<typeof updateUserSuccessResponseSchema>;
        return {
            success: true,
            data: successData,
        };
    } catch (error) {
        logger.error("Error during update user request to auth service:", error);
        return {
            success: false,
            error: {
                code: UpdateUserErrorCode.INTERNAL_SERVER_ERROR,
                message: "Failed to communicate with auth service",
            },
        };
    }
}
