import Transport from "winston-transport";
import LogModel from "@infrastructure/database/models/log.modle.js";

interface TLogEntry {
  level: string;
  message: string;
  timestamp?: string;
  meta?: Record<string, unknown>;
  [key: string]: unknown;
}

class MongoTransport extends Transport {
  constructor(opts?: Transport.TransportStreamOptions) {
    super(opts);
  }

  log(info: TLogEntry, callback: () => void): void {
    setImmediate(() => this.emit("logged", info));

    const { level, message, timestamp, meta = {} } = info;

    LogModel.create({
      level: level.toUpperCase(),
      message,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      meta,
    }).catch((error: unknown) => {
      // eslint-disable-next-line no-console
      console.error("MongoTransport: failed to save log", error);
    });

    callback();
  }
}

export default MongoTransport;
