-- AI 노무사 검토 사용 내역 테이블
CREATE TABLE public.legal_review_credits (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL UNIQUE,
    free_reviews integer NOT NULL DEFAULT 5,
    paid_reviews integer NOT NULL DEFAULT 0,
    total_used integer NOT NULL DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- RLS 활성화
ALTER TABLE public.legal_review_credits ENABLE ROW LEVEL SECURITY;

-- RLS 정책
CREATE POLICY "Users can view own legal review credits"
ON public.legal_review_credits
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own legal review credits"
ON public.legal_review_credits
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own legal review credits"
ON public.legal_review_credits
FOR UPDATE
USING (auth.uid() = user_id);

-- 남은 검토 횟수 조회 함수
CREATE OR REPLACE FUNCTION public.get_remaining_legal_reviews(p_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_total INTEGER;
BEGIN
    SELECT COALESCE(free_reviews, 5) + COALESCE(paid_reviews, 0) INTO v_total
    FROM legal_review_credits
    WHERE user_id = p_user_id;
    
    IF NOT FOUND THEN
        RETURN 5; -- 신규 사용자 기본 5회 무료
    END IF;
    
    RETURN v_total;
END;
$$;

-- 검토 크레딧 사용 함수
CREATE OR REPLACE FUNCTION public.use_legal_review(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_free INTEGER;
    v_paid INTEGER;
BEGIN
    SELECT free_reviews, paid_reviews INTO v_free, v_paid
    FROM legal_review_credits
    WHERE user_id = p_user_id
    FOR UPDATE;
    
    IF NOT FOUND THEN
        -- 새 사용자면 크레딧 레코드 생성 (5회 중 1회 사용)
        INSERT INTO legal_review_credits (user_id, free_reviews, paid_reviews, total_used)
        VALUES (p_user_id, 4, 0, 1);
        RETURN TRUE;
    END IF;
    
    IF v_free > 0 THEN
        UPDATE legal_review_credits
        SET free_reviews = free_reviews - 1,
            total_used = total_used + 1,
            updated_at = now()
        WHERE user_id = p_user_id;
        RETURN TRUE;
    ELSIF v_paid > 0 THEN
        UPDATE legal_review_credits
        SET paid_reviews = paid_reviews - 1,
            total_used = total_used + 1,
            updated_at = now()
        WHERE user_id = p_user_id;
        RETURN TRUE;
    END IF;
    
    RETURN FALSE;
END;
$$;

-- updated_at 자동 갱신 트리거
CREATE TRIGGER update_legal_review_credits_updated_at
BEFORE UPDATE ON public.legal_review_credits
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();