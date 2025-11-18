import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  subscriptionSchema,
  SubscriptionFormData,
} from "@/lib/utils/validators";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CATEGORY_LABELS, BILLING_CYCLE_LABELS } from "@/types/subscription";
import { SUPPORTED_CURRENCIES } from "@/lib/utils/currency";

interface SubscriptionFormProps {
  defaultValues?: Partial<SubscriptionFormData>;
  onSubmit: (data: SubscriptionFormData) => void;
  isLoading?: boolean;
}

export const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  defaultValues,
  onSubmit,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: defaultValues || {
      autoRenew: true,
      currency: "USD",
      billingCycle: "monthly",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="service name"
        placeholder="Netflix, Spotify, etc"
        {...register("name")}
        error={errors.name?.message}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          {...register("category")}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            type="number"
            label="cost"
            placeholder="10000"
            {...register("cost", { valueAsNumber: true })}
            error={errors.cost?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Currency
          </label>
          <select
            {...register("currency")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {SUPPORTED_CURRENCIES.map((curr) => (
              <option key={curr.code} value={curr.code}>
                {curr.symbol} {curr.name}
              </option>
            ))}
          </select>
          {errors.currency && (
            <p className="mt-1 text-sm text-red-600">
              {errors.currency.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Payment Period
        </label>
        <select
          {...register("billingCycle")}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          {Object.entries(BILLING_CYCLE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {errors.billingCycle && (
          <p className="mt-1 text-sm text-red-600">
            {errors.billingCycle.message}
          </p>
        )}
      </div>

      <Input
        type="date"
        label="다음 결제일"
        {...register("nextPaymentDate")}
        error={errors.nextPaymentDate?.message}
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="autoRenew"
          {...register("autoRenew")}
          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
        />
        <label htmlFor="autoRenew" className="text-sm text-gray-700">
          Auto Renew
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Memo (optional)
        </label>
        <textarea
          {...register("notes")}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Please enter additional information"
        />
        {errors.notes && (
          <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full btn-hover" isLoading={isLoading}>
        {defaultValues ? "Edit" : "Add"}
      </Button>
    </form>
  );
};
