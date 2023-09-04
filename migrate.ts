import { sql } from 'drizzle-orm';
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
await db
  .execute(
    sql`
  CREATE INDEX IF NOT EXISTS term_search_index_apelido ON pessoas USING gin(to_tsvector('english', apelido));
  CREATE INDEX IF NOT EXISTS term_search_index_nome ON pessoas USING gin(to_tsvector('english', nome));
  CREATE INDEX IF NOT EXISTS term_search_index_stack ON pessoas USING gin(to_tsvector('english', stack));
  `,
  )
  .then(() => console.log('indexes done'));

process.exit(0);
