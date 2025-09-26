import { describe, expect, it, beforeEach } from "vitest";
import { verifyCallbackSignature } from "@/lib/n8n/client";
import crypto from "node:crypto";

describe("verifyCallbackSignature", () => {
  beforeEach(() => {
    process.env.CALLBACK_SECRET = "secret-key";
  });

  it("returns true for valid signatures", () => {
    const payload = JSON.stringify({ hello: "world" });
    const signature = crypto.createHmac("sha256", "secret-key").update(payload).digest("hex");
    expect(verifyCallbackSignature({ signature, payload })).toBe(true);
  });

  it("returns false for invalid signatures", () => {
    const payload = JSON.stringify({ hello: "world" });
    const signature = "invalid";
    expect(verifyCallbackSignature({ signature, payload })).toBe(false);
  });
});
