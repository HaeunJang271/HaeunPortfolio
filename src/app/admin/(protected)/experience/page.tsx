import { ContentManager } from "@/components/admin/content-manager";
export default function AdminExperiencePage() { return <><p className="font-mono text-xs text-accent">CMS / EXPERIENCE</p><h1 className="mt-3 text-3xl font-semibold">Experience</h1><p className="mt-2 text-xs text-secondary">확인된 경력, 활동만 추가하세요.</p><ContentManager collection="experiences" /></>; }
