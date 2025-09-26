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

  return useQuery<SessionResponse>({
    queryKey: ["session"],
    queryFn: () => apiFetch<SessionResponse>("/api/auth/session"),
    enabled: !loading && !!user
  });
}
