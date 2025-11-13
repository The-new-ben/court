import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function preventKeywordCannibalization(
  assetId: string,
  primaryKeyword: string,
  language = "he"
): Promise<void> {
  if (!primaryKeyword) {
    return;
  }

  const existing = await prisma.assetKeyword.findFirst({
    where: {
      isPrimary: true,
      language,
      keyword: {
        equals: primaryKeyword,
        mode: "insensitive"
      }
    }
  });

  if (existing && existing.assetId !== assetId) {
    await prisma.sEORecommendation.create({
      data: {
        assetId,
        type: "change_primary_keyword",
        details: {
          conflictingAssetId: existing.assetId,
          keyword: primaryKeyword
        }
      }
    });
  }
}
