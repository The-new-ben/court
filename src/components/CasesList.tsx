import React from 'react';
import { Case } from '../services/caseService';
import CaseCard from './CaseCard';

interface CasesListProps {
  cases: Case[];
  searchTerm: string;
}

export default function CasesList({ cases, searchTerm }: CasesListProps) {
  if (cases.length === 0) {
    return (
      <div className="mt-8 text-center text-gray-500">
        <p>אין דיונים עדיין. התחל דיון חדש כדי לראות תוצאות כאן.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        דיונים ({cases.length})
      </h2>
      {cases.slice().reverse().map(caseItem => (
        <CaseCard 
          key={caseItem.id} 
          caseData={caseItem} 
          searchTerm={searchTerm} 
        />
      ))}
    </div>
  );
}