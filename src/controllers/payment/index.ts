import { Request, Response } from "express";
import { Static } from "@sinclair/typebox";
import { User } from "../../models/user.js";
import logger from "../../utils/logging.js";
import { Webhook } from "../../models/webhook.js";
import { Session } from "../../models/sessions.js";
import { PaymobWebhookPayloadSchema } from "../../schemas/webhook.js";
import { createTransactionRecord } from "../../utils/payment.js";
import { randomUUID, UUID } from "crypto";
import { TransactionStatus } from "../../schemas/transction.js";
import localCache from "../../utils/cache/local.js";
import { Paymob } from "../../utils/paymob.js";
import config from "../../config/env.js";
import { receiptDownloadRequestSchema } from "../../schemas/payment.js";
import PDFDocument from "pdfkit";

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

        const paymob = new Paymob(config.PAYMOB_API_KEY, config.PAYMOB_SECRET_KEY, config.PAYMOB_PUBLIC_KEY, [
            config.PAYMOB_PAYMENT_METHOD,
        ]);
        const intention_url = await paymob.initiatePayment(
            {
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                phoneNumber: user.phone_number,
            },
            numericAmount
        );

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

async function processWebhookController(req: Request, res: Response) {
    try {
        const webhookPayload = req.body as Static<typeof PaymobWebhookPayloadSchema>;

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
                // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                recentSession?.id || randomUUID(),
                user.id,
                // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                recentSession?.vehicle_id || randomUUID()
            );

            logger.info("Transaction created successfully", {
                transaction_id: transactionId,
                paymob_transaction_id: transactionData.id,
                amount: transactionData.amount_cents.toString(),
                status: transactionData.success ? TransactionStatus.SUCCESS : TransactionStatus.FAILED,
                user_id: user.id,
                // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
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

async function downloadReceiptController(
    req: Request<unknown, unknown, Static<typeof receiptDownloadRequestSchema>>,
    res: Response
) {
    try {
        const { date, time, duration, power, totalCost } = req.body;
        const user_id = req["userId"] as UUID;
        const user = await User.findOne({ where: { id: user_id } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Generate a random receipt number
        const receiptNo = `RP-${Math.floor(10000 + Math.random() * 90000)}`;

        // Create a PDF document
        const doc = new PDFDocument({ margin: 50 });
        const chunks: Buffer[] = [];
        doc.on("data", (chunk: Buffer) => chunks.push(chunk));
        doc.on("end", () => {
            const pdfBuffer = Buffer.concat(chunks);
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", "attachment; filename=receipt.pdf");
            res.send(pdfBuffer);
        });

        // Header: Logo and Company Info
        try {
            doc.image("public/logo2.png", doc.page.width - 120, 30, { width: 70 });
        } catch {
            /* logo missing, skip */
        }
        doc.fontSize(10)
            .fillColor("#000000")
            .text("EnergiQ", 50, 40)
            .text("info@energiq.com")
            .text("Zagazig, Egypt")
            .text("Phone: +201000000000");

        // Title
        doc.moveDown(3);
        doc.font("Helvetica-Bold")
            .fontSize(20)
            .fillColor("#000000")
            .text("Payment Receipt", { align: "center", underline: false, continued: false });
        doc.font("Helvetica");
        doc.moveDown(1);
        doc.moveTo(50, doc.y)
            .lineTo(doc.page.width - 50, doc.y)
            .stroke("#BF4E30");
        doc.moveDown(1.5);

        // Details Section
        doc.fontSize(12).fillColor("#000000");
        doc.font("Helvetica-Bold")
            .text("Receipt No.:", 50, doc.y, { continued: true })
            .font("Helvetica")
            .text(` ${receiptNo}`);
        doc.moveDown(0.5);
        doc.font("Helvetica-Bold").text("Date:", 50, doc.y, { continued: true }).font("Helvetica").text(` ${date}`);
        doc.moveDown(0.5);
        doc.font("Helvetica-Bold").text("Time:", 50, doc.y, { continued: true }).font("Helvetica").text(` ${time}`);
        doc.moveDown(0.5);
        doc.font("Helvetica-Bold")
            .text("Session Duration:", 50, doc.y, { continued: true })
            .font("Helvetica")
            .text(` ${duration}`);
        doc.moveDown(0.5);
        doc.font("Helvetica-Bold")
            .text("Power Consumed(kW):", 50, doc.y, { continued: true })
            .font("Helvetica")
            .text(` ${power}`);
        doc.moveDown(0.5);
        doc.font("Helvetica-Bold")
            .text("Received From:", 50, doc.y, { continued: true })
            .font("Helvetica")
            .text(` ${user.first_name} ${user.last_name}`);
        doc.moveDown(0.5);
        doc.font("Helvetica-Bold")
            .text("Received By:", 50, doc.y, { continued: true })
            .font("Helvetica")
            .text(" EnergiQ");
        doc.moveDown(1);
        doc.moveTo(50, doc.y)
            .lineTo(doc.page.width - 50, doc.y)
            .stroke("#BF4E30");
        doc.moveDown(1.5);

        // Payment Details Table
        const tableTop = doc.y;
        const col1 = 50;
        const col2 = 350;
        const rowHeight = 24;
        doc.fontSize(12)
            .fillColor("#BF4E30")
            .font("Helvetica-Bold")
            .text("Payment Details", col1, tableTop)
            .text("Amount", col2, tableTop);
        doc.moveTo(col1, tableTop + rowHeight - 8)
            .lineTo(doc.page.width - 50, tableTop + rowHeight - 8)
            .stroke("#BF4E30");
        doc.font("Helvetica").fillColor("#000000");
        doc.text("Total Amount Due", col1, tableTop + rowHeight).text(
            `${totalCost.toFixed(2)} EGP`,
            col2,
            tableTop + rowHeight
        );
        doc.text("Amount Received", col1, tableTop + rowHeight * 2).text(
            `${totalCost.toFixed(2)} EGP`,
            col2,
            tableTop + rowHeight * 2
        );
        doc.text("Balance Due", col1, tableTop + rowHeight * 3).text(`0.00 EGP`, col2, tableTop + rowHeight * 3);
        doc.moveDown(5);

        // For/Session Info
        doc.font("Helvetica-Bold")
            .text("For:", 50, doc.y, { continued: true })
            .font("Helvetica")
            .text(" EV Charging Session");
        doc.moveDown(1);
        doc.font("Helvetica-Oblique").fontSize(11).fillColor("#000000").text("Thank you for your payment!");

        doc.end();
    } catch (error) {
        return res.status(500).json({ error: (error as Error).message });
    }
}

export { processWebhookController, getPaymentIntentionController, downloadReceiptController };
