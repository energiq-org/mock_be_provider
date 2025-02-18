import "dotenv/config";
import { bool, cleanEnv, num, str } from "envalid";

export default cleanEnv(process.env, {
  LOCAL_CACHE_TTL: num({ default: 60 }),
  LISTEN_PORT: num({ default: 8080 }),
  DB_HOST: str(),
  DB_PORT: num({ default: 5432 }),
  DB_USERNAME: str(),
  DB_PASSWORD: str(),
  DB_NAME: str(),
  JWT_SECRET: str(),
  REFRESH_TOKEN_LIFETIME: str({ default: '30d' }),
  ACCESS_TOKEN_LIFETIME: str({ default: '6h' }),
  DB_LOGGING: bool({ default: false }),
  DB_SYNC_POLICY: str({ choices: ["force", "alter", "default"], default: "default" }),
  HTTP_LOGGING: bool({ default: false }),
  HTTP_BODY_LOGGING: bool({ default: false }),
  LOGGING_LEVEL: str({
    choices: ["silent", "error", "warn", "info", "http", "verbose", "debug", "silly"],
    default: "info",
  }),
  SPEC_REQUEST_VALIDATION: bool({ default: true }),
  SPEC_RESPONSE_VALIDATION: bool({ default: true }),
});
