import { z } from 'zod';

const emailSchema = z.email().max(255);
const passwordSchema = z
  .string()
  .min(8)
  .max(72)
  .regex(/[A-Z]/, 'Must contain uppercase')
  .regex(/[a-z]/, 'Must contain lowercase')
  .regex(/[0-9]/, 'Must contain number')
  .regex(/[^A-Za-z0-9]/, 'Must contain special character');

export const RegisterSchema = z.object({
  name: z.string().trim().min(1).max(255),
  email: emailSchema,
  password: passwordSchema,
});

export type TRegisterPayload = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  userAgent: z.string().optional(),
});

export type TLoginPayload = z.infer<typeof LoginSchema>;
