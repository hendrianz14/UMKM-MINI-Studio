import { Timestamp, Transaction } from "firebase-admin/firestore";
import { TRIAL_WINDOW_HOURS, CREDIT_COST } from "./config";
import { getAdminFirestore } from "@/lib/firebase/admin";

type JobType = keyof typeof CREDIT_COST;

type CreditCheckResult = {
  creditsUsed: number;
  trialUsed: boolean;
  transaction: Transaction;
};

export async function withCreditConsumption(
  userId: string,
  jobType: JobType,
  handler: (params: CreditCheckResult) => Promise<void>
) {
  const db = getAdminFirestore();
  const userRef = db.collection("users").doc(userId);

  await db.runTransaction(async (transaction) => {
    const userSnap = await transaction.get(userRef);
    if (!userSnap.exists) {
      throw new Error("USER_NOT_FOUND");
    }

    const data = userSnap.data() as {
      credits: number;
      lastTrialAt?: Timestamp | null;
    };

    const creditsNeeded = CREDIT_COST[jobType];
    const now = Timestamp.now();
    let trialUsed = false;

    if (data.credits >= creditsNeeded) {
      transaction.update(userRef, {
        credits: data.credits - creditsNeeded,
        updatedAt: now
      });
    } else {
      // Check trial eligibility
      const lastTrialAt = data.lastTrialAt;
      const canUseTrial =
        !lastTrialAt ||
        now.toMillis() - lastTrialAt.toMillis() >= TRIAL_WINDOW_HOURS * 60 * 60 * 1000;

      if (!canUseTrial) {
        throw new Error("INSUFFICIENT_CREDITS");
      }

      trialUsed = true;
      transaction.update(userRef, {
        lastTrialAt: now,
        updatedAt: now
      });
    }

    await handler({
      creditsUsed: trialUsed ? 0 : creditsNeeded,
      trialUsed,
      transaction
    });
  });
}

export function shouldRestoreCredits(status: string) {
  return status === "failed";
}
