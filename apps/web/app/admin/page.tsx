import { Panel } from "@ui";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <Panel title="Overview" description="Key actions to manage the catalog.">
        <p>Use the navigation to create assets, trigger AI generation, and review SEO health.</p>
      </Panel>
    </div>
  );
}
