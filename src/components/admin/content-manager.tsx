"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

type Collection = "projects" | "posts" | "experiences";
type Entry = Record<string, unknown> & { id: string };

const examples: Record<Collection, Record<string, unknown>> = {
  projects: { slug: "new-project", title: "Project name", description: { ko: "", en: "" }, details: { ko: "", en: "" }, techStack: [], category: "web", thumbnail: null, gallery: [], githubUrl: null, liveUrl: null, status: "in-progress", featured: false, published: false },
  posts: { slug: "new-post", title: { ko: "", en: "" }, content: { ko: "", en: "" }, excerpt: { ko: "", en: "" }, category: "Development", tags: [], published: false, seoTitle: { ko: "", en: "" }, seoDescription: { ko: "", en: "" } },
  experiences: { organization: "", role: { ko: "", en: "" }, period: { start: "YYYY-MM", end: null }, description: { ko: "", en: "" }, responsibilities: [], technologies: [], relatedProjectId: null, published: false },
};

function labelOf(item: Entry) {
  const title = item.title;
  if (typeof title === "string") return title;
  if (title && typeof title === "object") return String((title as Record<string, unknown>).ko || (title as Record<string, unknown>).en || item.slug || item.organization || item.id);
  return String(item.organization || item.slug || item.id);
}

