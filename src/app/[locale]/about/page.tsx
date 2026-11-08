import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMessages, isLocale } from "@/lib/i18n/config";
import { localizedAlternates } from "@/lib/i18n/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: locale === "ko" ? "소개" : "About", description: locale === "ko" ? "장하은 소프트웨어 개발자 소개" : "About Haeun Jang, Software Developer", alternates: localizedAlternates(locale, "about") };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params; if (!isLocale(raw)) notFound();
  const t = getMessages(raw);
  return <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28"><p className="font-mono text-xs text-accent">01 / ABOUT</p><h1 className="mt-5 text-4xl font-semibold tracking-tight">{raw === "ko" ? "안녕하세요, 장하은입니다." : "Hello, I’m Haeun Jang."}</h1><p className="mt-6 max-w-2xl text-base leading-8 text-secondary">{t.home.intro}</p><div className="mt-14 grid gap-8 border-t border-white/[0.08] pt-8 md:grid-cols-3"><section><h2 className="font-mono text-xs text-accent">PHILOSOPHY</h2><p className="mt-4 text-sm leading-7 text-secondary">{raw === "ko" ? "문제와 사용자를 먼저 이해하고, 단순하고 유지하기 쉬운 해결책을 찾습니다." : "Understand the problem and people first, then look for a solution that stays clear and maintainable."}</p></section><section><h2 className="font-mono text-xs text-accent">FOCUS</h2><p className="mt-4 text-sm leading-7 text-secondary">{raw === "ko" ? "웹 애플리케이션과 디지털 시스템 구현에 관심을 두고 있습니다." : "Interested in building web applications and working close to digital systems."}</p></section><section><h2 className="font-mono text-xs text-accent">DIRECTION</h2><p className="mt-4 text-sm leading-7 text-secondary">{raw === "ko" ? "검증된 사실과 실제 결과를 중심으로 작업을 기록하고 공유합니다." : "Documenting and sharing work around verified facts and real outcomes."}</p></section></div></div>;
}
