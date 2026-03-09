import { createApp } from "./config/app.js";
import { APP_LOG_MESSAGE } from "./common/constants/index.js";
import env, { validateEnvironmentVariables } from "./config/env.config.js";

const bootstrap = async () => {
  try {
    validateEnvironmentVariables();
    // connectDB();

    const app = createApp();
    const port = env.PORT;

    app.listen(port, () => {
      console.info(APP_LOG_MESSAGE.APP_STARTED, {
        meta: {
          PORT: port,
        },
      });
    });
  } catch (error) {
    console.error(APP_LOG_MESSAGE.APP_ERROR, { meta: { error } });
    process.exit(1);
  }
};

bootstrap();
