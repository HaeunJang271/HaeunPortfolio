import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Code2, Cpu, Layers3 } from "lucide-react";
import { notFound } from "next/navigation";
import { getMessages, isLocale } from "@/lib/i18n/config";
import { InteractiveTerminal } from "@/components/terminal/interactive-terminal";
import { getPublicSettings, getPublishedExperiences, getPublishedPosts } from "@/features/content/public";
import { getPublishedProjects } from "@/features/projects/seed-projects";
import type { Metadata } from "next";
import { localizedAlternates } from "@/lib/i18n/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> { const { locale: raw } = await params; if (!isLocale(raw)) return {}; const settings = await getPublicSettings(); return { title: settings.siteTitle[raw], description: settings.seo.description[raw], alternates: localizedAlternates(raw, ""), openGraph: { title: settings.siteTitle[raw], description: settings.seo.description[raw], url: `/${raw}` } }; }

const focusAreas = [
  { icon: Code2, label: "SOFTWARE", value: "Web applications" },
  { icon: Cpu, label: "SYSTEMS", value: "Digital logic & architecture" },
  { icon: Layers3, label: "APPROACH", value: "Thoughtful engineering" },
];

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const t = getMessages(locale);
  const [settings, projects, posts, experiences] = await Promise.all([getPublicSettings(), getPublishedProjects(), getPublishedPosts(), getPublishedExperiences()]);
  const name = settings.profile.name || "Haeun Jang";
  const role = settings.profile.role[locale] || t.home.eyebrow;
  const featuredProjects = projects.filter((project) => project.featured).slice(0, 3);
  const stack = [...new Set(projects.flatMap((project) => project.techStack))].slice(0, 12);
  const activities = [...posts.map((post) => ({ key: `post-${post.id}`, label: locale === "ko" ? "개발 기록" : "Devlog", title: post.title[locale], date: post.updatedAt })), ...experiences.map((experience) => ({ key: `experience-${experience.id}`, label: locale === "ko" ? "경험" : "Experience", title: `${experience.organization} · ${experience.role[locale]}`, date: experience.period.start }))].slice(0, 4);
  return (
    <div>
      <section className="relative mx-auto grid min-h-[calc(100svh-72px)] max-w-6xl items-center gap-12 px-5 py-20 md:grid-cols-[1.15fr_.85fr] md:px-8 md:py-24">
        <div className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-accent/[0.035] blur-3xl" />
        <div className="relative">
          <div className="mb-8 inline-flex items-center gap-2 border border-white/[0.09] bg-surface px-3 py-2 font-mono text-[10px] tracking-wide text-secondary">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> {t.common.availability.toUpperCase()}
          </div>
          <p className="mb-5 font-mono text-sm text-accent"><span className="text-muted">$</span> whoami</p>
          <h1 className="whitespace-pre-line text-4xl font-semibold leading-[1.15] tracking-[-0.055em] text-foreground sm:text-5xl md:text-6xl">{name}<span className="ml-2 font-mono text-accent">_</span></h1>
          <p className="mt-4 font-mono text-sm tracking-wide text-secondary">{role}</p>
          <p className="mt-9 max-w-xl whitespace-pre-line text-lg leading-8 text-foreground/80 md:text-xl">{t.home.headline}</p>
          <p className="mt-4 max-w-lg text-sm leading-7 text-secondary">{settings.profile.introduction[locale] || t.home.intro}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href={`/${locale}/projects`} className="inline-flex items-center gap-2 bg-accent px-5 py-3 font-mono text-xs font-semibold text-background transition-colors hover:bg-[#83efb5]">{t.home.explore}<ArrowRight size={14} /></Link>
            <Link href={`/${locale}/contact`} className="inline-flex items-center gap-2 border border-white/10 px-5 py-3 font-mono text-xs text-foreground transition-colors hover:border-accent/50 hover:text-accent">{t.home.contact}<ArrowUpRight size={14} /></Link>
          </div>
          <div className="mt-10 flex items-center gap-4 font-mono text-[11px] text-muted"><span>{settings.profile.location || (locale === "ko" ? "소프트웨어 개발" : "SOFTWARE DEVELOPMENT")}</span>{settings.socialLinks.github && <><span className="h-px w-8 bg-white/10" /><a href={settings.socialLinks.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 transition-colors hover:text-accent">GITHUB <ArrowUpRight size={11} /></a></>}</div>
        </div>
        <div className="relative border border-white/[0.09] bg-surface/80 p-1 shadow-[0_24px_90px_-52px_rgba(101,230,162,0.22)]">
          <div className="flex h-11 items-center justify-between border-b border-white/[0.07] px-4">
            <div className="flex gap-1.5" aria-hidden="true"><span className="h-2 w-2 rounded-full bg-[#F07878]/70"/><span className="h-2 w-2 rounded-full bg-[#E8BD69]/70"/><span className="h-2 w-2 rounded-full bg-accent/70"/></div>
            <span className="font-mono text-[10px] text-muted">haeun@portfolio:~</span><span className="w-7" />
          </div>
          <div className="space-y-7 p-6 md:p-8">
            <div><p className="font-mono text-xs text-accent">$ cat /etc/profile</p><p className="mt-3 font-mono text-[11px] leading-6 text-secondary">NAME <span className="text-foreground">{name}</span><br/>ROLE <span className="text-foreground">{role}</span>{settings.profile.location && <><br/>BASE <span className="text-foreground">{settings.profile.location}</span></>}</p></div>
            <div className="h-px bg-white/[0.07]" />
            <div><p className="font-mono text-xs text-accent">$ ls ./focus</p><div className="mt-4 space-y-3">{focusAreas.map(({ icon: Icon, label, value }) => <div key={label} className="flex items-center gap-3"><span className="grid h-8 w-8 place-items-center border border-white/[0.08] text-accent"><Icon size={14}/></span><div><p className="font-mono text-[9px] tracking-widest text-muted">{label}</p><p className="mt-0.5 text-xs text-foreground/85">{value}</p></div></div>)}</div></div>
            <div className="border-t border-white/[0.07] pt-4 font-mono text-[10px] text-muted"><span className="text-accent">➜</span> {locale === "ko" ? "차근차근, 제대로." : "One problem at a time."}<span className="ml-1 animate-pulse text-accent">▌</span></div>
          </div>
        </div>
        <div className="absolute bottom-8 left-5 hidden items-center gap-2 font-mono text-[9px] tracking-widest text-muted md:flex md:left-8"><ArrowDown size={12}/> SCROLL TO EXPLORE</div>
      </section>
      <div className="mx-auto max-w-6xl px-5 pb-20 md:px-8 md:pb-24"><InteractiveTerminal locale={locale} skills={stack} githubUrl={settings.socialLinks.github || undefined} /></div>
      <section className="border-y border-white/[0.07] bg-surface/55">
        <div className="mx-auto grid max-w-6xl gap-px bg-white/[0.07] px-5 md:grid-cols-3 md:px-8">
          {focusAreas.map(({ icon: Icon, label, value }, index) => <article key={label} className="flex min-h-32 items-center gap-4 bg-background px-5 py-6 md:px-7"><span className="font-mono text-[10px] text-muted">0{index + 1}</span><span className="grid h-10 w-10 place-items-center border border-white/[0.08] text-accent"><Icon size={17}/></span><div><p className="font-mono text-[9px] tracking-widest text-muted">{label}</p><p className="mt-1 text-sm text-foreground">{value}</p></div></article>)}
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-24"><div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="font-mono text-[10px] tracking-[0.2em] text-accent">SELECTED WORK</p><h2 className="mt-4 text-3xl font-medium tracking-tight">{locale === "ko" ? "주요 프로젝트" : "Featured projects"}</h2></div><Link href={`/${locale}/projects`} className="inline-flex items-center gap-2 font-mono text-xs text-secondary transition-colors hover:text-accent">{t.home.explore}<ArrowRight size={14}/></Link></div>{featuredProjects.length ? <div className="mt-8 grid gap-4 md:grid-cols-3">{featuredProjects.map((project) => <Link key={project.id} href={`/${locale}/projects/${project.slug}`} className="group border border-white/[0.09] bg-surface p-5 hover:border-accent/40"><p className="font-mono text-[9px] text-muted">{project.category.toUpperCase()}</p><h3 className="mt-3 font-medium group-hover:text-accent">{project.title}<ArrowUpRight className="ml-2 inline" size={13}/></h3><p className="mt-2 line-clamp-2 text-xs leading-5 text-secondary">{project.description[locale]}</p><p className="mt-4 font-mono text-[9px] text-muted">{project.techStack.slice(0, 3).join(" · ")}</p></Link>)}</div> : <p className="mt-7 border border-white/[0.08] bg-surface/60 p-5 text-xs text-muted">{locale === "ko" ? "확인 후 공개된 프로젝트가 이곳에 표시됩니다." : "Verified projects will appear here after publication."}</p>}</section>
      <section className="border-y border-white/[0.07] bg-surface/45"><div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-2 md:px-8"><div><p className="font-mono text-[10px] tracking-[0.2em] text-accent">TECH STACK</p><h2 className="mt-3 text-xl">{locale === "ko" ? "프로젝트에서 사용한 기술" : "Tools used in published work"}</h2>{stack.length ? <ul className="mt-5 flex flex-wrap gap-2">{stack.map((item) => <li key={item} className="border border-white/10 px-3 py-2 font-mono text-[10px] text-secondary">{item}</li>)}</ul> : <p className="mt-4 text-xs text-muted">{locale === "ko" ? "공개 프로젝트가 등록되면 기술 스택이 표시됩니다." : "Technology highlights appear when projects are published."}</p>}</div><div><p className="font-mono text-[10px] tracking-[0.2em] text-accent">RECENT ACTIVITY</p><h2 className="mt-3 text-xl">{locale === "ko" ? "최근 기록" : "Recent updates"}</h2>{activities.length ? <ul className="mt-4 divide-y divide-white/[0.07]">{activities.map((activity) => <li key={activity.key} className="flex gap-4 py-3"><span className="w-24 shrink-0 font-mono text-[9px] text-muted">{activity.label.toUpperCase()}</span><span className="text-xs text-secondary">{activity.title}</span></li>)}</ul> : <p className="mt-4 text-xs text-muted">{locale === "ko" ? "공개된 활동 기록이 없습니다." : "No activity has been published yet."}</p>}</div></div></section>
      <section className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-20 md:flex-row md:items-end md:justify-between md:px-8 md:py-24"><div><p className="font-mono text-[10px] tracking-[0.2em] text-accent">CONTACT</p><h2 className="mt-4 text-3xl font-medium tracking-tight">{locale === "ko" ? "함께 만들 이야기가 있나요?" : "Have something to build together?"}</h2></div><Link href={`/${locale}/contact`} className="inline-flex items-center gap-2 bg-accent px-5 py-3 font-mono text-xs font-semibold text-background">{t.home.contact}<ArrowRight size={14}/></Link></section>
    </div>
  );
}
