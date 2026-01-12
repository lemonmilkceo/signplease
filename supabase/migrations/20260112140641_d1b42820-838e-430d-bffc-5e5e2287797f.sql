-- Fix infinite recursion in RLS policies between contracts <-> contract_invitations
-- Root cause: contract_invitations policies query contracts, while a contracts policy queries contract_invitations.
-- Solution: use a SECURITY DEFINER helper function to check contract ownership without invoking RLS on contracts.

CREATE OR REPLACE FUNCTION public.is_contract_employer(p_contract_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.contracts c
    WHERE c.id = p_contract_id
      AND c.employer_id = p_user_id
  );
$$;

-- Recreate employer policies on contract_invitations using the helper (breaks RLS recursion)
DROP POLICY IF EXISTS "Employers can create invitations for their contracts" ON public.contract_invitations;
CREATE POLICY "Employers can create invitations for their contracts"
ON public.contract_invitations
FOR INSERT
TO authenticated
WITH CHECK (public.is_contract_employer(contract_id, auth.uid()));

DROP POLICY IF EXISTS "Employers can view their contract invitations" ON public.contract_invitations;
CREATE POLICY "Employers can view their contract invitations"
ON public.contract_invitations
FOR SELECT
TO authenticated
USING (public.is_contract_employer(contract_id, auth.uid()));

-- (Optional hardening) tighten worker update policy to avoid allowing anyone to update pending rows
-- This keeps intended flow: worker can update if it's already assigned to them OR if their profile phone matches.
DROP POLICY IF EXISTS "Workers can accept invitations" ON public.contract_invitations;
CREATE POLICY "Workers can accept invitations"
ON public.contract_invitations
FOR UPDATE
TO authenticated
USING (
  worker_id = auth.uid()
  OR (
    worker_id IS NULL
    AND EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.user_id = auth.uid()
        AND public.normalize_phone(p.phone) = public.normalize_phone(contract_invitations.phone)
    )
  )
)
WITH CHECK (
  worker_id = auth.uid()
  OR (
    worker_id IS NULL
    AND EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.user_id = auth.uid()
        AND public.normalize_phone(p.phone) = public.normalize_phone(contract_invitations.phone)
    )
  )
);
