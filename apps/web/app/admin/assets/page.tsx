import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import { Panel } from "@ui";

const prisma = new PrismaClient();

export default async function AssetListPage() {
  const assets = await prisma.asset.findMany({
    orderBy: { updatedAt: "desc" },
    take: 20
  });

  return (
    <div className="space-y-6">
      <Panel title="Assets" description="Recently updated entries">
        <div className="flex justify-between">
          <span className="text-sm text-slate-500">Showing {assets.length} records</span>
          <Link className="text-sm font-semibold text-indigo-600" href="/admin/assets/new">
            Create asset
          </Link>
        </div>
        <ul className="divide-y divide-slate-200">
          {assets.map((asset) => (
            <li key={asset.id} className="py-3">
              <Link className="font-medium text-slate-900" href={`/admin/assets/${asset.id}`}>
                {asset.slug}
              </Link>
              <p className="text-sm text-slate-500">{asset.type}</p>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
