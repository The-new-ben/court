import React, { useEffect, useState } from 'react';
import { viewerProfileService, ViewerProfile } from '../../services/viewerProfileService';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfileCenter() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ViewerProfile>({
    id: user?.email || 'guest',
    watchHistory: [],
    notificationPreferences: { email: true, sms: false },
    avatarImage: ''
  });

  useEffect(() => {
    if (!user) return;
    viewerProfileService.getProfile(user.email).then(saved => {
      if (saved) setProfile(saved);
    });
  }, [user]);

  const handlePrefChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setProfile(prev => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences,
        [name]: checked
      }
    }));
  };

  const handleSave = async () => {
    await viewerProfileService.saveProfile(profile);
    viewerProfileService.tailorContent(profile);
    alert('Profile saved');
  };

  if (!user) {
    return <div>אנא התחבר כדי לערוך פרופיל</div>;
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">פרופיל צופה</h2>

      <div className="mb-4">
        <label className="block mb-1 font-medium">תמונת אוואטר (URL)</label>
        <input
          className="w-full border p-2"
          value={profile.avatarImage}
          onChange={e => setProfile({ ...profile, avatarImage: e.target.value })}
        />
      </div>

      <div className="mb-4">
        <h3 className="font-medium mb-1">העדפות התראות</h3>
        <label className="block">
          <input
            type="checkbox"
            name="email"
            checked={profile.notificationPreferences.email}
            onChange={handlePrefChange}
            className="mr-2"
          />
          מייל
        </label>
        <label className="block">
          <input
            type="checkbox"
            name="sms"
            checked={profile.notificationPreferences.sms}
            onChange={handlePrefChange}
            className="mr-2"
          />
          SMS
        </label>
      </div>

      <div className="mb-4">
        <h3 className="font-medium mb-1">היסטוריית צפייה</h3>
        {profile.watchHistory.length === 0 ? (
          <p>אין היסטוריה</p>
        ) : (
          <ul className="list-disc pl-5">
            {profile.watchHistory.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={handleSave}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        שמור
      </button>
    </div>
  );
}
