import config from "../config/env.js";

class Paymob {
    private paymobBaseURL = "https://accept.paymob.com";
    private apiKey: string;
    private secretKey: string;
    private publicKey: string;
    private paymentMethods: number[];

    constructor() {
        // Use actual Paymob credentials
        this.apiKey = config.PAYMOB_API_KEY || "egy_pk_test_5klNpoBmZXIFkcH7woOvDoGnlGr1qOtu";
        this.secretKey = config.PAYMOB_SECRET_KEY || "egy_sk_test_cacacc93742895d816ccd0a3df63a44a";
        this.publicKey = config.PAYMOB_PUBLIC_KEY || "egy_pk_test_5klNpoBmZXIFkcH7woOvDoGnlGr1qOtu";
        this.paymentMethods = [config.PAYMOB_PAYMENT_METHOD || 4564097];
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
    async createPaymentIntention(amount: number) {
        // Convert amount to integer representing smallest currency unit (piasters for EGP)
        const amountInPiasters = Number(amount.toFixed(1)) * 100;
        
        const paymobIntentionReq = JSON.stringify({
            amount: amountInPiasters,
            currency: "EGP",
            payment_methods: this.paymentMethods,
            special_reference: Math.random().toString(36).substring(2, 15),
            items: [
                {
                    name: "charging session",
                    amount: amountInPiasters,
                    description: "successful charging session.",
                    quantity: 1,
                },
            ],
            billing_data: {
                first_name: "John",
                last_name: "Doe",
                email: "john.doe@example.com",
                phone_number: "01012345678",
            },
            customer: {
                first_name: "John",
                last_name: "Doe",
                email: "john.doe@example.com",
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