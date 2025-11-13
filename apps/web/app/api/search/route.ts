import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { embed } from "@ai";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? "";

  if (!query) {
    return NextResponse.json({ items: [] });
  }

  const vector = await embed(query);

  const sql = `
    SELECT ac."id", ac."assetId", ac."metaTitle", ac."metaDescription",
           1 - (ac."embedding" <=> $1::vector) AS score
    FROM "AssetContent" ac
    WHERE ac."embedding" IS NOT NULL
    ORDER BY ac."embedding" <=> $1::vector
    LIMIT 20
  `;

  const items = await prisma.$queryRawUnsafe(sql, `[${vector.join(",")}]`);

  return NextResponse.json({ items });
}
