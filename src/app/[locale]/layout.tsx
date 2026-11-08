import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n/config";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { DocumentLanguage } from "@/components/layout/document-language";
import { PageTransition } from "@/components/layout/page-transition";
import { getPublicSettings } from "@/features/content/public";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "ko";
  const settings = await getPublicSettings();
  const title = settings.siteTitle[locale];
  const description = settings.seo.description[locale];
  return { title: { default: title, template: `%s | ${title}` }, description, metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://haeun.dev"), alternates: { languages: { ko: "/ko", en: "/en" } }, openGraph: { siteName: title, type: "website", title, description, locale: locale === "ko" ? "ko_KR" : "en_US" } };
}

export function generateStaticParams() { return locales.map((locale) => ({ locale })); }

export default async function LocaleLayout({ children, params }: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const settings = await getPublicSettings();
  return <div lang={locale} className="min-h-screen"><DocumentLanguage locale={locale}/><a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-accent focus:px-4 focus:py-2 focus:text-background">{locale === "ko" ? "본문으로 건너뛰기" : "Skip to content"}</a><SiteHeader locale={locale} /><main id="main-content"><PageTransition>{children}</PageTransition></main><SiteFooter locale={locale} settings={settings} /></div>;
}
