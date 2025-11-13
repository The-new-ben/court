import { PrismaClient } from "@prisma/client";
import type { MetadataRoute } from "next";

const prisma = new PrismaClient();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const assets = await prisma.asset.findMany({ select: { slug: true, updatedAt: true } });

  return assets.map((asset) => ({
    url: `${process.env.SITE_URL ?? "http://localhost:3000"}/${asset.slug}`,
    lastModified: asset.updatedAt
  }));
}
