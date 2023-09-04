CREATE TABLE IF NOT EXISTS "pessoas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"apelido" varchar(32) NOT NULL,
	"nome" varchar(100) NOT NULL,
	"nascimento" varchar(10) NOT NULL,
	"stack" json,
	CONSTRAINT "pessoas_apelido_unique" UNIQUE("apelido")
);
