"use client";

import { useState, useEffect } from "react";
import { type User as FirebaseUser } from "firebase/auth";
import { onAuthChange, isAdmin } from "@/lib/firebase/auth";

interface AuthState {
  user: FirebaseUser | null;
  isAdminUser: boolean;
  loading: boolean;
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAdminUser: false,
    loading: true,
  });

  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      if (user) {
        const adminStatus = await isAdmin(user.uid);
        setState({ user, isAdminUser: adminStatus, loading: false });
      } else {
        setState({ user: null, isAdminUser: false, loading: false });
      }
    });

    return () => unsubscribe();
  }, []);

  return state;
}
