"use client";

import { useEffect, useMemo, useState } from "react";
import { doc, onSnapshot, type Timestamp } from "firebase/firestore";
import type { User } from "firebase/auth";

import { auth, db } from "@/lib/firebase";

export type UserDoc = {
  email?: string | null;
  displayName?: string | null;
  credits?: number | null;
  createdAt?: Timestamp | Date | string | null;
  lastTrialAt?: Timestamp | Date | string | null;
  photoURL?: string | null;
};

export function useUserProfile(user: User | null) {
  const [data, setData] = useState<UserDoc | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(user));
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (!user) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const reference = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(
      reference,
      (snapshot) => {
        setData(snapshot.exists() ? (snapshot.data() as UserDoc) : null);
        setLoading(false);
      },
      (subscribeError) => {
        setError(subscribeError);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [user]);

  const displayName = useMemo(() => {
    if (!user) return "";
    if (data?.displayName) return data.displayName;
    if (user.displayName) return user.displayName;
    if (user.email) return user.email.split("@")[0] ?? "";
    return "User";
  }, [data?.displayName, user]);

  const createdAtDate = useMemo(() => {
    const createdAt = data?.createdAt;
    if (createdAt && typeof (createdAt as Timestamp).toDate === "function") {
      return (createdAt as Timestamp).toDate();
    }
    if (createdAt instanceof Date) {
      return createdAt;
    }
    if (typeof createdAt === "string" && createdAt) {
      const parsed = new Date(createdAt);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed;
      }
    }
    const fallback = auth.currentUser?.metadata?.creationTime;
    return fallback ? new Date(fallback) : null;
  }, [data?.createdAt]);

  const lastTrialAtDate = useMemo(() => {
    const lastTrialAt = data?.lastTrialAt;
    if (lastTrialAt && typeof (lastTrialAt as Timestamp).toDate === "function") {
      return (lastTrialAt as Timestamp).toDate();
    }
    if (lastTrialAt instanceof Date) {
      return lastTrialAt;
    }
    if (typeof lastTrialAt === "string" && lastTrialAt) {
      const parsed = new Date(lastTrialAt);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed;
      }
    }
    return null;
  }, [data?.lastTrialAt]);

  return {
    data,
    loading,
    error,
    displayName,
    createdAtDate,
    lastTrialAtDate
  } as const;
}
