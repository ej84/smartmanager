import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Subscription } from "@/types/subscription";
import { formatCurrency } from "@/lib/utils/currency";
import { formatDate, getDaysUntilPayment } from "@/lib/utils/date";
import { AlertCircle, Clock } from "lucide-react";

interface UpcomingPaymentsProps {
  subscriptions: Subscription[];
}

export const UpcomingPayments: React.FC<UpcomingPaymentsProps> = ({
  subscriptions,
}) => {
  const upcomingPayments = subscriptions
    .filter((sub) => sub.isActive)
    .filter((sub) => {
      // Timestamp를 Date로 변환
      const paymentDate =
        sub.nextPaymentDate instanceof Date
          ? sub.nextPaymentDate
          : sub.nextPaymentDate.toDate();

      const daysUntil = getDaysUntilPayment(paymentDate);
      return daysUntil >= 0 && daysUntil <= 30;
    })
    .sort((a, b) => {
      const dateA =
        a.nextPaymentDate instanceof Date
          ? a.nextPaymentDate
          : a.nextPaymentDate.toDate();
      const dateB =
        b.nextPaymentDate instanceof Date
          ? b.nextPaymentDate
          : b.nextPaymentDate.toDate();
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 5);

  if (upcomingPayments.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Upcoming Payments
        </h3>
        <p className="text-gray-500 text-center py-8">
          No payments scheduled within 30 days
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5" />
        Upcoming Payments
      </h3>
      <div className="space-y-3">
        {upcomingPayments.map((sub) => {
          // Timestamp를 Date로 변환
          const paymentDate =
            sub.nextPaymentDate instanceof Date
              ? sub.nextPaymentDate
              : sub.nextPaymentDate.toDate();

          const daysUntil = getDaysUntilPayment(paymentDate);
          const isUrgent = daysUntil <= 3;

          return (
            <div
              key={sub.id}
              className={`
                flex items-center justify-between p-3 rounded-lg border
                ${
                  isUrgent
                    ? "border-red-200 bg-red-50"
                    : "border-gray-200 bg-gray-50"
                }
              `}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-gray-900">{sub.name}</h4>
                  {isUrgent && <AlertCircle className="w-4 h-4 text-red-600" />}
                </div>
                <p className="text-sm text-gray-600">
                  {formatDate(paymentDate)}
                  <span className="ml-2 text-gray-500">(D-{daysUntil})</span>
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  {formatCurrency(sub.cost, sub.currency)}
                </p>
                <Badge variant={isUrgent ? "danger" : "warning"} size="sm">
                  {sub.billingCycle === "monthly" && "Monthly"}
                  {sub.billingCycle === "yearly" && "Yearly"}
                  {sub.billingCycle === "quarterly" && "Quarterly"}
                  {sub.billingCycle === "weekly" && "Weekly"}
                </Badge>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
