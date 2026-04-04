## Summary
- 

## Pre-merge checklist
- [ ] `grep -rn "\(<{7}\|={7}\|>{7}\)" app src tests prisma .github scripts` returns 0 lines
- [ ] `npm run check:package-json` exits 0
- [ ] `npm run check:deps` exits 0
- [ ] `npm test` exits 0 (all tests green)
- [ ] `npm run lint` exits 0 (zero warnings)
- [ ] `npm run build` exits 0
- [ ] No file has more than one `export default`
- [ ] No file has duplicate import paths
- [ ] No Prisma enum used in a module-level constant that is in the test import chain
- [ ] If `package.json` was changed, lockfile changes are committed
- [ ] `eslint-config-next` version matches `next` version
