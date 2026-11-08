import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/session";
import { getFirebaseAdmin } from "@/lib/firebase/admin";
import { experienceInputSchema, postInputSchema, projectInputSchema } from "@/lib/validation/admin-content";

const schemas = { projects: projectInputSchema, posts: postInputSchema, experiences: experienceInputSchema };
type ManagedCollection = keyof typeof schemas;

function isManagedCollection(value: string): value is ManagedCollection { return value in schemas; }
function sameOrigin(request: NextRequest) { return request.headers.get("origin") === request.nextUrl.origin; }

export async function GET(request: NextRequest, context: { params: Promise<{ collection: string }> }) {
  if (!await getAdminSession()) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const { collection } = await context.params;
  if (!isManagedCollection(collection)) return NextResponse.json({ error: "Unknown collection." }, { status: 404 });
  try {
    const { db } = getFirebaseAdmin();
    const snapshot = await db.collection(collection).orderBy("updatedAt", "desc").limit(100).get().catch(async () => db.collection(collection).limit(100).get());
    return NextResponse.json({ items: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) });
  } catch { return NextResponse.json({ error: "Firebase is not configured." }, { status: 503 }); }
}

export async function POST(request: NextRequest, context: { params: Promise<{ collection: string }> }) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  if (!await getAdminSession()) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const { collection } = await context.params;
  if (!isManagedCollection(collection)) return NextResponse.json({ error: "Unknown collection." }, { status: 404 });
  const parsed = schemas[collection].safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid content.", details: parsed.error.flatten() }, { status: 400 });
  try {
    const { db } = getFirebaseAdmin();
    const ref = db.collection(collection).doc();
    const created = await db.runTransaction(async (transaction) => {
      const slug = "slug" in parsed.data ? parsed.data.slug : null;
      if (slug) { const duplicates = await transaction.get(db.collection(collection).where("slug", "==", slug).limit(1)); if (!duplicates.empty) return false; }
      transaction.create(ref, { ...parsed.data, createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() });
      return true;
    });
    if (!created) return NextResponse.json({ error: "That slug is already in use." }, { status: 409 });
    return NextResponse.json({ id: ref.id }, { status: 201 });
  } catch { return NextResponse.json({ error: "Unable to save content." }, { status: 503 }); }
}
