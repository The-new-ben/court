
import React, { useState } from 'react';
import type { Role } from '../types';
import { Role as RoleEnum } from '../types';

interface UserInputPanelProps {
  onSubmit: (role: Role, name: string, text: string) => void;
  disabled?: boolean;
}

const roleToNameMap: Record<Role, string> = {
    [RoleEnum.JUDGE]: "Hon. Ada Lovelace",
    [RoleEnum.PLAINTIFF]: "Pixel Pete",
    [RoleEnum.DEFENDANT]: "Anya Petrova",
    [RoleEnum.WITNESS]: "Dr. Evelyn Reed",
    [RoleEnum.AUDIENCE]: "Audience Member",
    [RoleEnum.AI]: "AI Legal Assistant",
};

export const UserInputPanel: React.FC<UserInputPanelProps> = ({ onSubmit, disabled = false }) => {
  const [role, setRole] = useState<Role>(RoleEnum.PLAINTIFF);
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !disabled) {
      onSubmit(role, roleToNameMap[role], text);
      setText('');
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 p-4">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-2">
        <div className="flex-shrink-0">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="w-full sm:w-auto h-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100 disabled:opacity-50"
            disabled={disabled}
          >
            <option value={RoleEnum.PLAINTIFF}>Plaintiff</option>
            <option value={RoleEnum.DEFENDANT}>Defendant</option>
            <option value={RoleEnum.WITNESS}>Witness</option>
            <option value={RoleEnum.JUDGE}>Judge</option>
            <option value={RoleEnum.AUDIENCE}>Audience</option>
          </select>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={disabled ? 'Demo in progress...' : `Speaking as ${role}...`}
          rows={2}
          className="flex-grow w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100 resize-none disabled:opacity-50"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
            }
          }}
          disabled={disabled}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-blue-500 disabled:bg-gray-400 dark:disabled:bg-gray-500 disabled:cursor-not-allowed"
          disabled={!text.trim() || disabled}
        >
          Submit
        </button>
      </form>
    </div>
  );
};
