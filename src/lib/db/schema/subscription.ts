import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { nanoid } from 'nanoid';

export const subscriptions = sqliteTable(
  'subscriptions',
  {
    id: text()
      .primaryKey()
      .notNull()
      .$defaultFn(() => nanoid()),
    email: text().notNull().unique(),
    date_registered: integer({ mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    subscribed: integer({ mode: 'boolean' }).notNull(),
  },
  (table) => [
    index('email_idx').on(table.email),
    index('date_registered_subscribed_idx').on(
      table.date_registered,
      table.subscribed
    ),
  ]
);

export type Subscription = typeof subscriptions.$inferSelect;
