import mongoose from "mongoose";
import { APP_LOG_MESSAGE } from "../../common/constants/index.js";
import envConfig from "../../config/env.config.js";
import logger from "../logger/index.js";

const connect = (): void => {
  mongoose
    .connect(`${envConfig.MONGO_URI}`)
    .then(({ connection }) => {
      logger.info(APP_LOG_MESSAGE.DB_CONNECTED, {
        meta: { host: connection.host },
      });
    })
    .catch((error: unknown) => {
      logger.warn(APP_LOG_MESSAGE.DB_CONNECTION_ERROR, { meta: { error } });
      process.exit(1);
    });
};

const connectDatabase = (): void => {
  connect();
  mongoose.connection.on("disconnected", connect);
};

export default connectDatabase;
