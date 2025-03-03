import type { FastifyBaseLogger } from 'fastify';

declare global {
  namespace Vike {
    interface PageContext {
      cookies: Record<string, string | undefined>;
      log: FastifyBaseLogger;
    }
  }
}

export {};
