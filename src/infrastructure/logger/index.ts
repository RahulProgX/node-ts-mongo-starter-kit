import { createLogger, format, transports } from "winston";
import type Transport from "winston-transport";
import util from "util";
import path from "path";
import { fileURLToPath } from "url";

import envConfig from "@config/env.config.js";
import MongoTransport from "./mongoTransport.js";
import { ENVIRONMENTS } from "@common/constants/index.js";

const { combine, timestamp, printf } = format;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const consoleFormat = printf(({ level, message, timestamp, meta = {} }) => {
  return `${level.toUpperCase()} [${timestamp}] ${message}
META ${util.inspect(meta, { depth: null, colors: true })}
`;
});

const fileFormat = printf(({ level, message, timestamp, meta = {} }) => {
  const parsedMeta: Record<string, unknown> = {};

  Object.entries(meta as Record<string, unknown>).forEach(([key, value]) => {
    if (value instanceof Error) {
      parsedMeta[key] = {
        name: value.name,
        message: value.message,
        stack: value.stack,
      };
    } else {
      parsedMeta[key] = value;
    }
  });

  return JSON.stringify(
    {
      level: level.toUpperCase(),
      message,
      timestamp,
      meta: parsedMeta,
    },
    null,
    2,
  );
});

const loggerTransports: Transport[] = [
  new transports.File({
    filename: path.resolve(__dirname, "../../../logs/application.log"),
    level: "info",
    format: combine(timestamp(), fileFormat),
  }),

  new MongoTransport({
    level: "info", // captures info, warn, error (Winston severity ladder)
  }),
];

if (envConfig.NODE_ENV === ENVIRONMENTS.DEVELOPMENT) {
  loggerTransports.push(
    new transports.Console({
      level: "info",
      format: combine(timestamp(), consoleFormat),
    }),
  );
}

const logger = createLogger({
  level: "info",
  defaultMeta: { meta: {} },
  transports: loggerTransports,
});

export default logger;
