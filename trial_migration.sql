-- Trial Migration: Add RPC function for starting free trials
-- This function bypasses RLS using SECURITY DEFINER, matching the existing pattern
-- used by get_user_subscription, can_user_upload, and increment_upload_count.

-- Run this SQL in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)

CREATE OR REPLACE FUNCTION start_free_trial(p_user_id TEXT, p_plan_type TEXT)
RETURNS JSON AS $$
DECLARE
  v_existing RECORD;
  v_trial_end TIMESTAMP WITH TIME ZONE;
  v_result RECORD;
BEGIN
  -- Validate plan type
  IF p_plan_type NOT IN ('standard', 'business') THEN
    RETURN json_build_object('success', false, 'error', 'Invalid plan type. Must be standard or business.');
  END IF;

  -- Check for existing subscription
  SELECT * INTO v_existing FROM subscriptions WHERE user_id = p_user_id;

  IF FOUND THEN
    -- Already trialing
    IF v_existing.status = 'trialing' THEN
      RETURN json_build_object('success', false, 'error', 'You are already in a trial period.');
    END IF;

    -- Already has active paid plan
    IF v_existing.status = 'active' AND v_existing.plan_type != 'free' THEN
      RETURN json_build_object('success', false, 'error', 'You already have an active paid subscription.');
    END IF;

    -- Update to trialing
    v_trial_end := NOW() + INTERVAL '7 days';

    UPDATE subscriptions
    SET plan_type = p_plan_type,
        status = 'trialing',
        trial_end = v_trial_end,
        current_period_end = v_trial_end,
        updated_at = NOW()
    WHERE user_id = p_user_id
    RETURNING * INTO v_result;

  ELSE
    -- Create new subscription with trial
    v_trial_end := NOW() + INTERVAL '7 days';

    INSERT INTO subscriptions (user_id, plan_type, status, trial_end, current_period_end, updated_at)
    VALUES (p_user_id, p_plan_type, 'trialing', v_trial_end, v_trial_end, NOW())
    RETURNING * INTO v_result;
  END IF;

  RETURN json_build_object('success', true, 'plan_type', v_result.plan_type, 'status', v_result.status, 'trial_end', v_result.trial_end);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION start_free_trial IS 'Starts a 7-day free trial for a user on the specified plan (standard or business)';
