
import React from 'react';
import { UserIcon } from '../UserIcon';

const InfoItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
    <p className="text-md font-semibold text-gray-800 dark:text-gray-200">{value}</p>
  </div>
);

const ParticipantItem: React.FC<{ role: string; name: string }> = ({ role, name }) => (
    <div className="flex items-center space-x-3">
        <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full">
            <UserIcon className="w-5 h-5 text-blue-600 dark:text-blue-400"/>
        </div>
        <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{role}</p>
        </div>
    </div>
);


export const CaseInfoPanel: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6 h-full">
      <h2 className="text-xl font-bold font-serif text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">Case Details</h2>
      <div className="space-y-4">
        <InfoItem label="Case Number" value="2024-COPY-0815" />
        <InfoItem label="Case Name" value="Pixel Perfect v. Petrova" />
        <InfoItem label="Court" value="Federal Court, District of Art & Tech" />
      </div>
      <h3 className="text-lg font-bold font-serif text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">Participants</h3>
      <div className="space-y-4">
        <ParticipantItem role="Presiding Judge" name="Hon. Ada Lovelace" />
        <ParticipantItem role="Plaintiff" name="Pixel Pete" />
        <ParticipantItem role="Defendant" name="Anya Petrova" />
      </div>
    </div>
  );
};
