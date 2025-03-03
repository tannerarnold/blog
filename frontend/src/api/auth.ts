import type { FastifyPluginCallback } from 'fastify';
import type { User } from '@type/users';

type LoginRequestBody = {
  email: string;
  password: string;
};

const authPlugin: FastifyPluginCallback = (fastify, _, done) => {
  fastify.post<{ Body: LoginRequestBody }>('/', async (req, res) => {
    const { email, password } = req.body;
    const authResponse = await fetch(new URL('/auth/', process.env.API_URL), {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const cookies: string[] = authResponse.headers.getSetCookie();
    const authenticatedUser: User | string | undefined =
      (await authResponse.json()) as User | string | undefined;
    for (const cookie of cookies) {
      res.header('set-cookie', cookie);
    }
    return !authenticatedUser || typeof authenticatedUser === 'string'
      ? res.code(401).send('Unauthenticated')
      : res.code(200).send(authenticatedUser);
  });
  done();
};

export default authPlugin;
