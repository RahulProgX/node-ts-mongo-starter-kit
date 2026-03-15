import type { VerificationEnum } from '@common/enums/verification.enum.js';
import { generateUniqueCode } from '@common/utils/uuid.js';
import mongoose from 'mongoose';
import { Schema } from 'mongoose';

// ------- Types
export interface TVerificationCodeDocument extends Document {
  userId: mongoose.Types.ObjectId;
  code: string;
  type: VerificationEnum;
  expiresAt: Date;
}

// ----- Schema
const verificationCodeSchema = new Schema<TVerificationCodeDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      index: true,
    },
    code: {
      type: String,
      unique: true,
      required: true,
      default: generateUniqueCode,
    },
    type: {
      type: String,
      requried: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

// ------- Model
const VerificationCodeModel = mongoose.model<TVerificationCodeDocument>(
  'VerificationCode',
  verificationCodeSchema,
  'verification_codes',
);
export default VerificationCodeModel;
