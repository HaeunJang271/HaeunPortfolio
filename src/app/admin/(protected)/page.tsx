import { DashboardStats } from "@/components/admin/dashboard-stats";

export default function AdminDashboardPage() {
  return <><p className="font-mono text-xs text-accent">SYSTEM / OVERVIEW</p><h1 className="mt-4 text-3xl font-semibold">Dashboard</h1><p className="mt-3 text-sm text-secondary">Metrics are calculated from Firestore.</p><DashboardStats /></>;
}
