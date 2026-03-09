import dotenv from "dotenv";
import { APP_LOG_MESSAGE, ENVIRONMENTS } from "../common/constants/index.js";

dotenv.config();

const envConfig = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV ?? ENVIRONMENTS.DEVELOPMENT,
  MONGO_URI: process.env.MONGO_URI,
  APP_ORIGIN: process.env.APP_ORIGIN,
  JWT_SECRET: process.env.JWT_SECRET,
  SALT_WORK_FACTOR: 10,
} as const;

export const validateEnvironmentVariables = (): void => {
  const missing = Object.entries(envConfig)
    .filter(([, value]) => value === undefined)
    .map(([key]) => key);

  for (const variable of missing) {
    console.warn(APP_LOG_MESSAGE.MISSING_ENV_VARIABLE, { variable } );
  }
};

export default Object.freeze(envConfig);
