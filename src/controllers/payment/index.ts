import { Request, Response } from "express";
import logger from "../../utils/logging.js";
import { Paymob } from "../../utils/paymob.js";
import { Session, SessionStatus, PaymentMethod } from "../../models/session.js";
import { Station } from "../../models/station.js";
import { AppDataSource } from "../../config/dbConnection.js";

export async function getPaymentIntentionController(req: Request, res: Response) {
    try {
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

        const paymob = new Paymob();
        const intention_url = await paymob.createPaymentIntention(numericAmount);

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

export async function createSessionWithPaymentController(req: Request, res: Response) {
    try {
        console.log("=== Payment Controller Debug ===");
        console.log("Request body:", req.body);
        
        const { 
            user_id, 
            charger_id, 
            connector_id, 
            energy_delivered = 0, 
            cost, 
            duration_minutes = 0, 
            peak_power = 0, 
            average_power = 0 
        } = req.body;

        console.log("Extracted values:", { user_id, charger_id, connector_id, energy_delivered, cost, duration_minutes, peak_power, average_power });

        // Validate required fields
        if (typeof cost !== 'number' || cost <= 0) {
            console.log("Cost validation failed:", cost);
            return res.status(400).json({
                error: "Invalid cost. Must be a positive number",
            });
        }

        console.log("Getting stations from database...");
        // Get a random station from the database
        const stationRepository = AppDataSource.getRepository(Station);
        const stations = await stationRepository.find();
        
        console.log("Found stations:", stations.length);
        
        if (stations.length === 0) {
            console.log("No stations found");
            return res.status(500).json({
                error: "No stations available",
                msg: "No charging stations found in the system",
            });
        }

        // Select a random station
        const randomStation = stations[Math.floor(Math.random() * stations.length)];
        console.log("Selected station:", randomStation.name, "ID:", randomStation.id);

        console.log("Creating session...");
        // Create the session
        const session = new Session();
        session.station_id = randomStation.id;
        session.user_id = user_id ?? `guest_${Date.now()}`;
        session.charger_id = charger_id ?? `CHG-${randomStation.id}-${Math.floor(Math.random() * 4) + 1}`;
        session.connector_id = connector_id ?? "Type 2 - Port 1";
        session.status = SessionStatus.IN_PROGRESS;
        session.energy_delivered = energy_delivered;
        session.cost = cost;
        session.start_time = new Date();
        session.duration_minutes = duration_minutes;
        session.success_rate = 95; // Default success rate
        session.plug_in_successful = true;
        session.peak_power = peak_power;
        session.average_power = average_power;
        session.payment_method = PaymentMethod.CREDIT_CARD;

        console.log("Session object created:", {
            station_id: session.station_id,
            user_id: session.user_id,
            cost: session.cost
        });

        // Save the session
        console.log("Saving session to database...");
        const savedSession = await session.save();
        console.log("Session saved with ID:", savedSession.id);

        // Create payment intention
        console.log("Creating payment intention...");
        const paymob = new Paymob();
        const payment_url = await paymob.createPaymentIntention(cost);
        console.log("Payment URL created:", payment_url);

        // Update station active sessions count
        console.log("Updating station active sessions...");
        randomStation.active_sessions += 1;
        await randomStation.save();
        console.log("Station updated");

        console.log("Sending success response...");
        return res.status(201).json({
            success: true,
            session_id: savedSession.id,
            payment_url,
            message: "Session created and payment initiated successfully",
        });

    } catch (error: unknown) {
        console.error("=== Payment Controller Error ===");
        console.error("Error details:", error);
        console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
        
        if (error instanceof Error && error.message == "PAYMOB_ERROR") {
            logger.error({
                type: "PAYMOB_ERROR",
                error: error.cause,
                stack: error.stack,
            });
        }
        logger.error("Error creating session with payment:", error);
        return res.status(500).json({
            error: "Failed to create session with payment",
            msg: "Internal server error",
        });
    }
}   