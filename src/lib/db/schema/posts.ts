import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { nanoid } from 'nanoid';

export const posts = sqliteTable(
  'posts',
  {
    id: text()
      .primaryKey()
      .notNull()
      .$defaultFn(() => nanoid()),
    date_posted: integer({ mode: 'timestamp' }).notNull(),
    title: text().notNull(),
    slug: text().notNull(),
    content: text().notNull(),
  },
  (table) => [
    index('date_posted_idx').on(table.date_posted),
    index('slug_idx').on(table.slug),
  ]
);

export type Post = typeof posts.$inferSelect;
