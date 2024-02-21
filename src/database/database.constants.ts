import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './database.schema';

export const DATABASE_SERVICE = 'DATABASE_SERVICE';

export type DatabaseService = ReturnType<typeof drizzle<typeof schema>>;
