-- ==============================================================================
-- DOCTRANSFER MASTER ANALYTICS & INSIGHTS DATABASE SETUP
-- ==============================================================================
-- Instructions: Run this ENTIRE script in your Supabase Dashboard -> SQL Editor.
-- It is completely idempotent and safe to run multiple times.

-- 1. BASE TABLES (Created if they don't exist)
---------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS document_access_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    session_token VARCHAR(100) UNIQUE NOT NULL,
    ip_address VARCHAR(45),
    device_fingerprint TEXT,
    user_agent TEXT,
    geolocation JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_access_at TIMESTAMPTZ DEFAULT NOW(),
    access_count INTEGER DEFAULT 0,
    is_revoked BOOLEAN DEFAULT FALSE,
    revoked_at TIMESTAMPTZ,
    revoked_reason TEXT,
    snapshot_url TEXT
);

CREATE INDEX IF NOT EXISTS idx_access_sessions_doc ON document_access_sessions(document_id);
CREATE INDEX IF NOT EXISTS idx_access_sessions_token ON document_access_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_access_sessions_device ON document_access_sessions(device_fingerprint);

CREATE TABLE IF NOT EXISTS document_view_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    session_id UUID REFERENCES document_access_sessions(id) ON DELETE CASCADE,
    view_timestamp TIMESTAMPTZ DEFAULT NOW(),
    page_number INTEGER,
    duration_seconds INTEGER DEFAULT 0,
    ip_address VARCHAR(45),
    user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_view_tracking_doc ON document_view_tracking(document_id);
CREATE INDEX IF NOT EXISTS idx_view_tracking_session ON document_view_tracking(session_id);
CREATE INDEX IF NOT EXISTS idx_view_tracking_timestamp ON document_view_tracking(view_timestamp DESC);

CREATE TABLE IF NOT EXISTS document_downloads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    receiver_email TEXT NOT NULL,
    downloaded_at TIMESTAMPTZ DEFAULT NOW(),
    ip_address TEXT,
    user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_downloads_document_id ON document_downloads(document_id);
CREATE INDEX IF NOT EXISTS idx_downloads_receiver_email ON document_downloads(receiver_email);


-- 2. VIEWS SETUP
---------------------------------------------------------------------------------

DROP VIEW IF EXISTS daily_document_stats CASCADE;
CREATE OR REPLACE VIEW daily_document_stats AS
SELECT
    dvt.document_id,
    DATE_TRUNC('day', dvt.view_timestamp) as stat_date,
    COUNT(*) as total_views,
    COUNT(DISTINCT dvt.session_id) as unique_sessions,
    COUNT(DISTINCT dvt.ip_address) as unique_ips,
    COALESCE(AVG(dvt.duration_seconds), 0) as avg_duration_seconds
FROM document_view_tracking dvt
GROUP BY dvt.document_id, DATE_TRUNC('day', dvt.view_timestamp);

DROP VIEW IF EXISTS page_attention_stats CASCADE;
CREATE OR REPLACE VIEW page_attention_stats AS
SELECT
    dvt.document_id,
    dvt.page_number,
    COUNT(*) as total_views,
    COALESCE(AVG(dvt.duration_seconds), 0) as avg_duration_seconds,
    COALESCE(MAX(dvt.duration_seconds), 0) as max_duration_seconds,
    COALESCE(MIN(dvt.duration_seconds), 0) as min_duration_seconds
FROM document_view_tracking dvt
WHERE dvt.page_number IS NOT NULL
GROUP BY dvt.document_id, dvt.page_number;

DROP VIEW IF EXISTS viewer_geo_stats CASCADE;
CREATE OR REPLACE VIEW viewer_geo_stats AS
SELECT
    das.document_id,
    COALESCE(das.geolocation->>'country', 'IN') as country_code,
    COALESCE(das.geolocation->>'city', 'Unknown') as city,
    COUNT(*) as session_count
FROM document_access_sessions das
WHERE das.geolocation IS NOT NULL
GROUP BY das.document_id, das.geolocation->>'country', das.geolocation->>'city';

DROP VIEW IF EXISTS device_analytics_stats CASCADE;
CREATE OR REPLACE VIEW device_analytics_stats AS
SELECT
    das.document_id,
    CASE
        WHEN das.user_agent ILIKE '%mobile%' THEN 'Mobile'
        WHEN das.user_agent ILIKE '%tablet%' OR das.user_agent ILIKE '%ipad%' THEN 'Tablet'
        ELSE 'Desktop'
    END as device_type,
    CASE
        WHEN das.user_agent ILIKE '%chrome%' THEN 'Chrome'
        WHEN das.user_agent ILIKE '%firefox%' THEN 'Firefox'
        WHEN das.user_agent ILIKE '%safari%' AND das.user_agent NOT ILIKE '%chrome%' THEN 'Safari'
        WHEN das.user_agent ILIKE '%edge%' OR das.user_agent ILIKE '%edg%' THEN 'Edge'
        ELSE 'Other'
    END as browser_name,
    COUNT(*) as session_count
