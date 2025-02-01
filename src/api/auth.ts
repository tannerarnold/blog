import { users, type User } from '@lib/db/schema/users';
import { eq, or } from 'drizzle-orm';
import type { FastifyInstance } from 'fastify';
import type { FastifyPluginCallback } from 'fastify';
import * as argon2 from 'argon2';
import { sessions, type Session } from '@lib/db/schema/sessions';

type LoginBody = {
  usernameOrEmail: string;
  password: string;
};

// One day
const expiryOffset = 1000 * 60 * 60 * 24;

export const auth: FastifyPluginCallback = (
  fastify: FastifyInstance,
  _,
  done,
) => {
  fastify.post<{ Body: LoginBody }>('/', async (req, res) => {
    const { usernameOrEmail, password } = req.body;
    const adminUser: User | undefined = await fastify.db
      .select()
      .from(users)
      .where(
        or(
          eq(users.username, usernameOrEmail),
          eq(users.email, usernameOrEmail),
        ),
      )
      .get();

    if (!adminUser || !(await argon2.verify(adminUser.password, password)))
      return res
        .code(400)
        .send(
          'Incorrect username / email and password combination. Please try again.',
        );

    const [session]: Session[] = await fastify.db
      .insert(sessions)
      .values({
        user_id: adminUser.id,
        created_at: new Date(),
        expires_at: new Date(new Date().valueOf() + expiryOffset),
      })
      .returning()
      .execute();

    res.setCookie('session_id', res.signCookie(session.id), {
      path: '/',
      secure: true,
      httpOnly: true,
      maxAge: expiryOffset / 1000,
    });

    return res.redirect('/');
  });
  fastify.delete('/', async (req, res) => {
    if (!req.cookies.session_id)
      return res.code(400).send('You are not logged in.');

    const session: Session | undefined = await fastify.db
      .select()
      .from(sessions)
      .where(eq(sessions.id, req.cookies.session_id))
      .get();

    if (!session) return res.code(403).send('Session does not exist.');

    await fastify.db
      .delete(sessions)
      .where(eq(sessions.id, req.cookies.session_id));

    res.setCookie('session_id', '', {
      path: '/',
      secure: true,
      httpOnly: true,
      maxAge: -1,
    });

    return res.redirect('/');
  });
  done();
};
