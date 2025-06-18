import { Request, Response } from "express";
import { UUID } from "crypto";
import localCache from "../../utils/cache/local.js";
import { User } from "../../models/user.js";
import { Paymob } from "../../utils/paymob.js";
import logger from "../../utils/logging.js";

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

export { getPaymentIntentionController };
