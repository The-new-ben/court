// scripts/strip-conflicts.cjs
// (מנקה סימוני קונפליקט מכל קבצי הטקסט בפרויקט, ושומר כברירת מחדל את הצד העליון)
// לשנות צד? ב-Netlify הוסף משתנה סביבה STRIP_CONFLICT_STRATEGY=lower

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const EXTS = new Set(['.ts','.tsx','.js','.jsx','.json','.css','.scss','.md','.yml','.yaml','.html','.tsx','.ts']);
const IGNORE = new Set(['node_modules','dist','build','.git','.next','coverage']);
const STRATEGY = (process.env.STRIP_CONFLICT_STRATEGY || 'upper').toLowerCase(); // 'upper' | 'lower'

function walk(dir, out=[]) {
  for (const name of fs.readdirSync(dir)) {
    if (IGNORE.has(name)) continue;
    const p = path.join(dir, name);
    const st = fs.lstatSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (st.isFile() && EXTS.has(path.extname(p).toLowerCase())) out.push(p);
  }
  return out;
}

function cleanFile(file) {
  const src = fs.readFileSync(file, 'utf8');
  if (!src.includes('<<<<<<<') && !src.includes('=======') && !src.includes('>>>>>>>')) return false;

  const lines = src.split('\n');
  const out = [];
  let i = 0;
  let changed = false;

  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith('<<<<<<<')) {
      changed = true;
      // קרא את הצד העליון עד =======
      const upper = [];
      i++;
      while (i < lines.length && lines[i] !== '=======') { upper.push(lines[i]); i++; }

      // דלג על =======
      if (i < lines.length && lines[i] === '=======') i++;

      // קרא את הצד התחתון עד >>>>>>>
      const lower = [];
      while (i < lines.length && !lines[i].startsWith('>>>>>>>')) { lower.push(lines[i]); i++; }

      // דלג על >>>>>>>
      if (i < lines.length && lines[i].startsWith('>>>>>>>')) i++;

      out.push(...(STRATEGY === 'lower' ? lower : upper));
      continue;
    }
    out.push(line);
    i++;
  }

  const result = out.join('\n').replace(/\n{3,}/g, '\n\n'); // ניקוי רווחים כפולים
  if (result !== src) fs.writeFileSync(file, result, 'utf8');
  return result !== src || changed;
}

function main() {
  const files = walk(ROOT);
  let n = 0;
  for (const f of files) {
    try { if (cleanFile(f)) { n++; console.log('cleaned:', path.relative(ROOT, f)); } }
    catch (e) { console.warn('skip (error):', f, e.message); }
  }
  console.log(`Conflict cleaner: ${n} file(s) cleaned. Strategy=${STRATEGY.toUpperCase()}`);
}
main();
