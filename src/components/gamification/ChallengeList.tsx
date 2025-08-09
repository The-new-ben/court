import React, { useEffect, useState } from 'react';

interface Challenge {
  type: string;
  date: string;
  completed: boolean;
}

export default function ChallengeList() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    async function loadChallenges() {
      try {
        const res = await fetch('/api/challenges');
        if (!res.ok) {
          throw new Error('Failed to fetch challenges');
        }
        const data = await res.json();
        setChallenges(data);
      } catch (err) {
        console.error('Error loading challenges', err);
      }
    }

    loadChallenges();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Challenges</h2>
      <ul className="space-y-2">
        {challenges.map(challenge => (
          <li key={challenge.type} className="flex justify-between p-2 border rounded">
            <span>{challenge.type}</span>
            <span>{new Date(challenge.date).toLocaleDateString()}</span>
            <span>{challenge.completed ? 'Completed' : 'In Progress'}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
