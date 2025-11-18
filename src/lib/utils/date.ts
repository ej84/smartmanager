import {
  format,
  formatDistanceToNow,
  addMonths,
  //addDays,
  addWeeks,
  differenceInDays,
  isBefore,
  //isAfter,
  startOfMonth,
  endOfMonth,
} from 'date-fns';
import { enUS } from 'date-fns/locale';
import { BillingCycle } from '@/types/subscription';

// 날짜 포맷팅 (미국 동부 시간대)
export const formatDate = (date: Date, formatStr: string = 'yyyy-MM-dd'): string => {
  return format(date, formatStr, { locale: enUS });
};

// 상대적 시간 표시 (예: "in 3 days")
export const formatRelativeTime = (date: Date): string => {
  return formatDistanceToNow(date, { addSuffix: true, locale: enUS });
};

// 다음 결제일 계산
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

// D-day 계산
export const getDaysUntilPayment = (paymentDate: Date): number => {
  return differenceInDays(paymentDate, new Date());
};

// 결제일 임박 여부 체크 (7일 이내)
export const isPaymentUpcoming = (paymentDate: Date, daysThreshold: number = 7): boolean => {
  const daysUntil = getDaysUntilPayment(paymentDate);
  return daysUntil >= 0 && daysUntil <= daysThreshold;
};

// 결제일 지남 여부
export const isPaymentOverdue = (paymentDate: Date): boolean => {
  return isBefore(paymentDate, new Date());
};

// 이번 달 시작/종료 날짜
export const getCurrentMonthRange = () => {
  const now = new Date();
  return {
    start: startOfMonth(now),
    end: endOfMonth(now),
  };
};