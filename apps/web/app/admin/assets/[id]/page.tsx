import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Panel } from "@ui";

const prisma = new PrismaClient();

interface PageProps {
  params: { id: string };
}

export default async function AssetDetailPage({ params }: PageProps) {
  const asset = await prisma.asset.findUnique({
    where: { id: params.id },
    include: {
      contents: { take: 1, orderBy: { updatedAt: "desc" } }
    }
  });

  if (!asset) {
    notFound();
  }

  const content = asset.contents[0];

  return (
    <div className="space-y-6">
      <Panel title={asset.slug} description={asset.type}>
        <p className="text-sm text-slate-600">Status: {asset.status}</p>
        {content ? (
          <div className="space-y-2 text-sm text-slate-600">
            <p>Primary keyword: {content.primaryKeyword ?? "n/a"}</p>
            <p>Language: {content.lang}</p>
          </div>
        ) : (
          <p className="text-sm text-slate-500">No content generated yet.</p>
        )}
        <Link className="text-sm font-semibold text-indigo-600" href="/admin/assets">
          Back to assets
        </Link>
      </Panel>
    </div>
  );
}
