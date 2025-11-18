import { z } from 'zod';

// 로그인 폼 스키마
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// 회원가입 폼 스키마
export const signupSchema = z.object({
  displayName: z.string().min(2, ''),
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Password not matching.',
  path: ['confirmPassword'],
});

// 구독 폼 스키마
export const subscriptionSchema = z.object({
  name: z.string().min(1, 'Enter the name of service.'),
  category: z.enum([
    'streaming',
    'productivity',
    'development',
    'design',
    'marketing',
    'cloud',
    'security',
    'communication',
    'finance',
    'other',
  ]),
  cost: z.number().min(0, 'The cost must be more than 0.'),
  currency: z.string().min(1, 'Please choose currency.'),
  billingCycle: z.enum(['weekly', 'monthly', 'quarterly', 'yearly']),
  nextPaymentDate: z.string().min(1, 'Please select next payment date.'),
  autoRenew: z.boolean(),
  notes: z.string().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type SubscriptionFormData = z.infer<typeof subscriptionSchema>;