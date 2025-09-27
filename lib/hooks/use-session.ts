"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthState } from "react-firebase-hooks/auth";
import { apiFetch } from "@/lib/api/client";
import { getClientAuth } from "@/lib/firebase/client";

type SessionResponse = {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  credits: number;
  lastTrialAt: string | null;
  createdAt: string | null;
};

export function useSession() {
  const auth = getClientAuth();
  const [user, loading] = useAuthState(auth);
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
  const demoSession: SessionResponse | undefined = isDemoMode
    ? {
        uid: "demo-user",
        displayName: "Demo Creator",
        email: "demo@umkm-mini.studio",
        photoURL: null,
        credits: 999,
        lastTrialAt: null,
        createdAt: null
      }
    : undefined;

  return useQuery<SessionResponse>({
    queryKey: ["session"],
    queryFn: () => apiFetch<SessionResponse>("/api/auth/session"),
    enabled: !isDemoMode && !loading && !!user,
    initialData: demoSession,
    refetchOnWindowFocus: !isDemoMode,
    refetchOnReconnect: !isDemoMode
  });
}
