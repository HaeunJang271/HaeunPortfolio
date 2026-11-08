"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirebaseClient } from "@/lib/firebase/client";

export function LoginForm() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(formData: FormData) {
    setBusy(true); setError("");
    try {
      const { auth } = getFirebaseClient();
      const credential = await signInWithEmailAndPassword(auth, String(formData.get("email")), String(formData.get("password")));
      const response = await fetch("/api/auth/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idToken: await credential.user.getIdToken() }) });
      if (!response.ok) { await signOut(auth); throw new Error("계정에 관리자 접근 권한이 없습니다."); }
      window.location.assign("/admin");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "로그인에 실패했습니다."); setBusy(false);
    }
  }

  return <form action={submit} className="space-y-4">
    <label className="block font-mono text-[10px] text-secondary">EMAIL<input required name="email" type="email" autoComplete="username" className="mt-2 block w-full border border-white/10 bg-background px-3 py-3 font-sans text-sm text-foreground outline-none focus:border-accent/60" /></label>
    <label className="block font-mono text-[10px] text-secondary">PASSWORD<input required name="password" type="password" autoComplete="current-password" className="mt-2 block w-full border border-white/10 bg-background px-3 py-3 font-sans text-sm text-foreground outline-none focus:border-accent/60" /></label>
    {error && <p role="alert" className="text-sm text-error">{error}</p>}
    <button disabled={busy} className="w-full bg-accent px-4 py-3 font-mono text-xs font-semibold text-background disabled:opacity-60">{busy ? "AUTHENTICATING…" : "SIGN IN"}</button>
  </form>;
}
