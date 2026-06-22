-- ============================================================
-- DocTransfer: Fix All Missing Tables, Views & RPCs
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ============================================================

-- ============================================================
-- SECTION 1: CORE TRACKING TABLES
-- ============================================================

-- 1a. document_access_sessions
--     Stores one record per viewer session on a document
CREATE TABLE IF NOT EXISTS document_access_sessions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id     UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    session_token   TEXT NOT NULL UNIQUE,
    user_agent      TEXT,
    ip_address      TEXT,
    geolocation     JSONB,
    snapshot_url    TEXT,
    started_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at        TIMESTAMP WITH TIME ZONE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1b. document_view_tracking
--     Stores per-page view events within a session
CREATE TABLE IF NOT EXISTS document_view_tracking (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id       UUID NOT NULL REFERENCES document_access_sessions(id) ON DELETE CASCADE,
    document_id      UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    page_number      INTEGER NOT NULL DEFAULT 1,
    duration_seconds INTEGER DEFAULT 0,
    ip_address       TEXT,
    user_agent       TEXT,
    view_timestamp   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1c. document_downloads
--     Tracks receiver download events with email capture
CREATE TABLE IF NOT EXISTS document_downloads (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id     UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    receiver_email  TEXT,
    ip_address      TEXT,
    user_agent      TEXT,
    downloaded_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- SECTION 2: document_bundles TABLE
-- The code uses 'document_bundles' but MASTER_SETUP.sql created
-- 'bundles'. This block creates the correct table name.
-- ============================================================

CREATE TABLE IF NOT EXISTS document_bundles (
    id                       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id                  TEXT,
    name                     TEXT NOT NULL,
    share_link               TEXT UNIQUE NOT NULL,
    password                 TEXT,
    expires_at               TIMESTAMP WITH TIME ZONE,
    require_email_verification BOOLEAN DEFAULT false,
    allowed_email            TEXT,
    created_at               TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at               TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add bundle_id FK on documents if not already there
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'documents_bundle_id_fkey'
          AND table_name = 'documents'
    ) THEN
        ALTER TABLE documents
            ADD CONSTRAINT documents_bundle_id_fkey
            FOREIGN KEY (bundle_id) REFERENCES document_bundles(id) ON DELETE SET NULL;
    END IF;
END $$;

-- ============================================================
-- SECTION 3: branding_settings TABLE
-- Used by DataRoom & ViewDocument to load custom logos/colors
-- ============================================================

CREATE TABLE IF NOT EXISTS branding_settings (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id      TEXT NOT NULL UNIQUE,
    logo_url     TEXT,
    brand_color  TEXT DEFAULT '#4f46e5',
    site_url     TEXT,
    remove_branding BOOLEAN DEFAULT false,
    created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- SECTION 4: Add missing columns to documents (if absent)
-- ============================================================

DO $$
BEGIN
    -- view_count column (used by increment_view_count RPC)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name='documents' AND column_name='view_count'
    ) THEN
        ALTER TABLE documents ADD COLUMN view_count INTEGER DEFAULT 0;
    END IF;

    -- require_snapshot column (used by ViewDocument)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name='documents' AND column_name='require_snapshot'
    ) THEN
        ALTER TABLE documents ADD COLUMN require_snapshot BOOLEAN DEFAULT false;
    END IF;

    -- storage_type column (used by ViewDocument for Google Drive)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name='documents' AND column_name='storage_type'
    ) THEN
        ALTER TABLE documents ADD COLUMN storage_type TEXT DEFAULT 'supabase';
    END IF;

    -- google_drive_link column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name='documents' AND column_name='google_drive_link'
    ) THEN
        ALTER TABLE documents ADD COLUMN google_drive_link TEXT;
    END IF;
END $$;

-- ============================================================
-- SECTION 5: ANALYTICS VIEWS
-- ============================================================

-- 5a. daily_document_stats
--     Aggregates session data into daily statistics per document
CREATE OR REPLACE VIEW daily_document_stats AS
SELECT
    dvt.document_id,
    DATE(dvt.view_timestamp)                              AS stat_date,
    COUNT(DISTINCT dvt.session_id)::INTEGER               AS total_views,
    COUNT(DISTINCT das.id)::INTEGER                       AS total_link_opens,
    COUNT(DISTINCT das.ip_address)::INTEGER               AS unique_viewers,
    COALESCE(AVG(dvt.duration_seconds), 0)::FLOAT         AS avg_duration_seconds,
    LEAST(
        COALESCE(AVG(dvt.duration_seconds), 0) / 60.0,
        10
    )::FLOAT                                              AS engagement_score,
    COUNT(DISTINCT dd.id)::INTEGER                        AS total_downloads
