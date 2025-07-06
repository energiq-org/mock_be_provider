import { Static } from "@sinclair/typebox";
import { getUserSuccessResponseSchema, getUserErrorResponseSchema, GetUserErrorCode } from "../schemas/getUser.js";
import config from "../../../../config/env.js";
import logger from "../../../../utils/logging.js";

export interface GetUserRequest {
    userId: string;
}

export type GetUserResponse =
    | { success: true; data: Static<typeof getUserSuccessResponseSchema> }
    | { success: false; error: { code: GetUserErrorCode; message: string } };

export async function getUser(request: GetUserRequest): Promise<GetUserResponse> {
    try {
        const response = await fetch(`${config.AUTH_SERVICE_BASE_URL}/api/v1/users/${request.userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorData = (await response.json()) as Static<typeof getUserErrorResponseSchema>;
            return {
                success: false,
                error: {
                    code: errorData.code,
                    message: errorData.message,
                },
            };
        }

        const userData = (await response.json()) as Static<typeof getUserSuccessResponseSchema>;
        return {
            success: true,
            data: userData,
        };
    } catch (error) {
        logger.error("Error fetching user data from auth service:", error);
        return {
            success: false,
            error: {
                code: GetUserErrorCode.INTERNAL_SERVER_ERROR,
                message: "Failed to communicate with auth service",
            },
        };
    }
}
