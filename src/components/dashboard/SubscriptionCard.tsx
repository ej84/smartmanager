import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Subscription, CATEGORY_LABELS } from "@/types/subscription";
import { formatCurrency } from "@/lib/utils/currency";
import { formatDate, getDaysUntilPayment } from "@/lib/utils/date";
import { Calendar, Edit, Trash2, Power } from "lucide-react";

interface SubscriptionCardProps {
  subscription: Subscription;
  onToggleStatus: (id: string, isActive: boolean) => void;
  onDelete: (id: string) => void;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
  onToggleStatus,
  onDelete,
}) => {
  // Timestamp를 Date로 변환
  const paymentDate =
    subscription.nextPaymentDate instanceof Date
      ? subscription.nextPaymentDate
      : subscription.nextPaymentDate.toDate();

  const daysUntil = getDaysUntilPayment(paymentDate);
  const isUpcoming = daysUntil >= 0 && daysUntil <= 7;

  return (
    <Card>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {subscription.name}
            </h3>
            {!subscription.isActive && (
              <Badge variant="default" size="sm">
                Inactive
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-600">
            {CATEGORY_LABELS[subscription.category]}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() =>
              onToggleStatus(subscription.id, !subscription.isActive)
            }
            className={`p-2 rounded-lg transition-colors ${
              subscription.isActive
                ? "bg-green-50 text-green-600 hover:bg-green-100 hover:cursor-pointer"
                : "bg-gray-50 text-gray-400 hover:bg-gray-100 hover:cursor-pointer"
            }`}
            title={subscription.isActive ? "Deactivate" : "Activate"}
          >
            <Power className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Cost</span>
          <span className="font-semibold text-gray-900">
            {formatCurrency(subscription.cost, subscription.currency)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Billing Cycle</span>
          <Badge variant="info" size="sm">
            {subscription.billingCycle === "monthly" && "Monthly"}
            {subscription.billingCycle === "yearly" && "Yearly"}
            {subscription.billingCycle === "quarterly" && "Quarterly"}
            {subscription.billingCycle === "weekly" && "Weekly"}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            Next Payment
          </span>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              {formatDate(paymentDate)}
            </p>
            {subscription.isActive && (
              <p
                className={`text-xs ${
                  isUpcoming ? "text-red-600" : "text-gray-500"
                }`}
              >
                D-{daysUntil}
              </p>
            )}
          </div>
        </div>
      </div>

      {subscription.notes && (
        <p className="text-sm text-gray-600 mb-4 p-2 bg-gray-50 rounded">
          {subscription.notes}
        </p>
      )}

      <div className="flex gap-2">
        <Link
          href={`/dashboard/subscriptions/${subscription.id}`}
          className="flex-1"
        >
          <Button
            variant="outline"
            size="sm"
            className="w-full hover:cursor-pointer hover:bg-gray-100"
          >
            <Edit className="w-4 h-4 mr-1 inline" />
            Edit
          </Button>
        </Link>
        <Button
          variant="danger"
          size="sm"
          className="hover:cursor-pointer"
          onClick={() => {
            if (confirm("Are you sure you want to delete this subscription?")) {
              onDelete(subscription.id);
            }
          }}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};
