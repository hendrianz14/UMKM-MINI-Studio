import { NextResponse } from "next/server";
import { handleApi } from "@/lib/api/response";
import { requireUser } from "@/lib/api/auth";
import { getAdminFirestore } from "@/lib/firebase/admin";

export const GET = handleApi(async (_request) => {
  const decoded = await requireUser();
  const db = getAdminFirestore();
  const doc = await db.collection("users").doc(decoded.uid).get();
  const data = doc.data() ?? {};

  return NextResponse.json({
    uid: decoded.uid,
    displayName: data.displayName ?? decoded.name ?? "Creator",
    email: data.email ?? decoded.email,
    photoURL: data.photoURL ?? decoded.picture ?? null,
    credits: data.credits ?? 0,
    lastTrialAt: data.lastTrialAt?.toDate?.()?.toISOString?.() ?? null,
    createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? null
  });
});
