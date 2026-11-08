import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth/session";
import { getFirebaseAdmin } from "@/lib/firebase/admin";

const safeUrl = z.string().url().refine((value) => { try { return new URL(value).protocol === "https:"; } catch { return false; } });
const settingsSchema = z.object({
  siteTitle: z.object({ ko: z.string().max(120), en: z.string().max(120) }),
  defaultLocale: z.enum(["ko", "en"]),
  profile: z.object({ name: z.string().max(120), role: z.object({ ko: z.string().max(120), en: z.string().max(120) }), introduction: z.object({ ko: z.string().max(2000), en: z.string().max(2000) }), location: z.string().max(120).optional() }),
  socialLinks: z.object({ github: safeUrl.or(z.literal("")), linkedin: safeUrl.or(z.literal("")), website: safeUrl.or(z.literal("")) }),
  contactEmail: z.string().email().or(z.literal("")),
  seo: z.object({ description: z.object({ ko: z.string().max(300), en: z.string().max(300) }), keywords: z.array(z.string().max(50)).max(30) }),
});

export async function GET() { if (!await getAdminSession()) return NextResponse.json({ error: "Unauthorized." }, { status: 401 }); try { const { db } = getFirebaseAdmin(); const doc = await db.collection("siteSettings").doc("public").get(); return NextResponse.json({ settings: doc.exists ? doc.data() : null }); } catch { return NextResponse.json({ error: "Firebase is not configured." }, { status: 503 }); } }

export async function PUT(request: NextRequest) { if (request.headers.get("origin") !== request.nextUrl.origin) return NextResponse.json({ error: "Invalid origin." }, { status: 403 }); if (!await getAdminSession()) return NextResponse.json({ error: "Unauthorized." }, { status: 401 }); const parsed = settingsSchema.safeParse(await request.json().catch(() => null)); if (!parsed.success) return NextResponse.json({ error: "Invalid settings.", details: parsed.error.flatten() }, { status: 400 }); try { const { db } = getFirebaseAdmin(); await db.collection("siteSettings").doc("public").set({ ...parsed.data, updatedAt: FieldValue.serverTimestamp() }, { merge: true }); return NextResponse.json({ ok: true }); } catch { return NextResponse.json({ error: "Unable to save settings." }, { status: 503 }); } }
