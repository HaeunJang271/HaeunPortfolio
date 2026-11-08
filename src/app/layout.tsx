import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export const metadata: Metadata = {
  title: "HAEUN.dev | Software Developer",
  description: "Haeun Jang — Software Developer. Building software that solves real problems.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = (await headers()).get("x-haeun-locale") === "en" ? "en" : "ko";
  return <html lang={locale}><body>{children}</body></html>;
}
