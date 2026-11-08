import Link from "next/link";
import { Github, ArrowUpRight, Linkedin, Globe } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { PublicSiteSettings } from "@/types/content";

export function SiteFooter({ locale, settings }: { locale: Locale; settings: PublicSiteSettings }) {
  const links = [
    settings.socialLinks.github && { href: settings.socialLinks.github, label: "GitHub", Icon: Github },
    settings.socialLinks.linkedin && { href: settings.socialLinks.linkedin, label: "LinkedIn", Icon: Linkedin },
    settings.socialLinks.website && { href: settings.socialLinks.website, label: locale === "ko" ? "웹사이트" : "Website", Icon: Globe },
  ].filter((item): item is { href: string; label: string; Icon: typeof Github } => Boolean(item));
  return (
    <footer className="border-t border-white/[0.07]">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-8 text-xs text-muted sm:flex-row sm:items-center sm:justify-between md:px-8">
        <p className="font-mono">© {new Date().getFullYear()} HAEUN.dev <span className="text-muted/60">·</span> {locale === "ko" ? "만든 것을 기록합니다." : "Building with intention."}</p>
        <div className="flex items-center gap-5 font-mono">
          {links.map(({ href, label, Icon }) => <a key={label} href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 transition-colors hover:text-accent"><Icon size={14} /> {label} <ArrowUpRight size={12} /></a>)}
          <Link href={`/${locale}/contact`} className="transition-colors hover:text-accent">{locale === "ko" ? "연락" : "Contact"}</Link>
        </div>
      </div>
    </footer>
  );
}
