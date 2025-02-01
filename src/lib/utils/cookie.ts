import { nanoid } from 'nanoid';
import { unsign } from 'cookie-signature';
import type { FastifyBaseLogger } from 'fastify';

export const cookieSecret = nanoid(32);

export function parseCookies(
  cookies: Record<string, string | undefined>,
  log?: FastifyBaseLogger,
): Record<string, string | undefined> {
  if (log) log.info(cookies);
  for (const key of Object.keys(cookies)) {
    if (cookies[key]) {
      const val = cookies[key];
      if (val) {
        const unsignedVal = unsign(val, cookieSecret);
        cookies[key] = !unsignedVal ? undefined : unsignedVal;
      }
    }
  }
  return cookies;
}
