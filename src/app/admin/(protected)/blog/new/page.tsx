import { ContentManager } from "@/components/admin/content-manager";
export default function NewPostPage() { return <><p className="font-mono text-xs text-accent">CMS / DEVLOG / NEW</p><h1 className="mt-3 text-3xl font-semibold">New post</h1><ContentManager collection="posts" startNew /></>; }
