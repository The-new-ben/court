import { isSupabaseConfigured } from './lib/supabaseClient';

const setupSteps = [
  {
    title: 'Install dependencies',
    detail: 'Run npm install to fetch packages and keep them in sync with the lockfile.'
  },
  {
    title: 'Configure environment variables',
    detail: 'Create a .env.local file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY values.'
  },
  {
    title: 'Start development server',
    detail: 'Execute npm run dev and open the displayed URL to begin building your app.'
  }
];

const supabaseInfo = isSupabaseConfigured
  ? 'Supabase client is ready to accept requests.'
  : 'Supabase credentials are not configured yet.';

function App() {
  return (
    <div className="app-shell">
      <header className="hero">
        <h1>Project foundation ready</h1>
        <p>Your workspace is clean and ready for new features.</p>
      </header>
      <main className="content">
        <section className="card">
          <h2>First configuration steps</h2>
          <ol>
            {setupSteps.map((step) => (
              <li key={step.title}>
                <h3>{step.title}</h3>
                <p>{step.detail}</p>
              </li>
            ))}
          </ol>
        </section>
        <section className="card">
          <h2>Supabase readiness</h2>
          <p>{supabaseInfo}</p>
          <p>Update netlify.toml or GitHub secrets with the same variables to deploy confidently.</p>
        </section>
      </main>
    </div>
  );
}

export default App;
