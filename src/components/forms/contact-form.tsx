"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactInput } from "@/lib/validation/contact";

export function ContactForm({ locale }: { locale: "ko" | "en" }) {
  const [result, setResult] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });
  const ko = locale === "ko";
  const fields = [
    { name: "name" as const, label: ko ? "이름" : "Name", type: "text", placeholder: ko ? "이름" : "Your name" },
    { name: "email" as const, label: "Email", type: "email", placeholder: "name@example.com" },
    { name: "subject" as const, label: ko ? "제목" : "Subject", type: "text", placeholder: ko ? "문의 제목" : "What is this about?" },
  ];

  async function submit(data: ContactInput) {
    setResult("");
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Request failed.");
      reset(); setResult(ko ? "문의가 전달되었습니다. 감사합니다." : "Your message has been sent. Thank you.");
    } catch (cause) { setResult(cause instanceof Error ? cause.message : (ko ? "전송에 실패했습니다." : "Unable to send your message.")); }
  }

  return <form onSubmit={handleSubmit(submit)} className="mt-10 max-w-2xl space-y-5">
    {fields.map((field) => <label key={field.name} className="block text-xs text-secondary">{field.label}<input {...register(field.name)} type={field.type} placeholder={field.placeholder} className="mt-2 block w-full border border-white/10 bg-surface px-3 py-3 text-sm text-foreground placeholder:text-muted outline-none focus:border-accent/60" />{errors[field.name] && <span className="mt-1 block text-error">{ko ? "입력 내용을 확인해 주세요." : errors[field.name]?.message}</span>}</label>)}
    <label className="block text-xs text-secondary">{ko ? "메시지" : "Message"}<textarea {...register("message")} rows={6} className="mt-2 block w-full resize-y border border-white/10 bg-surface px-3 py-3 text-sm text-foreground outline-none focus:border-accent/60" />{errors.message && <span className="mt-1 block text-error">{ko ? "20자 이상 입력해 주세요." : errors.message.message}</span>}</label>
    <label aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">Website<input tabIndex={-1} autoComplete="off" {...register("website")} /></label>
    {result && <p role="status" className="text-sm text-accent">{result}</p>}
    <button disabled={isSubmitting} className="bg-accent px-5 py-3 font-mono text-xs font-semibold text-background disabled:opacity-50">{isSubmitting ? "SENDING…" : ko ? "문의 보내기 →" : "SEND MESSAGE →"}</button>
  </form>;
}
