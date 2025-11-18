// app/dashboard/layout.tsx
"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  // ✅ 모든 hook을 최상위에서 호출
  const { user, loading } = useAuth();
  const router = useRouter();

  // ✅ useEffect로 리다이렉트 처리
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // ✅ 로딩 중
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // ✅ 인증되지 않은 경우 (리다이렉트 중)
  if (!user) {
    return null;
  }

  // ✅ 정상 렌더링
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <Sidebar />
      <div className="flex-1 md:ml-0">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
