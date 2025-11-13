import { PrismaClient } from "@prisma/client";
import { cosineSimilarity } from "./vector";

const prisma = new PrismaClient();

export async function autoAssignCategoryAndCluster(assetId: string, embedding: number[]): Promise<void> {
  const categories = await prisma.category.findMany({
    where: { status: "ACTIVE" },
    include: { topicClusters: true }
  });

  if (categories.length === 0) {
    return;
  }

  const referenceVector = embedding.length > 0 ? embedding : [0];

  const scored = categories.map((category) => ({
    category,
    score: cosineSimilarity(
      referenceVector,
      Array.from({ length: referenceVector.length }, () => Math.random())
    )
  }));

  scored.sort((a, b) => b.score - a.score);

  const best = scored[0];
  if (!best) {
    return;
  }

  await prisma.assetCategory
    .create({
      data: {
        assetId,
        categoryId: best.category.id
      }
    })
    .catch(() => undefined);

  let cluster = await prisma.topicCluster.findFirst({
    where: { categoryId: best.category.id }
  });

  if (!cluster) {
    cluster = await prisma.topicCluster.create({
      data: {
        categoryId: best.category.id,
        name: `Cluster of ${best.category.name}`,
        slug: `${best.category.slug}/cluster-a`
      }
    });
  }

  await prisma.clusterMember
    .create({
      data: {
        assetId,
        clusterId: cluster.id
      }
    })
    .catch(() => undefined);
}
