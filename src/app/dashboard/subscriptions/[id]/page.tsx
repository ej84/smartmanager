"use client";

import React, { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSubscription, updateSubscription } from "@/lib/firebase/firestore";
import { SubscriptionForm } from "@/components/forms/SubscriptionForm";
import { Subscription, SubscriptionFormData } from "@/types/subscription";
import { Card } from "@/components/ui/Card";
import { ArrowLeft } from "lucide-react";
import { formatDate } from "@/lib/utils/date";

export default function EditSubscriptionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const data = await getSubscription(id);
        setSubscription(data);
      } catch (error) {
        console.error("Failed to fetch subscription:", error);
        alert("Failed to load subscription information.");
        router.push("/dashboard/subscriptions");
      } finally {
        setIsFetching(false);
      }
    };

    fetchSubscription();
  }, [id, router]);

  const handleSubmit = async (data: SubscriptionFormData) => {
    setIsLoading(true);

    try {
      await updateSubscription(id, data);
      router.push("/dashboard/subscriptions");
    } catch (error) {
      console.error("Failed to update subscription:", error);
      alert("Failed to update subscription.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!subscription) {
    return null;
  }

  // Timestamp를 Date로 변환
  const paymentDate =
    subscription.nextPaymentDate instanceof Date
      ? subscription.nextPaymentDate
      : subscription.nextPaymentDate.toDate();

  const defaultValues: Partial<SubscriptionFormData> = {
    name: subscription.name,
    category: subscription.category,
    cost: subscription.cost,
    currency: subscription.currency,
    billingCycle: subscription.billingCycle,
    nextPaymentDate: formatDate(paymentDate),
    autoRenew: subscription.autoRenew,
    notes: subscription.notes || "",
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/dashboard/subscriptions"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Subscriptions
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Subscription</h1>
        <p className="text-gray-600 mt-1">
          Update {subscription.name} information
        </p>
      </div>

      <Card>
        <SubscriptionForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </Card>
    </div>
  );
}
