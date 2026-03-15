import { thirtyDaysFromNow } from '@common/utils/dateTime.js';
import mongoose from 'mongoose';
import { Schema } from 'mongoose';

// ------- Types
export interface SessionDocument extends Document {
  userId: mongoose.Types.ObjectId;
  userAgent?: string;
  expiresAt: Date;
}

// ------- Schema
const sessionSchema = new Schema<SessionDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      index: true,
    },
    userAgent: { type: String, required: false },
    expiresAt: { type: Date, required: true, default: thirtyDaysFromNow },
  },
  { timestamps: true },
);

// ----- Model
const SessionModel = mongoose.model<SessionDocument>('Session', sessionSchema);
export default SessionModel;
