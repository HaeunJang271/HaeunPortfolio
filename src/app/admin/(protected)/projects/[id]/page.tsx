import { notFound } from "next/navigation";
import { ContentManager } from "@/components/admin/content-manager";
export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; if (!/^[A-Za-z0-9_-]{1,150}$/.test(id)) notFound(); return <><p className="font-mono text-xs text-accent">CMS / PROJECTS / EDIT</p><h1 className="mt-3 text-3xl font-semibold">Edit project</h1><ContentManager collection="projects" initialId={id} /></>; }
