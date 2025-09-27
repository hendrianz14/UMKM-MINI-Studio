import { NextResponse } from "next/server";
import { handleApi } from "@/lib/api/response";
import { requireUser } from "@/lib/api/auth";
import { getAdminFirestore } from "@/lib/firebase/admin";
import { Timestamp } from "firebase-admin/firestore";

export const GET = handleApi(async (request) => {
  const decoded = await requireUser(request);
  const db = getAdminFirestore();
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit") ?? 20);
  const cursor = searchParams.get("cursor");

  let query = db
    .collection("outputs")
    .where("userId", "==", decoded.uid)
    .orderBy("createdAt", "desc")
    .limit(limit);

  if (cursor) {
    query = query.startAfter(Timestamp.fromDate(new Date(cursor)));
  }

  const snapshot = await query.get();
  const items = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate?.()?.toISOString?.() ?? null
  }));

  const nextCursor = snapshot.docs.length === limit ? items[items.length - 1]?.createdAt ?? null : null;

  return NextResponse.json({ items, nextCursor });
});
