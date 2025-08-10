import React, { useState, useEffect } from 'react';
import { Users, Database, Settings, Activity, Shield, AlertTriangle } from 'lucide-react';
import { API_BASE_URL } from '../config';
import { adminService } from '../services/adminService';
import { getAllCases, getCaseCount, clearCases } from '../utils/db';
import { useToast } from './Toast';

interface LogFilters {
  user: string;
  action: string;
}

interface AuditLog {
  user: string;
  action: string;
  timestamp: string;
}

// עדיפות ל־VITE_API_URL; נפילה ל־API_BASE_URL; לבסוף localhost
const API_URL: string =
  (import.meta.env.VITE_API_URL as string) ||
  (API_BASE_URL as string) ||
  'http://localhost:5001/api';

export default function AdminPanel() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCases: 0,
    systemHealth: 'תקין',
    lastBackup: 'לא זמין',
  });
  const [userList, setUserList] = useState<any[]>([]);
  const roles = ['admin', 'judge', 'lawyer', 'litigant', 'clerk'];
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [logFilters, setLogFilters] = useState<LogFilters>({ user: '', action: '' });
  const toast = useToast();

  useEffect(() => {
    loadStats();
    loadUsers();
    loadLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadLogs();
  }, [logFilters]);

  const loadStats = async () => {
    try {
      // Check backend health
      const response = await fetch(`${API_URL}/health`);
      if (response.ok) {
        const data = await response.json();
        setStats((prev) => ({
          ...prev,
          totalUsers: data.users || 0,
          systemHealth: 'תקין',
        }));
      } else {
        setStats((prev) => ({ ...prev, systemHealth: 'שגיאה בחיבור' }));
      }
    } catch {
      setStats((prev) => ({
        ...prev,
        systemHealth: 'שגיאה בחיבור',
      }));
    }

    try {
      const totalCases = await getCaseCount();
      setStats((prev) => ({ ...prev, totalCases }));
    } catch (error) {
      console.warn('Could not get cases count:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await adminService.getUsers();
      setUserList(data);
    } catch (error) {
      console.error('Failed to load users', error);
    }
  };

  const updateRole = async (id: string, role: string) => {
    try {
      await adminService.updateUserRole(id, role);
      setUserList((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    } catch (error) {
      alert('שגיאה בעדכון תפקיד: ' + error);
    }
  };

  const exportData = async () => {
    try {
      const cases = await getAllCases();
      const data = {
        exportDate: new Date().toISOString(),
        cases,
        totalCases: cases.length,
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `hypercourt_backup_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(link.href);
      toast('גיבוי הנתונים הושלם בהצלחה!');
    } catch (error) {
      toast('שגיאה ביצירת גיבוי: ' + error);
    }
  };

  const loadLogs = async () => {
    try {
      const params = new URLSearchParams();
      if (logFilters.user) params.append('user', logFilters.user);
      if (logFilters.action) params.append('action', logFilters.action);

      const token = localStorage.getItem('hypercourt_token');
      const response = await fetch(`${API_URL}/logs?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (response.ok) {
        const data = await response.json();
        setLogs(data);
      } else {
        setLogs([]);
      }
    } catch (error) {
      console.warn('Could not load audit logs:', error);
      setLogs([]);
    }
  };

  const clearSystemData = async () => {
    if (confirm('האם אתה בטוח שברצונך למחוק את כל נתוני המערכת? פעולה זו בלתי הפיכה!')) {
      try {
        await clearCases();
        toast('כל נתוני המערכת נמחקו בהצלחה!');
        loadStats();
      } catch (error) {
        toast('שגיאה במחיקת נתונים: ' + error);
      }
    }
  };

  const handleOpenHealth = () => {
    window.open(`${API_URL}/health`, '_blank');
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
              onClick={loadStats}
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
              onClick={handleOpenHealth}
            >
              <Settings size={20} />
              <div className="text-right">
                <p className="font-medium">בדיקת שרת</p>
                <p className="text-sm opacity-90">בדוק חיבור לשרת הבקנד</p>
              </div>
            </button>
          </div>
        </div>

        {/* Role Management */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">ניהול משתמשים</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">שם</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">אימייל</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">תפקיד</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {userList.map((u) => (
                  <tr key={u.id}>
                    <td className="px-4 py-2">{u.name}</td>
                    <td className="px-4 py-2">{u.email}</td>
                    <td className="px-4 py-2">
                      <select
                        value={u.role}
                        onChange={(e) => updateRole(u.id, e.target.value)}
                        className="border border-gray-300 rounded-md p-1"
                      >
                        {roles.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

        {/* Audit Logs */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">יומן פעולות</h3>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="משתמש"
              className="border rounded p-2 flex-1"
              value={logFilters.user}
              onChange={(e) => setLogFilters((prev) => ({ ...prev, user: e.target.value }))}
            />
            <input
              type="text"
              placeholder="פעולה"
              className="border rounded p-2 flex-1"
              value={logFilters.action}
              onChange={(e) => setLogFilters((prev) => ({ ...prev, action: e.target.value }))}
            />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">משתמש</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">פעולה</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">זמן</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.map((log, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{log.user}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{log.action}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