FROM   document_view_tracking dvt
LEFT JOIN document_access_sessions das ON das.id = dvt.session_id
LEFT JOIN document_downloads dd
    ON  dd.document_id = dvt.document_id
    AND DATE(dd.downloaded_at) = DATE(dvt.view_timestamp)
GROUP  BY dvt.document_id, DATE(dvt.view_timestamp);


-- 5b. page_attention_stats
--     Average time and total views per page number per document
CREATE OR REPLACE VIEW page_attention_stats AS
SELECT
    document_id,
    page_number,
    COALESCE(AVG(duration_seconds), 0)::FLOAT AS avg_duration_seconds,
    COUNT(*)::INTEGER                          AS total_views
FROM   document_view_tracking
GROUP  BY document_id, page_number;

-- 5c. viewer_geo_stats
--     Geographic distribution derived from stored geolocation JSONB
CREATE OR REPLACE VIEW viewer_geo_stats AS
SELECT
    das.document_id,
    COALESCE(das.geolocation->>'country_code', 'Unknown') AS country_code,
    COALESCE(das.geolocation->>'city',         'Unknown') AS city,
    COUNT(*)::INTEGER                                      AS session_count
FROM   document_access_sessions das
GROUP  BY das.document_id,
          das.geolocation->>'country_code',
          das.geolocation->>'city';

-- 5d. device_analytics_stats
--     Device/browser breakdown derived from user_agent strings
CREATE OR REPLACE VIEW device_analytics_stats AS
SELECT
    das.document_id,
    CASE
        WHEN das.user_agent ILIKE '%Mobile%' OR das.user_agent ILIKE '%Android%' THEN 'Mobile'
        WHEN das.user_agent ILIKE '%Tablet%' OR das.user_agent ILIKE '%iPad%'    THEN 'Tablet'
        ELSE 'Desktop'
    END                                                  AS device_type,
    CASE
        WHEN das.user_agent ILIKE '%Chrome%'  THEN 'Chrome'
        WHEN das.user_agent ILIKE '%Firefox%' THEN 'Firefox'
        WHEN das.user_agent ILIKE '%Safari%'
         AND das.user_agent NOT ILIKE '%Chrome%' THEN 'Safari'
        WHEN das.user_agent ILIKE '%Edge%'    THEN 'Edge'
        ELSE 'Other'
    END                                                  AS browser_name,
    COUNT(*)::INTEGER                                    AS session_count
FROM   document_access_sessions das
GROUP  BY das.document_id,
    CASE
        WHEN das.user_agent ILIKE '%Mobile%' OR das.user_agent ILIKE '%Android%' THEN 'Mobile'
        WHEN das.user_agent ILIKE '%Tablet%' OR das.user_agent ILIKE '%iPad%'    THEN 'Tablet'
        ELSE 'Desktop'
    END,
    CASE
        WHEN das.user_agent ILIKE '%Chrome%'  THEN 'Chrome'
        WHEN das.user_agent ILIKE '%Firefox%' THEN 'Firefox'
        WHEN das.user_agent ILIKE '%Safari%'
         AND das.user_agent NOT ILIKE '%Chrome%' THEN 'Safari'
        WHEN das.user_agent ILIKE '%Edge%'    THEN 'Edge'
        ELSE 'Other'
    END;

-- ============================================================
-- SECTION 6: RPC FUNCTIONS
-- ============================================================

