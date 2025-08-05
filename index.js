import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

export async function checkPackageJson({ cwd = process.cwd(), outputJson = false } = {}) {
  const pkgPath = path.join(cwd, 'package.json');
  if (!fs.existsSync(pkgPath)) throw new Error('package.json not found');

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  const allDeps = {
    ...pkg.dependencies,
    ...pkg.devDependencies
  };

  const issues = {
    outdated: [],
    unused: [],
    duplicate: []
  };

  // Duplicati
  for (const dep in pkg.dependencies) {
    if (pkg.devDependencies && pkg.devDependencies[dep]) {
      issues.duplicate.push(dep);
    }
  }

  // Outdated
  for (const dep of Object.keys(allDeps)) {
    try {
      const latest = execSync(`npm view ${dep} version`, { encoding: 'utf-8' }).trim();
      const current = allDeps[dep];
      if (!current.includes(latest)) {
        issues.outdated.push({ dep, current, latest });
      }
    } catch { }
  }

  // Unused
  const srcFiles = findAllJsTsFiles(cwd);
  const imports = new Set();
  for (const file of srcFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const regex = /(?:require|import).*['"]([^'"]+)['"]/g;
    let match;
    while ((match = regex.exec(content))) {
      const modName = match[1].split('/')[0];
      imports.add(modName);
    }
  }

  for (const dep of Object.keys(allDeps)) {
    if (!imports.has(dep)) {
      issues.unused.push(dep);
    }
  }

  return outputJson ? issues : formatIssues(issues);
}

function findAllJsTsFiles(dir) {
  let results = [];
  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory() && !file.includes('node_modules')) {
      results = results.concat(findAllJsTsFiles(full));
    } else if (/\.(js|ts|mjs|cjs)$/.test(file)) {
      results.push(full);
    }
  }
  return results;
}

function formatIssues(issues) {
  let out = '';
  if (issues.duplicate.length) {
    out += `\n⚠️  Duplicate Packages:\n  ${issues.duplicate.join(', ')}\n`;
  }
  if (issues.outdated.length) {
    out += `\n⬆️  Packages to be updated:\n`;
    for (const { dep, current, latest } of issues.outdated) {
      out += `  ${dep}: ${current} → ${latest}\n`;
    }
  }
  if (issues.unused.length) {
    out += `\n🗑  Used packages:\n  ${issues.unused.join(', ')}\n`;
  }
  return out || '✅ No problems found\n';
}
