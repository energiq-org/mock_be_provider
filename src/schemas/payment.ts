import { Type } from "@sinclair/typebox";

export const paymentIntentionResponseSchema = Type.Object({
  intention_url: Type.String(),
});
