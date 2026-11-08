"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { ProjectDocument } from "@/types/content";

export function ProjectExplorer({ locale, projects }: { locale: Locale; projects: ProjectDocument[] }) {
  const [query, setQuery] = useState("");
  const [technology, setTechnology] = useState("all");
  const [category, setCategory] = useState("all");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const technologies = useMemo(() => [...new Set(projects.flatMap((project) => project.techStack))].sort(), [projects]);
  const categories = useMemo(() => [...new Set(projects.map((project) => project.category))].sort(), [projects]);
  const filtered = projects.filter((project) => {
    const term = query.toLowerCase();
    const matchesText = !term || `${project.title} ${project.description[locale]} ${project.techStack.join(" ")}`.toLowerCase().includes(term);
    return matchesText && (!featuredOnly || project.featured) && (technology === "all" || project.techStack.includes(technology)) && (category === "all" || project.category === category);
  });
  const ko = locale === "ko";
  return <>
    <div className="mt-9 grid gap-3 border border-white/[0.08] bg-surface p-4 sm:grid-cols-[1fr_auto_auto_auto]">
      <label className="relative"><span className="sr-only">{ko ? "프로젝트 검색" : "Search projects"}</span><Search size={14} className="absolute left-3 top-3 text-muted"/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={ko ? "이름, 설명, 기술 검색" : "Search name, description, tech"} className="w-full border border-white/10 bg-background py-2.5 pl-9 pr-3 text-xs text-foreground outline-none focus:border-accent/50"/></label>
      <label className="font-mono text-[9px] text-muted">CATEGORY<select value={category} onChange={(event) => setCategory(event.target.value)} className="ml-2 border border-white/10 bg-background px-2 py-2.5 text-[10px] text-secondary"><option value="all">ALL</option>{categories.map((value) => <option key={value}>{value}</option>)}</select></label>
      <label className="font-mono text-[9px] text-muted">TECH<select value={technology} onChange={(event) => setTechnology(event.target.value)} className="ml-2 max-w-36 border border-white/10 bg-background px-2 py-2.5 text-[10px] text-secondary"><option value="all">ALL</option>{technologies.map((value) => <option key={value}>{value}</option>)}</select></label>
      <label className="flex items-center gap-2 font-mono text-[9px] text-muted"><input type="checkbox" checked={featuredOnly} onChange={(event) => setFeaturedOnly(event.target.checked)} className="accent-accent"/>{ko ? "주요 프로젝트" : "FEATURED"}</label>
    </div>
    {filtered.length ? <div className="mt-5 grid gap-4 sm:grid-cols-2">{filtered.map((project) => <Link key={project.id} href={`/${locale}/projects/${project.slug}`} className="group border border-white/[0.09] bg-surface p-6 transition-colors hover:border-accent/40"><p className="flex items-center justify-between font-mono text-[10px] text-muted"><span>{project.category.toUpperCase()}</span><span className={project.status === "in-progress" ? "text-warning" : "text-accent"}>{project.status.replace("-", " ").toUpperCase()}</span></p><h2 className="mt-3 text-xl font-medium group-hover:text-accent">{project.title}<ArrowUpRight className="ml-2 inline" size={15}/></h2><p className="mt-3 text-sm leading-6 text-secondary">{project.description[locale]}</p><ul className="mt-5 flex flex-wrap gap-2">{project.techStack.map((tech) => <li key={tech} className="border border-white/[0.08] px-2 py-1 font-mono text-[9px] text-muted">{tech}</li>)}</ul></Link>)}</div> : <div className="mt-5 border border-white/[0.08] bg-surface/60 p-7"><p className="font-mono text-xs text-accent">{projects.length ? (ko ? "검색 결과가 없습니다." : "No matching projects.") : (ko ? "현재 공개된 프로젝트가 없습니다." : "No projects are published yet.")}</p><p className="mt-3 max-w-xl text-sm leading-6 text-secondary">{ko ? "초기 프로젝트 정보는 관리자 검토와 확인을 마친 뒤 공개됩니다." : "Initial project details will appear after administrator review and verification."}</p></div>}
  </>;
}
