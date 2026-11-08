"use client";

import { useEffect, useState } from "react";

type MediaItem = { path: string; name: string; contentType?: string; size: number; createdAt?: string; url: string | null };

export function MediaLibrary() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [message, setMessage] = useState("Loading media…");
  const [busy, setBusy] = useState(false);

  async function load() { try { const response = await fetch("/api/admin/media", { cache: "no-store" }); const data = await response.json(); if (!response.ok) throw new Error(data.error); setItems(data.items); setMessage(data.items.length ? `${data.items.length} files` : "No uploaded images."); } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to load media."); } }
  useEffect(() => { void load(); }, []);

  async function upload(form: FormData) { setBusy(true); setMessage("Uploading…"); try { const response = await fetch("/api/admin/media", { method: "POST", body: form }); const data = await response.json(); if (!response.ok) throw new Error(data.error); setMessage("Upload complete."); await load(); } catch (error) { setMessage(error instanceof Error ? error.message : "Upload failed."); } finally { setBusy(false); } }
  async function remove(path: string) { if (!window.confirm("Delete this uploaded image?")) return; try { const response = await fetch("/api/admin/media", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ path }) }); if (!response.ok) throw new Error("Delete failed."); await load(); } catch (error) { setMessage(error instanceof Error ? error.message : "Delete failed."); } }

  return <><form action={upload} className="mt-7 flex flex-wrap items-end gap-4 border border-white/10 bg-surface p-4"><label className="text-xs text-secondary">Image file<input required name="file" type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="mt-2 block max-w-full text-xs text-muted file:mr-3 file:border-0 file:bg-elevated file:px-3 file:py-2 file:font-mono file:text-[10px] file:text-foreground" /></label><button disabled={busy} className="bg-accent px-4 py-2.5 font-mono text-[10px] font-semibold text-background disabled:opacity-50">{busy ? "UPLOADING…" : "UPLOAD IMAGE"}</button><p role="status" className="text-xs text-secondary">{message} <span className="text-muted">· JPG, PNG, WebP, GIF · Max 8 MB</span></p></form><ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{items.map((item) => <li key={item.path} className="overflow-hidden border border-white/10 bg-surface">{item.url && <img src={item.url} alt={item.name} className="aspect-[4/3] w-full object-cover" loading="lazy" />}<div className="p-3"><p className="truncate font-mono text-[10px] text-foreground">{item.name}</p><p className="mt-1 text-[10px] text-muted">{(item.size / 1024).toFixed(0)} KB · {item.contentType}</p><button onClick={() => remove(item.path)} className="mt-3 font-mono text-[9px] text-error">DELETE</button></div></li>)}</ul></>;
}
