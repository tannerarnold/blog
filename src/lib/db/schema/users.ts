import { sqliteTable, text, index } from 'drizzle-orm/sqlite-core';
import { nanoid } from 'nanoid';

export const users = sqliteTable(
  'users',
  {
    id: text()
      .primaryKey()
      .notNull()
      .$defaultFn(() => nanoid()),
    username: text().notNull(),
    password: text().notNull(),
    display: text().notNull(),
    email: text().notNull(),
  },
  (table) => [index('username_email_idx').on(table.username, table.email)],
);

export type User = typeof users.$inferSelect;
