import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import { getPublishedPosts } from "@/features/content/public";
import { estimateReadingMinutes } from "@/features/content/reading-time";
import { isLocale } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> { const { locale, slug } = await params; const post = (await getPublishedPosts()).find((item) => item.slug === slug); if (!post) return {}; const language = locale === "en" ? "en" : "ko"; return { title: post.seoTitle?.[language] || post.title[language], description: post.seoDescription?.[language] || post.excerpt[language], openGraph: { type: "article", title: post.title[language], description: post.excerpt[language] } }; }

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) { const { locale: raw, slug } = await params; if (!isLocale(raw)) notFound(); const post = (await getPublishedPosts()).find((item) => item.slug === slug); if (!post) notFound(); return <article className="mx-auto max-w-3xl px-5 py-20 md:px-8 md:py-28"><p className="font-mono text-[10px] text-accent">{post.category.toUpperCase()} · {estimateReadingMinutes(post.content[raw])} MIN READ</p><h1 className="mt-5 text-4xl font-semibold leading-tight">{post.title[raw]}</h1><p className="mt-5 text-base leading-7 text-secondary">{post.excerpt[raw]}</p><div className="prose prose-invert prose-sm mt-12 max-w-none prose-headings:font-sans prose-headings:font-medium prose-a:text-accent prose-code:text-accent prose-pre:border prose-pre:border-white/10 prose-pre:bg-surface"><ReactMarkdown rehypePlugins={[rehypeHighlight]}>{post.content[raw]}</ReactMarkdown></div></article>; }
