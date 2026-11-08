export type LocalizedText = { ko: string; en: string };

export type ProjectStatus = "unknown" | "in-progress" | "completed" | "archived";

export interface ProjectDocument {
  id: string;
  slug: string;
  title: string;
  description: LocalizedText;
  details: LocalizedText;
  sections?: Partial<Record<"problem" | "goals" | "architecture" | "implementation" | "challenges" | "solutions" | "results", LocalizedText>>;
  role?: LocalizedText | null;
  period?: { start: string; end: string | null } | null;
  techStack: string[];
  category: string;
  thumbnail: string | null;
  gallery: string[];
  githubUrl: string | null;
  liveUrl: string | null;
  status: ProjectStatus;
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PostDocument {
  id: string;
  slug: string;
  title: LocalizedText;
  content: LocalizedText;
  excerpt: LocalizedText;
  category: string;
  tags: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
  seoTitle?: LocalizedText;
  seoDescription?: LocalizedText;
}

export interface ExperienceDocument {
  id: string;
  organization: string;
  role: LocalizedText;
  period: { start: string; end: string | null };
  description: LocalizedText;
  responsibilities: LocalizedText[];
  technologies: string[];
  relatedProjectId: string | null;
  published: boolean;
}

export interface PublicSiteSettings {
  siteTitle: LocalizedText;
  defaultLocale: "ko" | "en";
  profile: { name: string; role: LocalizedText; introduction: LocalizedText; location?: string };
  socialLinks: { github: string; linkedin: string; website: string };
  contactEmail: string;
  seo: { description: LocalizedText; keywords: string[] };
}

export interface MessageDocument {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "replied" | "archived";
  createdAt: string;
}
