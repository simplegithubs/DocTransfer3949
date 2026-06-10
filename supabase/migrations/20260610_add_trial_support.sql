-- Migration to support 14-day free trials

-- Add trial_end column if it doesn't exist
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS trial_end TIMESTAMPTZ;

-- Recreate get_user_subscription function to include trial_end
DROP FUNCTION IF EXISTS get_user_subscription(TEXT);

CREATE OR REPLACE FUNCTION get_user_subscription(p_user_id TEXT)
RETURNS TABLE (
  id UUID,
  plan_type TEXT,
  status TEXT,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN,
  trial_end TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.plan_type,
    s.status,
    s.current_period_end,
    s.cancel_at_period_end,
    s.trial_end
  FROM subscriptions s
  WHERE s.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update can_user_upload function to handle trial expirations
CREATE OR REPLACE FUNCTION can_user_upload(p_user_id TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_plan_type TEXT;
  v_status TEXT;
  v_trial_end TIMESTAMPTZ;
  v_uploads_this_month INTEGER;
BEGIN
  -- Get user's plan info
  SELECT plan_type, status, trial_end INTO v_plan_type, v_status, v_trial_end
  FROM subscriptions
  WHERE user_id = p_user_id;
  
  -- If no subscription found, default to free plan
  IF v_plan_type IS NULL THEN
    v_plan_type := 'free';
  END IF;
  
  -- If trialing and trial is expired, treat as free
  IF v_status = 'trialing' AND v_trial_end IS NOT NULL AND CURRENT_TIMESTAMP > v_trial_end THEN
    v_plan_type := 'free';
  END IF;

  -- Paid plans or active trials have unlimited uploads
  IF v_plan_type IN ('standard', 'business') AND (v_status = 'active' OR (v_status = 'trialing' AND (v_trial_end IS NULL OR CURRENT_TIMESTAMP <= v_trial_end))) THEN
    RETURN TRUE;
  END IF;
  
  -- For free plan (or expired trial), check monthly limit (10 uploads)
  SELECT COALESCE(documents_uploaded, 0) INTO v_uploads_this_month
  FROM subscription_usage
  WHERE user_id = p_user_id 
    AND month = DATE_TRUNC('month', CURRENT_DATE)::DATE;
  
  RETURN COALESCE(v_uploads_this_month, 0) < 10;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
