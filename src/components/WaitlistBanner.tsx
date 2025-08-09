import React, { useState } from 'react';
import { waitlistService } from '../services/waitlistService';

export default function WaitlistBanner() {
  const [joined, setJoined] = useState(false);

  const handleJoin = async () => {
    const email = window.prompt('הכנס כתובת אימייל כדי להצטרף לרשימת ההמתנה');
    if (!email) return;
    await waitlistService.join(email);
    setJoined(true);
  };

  if (joined) {
    return (
      <div className="p-4 mb-4 bg-green-100 text-green-800 rounded">
        נרשמת לרשימת ההמתנה
      </div>
    );
  }

  return (
    <div className="p-4 mb-4 bg-yellow-100 text-yellow-800 rounded flex justify-between items-center">
      <span>המקומות מלאים</span>
      <button
        onClick={handleJoin}
        className="bg-yellow-600 text-white px-4 py-2 rounded"
      >
        הצטרף לרשימת המתנה
      </button>
    </div>
  );
}
