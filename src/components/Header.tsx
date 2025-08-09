import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Header() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-blue-800">{t('header.title')}</h1>
          <p className="text-sm text-gray-600">{t('header.subtitle')}</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              {t('header.welcome', { email: user?.email || '' })}
            </p>
            <p className="text-xs text-gray-500">
              {user?.role === 'admin' ? 'מנהל מערכת' :
               user?.role === 'lawyer' ? 'עורך/ת דין' :
               user?.role === 'judge' ? 'שופט/ת' :
               user?.role === 'litigant' ? 'מתדיין/נת' :
               user?.role === 'clerk' ? 'פקיד/ת' : user?.role}
              {user?.role === 'admin' ? t('header.roles.admin') :
               user?.role === 'lawyer' ? t('header.roles.lawyer') :
               user?.role === 'judge' ? t('header.roles.judge') :
               user?.role === 'plaintiff' ? t('header.roles.plaintiff') : user?.role}
            </p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            <LogOut size={16} />
            {t('header.logout')}
          </button>
        </div>
      </div>
    </header>
  );
}