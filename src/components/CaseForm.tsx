import React, { useState, useRef, useEffect } from 'react';
import { aiService } from '../services/aiService';
import { Case } from '../services/caseService';
import { Mic, Video, Upload, Play } from 'lucide-react';
import { pointsService } from '../services/pointsService';
import { useAuth } from '../contexts/AuthContext';

interface CaseFormProps {
  onNewCase: (caseData: Case) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export default function CaseForm({ onNewCase, isLoading, setIsLoading }: CaseFormProps) {
  const [description, setDescription] = useState('');
  const [selectedSystems, setSelectedSystems] = useState<string[]>(['common law']);
  const [selectedModel, setSelectedModel] = useState('openai/gpt-oss-20b:fireworks-ai');
  const [error, setError] = useState('');
  const [points, setPoints] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      pointsService.getPoints(user.id).then(setPoints).catch(() => setPoints(0));
    }
  }, [user]);

  const systems = [
    { value: 'common law', label: 'משפט מקובל (Common Law)' },
    { value: 'civil law', label: 'משפט אזרחי (Civil Law)' },
    { value: 'jewish law', label: 'הלכה יהודית' },
    { value: 'islamic law', label: 'הלכה איסלאמית' },
    { value: 'customary law', label: 'משפט מנהגי' }
  ];

  const models = [
    { value: 'openai/gpt-oss-20b:fireworks-ai', label: 'gpt-oss-20b' },
    { value: 'openai/gpt-oss-120b:cerebras', label: 'gpt-oss-120b' }
  ];

  const handleSystemChange = (systemValue: string) => {
    setSelectedSystems(prev => 
      prev.includes(systemValue)
        ? prev.filter(s => s !== systemValue)
        : [...prev, systemValue]
    );
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      setError('יש להזין תיאור מקרה או טיעון.');
      return;
    }

    if (selectedSystems.length === 0) {
      setError('יש לבחור לפחות מסגרת משפט אחת.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const opinions = await Promise.all(
        selectedSystems.map(async (system) => {
          const prompt = `Follow this order strictly: 1. Jurisdiction & applicable law. 2. Uncontested vs contested facts. 3. Key legal issues. 4. Evidence admissibility & weight. 5. Parties' arguments. 6. Apply substantive rules of ${system}. 7. Deliver a reasoned, structured judgment with citations.`;
          
          const reply = await aiService.chat([
            { role: 'system', content: `You are a judge trained in ${system}.\n${prompt}` },
            { role: 'user', content: description }
          ], selectedModel);

          return { system, reply };
        })
      );

      const balanced = selectedSystems.length > 1 
        ? await aiService.chat([
            { 
              role: 'system', 
              content: 'You are an impartial mediator summarizing multiple legal opinions and issuing a single, balanced verdict.' 
            },
            { 
              role: 'user', 
              content: opinions.map(o => `Opinion from ${o.system} perspective:\n${o.reply}`).join('\n\n---\n\n')
            }
          ], selectedModel)
        : opinions[0].reply;

      const caseData: Case = {
        id: crypto.randomUUID(),
        description,
        opinions,
        balanced,
        timestamp: new Date().toLocaleString('he-IL')
      };

      onNewCase(caseData);
      if (user) {
        const updated = await pointsService.awardPoints(user.id, 20);
        setPoints(updated);
      }
      setDescription('');
      
      // Notifications
      if (Notification.permission === 'granted') {
        new Notification('פסק‑דין מוכן', {
          body: 'הדיון הסתיים ופסק-דין מאוזן מוכן לצפייה.'
        });
      } else if (Notification.permission === 'default') {
        Notification.requestPermission();
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (user && e.target.files && e.target.files.length > 0) {
      const updated = await pointsService.awardPoints(user.id, 10);
      setPoints(updated);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <div>
        <div className="text-right text-sm text-gray-600 mb-2">נקודות: {points}</div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          בחר מסגרות משפט:
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {systems.map(system => (
            <label key={system.value} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedSystems.includes(system.value)}
                onChange={() => handleSystemChange(system.value)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                disabled={isLoading}
              />
              <span className="mr-2 text-sm">{system.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          בחר מודל:
        </label>
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        >
          {models.map(model => (
            <option key={model.value} value={model.value}>
              {model.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          תיאור מקרה / טיעון:
        </label>
        <div className="relative">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="תאר את פרטי המקרה..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
            disabled={isLoading}
          />
          <button
            className="absolute bottom-2 left-2 p-2 text-gray-500 hover:text-gray-700"
            title="הקלט קולי"
            disabled={isLoading}
          >
            <Mic size={18} />
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
          <Play size={16} />
          {isLoading ? 'מעבד...' : 'החל דיון'}
        </button>
        
        <button
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          title="צ'אט וידאו"
          disabled={isLoading}
        >
          <Video size={16} />
          וידאו
        </button>
        
        <>
          <button
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
            title="העלה מסמכים"
            disabled={isLoading}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={16} />
            מסמכים
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileUpload}
          />
        </>
      </div>
    </div>
  );
}