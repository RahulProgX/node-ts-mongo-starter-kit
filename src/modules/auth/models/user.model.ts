import { compareHashValue, hashValue } from '@common/utils/bcrypt.js';
import mongoose, { Schema, type Document } from 'mongoose';

// ------- Types
interface TUserPreferences {
  enabled2FA: boolean;
  emailNotification: boolean;
  twoFactorSecret?: string;
}

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  userPreferences: TUserPreferences;
  comparePassword(value: string): Promise<boolean>;
}

// ------- Sub Schemas
const userPreferencesSchema = new Schema<TUserPreferences>({
  enabled2FA: { type: Boolean, default: false },
  emailNotification: { type: Boolean, default: true },
  twoFactorSecret: { type: String, required: false },
});

// -------- Schema
const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isEmailVerified: { type: Boolean, default: false },
    userPreferences: { type: userPreferencesSchema, default: {} },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (_doc, ret: Record<string, unknown>) {
        ret.password = undefined;
        const prefs = ret.userPreferences as Record<string, unknown> | undefined;
        if (prefs) prefs.twoFactorSecret = undefined;
        return ret;
      },
    },
  },
);

// ------- Hooks
userSchema.pre('save', async function () {
  if (this.isModified('password')) this.password = await hashValue(this.password);
});

// ------- Methods
userSchema.methods.comparePassword = async function (value: string) {
  return await compareHashValue(value, this.password);
};

// ------- Model
const UserModel = mongoose.model<UserDocument>('User', userSchema);
export default UserModel;
