import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";

import { db } from "./firebase";

export async function ensureUserProfile(uid: string, email?: string | null, displayName?: string | null) {
  const reference = doc(db, "users", uid);
  const snapshot = await getDoc(reference);

  if (!snapshot.exists()) {
    await setDoc(reference, {
      email: email ?? "",
      displayName: displayName ?? "",
      credits: 50,
      lastTrialAt: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return;
  }

  const data = snapshot.data() ?? {};
  await updateDoc(reference, {
    email: (data.email as string | undefined) || email || "",
    displayName: (data.displayName as string | undefined) || displayName || "",
    updatedAt: serverTimestamp()
  });
}
