-- ============================================================
-- FIX: Supabase RLS Policies for Public Document Sharing
-- Run this in your Supabase SQL Editor
-- ============================================================
-- 
-- FIX NOTE: auth.uid() returns uuid, but user_id is TEXT (Clerk IDs
--           like 'user_abc123'). Cast auth.uid()::text to fix:
--           "operator does not exist: uuid = text"
-- ============================================================

-- Step 1: Drop any existing conflicting policies on documents
DROP POLICY IF EXISTS "Allow public read by share_link" ON public.documents;
DROP POLICY IF EXISTS "Public can view shared documents" ON public.documents;
DROP POLICY IF EXISTS "Users manage own documents" ON public.documents;

-- Step 2: Allow anonymous users to SELECT documents by share_link
CREATE POLICY "Allow public read by share_link"
ON public.documents
FOR SELECT
TO anon, authenticated
USING (share_link IS NOT NULL);

-- Step 3: Allow authenticated users to manage their own documents
-- auth.uid()::text cast required - Clerk user_id is TEXT, not UUID
CREATE POLICY "Users manage own documents"
ON public.documents
FOR ALL
TO authenticated
USING (auth.uid()::text = user_id)
WITH CHECK (auth.uid()::text = user_id);

-- ============================================================
-- document_bundles table
-- ============================================================
DROP POLICY IF EXISTS "Allow public read bundles by share_link" ON public.document_bundles;
DROP POLICY IF EXISTS "Users manage own bundles" ON public.document_bundles;

CREATE POLICY "Allow public read bundles by share_link"
ON public.document_bundles
FOR SELECT
TO anon, authenticated
USING (share_link IS NOT NULL);

-- Same auth.uid()::text cast needed here
CREATE POLICY "Users manage own bundles"
ON public.document_bundles
FOR ALL
TO authenticated
USING (auth.uid()::text = user_id)
WITH CHECK (auth.uid()::text = user_id);

-- ============================================================
-- document_access_sessions (view tracking - anonymous inserts OK)
-- ============================================================
DROP POLICY IF EXISTS "Allow anon insert sessions" ON public.document_access_sessions;
CREATE POLICY "Allow anon insert sessions"
ON public.document_access_sessions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- ============================================================
-- document_view_tracking (analytics - anonymous inserts OK)
-- ============================================================
DROP POLICY IF EXISTS "Allow anon insert view tracking" ON public.document_view_tracking;
CREATE POLICY "Allow anon insert view tracking"
ON public.document_view_tracking
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow update for duration heartbeat
DROP POLICY IF EXISTS "Allow anon update view tracking duration" ON public.document_view_tracking;
CREATE POLICY "Allow anon update view tracking duration"
ON public.document_view_tracking
FOR UPDATE
TO anon, authenticated
USING (true);

-- ============================================================
-- Ensure RLS is enabled on all relevant tables
-- ============================================================
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_access_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_view_tracking ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- OPTIONAL: Uncomment if view count fails for anon users:
-- GRANT EXECUTE ON FUNCTION public.increment_view_count(uuid) TO anon;
-- ============================================================
