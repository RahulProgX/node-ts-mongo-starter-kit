import dotenv from "dotenv";
import { APP_LOG_MESSAGE, ENVIRONMENTS } from "../common/constants/index.js";

dotenv.config();

const _config = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV || ENVIRONMENTS.DEVELOPMENT,
  MONGO_URI: process.env.MONGO_URI,
  APP_ORIGIN: process.env.APP_ORIGIN,
  JWT_SECRET: process.env.JWT_SECRET,
  saltWorkFactor: 10,
};

export const validateEnvironmentVariables = () => {
  for (const [key, value] of Object.entries(_config)) {
    if (value === undefined) {
      console.warn(APP_LOG_MESSAGE.MISSING_ENV_VARIABLE, {
        meta: { variable: key },
      });
    }
  }
};

export default Object.freeze(_config);
