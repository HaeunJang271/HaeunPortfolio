"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/config";

const navItems = ["about", "projects", "experience", "blog", "contact"] as const;

export function MobileNav({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const t = getMessages(locale);
  return <div className="md:hidden">
    <button type="button" aria-expanded={open} aria-label={open ? (locale === "ko" ? "메뉴 닫기" : "Close menu") : (locale === "ko" ? "메뉴 열기" : "Open menu")} onClick={() => setOpen(!open)} className="grid h-10 w-10 place-items-center text-secondary hover:text-accent">{open ? <X size={20}/> : <Menu size={20}/>}</button>
    {open && <nav aria-label={locale === "ko" ? "주요 메뉴" : "Main navigation"} className="absolute inset-x-0 top-[72px] border-b border-white/10 bg-background px-5 py-3 shadow-xl">
      {navItems.map((item) => <Link key={item} href={`/${locale}/${item}`} onClick={() => setOpen(false)} className="block border-b border-white/[0.06] py-3 font-mono text-xs text-secondary last:border-0 hover:text-accent">{t.nav[item]}</Link>)}
    </nav>}
  </div>;
}
