import { NextResponse } from "next/server";
import { handleApi } from "@/lib/api/response";
import { requireUser } from "@/lib/api/auth";
import { getAdminFirestore } from "@/lib/firebase/admin";
import { notFound } from "@/lib/api/errors";

export const GET = handleApi(async (request, { params }: { params: { id: string } }) => {
  const decoded = await requireUser(request);
  const db = getAdminFirestore();
  const doc = await db.collection("jobs").doc(params.id).get();

  if (!doc.exists || doc.data()?.userId !== decoded.uid) {
    notFound("Job tidak ditemukan");
  }

  const data = doc.data()!;
  return NextResponse.json({
    id: params.id,
    ...data,
    createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? null,
    updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() ?? null
  });
});
