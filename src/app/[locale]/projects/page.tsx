import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedProjects } from "@/features/projects/seed-projects";
import { isLocale } from "@/lib/i18n/config";
import { ProjectExplorer } from "@/components/projects/project-explorer";
import { localizedAlternates } from "@/lib/i18n/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> { const { locale } = await params; if (!isLocale(locale)) return {}; return { title: locale === "ko" ? "프로젝트" : "Projects", alternates: localizedAlternates(locale, "projects") }; }

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params; if (!isLocale(raw)) notFound();
  const projects = await getPublishedProjects();
  return <div className="mx-auto min-h-[65vh] max-w-6xl px-5 py-20 md:px-8 md:py-28"><p className="font-mono text-xs text-accent">02 / SELECTED WORK</p><h1 className="mt-5 text-4xl font-semibold tracking-tight">{raw === "ko" ? "프로젝트" : "Projects"}</h1><p className="mt-4 text-sm text-secondary">{raw === "ko" ? "확인된 작업과 구현 내용을 정리합니다." : "A collection of verified work and implementation details."}</p><ProjectExplorer locale={raw} projects={projects}/></div>;
}
