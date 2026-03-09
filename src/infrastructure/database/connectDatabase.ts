import mongoose from "mongoose";
import { APP_LOG_MESSAGE } from "../../common/constants/index.js";
import envConfig from "../../config/env.config.js";

export default () => {
  const connect = () => {
    mongoose
      .connect(`${envConfig.MONGO_URI}`)
      .then((connectionInstance) => {
        console.info(APP_LOG_MESSAGE.DB_CONNECTED, {
          meta: { host: connectionInstance.connection.host },
        });
      })
      .catch((error) => {
        console.warn(APP_LOG_MESSAGE.DB_CONNECTION_ERROR, {
          meta: { error },
        });
        process.exit(1);
      });
  };
  connect();

  mongoose.connection.on("disconnected", connect);
};
