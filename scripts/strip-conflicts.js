// scripts/strip-conflicts.js
// מנקה בכל הקבצים סימני קונפליקט <<<<<<< ======= >>>>>>>.
// אסטרטגיה: לוקחים את החלק העליון (לפני =======). אפשר לשנות ל-"lower" דרך STRIP_CONFLICT_STRATEGY=lower.

import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const exts = new Set(['.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.md', '.yml', '.yaml', '.html']);
const IGNORE_DIRS = new Set(['node_modules', 'dist', '.git', '.next', 'build', 'coverage']);

const strategy = (process.env.STRIP_CONFLICT_STRATEGY || 'upper').toLowerCase(); // 'upper' | 'lower'

/**
 * Resolve one file's content by taking either upper or lower side.
 */
function resolveConflicts(text) {
  // Regex that captures: <<<<<<< anything ======= (content) >>>>>>>
  // We replace each block according to strategy.
  const re = /<<<<<<<[^\n]*\n([\s\S]*?)\n=======\n([\s\S]*?)\n>>>>>>>[^\n]*\n?/g;

  let changed = false;
  const out = text.replace(re, (_, upper, lower) => {
    changed = true;
    return strategy === 'lower' ? lower : upper;
  });

  // אם נשארו מרקרים בודדים (חלקיים) – מחסלים אותם בזהירות
  const cleaned = out
    .replace(/<<<<<<<[^\n]*\n?/g, '')
    .replace(/\n?=======\n?/g, '\n')
    .replace(/>>>>>>>[^\n]*\n?/g, '');

  // מנקים רווחים כפולים שהתקבלו
  return { text: cleaned.replace(/\n{3,}/g, '\n\n'), changed: changed || cleaned !== out };
}

function walk(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    if (IGNORE_DIRS.has(name)) continue;
    const p = path.join(dir, name);
    const stat = fs.lstatSync(p);
    if (stat.isDirectory()) {
      walk(p, acc);
    } else if (stat.isFile()) {
      const ext = path.extname(p).toLowerCase();
      if (exts.has(ext)) acc.push(p);
    }
  }
  return acc;
}

function main() {
  const files = walk(ROOT);
  let touched = 0;
  for (const f of files) {
    const text = fs.readFileSync(f, 'utf8');
    if (!text.includes('<<<<<<<') && !text.includes('=======') && !text.includes('>>>>>>>')) continue;
    const { text: out, changed } = resolveConflicts(text);
    if (changed) {
      fs.writeFileSync(f, out, 'utf8');
      touched++;
      console.log(`cleaned: ${path.relative(ROOT, f)}`);
    }
  }
  console.log(`\nConflict-cleaner: ${touched} file(s) cleaned. Strategy=${strategy.toUpperCase()}`);
}

main();
