"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { useSubscriptions } from "@/lib/hooks/useSubscriptions";
import {
  deleteSubscription,
  toggleSubscriptionStatus,
} from "@/lib/firebase/firestore";
import { SubscriptionCard } from "@/components/dashboard/SubscriptionCard";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";

export default function SubscriptionsPage() {
  const { user } = useAuth();
  const { subscriptions, loading } = useSubscriptions(user?.uid);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    try {
      await toggleSubscriptionStatus(id, isActive);
    } catch (error) {
      console.error("Failed to edit status: ", error);
      alert("Failed to edit status.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSubscription(id);
    } catch (error) {
      console.error("Failed to delet:", error);
      alert("Failed to delete.");
    }
  };

  const filteredSubscriptions = subscriptions.filter((sub) => {
    if (filter === "active") return sub.isActive;
    if (filter === "inactive") return !sub.isActive;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-72">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Manage Subscriptions
          </h1>
          <p className="text-gray-600 mt-1">
            Total {subscriptions.length} Subscriptions
          </p>
        </div>
        <Link href="/dashboard/subscriptions/new">
          <Button className="flex btn-hover">
            <Plus className="w-4 h-4 md:mt-1" />
            Add subscription
          </Button>
        </Link>
      </div>

      <div className="flex gap-2 mb-6">
        <Button
          variant={filter === "all" ? "dark" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
          className="hover:cursor-pointer"
        >
          All
        </Button>
        <Button
          variant={filter === "active" ? "dark" : "outline"}
          size="sm"
          onClick={() => setFilter("active")}
          className="hover:cursor-pointer"
        >
          Active
        </Button>
        <Button
          variant={filter === "inactive" ? "dark" : "outline"}
          size="sm"
          onClick={() => setFilter("inactive")}
          className="hover:cursor-pointer"
        >
          Inactive
        </Button>
      </div>

      {filteredSubscriptions.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">
            {filter === "all"
              ? "No subscription yet"
              : `No ${
                  filter === "active" ? "active" : "inactive"
                } subscription`}
          </p>
          {filter === "all" && (
            <Link href="/dashboard/subscriptions/new">
              <Button className="flex btn-hover">
                <Plus className="w-4 h-4 mr-2" />
                Add new subscriptoin
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubscriptions.map((subscription) => (
            <SubscriptionCard
              key={subscription.id}
              subscription={subscription}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
