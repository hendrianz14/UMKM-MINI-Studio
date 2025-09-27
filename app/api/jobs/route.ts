import { NextResponse } from "next/server";
import { handleApi } from "@/lib/api/response";
import { requireUser, verifyRequestAuth } from "@/lib/api/auth";
import { z } from "zod";
import { withCreditConsumption } from "@/lib/credits";
import { getAdminFirestore } from "@/lib/firebase/admin";
import { dispatchJobToN8n } from "@/lib/n8n/client";
import { badRequest } from "@/lib/api/errors";
import { randomUUID } from "node:crypto";

const schema = z.object({
  imagePath: z.string().min(1),
  productName: z.string().min(2),
  description: z.string().min(2),
  style: z.string().min(1),
  jobType: z.enum(["generate", "edit"]),
  clientId: z.string().optional(),
  options: z
    .object({
      tone: z.number().min(0).max(100).optional(),
      luxury: z.number().min(0).max(100).optional(),
      templateId: z.string().optional()
    })
    .optional()
});

export const GET = handleApi(async (request, _context) => {
  const auth = await verifyRequestAuth(request);
  const userId = auth.uid;
  const db = getAdminFirestore();
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit") ?? 20);

  const snapshot = await db
    .collection("jobs")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();

  const items = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate?.()?.toISOString?.() ?? null,
    updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString?.() ?? null
  }));

  return NextResponse.json({ items });
});

export const POST = handleApi(async (request, _context) => {
  const decoded = await requireUser(request);
  const json = await request.json();
  const body = schema.parse(json);

  const db = getAdminFirestore();
  const jobId = randomUUID();
  const jobRef = db.collection("jobs").doc(jobId);

  try {
    await withCreditConsumption(decoded.uid, body.jobType, async ({ creditsUsed, trialUsed, transaction }) => {
      transaction.set(jobRef, {
        userId: decoded.uid,
        type: body.jobType,
        input: {
          imageStoragePath: body.imagePath,
          productName: body.productName,
          description: body.description,
          style: body.style,
          options: body.options ?? null
        },
        status: "queued",
        creditsUsed,
        trialUsed,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });
  } catch (error) {
    if (error instanceof Error && ["INSUFFICIENT_CREDITS", "USER_NOT_FOUND"].includes(error.message)) {
      badRequest(error.message);
    }
    throw error;
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const callbackUrl = `${baseUrl}/api/jobs/callback`;

  await dispatchJobToN8n({
    jobId,
    userId: decoded.uid,
    imagePath: body.imagePath,
    productName: body.productName,
    description: body.description,
    style: body.style,
    jobType: body.jobType,
    clientId: body.clientId,
    options: body.options,
    callbackUrl
  });

  return NextResponse.json({ jobId });
});
