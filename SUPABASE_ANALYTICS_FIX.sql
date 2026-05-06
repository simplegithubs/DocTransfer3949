-- ====================================================================
-- SUPABASE ANALYTICS & RECEIVER TRACKING: MASTER FIX
-- ====================================================================
-- INSTRUCTIONS:
-- 1. Open your Supabase Dashboard.
-- 2. Go to the "SQL Editor" section.
-- 3. Click "New Query".
-- 4. Paste this ENTIRE script.
-- 5. Click "Run".
-- ====================================================================

-- 1. BASE TABLES (Ensure they exist)
-----------------------------------------------------------------------

-- Sessions Table
CREATE TABLE IF NOT EXISTS document_access_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    visitor_id TEXT,
    ip_address TEXT,
    user_agent TEXT,
    geolocation JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_active_at TIMESTAMPTZ DEFAULT NOW()
);

-- View Tracking Table
CREATE TABLE IF NOT EXISTS document_view_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES document_access_sessions(id) ON DELETE CASCADE,
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    page_number INTEGER,
    view_timestamp TIMESTAMPTZ DEFAULT NOW(),
    duration_seconds INTEGER DEFAULT 0,
    ip_address TEXT,
    user_agent TEXT
);

-- Receiver Downloads Table (The "Email Gate" data)
CREATE TABLE IF NOT EXISTS document_downloads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    receiver_email TEXT NOT NULL,
    downloaded_at TIMESTAMPTZ DEFAULT NOW(),
    ip_address TEXT,
    user_agent TEXT
);

-- 2. SECURITY (Enable RLS & Policies)
-----------------------------------------------------------------------

ALTER TABLE document_access_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_view_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_downloads ENABLE ROW LEVEL SECURITY;

-- Allow public insertion (needed for anonymous tracking)
DROP POLICY IF EXISTS "Public can insert sessions" ON document_access_sessions;
CREATE POLICY "Public can insert sessions" ON document_access_sessions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can insert views" ON document_view_tracking;
CREATE POLICY "Public can insert views" ON document_view_tracking FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can insert downloads" ON document_downloads;
CREATE POLICY "Public can insert downloads" ON document_downloads FOR INSERT WITH CHECK (true);

-- Allow public selection (needed for views to function correctly)
DROP POLICY IF EXISTS "Public can select sessions" ON document_access_sessions;
CREATE POLICY "Public can select sessions" ON document_access_sessions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can select views" ON document_view_tracking;
CREATE POLICY "Public can select views" ON document_view_tracking FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can select downloads" ON document_downloads;
CREATE POLICY "Public can select downloads" ON document_downloads FOR SELECT USING (true);


-- 3. ANALYTICS VIEWS (The "Magic" that powers the charts)
-----------------------------------------------------------------------

-- Daily Aggregated Stats
DROP VIEW IF EXISTS daily_document_stats CASCADE;
CREATE OR REPLACE VIEW daily_document_stats AS
SELECT
    dvt.document_id,
    DATE_TRUNC('day', dvt.view_timestamp) as stat_date,
    COUNT(*) as total_views,
    COUNT(DISTINCT dvt.session_id) as unique_sessions,
    COUNT(DISTINCT dvt.ip_address) as unique_ips,
    AVG(dvt.duration_seconds) as avg_duration_seconds
FROM document_view_tracking dvt
GROUP BY dvt.document_id, DATE_TRUNC('day', dvt.view_timestamp);

-- Page Attention Heatmap
DROP VIEW IF EXISTS page_attention_stats CASCADE;
CREATE OR REPLACE VIEW page_attention_stats AS
SELECT
    dvt.document_id,
    dvt.page_number,
    COUNT(*) as total_views,
    AVG(dvt.duration_seconds) as avg_duration_seconds,
    MAX(dvt.duration_seconds) as max_duration_seconds,
    MIN(dvt.duration_seconds) as min_duration_seconds
FROM document_view_tracking dvt
WHERE dvt.page_number IS NOT NULL
GROUP BY dvt.document_id, dvt.page_number;

-- Geographic Distribution
DROP VIEW IF EXISTS viewer_geo_stats CASCADE;
CREATE OR REPLACE VIEW viewer_geo_stats AS
SELECT
    das.document_id,
    (das.geolocation->>'country') as country_code,
    (das.geolocation->>'city') as city,
    COUNT(*) as session_count
FROM document_access_sessions das
WHERE das.geolocation IS NOT NULL
GROUP BY das.document_id, das.geolocation->>'country', das.geolocation->>'city';

-- Device & Browser Stats
DROP VIEW IF EXISTS device_analytics_stats CASCADE;
CREATE OR REPLACE VIEW device_analytics_stats AS
SELECT
    das.document_id,
    CASE
        WHEN das.user_agent ILIKE '%mobile%' THEN 'mobile'
        WHEN das.user_agent ILIKE '%tablet%' OR das.user_agent ILIKE '%ipad%' THEN 'tablet'
        ELSE 'desktop'
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
        WHEN das.user_agent ILIKE '%mobile%' THEN 'mobile'
        WHEN das.user_agent ILIKE '%tablet%' OR das.user_agent ILIKE '%ipad%' THEN 'tablet'
        ELSE 'desktop'
    END,
    CASE
        WHEN das.user_agent ILIKE '%chrome%' THEN 'Chrome'
        WHEN das.user_agent ILIKE '%firefox%' THEN 'Firefox'
        WHEN das.user_agent ILIKE '%safari%' AND das.user_agent NOT ILIKE '%chrome%' THEN 'Safari'
        WHEN das.user_agent ILIKE '%edge%' OR das.user_agent ILIKE '%edg%' THEN 'Edge'
        ELSE 'Other'
    END;


-- 4. CONVERSION FUNNEL (Calculates user journey)
-----------------------------------------------------------------------

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
    
    -- Step 4: Downloaded (Captured Email)
    SELECT 'Downloaded'::TEXT, 4, COUNT(DISTINCT receiver_email)::BIGINT, 'Unique emails captured'::TEXT
    FROM document_downloads
    WHERE document_id = p_document_id;
    
END;
$$ LANGUAGE plpgsql;


-- 5. PERMISSIONS (Crucial for frontend visibility)
-----------------------------------------------------------------------

-- Grant select to API roles
GRANT SELECT ON daily_document_stats TO anon, authenticated, service_role;
GRANT SELECT ON page_attention_stats TO anon, authenticated, service_role;
GRANT SELECT ON viewer_geo_stats TO anon, authenticated, service_role;
GRANT SELECT ON device_analytics_stats TO anon, authenticated, service_role;

-- Grant execute to API roles
GRANT EXECUTE ON FUNCTION get_document_conversion_funnel(UUID) TO anon, authenticated, service_role;

-- Force API to see new structure
NOTIFY pgrst, 'reload config';

-- ====================================================================
-- SETUP COMPLETE! Your Analytics Dashboard is now fully powered.
-- ====================================================================
