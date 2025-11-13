import { z } from "zod";

export const GeneratedContentSchema = z.object({
  meta: z.object({
    slug: z.string().min(3),
    language: z.string().default("he"),
    meta_title: z.string().max(60),
    meta_description: z.string().max(160),
    primary_keyword: z.string(),
    secondary_keywords: z.array(z.string()).default([])
  }),
  heading: z.object({
    h1: z.string(),
    subhead: z.string().optional()
  }),
  content: z.object({
    intro: z.string().min(80),
    sections: z.array(z.object({
      h2: z.string(),
      summary: z.string().optional(),
      body_markdown: z.string(),
      h3_items: z.array(z.object({
        h3: z.string(),
        body_markdown: z.string()
      })).default([])
    })),
    faq: z.array(z.object({
      question: z.string(),
      answer_markdown: z.string()
    })).default([]),
    conclusion: z.string().min(40)
  }),
  internal_link_hints: z.array(z.object({
    target_slug: z.string(),
    anchor_text_options: z.array(z.string()).min(1),
    reason: z.string().optional()
  })).default([]),
  schema_org: z.object({
    type: z.enum(["Article", "Product", "Offer", "Apartment", "House"]).default("Article"),
    data: z.record(z.any()).default({})
  })
});

export type GeneratedContent = z.infer<typeof GeneratedContentSchema>;
