"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { PostDocument } from "@/types/content";
import { estimateReadingMinutes } from "@/features/content/reading-time";

export function BlogExplorer({ locale, posts }: { locale: Locale; posts: PostDocument[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const categories = useMemo(() => [...new Set(posts.map((post) => post.category))].sort(), [posts]);
  const filtered = posts.filter((post) => `${post.title[locale]} ${post.excerpt[locale]} ${post.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase()) && (category === "all" || post.category === category));
  const ko = locale === "ko";
  return <><div className="mt-9 grid gap-3 border border-white/[0.08] bg-surface p-4 sm:grid-cols-[1fr_auto]"><label className="relative"><span className="sr-only">{ko ? "개발 기록 검색" : "Search devlog"}</span><Search size={14} className="absolute left-3 top-3 text-muted"/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={ko ? "제목, 내용, 태그 검색" : "Search title, text, tags"} className="w-full border border-white/10 bg-background py-2.5 pl-9 pr-3 text-xs text-foreground outline-none focus:border-accent/50"/></label><label className="font-mono text-[9px] text-muted">CATEGORY<select value={category} onChange={(event) => setCategory(event.target.value)} className="ml-2 border border-white/10 bg-background px-2 py-2.5 text-[10px] text-secondary"><option value="all">ALL</option>{categories.map((value) => <option key={value}>{value}</option>)}</select></label></div><div className="mt-5 space-y-3">{filtered.length ? filtered.map((post) => <Link key={post.id} href={`/${locale}/blog/${post.slug}`} className="block border border-white/[0.08] bg-surface/60 p-6 transition-colors hover:border-accent/40"><p className="font-mono text-[9px] text-muted">{post.category.toUpperCase()} · {estimateReadingMinutes(post.content[locale])} MIN READ</p><h2 className="mt-3 text-xl font-medium">{post.title[locale]}</h2><p className="mt-2 text-sm leading-6 text-secondary">{post.excerpt[locale]}</p><ul className="mt-4 flex gap-2">{post.tags.map((tag) => <li key={tag} className="font-mono text-[9px] text-accent">#{tag}</li>)}</ul></Link>) : <div className="border border-white/[0.08] bg-surface/60 p-7 font-mono text-xs text-muted">{posts.length ? (ko ? "검색 결과가 없습니다." : "No matching posts.") : (ko ? "아직 게시된 글이 없습니다." : "No posts have been published yet.")}</div>}</div></>;
}
