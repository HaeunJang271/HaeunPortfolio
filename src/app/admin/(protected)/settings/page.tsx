import { SettingsEditor } from "@/components/admin/settings-editor";
export default function AdminSettingsPage() { return <><p className="font-mono text-xs text-accent">CMS / SETTINGS</p><h1 className="mt-3 text-3xl font-semibold">Site settings</h1><p className="mt-2 text-xs text-secondary">Only publish contact and social details after verification.</p><SettingsEditor /></>; }
