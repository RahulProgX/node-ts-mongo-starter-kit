import morgan, { type StreamOptions } from "morgan";
import logger from "@/infrastructure/logger/index.js";
import envConfig from "@/config/env.config.js";
import { ENVIRONMENTS } from "@common/constants/index.js";

// Pipe morgan output into Winston
const stream: StreamOptions = {
  write: (message: string) => {
    logger.info(message.trim(), { meta: { type: "http" } });
  },
};

// Detailed format for development
const devFormat =
  ":method :url :status :res[content-length] bytes — :response-time ms";

// Minimal format for production (no sensitive details)
const prodFormat = ":method :url :status :response-time ms";

const requestLogger = morgan(
  envConfig.NODE_ENV === ENVIRONMENTS.PRODUCTION ? prodFormat : devFormat,
  { stream },
);

export default requestLogger;
