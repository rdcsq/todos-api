import { relations } from 'drizzle-orm';
import { index, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { sessionsTable } from 'src/auth/entities/session.entity';

export const accountsTable = pgTable(
  'accounts',
  {
    id: uuid('id').primaryKey(),
    email: text('email').notNull(),
    name: text('name').notNull(),
    password: text('password'),
  },
  (table) => ({
    accountEmailIdx: index('account_email_idx').on(table.email),
  }),
);

export const accountsRelations = relations(accountsTable, ({ many }) => ({
  sessions: many(sessionsTable),
}));
