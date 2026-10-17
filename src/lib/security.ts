export const securityHeaders = {
  'X-Content-Type-Options':'nosniff',
  'Referrer-Policy':'strict-origin-when-cross-origin',
  'X-Frame-Options':'DENY',
  'Permissions-Policy':'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security':'max-age=31536000',
};
export function contentSecurityPolicy(hashes:readonly string[],styles:readonly string[]=[]):string {
  return `default-src 'self'; script-src 'self' https://static.cloudflareinsights.com ${hashes.map(hash=>`'sha256-${hash}'`).join(' ')}; style-src 'self'${styles.map(hash=>` 'sha256-${hash}'`).join('')}; img-src 'self' data:; font-src 'self'; connect-src 'self' https://cloudflareinsights.com; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'`;
}
