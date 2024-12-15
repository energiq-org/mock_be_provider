// import db from "@src/utils/db";
import { createServer } from "./app";
import config from "./config/env";
import logger from "./utils/logging";

try {
  const server = createServer();
  server.listen(config.LISTEN_PORT);
  logger.info(`Listening on http://localhost:${config.LISTEN_PORT}`);
} catch (err) {
  logger.error(`Failed to start server: ${JSON.stringify(err)}`);
  process.exit(1);
}
