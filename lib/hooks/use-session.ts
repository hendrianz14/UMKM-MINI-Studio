"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api/client";

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
  return useQuery<SessionResponse>({
    queryKey: ["session"],
    queryFn: () => apiFetch<SessionResponse>("/api/auth/session")
  });
}
