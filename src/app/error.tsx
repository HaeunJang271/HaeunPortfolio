"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) { return <main className="grid min-h-screen place-items-center bg-background px-5"><section className="max-w-md border border-white/10 bg-surface p-7"><p className="font-mono text-xs text-error">SYSTEM / ERROR</p><h1 className="mt-4 text-2xl">페이지를 불러오지 못했습니다.</h1><p className="mt-3 text-sm text-secondary">잠시 후 다시 시도해 주세요.</p><button onClick={reset} className="mt-6 bg-accent px-4 py-3 font-mono text-xs text-background">다시 시도</button></section></main>; }
