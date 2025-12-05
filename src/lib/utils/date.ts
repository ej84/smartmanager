import {
  format,
  formatDistanceToNow,
  addMonths,
  addWeeks,
  differenceInDays,
  isBefore,
  startOfMonth,
  endOfMonth,
} from 'date-fns';
import { BillingCycle } from '@/types/subscription';

// ✅ locale 없이 사용 (기본값 영어)
export const formatDate = (date: Date, formatStr: string = 'yyyy-MM-dd'): string => {
  return format(date, formatStr);
};

export const formatRelativeTime = (date: Date): string => {
  return formatDistanceToNow(date, { addSuffix: true });
};

export const calculateNextPaymentDate = (
  currentDate: Date,
  billingCycle: BillingCycle
): Date => {
  switch (billingCycle) {
    case 'weekly':
      return addWeeks(currentDate, 1);
    case 'monthly':
      return addMonths(currentDate, 1);
    case 'quarterly':
      return addMonths(currentDate, 3);
    case 'yearly':
      return addMonths(currentDate, 12);
    default:
      return addMonths(currentDate, 1);
  }
};

export const getDaysUntilPayment = (paymentDate: Date): number => {
  return differenceInDays(paymentDate, new Date());
};

export const isPaymentUpcoming = (paymentDate: Date, daysThreshold: number = 7): boolean => {
  const daysUntil = getDaysUntilPayment(paymentDate);
  return daysUntil >= 0 && daysUntil <= daysThreshold;
};

export const isPaymentOverdue = (paymentDate: Date): boolean => {
  return isBefore(paymentDate, new Date());
};

export const getCurrentMonthRange = () => {
  const now = new Date();
  return {
    start: startOfMonth(now),
    end: endOfMonth(now),
  };
};