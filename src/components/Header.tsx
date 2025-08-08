import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-blue-800">HyperCourt</h1>
          <p className="text-sm text-gray-600">מערכת משפטית חכמה</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              ברוך הבא, {user?.email}
            </p>
            <p className="text-xs text-gray-500">
              {user?.role === 'admin' ? 'מנהל מערכת' :
               user?.role === 'lawyer' ? 'עורך/ת דין' :
               user?.role === 'judge' ? 'שופט/ת' :
               user?.role === 'litigant' ? 'מתדיין/נת' :
               user?.role === 'clerk' ? 'פקיד/ת' : user?.role}
            </p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            <LogOut size={16} />
            התנתק
          </button>
        </div>
      </div>
    </header>
  );
}