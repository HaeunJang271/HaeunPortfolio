import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/session";
import { getFirebaseAdmin } from "@/lib/firebase/admin";

export async function GET() {
  if (!await getAdminSession()) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try {
    const { db } = getFirebaseAdmin();
    const [projects, posts, messages] = await Promise.all(["projects", "posts", "messages"].map((name) => db.collection(name).get()));
    const publishedProjects = projects.docs.filter((doc) => doc.get("published") === true).length;
    const publishedPosts = posts.docs.filter((doc) => doc.get("published") === true).length;
    const drafts = [...projects.docs, ...posts.docs].filter((doc) => doc.get("published") !== true).length;
    const unread = messages.docs.filter((doc) => doc.get("status") === "unread").length;
    const recent = [...projects.docs, ...posts.docs].sort((a, b) => (b.get("updatedAt")?.toMillis?.() ?? 0) - (a.get("updatedAt")?.toMillis?.() ?? 0)).slice(0, 5).map((doc) => ({ id: doc.id, title: doc.get("title") ?? doc.get("slug") ?? doc.id, updatedAt: doc.get("updatedAt")?.toDate?.().toISOString() ?? null }));
    return NextResponse.json({ publishedProjects, publishedPosts, drafts, unread, recent });
  } catch { return NextResponse.json({ error: "Firebase is not configured." }, { status: 503 }); }
}
