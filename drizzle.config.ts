import type { Config } from 'drizzle-kit';

export default {
  schema: './src/schema.ts',
  out: './migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString:
      process.env.NODE_ENV === 'production'
        ? 'postgres://postgres:postgres@db:5432/postgres'
        : 'postgres://postgres:postgres@localhost:5432/postgres',
  },
} satisfies Config;
