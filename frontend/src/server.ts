import Fastify from 'fastify';
import Middie from '@fastify/middie';
import Cookie from '@fastify/cookie';
import FormData from '@fastify/formbody';
import MultiPart from '@fastify/multipart';
import path from 'path';
import { renderPage, createDevMiddleware } from 'vike/server';
import staticPlugin from '@fastify/static';
import cookie from 'cookie';
import 'dotenv/config';
import authPlugin from '@api/auth';
import postPlugin from '@api/posts';
import imagesPlugin from '@api/images';

await import(path.resolve(process.env.SERVER_ENTRY_PATH!));

async function server() {
  const fastify = Fastify();

  await fastify.register(Middie, { hook: 'onRequest' });
  await fastify.register(FormData);
  await fastify.register(MultiPart);
  await fastify.register(Cookie, {
    parseOptions: {
      path: '/',
    },
  });

  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    const { devMiddleware } = await createDevMiddleware();
    fastify.use(devMiddleware);
  }

  console.log(process.env.API_URL);

  fastify.register(staticPlugin, {
    root: path.resolve(process.env.ASSET_PATH!),
    prefix: '/',
  });

  fastify.get('/api/health', (_, res) => res.code(200).send());
  fastify.register(authPlugin, { prefix: '/api/auth' });
  fastify.register(postPlugin, { prefix: '/api/posts' });
  fastify.register(imagesPlugin, { prefix: '/api/images' });

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
      cookies: cookie.parse(req.headers.cookie ?? ''),
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

  fastify.listen({ host: '0.0.0.0', port: 5173 }, (err) => {
    console.log(`Now listening at 0.0.0.0:5173...`);
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  });
}

server();
