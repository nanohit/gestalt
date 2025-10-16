import { kv } from "@vercel/kv";
import { cloneSiteContent, normalizeContent, SiteContent } from "./content";

const SITE_CONTENT_KEY = "site-content";

export async function readSiteContent(): Promise<SiteContent> {
  const stored = await kv.get<Partial<SiteContent>>(SITE_CONTENT_KEY);
  return normalizeContent(stored ?? undefined);
}

export async function writeSiteContent(content: SiteContent): Promise<SiteContent> {
  const normalized = normalizeContent(content);
  await kv.set(SITE_CONTENT_KEY, normalized);
  return cloneSiteContent(normalized);
}
