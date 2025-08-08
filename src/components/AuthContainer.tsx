import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function AuthContainer() {
  const { login, register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // New field for name
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(''), 5000);
  };

  const validateInputs = () => {
    if (!email.trim() || !password) {
      showError("אימייל וסיסמה הם שדות חובה");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError("כתובת אימייל לא תקינה");
      return false;
    }

    if (password.length < 8) {
      showError("סיסמה חייבת להכיל לפחות 8 תווים");
      return false;
    }

    if (isRegistering && !name.trim()) {
      showError("שם מלא הוא שדה חובה ברישום");
      return false;
    }

    if (isRegistering && name.trim().length < 2) {
      showError("שם חייב להכיל לפחות 2 תווים");
      return false;
    }

    return true;
  };

  const handleAction = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);
    setError('');

    try {
      if (isRegistering) {
        // Default role is 'lawyer' on registration - security fix
        await register(email.trim(), password, 'lawyer', name.trim()); 
        showError('רישום הושלם בהצלחה! מתחבר אוטומטית...');
        // Clear form after successful registration
        setEmail('');
        setPassword('');
        setName('');
      } else {
        await login(email.trim(), password);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      showError(err.message || 'אירעה שגיאה במערכת');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleAction();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-800 mb-2">HyperCourt</h1>
          <p className="text-gray-600">מערכת משפטית חכמה</p>
          <p className="text-sm text-gray-500 mt-2">
            {isRegistering ? 'יצירת חשבון חדש' : 'התחברות למערכת'}
          </p>
        </div>
        
        <div className="space-y-4">
          {isRegistering && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                שם מלא *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="הזן שם מלא"
                disabled={isLoading}
                required
                minLength={2}
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              אימייל *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="הזן כתובת אימייל"
              disabled={isLoading}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              סיסמה *
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="הזן סיסמה (לפחות 8 תווים)"
              disabled={isLoading}
              required
              minLength={8}
            />
          </div>

          {isRegistering && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-sm text-blue-700">
                <strong>הערה:</strong> חשבונות חדשים נרשמים כעורכי דין כברירת מחדל. 
                למנהל המערכת יש אפשרות לשנות הרשאות לאחר הרישום.
              </p>
            </div>
          )}
          
          {error && (
            <div className={`border px-4 py-3 rounded-md text-sm ${
              error.includes('הצליח') 
                ? 'bg-green-50 border-green-200 text-green-600' 
                : 'bg-red-50 border-red-200 text-red-600'
            }`}>
              {error}
            </div>
          )}
          
          <button
            onClick={handleAction}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? 'מעבד...' : (isRegistering ? 'הירשם למערכת' : 'התחבר למערכת')}
          </button>
          
          <button
            onClick={() => { 
              setIsRegistering(!isRegistering); 
              setError(''); 
              setEmail('');
              setPassword('');
              setName('');
            }}
            disabled={isLoading}
            className="w-full text-center text-sm text-blue-600 hover:underline disabled:text-gray-400 py-2"
          >
            {isRegistering ? 'יש לך כבר חשבון? התחבר כאן' : 'אין לך חשבון? הירשם כאן'}
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            המערכת מאובטחת עם הצפנת SSL ואימות דו-שלבי
          </p>
        </div>
      </div>
    </div>
  );
}