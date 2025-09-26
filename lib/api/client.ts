"use client";

import { getClientAuth } from "@/lib/firebase/client";

export async function apiFetch<T>(input: RequestInfo | URL, init: RequestInit = {}): Promise<T> {
  const auth = getClientAuth();
  const currentUser = auth.currentUser;
  const token = currentUser ? await currentUser.getIdToken() : null;

  const response = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || "Request failed");
  }

  return response.json();
}
