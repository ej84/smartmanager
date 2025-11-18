import React, { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Subscription } from "@/types/subscription";
import { formatCurrency } from "@/lib/utils/currency";
import { BarChart3 } from "lucide-react";

interface MonthlyChartProps {
  subscriptions: Subscription[];
}

export const MonthlyChart: React.FC<MonthlyChartProps> = ({
  subscriptions,
}) => {
  const chartData = useMemo(() => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentMonth = new Date().getMonth();

    // 최근 6개월 데이터 생성
    return Array.from({ length: 6 }, (_, i) => {
      const monthIndex = (currentMonth - 5 + i + 12) % 12;
      const monthName = months[monthIndex];

      // 해당 월의 예상 지출 계산
      const monthlyTotal = subscriptions
        .filter((sub) => sub.isActive)
        .reduce((sum, sub) => {
          if (sub.billingCycle === "monthly") return sum + sub.cost;
          if (sub.billingCycle === "yearly") return sum + sub.cost / 12;
          if (sub.billingCycle === "quarterly") return sum + sub.cost / 3;
          if (sub.billingCycle === "weekly") return sum + sub.cost * 4;
          return sum;
        }, 0);

      return {
        month: monthName,
        amount: Math.round(monthlyTotal),
      };
    });
  }, [subscriptions]);

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5" />
        Total Monthly Costs
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#888" />
          <YAxis
            tick={{ fontSize: 12 }}
            stroke="#888"
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
          />
          <Tooltip
            formatter={(value: number) => formatCurrency(value)}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
            }}
          />
          <Bar dataKey="amount" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
