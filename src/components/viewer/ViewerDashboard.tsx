import React, { useState } from 'react';

export default function ViewerDashboard() {
  const [inviteLink, setInviteLink] = useState('');

  const handleInvite = async () => {
    try {
      const res = await fetch('/api/invites/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      setInviteLink(data.link);
    } catch (err) {
      console.error('Failed to create invite', err);
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={handleInvite}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        Invite
      </button>
      {inviteLink && (
        <p className="mt-4 break-all">{inviteLink}</p>
      )}
    </div>
  );
}
