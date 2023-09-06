import { pgTable, uuid, text, json, date, varchar } from 'drizzle-orm/pg-core';

export const pessoas = pgTable('pessoas', {
  id: uuid('id').primaryKey().defaultRandom(),
  apelido: text('apelido').notNull().unique(),
  nome: text('nome').notNull(),
  nascimento: varchar('nascimento', { length: 10 }).notNull(),
  stack: json('stack').$type<string[] | null>(),
  searchable: text('searchable'),
});
