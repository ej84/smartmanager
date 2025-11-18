"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { signOut } from "@/lib/firebase/auth";
import { Button } from "@/components/ui/Button";
import { CreditCard, LogOut } from "lucide-react";

export const Navbar: React.FC = () => {
  const { user, setIsLoggingOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Failed to logout:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            href={user ? "/dashboard" : "/"}
            className="flex items-center gap-2"
          >
            <CreditCard className="w-6 h-6 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">
              SmartManager
            </span>
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-black hidden sm:block">
                {user.displayName || user.email}
              </span>
              {/*
              <Link href="/dashboard/settings">
                <Button size="sm" className="flex btn-hover">
                  <Settings className="w-4 h-4 sm:relative sm:right-1 sm:top-0.5" />
                  <span className="hidden sm:block">Settings</span>
                </Button>
              </Link>
            */}
              <Button
                size="sm"
                onClick={handleSignOut}
                className="flex btn-hover"
              >
                <LogOut className="w-4 h-4 sm:relative sm:right-1 sm:top-0.5" />
                <span className="hidden sm:block">Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link href="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:text-white hover:bg-gray-900 cursor-pointer"
                >
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:text-white hover:bg-gray-900 cursor-pointer"
                >
                  SignUp
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
