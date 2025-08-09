import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

export function PointsDisplay() {
  const { user } = useAuth();
  const points = user?.points ?? 0;

  return (
    <div className="flex items-center space-x-2">
      <span className="font-semibold">נקודות:</span>
      <span>{points}</span>
    </div>
  );
}

export default PointsDisplay;
