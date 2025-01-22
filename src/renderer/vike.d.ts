import type { FastifyBaseLogger } from 'fastify';

declare global {
  namespace Vike {
    interface PageContext {
      cookies: Record<string, string>;
      log: FastifyBaseLogger;
    }
  }
}

export {};
