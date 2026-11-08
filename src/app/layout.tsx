import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HAEUN.dev | Software Developer",
  description: "Haeun Jang — Software Developer. Building software that solves real problems.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html><body>{children}</body></html>;
}
