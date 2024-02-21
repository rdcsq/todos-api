import { relations } from 'drizzle-orm';
import { index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { accountsTable } from 'src/database/database.schema';
import { todosTable } from '../../todos/entities/todo.entity';

export const listsTable = pgTable(
  'lists',
  {
    id: uuid('id').primaryKey(),
    accountId: uuid('account_id')
      .notNull()
      .references(() => accountsTable.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    accountListsIdx: index('account_lists_idx').on(table.accountId),
  }),
);

export const listsRelations = relations(listsTable, ({ one, many }) => ({
  account: one(accountsTable, {
    fields: [listsTable.accountId],
    references: [accountsTable.id],
  }),
  todos: many(todosTable),
}));
