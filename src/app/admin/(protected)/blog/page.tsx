import { ContentManager } from "@/components/admin/content-manager";
export default function AdminBlogPage() { return <><p className="font-mono text-xs text-accent">CMS / DEVLOG</p><h1 className="mt-3 text-3xl font-semibold">Blog posts</h1><p className="mt-2 text-xs text-secondary">Markdown 내용은 localized content 필드에 입력하세요. 원시 HTML은 렌더링되지 않습니다.</p><ContentManager collection="posts" /></>; }
