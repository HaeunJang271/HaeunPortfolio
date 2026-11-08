import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getFirebaseAdmin, isAllowedAdmin } from "@/lib/firebase/admin";
import { SESSION_COOKIE } from "@/lib/auth/session";

const sessionSchema = z.object({ idToken: z.string().min(20).max(10_000) });
const maxAge = 60 * 60 * 24 * 5;

export async function POST(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin) return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  const parsed = sessionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  try {
    const { auth } = getFirebaseAdmin();
    const decoded = await auth.verifyIdToken(parsed.data.idToken, true);
    if (!isAllowedAdmin(decoded.email)) return NextResponse.json({ error: "Not authorized." }, { status: 403 });
    const sessionCookie = await auth.createSessionCookie(parsed.data.idToken, { expiresIn: maxAge * 1000 });
    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE, sessionCookie, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge });
    return response;
  } catch {
    return NextResponse.json({ error: "Unable to create an authenticated session." }, { status: 401 });
  }
}

export async function DELETE(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin) return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
  return response;
}
