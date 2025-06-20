import { Request, Response } from "express";
import { UUID } from "crypto";
import localCache from "../../utils/cache/local.js";
import { User } from "../../models/user.js";
import { Paymob } from "../../utils/paymob.js";
import logger from "../../utils/logging.js";
import { Webhook } from "../../models/webhook.js";
import { Transaction } from "../../models/transaction.js";
import { Session } from "../../models/sessions.js";
import { TransactionStatus } from "../../schemas/transction.js";
import { randomUUID } from "crypto";

async function getPaymentIntentionController(req: Request, res: Response) {
    try {
        const user_id = req["userId"] as UUID;
        const { amount } = req.query as { amount: string };

        if (amount == null) {
            return res.status(400).json({
                error: "Missing required query parameters",
                required: ["amount"],
            });
        }
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            return res.status(400).json({
                error: "Invalid amount. Must be a positive number",
            });
        }

        let user = localCache.get<User>(`user_data:${user_id}`);
        if (user == null) {
            user = (await User.findOne({ where: { id: user_id } })) || undefined;
            if (user == null) {
                return res.status(404).json({ msg: "user not found" });
            }
            localCache.set(`user_data:${user_id}`, user);
        }

        const paymob = new Paymob();
        const intention_url = await paymob.createPaymentIntention(numericAmount, user);

        return res.status(200).json({ intention_url });
    } catch (error: unknown) {
        if (error instanceof Error && error.message == "PAYMOB_ERROR") {
            logger.error({
                type: "PAYMOB_ERROR",
                error: error.cause,
                stack: error.stack,
            });
        }
        logger.error("Error creating payment intention:", error);
        return res.status(500).json({
            error: "Failed to create payment intention",
            msg: "Internal server error",
        });
    }
}

interface PaymobWebhookPayload {
    type: string;
    obj: {
        id: number;
        success: boolean;
        amount_cents: number;
        currency: string;
        order: {
            id: number;
            merchant_order_id: string | null;
            amount_cents: number;
            paid_amount_cents: number;
            payment_status: string;
        };
        payment_key_claims: {
            user_id: number;
            amount_cents: number;
            currency: string;
            order_id: number;
            billing_data: {
                first_name: string;
                last_name: string;
                email: string;
                phone_number: string;
            };
            integration_id: number;
        };
        created_at: string;
        is_live: boolean;
    };
}

async function processWebhookController(req: Request, res: Response) {
    try {
        const webhookPayload = req.body as PaymobWebhookPayload;

        // Log the webhook for debugging
        logger.info("Received Paymob webhook", {
            type: webhookPayload.type,
            transaction_id: webhookPayload.obj.id,
            success: webhookPayload.obj.success,
            order_id: webhookPayload.obj.order?.id,
        });

        // Save webhook to webhooks table
        const webhook = new Webhook();
        webhook.success = webhookPayload.obj.success;
        webhook.content = webhookPayload;
        await webhook.save();

        // Only process transaction webhooks
        if (webhookPayload.type === "TRANSACTION") {
            const { obj: transactionData } = webhookPayload;

            // Find user by email from billing data
            const userEmail = transactionData.payment_key_claims.billing_data.email;
            const user = await User.findOne({ where: { email: userEmail } });

            if (!user) {
                logger.error(`User not found for email: ${userEmail}`);
                return res.status(200).json({
                    msg: "Webhook received but user not found",
                    webhook_id: webhook.id,
                });
            }

            // Find the most recent session for this user
            // In a production system, we to change this logic
            // to better map transactions to specific sessions
            const recentSession = await Session.findOne({
                where: { user_id: user.id },
                order: { created_at: "DESC" },
            });

            // if (!recentSession) {
            //   logger.error(`No session found for user: ${user.id}`);
            //   return res.status(200).json({
            //     msg: "Webhook received but no session found for user",
            //     webhook_id: webhook.id
            //   });
            // }

            // Create transaction record
            const transactionId = await createTransactionRecord(
                transactionData,
                recentSession?.id || randomUUID(),
                user.id,
                recentSession?.vehicle_id || randomUUID()
            );

            logger.info("Transaction created successfully", {
                transaction_id: transactionId,
                paymob_transaction_id: transactionData.id,
                amount: transactionData.amount_cents.toString(),
                status: transactionData.success ? TransactionStatus.SUCCESS : TransactionStatus.FAILED,
                user_id: user.id,
                session_id: recentSession?.id || randomUUID(),
            });

            return res.status(200).json({
                msg: "Webhook processed successfully",
                webhook_id: webhook.id,
                transaction_id: transactionId,
            });
        }

        // For non-transaction webhooks, just acknowledge
        return res.status(200).json({
            msg: "Webhook received and logged",
            webhook_id: webhook.id,
        });
    } catch (error: unknown) {
        logger.error("Error processing webhook:", error);

        // Always return 200 to Paymob to prevent retries for our internal errors
        return res.status(200).json({
            error: "Webhook processing failed but acknowledged",
            msg: "Internal server error",
        });
    }
}

// Helper function to create transaction record
async function createTransactionRecord(
    transactionData: PaymobWebhookPayload["obj"],
    sessionId: string,
    userId: string,
    vehicleId: string
): Promise<string> {
    const status = transactionData.success ? TransactionStatus.SUCCESS : TransactionStatus.FAILED;
    const amountInCents = transactionData.amount_cents.toString();

    const transaction = new Transaction();
    transaction.status = status;
    transaction.amount = amountInCents;
    transaction.session_id = sessionId;
    transaction.user_id = userId;
    transaction.vehicle_id = vehicleId;

    await transaction.save();
    return transaction.id;
}

export { getPaymentIntentionController, processWebhookController };
