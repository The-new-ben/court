import React, { useState, useEffect } from 'react';
import { Users, Database, Settings, Activity, Shield, AlertTriangle } from 'lucide-react';

export default function AdminPanel() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCases: 0,
    systemHealth: 'תקין',
    lastBackup: 'לא זמין'
  });

  useEffect(() => {
    // Load admin statistics
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Check backend health
      const response = await fetch('http://localhost:5001/api/health');
      if (response.ok) {
        const data = await response.json();
        setStats(prev => ({
          ...prev,
          totalUsers: data.users || 0,
          systemHealth: 'תקין'
        }));
      }
    } catch (error) {
      setStats(prev => ({
        ...prev,
        systemHealth: 'שגיאה בחיבור'
      }));
    }

    // Get cases count from IndexedDB
    try {
      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open('courtDBv6', 1);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      const transaction = db.transaction('cases', 'readonly');
      const store = transaction.objectStore('cases');
      const countRequest = store.count();
      
      countRequest.onsuccess = () => {
        setStats(prev => ({
          ...prev,
          totalCases: countRequest.result
        }));
      };
    } catch (error) {
      console.warn('Could not get cases count:', error);
    }
  };

  const exportData = async () => {
    try {
      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open('courtDBv6', 1);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      const transaction = db.transaction('cases', 'readonly');
      const store = transaction.objectStore('cases');
      const request = store.getAll();
      
      request.onsuccess = () => {
        const data = {
          exportDate: new Date().toISOString(),
          cases: request.result,
          totalCases: request.result.length
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { 
          type: 'application/json' 
        });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `hypercourt_backup_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(link.href);
        
        alert('גיבוי הנתונים הושלם בהצלחה!');
      };
    } catch (error) {
      alert('שגיאה ביצירת גיבוי: ' + error);
    }
  };

  const clearSystemData = async () => {
    if (confirm('האם אתה בטוח שברצונך למחוק את כל נתוני המערכת? פעולה זו בלתי הפיכה!')) {
      try {
        const db = await new Promise<IDBDatabase>((resolve, reject) => {
          const request = indexedDB.open('courtDBv6', 1);
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });

        const transaction = db.transaction('cases', 'readwrite');
        const store = transaction.objectStore('cases');
        store.clear();
        
        alert('כל נתוני המערכת נמחקו בהצלחה!');
        loadStats();
      } catch (error) {
        alert('שגיאה במחיקת נתונים: ' + error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Shield className="text-blue-600" />
          פאנל ניהול מערכת
        </h2>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-3">
              <Users className="text-blue-600" size={24} />
              <div>
                <p className="text-sm text-gray-600">משתמשים רשומים</p>
                <p className="text-2xl font-bold text-blue-800">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-3">
              <Database className="text-green-600" size={24} />
              <div>
                <p className="text-sm text-gray-600">דיונים במערכת</p>
                <p className="text-2xl font-bold text-green-800">{stats.totalCases}</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-3">
              <Activity className="text-yellow-600" size={24} />
              <div>
                <p className="text-sm text-gray-600">סטטוס מערכת</p>
                <p className="text-lg font-bold text-yellow-800">{stats.systemHealth}</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center gap-3">
              <Settings className="text-purple-600" size={24} />
              <div>
                <p className="text-sm text-gray-600">גיבוי אחרון</p>
                <p className="text-sm font-medium text-purple-800">{stats.lastBackup}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">פעולות ניהול</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={exportData}
              className="flex items-center gap-3 bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Database size={20} />
              <div className="text-right">
                <p className="font-medium">יצוא נתונים</p>
                <p className="text-sm opacity-90">גיבוי כל הדיונים למחשב</p>
              </div>
            </button>

            <button
              onClick={() => loadStats()}
              className="flex items-center gap-3 bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Activity size={20} />
              <div className="text-right">
                <p className="font-medium">רענן סטטיסטיקות</p>
                <p className="text-sm opacity-90">עדכן נתוני המערכת</p>
              </div>
            </button>

            <button
              onClick={clearSystemData}
              className="flex items-center gap-3 bg-red-600 text-white p-4 rounded-lg hover:bg-red-700 transition-colors"
            >
              <AlertTriangle size={20} />
              <div className="text-right">
                <p className="font-medium">מחק את כל הנתונים</p>
                <p className="text-sm opacity-90">מחיקה מלאה של המערכת</p>
              </div>
            </button>

            <button
              className="flex items-center gap-3 bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors"
              onClick={() => window.open('http://localhost:5001/api/health', '_blank')}
            >
              <Settings size={20} />
              <div className="text-right">
                <p className="font-medium">בדיקת שרת</p>
                <p className="text-sm opacity-90">בדוק חיבור לשרת הבקנד</p>
              </div>
            </button>
          </div>
        </div>

        {/* System Information */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-2">מידע מערכת</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>• גרסת מערכת: HyperCourt v1.0</p>
            <p>• סביבת הפעלה: {import.meta.env.PROD ? 'Production' : 'Development'}</p>
            <p>• בסיס נתונים: IndexedDB (מקומי)</p>
            <p>• שרת אימות: Node.js + Express</p>
          </div>
        </div>
      </div>
    </div>
  );
}