import Link from "next/link";
import { Panel } from "@ui";

export default function NewAssetPage() {
  return (
    <div className="space-y-6">
      <Panel title="Create asset" description="Submit a request for AI assisted generation.">
        <p className="text-sm text-slate-600">
          Use the API endpoint <code>/api/assets</code> to create new entries programmatically. This UI will be expanded with
          forms in future iterations.
        </p>
        <Link className="text-sm font-semibold text-indigo-600" href="/admin/assets">
          Back to assets
        </Link>
      </Panel>
    </div>
  );
}
