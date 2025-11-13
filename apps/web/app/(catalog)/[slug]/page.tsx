import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";

const prisma = new PrismaClient();

interface PageProps {
  params: { slug: string };
}

export default async function AssetPage({ params }: PageProps) {
  const asset = await prisma.asset.findUnique({
    where: { slug: params.slug },
    include: {
      contents: { take: 1, orderBy: { updatedAt: "desc" } },
      categoryLinks: { include: { category: true } }
    }
  });

  if (!asset) {
    notFound();
  }

  const content = asset.contents[0];

  const breadcrumbs = asset.categoryLinks
    .map((link) => link.category)
    .sort((a, b) => a.depth - b.depth)
    .map((category) => ({ name: category.name, path: category.slug }));

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-4 p-8">
      <nav className="text-sm text-slate-500">
        <Link href="/">ראשי</Link>
        {breadcrumbs.map((crumb) => (
          <span key={crumb.path} className="before:px-2 before:text-slate-400 before:content-['/']">
            <Link href={`/${crumb.path}`}>{crumb.name}</Link>
          </span>
        ))}
      </nav>
      <article className="space-y-6">
        <header className="space-y-2">
          <h1 className="text-4xl font-bold text-slate-900">{content?.h1}</h1>
          {content?.subhead ? <p className="text-lg text-slate-600">{content.subhead}</p> : null}
        </header>
        <section
          className="prose prose-slate max-w-none"
          dangerouslySetInnerHTML={{ __html: content?.htmlBody ?? "" }}
        />
      </article>
    </main>
  );
}
