import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/config";
import { MobileNav } from "@/components/navigation/mobile-nav";
import { LocaleSwitcher } from "@/components/navigation/locale-switcher";

const navItems = ["about", "projects", "experience", "blog", "contact"] as const;

export function SiteHeader({ locale }: { locale: Locale }) {
  const t = getMessages(locale);
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5 md:px-8">
        <Link href={`/${locale}`} className="font-mono text-[15px] font-semibold tracking-tight text-foreground" aria-label="HAEUN.dev home">
          HAEUN<span className="text-accent">.dev</span><span className="ml-2 text-muted">/</span>
        </Link>
        <nav aria-label={locale === "ko" ? "주요 메뉴" : "Main navigation"} className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => <Link key={item} href={`/${locale}/${item}`} className="font-mono text-[11px] text-secondary transition-colors hover:text-accent">{t.nav[item]}</Link>)}
        </nav>
        <div className="flex items-center gap-4">
          <LocaleSwitcher locale={locale} />
          <Link href={`/${locale}/contact`} className="hidden items-center gap-2 border border-accent/30 px-3 py-2 font-mono text-[10px] text-accent transition-colors hover:bg-accent/10 sm:flex">
            {locale === "ko" ? "문의하기" : "LET'S TALK"}<ArrowUpRight size={13} aria-hidden="true" />
          </Link>
          <MobileNav locale={locale} />
        </div>
      </div>
    </header>
  );
}
