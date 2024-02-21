import { relations } from 'drizzle-orm';
import {
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { accountsTable } from 'src/database/database.schema';

export const sessionsTable = pgTable(
  'sessions',
  {
    id: uuid('id').notNull(),
    accountId: uuid('account_id').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    lastUsed: timestamp('last_used').notNull().defaultNow(),
    origin: text('origin').notNull(),
  },
  (table) => ({
    sessionPk: primaryKey({
      name: 'session_pk',
      columns: [table.id, table.accountId],
    }),
  }),
);

export const sessionsRelations = relations(sessionsTable, ({ one }) => ({
  account: one(accountsTable, {
    fields: [sessionsTable.accountId],
    references: [accountsTable.id],
  }),
}));
