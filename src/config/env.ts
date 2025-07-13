import "dotenv/config";
import { bool, cleanEnv, num, str } from "envalid";

export default cleanEnv(process.env, {
    // Server configuration
    LISTEN_PORT: num({ default: 8080 }),
    
    // Database configuration
    DB_HOST: str(),
    DB_PORT: num({ default: 5432 }),
    DB_USERNAME: str(),
    DB_PASSWORD: str(),
    DB_NAME: str(),
    DB_LOGGING: bool({ default: false }),
    
    // Development configuration
    HTTP_LOGGING: bool({ default: false }),
    HTTP_BODY_LOGGING: bool({ default: false }),
    LOGGING_LEVEL: str({
        choices: ["silent", "error", "warn", "info", "http", "verbose", "debug", "silly"],
        default: "info",
    }),

    // Paymob configuration
    PAYMOB_API_KEY: str({ default: "egy_pk_test_5klNpoBmZXIFkcH7woOvDoGnlGr1qOtu" }),
    PAYMOB_SECRET_KEY: str({ default: "egy_sk_test_cacacc93742895d816ccd0a3df63a44a" }),
    PAYMOB_PUBLIC_KEY: str({ default: "egy_pk_test_5klNpoBmZXIFkcH7woOvDoGnlGr1qOtu" }),
    PAYMOB_PAYMENT_METHOD: num({ default: 4564097 }),

    // API Documentation
    SPEC_REQUEST_VALIDATION: bool({ default: true }),
    SPEC_RESPONSE_VALIDATION: bool({ default: true }),

});
