import React, { useState } from 'react';
import { Case } from '../services/caseService';
import { Download, ChevronDown, ChevronUp, Copy, ZoomIn } from 'lucide-react';
import { highlightText, truncateText } from '../utils/textHighlight';

interface CaseCardProps {
  caseData: Case;
  searchTerm: string;
}

export default function CaseCard({ caseData, searchTerm }: CaseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const downloadCase = () => {
    let fileContent = `HyperCourt - סיכום דיון\n==============================\n\nתאריך: ${caseData.timestamp}\n\n`;
    fileContent += `---------- תיאור המקרה ----------\n\n${caseData.description}\n\n`;
    caseData.opinions.forEach(opinion => {
      fileContent += `---------- חוות דעת (${opinion.system}) ----------\n\n${opinion.reply}\n\n`;
    });
    fileContent += `---------- פסק-דין מאוזן ----------\n\n${caseData.balanced}\n`;
    
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `hyper_court_case_${caseData.id.slice(0,8)}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transition-all duration-300">
      <div 
        className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 line-clamp-1">
            {truncateText(caseData.description, 80)}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{caseData.timestamp}</p>
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

      {isExpanded && (
        <div className="border-t border-gray-200 p-4 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-blue-700">תיאור המקרה:</h4>
              <div className="flex gap-1">
                <button
                  onClick={() => copyToClipboard(caseData.description)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                  title="העתק"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>
            <div 
              className="text-gray-800 bg-gray-50 p-3 rounded-md"
              dangerouslySetInnerHTML={{ __html: highlightText(caseData.description, searchTerm) }}
            />
          </div>

          {caseData.opinions.map((opinion, index) => (
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
                dangerouslySetInnerHTML={{ __html: highlightText(opinion.reply, searchTerm) }}
              />
            </div>
          ))}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-green-700">פסק-דין מאוזן:</h4>
              <div className="flex gap-1">
                <button
                  onClick={() => copyToClipboard(caseData.balanced)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                  title="העתק"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>
            <div 
              className="text-gray-800 bg-green-50 p-3 rounded-md font-medium"
              dangerouslySetInnerHTML={{ __html: highlightText(caseData.balanced, searchTerm) }}
            />
          </div>
        </div>
      )}
    </div>
  );
}