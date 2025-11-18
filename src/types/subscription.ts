import { Timestamp } from 'firebase/firestore';

export type BillingCycle = 'monthly' | 'yearly' | 'quarterly' | 'weekly';

export type SubscriptionCategory = 
  | 'streaming'
  | 'productivity'
  | 'development'
  | 'design'
  | 'marketing'
  | 'cloud'
  | 'security'
  | 'communication'
  | 'finance'
  | 'other';

export interface Subscription {
  id: string;
  userId: string;
  name: string;
  category: SubscriptionCategory;
  cost: number;
  currency: string;
  billingCycle: BillingCycle;
  nextPaymentDate: Date | Timestamp;
  isActive: boolean;
  autoRenew: boolean;
  notes?: string;
  icon?: string;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

export interface SubscriptionFormData {
  name: string;
  category: SubscriptionCategory;
  cost: number;
  currency: string;
  billingCycle: BillingCycle;
  nextPaymentDate: string;
  autoRenew: boolean;
  notes?: string;
}

export interface SubscriptionStats {
  totalSubscriptions: number;
  activeSubscriptions: number;
  monthlyTotal: number;
  yearlyTotal: number;
  upcomingPayments: Subscription[];
}

export interface MonthlySpending {
  month: string;
  amount: number;
}

export const CATEGORY_LABELS: Record<SubscriptionCategory, string> = {
  streaming: 'Streaming',
  productivity: 'Productivity',
  development: 'Development',
  design: 'Design',
  marketing: 'Marketing',
  cloud: 'Cloud',
  security: 'Security',
  communication: 'Communication',
  finance: 'Finance',
  other: 'Other',
};

export const BILLING_CYCLE_LABELS: Record<BillingCycle, string> = {
  weekly: 'Weekly',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  yearly: 'Yearly',
};