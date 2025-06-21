import { randomUUID } from "crypto";
import logger from "./logging.js";

class Paymob {
    private baseURL = "https://accept.paymob.com";
    private apiKey: string;
    private secretKey: string;
    private publicKey: string;
    private paymentMethods: number[];

    constructor(apiKey: string, secretKey: string, publicKey: string, paymentMethods: number[]) {
        this.apiKey = apiKey;
        this.secretKey = secretKey;
        this.publicKey = publicKey;
        this.paymentMethods = paymentMethods;
    }

    async initiatePayment(
        billingDate: {
            firstName: string;
            lastName: string;
            email: string;
            phoneNumber: string;
        },
        amountInCents: number,
        internalReference: string = randomUUID()
    ) {
        const intentionRequestBody = JSON.stringify({
            amount: amountInCents,
            currency: "EGP",
            payment_methods: this.paymentMethods,
            special_reference: internalReference,
            items: [
                {
                    name: "charging session",
                    amount: amountInCents,
                    description: "successful charging session.",
                    quantity: 1,
                },
            ],
            billing_data: {
                first_name: billingDate.firstName,
                last_name: billingDate.lastName,
                email: billingDate.email,
                phone_number: billingDate.phoneNumber,
            },
            customer: {
                first_name: billingDate.firstName,
                last_name: billingDate.lastName,
                email: billingDate.email,
            },
        });

        const response = await fetch(`${this.baseURL}/v1/intention/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${this.secretKey}`,
            },
            body: intentionRequestBody,
        });

        const data = (await response.json()) as { client_secret: string };
        if (!response.ok) {
            logger.error(`Error while initiating payment: ${JSON.stringify(data)}`);
            return null;
        }

        if (!data.client_secret) {
            logger.error(
                `Error while initiating payment: could not find client secret in response: ${JSON.stringify(data)}`
            );
            return null;
        }

        return this.buildIntentionUrl(data.client_secret);
    }

    private buildIntentionUrl(client_secret: string): string {
        return `${this.baseURL}/unifiedcheckout/?publicKey=${this.publicKey}&clientSecret=${client_secret}`;
    }
}

export { Paymob };
