import { createServer } from "./app.js";
import { initializeDatabase } from "./config/dbConnection.js";
import config from "./config/env.js";
import logger from "./utils/logging.js";
import { seedAll } from "./utils/seedAll.js";

const startServer = async () => {
    await initializeDatabase();
    await seedAll()
    const server = createServer();
    server.listen(config.LISTEN_PORT);
    logger.info(`Listening on http://localhost:${config.LISTEN_PORT}`);
};

startServer().catch((err) => {
    logger.error(`Error Occurred: ${err instanceof Error ? err.message : JSON.stringify(err)}`);
});
