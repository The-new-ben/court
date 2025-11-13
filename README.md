להלן מסמך **README.md** מקצה‑לקצה (ב‑Markdown) להקמה מאפס של פלטפורמת קטלוג דינמית מבוססת‑AI עם CMS, טעינת מוצרים רב‑ענפית (כולל נדל״ן), ג’נרציית תוכן אוטומטית, היררכיה חכמה (Pillar/Cluster), קישורים פנימיים, חיפוש סמנטי, ו‑SEO מלא.
המסמך מיועד לצוות פיתוח שירים זאת מ‑0 ב‑GitHub עד לרמה של אתר פועל.

---

# AI Catalog Platform – Monorepo (Next.js + Node + PostgreSQL + pgvector)

> **TL;DR**
>
> * Monorepo TypeScript: **Next.js 14 (App Router)** + **Prisma + PostgreSQL 16 + pgvector**
> * CMS Admin מובנה ב‑/admin
> * ג’נרציית תוכן אוטומטית (מאמרים, FAQ, JSON‑LD) בעת יצירת נכס
> * היררכיה אוטומטית: **Category → Topic Cluster → Pillar/Cluster pages**
> * מניעת קניבליזציה (Keywords + Embeddings)
> * חיפוש: סמנטי (Vector) + טקסטואלי (TSVector)
> * SEO: SSR/ISR, sitemap, robots, hreflang, Breadcrumbs, Internal Links

---

## 0) דרישות מוקדמות

* Node.js ≥ 18.18
* pnpm ≥ 9 (מומלץ)
* Docker + Docker Compose
* חשבון DB מנוהל (לוקאלי בדוקר או בענן)
* מפתח OpenAI (`OPENAI_API_KEY`)
* אחסון מדיה (AWS S3 או Cloudflare R2)
* GitHub Org/Repo + GitHub Actions + (אופציונלי) Vercel/Render לפריסה

---

## 1) יצירת ריפו GitHub והכנה

```bash
# יצירת תיקייה והפעלת גיט
mkdir ai-catalog && cd ai-catalog
git init

# יצירת סניף ראשי
git checkout -b main

# קובץ .gitignore בסיסי
cat > .gitignore << 'EOF'
node_modules
.env
.env.*
dist
.next
coverage
Docker/*.data
