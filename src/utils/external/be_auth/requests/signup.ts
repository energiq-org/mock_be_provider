import { Static } from "@sinclair/typebox";
import {
    signupSchema,
    signupSuccessResponseSchema,
    signupErrorResponseSchema,
    SignupErrorCode,
} from "../schemas/signup.js";
import config from "../../../../config/env.js";
import logger from "../../../../utils/logging.js";

export type SignupRequest = Static<typeof signupSchema>;

export type SignupResponse =
    | { success: true; data: Static<typeof signupSuccessResponseSchema> }
    | { success: false; error: { code: SignupErrorCode; message: string } };

export async function signup(request: SignupRequest): Promise<SignupResponse> {
    try {
        const response = await fetch(`${config.AUTH_SERVICE_BASE_URL}/api/v1/users/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
        });

        console.log(response);

        if (!response.ok) {
            const errorData = (await response.json()) as Static<typeof signupErrorResponseSchema>;
            return {
                success: false,
                error: {
                    code: errorData.code,
                    message: errorData.message,
                },
            };
        }

        const successData = (await response.json()) as Static<typeof signupSuccessResponseSchema>;
        return {
            success: true,
            data: successData,
        };
    } catch (error) {
        logger.error("Error during signup request to auth service:", error);
        return {
            success: false,
            error: {
                code: SignupErrorCode.INTERNAL_SERVER_ERROR,
                message: "Failed to communicate with auth service",
            },
        };
    }
}
