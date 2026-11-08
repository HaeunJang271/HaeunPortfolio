import "server-only";
import { cookies } from "next/headers";
import { getFirebaseAdmin, isAllowedAdmin } from "@/lib/firebase/admin";

export const SESSION_COOKIE = "__session";

export async function getAdminSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { auth } = getFirebaseAdmin();
    const decoded = await auth.verifySessionCookie(token, true);
    if (!isAllowedAdmin(decoded.email)) return null;
    return decoded;
  } catch {
    return null;
  }
}
