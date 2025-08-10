// scripts/auto-install-missing.cjs
// סורק import/require בקבצי src, ומתקין אוטומטית חבילות חסרות (בלי לשנות package.json)
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'src');
const exts = new Set(['.ts','.tsx','.js','.jsx']);
const ignoreDirs = new Set(['node_modules','dist','build','.git','.next','coverage']);
const builtins = new Set(require('module').builtinModules.concat(['node:fs','node:path','node:crypto']).map(s=>s.replace(/^node:/,'')));

function walk(dir, acc=[]) {
  if (!fs.existsSync(dir)) return acc;
  for (const n of fs.readdirSync(dir)) {
    if (ignoreDirs.has(n)) continue;
    const p = path.join(dir, n);
    const st = fs.lstatSync(p);
    if (st.isDirectory()) walk(p, acc);
    else if (st.isFile() && exts.has(path.extname(p))) acc.push(p);
  }
  return acc;
}

function parseImports(text) {
  const mods = new Set();
  const re = /\bimport\s+(?:.+?\s+from\s+)?['"]([^'"]+)['"]|require\(\s*['"]([^'"]+)['"]\s*\)/g;
  let m;
  while ((m = re.exec(text))) {
    const spec = m[1] || m[2];
    if (!spec) continue;
    if (spec.startsWith('.') || spec.startsWith('/')) continue; // relative - לדלג
    if (spec.startsWith('@/')) continue; // alias בפרויקט
    const base = spec.split('/').slice(0, spec.startsWith('@') ? 2 : 1).join('/'); // @scope/pkg או pkg
    mods.add(base);
  }
  return [...mods];
}

function isInstalled(mod) {
  try { require.resolve(mod, { paths: [ROOT] }); return true; }
  catch { return false; }
}

function main() {
  const files = walk(SRC);
  const needed = new Set();
  for (const f of files) {
    const txt = fs.readFileSync(f, 'utf8');
    for (const mod of parseImports(txt)) {
      const core = mod.replace(/^node:/,'');
      if (builtins.has(core)) continue;
      if (!isInstalled(mod)) needed.add(mod);
    }
  }

  if (needed.size === 0) {
    console.log('auto-install-missing: no missing modules');
    return;
  }

  const list = [...needed];
  console.log('auto-install-missing: installing', list.join(' '));
  // מתקין בלי לשנות package.json
  execSync(`npm i --no-save ${list.join(' ')}`, { stdio: 'inherit' });
}

main();
