"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

type Collection = "projects" | "posts" | "experiences";
type Entry = Record<string, unknown> & { id: string };
type MediaAsset = { path: string; url: string | null; name: string };

const examples: Record<Collection, Record<string, unknown>> = {
  projects: { slug: "new-project", title: "Project name", description: { ko: "", en: "" }, details: { ko: "", en: "" }, sections: {}, role: null, period: null, techStack: [], category: "web", thumbnail: null, gallery: [], githubUrl: null, liveUrl: null, status: "unknown", featured: false, published: false },
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
  const [advanced, setAdvanced] = useState(false);
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [mediaOpen, setMediaOpen] = useState(false);
  const adminPath = collection === "experiences" ? "experience" : collection === "posts" ? "blog" : "projects";

  function choose(item: Entry | null) {
    setSelected(item);
    const { id: _id, ...content } = item ?? examples[collection];
    setDraft(JSON.stringify(content, null, 2));
    setAdvanced(false);
  }

  async function load() {
    setStatus("Loading…");
    try {
      const response = await fetch(`/api/admin/${collection}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setItems(data.items);
      setStatus(data.items.length ? `${data.items.length} records` : "No records yet.");
      if (initialId) {
        const match = (data.items as Entry[]).find((item) => item.id === initialId);
        if (match) choose(match); else setStatus("Record not found.");
      } else if (startNew) choose(null);
    } catch (error) { setStatus(error instanceof Error ? error.message : "Unable to load records."); }
  }

  useEffect(() => { void load(); }, [collection, initialId, startNew]);

  function setField(path: string, value: unknown) {
    let root: Record<string, unknown>;
    try { root = JSON.parse(draft) as Record<string, unknown>; } catch { root = structuredClone(examples[collection]); }
    const parts = path.split(".");
    let target = root;
    for (const part of parts.slice(0, -1)) {
      const child = target[part];
      if (!child || typeof child !== "object" || Array.isArray(child)) target[part] = {};
      target = target[part] as Record<string, unknown>;
    }
    target[parts.at(-1)!] = value;
    setDraft(JSON.stringify(root, null, 2));
  }

  function getField(path: string): unknown {
    try { return path.split(".").reduce<unknown>((value, part) => value && typeof value === "object" ? (value as Record<string, unknown>)[part] : undefined, JSON.parse(draft)); } catch { return undefined; }
  }

  function textField(path: string, label: string, type = "text") {
    const value = getField(path);
    return <label key={path} className="block text-[11px] text-secondary">{label}<input type={type} value={typeof value === "string" ? value : ""} onChange={(event) => setField(path, event.target.value)} className="mt-1.5 block w-full border border-white/10 bg-background px-3 py-2.5 text-xs text-foreground outline-none focus:border-accent/50" /></label>;
  }

  function textArea(path: string, label: string, rows = 4) {
    const value = getField(path);
    return <label key={path} className="block text-[11px] text-secondary">{label}<textarea rows={rows} value={typeof value === "string" ? value : ""} onChange={(event) => setField(path, event.target.value)} className="mt-1.5 block w-full resize-y border border-white/10 bg-background px-3 py-2.5 text-xs leading-5 text-foreground outline-none focus:border-accent/50" /></label>;
  }

  function toggle(path: string, label: string) {
    return <label key={path} className="flex items-center gap-2 text-xs text-secondary"><input type="checkbox" checked={getField(path) === true} onChange={(event) => setField(path, event.target.checked)} className="accent-accent" />{label}</label>;
  }

  function listField(path: string, label: string, separator = ",") {
    const value = getField(path);
    return <label key={path} className="block text-[11px] text-secondary">{label}<input value={Array.isArray(value) ? value.join(`${separator} `) : ""} onChange={(event) => setField(path, event.target.value.split(separator).map((part) => part.trim()).filter(Boolean))} className="mt-1.5 block w-full border border-white/10 bg-background px-3 py-2.5 text-xs text-foreground outline-none focus:border-accent/50" /></label>;
  }

  function selectField(path: string, label: string, options: string[]) {
    const value = getField(path);
    return <label key={path} className="block text-[11px] text-secondary">{label}<select value={typeof value === "string" ? value : options[0]} onChange={(event) => setField(path, event.target.value)} className="mt-1.5 block w-full border border-white/10 bg-background px-3 py-2.5 text-xs text-foreground outline-none focus:border-accent/50">{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
  }

  async function save() {
    let content: unknown;
    try { content = JSON.parse(draft); } catch { setStatus("JSON format is invalid."); return; }
    setBusy(true);
    try {
      const response = await fetch(selected ? `/api/admin/${collection}/${selected.id}` : `/api/admin/${collection}`, { method: selected ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(content) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setStatus(selected ? "Saved." : "Created."); setSelected(null); router.push(`/admin/${adminPath}`); await load();
    } catch (error) { setStatus(error instanceof Error ? error.message : "Save failed."); }
    finally { setBusy(false); }
  }

  async function remove() {
    if (!selected || !window.confirm(`Delete “${labelOf(selected)}”?`)) return;
    setBusy(true);
    try { const response = await fetch(`/api/admin/${collection}/${selected.id}`, { method: "DELETE" }); if (!response.ok) throw new Error("Delete failed."); setSelected(null); router.push(`/admin/${adminPath}`); setStatus("Deleted."); await load(); }
    catch (error) { setStatus(error instanceof Error ? error.message : "Delete failed."); }
    finally { setBusy(false); }
  }

  async function importSeeds() {
    setBusy(true);
    try { const response = await fetch("/api/admin/seed-projects", { method: "POST" }); const data = await response.json(); if (!response.ok) throw new Error(data.error); setStatus(`Imported ${data.imported} drafts; ${data.skipped} already existed.`); await load(); }
    catch (error) { setStatus(error instanceof Error ? error.message : "Unable to import seed drafts."); }
    finally { setBusy(false); }
  }

  async function openMedia() {
    setMediaOpen(!mediaOpen);
    if (media.length) return;
    try { const response = await fetch("/api/admin/media", { cache: "no-store" }); const data = await response.json(); if (!response.ok) throw new Error(data.error); setMedia(data.items); }
    catch (error) { setStatus(error instanceof Error ? error.message : "Unable to load media."); }
  }

  let previewData: Record<string, unknown> | null = null;
  try { previewData = JSON.parse(draft) as Record<string, unknown>; } catch { /* invalid JSON is reported on save */ }
  const localized = (value: unknown, language = "ko") => value && typeof value === "object" ? String((value as Record<string, unknown>)[language] || (value as Record<string, unknown>).en || "") : String(value ?? "");

  return <div className="mt-8 grid gap-5 xl:grid-cols-[minmax(240px,.7fr)_minmax(0,1.3fr)]">
    <section className="border border-white/10 bg-surface">
      <div className="flex items-center justify-between border-b border-white/10 p-4"><h2 className="font-mono text-xs text-foreground">RECORDS</h2><button onClick={() => router.push(`/admin/${adminPath}/new`)} className="font-mono text-[10px] text-accent">+ NEW</button></div>
      {collection === "projects" && <button onClick={importSeeds} disabled={busy} className="mx-4 mt-3 border border-accent/30 px-2 py-2 font-mono text-[9px] text-accent disabled:opacity-50">IMPORT INITIAL DRAFTS</button>}
      <p className="px-4 py-2 text-[10px] text-muted" role="status">{status}</p>
      <ul className="max-h-[60vh] overflow-y-auto">{items.map((item) => <li key={item.id}><button onClick={() => router.push(`/admin/${adminPath}/${item.id}`)} className={`w-full border-t border-white/[0.06] px-4 py-3 text-left text-xs hover:bg-elevated ${selected?.id === item.id ? "text-accent" : "text-secondary"}`}><span className="block truncate">{labelOf(item)}</span><span className="mt-1 block font-mono text-[9px] text-muted">{String(item.published ? "PUBLISHED" : "DRAFT")}</span></button></li>)}</ul>
    </section>

    <section className="border border-white/10 bg-surface p-4">
      <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-mono text-xs text-foreground">{selected ? `EDIT / ${selected.id}` : "NEW RECORD"}</h2><div className="flex gap-3">{selected && <button onClick={remove} disabled={busy} className="font-mono text-[10px] text-error">DELETE</button>}<button onClick={() => setPreview(!preview)} className="font-mono text-[10px] text-accent">{preview ? "EDIT" : "PREVIEW"}</button></div></div>
      {preview ? <article className="mt-4 min-h-64 border border-white/10 bg-background p-5"><p className="font-mono text-[9px] text-accent">{collection.toUpperCase()} / PREVIEW</p><h3 className="mt-3 text-2xl">{localized(previewData?.title) || String(previewData?.organization ?? "Untitled")}</h3><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-secondary">{localized(previewData?.description) || localized(previewData?.excerpt)}</p>{collection === "posts" && <div className="prose prose-invert prose-sm mt-6 max-w-none"><ReactMarkdown rehypePlugins={[rehypeHighlight]}>{localized(previewData?.content)}</ReactMarkdown></div>}<p className="mt-5 font-mono text-[10px] text-muted">{Array.isArray(previewData?.techStack) ? previewData.techStack.join(" · ") : ""}</p></article> : <div className="mt-4 space-y-5">
        {collection === "projects" && <>
          <div className="grid gap-3 sm:grid-cols-2">{textField("title", "PROJECT TITLE")}{textField("slug", "SLUG")}{textField("category", "CATEGORY")}</div>
          <div className="grid gap-3 sm:grid-cols-2">{textArea("description.ko", "SHORT DESCRIPTION · KO", 3)}{textArea("description.en", "SHORT DESCRIPTION · EN", 3)}</div>
          <div className="grid gap-3 sm:grid-cols-2">{textArea("details.ko", "OVERVIEW · KO")}{textArea("details.en", "OVERVIEW · EN")}</div>
          <div className="grid gap-3 sm:grid-cols-2">{listField("techStack", "TECHNOLOGIES · COMMA SEPARATED")}{selectField("status", "PROJECT STATUS", ["unknown", "in-progress", "completed", "archived"])}</div>
          <div className="grid gap-3 sm:grid-cols-2">{textField("role.ko", "ROLE · KO")}{textField("role.en", "ROLE · EN")}</div>
          <div className="grid gap-3 sm:grid-cols-2">{textField("period.start", "START PERIOD")}{textField("period.end", "END PERIOD")}</div>
          <div className="grid gap-3 sm:grid-cols-2">{textField("thumbnail", "THUMBNAIL URL")}{listField("gallery", "GALLERY URLS · COMMA SEPARATED")}</div>
          <button type="button" onClick={() => void openMedia()} className="font-mono text-[10px] text-accent">{mediaOpen ? "CLOSE MEDIA PICKER" : "CHOOSE FROM MEDIA LIBRARY"}</button>
          {mediaOpen && <div className="grid grid-cols-3 gap-2 border border-white/10 p-2 sm:grid-cols-5">{media.filter((item) => item.url).map((item) => <button key={item.path} type="button" onClick={() => { setField("thumbnail", item.url); setMediaOpen(false); }} className="border border-white/10 p-1 text-left hover:border-accent"><img src={item.url!} alt={item.name} className="aspect-square w-full object-cover"/><span className="block truncate p-1 font-mono text-[8px] text-muted">USE AS THUMBNAIL</span></button>)}</div>}
          <div className="grid gap-3 sm:grid-cols-2">{textField("githubUrl", "REPOSITORY URL")}{textField("liveUrl", "LIVE DEMO URL")}</div>
          <div className="flex gap-5">{toggle("featured", "FEATURED")}{toggle("published", "PUBLISHED")}</div>
        </>}
        {collection === "posts" && <>
          <div className="grid gap-3 sm:grid-cols-2">{textField("slug", "SLUG")}{textField("category", "CATEGORY")}</div>
          <div className="grid gap-3 sm:grid-cols-2">{textField("title.ko", "TITLE · KO")}{textField("title.en", "TITLE · EN")}</div>
          <div className="grid gap-3 sm:grid-cols-2">{textArea("excerpt.ko", "EXCERPT · KO", 3)}{textArea("excerpt.en", "EXCERPT · EN", 3)}</div>
          {listField("tags", "TAGS · COMMA SEPARATED")}
          {textArea("content.ko", "MARKDOWN CONTENT · KO", 18)}
          {textArea("content.en", "MARKDOWN CONTENT · EN", 18)}
          <div className="grid gap-3 sm:grid-cols-2">{textField("seoTitle.ko", "SEO TITLE · KO")}{textField("seoTitle.en", "SEO TITLE · EN")}</div>
          <div className="grid gap-3 sm:grid-cols-2">{textArea("seoDescription.ko", "SEO DESCRIPTION · KO", 2)}{textArea("seoDescription.en", "SEO DESCRIPTION · EN", 2)}</div>
          {toggle("published", "PUBLISHED")}
        </>}
        {collection === "experiences" && <>
          <div className="grid gap-3 sm:grid-cols-2">{textField("organization", "COMPANY / ORGANIZATION")}{textField("period.start", "START PERIOD")}{textField("period.end", "END PERIOD (blank if current)")}</div>
          <div className="grid gap-3 sm:grid-cols-2">{textField("role.ko", "ROLE · KO")}{textField("role.en", "ROLE · EN")}</div>
          <div className="grid gap-3 sm:grid-cols-2">{textArea("description.ko", "DESCRIPTION · KO")}{textArea("description.en", "DESCRIPTION · EN")}</div>
          {listField("technologies", "TECHNOLOGIES · COMMA SEPARATED")}
          {toggle("published", "PUBLISHED")}
        </>}
        <details className="border-t border-white/10 pt-3"><summary className="cursor-pointer font-mono text-[10px] text-muted">ADVANCED JSON / EXTRA SECTIONS</summary><textarea value={draft} onChange={(event) => setDraft(event.target.value)} spellCheck={false} rows={18} className="mt-3 block w-full resize-y border border-white/10 bg-background p-4 font-mono text-[10px] leading-5 text-foreground outline-none focus:border-accent/50" /></details>
      </div>}
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-4"><p className="text-[10px] text-secondary">{status}</p><button onClick={save} disabled={busy} className="bg-accent px-4 py-2.5 font-mono text-[10px] font-semibold text-background disabled:opacity-50">{busy ? "SAVING…" : "SAVE DOCUMENT"}</button></div>
    </section>
  </div>;
}
