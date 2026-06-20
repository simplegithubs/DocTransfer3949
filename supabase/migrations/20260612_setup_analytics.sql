-- ============================================
-- Analytics & Insights System Migration
-- ============================================

-- Clean up any existing tables, views, and functions to ensure a clean slate
DROP VIEW IF EXISTS active_drm_sessions CASCADE;
DROP VIEW IF EXISTS drm_access_stats CASCADE;
DROP VIEW IF EXISTS daily_document_stats CASCADE;
DROP VIEW IF EXISTS page_attention_stats CASCADE;
DROP VIEW IF EXISTS viewer_geo_stats CASCADE;
DROP VIEW IF EXISTS device_analytics_stats CASCADE;

DROP TRIGGER IF EXISTS trigger_update_session_access ON document_view_tracking;
DROP TRIGGER IF EXISTS trigger_update_document_stats ON document_access_sessions;
DROP FUNCTION IF EXISTS update_session_last_access() CASCADE;
DROP FUNCTION IF EXISTS update_document_device_count() CASCADE;
DROP FUNCTION IF EXISTS check_access_limits(UUID, TEXT) CASCADE;
DROP FUNCTION IF EXISTS get_document_conversion_funnel(UUID) CASCADE;
DROP FUNCTION IF EXISTS get_realtime_document_stats(UUID) CASCADE;

-- Drop tables in reverse dependency order to avoid constraint violations
DROP TABLE IF EXISTS document_drm_settings CASCADE;
DROP TABLE IF EXISTS document_downloads CASCADE;
DROP TABLE IF EXISTS document_view_tracking CASCADE;
DROP TABLE IF EXISTS document_access_sessions CASCADE;

-- 1. BASE TABLES
-----------------------------------------------------------------------

-- Access Sessions Table
CREATE TABLE document_access_sessions (
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

CREATE INDEX idx_access_sessions_doc ON document_access_sessions(document_id);
CREATE INDEX idx_access_sessions_token ON document_access_sessions(session_token);
CREATE INDEX idx_access_sessions_device ON document_access_sessions(device_fingerprint);
CREATE INDEX idx_access_sessions_revoked ON document_access_sessions(is_revoked);

-- View Tracking Table
CREATE TABLE document_view_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    session_id UUID REFERENCES document_access_sessions(id) ON DELETE CASCADE,
    view_timestamp TIMESTAMPTZ DEFAULT NOW(),
    page_number INTEGER,
    duration_seconds INTEGER DEFAULT 0,
    ip_address VARCHAR(45),
    user_agent TEXT
);

CREATE INDEX idx_view_tracking_doc ON document_view_tracking(document_id);
CREATE INDEX idx_view_tracking_session ON document_view_tracking(session_id);
CREATE INDEX idx_view_tracking_timestamp ON document_view_tracking(view_timestamp DESC);

-- Receiver Downloads Table (The "Email Gate" data)
CREATE TABLE document_downloads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    receiver_email TEXT NOT NULL,
    downloaded_at TIMESTAMPTZ DEFAULT NOW(),
    ip_address TEXT,
    user_agent TEXT
);

CREATE INDEX idx_downloads_document_id ON document_downloads(document_id);
CREATE INDEX idx_downloads_receiver_email ON document_downloads(receiver_email);
CREATE INDEX idx_downloads_downloaded_at ON document_downloads(downloaded_at);

