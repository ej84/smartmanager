import React from "react";
import { Card } from "@/components/ui/Card";
import { Subscription } from "@/types/subscription";
import { formatCurrency } from "@/lib/utils/currency";
import { CreditCard, TrendingUp, Calendar, CheckCircle } from "lucide-react";

interface StatsOverviewProps {
  subscriptions: Subscription[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  subscriptions,
}) => {
  const activeSubscriptions = subscriptions.filter((sub) => sub.isActive);

  const monthlyTotal = activeSubscriptions.reduce((sum, sub) => {
    if (sub.billingCycle === "monthly") return sum + sub.cost;
    if (sub.billingCycle === "yearly") return sum + sub.cost / 12;
    if (sub.billingCycle === "quarterly") return sum + sub.cost / 3;
    if (sub.billingCycle === "weekly") return sum + sub.cost * 4;
    return sum;
  }, 0);

  const yearlyTotal = monthlyTotal * 12;

  const upcomingPayments = activeSubscriptions.filter((sub) => {
    // Timestamp를 Date로 변환
    const paymentDate =
      sub.nextPaymentDate instanceof Date
        ? sub.nextPaymentDate
        : sub.nextPaymentDate.toDate();

    const daysUntil = Math.floor(
      (paymentDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntil >= 0 && daysUntil <= 7;
  });

  const stats = [
    {
      label: "Active Subscriptions",
      value: activeSubscriptions.length,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Monthly Total",
      value: formatCurrency(monthlyTotal),
      icon: CreditCard,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Yearly Total",
      value: formatCurrency(yearlyTotal),
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      label: "Upcoming Payments",
      value: upcomingPayments.length,
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={`${stat.bgColor} p-3 rounded-lg`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
