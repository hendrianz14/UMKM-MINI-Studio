import { NextResponse } from "next/server";
import { handleApi } from "@/lib/api/response";
import { requireUser } from "@/lib/api/auth";
import { getAdminFirestore } from "@/lib/firebase/admin";
import { notFound } from "@/lib/api/errors";

export const DELETE = handleApi(async (_request, { params }: { params: { id: string } }) => {
  const decoded = await requireUser();
  const db = getAdminFirestore();
  const docRef = db.collection("outputs").doc(params.id);
  const snapshot = await docRef.get();

  if (!snapshot.exists || snapshot.data()?.userId !== decoded.uid) {
    notFound("Output tidak ditemukan");
  }

  await docRef.delete();
  return NextResponse.json({ success: true });
});
