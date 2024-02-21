import { relations } from 'drizzle-orm';
import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { listsTable } from '../../lists/entities/list.entity';

export const todosTable = pgTable(
  'todos',
  {
    id: uuid('id').primaryKey(),
    listId: uuid('list_id')
      .notNull()
      .references(() => listsTable.id),
    title: text('title').notNull(),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    isImportant: boolean('is_important').default(false).notNull(),
    isDone: boolean('is_done').default(false).notNull(),
  },
  (table) => ({
    listTodosIdx: index('list_todos_idx').on(table.listId),
  }),
);

export const todosRelations = relations(todosTable, ({ one }) => ({
  list: one(listsTable, {
    fields: [todosTable.listId],
    references: [listsTable.id],
  }),
}));
