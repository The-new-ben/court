import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface RewardItem {
  id: string;
  name: string;
  cost: number;
}

export function RewardStore() {
  const { user } = useAuth();
  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [points, setPoints] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) return;
    fetch('/api/rewards', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('hypercourt_token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setRewards(data.rewards);
        setPoints(data.points);
      })
      .catch(err => console.error('Failed to load rewards', err));
  }, [user]);

  const handleRedeem = async (rewardId: string) => {
    try {
      const res = await fetch('/api/rewards/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('hypercourt_token')}`
        },
        body: JSON.stringify({ rewardId })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Redemption failed');
      }
      setPoints(data.points);
      setMessage('Reward redeemed');
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  if (!user) {
    return <p className="text-center">Please log in to view rewards.</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Reward Store</h2>
      <p className="mb-4">Points: {points}</p>
      {message && <p className="mb-4 text-sm text-red-500">{message}</p>}
      <ul className="space-y-2">
        {rewards.map(reward => (
          <li key={reward.id} className="flex justify-between items-center border p-2 rounded">
            <span>{reward.name}</span>
            <button
              className="px-2 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
              disabled={points < reward.cost}
              onClick={() => handleRedeem(reward.id)}
            >
              Redeem ({reward.cost})
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
