-- Remove foreign key constraint on employer_id for testing
ALTER TABLE public.contracts DROP CONSTRAINT IF EXISTS contracts_employer_id_fkey;