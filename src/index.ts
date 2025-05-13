import { createServer } from "./app.js";
import { sequelize } from "./config/dbConnection.js";
import config from "./config/env.js";
import logger from "./utils/logging.js";
import { initializeAssociations } from "./models/associations.js";

const startServer = async () => {
  const server = createServer();
  server.listen(config.LISTEN_PORT);
  logger.info(`Listening on http://localhost:${config.LISTEN_PORT}`);

  await sequelize.authenticate();
  logger.info("Database connection has been established successfully.");

  // Initialize model associations
  initializeAssociations();
  logger.info("Model associations initialized successfully.");

  await sequelize.sync({ [config.DB_SYNC_POLICY]: true });
  logger.info("Database synchronized successfully.");
};

startServer().catch((err) => {
  logger.error(`Error Occurred: ${err instanceof Error ? err.message : JSON.stringify(err)}`);
});
