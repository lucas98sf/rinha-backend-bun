import { Elysia, t } from 'elysia';
import { createInsertSchema } from 'drizzle-typebox';
import postgres from 'postgres';
// import { createClient } from 'redis';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq, ilike, sql } from 'drizzle-orm';
import { pessoas } from './schema';

const app = new Elysia();
const pg = postgres(
  process.env.NODE_ENV === 'production'
    ? 'postgres://postgres:postgres@db:5432/postgres'
    : 'postgres://postgres:postgres@localhost:5432/postgres',
  {
    max: 35,
    idle_timeout: 0,
    connect_timeout: 10000,
  },
);
const db = drizzle(pg);
// const redis = createClient({
//   url: process.env.NODE_ENV === 'production' ? 'redis://redis:6379' : 'redis://localhost:6379',
// });
// await redis.connect();

const pessoaInsertSchema = createInsertSchema(pessoas, {
  apelido: t.String({ maxLength: 32 }),
  nome: t.String({ maxLength: 100 }),
  nascimento: t.String({ maxLength: 10, pattern: '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' }),
  stack: t.Array(t.String({ maxLength: 32 })),
});

app
  .post(
    '/pessoas',
    async ({ body, set }) => {
      try {
        const [pessoa] = await db.insert(pessoas).values(body).returning().onConflictDoNothing().execute();
        if (!pessoa) {
          set.status = 422;
          return;
        }
        // redis.sAdd(`pessoas:nicknames:${pessoa.apelido}`, pessoa.apelido);
        // redis.setEx(`pessoas:ids:${pessoa.id}`, 5, JSON.stringify(pessoa));
        set.status = 201;
        set.headers = { location: `/pessoas/${pessoa.id}` };
      } catch (err) {
        console.log({ err });
        set.status = 500;
      }
    },
    {
      body: pessoaInsertSchema,
    },
  )
  .get(
    '/pessoas/:id',
    async ({ params, set }) => {
      try {
        // const cachedPessoa = await redis.getEx(`pessoas:ids:${params.id}`, { EX: 5 });
        // if (cachedPessoa) {
        //   return cachedPessoa;
        // }

        const [pessoa] = await db.select().from(pessoas).where(eq(pessoas.id, params.id)).execute();
        if (pessoa) {
          //   redis.setEx(`pessoas:ids:${pessoa.id}`, 5, JSON.stringify(pessoa));
          return pessoa;
        }

        set.status = 404;
      } catch (err) {
        set.status = 500;
      }
    },
    { params: t.Object({ id: t.String() }) },
  )
  .get(
    '/pessoas',
    async ({ query, set }) => {
      try {
        if (!query.t) {
          set.status = 400;
          return;
        }
        // const cachedPessoas = await redis.getEx(`pessoas:query:${query.t}`, { EX: 5 });
        // if (cachedPessoas) {
        //   return cachedPessoas;
        // }

        const pessoasFound = await db
          .select()
          .from(pessoas)
          .where(ilike(pessoas.searchable, `%${query.t}%`))
          .limit(50)
          .execute();
        // if (pessoasFound.length) {
        // redis.setEx(`pessoas:query:${query.t}`, 5, JSON.stringify(pessoasFound));
        return pessoasFound;
        // }
      } catch (err) {
        set.status = 500;
      }
    },
    { query: t.Object({ t: t.String() }) },
  )
  .get('/contagem-pessoas', async ({ set }) => {
    try {
      const pessoasCount = await db
        .select({ count: sql<number>`count(*)`.mapWith(Number) })
        .from(pessoas)
        .execute()
        .then(([{ count }]) => count);

      return pessoasCount;
    } catch (err) {
      set.status = 500;
    }
  })
  .listen(3000);
