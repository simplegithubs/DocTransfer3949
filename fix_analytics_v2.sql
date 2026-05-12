-- ====================================================================
-- ANALYTICS & DOWNLOAD TRACKING: MASTER FIX V2.1
-- ====================================================================
-- INSTRUCTIONS:
-- 1. Open your Supabase Dashboard.
-- 2. Go to the "SQL Editor" section.
-- 3. Paste this ENTIRE script and click "Run".
-- ====================================================================

-- 1. FIX VIEW: daily_document_stats
-----------------------------------------------------------------------
DROP VIEW IF EXISTS daily_document_stats CASCADE;
CREATE OR REPLACE VIEW daily_document_stats AS
WITH all_dates AS (
    SELECT document_id, DATE_TRUNC('day', created_at) as stat_date FROM document_access_sessions
    UNION
    SELECT document_id, DATE_TRUNC('day', downloaded_at) as stat_date FROM document_downloads
    UNION
    SELECT document_id, DATE_TRUNC('day', view_timestamp) as stat_date FROM document_view_tracking
),
sessions_agg AS (
    SELECT 
        document_id, 
        DATE_TRUNC('day', created_at) as stat_date,
        COUNT(*) as total_link_opens,
        COUNT(DISTINCT ip_address) as unique_viewers
    FROM document_access_sessions
    GROUP BY document_id, DATE_TRUNC('day', created_at)
),
views_agg AS (
    SELECT 
        document_id, 
        DATE_TRUNC('day', view_timestamp) as stat_date,
        COUNT(*) as total_views,
        AVG(duration_seconds) as avg_duration_seconds
    FROM document_view_tracking
    GROUP BY document_id, DATE_TRUNC('day', view_timestamp)
),
downloads_agg AS (
    SELECT 
        document_id, 
        DATE_TRUNC('day', downloaded_at) as stat_date,
        COUNT(*) as total_downloads
    FROM document_downloads
    GROUP BY document_id, DATE_TRUNC('day', downloaded_at)
)
SELECT
    ad.document_id,
    ad.stat_date,
    COALESCE(va.total_views, 0) as total_views,
    COALESCE(sa.total_link_opens, 0) as total_link_opens,
    COALESCE(sa.unique_viewers, 0) as unique_viewers,
    COALESCE(ROUND(va.avg_duration_seconds), 0) as avg_duration_seconds,
    LEAST(100, ROUND(COALESCE(va.avg_duration_seconds, 0) / 60 * 100)) as engagement_score,
    COALESCE(da.total_downloads, 0) as total_downloads
FROM all_dates ad
LEFT JOIN sessions_agg sa ON ad.document_id = sa.document_id AND ad.stat_date = sa.stat_date
LEFT JOIN views_agg va ON ad.document_id = va.document_id AND ad.stat_date = va.stat_date
LEFT JOIN downloads_agg da ON ad.document_id = da.document_id AND ad.stat_date = da.stat_date;

-- 2. SECURITY POLICIES (Allow updates for heartbeat)
-----------------------------------------------------------------------

-- Allow anonymous updates to duration (required for Avg. Time)
DROP POLICY IF EXISTS "Public can update view duration" ON document_view_tracking;
CREATE POLICY "Public can update view duration" ON document_view_tracking 
FOR UPDATE USING (true) WITH CHECK (true);

-- Allow anonymous updates to session activity
DROP POLICY IF EXISTS "Public can update session activity" ON document_access_sessions;
CREATE POLICY "Public can update session activity" ON document_access_sessions 
FOR UPDATE USING (true) WITH CHECK (true);

-- 3. PERMISSIONS
-----------------------------------------------------------------------
GRANT SELECT, INSERT, UPDATE ON document_view_tracking TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE ON document_access_sessions TO anon, authenticated, service_role;
GRANT SELECT, INSERT ON document_downloads TO anon, authenticated, service_role;
GRANT SELECT ON daily_document_stats TO anon, authenticated, service_role;

-- 4. RELOAD POSTGREST
-----------------------------------------------------------------------
NOTIFY pgrst, 'reload config';

-- ====================================================================
-- FIX COMPLETE! Your Analytics heartbeat and IP tracking are now active.
-- ====================================================================