-- DRM Settings Table
CREATE TABLE document_drm_settings (
    document_id UUID PRIMARY KEY REFERENCES documents(id) ON DELETE CASCADE,
    max_views INTEGER, -- NULL = unlimited
    max_unique_devices INTEGER, -- NULL = unlimited
    prevent_copy BOOLEAN DEFAULT FALSE,
    prevent_print BOOLEAN DEFAULT FALSE,
    prevent_download BOOLEAN DEFAULT FALSE,
    prevent_screenshot BOOLEAN DEFAULT FALSE,
    require_watermark BOOLEAN DEFAULT FALSE,
    watermark_text TEXT,
    watermark_opacity DECIMAL DEFAULT 0.3 CHECK (watermark_opacity >= 0 AND watermark_opacity <= 1),
    watermark_position VARCHAR(20) DEFAULT 'diagonal' CHECK (watermark_position IN ('diagonal', 'center', 'bottom', 'top')),
    access_expires_at TIMESTAMPTZ,
    allowed_ip_ranges JSONB, -- Array of IP ranges or CIDR
    allowed_countries JSONB, -- Array of country codes
    blocked_countries JSONB,
    allowed_days_of_week JSONB, -- Array of integers 0-6 (Sunday=0)
    allowed_hours_start INTEGER CHECK (allowed_hours_start >= 0 AND allowed_hours_start <= 23),
    allowed_hours_end INTEGER CHECK (allowed_hours_end >= 0 AND allowed_hours_end <= 23),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Update documents table with DRM columns
ALTER TABLE documents 
ADD COLUMN IF NOT EXISTS drm_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS total_access_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS unique_device_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_access_revoked_at TIMESTAMPTZ;

-- 2. HELPER FUNCTIONS & TRIGGERS
-----------------------------------------------------------------------

-- Function to auto-update last_access_at on sessions
CREATE OR REPLACE FUNCTION update_session_last_access()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE document_access_sessions
    SET 
        last_access_at = NOW(),
        access_count = access_count + 1
    WHERE id = NEW.session_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update session on new view
CREATE TRIGGER trigger_update_session_access
    AFTER INSERT ON document_view_tracking
    FOR EACH ROW
    EXECUTE FUNCTION update_session_last_access();

-- Function to count unique devices for a document
CREATE OR REPLACE FUNCTION update_document_device_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Only update if not revoked and device fingerprint exists
    IF NEW.is_revoked = FALSE AND NEW.device_fingerprint IS NOT NULL THEN
        UPDATE documents
        SET 
            unique_device_count = (
                SELECT COUNT(DISTINCT device_fingerprint)
                FROM document_access_sessions
                WHERE document_id = NEW.document_id
                AND is_revoked = FALSE
                AND device_fingerprint IS NOT NULL
            ),
            total_access_count = total_access_count + 1
        WHERE id = NEW.document_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update document stats
CREATE TRIGGER trigger_update_document_stats
    AFTER INSERT ON document_access_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_document_device_count();

-- Function to check if access is allowed based on view limits
CREATE OR REPLACE FUNCTION check_access_limits(
    p_document_id UUID,
    p_device_fingerprint TEXT
) RETURNS TABLE (
    allowed BOOLEAN,
    reason TEXT,
    remaining_views INTEGER
) AS $$
DECLARE
    v_drm_settings RECORD;
    v_total_views INTEGER;
    v_unique_devices INTEGER;
    v_session_count INTEGER;
BEGIN
    -- Get DRM settings
    SELECT * INTO v_drm_settings
    FROM document_drm_settings
    WHERE document_id = p_document_id;
    
    -- If no DRM settings, allow access
    IF v_drm_settings IS NULL THEN
        RETURN QUERY SELECT TRUE, NULL::TEXT, NULL::INTEGER;
        RETURN;
    END IF;
    
    -- Check if access has expired
    IF v_drm_settings.access_expires_at IS NOT NULL 
       AND v_drm_settings.access_expires_at < NOW() THEN
        RETURN QUERY SELECT FALSE, 'Access has expired', 0;
        RETURN;
    END IF;
    
    -- Check max views
    IF v_drm_settings.max_views IS NOT NULL THEN
        SELECT COUNT(*) INTO v_total_views
        FROM document_view_tracking
        WHERE document_id = p_document_id;
        
        IF v_total_views >= v_drm_settings.max_views THEN
            RETURN QUERY SELECT FALSE, 'Maximum view limit reached', 0;
            RETURN;
        END IF;
    END IF;
    
    -- Check max unique devices
    IF v_drm_settings.max_unique_devices IS NOT NULL THEN
        SELECT COUNT(DISTINCT device_fingerprint) INTO v_unique_devices
        FROM document_access_sessions
        WHERE document_id = p_document_id
        AND is_revoked = FALSE
        AND device_fingerprint IS NOT NULL;
        
        -- Check if this is a new device
        SELECT COUNT(*) INTO v_session_count
        FROM document_access_sessions
        WHERE document_id = p_document_id
        AND device_fingerprint = p_device_fingerprint
        AND is_revoked = FALSE;
        
        IF v_session_count = 0 AND v_unique_devices >= v_drm_settings.max_unique_devices THEN
            RETURN QUERY SELECT FALSE, 'Maximum device limit reached', NULL::INTEGER;
            RETURN;
        END IF;
    END IF;
    
    -- Calculate remaining views
    IF v_drm_settings.max_views IS NOT NULL THEN
        RETURN QUERY SELECT 
            TRUE, 
            NULL::TEXT, 
            (v_drm_settings.max_views - v_total_views)::INTEGER;
    ELSE
        RETURN QUERY SELECT TRUE, NULL::TEXT, NULL::INTEGER;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 3. ANALYTICS VIEWS
-----------------------------------------------------------------------

-- Daily Aggregated Stats (V2.1 Enhanced version with Left Joins & Coalesce)
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

-- Page Attention Heatmap
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

-- View for active sessions summary
CREATE OR REPLACE VIEW active_drm_sessions AS
SELECT 
    das.document_id,
    d.name as document_name,
    COUNT(*) as total_sessions,
    COUNT(*) FILTER (WHERE das.is_revoked = FALSE) as active_sessions,
    COUNT(*) FILTER (WHERE das.is_revoked = TRUE) as revoked_sessions,
    COUNT(DISTINCT das.device_fingerprint) as unique_devices,
    MAX(das.last_access_at) as last_activity,
    MIN(das.created_at) as first_access
FROM document_access_sessions das
JOIN documents d ON das.document_id = d.id
GROUP BY das.document_id, d.name;

-- View for access statistics
CREATE OR REPLACE VIEW drm_access_stats AS
SELECT 
    d.id as document_id,
    d.name as document_name,
    d.drm_enabled,
    dds.max_views,
    dds.max_unique_devices,
    COUNT(DISTINCT das.id) as total_sessions,
    COUNT(DISTINCT das.device_fingerprint) as unique_devices_accessed,
    COUNT(dvt.id) as total_views,
    dds.max_views - COUNT(dvt.id) as remaining_views,
    d.last_access_revoked_at
FROM documents d
LEFT JOIN document_drm_settings dds ON d.id = dds.document_id
LEFT JOIN document_access_sessions das ON d.id = das.document_id AND das.is_revoked = FALSE
LEFT JOIN document_view_tracking dvt ON d.id = dvt.document_id
WHERE d.drm_enabled = TRUE
GROUP BY d.id, d.name, d.drm_enabled, dds.max_views, dds.max_unique_devices, d.last_access_revoked_at;

-- 4. CONVERSION FUNNEL & SUMMARY RPCs
-----------------------------------------------------------------------

-- Conversion Funnel RPC
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

-- Real-time Document Stats Summary RPC
CREATE OR REPLACE FUNCTION get_realtime_document_stats(p_document_id UUID)
RETURNS TABLE (
    link_opens BIGINT,
    unique_viewers BIGINT,
    avg_time_seconds FLOAT,
    engagement_score FLOAT
) AS $$
BEGIN
    RETURN QUERY
    WITH session_totals AS (
        -- Sum up total time spent in each distinct session
        SELECT 
            session_id,
            SUM(duration_seconds) as total_duration
        FROM document_view_tracking
        WHERE document_id = p_document_id
        GROUP BY session_id
    )
    SELECT 
        -- 1. Link Opens: Total distinct sessions created
        (SELECT COUNT(*) FROM document_access_sessions WHERE document_id = p_document_id)::BIGINT as link_opens,
        
        -- 2. Unique Viewers: Count of distinct IP addresses
        (SELECT COUNT(DISTINCT ip_address) FROM document_access_sessions WHERE document_id = p_document_id)::BIGINT as unique_viewers,
        
        -- 3. Avg. Time: Average of total duration per session (rounded to 1 decimal)
        COALESCE((SELECT ROUND(AVG(total_duration)::NUMERIC, 1) FROM session_totals), 0)::FLOAT as avg_time_seconds,
        
        -- 4. Engagement: Score (0-100) based on 60-second target per session
        COALESCE(
            (SELECT LEAST(100, ROUND(AVG(total_duration)::NUMERIC / 60 * 100, 1)) FROM session_totals), 
            0
        )::FLOAT as engagement_score;
END;
$$ LANGUAGE plpgsql;

-- 5. ROW LEVEL SECURITY POLICIES
-----------------------------------------------------------------------

ALTER TABLE document_access_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_view_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_drm_settings ENABLE ROW LEVEL SECURITY;

-- Access Sessions Policies
DROP POLICY IF EXISTS access_sessions_select ON document_access_sessions;
CREATE POLICY access_sessions_select ON document_access_sessions
    FOR SELECT USING (true);

DROP POLICY IF EXISTS access_sessions_insert ON document_access_sessions;
CREATE POLICY access_sessions_insert ON document_access_sessions
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS access_sessions_update ON document_access_sessions;
CREATE POLICY access_sessions_update ON document_access_sessions
    FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public can insert sessions" ON document_access_sessions;
CREATE POLICY "Public can insert sessions" ON document_access_sessions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can select sessions" ON document_access_sessions;
CREATE POLICY "Public can select sessions" ON document_access_sessions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can update session activity" ON document_access_sessions;
CREATE POLICY "Public can update session activity" ON document_access_sessions FOR UPDATE USING (true) WITH CHECK (true);

-- View Tracking Policies
DROP POLICY IF EXISTS view_tracking_select ON document_view_tracking;
CREATE POLICY view_tracking_select ON document_view_tracking
    FOR SELECT USING (true);

DROP POLICY IF EXISTS view_tracking_insert ON document_view_tracking;
CREATE POLICY view_tracking_insert ON document_view_tracking
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can insert tracking" ON document_view_tracking;
CREATE POLICY "Public can insert tracking" ON document_view_tracking FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update tracking" ON document_view_tracking;
CREATE POLICY "Public can update tracking" ON document_view_tracking FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public can select tracking" ON document_view_tracking;
CREATE POLICY "Public can select tracking" ON document_view_tracking FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert views" ON document_view_tracking;
CREATE POLICY "Public can insert views" ON document_view_tracking FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can select views" ON document_view_tracking;
CREATE POLICY "Public can select views" ON document_view_tracking FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can update view duration" ON document_view_tracking;
CREATE POLICY "Public can update view duration" ON document_view_tracking FOR UPDATE USING (true) WITH CHECK (true);

-- Downloads Policies
DROP POLICY IF EXISTS "Public can insert downloads" ON document_downloads;
CREATE POLICY "Public can insert downloads" ON document_downloads FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can select downloads" ON document_downloads;
CREATE POLICY "Public can select downloads" ON document_downloads FOR SELECT USING (true);

-- DRM Settings Policies
DROP POLICY IF EXISTS drm_settings_select ON document_drm_settings;
CREATE POLICY drm_settings_select ON document_drm_settings
    FOR SELECT USING (true);

DROP POLICY IF EXISTS drm_settings_insert ON document_drm_settings;
CREATE POLICY drm_settings_insert ON document_drm_settings
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM documents 
            WHERE documents.id = document_drm_settings.document_id 
            AND (documents.user_id = auth.uid()::text OR documents.user_id IS NULL)
        )
    );

