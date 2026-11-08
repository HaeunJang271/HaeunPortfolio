import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/session";
import { getFirebaseAdmin } from "@/lib/firebase/admin";

export const runtime = "nodejs";
const maxBytes = 8 * 1024 * 1024;
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function GET() {
  if (!await getAdminSession()) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try {
    const { bucket } = getFirebaseAdmin();
    const [files] = await bucket.getFiles({ prefix: "media/", maxResults: 200 });
    const items = await Promise.all(files.map(async (file) => {
      const [metadata] = await file.getMetadata();
      const token = metadata.metadata?.firebaseStorageDownloadTokens;
      return { path: file.name, name: file.name.split("/").at(-1), contentType: metadata.contentType, size: Number(metadata.size ?? 0), createdAt: metadata.timeCreated, url: token ? `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.name)}?alt=media&token=${token}` : null };
    }));
    return NextResponse.json({ items });
  } catch { return NextResponse.json({ error: "Firebase Storage is not configured." }, { status: 503 }); }
}

export async function POST(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin) return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  if (!await getAdminSession()) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File) || !allowedTypes.has(file.type) || file.size < 1 || file.size > maxBytes) return NextResponse.json({ error: "Choose a JPG, PNG, WebP, or GIF image under 8 MB." }, { status: 400 });
  try {
    const { bucket } = getFirebaseAdmin();
    const ext = ({ "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" } as const)[file.type as "image/jpeg" | "image/png" | "image/webp" | "image/gif"];
    const path = `media/${randomUUID()}.${ext}`;
    const token = randomUUID();
    const object = bucket.file(path);
    await object.save(Buffer.from(await file.arrayBuffer()), { resumable: false, metadata: { contentType: file.type, metadata: { firebaseStorageDownloadTokens: token } } });
    return NextResponse.json({ path, name: file.name, contentType: file.type, size: file.size, url: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(path)}?alt=media&token=${token}` }, { status: 201 });
  } catch { return NextResponse.json({ error: "Upload failed. Check the Firebase Storage bucket configuration." }, { status: 503 }); }
}

export async function DELETE(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin) return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  if (!await getAdminSession()) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const { path } = await request.json().catch(() => ({}));
  if (typeof path !== "string" || !/^media\/[A-Za-z0-9._-]+$/.test(path)) return NextResponse.json({ error: "Invalid media path." }, { status: 400 });
  try { const { bucket } = getFirebaseAdmin(); await bucket.file(path).delete({ ignoreNotFound: true }); return NextResponse.json({ ok: true }); }
  catch { return NextResponse.json({ error: "Delete failed." }, { status: 503 }); }
}
