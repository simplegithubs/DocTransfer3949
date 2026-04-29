-- Fix RLS for subscriptions and usage to allow client-side access
-- The previous policies relied on auth.uid() which is null when using Clerk without Supabase Auth sync

-- Drop existing restricted policies
DROP POLICY IF EXISTS "Users can view own subscription" ON subscriptions;
DROP POLICY IF EXISTS "Users can manage own subscription" ON subscriptions;
DROP POLICY IF EXISTS "Service role can manage subscriptions" ON subscriptions;

-- Enable public access for now (matching the "documents" table pattern)
-- In a production environment, this should be restricted using Clerk JWT verification in Supabase
CREATE POLICY "Public Manage Subscriptions"
  ON subscriptions FOR ALL
  USING (true)
  WITH CHECK (true);

-- Do the same for usage
DROP POLICY IF EXISTS "Users can view own usage" ON subscription_usage;
DROP POLICY IF EXISTS "Users can manage own usage" ON subscription_usage;
DROP POLICY IF EXISTS "Service role can manage usage" ON subscription_usage;

CREATE POLICY "Public Manage Usage"
  ON subscription_usage FOR ALL
  USING (true)
  WITH CHECK (true);
