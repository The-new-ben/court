import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface PanelProps {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export function Panel({ title, description, children, className }: PanelProps) {
  return (
    <section className={twMerge("rounded-xl border border-slate-200 bg-white p-6 shadow-sm", className)}>
      <header className="space-y-1">
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        {description ? <p className="text-sm text-slate-500">{description}</p> : null}
      </header>
      {children ? <div className="mt-4 space-y-3 text-slate-700">{children}</div> : null}
    </section>
  );
}
