export function estimateReadingMinutes(markdown: string) {
  return Math.max(1, Math.ceil(markdown.trim().split(/\s+/).filter(Boolean).length / 220));
}