export function ContentManager({ collection, initialId, startNew = false }: { collection: Collection; initialId?: string; startNew?: boolean }) {
  const router = useRouter();
  const [items, setItems] = useState<Entry[]>([]);
  const [selected, setSelected] = useState<Entry | null>(null);
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState("Loading…");
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState(false);
  const adminPath = collection === "experiences" ? "experience" : collection === "posts" ? "blog" : "projects";

  async function load() {
    setStatus("Loading…");
    try { const response = await fetch(`/api/admin/${collection}`, { cache: "no-store" }); const data = await response.json(); if (!response.ok) throw new Error(data.error); setItems(data.items); setStatus(data.items.length ? `${data.items.length} records` : "No records yet."); if (initialId) { const match = (data.items as Entry[]).find((item) => item.id === initialId); if (match) choose(match); else setStatus("Record not found."); } else if (startNew) choose(null); }
    catch (error) { setStatus(error instanceof Error ? error.message : "Unable to load records."); }
  }

  useEffect(() => { void load(); }, [collection, initialId, startNew]);

  function choose(item: Entry | null) { setSelected(item); const { id: _id, ...content } = item ?? examples[collection]; setDraft(JSON.stringify(content, null, 2)); }

  async function save() {
    let content: unknown;
    try { content = JSON.parse(draft); } catch { setStatus("JSON format is invalid."); return; }
    setBusy(true);
    try { const response = await fetch(selected ? `/api/admin/${collection}/${selected.id}` : `/api/admin/${collection}`, { method: selected ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(content) }); const data = await response.json(); if (!response.ok) throw new Error(data.error); setStatus(selected ? "Saved." : "Created."); setSelected(null); router.push(`/admin/${adminPath}`); await load(); }
    catch (error) { setStatus(error instanceof Error ? error.message : "Save failed."); }
    finally { setBusy(false); }
  }

  async function remove() {
    if (!selected || !window.confirm(`Delete “${labelOf(selected)}”?`)) return;
    setBusy(true);
    try { const response = await fetch(`/api/admin/${collection}/${selected.id}`, { method: "DELETE" }); if (!response.ok) throw new Error("Delete failed."); setSelected(null); setStatus("Deleted."); router.push(`/admin/${adminPath}`); await load(); }
    catch (error) { setStatus(error instanceof Error ? error.message : "Delete failed."); }
    finally { setBusy(false); }
  }

  async function importSeeds() {
    setBusy(true);
    try { const response = await fetch("/api/admin/seed-projects", { method: "POST" }); const data = await response.json(); if (!response.ok) throw new Error(data.error); setStatus(`Imported ${data.imported} drafts; ${data.skipped} already existed.`); await load(); }
    catch (error) { setStatus(error instanceof Error ? error.message : "Unable to import seed drafts."); }
    finally { setBusy(false); }
  }

  let previewData: Record<string, unknown> | null = null;
  try { previewData = JSON.parse(draft) as Record<string, unknown>; } catch { /* invalid JSON is reported on save */ }
  const localized = (value: unknown) => value && typeof value === "object" ? String((value as Record<string, unknown>).ko || (value as Record<string, unknown>).en || "") : String(value ?? "");

  return <div className="mt-8 grid gap-5 xl:grid-cols-[minmax(240px,.7fr)_minmax(0,1.3fr)]"><section className="border border-white/10 bg-surface"><div className="flex items-center justify-between border-b border-white/10 p-4"><h2 className="font-mono text-xs text-foreground">RECORDS</h2><button onClick={() => router.push(`/admin/${adminPath}/new`)} className="font-mono text-[10px] text-accent">+ NEW</button></div>{collection === "projects" && <button onClick={importSeeds} disabled={busy} className="mx-4 mt-3 border border-accent/30 px-2 py-2 font-mono text-[9px] text-accent disabled:opacity-50">IMPORT INITIAL DRAFTS</button>}<p className="px-4 py-2 text-[10px] text-muted" role="status">{status}</p><ul className="max-h-[60vh] overflow-y-auto">{items.map((item) => <li key={item.id}><button onClick={() => router.push(`/admin/${adminPath}/${item.id}`)} className={`w-full border-t border-white/[0.06] px-4 py-3 text-left text-xs hover:bg-elevated ${selected?.id === item.id ? "text-accent" : "text-secondary"}`}><span className="block truncate">{labelOf(item)}</span><span className="mt-1 block font-mono text-[9px] text-muted">{String(item.published ? "PUBLISHED" : "DRAFT")}</span></button></li>)}</ul></section><section className="border border-white/10 bg-surface p-4"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-mono text-xs text-foreground">{selected ? `EDIT / ${selected.id}` : "NEW RECORD"}</h2><div className="flex gap-3">{selected && <button onClick={remove} disabled={busy} className="font-mono text-[10px] text-error">DELETE</button>}<button onClick={() => setPreview(!preview)} className="font-mono text-[10px] text-accent">{preview ? "EDIT JSON" : "PREVIEW"}</button></div></div>{preview ? <article className="mt-4 min-h-64 border border-white/10 bg-background p-5"><p className="font-mono text-[9px] text-accent">{collection.toUpperCase()} / PREVIEW</p><h3 className="mt-3 text-2xl">{localized(previewData?.title) || String(previewData?.organization ?? "Untitled")}</h3><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-secondary">{localized(previewData?.description) || localized(previewData?.excerpt)}</p>{collection === "posts" && <div className="prose prose-invert prose-sm mt-6 max-w-none"><ReactMarkdown rehypePlugins={[rehypeHighlight]}>{localized(previewData?.content)}</ReactMarkdown></div>}<p className="mt-5 font-mono text-[10px] text-muted">{Array.isArray(previewData?.techStack) ? previewData.techStack.join(" · ") : ""}</p></article> : <label className="mt-4 block font-mono text-[9px] text-muted">DOCUMENT JSON<textarea value={draft} onChange={(event) => setDraft(event.target.value)} spellCheck={false} rows={25} className="mt-2 block w-full resize-y border border-white/10 bg-background p-4 font-mono text-[11px] leading-5 text-foreground outline-none focus:border-accent/50" /></label>}<div className="mt-3 flex items-center justify-between"><p className="text-[10px] text-secondary">{status}</p><button onClick={save} disabled={busy} className="bg-accent px-4 py-2.5 font-mono text-[10px] font-semibold text-background disabled:opacity-50">{busy ? "SAVING…" : "SAVE DOCUMENT"}</button></div></section></div>;
}
