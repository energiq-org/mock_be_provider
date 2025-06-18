import { User } from "@src/models/user.js";
import config from "../config/env.js";

class Paymob {
  private paymobBaseURL = "https://accept.paymob.com";
  private apiKey: string;
  private secretKey: string;
  private publicKey: string;
  private paymentMethods: number[];

  constructor() {
    this.apiKey = config.PAYMOB_API_KEY;
    this.secretKey = config.PAYMOB_SECRET_KEY;
    this.publicKey = config.PAYMOB_PUBLIC_KEY;
    this.paymentMethods = [config.PAYMOB_PAYMENT_METHOD];
  }

  /**
   * Creates a payment intention with Paymob for a charging session
   *
   * @param amount - The payment amount in EGP (will be converted to piasters by multiplying by 100)
   * @param user - The user object containing general information
   * @returns Promise<string> - The payment intention URL that the user can use to complete payment
   * @throws Error - Throws an error if the payment intention creation fails
   *
   * @example
   * ```typescript
   * const paymob = new Paymob();
   * const user = await User.findOne({ where: { id: userId } });
   * const intentionUrl = await paymob.createPaymentIntention(100, user);
   * // Returns: "https://accept.paymobsolutions.com/unifiedcheckout/?publicKey=..."
   * ```
   */
  async createPaymentIntention(amount: number, user: User) {
    const paymobIntentionReq = JSON.stringify({
      amount: amount * 100,
      currency: "EG",
      payment_methods: this.paymentMethods,
      items: [
        {
          name: "charging session",
          amount: amount * 100,
          description: "successful charging session.",
          quantity: 1,
        },
      ],
      billing_data: {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone_number: user.phone_number,
      },
      customer: {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      },
    });

    const response = await fetch(`${this.paymobBaseURL}/v1/intention/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${this.secretKey}`,
      },
      body: paymobIntentionReq,
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error("PAYMOB_ERROR", { cause: error });
    }
    const data = (await response.json()) as { client_secret: string };

    return this.buildIntentionUrl(data.client_secret);
  }

  private buildIntentionUrl(client_secret: string): string {
    return `${this.paymobBaseURL}/unifiedcheckout/?publicKey=${this.publicKey}&clientSecret=${client_secret}`;
  }
}

export { Paymob };
