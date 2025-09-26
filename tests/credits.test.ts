import { describe, expect, it } from "vitest";
import { shouldRestoreCredits } from "@/lib/credits";

describe("shouldRestoreCredits", () => {
  it("restores only when status failed", () => {
    expect(shouldRestoreCredits("failed")).toBe(true);
    expect(shouldRestoreCredits("done")).toBe(false);
    expect(shouldRestoreCredits("processing")).toBe(false);
  });
});
