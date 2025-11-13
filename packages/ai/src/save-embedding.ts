import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function saveEmbedding(assetContentId: string, vector: number[]): Promise<void> {
  const sql = `
    UPDATE "AssetContent"
    SET "embedding" = $1::vector
    WHERE "id" = $2
  `;

  await prisma.$executeRawUnsafe(sql, `[${vector.join(",")}]`, assetContentId);
}
