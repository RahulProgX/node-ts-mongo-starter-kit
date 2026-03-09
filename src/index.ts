import { createApp } from "./config/app.js";
import { APP_LOG_MESSAGE } from "./common/constants/index.js";
import envConfig, {
  validateEnvironmentVariables,
} from "./config/env.config.js";
import connectDatabase from "./infrastructure/database/connectDatabase.js";
import logger from "./infrastructure/logger/index.js";

const bootstrap = async (): Promise<void> => {
  try {
    validateEnvironmentVariables();
    await connectDatabase();

    const app = createApp();

    const server = app.listen(envConfig.PORT, () => {
      logger.info(APP_LOG_MESSAGE.APP_STARTED, {
        meta: {
          PORT: envConfig.PORT, ENV: envConfig.NODE_ENV
        },
      });
    });
    //  Graceful shutdown
    const shutdown = (signal: string) => {
      logger.info(`\n${signal} received — shutting down gracefully`);
      server.close(() => {
        logger.info("HTTP server closed");
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (error) {
    logger.error(APP_LOG_MESSAGE.APP_ERROR, { meta: { error } });
    process.exit(1);
  }
};

bootstrap();
