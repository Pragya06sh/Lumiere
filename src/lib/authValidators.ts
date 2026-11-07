import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(80, "Full name cannot exceed 80 characters"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .toLowerCase()
    .trim(),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian phone number"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .toLowerCase()
    .trim(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

