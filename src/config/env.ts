import "dotenv/config";
import { bool, cleanEnv, makeValidator, num, str } from "envalid";

const tokenLifetimeValidator = makeValidator((value: string) => {
  const match = value.match(/^(\d+)([dhm])$/);
  if (!match) {
    throw new Error(
      `Invalid token lifetime format. Expected format: <number><d|h|m> (e.g., 30d, 6h, 15m). Received: ${value}`
    );
  }
  return value;
});

export default cleanEnv(process.env, {
  LOCAL_CACHE_TTL: num({ default: 60 }),
  LISTEN_PORT: num({ default: 8080 }),
  DB_HOST: str(),
  DB_PORT: num({ default: 5432 }),
  DB_USERNAME: str(),
  DB_PASSWORD: str(),
  DB_NAME: str(),
  DB_LOGGING: bool({ default: false }),
  DB_SYNC_POLICY: str({ choices: ["force", "alter", "default"], default: "default" }),
  VERIFICATION_CODE_LIFETIME: num({ default: 10 }),
  SENDGRID_API_KEY: str(),
  EMAIL_SENDER: str(),
  JWT_SECRET: str(),
  S3_ACCESS_KEY_ID: str(),
  S3_SECRET_ACCESS_KEY: str(),
  S3_REGION: str(),
  S3_BUCKET_NAME: str(),
  S3_URL_EXPIRATION: num({ default: 300 }),
  REFRESH_TOKEN_LIFETIME: tokenLifetimeValidator(str({ default: "30d" })),
  ACCESS_TOKEN_LIFETIME: tokenLifetimeValidator(str({ default: "6h" })),
  HTTP_LOGGING: bool({ default: false }),
  HTTP_BODY_LOGGING: bool({ default: false }),
  LOGGING_LEVEL: str({
    choices: ["silent", "error", "warn", "info", "http", "verbose", "debug", "silly"],
    default: "info",
  }),
  SPEC_REQUEST_VALIDATION: bool({ default: true }),
  SPEC_RESPONSE_VALIDATION: bool({ default: true }),
});
