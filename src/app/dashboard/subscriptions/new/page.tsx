"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { createSubscription } from "@/lib/firebase/firestore";
import { SubscriptionForm } from "@/components/forms/SubscriptionForm";
import { SubscriptionFormData } from "@/types/subscription";
import { Card } from "@/components/ui/Card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewSubscriptionPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: SubscriptionFormData) => {
    if (!user) return;

    setIsLoading(true);

    try {
      await createSubscription(user.uid, data);
      router.push("/dashboard/subscriptions");
    } catch (error) {
      console.error("Failed to add new sub:", error);
      alert("Failed to add subscription. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/dashboard/subscriptions"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        To Subscription List
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add new sub</h1>
        <p className="text-gray-600 mt-1">
          Enter subscription information to manage
        </p>
      </div>

      <Card>
        <SubscriptionForm onSubmit={handleSubmit} isLoading={isLoading} />
      </Card>
    </div>
  );
}
