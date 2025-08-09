import React from 'react';

export interface Achievement {
  id: string;
  name: string;
}

export interface Attorney {
  name: string;
  achievements: Achievement[];
}

export const AttorneyProfile: React.FC<{ attorney: Attorney }> = ({ attorney }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">{attorney.name}</h2>
      <div className="flex flex-wrap gap-2 mt-2">
        {attorney.achievements.map((ach) => (
          <span
            key={ach.id}
            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
          >
            {ach.name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AttorneyProfile;
