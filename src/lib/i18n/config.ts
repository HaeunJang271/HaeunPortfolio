export const locales = ["ko", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ko";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export const messages = {
  ko: {
    nav: { home: "홈", about: "소개", projects: "프로젝트", experience: "경험", blog: "개발 기록", contact: "연락" },
    home: { eyebrow: "소프트웨어 개발자", headline: "문제를 해결하는\n소프트웨어를 만듭니다.", intro: "사용자에게 필요한 것을 고민하고, 명확하고 오래 유지할 수 있는 방식으로 구현합니다.", explore: "프로젝트 보기", contact: "연락하기" },
    common: { location: "대한민국", availability: "개발자 포트폴리오", skip: "본문으로 건너뛰기" },
  },
  en: {
    nav: { home: "Home", about: "About", projects: "Projects", experience: "Experience", blog: "Devlog", contact: "Contact" },
    home: { eyebrow: "Software Developer", headline: "Building software\nthat solves problems.", intro: "I focus on what people need and build it with clarity and care for the long term.", explore: "Explore projects", contact: "Get in touch" },
    common: { location: "South Korea", availability: "Developer portfolio", skip: "Skip to content" },
  },
} as const;

export function getMessages(locale: Locale) {
  return messages[locale];
}
