import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const connectionString =
  process.env.NODE_ENV === 'production'
    ? 'postgres://postgres:postgres@db:5432/postgres'
    : 'postgres://postgres:postgres@localhost:5432/postgres';
const psql = postgres(connectionString, { max: 1 });
const db = drizzle(psql);

await migrate(db, { migrationsFolder: 'migrations' }).then(() => console.log('migrations done'));

process.exit(0);
