import { Type } from "@sinclair/typebox";

const paymentIntentionRequestSchema = Type.Object({
    amount: Type.Number(),
});

const paymentIntentionResponseSchema = Type.Object({
    intention_url: Type.String(),
});

const receiptDownloadRequestSchema = Type.Object({
    duration: Type.String({
        description: "Duration of the session (e.g., '1h 20min')",
        pattern: "^([0-9]{1,2}h( [0-9]{1,2}min)?)$",
    }),
    date: Type.String({ format: "date", description: "Date of the session" }),
    time: Type.String({
        description: "Time of the session (e.g., '07:30 AM' or '05:45 PM')",
        pattern: "^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$",
    }),
    power: Type.Number({ minimum: 20, maximum: 300, description: "Power consumed in kWh" }),
    totalCost: Type.Number({ minimum: 20, maximum: 1000, description: "Total cost of the session in EGP" }),
});

export { paymentIntentionRequestSchema, paymentIntentionResponseSchema, receiptDownloadRequestSchema };
