import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/session";
import { getFirebaseAdmin } from "@/lib/firebase/admin";
import { experienceInputSchema, postInputSchema, projectInputSchema } from "@/lib/validation/admin-content";

const schemas = { projects: projectInputSchema, posts: postInputSchema, experiences: experienceInputSchema };
type ManagedCollection = keyof typeof schemas;
function isManagedCollection(value: string): value is ManagedCollection { return value in schemas; }

export async function PATCH(request: NextRequest, context: { params: Promise<{ collection: string; id: string }> }) {
  if (request.headers.get("origin") !== request.nextUrl.origin) return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  if (!await getAdminSession()) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const { collection, id } = await context.params;
  if (!isManagedCollection(collection) || !/^[A-Za-z0-9_-]{1,150}$/.test(id)) return NextResponse.json({ error: "Invalid resource." }, { status: 404 });
  const parsed = schemas[collection].safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid content.", details: parsed.error.flatten() }, { status: 400 });
  try {
    const { db } = getFirebaseAdmin(); const ref = db.collection(collection).doc(id);
    const updated = await db.runTransaction(async (transaction) => {
      const current = await transaction.get(ref);
      if (!current.exists) return "missing";
      const slug = "slug" in parsed.data ? parsed.data.slug : null;
      if (slug) { const duplicates = await transaction.get(db.collection(collection).where("slug", "==", slug).limit(2)); if (duplicates.docs.some((doc) => doc.id !== id)) return "duplicate"; }
      transaction.set(ref, { ...parsed.data, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
      return "updated";
    });
    if (updated === "missing") return NextResponse.json({ error: "Not found." }, { status: 404 });
    if (updated === "duplicate") return NextResponse.json({ error: "That slug is already in use." }, { status: 409 });
    return NextResponse.json({ ok: true });
  }
  catch { return NextResponse.json({ error: "Unable to update content." }, { status: 503 }); }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ collection: string; id: string }> }) {
  if (request.headers.get("origin") !== request.nextUrl.origin) return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  if (!await getAdminSession()) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const { collection, id } = await context.params;
  if (!isManagedCollection(collection) || !/^[A-Za-z0-9_-]{1,150}$/.test(id)) return NextResponse.json({ error: "Invalid resource." }, { status: 404 });
  try { const { db } = getFirebaseAdmin(); await db.collection(collection).doc(id).delete(); return NextResponse.json({ ok: true }); }
  catch { return NextResponse.json({ error: "Unable to delete content." }, { status: 503 }); }
}
