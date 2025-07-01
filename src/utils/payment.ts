import { Transaction } from "../models/transaction.js";
import { TransactionStatus } from "../schemas/transction.js";
import { Static } from "@sinclair/typebox";
import { PaymobWebhookPayloadSchema } from "../schemas/webhook.js";

/**
 * Helper function to create a transaction record from Paymob webhook data
 */
export async function createTransactionRecord(
    transactionData: Static<typeof PaymobWebhookPayloadSchema>["obj"],
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
