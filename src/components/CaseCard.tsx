

import React, { useState } from 'react';
import { Case } from '../services/caseService';
import { caseStateService } from '../cases/service';
import { allowedTransitions, CaseStage } from '../cases/types';
import { Download, ChevronDown, ChevronUp, Copy } from 'lucide-react';
import { highlightText, truncateText } from '../utils/textHighlight';
import { suggestPrecedents } from '../../geminiService';
import type { AIResponse } from '../../types';

interface CaseCardProps {
  caseData: Case;
  searchTerm: string;
}

export default function CaseCard({ caseData, searchTerm }: CaseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localCase, setLocalCase] = useState<Case>(caseData);
  const [activeTab, setActiveTab] = useState<'details' | 'research'>('details');
  const [research, setResearch] = useState<AIResponse | null>(null);
  const [isResearchLoading, setIsResearchLoading] = useState(false);

  const downloadCase = () => {
    let fileContent = `HyperCourt - סיכום דיון\n==============================\n\nתאריך: ${localCase.timestamp}\n\n`;
    fileContent += `---------- תיאור המקרה ----------\n\n${localCase.description}\n\n`;
    localCase.opinions.forEach((opinion) => {
      fileContent += `---------- חוות דעת (${opinion.system}) ----------\n\n${opinion.reply}\n\n`;
    });
    fileContent += `---------- פסק-דין מאוזן ----------\n\n${localCase.balanced}\n`;

    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `hyper_court_case_${localCase.id.slice(0, 8)}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // הגנה מפני undefined
  const nextStage: CaseStage | undefined = allowedTransitions[localCase.stage]?.[0];

  const advanceStage = async (stage: CaseStage) => {
    try {
      const updated = await caseStateService.moveToStage(localCase.id, stage);
      setLocalCase(updated);
    } catch (err) {
      console.warn(err);
    }
  };

  const handleTabChange = (tab: 'details' | 'research') => {
    setActiveTab(tab);
    if (tab === 'research' && !research && !isResearchLoading) {
      setIsResearchLoading(true);
      suggestPrecedents(localCase.description)
        .then(setResearch)
        .catch((error) => {
          console.error('Research error:', error);
          setResearch({ text: 'שגיאה בעת שליפת המחקר.' });
        })
        .finally(() => setIsResearchLoading(false));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transition-all duration-300">
      {/* Header */}
      <div
        className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded((v) => !v)}
      >
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 line-clamp-1">
            {truncateText(localCase.description, 80)}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{localCase.timestamp}</p>
          <p className="text-xs text-gray-600 mt-1">שלב נוכחי: {localCase.stage}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              downloadCase();
            }}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
            title="הורד דיון"
          >
            <Download size={16} />
          </button>
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>

      {/* Body */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4 space-y-6">
          {nextStage && (
            <button
              onClick={() => advanceStage(nextStage)}
              className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              עבור לשלב {nextStage}
            </button>
          )}

          {/* Tabs */}
          <div className="border-t border-gray-200">
            <div className="flex border-b">
              <button
                onClick={() => handleTabChange('details')}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === 'details'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500'
                }`}
              >
                פירוט
              </button>
              <button
                onClick={() => handleTabChange('research')}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === 'research'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500'
                }`}
              >
                מחקר
              </button>
            </div>

            {/* Details tab */}
            {activeTab === 'details' && (
              <div className="p-4 space-y-6">
                {/* Description */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-blue-700">תיאור המקרה:</h4>
                    <div className="flex gap-1">
                      <button
                        onClick={() => copyToClipboard(localCase.description)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="העתק"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>
                  <div
                    className="text-gray-800 bg-gray-50 p-3 rounded-md"
                    dangerouslySetInnerHTML={{
                      __html: highlightText(localCase.description, searchTerm),
                    }}
                  />
                </div>

                {/* Opinions */}
                {localCase.opinions.map((opinion, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-purple-700">
                        עמדת {opinion.system}:
                      </h4>
                      <div className="flex gap-1">
                        <button
                          onClick={() => copyToClipboard(opinion.reply)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="העתק"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </div>
                    <div
                      className="text-gray-800 bg-purple-50 p-3 rounded-md"
                      dangerouslySetInnerHTML={{
                        __html: highlightText(opinion.reply, searchTerm),
                      }}
                    />
                  </div>
                ))}

                {/* Balanced verdict */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-green-700">פסק-דין מאוזן:</h4>
                    <div className="flex gap-1">
                      <button
                        onClick={() => copyToClipboard(localCase.balanced)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="העתק"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>
                  <div
                    className="text-gray-800 bg-green-50 p-3 rounded-md font-medium"
                    dangerouslySetInnerHTML={{
                      __html: highlightText(localCase.balanced, searchTerm),
                    }}
                  />
                </div>

                {/* History */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">היסטוריית שלבים:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {localCase.history.map((h, i) => (
                      <li key={i}>
                        {h.stage} - {new Date(h.timestamp).toLocaleString('he-IL')}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Research tab */}
            {activeTab === 'research' && (
              <div className="p-4">
                {isResearchLoading && <div className="text-gray-500">טוען מחקר...</div>}
                {!isResearchLoading && research && (
                  <div
                    className="text-gray-800 bg-blue-50 p-3 rounded-md whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{
                      __html: highlightText(research.text, searchTerm),
                    }}
                  />
                )}
                {!isResearchLoading && !research && (
                  <div className="text-gray-500">אין תוצאות מחקר זמינות.</div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

