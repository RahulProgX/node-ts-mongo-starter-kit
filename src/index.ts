import { createApp } from "./config/app.js";
import { APP_LOG_MESSAGE } from "./common/constants/index.js";
import envConfig, {
  validateEnvironmentVariables,
} from "./config/env.config.js";
import connectDatabase from "./infrastructure/database/connectDatabase.js";

const bootstrap = async (): Promise<void> => {
  try {
    validateEnvironmentVariables();
    connectDatabase();

    const app = createApp();

    app.listen(envConfig.PORT, () => {
      console.info(APP_LOG_MESSAGE.APP_STARTED, {
        meta: {
          PORT: envConfig.PORT,
        },
      });
    });
  } catch (error) {
    console.error(APP_LOG_MESSAGE.APP_ERROR, { meta: { error } });
    process.exit(1);
  }
};

bootstrap();
