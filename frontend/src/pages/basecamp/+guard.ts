import { redirect } from 'vike/abort';
import type { GuardAsync, PageContext } from 'vike/types';

export const guard: GuardAsync = async (context: PageContext) => {
  const authUserResponse = await fetch(
    new URL('/auth/status', process.env.API_URL),
    {
      headers: {
        'X-CSRF-Token': context.cookies.csrf_token ?? '',
        'X-Session-Id': context.cookies.session_id ?? '',
      },
    },
  );
  if (!authUserResponse.ok) {
    throw redirect('/');
  }
};
