"use client";

import { useEffect, useState } from "react";

type Stats = { publishedProjects: number; publishedPosts: number; drafts: number; unread: number; recent: { id: string; title: string | Record<string, string>; updatedAt: string | null }[] };

export function DashboardStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { void fetch("/api/admin/stats", { cache: "no-store" }).then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.error); setStats(data); }).catch((cause) => setError(cause instanceof Error ? cause.message : "Unable to load metrics.")); }, []);
  const values = stats ? [stats.publishedProjects, stats.publishedPosts, stats.drafts, stats.unread] : [null, null, null, null];
  return <><section className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{["Published projects", "Published posts", "Drafts", "Unread messages"].map((label, index) => <article key={label} className="border border-white/10 bg-surface p-5"><p className="font-mono text-[10px] text-muted">{label.toUpperCase()}</p><p className="mt-5 font-mono text-2xl text-accent">{values[index] ?? "—"}</p></article>)}</section>{error && <p role="status" className="mt-5 text-xs text-warning">{error}</p>}<section className="mt-8 border border-white/10 bg-surface p-5"><h2 className="font-mono text-xs text-foreground">RECENT CONTENT UPDATES</h2>{stats?.recent.length ? <ul className="mt-4 divide-y divide-white/[0.06]">{stats.recent.map((item) => <li key={item.id} className="flex justify-between gap-5 py-3 text-xs"><span className="truncate text-secondary">{typeof item.title === "string" ? item.title : item.title.ko || item.title.en || item.id}</span><time className="shrink-0 font-mono text-[9px] text-muted">{item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : "—"}</time></li>)}</ul> : <p className="mt-4 text-xs text-muted">{error || "No updates yet."}</p>}</section></>;
}
