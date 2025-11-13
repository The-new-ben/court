import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, AssetType } from "@prisma/client";
import MarkdownIt from "markdown-it";
import { generateContentPrompt, embed, saveEmbedding } from "@ai";
import { preventKeywordCannibalization, autoAssignCategoryAndCluster } from "@core";

const prisma = new PrismaClient();
const md = new MarkdownIt();

export async function POST(request: NextRequest) {
  const payload = await request.json();

  const slug = payload.slug ?? slugify(payload.title ?? randomUUID());

  const asset = await prisma.asset.create({
    data: {
      slug,
      type: (payload.type as AssetType) ?? AssetType.GENERIC,
      language: payload.language ?? "he",
      status: "DRAFT"
    }
  });

  const generated = await generateContentPrompt({
    asset: {
      id: asset.id,
      type: asset.type,
      language: asset.language,
      title: payload.title,
      rawText: payload.rawText,
      location: payload.location,
      specs: payload.specs
    },
    taxonomy: {
      categorySlug: payload.categorySlug ?? "real-estate",
      clusterSlug: payload.clusterSlug
    }
  });

  const htmlBody = renderMarkdownToHtml(generated);

  const content = await prisma.assetContent.create({
    data: {
      assetId: asset.id,
      lang: generated.meta.language,
      metaTitle: generated.meta.meta_title,
      metaDescription: generated.meta.meta_description,
      primaryKeyword: generated.meta.primary_keyword,
      secondaryKeywords: generated.meta.secondary_keywords,
      h1: generated.heading.h1,
      subhead: generated.heading.subhead ?? null,
      jsonBody: generated,
      htmlBody
    }
  });

  await preventKeywordCannibalization(asset.id, generated.meta.primary_keyword, generated.meta.language);

  const vector = await embed(`${generated.heading.h1}\n${generated.content.intro}`);
  await saveEmbedding(content.id, vector);
  await autoAssignCategoryAndCluster(asset.id, vector);

  return NextResponse.json({ assetId: asset.id, slug: asset.slug }, { status: 201 });
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/(^-|-$)/g, "");
}

function renderMarkdownToHtml(content: unknown) {
  if (!content || typeof content !== "object") {
    return "";
  }

  const structured = content as {
    heading?: { h1?: string; subhead?: string };
    content?: {
      intro?: string;
      sections?: Array<{
        h2: string;
        body_markdown: string;
        summary?: string;
        h3_items?: Array<{ h3: string; body_markdown: string }>;
      }>;
      faq?: Array<{ question: string; answer_markdown: string }>;
      conclusion?: string;
    };
  };

  const parts: string[] = [];

  if (structured.heading?.h1) {
    parts.push(`# ${structured.heading.h1}`);
  }

  if (structured.content?.intro) {
    parts.push(structured.content.intro);
  }

  structured.content?.sections?.forEach((section) => {
    parts.push(`## ${section.h2}`);
    if (section.body_markdown) {
      parts.push(section.body_markdown);
    }
    section.h3_items?.forEach((item) => {
      parts.push(`### ${item.h3}`);
      parts.push(item.body_markdown);
    });
  });

  structured.content?.faq?.forEach((entry) => {
    parts.push(`### ${entry.question}`);
    parts.push(entry.answer_markdown);
  });

  if (structured.content?.conclusion) {
    parts.push(structured.content.conclusion);
  }

  return md.render(parts.join("\n\n"));
}
