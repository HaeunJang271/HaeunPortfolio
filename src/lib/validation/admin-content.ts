import { z } from "zod";

const localizedText = z.object({ ko: z.string().max(30_000), en: z.string().max(30_000) });
const optionalUrl = z.union([z.string().url().max(2048), z.literal(""), z.null()]).transform((value) => value || null);
const imageUrl = z.string().url().max(2048).refine((value) => { try { return new URL(value).hostname === "firebasestorage.googleapis.com"; } catch { return false; } });

export const projectInputSchema = z.object({
  slug: z.string().trim().min(2).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().trim().min(1).max(120),
  description: localizedText,
  details: localizedText,
  sections: z.object({ problem: localizedText.optional(), goals: localizedText.optional(), architecture: localizedText.optional(), implementation: localizedText.optional(), challenges: localizedText.optional(), solutions: localizedText.optional(), results: localizedText.optional() }).optional(),
  role: localizedText.nullable().optional(),
  period: z.object({ start: z.string().max(30), end: z.string().max(30).nullable() }).nullable().optional(),
  techStack: z.array(z.string().trim().min(1).max(60)).max(30),
  category: z.string().trim().min(1).max(60),
  thumbnail: imageUrl.nullable().or(z.literal("")).transform((value) => value || null),
  gallery: z.array(imageUrl).max(30),
  githubUrl: optionalUrl,
  liveUrl: optionalUrl,
  status: z.enum(["in-progress", "completed", "archived"]),
  featured: z.boolean(),
  published: z.boolean(),
});

export const postInputSchema = z.object({
  slug: z.string().trim().min(2).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: localizedText,
  content: localizedText,
  excerpt: localizedText,
  category: z.string().trim().min(1).max(80),
  tags: z.array(z.string().trim().min(1).max(40)).max(20),
  published: z.boolean(),
  seoTitle: localizedText.optional(),
  seoDescription: localizedText.optional(),
});

export const experienceInputSchema = z.object({
  organization: z.string().trim().min(1).max(120),
  role: localizedText,
  period: z.object({ start: z.string().min(4).max(20), end: z.string().max(20).nullable() }),
  description: localizedText,
  responsibilities: z.array(localizedText).max(30),
  technologies: z.array(z.string().trim().min(1).max(60)).max(30),
  relatedProjectId: z.string().max(120).nullable(),
  published: z.boolean(),
});
