import OpenAI from "openai";
import { GeneratedContentSchema, type GeneratedContent } from "./content-schema";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface GenerateContentInput {
  asset: {
    id: string;
    type: string;
    language: string;
    title?: string;
    rawText?: string;
    location?: Record<string, unknown>;
    specs?: Record<string, unknown>;
  };
  taxonomy: {
    categorySlug: string;
    clusterSlug?: string;
  };
}

export async function generateContentPrompt(input: GenerateContentInput): Promise<GeneratedContent> {
  if (!client.apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const system = "אתה מחולל תוכן SEO מקצועי. החזר JSON תקף בלבד לפי הסכמה שסופקה. שמור על H1/H2/H3, FAQ, ו-JSON-LD מותאם. מטרתך: תוכן אינפורמטיבי שאינו קניבליזי.";

  const payload = {
    asset: input.asset,
    taxonomy: input.taxonomy,
    constraints: {
      language: input.asset.language ?? "he",
      min_words: 800,
      include_faq: true,
      jsonld: true
    }
  };

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.3,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      { role: "user", content: JSON.stringify(payload) }
    ]
  });

  const raw = response.choices[0]?.message?.content ?? "{}";
  const parsed = GeneratedContentSchema.safeParse(JSON.parse(raw));
  if (!parsed.success) {
    throw new Error(`AI JSON validation failed: ${parsed.error.message}`);
  }

  return parsed.data;
}