-- 6a. increment_view_count
--     Safely increments the view_count column on documents
CREATE OR REPLACE FUNCTION increment_view_count(doc_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE documents
       SET view_count = COALESCE(view_count, 0) + 1,
           updated_at = NOW()
     WHERE id = doc_id;
END;
$$;

-- 6b. get_realtime_document_stats
--     Returns a single-row summary for the Analytics Dashboard header
CREATE OR REPLACE FUNCTION get_realtime_document_stats(p_document_id UUID)
RETURNS TABLE (
    link_opens       INTEGER,
    unique_viewers   INTEGER,
    avg_time_seconds FLOAT,
    engagement_score FLOAT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(DISTINCT das.id)::INTEGER                            AS link_opens,
        COUNT(DISTINCT das.ip_address)::INTEGER                    AS unique_viewers,
        COALESCE(AVG(dvt.duration_seconds), 0)::FLOAT              AS avg_time_seconds,
        LEAST(COALESCE(AVG(dvt.duration_seconds), 0) / 60.0, 10)::FLOAT AS engagement_score
    FROM   document_access_sessions das
    LEFT JOIN document_view_tracking dvt ON dvt.session_id = das.id
    WHERE  das.document_id = p_document_id;
END;
$$;

-- 6c. get_document_conversion_funnel
--     Returns ordered funnel steps (link open → page viewed → downloaded)
CREATE OR REPLACE FUNCTION get_document_conversion_funnel(p_document_id UUID)
RETURNS TABLE (
    step_name   TEXT,
    step_order  INTEGER,
    count       INTEGER,
    description TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_link_opens     INTEGER;
    v_pages_viewed   INTEGER;
    v_downloads      INTEGER;
BEGIN
    SELECT COUNT(DISTINCT id)::INTEGER
      INTO v_link_opens
      FROM document_access_sessions
     WHERE document_id = p_document_id;

    SELECT COUNT(DISTINCT session_id)::INTEGER
      INTO v_pages_viewed
      FROM document_view_tracking
     WHERE document_id = p_document_id;

    SELECT COUNT(*)::INTEGER
      INTO v_downloads
      FROM document_downloads
     WHERE document_id = p_document_id;

    RETURN QUERY VALUES
        ('Link Opened',   1, v_link_opens,   'Recipients who opened the share link'),
        ('Pages Viewed',  2, v_pages_viewed, 'Recipients who viewed at least one page'),
        ('Downloaded',    3, v_downloads,    'Recipients who downloaded the document');
END;
$$;

-- ============================================================
-- SECTION 7: ENABLE RLS ON NEW TABLES
-- ============================================================

ALTER TABLE document_access_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_view_tracking   ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_downloads       ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_bundles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE branding_settings        ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- SECTION 8: RLS POLICIES (permissive — tighten per your auth setup)
-- ============================================================

-- document_access_sessions: public insert (viewers create sessions), owner reads
DROP POLICY IF EXISTS "Allow session insert"  ON document_access_sessions;
CREATE POLICY "Allow session insert"  ON document_access_sessions FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow session select" ON document_access_sessions;
CREATE POLICY "Allow session select" ON document_access_sessions FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow session update" ON document_access_sessions;
CREATE POLICY "Allow session update" ON document_access_sessions FOR UPDATE USING (true);

-- document_view_tracking
DROP POLICY IF EXISTS "Allow view tracking"  ON document_view_tracking;
CREATE POLICY "Allow view tracking"  ON document_view_tracking FOR ALL USING (true);

-- document_downloads
DROP POLICY IF EXISTS "Allow download tracking" ON document_downloads;
CREATE POLICY "Allow download tracking" ON document_downloads FOR ALL USING (true);

-- document_bundles
DROP POLICY IF EXISTS "Allow bundle access" ON document_bundles;
CREATE POLICY "Allow bundle access" ON document_bundles FOR ALL USING (true);

-- branding_settings
DROP POLICY IF EXISTS "Allow branding access" ON branding_settings;
CREATE POLICY "Allow branding access" ON branding_settings FOR ALL USING (true);

-- ============================================================
-- SECTION 9: GRANT SELECT ON VIEWS TO ALL ROLES
-- ============================================================

GRANT SELECT ON daily_document_stats    TO anon, authenticated, service_role;
GRANT SELECT ON page_attention_stats    TO anon, authenticated, service_role;
GRANT SELECT ON viewer_geo_stats        TO anon, authenticated, service_role;
GRANT SELECT ON device_analytics_stats  TO anon, authenticated, service_role;
-- These views are created in 20260622_setup_real_analytics.sql;
-- skip gracefully if that migration hasn't been run yet.
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.views WHERE table_name = 'document_hourly_stats') THEN
        EXECUTE 'GRANT SELECT ON document_hourly_stats TO anon, authenticated, service_role';
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.views WHERE table_name = 'document_completion_summary') THEN
        EXECUTE 'GRANT SELECT ON document_completion_summary TO anon, authenticated, service_role';
    END IF;
END $$;

-- Grant execute on RPC functions
GRANT EXECUTE ON FUNCTION increment_view_count(UUID)           TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_realtime_document_stats(UUID)    TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_document_conversion_funnel(UUID) TO anon, authenticated, service_role;

-- ============================================================
-- DONE: All missing tables, views, and functions are now created.
-- Next step: Update your .env VITE_SUPABASE_ANON_KEY to a valid
-- JWT starting with "eyJ..." from Supabase Dashboard → Settings → API
-- ============================================================
