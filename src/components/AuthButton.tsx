// components/AuthButton.tsx
"use client";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import app from "@/lib/firebase/config";
import { useAuth } from "@/lib/hooks/useAuth";

const auth = getAuth(app);

export default function AuthButton() {
  const { user } = useAuth();

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return user ? (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 text-white rounded"
    >
      Logout
    </button>
  ) : (
    <button
      onClick={handleLogin}
      className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      Google Login
    </button>
  );
}
