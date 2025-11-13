import type { ReactNode } from "react";
import Link from "next/link";
import "../globals.css";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r border-slate-200 bg-white p-6">
        <h1 className="text-xl font-semibold text-slate-900">Admin</h1>
        <nav className="mt-6 space-y-3 text-sm">
          <Link className="block text-slate-600 hover:text-slate-900" href="/admin">
            Dashboard
          </Link>
          <Link className="block text-slate-600 hover:text-slate-900" href="/admin/assets">
            Assets
          </Link>
          <Link className="block text-slate-600 hover:text-slate-900" href="/admin/settings/ai">
            AI Settings
          </Link>
        </nav>
      </aside>
      <main className="flex-1 bg-slate-50 p-10">{children}</main>
    </div>
  );
}
