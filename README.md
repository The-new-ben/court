<<<<<<< HEAD
# HyperCourt Enterprise - מערכת משפטית מתקדמת

מערכת משפטית מתקדמת עם ארכיטקטורה מיקרו-שירותים, אבטחה מתקדמת ותמיכה בפריסה בענן.

## תכונות עיקריות

### 🔐 אבטחה מתקדמת
- **JWT Authentication** - אימות מבוסס טוקנים
- **Refresh Tokens** - ניהול הפעלות ארוכות טווח
- **Rate Limiting** - הגנה מפני התקפות
- **Input Validation** - ולידציה מקיפה של נתונים
- **CORS Protection** - הגנה מפני בקשות חוצות מקור

### 🏗️ ארכיטקטורה מתקדמת
- **Microservices Ready** - מוכן לפיצול לשירותים
- **Docker Support** - קונטיינרים מוכנים לייצור
- **Database Migrations** - ניהול סכמת בסיס נתונים
- **API Documentation** - OpenAPI/Swagger
- **Testing Framework** - בדיקות אוטומטיות

### 🚀 פיתוח ופריסה
- **CI/CD Pipeline** - GitHub Actions
- **Environment Management** - ניהול סביבות
- **Health Checks** - מעקב תקינות מערכת
- **Error Handling** - טיפול מתקדם בשגיאות

## מבנה הפרויקט

```
hypercourt-enterprise/
├── backend/                    # Node.js Backend
│   ├── src/
│   │   ├── controllers/       # Business Logic
│   │   ├── middleware/        # Express Middleware
│   │   ├── routes/           # API Routes
│   │   ├── utils/            # Utilities
│   │   └── config/           # Configuration
│   ├── migrations/           # Database Migrations
│   ├── scripts/             # Utility Scripts
│   ├── __tests__/           # Test Files
│   └── Dockerfile           # Container Definition
├── frontend/                 # React Frontend
│   ├── src/
│   │   ├── components/      # React Components
│   │   ├── contexts/        # React Contexts
│   │   ├── services/        # API Services
│   │   └── pages/          # Page Components
│   └── Dockerfile          # Container Definition
├── .github/workflows/       # CI/CD Pipelines
├── docker-compose.yml       # Development Environment
└── Makefile                # Build Commands
```

## הוראות הפעלה

### פיתוח מקומי

1. **Clone הפרויקט**:
```bash
git clone <repository-url>
cd hypercourt-enterprise
```

2. **הגדרת Backend**:
```bash
cd backend
cp .env.example .env
# ערוך את קובץ .env עם הערכים שלך
npm install
npm run dev
```

3. **הגדרת Frontend**:
```bash
cd frontend
npm install
npm run dev
```

### פריסה עם Docker

```bash
# פיתוח
docker-compose up -d

# ייצור
make build
make deploy
```

### בדיקות

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

## API Documentation

השרת מספק תיעוד API אוטומטי ב:
- Development: `http://localhost:5001/api-docs`
- Production: `https://your-domain.com/api-docs`

## אבטחה

### Environment Variables

הגדר את המשתנים הבאים בקובץ `.env`:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/hypercourt

# External APIs
HUGGING_FACE_TOKEN=hf_your_token_here

# Server Configuration
PORT=5001
NODE_ENV=production
```

### הרשאות משתמשים

- **Admin** - גישה מלאה למערכת
- **Judge** - ניהול תיקים ופסיקות
- **Lawyer** - יצירה וניהול תיקים
- **Plaintiff** - הגשת תיקים וצפייה

## תכונות מתקדמות

### Refresh Tokens
המערכת תומכת ב-refresh tokens לאבטחה משופרת:
- Access tokens קצרי טווח (15 דקות)
- Refresh tokens ארוכי טווח (7 ימים)
- רוטציה אוטומטית של טוקנים

### Rate Limiting
הגנה מפני שימוש לרעה:
- 100 בקשות לדקה למשתמש רגיל
- 1000 בקשות לדקה למנהלים
- הגבלות מיוחדות לנקודות קצה רגישות

### Database Migrations
ניהול מובנה של שינויי סכמה:
```bash
npm run migrate:up    # הפעלת מיגרציות
npm run migrate:down  # ביטול מיגרציות
npm run migrate:reset # איפוס בסיס נתונים
```

## תמיכה ופיתוח

### לוגים
המערכת כוללת מערכת לוגים מתקדמת:
- Structured logging עם Winston
- Log levels: error, warn, info, debug
- רוטציה אוטומטית של קבצי לוג

### Monitoring
- Health check endpoints
- Performance metrics
- Error tracking
- Uptime monitoring

## רישיון

MIT License - ראה קובץ LICENSE לפרטים נוספים.

## תרומה לפרויקט

1. Fork הפרויקט
2. צור branch חדש (`git checkout -b feature/amazing-feature`)
3. Commit השינויים (`git commit -m 'Add amazing feature'`)
4. Push ל-branch (`git push origin feature/amazing-feature`)
5. פתח Pull Request

---

**HyperCourt Enterprise** - מערכת משפטית מתקדמת לעידן הדיגיטלי
=======
# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
>>>>>>> 01642d5817bb4a7778b9eefaa7f0ebe7627adaa9
