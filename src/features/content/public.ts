import "server-only";
import { getFirebaseAdmin } from "@/lib/firebase/admin";
import type { ExperienceDocument, PostDocument, PublicSiteSettings } from "@/types/content";

function iso(value: unknown) {
  return value && typeof value === "object" && "toDate" in value && typeof value.toDate === "function" ? value.toDate().toISOString() : "";
}

export async function getPublishedPosts(): Promise<PostDocument[]> {
  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) return [];
  try { const { db } = getFirebaseAdmin(); const snapshot = await db.collection("posts").where("published", "==", true).orderBy("updatedAt", "desc").get(); return snapshot.docs.map((doc) => { const data = doc.data(); return { ...data, id: doc.id, createdAt: iso(data.createdAt), updatedAt: iso(data.updatedAt) } as PostDocument; }); }
  catch (error) { console.error("Unable to load published posts", error instanceof Error ? error.message : "unknown error"); return []; }
}

export async function getPublishedExperiences(): Promise<ExperienceDocument[]> {
  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) return [];
  try { const { db } = getFirebaseAdmin(); const snapshot = await db.collection("experiences").where("published", "==", true).orderBy("period.start", "desc").get(); return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as ExperienceDocument)); }
  catch (error) { console.error("Unable to load experiences", error instanceof Error ? error.message : "unknown error"); return []; }
}

export async function getPublicSettings(): Promise<PublicSiteSettings> {
  const fallback: PublicSiteSettings = {
    siteTitle: { ko: "HAEUN.dev", en: "HAEUN.dev" }, defaultLocale: "ko",
    profile: { name: "Haeun Jang", role: { ko: "소프트웨어 개발자", en: "Software Developer" }, introduction: { ko: "실제 문제를 해결하는 소프트웨어를 만듭니다.", en: "Building software that solves real problems." }, location: "" },
    socialLinks: { github: "", linkedin: "", website: "" }, contactEmail: "", seo: { description: { ko: "장하은 소프트웨어 개발자 포트폴리오", en: "Portfolio of Haeun Jang, Software Developer." }, keywords: [] },
  };
  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) return fallback;
  try { const { db } = getFirebaseAdmin(); const doc = await db.collection("siteSettings").doc("public").get(); return doc.exists ? { ...fallback, ...(doc.data() as Partial<PublicSiteSettings>) } : fallback; }
  catch { return fallback; }
}

