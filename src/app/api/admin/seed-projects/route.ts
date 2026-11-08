import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/session";
import { getFirebaseAdmin } from "@/lib/firebase/admin";
import { seedProjects } from "@/features/projects/seed-projects";

export async function POST(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin) return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  if (!await getAdminSession()) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try {
    const { db } = getFirebaseAdmin();
    const records = await Promise.all(seedProjects.map(async (project) => ({ project, exists: (await db.collection("projects").doc(project.id).get()).exists })));
    const missing = records.filter(({ exists }) => !exists);
    const batch = db.batch();
    for (const { project } of missing) { const { createdAt: _created, updatedAt: _updated, ...data } = project; batch.set(db.collection("projects").doc(project.id), { ...data, published: false, featured: false, createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() }); }
    if (missing.length) await batch.commit();
    return NextResponse.json({ imported: missing.length, skipped: records.length - missing.length });
  } catch { return NextResponse.json({ error: "Unable to import project drafts. Check Firebase configuration." }, { status: 503 }); }
}
