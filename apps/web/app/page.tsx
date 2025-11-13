export default function HomePage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 p-10">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-wide text-slate-500">AI Catalog Platform</p>
        <h1 className="text-4xl font-bold text-slate-900">Build smarter catalogs faster</h1>
        <p className="text-lg text-slate-600">
          Administer assets, trigger AI content, and power semantic search from a unified monorepo.
        </p>
      </header>
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Next steps</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-slate-700">
          <li>Configure environment variables in the root .env file.</li>
          <li>Run database migrations from packages/db.</li>
          <li>Launch the web app with <code>pnpm -C apps/web dev</code>.</li>
        </ol>
      </section>
    </main>
  );
}
