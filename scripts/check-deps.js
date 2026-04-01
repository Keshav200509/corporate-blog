const fs = require('fs');

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const lock = JSON.parse(fs.readFileSync('package-lock.json', 'utf8'));

function readLockedVersion(name) {
  if (lock.packages && lock.packages[`node_modules/${name}`]?.version) {
    return lock.packages[`node_modules/${name}`].version;
  }

  if (lock.dependencies && lock.dependencies[name]?.version) {
    return lock.dependencies[name].version;
  }

  return null;
}

const lockNext = readLockedVersion('next');
const lockEslintNext = readLockedVersion('eslint-config-next');
const pkgNext = pkg.dependencies?.next;
const pkgEslintNext = pkg.devDependencies?.['eslint-config-next'];

if (!lockNext || !lockEslintNext) {
  console.warn('warning: unable to read lockfile package versions in this format; skipping strict dep alignment check');
  process.exit(0);
}

if (lockNext !== pkgNext) {
  console.error(`next mismatch: package.json=${pkgNext} package-lock=${lockNext}`);
  process.exit(1);
}

if (lockEslintNext !== pkgEslintNext) {
  console.error(`eslint-config-next mismatch: package.json=${pkgEslintNext} package-lock=${lockEslintNext}`);
  process.exit(1);
}

console.log('dependency lock versions aligned');
