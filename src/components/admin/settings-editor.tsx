"use client";

import { useEffect, useState } from "react";

const defaults = { siteTitle: { ko: "HAEUN.dev", en: "HAEUN.dev" }, defaultLocale: "ko", profile: { name: "Haeun Jang", role: { ko: "소프트웨어 개발자", en: "Software Developer" }, introduction: { ko: "", en: "" }, location: "South Korea" }, socialLinks: { github: "", linkedin: "", website: "" }, contactEmail: "", seo: { description: { ko: "", en: "" }, keywords: [] } };

export function SettingsEditor() {
  const [value, setValue] = useState(JSON.stringify(defaults, null, 2));
  const [message, setMessage] = useState("Loading settings…");
  useEffect(() => { void fetch("/api/admin/settings", { cache: "no-store" }).then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.error); if (data.settings) setValue(JSON.stringify(data.settings, null, 2)); setMessage(data.settings ? "Settings loaded." : "Using initial values. Add verified social and contact details."); }).catch((error) => setMessage(error instanceof Error ? error.message : "Unable to load settings.")); }, []);
  async function save() { try { const settings = JSON.parse(value); const response = await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) }); const data = await response.json(); if (!response.ok) throw new Error(data.error); setMessage("Settings saved."); } catch (error) { setMessage(error instanceof Error ? error.message : "Invalid JSON."); } }
  return <><label className="mt-7 block font-mono text-[9px] text-muted">SETTINGS JSON<textarea value={value} onChange={(event) => setValue(event.target.value)} rows={28} className="mt-2 block w-full max-w-3xl border border-white/10 bg-surface p-4 font-mono text-xs leading-6 text-foreground outline-none focus:border-accent/50" /></label><div className="mt-3 flex items-center gap-4"><button onClick={save} className="bg-accent px-4 py-2.5 font-mono text-[10px] font-semibold text-background">SAVE SETTINGS</button><p role="status" className="text-xs text-secondary">{message}</p></div></>;
}
