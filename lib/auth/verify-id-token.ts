import { getAdminAuth } from "@/lib/firebase/admin";

export async function verifyIdToken(idToken: string) {
  const auth = getAdminAuth();
  const decoded = await auth.verifyIdToken(idToken, true);
  return decoded;
}
