/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import * as console from "node:console";
import { getPaymentIntentionController } from "../controllers/payment/index.js";
import { generateJSONResponse, getErrorResponses, getSecuritySchemes } from "../docs/helpers.js";
import { docs } from "../docs/index.js";
import { paymentIntentionResponseSchema } from "../schemas/payment.js";
import { authMiddleware } from "../middlewares/auth.js";

const paymentRouter = Router();

paymentRouter.post("/", (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  console.log(req.body);
  res.status(200).send({requestBody: req.body, msg: "Payment processed successfully"});
});

paymentRouter.get("/create", (req, res) => {
  res.status(201).json({ msg: "Payment created successfully" });
});

paymentRouter.get(
  "/intention",
  docs.path({
    summary: "Get payment intention",
    description: "Retrieve the payment intention",
    tags: ["Payment"],
    security: getSecuritySchemes(),
    parameters: [
      {
        name: "amount",
        in: "query",
        required: true,
        schema: {
          type: "number",
        },
        description: "Payment amount (can be float)",
      },
    ],
    responses: {
      200: generateJSONResponse(paymentIntentionResponseSchema, "Payment intention created successfully"),
      ...getErrorResponses(["400", "401", "404", "500"]),
    },
  }),
  authMiddleware,
  getPaymentIntentionController
);

export { paymentRouter };
