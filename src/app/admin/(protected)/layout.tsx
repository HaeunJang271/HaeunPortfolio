import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth/session";
import { AdminSignOut } from "@/components/admin/sign-out";

const sections = ["projects", "blog", "experience", "media", "messages", "settings"];

export default async function ProtectedAdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const admin = await getAdminSession();
  if (!admin) redirect("/admin/login");
  return <div className="min-h-screen bg-background md:grid md:grid-cols-[230px_1fr]"><aside className="border-b border-white/10 bg-surface p-5 md:min-h-screen md:border-b-0 md:border-r"><Link href="/admin" className="font-mono text-sm text-foreground">HAEUN<span className="text-accent">.dev</span><span className="ml-2 text-muted">CMS</span></Link><p className="mt-8 font-mono text-[9px] tracking-widest text-muted">CONTENT</p><nav className="mt-3 grid grid-cols-3 gap-1 md:grid-cols-1">{sections.map((section) => <Link key={section} href={`/admin/${section}`} className="px-2 py-2 font-mono text-[10px] uppercase text-secondary hover:bg-elevated hover:text-accent">{section}</Link>)}</nav><div className="mt-6 border-t border-white/10 pt-4"><p className="truncate font-mono text-[10px] text-muted">{admin.email}</p><AdminSignOut /></div></aside><main className="min-w-0 p-5 md:p-10">{children}</main></div>;
}
