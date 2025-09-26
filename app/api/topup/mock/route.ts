import { NextResponse } from "next/server";
import { handleApi } from "@/lib/api/response";
import { requireUser } from "@/lib/api/auth";
import { getAdminFirestore } from "@/lib/firebase/admin";
import { z } from "zod";

const schema = z.object({
  credits: z.number().min(1)
});

export const POST = handleApi(async (request) => {
  const decoded = await requireUser();
  const body = schema.parse(await request.json());
  const db = getAdminFirestore();
  const userRef = db.collection("users").doc(decoded.uid);

  await db.runTransaction(async (transaction) => {
    const snap = await transaction.get(userRef);
    if (!snap.exists) {
      transaction.set(userRef, {
        displayName: decoded.name ?? "Creator",
        email: decoded.email,
        credits: body.credits,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return;
    }

    const currentCredits = snap.data()?.credits ?? 0;
    transaction.update(userRef, {
      credits: currentCredits + body.credits,
      updatedAt: new Date()
    });
  });

  return NextResponse.json({ success: true });
});
