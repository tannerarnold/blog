import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { nanoid } from 'nanoid';

export const sessions = sqliteTable(
  'sessions',
  {
    id: text()
      .primaryKey()
      .notNull()
      .$defaultFn(() => nanoid(32)),
    user_id: text().notNull(),
    created_at: integer({ mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    expires_at: integer({ mode: 'timestamp' }).notNull(),
  },
  (table) => [
    index('user_id_expires_at_idx').on(table.user_id, table.expires_at),
  ],
);

export type Session = typeof sessions.$inferSelect;
