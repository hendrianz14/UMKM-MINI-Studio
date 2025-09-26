import { NextResponse } from "next/server";
import { verifyCallbackSignature } from "@/lib/n8n/client";
import { getAdminFirestore } from "@/lib/firebase/admin";

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get("x-callback-signature");

  if (!verifyCallbackSignature({ signature, payload })) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const data = JSON.parse(payload) as {
    jobId: string;
    status: "queued" | "processing" | "done" | "failed";
    resultImageUrl?: string;
    captions?: string[];
    hashtags?: string[];
    meta?: Record<string, unknown>;
    userId?: string;
  };

  const db = getAdminFirestore();
  const jobRef = db.collection("jobs").doc(data.jobId);
  const jobSnap = await jobRef.get();

  if (!jobSnap.exists) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const jobData = jobSnap.data()!;

  await jobRef.update({
    status: data.status,
    updatedAt: new Date(),
    result: {
      imageUrl: data.resultImageUrl ?? jobData.result?.imageUrl ?? null,
      captions: data.captions ?? jobData.result?.captions ?? [],
      hashtags: data.hashtags ?? jobData.result?.hashtags ?? [],
      meta: data.meta ?? jobData.result?.meta ?? {}
    }
  });

  if (data.status === "done" && data.resultImageUrl) {
    const outputRef = db.collection("outputs").doc();
    await outputRef.set({
      userId: jobData.userId,
      sourceJobId: data.jobId,
      imageUrl: data.resultImageUrl,
      title: jobData.input?.productName ?? "Output",
      tags: data.hashtags ?? [],
      createdAt: new Date()
    });
  }

  return NextResponse.json({ received: true });
}
