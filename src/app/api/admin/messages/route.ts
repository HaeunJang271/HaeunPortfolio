import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/session";
import { getFirebaseAdmin } from "@/lib/firebase/admin";

export async function GET() {
  if (!await getAdminSession()) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try { const { db } = getFirebaseAdmin(); const result = await db.collection("messages").orderBy("createdAt", "desc").limit(100).get(); return NextResponse.json({ items: result.docs.map((doc) => ({ id: doc.id, ...doc.data() })) }); }
  catch { return NextResponse.json({ error: "Unable to load messages." }, { status: 503 }); }
}

export async function PATCH(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin) return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  if (!await getAdminSession()) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const body = await request.json().catch(() => null);
  if (!body || typeof body.id !== "string" || !["unread", "read", "replied", "archived"].includes(body.status)) return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  try { const { db } = getFirebaseAdmin(); await db.collection("messages").doc(body.id).update({ status: body.status }); return NextResponse.json({ ok: true }); }
  catch { return NextResponse.json({ error: "Unable to update message." }, { status: 503 }); }
}

export async function DELETE(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin) return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  if (!await getAdminSession()) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const { id } = await request.json().catch(() => ({}));
  if (typeof id !== "string" || !/^[A-Za-z0-9_-]{1,150}$/.test(id)) return NextResponse.json({ error: "Invalid message id." }, { status: 400 });
  try { const { db } = getFirebaseAdmin(); await db.collection("messages").doc(id).delete(); return NextResponse.json({ ok: true }); }
  catch { return NextResponse.json({ error: "Unable to delete message." }, { status: 503 }); }
}
