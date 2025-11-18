// app/login/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp, // 추가
} from "firebase/firestore";
import app from "@/lib/firebase/config";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/lib/hooks/useAuth";

const auth = getAuth(app);

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      const userRef = doc(db, "users", firebaseUser.uid);
      const snapshot = await getDoc(userRef);

      if (!snapshot.exists()) {
        await setDoc(userRef, {
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          createdAt: serverTimestamp(), // 서버 기준 Timestamp 저장
        });
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow text-center space-y-4">
        <h1 className="text-2xl font-bold">Please Sign In</h1>
        <button
          onClick={handleLogin}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Google Login
        </button>
      </div>
    </div>
  );
}
