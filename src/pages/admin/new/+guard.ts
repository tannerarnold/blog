import type { GuardAsync, PageContext } from 'vike/types';
import { render } from 'vike/abort';
import { db } from '@lib/db/db';
import { sessions, type Session } from '@lib/db/schema/sessions';
import { eq } from 'drizzle-orm';

export const guard: GuardAsync = async (
  pageContext: PageContext,
): ReturnType<GuardAsync> => {
  const session: Session | undefined = await db
    .select()
    .from(sessions)
    .where(eq(sessions.id, pageContext.cookies.session_id ?? ''))
    .get();
  if (!session || session.expires_at.valueOf() < Date.now())
    throw render(403, 'Unauthorized');
};
