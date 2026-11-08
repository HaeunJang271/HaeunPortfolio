import { ContentManager } from "@/components/admin/content-manager";
export default function AdminProjectsPage() { return <><p className="font-mono text-xs text-accent">CMS / PROJECTS</p><h1 className="mt-3 text-3xl font-semibold">Projects</h1><p className="mt-2 text-xs text-secondary">공개 게시 전 프로젝트 정보와 링크를 확인하고 published 값을 설정하세요.</p><ContentManager collection="projects" /></>; }
