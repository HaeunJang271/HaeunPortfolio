"use client";

import { usePathname, useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";

export function LocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();
  function change(next: Locale) {
    document.cookie = `locale=${next}; Max-Age=31536000; Path=/; SameSite=Lax`;
    const segments = (pathname ?? `/${locale}`).split("/");
    segments[1] = next;
    router.push(segments.join("/") || `/${next}`);
  }
  return <div className="flex items-center gap-1 font-mono text-[11px]" aria-label="Language">
    {(["ko", "en"] as const).map((value, index) => <span key={value} className="contents">{index > 0 && <span className="text-muted">/</span>}<button type="button" lang={value} aria-current={locale === value ? "page" : undefined} onClick={() => change(value)} className={locale === value ? "text-accent" : "text-muted hover:text-foreground"}>{value.toUpperCase()}</button></span>)}
  </div>;
}
