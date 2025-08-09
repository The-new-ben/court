import React, { useEffect, useState } from 'react';
import { Evidence, EvidenceLog, evidenceService } from '../services/evidenceService';

interface Props {
  evidenceId: string;
}

export default function EvidenceViewer({ evidenceId }: Props) {
  const [evidence, setEvidence] = useState<Evidence | null>(null);
  const [logs, setLogs] = useState<EvidenceLog[]>([]);

  useEffect(() => {
    const load = async () => {
      const ev = await evidenceService.getEvidence(evidenceId);
      const lg = await evidenceService.getLogs(evidenceId);
      setEvidence(ev || null);
      setLogs(lg);
    };
    load();
  }, [evidenceId]);

  if (!evidence) {
    return <div>Loading evidence...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="p-4 border rounded">
        <h2 className="text-xl font-bold mb-2">Evidence Details</h2>
        <p><strong>Owner:</strong> {evidence.owner}</p>
        <p><strong>Timestamp:</strong> {new Date(evidence.timestamp).toLocaleString()}</p>
        <p><strong>Source:</strong> {evidence.source}</p>
        <p><strong>Content:</strong> {evidence.content}</p>
      </div>

      <div className="p-4 border rounded">
        <h3 className="text-lg font-bold mb-2">Chain of Custody</h3>
        <ul className="list-disc pl-5 space-y-1">
          {logs.map(log => (
            <li key={log.id}>
              {log.action} {log.from && `from ${log.from}`} {log.to && `to ${log.to}`} at {new Date(log.timestamp).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
