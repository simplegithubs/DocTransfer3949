-- MASTER DATABASE SETUP FOR DOCTRANSFER
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. ENABLE EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CREATE SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  plan_type TEXT NOT NULL DEFAULT 'free' CHECK (plan_type IN ('free', 'standard', 'business')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'trialing', 'incomplete')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  trial_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CREATE SUBSCRIPTION USAGE TABLE
CREATE TABLE IF NOT EXISTS subscription_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  month DATE NOT NULL,
  documents_uploaded INTEGER DEFAULT 0,
  storage_used BIGINT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, month)
);

-- 4. CREATE DOCUMENTS TABLE
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT,
  name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  file_type TEXT,
  share_link TEXT UNIQUE NOT NULL,
  bundle_id UUID,
  password TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  allow_download BOOLEAN DEFAULT true,
  email_verification BOOLEAN DEFAULT false,
  allowed_email TEXT,
  apply_watermark BOOLEAN DEFAULT false,
  watermark_config JSONB,
  max_views INTEGER,
  burn_after_reading BOOLEAN DEFAULT false,
  is_encrypted BOOLEAN DEFAULT false,
  encryption_key TEXT,
  encryption_iv TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  original_file_name TEXT,
  original_file_type TEXT,
  scan_status TEXT DEFAULT 'pending',
  is_vault_file BOOLEAN DEFAULT false,
  custom_domain TEXT,
  screenshot_protection BOOLEAN DEFAULT FALSE,
  request_signature BOOLEAN DEFAULT FALSE,
  requires_signature BOOLEAN DEFAULT FALSE,
  signature_workflow_type TEXT DEFAULT 'sequential' CHECK (signature_workflow_type IN ('sequential', 'parallel')),
  all_signed BOOLEAN DEFAULT FALSE,
  signature_completed_at TIMESTAMP WITH TIME ZONE,
  signature_certificate_path TEXT
);

-- 5. CREATE BUNDLES TABLE
CREATE TABLE IF NOT EXISTS bundles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT,
  name TEXT NOT NULL,
  share_link TEXT UNIQUE NOT NULL,
  password TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  require_email_verification BOOLEAN DEFAULT false,
  allowed_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. CREATE AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID,
  user_id TEXT,
  action TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. SETUP STORAGE BUCKET
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- 8. STORAGE POLICIES
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'documents' );

DROP POLICY IF EXISTS "Allow Uploads" ON storage.objects;
CREATE POLICY "Allow Uploads" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'documents' );

DROP POLICY IF EXISTS "Allow Deletes" ON storage.objects;
CREATE POLICY "Allow Deletes" ON storage.objects FOR DELETE USING ( bucket_id = 'documents' );

-- 9. ENABLE RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 10. BASIC RLS POLICIES (Allow all for testing)
CREATE POLICY "Enable all for users sub" ON subscriptions FOR ALL USING (true);
CREATE POLICY "Enable all for users usage" ON subscription_usage FOR ALL USING (true);
CREATE POLICY "Enable all for users docs" ON documents FOR ALL USING (true);
CREATE POLICY "Enable all for users bundles" ON bundles FOR ALL USING (true);
CREATE POLICY "Enable all for users audit" ON audit_logs FOR ALL USING (true);
