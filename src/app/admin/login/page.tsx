import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/session";
import { LoginForm } from "@/components/admin/login-form";

export default async function AdminLoginPage() {
  if (await getAdminSession()) redirect("/admin");
  return <main className="grid min-h-screen place-items-center bg-background px-5"><section className="w-full max-w-sm border border-white/10 bg-surface p-7"><p className="font-mono text-xs text-accent">HAEUN.dev / ADMIN</p><h1 className="mt-5 text-2xl font-semibold">관리자 로그인</h1><p className="mb-7 mt-2 text-xs leading-5 text-secondary">허가된 계정으로만 접속할 수 있습니다.</p><LoginForm /></section></main>;
}
