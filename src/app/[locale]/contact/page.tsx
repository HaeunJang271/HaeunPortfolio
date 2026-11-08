import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { ContactForm } from "@/components/forms/contact-form";
import { getPublicSettings } from "@/features/content/public";
import { localizedAlternates } from "@/lib/i18n/metadata";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> { const { locale } = await params; if (!isLocale(locale)) return {}; return { title: locale === "ko" ? "연락" : "Contact", alternates: localizedAlternates(locale, "contact") }; }

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; if (!isLocale(locale)) notFound(); const settings = await getPublicSettings(); return <div className="mx-auto min-h-[65vh] max-w-6xl px-5 py-20 md:px-8 md:py-28"><p className="font-mono text-xs text-accent">05 / CONTACT</p><h1 className="mt-5 text-4xl font-semibold">{locale === "ko" ? "연락하기" : "Get in touch"}</h1><p className="mt-4 max-w-xl text-sm leading-7 text-secondary">{locale === "ko" ? "프로젝트와 협업 문의를 보내주세요." : "Send a note about a project or collaboration."}</p>{settings.contactEmail && <a href={`mailto:${settings.contactEmail}`} className="mt-5 inline-block font-mono text-xs text-accent">{settings.contactEmail}</a>}<ContactForm locale={locale} /></div>; }
