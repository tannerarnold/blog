import Fastify from 'fastify';
import Middie from '@fastify/middie';
import path from 'path';
import { renderPage } from 'vike/server';
import { db } from '@lib/db/db';
import { blog } from '@api/blog';
import fastifyFormbody from '@fastify/formbody';
import staticPlugin from '@fastify/static';
import 'dotenv/config';
await import(path.resolve(process.env.SERVER_ENTRY_PATH!));

declare module 'fastify' {
  interface FastifyInstance {
    db: typeof db;
  }
}

async function server() {
  const fastify =
    // process.env.NODE_ENV === "production"
    //   ? Fastify({
    //       logger: true,
    //     })
    //   :
    Fastify({
      disableRequestLogging: true,
      logger: {
        transport: {
          target: 'pino-pretty',
        },
      },
    });

  await fastify.register(Middie, { hook: 'onRequest' });
  fastify.register(fastifyFormbody);
  fastify.register(staticPlugin, {
    root: path.resolve(process.env.ASSET_PATH!),
    prefix: '/',
  });
  fastify.decorate('db', db);
  fastify.get('/api/health', (req, res) => {
    return res.code(200).send();
  });
  fastify.register(blog, { prefix: '/api/blogs' });
  fastify.use(async (req, res, next) => {
    if (
      !req.method ||
      req.method !== 'GET' ||
      (req.method === 'GET' &&
        req.originalUrl &&
        (req.originalUrl.startsWith('/assets') ||
          req.originalUrl.startsWith('/images') ||
          req.originalUrl.startsWith('/api')))
    )
      return next();
    const pageContextInit = {
      urlOriginal: req.originalUrl ?? '',
      headersOriginal: req.headers,
      cookies: req.headers.cookies,
      log: fastify.log,
    };
    const pageContext = await renderPage(pageContextInit);
    if (pageContext.errorWhileRendering) {
      // Run error tracking and logging here
    }
    const { httpResponse } = pageContext;
    if (res.writeEarlyHints)
      res.writeEarlyHints({
        link: httpResponse.earlyHints.map((e) => e.earlyHintLink),
      });
    httpResponse.headers.forEach(([name, value]) => res.setHeader(name, value));
    res.statusCode = httpResponse.statusCode;
    res.end(httpResponse.body);
  });

  fastify.listen({ host: '0.0.0.0', port: 5173 }, (err, address) => {
    fastify.log.info(`Now listening at ${address}...`);
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  });
}

server();
