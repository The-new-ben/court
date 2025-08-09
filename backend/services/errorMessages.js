const messages = {
  CLIENT_NOT_FOUND: {
    en: 'Client not found',
    he: 'לקוח לא נמצא'
  },
  MISSING_CLIENT_DETAILS: {
    en: 'Missing client details',
    he: 'חסרים פרטי לקוח'
  },
  CASE_NOT_FOUND: {
    en: 'Case not found',
    he: 'תיק לא נמצא'
  },
  MISSING_REQUIRED_PARAMS: {
    en: 'Missing required parameters',
    he: 'חסרים פרמטרים נדרשים'
  },
  AI_SERVICE_ERROR: {
    en: 'AI service error',
    he: 'שגיאה בשירות הבינה המלאכותית'
  },
  QUOTE_NOT_FOUND: {
    en: 'Quote not found',
    he: 'הצעת מחיר לא נמצאה'
  },
  INVALID_DATA: {
    en: 'Invalid data',
    he: 'נתונים לא תקינים'
  },
  USER_EXISTS: {
    en: 'User with this email already exists',
    he: 'משתמש עם אימייל זה כבר קיים'
  },
  USER_CREATION_ERROR: {
    en: 'Error creating user',
    he: 'שגיאה ביצירת משתמש'
  },
  INVALID_CREDENTIALS: {
    en: 'Incorrect email or password',
    he: 'אימייל או סיסמה שגויים'
  },
  LOGIN_ERROR: {
    en: 'Login error',
    he: 'שגיאה בהתחברות'
  },
  PACKAGE_NOT_FOUND: {
    en: 'Package not found',
    he: 'חבילה לא נמצאה'
  },
  CLIENT_ALREADY_ASSIGNED: {
    en: 'Client already assigned to referrer',
    he: 'הלקוח כבר שויך למפנה'
  },
  INVALID_REFERRAL_CODE: {
    en: 'Invalid referral code',
    he: 'קוד הפניה לא תקין'
  },
  TOO_MANY_ATTEMPTS: {
    en: 'Too many login attempts, please try again later',
    he: 'יותר מדי ניסיונות התחברות, נסה שוב בעוד 15 דקות'
  },
  INVALID_EMAIL: {
    en: 'Invalid email address',
    he: 'כתובת אימייל לא תקינה'
  },
  PASSWORD_TOO_SHORT: {
    en: 'Password must be at least 8 characters',
    he: 'סיסמה חייבת להכיל לפחות 8 תווים'
  },
  NAME_TOO_SHORT: {
    en: 'Name must be at least 2 characters',
    he: 'שם חייב להכיל לפחות 2 תווים'
  },
  INVALID_ROLE: {
    en: 'Invalid role',
    he: 'תפקיד לא תקין'
  },
  PASSWORD_REQUIRED: {
    en: 'Password is required',
    he: 'סיסמה נדרשת'
  }
};

function parseLanguage(header) {
  if (!header) return 'he';
  return header.split(',')[0].split('-')[0];
}

function getErrorMessage(code, langHeader) {
  const lang = parseLanguage(langHeader);
  return messages[code]?.[lang] || messages[code]?.he || 'Unknown error';
}

module.exports = { getErrorMessage };
