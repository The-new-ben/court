import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const realEstate = await prisma.category.upsert({
    where: { slug: "real-estate" },
    update: {},
    create: {
      slug: "real-estate",
      name: "נדל"ן",
      depth: 0,
      path: "real-estate",
      primaryKeyword: "נדל"ן"
    }
  });

  const apartments = await prisma.category.upsert({
    where: { slug: "real-estate/apartments" },
    update: {},
    create: {
      slug: "real-estate/apartments",
      name: "דירות",
      parentId: realEstate.id,
      depth: 1,
      path: "real-estate.apartments",
      primaryKeyword: "דירות למכירה"
    }
  });

  await prisma.category.upsert({
    where: { slug: "real-estate/apartments/tel-aviv" },
    update: {},
    create: {
      slug: "real-estate/apartments/tel-aviv",
      name: "דירות בתל אביב",
      parentId: apartments.id,
      depth: 2,
      path: "real-estate.apartments.tel-aviv",
      primaryKeyword: "דירות בתל אביב"
    }
  });

  console.log("Seed complete");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
