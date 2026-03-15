import { BadRequestException } from '@common/errors/errorException.js';
import type { TRegisterPayload } from './auth.validation.js';
import UserModel from './models/user.model.js';
import { ErrorCode } from '@common/enums/errorCode.enum.js';
import VerificationCodeModel from './models/verification.model.js';
import { VerificationEnum } from '@common/enums/verification.enum.js';
import { fortyFiveMinutesFromNow } from '@common/utils/dateTime.js';

export class AuthService {
  public async register(payload: TRegisterPayload) {
    const { name, email, password } = payload;

    const existingUser = await UserModel.exists({ email });
    if (existingUser)
      throw new BadRequestException('User already exists', ErrorCode.AUTH_EMAIL_ALREADY_EXISTS);

    const newUser = await UserModel.create({ name, email, password });
    const userId = newUser._id;

    const verificationCode = await VerificationCodeModel.create({
      userId,
      type: VerificationEnum.EMAIL_VERIFICATION,
      expiresAt: fortyFiveMinutesFromNow(),
    });

    // TODO: Send verification email link

    return { user: newUser };
  }
}
