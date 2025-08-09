import React, { useEffect, useState } from 'react';

interface LeaderboardEntry {
  userId: string;
  name: string;
  hours: number;
}

export default function Leaderboard() {
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('hypercourt_token');
        const response = await fetch('http://localhost:5001/api/leaderboard/pro-bono', {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        });
        if (!response.ok) {
          throw new Error('Failed to load');
        }
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError('שגיאה בטעינת לוח ההובלה');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>טוען...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">לוח פרו בונו</h2>
      <ol className="space-y-2">
        {data.map((entry, index) => (
          <li
            key={entry.userId}
            className="flex justify-between rounded bg-white p-2 shadow"
          >
            <span>{index + 1}. {entry.name}</span>
            <span>{entry.hours} שעות</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
