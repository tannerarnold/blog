import { isAuthenticated } from '@lib/utils/auth';
import type { User } from '@type/users';
import type { FastifyPluginCallback } from 'fastify';

type PostRequestForm = {
  title: string;
  slug: string;
  summary: string;
  content: string;
};

const postPlugin: FastifyPluginCallback = (fastify, _, done) => {
  fastify.post<{ Body: PostRequestForm }>('/', async (req, res) => {
    const { session_id, csrf_token } = req.cookies;
    const user: User | false = (await isAuthenticated(
      session_id,
      csrf_token,
    )) as User | false;
    if (!user) {
      return res.code(403).send('Forbidden');
    }
    const { title, slug, summary, content } = req.body;
    const addPostResponse = await fetch(
      new URL('/posts/', process.env.API_URL),
      {
        method: 'POST',
        headers: {
          'X-CSRF-Token': csrf_token ?? '',
          'X-Session-Id': session_id ?? '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          slug,
          summary,
          content,
          date_posted: new Date(),
          user_id: user.id,
        }),
      },
    );
    const addedPostLocation = await addPostResponse.json();
    return res.code(200).send(addedPostLocation);
  });
  done();
};

export default postPlugin;