DROP POLICY IF EXISTS drm_settings_update ON document_drm_settings;
CREATE POLICY drm_settings_update ON document_drm_settings
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM documents 
            WHERE documents.id = document_drm_settings.document_id 
            AND (documents.user_id = auth.uid()::text OR documents.user_id IS NULL)
        )
    );

-- 6. PERMISSIONS
-----------------------------------------------------------------------

GRANT SELECT, INSERT, UPDATE ON document_view_tracking TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE ON document_access_sessions TO anon, authenticated, service_role;
GRANT SELECT, INSERT ON document_downloads TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE ON document_drm_settings TO anon, authenticated, service_role;

GRANT SELECT ON daily_document_stats TO anon, authenticated, service_role;
GRANT SELECT ON page_attention_stats TO anon, authenticated, service_role;
GRANT SELECT ON viewer_geo_stats TO anon, authenticated, service_role;
GRANT SELECT ON device_analytics_stats TO anon, authenticated, service_role;
GRANT SELECT ON active_drm_sessions TO anon, authenticated, service_role;
GRANT SELECT ON drm_access_stats TO anon, authenticated, service_role;

GRANT EXECUTE ON FUNCTION get_document_conversion_funnel(UUID) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_realtime_document_stats(UUID) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION check_access_limits(UUID, TEXT) TO anon, authenticated, service_role;
