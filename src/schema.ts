import { pgTable, uuid, varchar, json } from 'drizzle-orm/pg-core';

export const pessoas = pgTable('pessoas', {
  id: uuid('id').primaryKey().defaultRandom(),
  apelido: varchar('apelido', { length: 32 }).notNull().unique(),
  nome: varchar('nome', { length: 100 }).notNull(),
  nascimento: varchar('nascimento', { length: 10 }).notNull(),
  stack: json('stack').$type<string[] | null>(),
});
