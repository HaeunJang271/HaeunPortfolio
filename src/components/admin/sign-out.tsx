"use client";

export function AdminSignOut() {
  async function signOut() { await fetch("/api/auth/session", { method: "DELETE" }); window.location.assign("/admin/login"); }
  return <button onClick={signOut} className="mt-3 font-mono text-[10px] text-secondary hover:text-accent">SIGN OUT</button>;
}
