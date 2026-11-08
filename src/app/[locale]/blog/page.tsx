import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getPublishedPosts } from "@/features/content/public";
import { BlogExplorer } from "@/components/blog/blog-explorer";
import type { Metadata } from "next";
import { localizedAlternates } from "@/lib/i18n/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> { const { locale } = await params; if (!isLocale(locale)) return {}; return { title: locale === "ko" ? "개발 기록" : "Devlog", alternates: localizedAlternates(locale, "blog") }; }

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; if (!isLocale(locale)) notFound(); const posts = await getPublishedPosts(); return <div className="mx-auto min-h-[65vh] max-w-6xl px-5 py-20 md:px-8 md:py-28"><p className="font-mono text-xs text-accent">04 / DEVLOG</p><h1 className="mt-5 text-4xl font-semibold">{locale === "ko" ? "개발 기록" : "Devlog"}</h1><p className="mt-4 text-sm text-secondary">{locale === "ko" ? "기술적인 고민과 배운 내용을 기록합니다." : "Notes on technical decisions and things learned."}</p><BlogExplorer locale={locale} posts={posts}/></div>; }
