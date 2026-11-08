import { notFound } from "next/navigation";
import { ContentManager } from "@/components/admin/content-manager";
export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; if (!/^[A-Za-z0-9_-]{1,150}$/.test(id)) notFound(); return <><p className="font-mono text-xs text-accent">CMS / DEVLOG / EDIT</p><h1 className="mt-3 text-3xl font-semibold">Edit post</h1><ContentManager collection="posts" initialId={id} /></>; }
