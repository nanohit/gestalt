import { NextRequest } from "next/server";
import { z } from "zod";
import { readSiteContent, writeSiteContent } from "@/app/lib/kv";
import { ApiResponse } from "@/app/lib/routes";
import { normalizeContent, SiteContent } from "@/app/lib/content";

export const dynamic = "force-dynamic";

const sessionSchema = z.object({
  time: z.string().min(1),
  type: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
});

const daySchema = z.object({
  date: z.string().min(1),
  sessions: z.array(sessionSchema).min(1),
});

const speakerSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  experience: z.string().min(1),
  description: z.string().min(1),
  tags: z.array(z.string().min(1)).min(1),
  photoUrl: z.string().url().or(z.literal("")),
});

const pricingSchema = z.object({
  label: z.string().optional(),
  period: z.string().min(1),
  price: z.string().min(1),
  features: z.array(z.string().min(1)).min(1),
  highlight: z.boolean().optional(),
});

const siteContentSchema = z.object({
  programDays: z.array(daySchema).min(1),
  speakers: z.array(speakerSchema).min(1),
  pricingOptions: z.array(pricingSchema).min(1),
  registrationNotifications: z.object({
    title: z.string().min(1),
    items: z.array(z.string().min(1)).min(1),
  }),
  contactSection: z.object({
    title: z.string().min(1),
    phone: z.string().min(1),
    email: z.string().min(1),
    website: z.string().min(1),
  }),
});

type SiteContentInput = z.infer<typeof siteContentSchema>;

function jsonResponse<T>(body: ApiResponse<T>, init?: ResponseInit) {
  return Response.json(body, init);
}

export async function GET() {
  try {
    const content = await readSiteContent();
    return jsonResponse({ success: true, data: content });
  } catch (error) {
    console.error("Failed to read site content", error);
    return jsonResponse({ success: false, error: "Не удалось загрузить данные" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const payload = (await request.json()) as Partial<SiteContentInput> | undefined;
    const parsed = siteContentSchema.safeParse(payload ?? {});
    if (!parsed.success) {
      console.warn("Invalid site content payload", parsed.error.format());
      return jsonResponse({ success: false, error: "Некорректные данные" }, { status: 400 });
    }
    const normalized = normalizeContent(parsed.data);
    const saved = await writeSiteContent(normalized);
    return jsonResponse({ success: true, data: saved });
  } catch (error) {
    console.error("Failed to update site content", error);
    return jsonResponse({ success: false, error: "Не удалось сохранить данные" }, { status: 500 });
  }
}
