import crypto from "node:crypto";

export async function dispatchJobToN8n(payload: Record<string, unknown>) {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!webhookUrl) {
    throw new Error("Missing N8N_WEBHOOK_URL env");
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to dispatch n8n job: ${response.status} ${text}`);
  }

  return response.json().catch(() => ({}));
}

export function verifyCallbackSignature({
  signature,
  payload
}: {
  signature: string | null;
  payload: string;
}) {
  const secret = process.env.CALLBACK_SECRET;
  if (!secret) {
    throw new Error("Missing CALLBACK_SECRET env");
  }

  if (!signature) return false;

  const digest = crypto
    .createHmac("sha256", secret)
    .update(payload, "utf8")
    .digest("hex");

  const sigBuffer = Buffer.from(signature);
  const digestBuffer = Buffer.from(digest);
  if (sigBuffer.length !== digestBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(sigBuffer, digestBuffer);
}
