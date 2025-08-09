import React, { useEffect, useState } from 'react';

interface Votes {
  plaintiff: number;
  defendant: number;
}

interface VerdictVoteProps {
  caseId: string;
}

const initialVotes: Votes = { plaintiff: 0, defendant: 0 };

export default function VerdictVote({ caseId }: VerdictVoteProps) {
  const [votes, setVotes] = useState<Votes>(initialVotes);

  useEffect(() => {
    fetch(`/cases/${caseId}/vote`)
      .then((res) => (res.ok ? res.json() : initialVotes))
      .then((data: Votes) => setVotes(data))
      .catch(() => setVotes(initialVotes));
  }, [caseId]);

  const totalVotes = votes.plaintiff + votes.defendant;
  const plaintiffPercentage = totalVotes ? (votes.plaintiff / totalVotes) * 100 : 50;
  const defendantPercentage = totalVotes ? (votes.defendant / totalVotes) * 100 : 50;

  const handleVote = async (side: 'plaintiff' | 'defendant') => {
    try {
      const res = await fetch(`/cases/${caseId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ side }),
      });
      if (res.ok) {
        const data: Votes = await res.json();
        setVotes(data);
      }
    } catch (error) {
      console.error('Vote error', error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 space-y-4">
      <h2 className="text-xl font-bold font-serif text-gray-900 dark:text-white text-center">Audience Verdict</h2>

      <div>
        <div className="flex justify-between text-sm font-semibold mb-1">
          <span className="text-blue-600 dark:text-blue-400">Plaintiff</span>
          <span className="text-red-600 dark:text-red-400">Defendant</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden flex">
          <div
            className="bg-blue-500 transition-all duration-500 ease-out"
            style={{ width: `${plaintiffPercentage}%` }}
            aria-label="Plaintiff votes"
          />
          <div
            className="bg-red-500 transition-all duration-500 ease-out"
            style={{ width: `${defendantPercentage}%` }}
            aria-label="Defendant votes"
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>{votes.plaintiff.toLocaleString()} votes</span>
          <span>{votes.defendant.toLocaleString()} votes</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => handleVote('plaintiff')}
          className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Vote for Plaintiff
        </button>
        <button
          onClick={() => handleVote('defendant')}
          className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Vote for Defendant
        </button>
      </div>

      <p className="text-center text-xs text-gray-500 dark:text-gray-400">Total Votes: {totalVotes.toLocaleString()}</p>
    </div>
  );
}
