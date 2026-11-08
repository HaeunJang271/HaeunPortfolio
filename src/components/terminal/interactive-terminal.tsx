"use client";

import { FormEvent, KeyboardEvent, ReactNode, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";

type Line = { command?: string; output?: ReactNode; tone?: "accent" | "error" | "normal" };

export function InteractiveTerminal({ locale, skills, githubUrl }: { locale: Locale; skills: string[]; githubUrl?: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [lines, setLines] = useState<Line[]>([]);
  const ko = locale === "ko";

  function run(raw: string) {
    const command = raw.trim().toLowerCase();
    if (!command) return;
    setHistory((items) => [...items, raw]);
    setHistoryIndex(-1);
    if (command === "clear") { setLines([]); return; }
    const outputs: Record<string, string> = {
      help: ko ? "사용 가능한 명령: help, whoami, about, projects, experience, skills, contact, github, clear" : "Available commands: help, whoami, about, projects, experience, skills, contact, github, clear",
      whoami: "Haeun Jang — Software Developer",
      about: ko ? "문제를 해결하는 소프트웨어를 만듭니다. 더 알아보려면 about 페이지를 확인하세요." : "Building software that solves real problems. Visit the about page to learn more.",
      projects: ko ? "검증되어 공개된 프로젝트를 표시합니다." : "Showing verified, published projects.",
      experience: ko ? "확인된 경력 및 활동을 표시합니다." : "Showing verified experience and activities.",
      skills: skills.length ? skills.join(" · ") : (ko ? "공개된 프로젝트의 기술 스택이 등록되면 표시됩니다." : "Tech used in published projects will appear here."),
      contact: ko ? "연락 페이지로 이동합니다." : "Opening the contact page.",
      github: ko ? "GitHub 프로필 링크는 확인 후 연결됩니다." : "GitHub profile link will be connected after verification.",
    };
    if (!(command in outputs)) {
      setLines((items) => [...items, { command: raw, output: ko ? `명령을 찾을 수 없습니다: ${command}. help를 입력해 사용 가능한 명령을 확인하세요.` : `Command not found: ${command}. Type help to see available commands.`, tone: "error" }]);
      return;
    }
    if (command === "github") { setLines((items) => [...items, { command: raw, output: githubUrl ? <a href={githubUrl} target="_blank" rel="noreferrer" className="underline underline-offset-4">{githubUrl}</a> : (ko ? "공개 GitHub 프로필 링크가 아직 설정되지 않았습니다." : "A verified GitHub profile link has not been configured yet."), tone: githubUrl ? "accent" : "normal" }]); return; }
    setLines((items) => [...items, { command: raw, output: outputs[command], tone: "accent" }]);
    if (["about", "projects", "experience", "contact"].includes(command)) router.push(`/${locale}/${command}`);
  }

  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); run(value); setValue(""); }
  function navigateHistory(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowUp") { event.preventDefault(); const next = Math.max(0, historyIndex < 0 ? history.length - 1 : historyIndex - 1); setHistoryIndex(next); setValue(history[next] ?? ""); }
    if (event.key === "ArrowDown") { event.preventDefault(); if (historyIndex >= history.length - 1) { setHistoryIndex(-1); setValue(""); } else { const next = historyIndex + 1; setHistoryIndex(next); setValue(history[next] ?? ""); } }
  }

  return <section aria-labelledby="terminal-title" className="border border-white/[0.09] bg-surface">
    <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3"><h2 id="terminal-title" className="font-mono text-[10px] tracking-widest text-secondary">INTERACTIVE TERMINAL</h2><span className="font-mono text-[10px] text-muted">bash · haeun.dev</span></div>
    <div className="space-y-2 px-4 py-4 font-mono text-[11px] leading-5" aria-live="polite">
      <p className="text-muted">{ko ? "명령을 입력해 페이지를 탐색하세요. help로 시작할 수 있습니다." : "Explore the site with commands. Start with help."}</p>
      {lines.map((line, index) => <div key={`${line.command}-${index}`}><p><span className="text-accent">$</span> {line.command}</p><p className={line.tone === "error" ? "text-error" : line.tone === "accent" ? "text-accent" : "text-secondary"}>{line.output}</p></div>)}
      <form onSubmit={submit} className="flex items-center gap-2"><label htmlFor="terminal-command" className="text-accent">$</label><input ref={inputRef} id="terminal-command" value={value} onChange={(event) => setValue(event.target.value)} onKeyDown={navigateHistory} autoComplete="off" spellCheck={false} aria-label={ko ? "터미널 명령 입력" : "Terminal command input"} className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted" placeholder={ko ? "명령 입력…" : "enter a command…"}/><button className="sr-only">{ko ? "실행" : "Run command"}</button></form>
    </div>
  </section>;
}
