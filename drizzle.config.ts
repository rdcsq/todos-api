import { Config } from 'drizzle-kit';

export default {
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
  driver: 'pg',
  schema: './src/database/database.schema.ts',
  out: 'migrations',
} satisfies Config;
