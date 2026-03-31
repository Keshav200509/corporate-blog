const fs = require('fs');

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const lock = JSON.parse(fs.readFileSync('package-lock.json', 'utf8'));

const lockNext = lock.packages?.['node_modules/next']?.version;
const lockEslintNext = lock.packages?.['node_modules/eslint-config-next']?.version;
const pkgNext = pkg.dependencies?.next;
const pkgEslintNext = pkg.devDependencies?.['eslint-config-next'];

if (lockNext !== pkgNext) {
  console.error(`next mismatch: package.json=${pkgNext} package-lock=${lockNext}`);
  process.exit(1);
}

if (lockEslintNext !== pkgEslintNext) {
  console.error(`eslint-config-next mismatch: package.json=${pkgEslintNext} package-lock=${lockEslintNext}`);
  process.exit(1);
}

console.log('dependency lock versions aligned');
