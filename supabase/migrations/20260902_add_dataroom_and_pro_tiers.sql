-- Update subscriptions table check constraint to support pro, standard, business, and dataroom tiers
ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS subscriptions_plan_type_check;

ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_plan_type_check 
  CHECK (plan_type IN ('free', 'pro', 'standard', 'business', 'dataroom'));

-- Add comment explaining tiers
COMMENT ON COLUMN subscriptions.plan_type IS 'Subscription tier: free (lean starter), pro (growth founders/advisors), standard (legacy), business (teams/CAs), dataroom (VDR/M&A diligence)';
