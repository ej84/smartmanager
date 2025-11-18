"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useSubscriptions } from "@/lib/hooks/useSubscriptions";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { UpcomingPayments } from "@/components/dashboard/UpcomingPayments";
import { MonthlyChart } from "@/components/dashboard/MonthlyChart";
import { useRouter } from "next/navigation";
//import { Button } from "@/components/ui/Button";
//import { Mail } from "lucide-react";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { subscriptions, loading: subLoading } = useSubscriptions(user?.uid);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();
  //const [isSendingEmail, setIsSendingEmail] = useState(false);
  //const [emailStatus, setEmailStatus] = useState<string>("");
  /*
  const handleSendTestEmail = async () => {
    if (!user?.email) {
      setEmailStatus("❌ User email not found");
      return;
    }
  
    setIsSendingEmail(true);
    setEmailStatus("Sending...");

    try {
      const response = await fetch("/api/test-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: user.email,
          userName: user.displayName || "User",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setEmailStatus("✅ Test email sent! Check your inbox.");
        setTimeout(() => setEmailStatus(""), 5000);
      } else {
        setEmailStatus(`❌ Failed: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      setEmailStatus("❌ Error sending test email");
      console.error("Test email error:", error);
    } finally {
      setIsSendingEmail(false);
    }
  };
  */

  useEffect(() => {
    if (!authLoading && !user) {
      setIsRedirecting(true);
      router.push("/login");
    }
  }, [user, authLoading, router]);

  if (authLoading || subLoading || isRedirecting) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Don't render anything if no user exists
  if (!user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📊 Dashboard</h1>
          <p className="text-black mt-2">
            Hello, {user?.displayName || "New User"}!
          </p>
        </div>

        {/* Test Email Button */}
        {/*<div className="flex flex-col items-end gap-2">
          <Button
            onClick={handleSendTestEmail}
            isLoading={isSendingEmail}
            variant="outline"
            size="sm"
            disabled={isSendingEmail}
          >
            <Mail className="w-4 h-4 mr-2" />
            {isSendingEmail ? "Sending..." : "Send Test Email"}
          </Button>
          {emailStatus && (
            <p
              className={`text-sm font-medium ${
                emailStatus.startsWith("✅")
                  ? "text-green-600"
                  : emailStatus.startsWith("❌")
                  ? "text-red-600"
                  : "text-blue-600"
              }`}
            >
              {emailStatus}
            </p>
          )}
        </div>*/}
      </div>
      <div className="space-y-8">
        <StatsOverview subscriptions={subscriptions} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <UpcomingPayments subscriptions={subscriptions} />
          <MonthlyChart subscriptions={subscriptions} />
        </div>
      </div>
    </div>
  );
}
