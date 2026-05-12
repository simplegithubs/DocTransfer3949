-- ====================================================================
-- AUDIT TRAIL & COMPLIANCE: MASTER FIX V1
-- ====================================================================
-- INSTRUCTIONS:
-- 1. Open your Supabase Dashboard.
-- 2. Go to the "SQL Editor" section.
-- 3. Paste this ENTIRE script and click "Run".
-- ====================================================================

-- 1. CONVERT MATERIALIZED VIEW TO REGULAR VIEW (For Real-time Stats)
-----------------------------------------------------------------------
DROP MATERIALIZED VIEW IF EXISTS audit_analytics CASCADE;
DROP VIEW IF EXISTS audit_analytics CASCADE;

CREATE OR REPLACE VIEW audit_analytics AS
SELECT 
    document_id,
    COUNT(*) FILTER (WHERE event_type = 'document_viewed') as total_views,
    COUNT(DISTINCT ip_address) FILTER (WHERE event_type = 'document_viewed') as unique_viewers,
    COUNT(*) FILTER (WHERE event_type = 'document_downloaded') as total_downloads,
    COUNT(*) FILTER (WHERE event_type LIKE 'signature_%') as signature_events,
    MIN(event_timestamp) as first_activity,
    MAX(event_timestamp) as last_activity,
    COUNT(DISTINCT DATE_TRUNC('day', event_timestamp)) as active_days
FROM audit_events
WHERE document_id IS NOT NULL
GROUP BY document_id;

-- 2. RECENT ACTIVITY VIEW
-----------------------------------------------------------------------
DROP VIEW IF EXISTS recent_audit_activity CASCADE;

CREATE OR REPLACE VIEW recent_audit_activity AS
SELECT 
    ae.id,
    ae.event_type,
    ae.event_timestamp,
    d.name as document_name,
    d.id as document_id,
    ds.signer_name,
    ae.user_email,
    ae.ip_address,
    ae.geolocation->>'city' as city,
    ae.geolocation->>'country' as country,
    ae.event_metadata,
    ae.user_agent,
    ae.session_id
FROM audit_events ae
LEFT JOIN documents d ON ae.document_id = d.id
LEFT JOIN document_signers ds ON ae.signer_id = ds.id
ORDER BY ae.event_timestamp DESC;

-- 3. SECURITY POLICIES
-----------------------------------------------------------------------
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts for tracking
DROP POLICY IF EXISTS "Public can insert audit events" ON audit_events;
CREATE POLICY "Public can insert audit events" ON audit_events 
FOR INSERT WITH CHECK (true);

-- Allow all reads (owner auth will be handled by app logic or further RLS)
DROP POLICY IF EXISTS "Public can select audit events" ON audit_events;
CREATE POLICY "Public can select audit events" ON audit_events 
FOR SELECT USING (true);

-- 4. PERMISSIONS
-----------------------------------------------------------------------
GRANT SELECT, INSERT ON audit_events TO anon, authenticated, service_role;
GRANT SELECT ON recent_audit_activity TO anon, authenticated, service_role;
GRANT SELECT ON audit_analytics TO anon, authenticated, service_role;

-- 5. RELOAD POSTGREST
-----------------------------------------------------------------------
NOTIFY pgrst, 'reload config';

-- ====================================================================
-- AUDIT FIX COMPLETE! Your Compliance reports are now real-time.
-- ====================================================================
