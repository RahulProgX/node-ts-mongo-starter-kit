import mongoose, { type Document, type Model, Schema } from "mongoose";

export interface TLog extends Document {
  level: string;
  message: string;
  timestamp: Date;
  meta: Record<string, unknown>;
}

const logSchema = new Schema<TLog>(
  {
    level: { type: String, required: true, index: true },
    message: { type: String, required: true },
    timestamp: { type: Date, required: true, default: Date.now, index: true },
    meta: { type: Schema.Types.Mixed, default: {} },
  },
  {
    collection: "logs",
    versionKey: false,
  },
);

const LogModel: Model<TLog> = mongoose.model<TLog>("Log", logSchema);

export default LogModel;
