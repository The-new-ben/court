import React, { useState } from 'react';
import { useLanguage, Language } from '../contexts/LanguageContext';
import { legalFormTemplates } from '../templates/legalForms';

export default function ProfileSettings() {
  const { language, setLanguage, t } = useLanguage();
  const [selectedForm, setSelectedForm] = useState<'powerOfAttorney' | 'complaint'>('powerOfAttorney');
  const template = legalFormTemplates[language][selectedForm];

  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-2">{t('profile.language')}</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="border rounded p-2"
        >
          <option value="en">English</option>
          <option value="he">עברית</option>
        </select>
      </div>

      <div>
        <label className="block mb-2">{t('profile.templates')}</label>
        <select
          value={selectedForm}
          onChange={(e) => setSelectedForm(e.target.value as 'powerOfAttorney' | 'complaint')}
          className="border rounded p-2 mb-2"
        >
          <option value="powerOfAttorney">{t('profile.templates.powerOfAttorney')}</option>
          <option value="complaint">{t('profile.templates.complaint')}</option>
        </select>
        <textarea
          className="w-full h-40 border rounded p-2"
          value={template}
          readOnly
        />
      </div>
    </div>
  );
}
