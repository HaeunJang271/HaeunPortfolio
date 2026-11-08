import type { Locale } from "@/lib/i18n/config";

export function localizedAlternates(locale: Locale, pathname: string) {
  const suffix = pathname ? `/${pathname.replace(/^\/+|\/+$/g, "")}` : "";
  return {
    canonical: `/${locale}${suffix}`,
    languages: { ko: `/ko${suffix}`, en: `/en${suffix}` },
  };
}
