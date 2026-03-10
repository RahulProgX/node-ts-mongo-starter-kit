import mongoose from "mongoose";
import { APP_LOG_MESSAGE } from "@common/constants/index.js";
import envConfig from "@config/env.config.js";
import logger from "@infrastructure/logger/index.js";

const connect = async (): Promise<void> => {
  try {
    const { connection } = await mongoose.connect(`${envConfig.MONGO_URI}`);
    logger.info(APP_LOG_MESSAGE.DB_CONNECTED, {
      meta: { host: connection.host },
    });
  } catch (error) {
    logger.warn(APP_LOG_MESSAGE.DB_CONNECTION_ERROR, { meta: { error } });
    process.exit(1);
  }
};

const connectDatabase = async (): Promise<void> => {
  await connect();
  mongoose.connection.on("disconnected", () => {
    logger.warn("MongoDB disconnected — reconnecting...");
    void connect();
  });
};

export default connectDatabase;
