import React, { useEffect, useRef } from 'react';
import type { TranscriptEntry as TranscriptEntryType } from '../types';
import { Role } from '../types';
import { GavelIcon } from '../GavelIcon';
import { UserIcon } from '../UserIcon';
import { UsersIcon } from '../UsersIcon';

const getRoleStyles = (role: Role) => {
  switch (role) {
    case Role.JUDGE:
      return "bg-yellow-100 dark:bg-yellow-900/50 border-l-4 border-yellow-500";
    case Role.PLAINTIFF:
      return "bg-blue-100 dark:bg-blue-900/50 border-l-4 border-blue-500";
    case Role.DEFENDANT:
      return "bg-red-100 dark:bg-red-900/50 border-l-4 border-red-500";
    case Role.WITNESS:
      return "bg-green-100 dark:bg-green-900/50 border-l-4 border-green-500";
    case Role.AUDIENCE:
        return "bg-gray-200 dark:bg-gray-700/80 border-l-4 border-gray-500";
    default:
      return "bg-gray-100 dark:bg-gray-700 border-l-4 border-gray-400";
  }
};

const RoleIcon: React.FC<{role: Role}> = ({role}) => {
    const iconClass = "w-5 h-5";
    switch (role) {
        case Role.JUDGE:
            return <GavelIcon className={`${iconClass} text-yellow-600 dark:text-yellow-400`} />;
        case Role.AUDIENCE:
            return <UsersIcon className={`${iconClass} text-gray-600 dark:text-gray-400`} />;
        default:
            return <UserIcon className={`${iconClass} text-gray-500 dark:text-gray-400`} />;
    }
}

const TranscriptEntry: React.FC<{ entry: TranscriptEntryType }> = ({ entry }) => {
  return (
    <div className={`p-4 rounded-r-lg ${getRoleStyles(entry.role)}`}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center space-x-2">
            <RoleIcon role={entry.role} />
            <p className="font-bold text-sm text-gray-800 dark:text-gray-200">{entry.name} <span className="font-normal text-gray-600 dark:text-gray-400">({entry.role})</span></p>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{entry.timestamp}</p>
      </div>
      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{entry.text}</p>
    </div>
  );
};

export const TranscriptPanel: React.FC<{ transcript: TranscriptEntryType[] }> = ({ transcript }) => {
  const endOfTranscriptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfTranscriptRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  return (
    <div className="flex-grow overflow-y-auto p-4 space-y-4">
      {transcript.map((entry) => (
        <TranscriptEntry key={entry.id} entry={entry} />
      ))}
      <div ref={endOfTranscriptRef} />
    </div>
  );
};