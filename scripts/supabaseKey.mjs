/**
 * Whether a Supabase key is one that must never reach a browser: an `sb_secret_` key, or a
 * legacy JWT whose role is `service_role`. Either bypasses row-level security, and a `VITE_*`
 * value is inlined into the bundle, so `vite.config.ts` fails the build on one.
 *
 * Plain JS for the same reason as `siteMeta.mjs`: a `.ts` suite cannot import `vite.config.ts`.
 */

/**
 * The decoded payload of a JWT, or '' when it is not one. JWT segments are base64url
 * (`-`, `_`, no padding); Node's `base64url` reads that directly.
 *
 * @param {string} token
 * @returns {string}
 */
const jwtPayload = token => Buffer.from(token.split('.')[1] ?? '', 'base64url').toString('utf8');

/**
 * @param {string} key
 * @returns {boolean}
 */
export const isSecretSupabaseKey = key =>
  /^sb_secret_/i.test(key) || /"role"\s*:\s*"service_role"/.test(jwtPayload(key));
