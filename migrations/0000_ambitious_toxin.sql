CREATE TABLE IF NOT EXISTS "pessoas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"apelido" text NOT NULL,
	"nome" text NOT NULL,
	"nascimento" varchar(10) NOT NULL,
	"stack" json,
	"searchable" text,
	CONSTRAINT "pessoas_apelido_unique" UNIQUE("apelido")
);
