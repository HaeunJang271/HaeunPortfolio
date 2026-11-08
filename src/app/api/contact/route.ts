import { createHash } from "node:crypto";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation/contact";
import { getFirebaseAdmin } from "@/lib/firebase/admin";

export async function POST(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin) return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "입력 내용을 확인해 주세요." }, { status: 400 });
  try {
    const { db } = getFirebaseAdmin();
    const ip = request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
    const key = createHash("sha256").update(ip).digest("hex");
    const rateRef = db.collection("rateLimits").doc(`contact-${key}`);
    const now = Timestamp.now();
    const accepted = await db.runTransaction(async (transaction) => {
      const current = await transaction.get(rateRef);
      const last = current.get("windowStart") as Timestamp | undefined;
      const count = current.get("count") as number | undefined;
      if (last && now.toMillis() - last.toMillis() < 60 * 60 * 1000 && (count ?? 0) >= 5) return false;
      transaction.set(rateRef, { windowStart: last && now.toMillis() - last.toMillis() < 60 * 60 * 1000 ? last : now, count: last && now.toMillis() - last.toMillis() < 60 * 60 * 1000 ? (count ?? 0) + 1 : 1, updatedAt: FieldValue.serverTimestamp(), expireAt: Timestamp.fromMillis(now.toMillis() + 2 * 60 * 60 * 1000) });
      return true;
    });
    if (!accepted) return NextResponse.json({ error: "요청이 많습니다. 잠시 후 다시 시도해 주세요." }, { status: 429 });
    const { website: _honeypot, ...message } = parsed.data;
    await db.collection("messages").add({ ...message, status: "unread", createdAt: FieldValue.serverTimestamp() });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Contact submission failed", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json({ error: "문의 저장에 실패했습니다. 잠시 후 다시 시도해 주세요." }, { status: 503 });
  }
}
