import React, { useEffect, useState } from 'react';

interface Stats {
  viewers: number;
  votes: number;
  comments: number;
}

export default function ViewerStatsBar() {
  const [stats, setStats] = useState<Stats>({ viewers: 0, votes: 0, comments: 0 });

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000/analytics');

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setStats((prev) => ({
          viewers: data.viewers ?? prev.viewers,
          votes: data.votes ?? prev.votes,
          comments: data.comments ?? prev.comments,
        }));
      } catch (err) {
        console.error('Failed to parse analytics update', err);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="bg-gray-200 text-gray-800 p-2 flex gap-4 justify-center text-sm">
      <span>צופים: {stats.viewers}</span>
      <span>הצבעות: {stats.votes}</span>
      <span>תגובות: {stats.comments}</span>
    </div>
  );
}
