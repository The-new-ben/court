import { Panel } from "@ui";

export default function AiSettingsPage() {
  return (
    <div className="space-y-6">
      <Panel title="AI configuration" description="Manage model settings and guardrails.">
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600">
          <li>Update the <code>OPENAI_API_KEY</code> secret in your deployment environment.</li>
          <li>Control temperatures and limits by editing <code>packages/ai/src/generate.ts</code>.</li>
          <li>Moderate content before publication to comply with local regulations.</li>
        </ul>
      </Panel>
    </div>
  );
}