FROM document_access_sessions das
GROUP BY 
    das.document_id,
    CASE
        WHEN das.user_agent ILIKE '%mobile%' THEN 'Mobile'
        WHEN das.user_agent ILIKE '%tablet%' OR das.user_agent ILIKE '%ipad%' THEN 'Tablet'
        ELSE 'Desktop'
    END,
    CASE
        WHEN das.user_agent ILIKE '%chrome%' THEN 'Chrome'
        WHEN das.user_agent ILIKE '%firefox%' THEN 'Firefox'
        WHEN das.user_agent ILIKE '%safari%' AND das.user_agent NOT ILIKE '%chrome%' THEN 'Safari'
        WHEN das.user_agent ILIKE '%edge%' OR das.user_agent ILIKE '%edg%' THEN 'Edge'
        ELSE 'Other'
    END;

DROP VIEW IF EXISTS document_hourly_stats CASCADE;
CREATE OR REPLACE VIEW document_hourly_stats AS
SELECT
    document_id,
    TO_CHAR(view_timestamp, 'HH24:00') as hour_label,
    COUNT(*)::INTEGER as view_count
FROM document_view_tracking
GROUP BY document_id, TO_CHAR(view_timestamp, 'HH24:00');

DROP VIEW IF EXISTS document_completion_summary CASCADE;
CREATE OR REPLACE VIEW document_completion_summary AS
WITH doc_max_pages AS (
    SELECT 
        document_id, 
        COALESCE(MAX(page_number), 1) as total_pages
    FROM document_view_tracking
    GROUP BY document_id
),
session_page_counts AS (
    SELECT 
        s.document_id,
        s.id as session_id,
        COUNT(DISTINCT t.page_number) as pages_viewed
    FROM document_access_sessions s
    LEFT JOIN document_view_tracking t ON s.id = t.session_id
    GROUP BY s.document_id, s.id
),
session_statuses AS (
    SELECT
        s.document_id,
        s.session_id,
        CASE
            WHEN s.pages_viewed = 0 THEN 'Dropped'
            WHEN s.pages_viewed >= d.total_pages THEN 'Completed'
            ELSE 'Pending'
        END as completion_status
    FROM session_page_counts s
    LEFT JOIN doc_max_pages d ON s.document_id = d.document_id
)
SELECT
    document_id,
    completion_status,
    COUNT(*)::INTEGER as status_count
FROM session_statuses
GROUP BY document_id, completion_status;


-- 3. RPC FUNCTIONS
---------------------------------------------------------------------------------

DROP FUNCTION IF EXISTS get_document_conversion_funnel(UUID);
CREATE OR REPLACE FUNCTION get_document_conversion_funnel(p_document_id UUID)
RETURNS TABLE (
    step_name TEXT,
    step_order INTEGER,
    count BIGINT,
    description TEXT
) AS $$
BEGIN
    RETURN QUERY
    -- Step 1: Session Started
    SELECT 'Session Started'::TEXT, 1, COUNT(*)::BIGINT, 'Total distinct sessions created'::TEXT
    FROM document_access_sessions
    WHERE document_id = p_document_id
    
    UNION ALL
    
    -- Step 2: Content Viewed
    SELECT 'Content Viewed'::TEXT, 2, COUNT(DISTINCT session_id)::BIGINT, 'Sessions with at least one page view'::TEXT
    FROM document_view_tracking
    WHERE document_id = p_document_id
    
    UNION ALL
    
    -- Step 3: Engaged (>30s)
    SELECT 'Engaged (>30s)'::TEXT, 3, COUNT(DISTINCT session_id)::BIGINT, 'Sessions with > 30 seconds total view time'::TEXT
    FROM (
        SELECT session_id, SUM(duration_seconds) as total_duration
        FROM document_view_tracking
        WHERE document_id = p_document_id
        GROUP BY session_id
        HAVING SUM(duration_seconds) > 30
    ) as engaged_sessions
    
    UNION ALL
    
    -- Step 4: Completed/Signed
    SELECT 'Completed/Signed'::TEXT, 4, 
           (CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'document_signers') 
                 THEN (SELECT COUNT(*) FROM document_signers WHERE document_id = p_document_id AND status = 'signed')
                 ELSE 0 END)::BIGINT, 
           'Signatures completed'::TEXT;
END;
$$ LANGUAGE plpgsql;


-- 4. PERMISSIONS & RLS ACCESS (CRITICAL)
---------------------------------------------------------------------------------

-- Enable Row Level Security (RLS) on base tables
ALTER TABLE document_access_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_view_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_downloads ENABLE ROW LEVEL SECURITY;

-- Allow public anonymous/authenticated read & insert on tracking
DROP POLICY IF EXISTS "Public can insert access sessions" ON document_access_sessions;
CREATE POLICY "Public can insert access sessions" ON document_access_sessions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can insert view tracking" ON document_view_tracking;
CREATE POLICY "Public can insert view tracking" ON document_view_tracking FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can manage downloads" ON document_downloads;
CREATE POLICY "Public can manage downloads" ON document_downloads FOR ALL USING (true) WITH CHECK (true);

-- Grant select on all analytics views
GRANT SELECT ON daily_document_stats TO anon, authenticated, service_role;
GRANT SELECT ON page_attention_stats TO anon, authenticated, service_role;
GRANT SELECT ON viewer_geo_stats TO anon, authenticated, service_role;
GRANT SELECT ON device_analytics_stats TO anon, authenticated, service_role;
GRANT SELECT ON document_hourly_stats TO anon, authenticated, service_role;
GRANT SELECT ON document_completion_summary TO anon, authenticated, service_role;

-- Grant execute on RPC functions
GRANT EXECUTE ON FUNCTION get_document_conversion_funnel(UUID) TO anon, authenticated, service_role;

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload config';
