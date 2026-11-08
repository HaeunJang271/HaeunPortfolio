import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { getPublishedProjects } from "@/features/projects/seed-projects";
import { getPublishedPosts } from "@/features/content/public";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://haeun.dev").replace(/\/$/, "");
  const staticRoutes = ["", "about", "projects", "experience", "blog", "contact"];
  const entries: MetadataRoute.Sitemap = [];
  for (const locale of locales) for (const route of staticRoutes) entries.push({ url: `${base}/${locale}${route ? `/${route}` : ""}`, alternates: { languages: { ko: `${base}/ko${route ? `/${route}` : ""}`, en: `${base}/en${route ? `/${route}` : ""}` } }, changeFrequency: route === "" ? "weekly" : "monthly", priority: route === "" ? 1 : 0.7 });
  const [projects, posts] = await Promise.all([getPublishedProjects(), getPublishedPosts()]);
  for (const locale of locales) {
    for (const project of projects) entries.push({ url: `${base}/${locale}/projects/${project.slug}`, lastModified: project.updatedAt ? new Date(project.updatedAt) : undefined, changeFrequency: "monthly", priority: 0.6 });
    for (const post of posts) entries.push({ url: `${base}/${locale}/blog/${post.slug}`, lastModified: post.updatedAt ? new Date(post.updatedAt) : undefined, changeFrequency: "monthly", priority: 0.6 });
  }
  return entries;
}
