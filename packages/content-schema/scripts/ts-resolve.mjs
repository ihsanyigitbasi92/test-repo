/**
 * Node module-resolution hook for the validate CLI: sources use extensionless relative imports (so Metro/tsc
 * in apps/mobile accept them), Node's type stripping needs the `.ts` — try `<spec>.ts` / `<spec>/index.ts`.
 * Usage: node --experimental-strip-types --import ./scripts/ts-register.mjs scripts/validate.ts
 */
export async function resolve(specifier, context, next) {
  if (/^\.{1,2}\//.test(specifier) && !/\.[cm]?[jt]s$|\.json$/.test(specifier)) {
    for (const cand of [`${specifier}.ts`, `${specifier}/index.ts`]) {
      try { return await next(cand, context); } catch { /* try next */ }
    }
  }
  return next(specifier, context);
}
