import type { User } from '@type/users';

export async function isAuthenticated(
  sessionId: string | undefined,
  csrfToken: string | undefined,
): Promise<User | false> {
  const authUserResponse = await fetch(
    new URL('/auth/status', process.env.API_URL),
    {
      headers: {
        'X-CSRF-Token': csrfToken ?? '',
        'X-Session-Id': sessionId ?? '',
      },
    },
  );
  if (!authUserResponse.ok) return false;
  return (await authUserResponse.json()) as User;
}
