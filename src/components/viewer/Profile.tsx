import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface PointsData {
  points: number;
  badge: string | null;
}

export default function Profile() {
  const { user } = useAuth();
  const [data, setData] = useState<PointsData>({ points: 0, badge: null });

  useEffect(() => {
    if (!user) return;
    fetch(`/api/points/${encodeURIComponent(user.email)}`)
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error('Failed to load points', err));
  }, [user]);

  if (!user) {
    return <div>יש להתחבר כדי לצפות בפרופיל.</div>;
  }

  return (
    <div>
      <h2>{user.email}</h2>
      <p>נקודות: {data.points}</p>
      {data.badge && <p>תג: {data.badge}</p>}
    </div>
  );
}

