import { z } from 'zod';

// Password requirements: min 8 chars, 1 uppercase, 1 number
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

// Phone number validation (basic format)
const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format');

// Email validation
const emailSchema = z.string().email('Invalid email format');

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
  phone: phoneSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const refreshSchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

// User profile update schema
export const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long').optional(),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long').optional(),
  phone: phoneSchema.optional(),
  dateOfBirth: z.string().datetime({ message: 'Invalid date format' }).optional(),
});

// User preferences update schema
export const updatePreferencesSchema = z.object({
  defaultTipPercent: z.number().int().refine(
    (val) => [0, 15, 18, 20].includes(val),
    { message: 'Tip percentage must be 0, 15, 18, or 20' }
  ).optional(),
  notifications: z.boolean().optional(),
  autoReorder: z.boolean().optional(),
});

// Age verification schema
export const verifyAgeSchema = z.object({
  dateOfBirth: z.string().datetime({ message: 'Invalid date format' }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdatePreferencesInput = z.infer<typeof updatePreferencesSchema>;
export type VerifyAgeInput = z.infer<typeof verifyAgeSchema>;
