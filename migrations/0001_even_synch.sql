-- Custom SQL migration file, put you code below! --
CREATE EXTENSION IF NOT EXISTS pg_trgm;
ALTER TABLE public.pessoas DROP COLUMN IF EXISTS searchable;
CREATE OR REPLACE FUNCTION generate_searchable(_nome VARCHAR, _apelido VARCHAR, _stack JSON)
        RETURNS TEXT AS $$
        BEGIN
        RETURN _nome || _apelido || _stack;
        END;
    $$ LANGUAGE plpgsql IMMUTABLE;
ALTER TABLE public.pessoas ADD COLUMN searchable text GENERATED ALWAYS AS (public.generate_searchable(nome, apelido, stack)) STORED;
CREATE INDEX IF NOT EXISTS idx_pessoas_searchable ON public.pessoas USING gist (searchable public.gist_trgm_ops (siglen='64'));