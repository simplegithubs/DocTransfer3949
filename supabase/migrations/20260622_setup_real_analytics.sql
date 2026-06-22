-- Drop views first to avoid datatype change errors
DROP VIEW IF EXISTS document_hourly_stats CASCADE;
DROP VIEW IF EXISTS document_completion_summary CASCADE;

-- Create document_hourly_stats view to aggregate page views by hour label
CREATE OR REPLACE VIEW document_hourly_stats AS
SELECT
    document_id,
    TO_CHAR(view_timestamp, 'HH24:00') as hour_label,
    COUNT(*)::INTEGER as view_count
FROM document_view_tracking
GROUP BY document_id, TO_CHAR(view_timestamp, 'HH24:00');

-- Create document_completion_summary view to calculate completion status based on actual page tracking
CREATE OR REPLACE VIEW document_completion_summary AS
WITH doc_max_pages AS (
    -- Estimate total pages for each document as the maximum page number viewed
    SELECT 
        document_id, 
        COALESCE(MAX(page_number), 1) as total_pages
    FROM document_view_tracking
    GROUP BY document_id
),
session_page_counts AS (
    -- Count how many unique pages each session viewed
    SELECT 
        s.document_id,
        s.id as session_id,
        COUNT(DISTINCT t.page_number) as pages_viewed
    FROM document_access_sessions s
    LEFT JOIN document_view_tracking t ON s.id = t.session_id
    GROUP BY s.document_id, s.id
),
session_statuses AS (
    -- Group sessions by whether they viewed 0 pages (Dropped), all pages (Completed), or some pages (Pending)
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

-- Grant permissions to read these views
GRANT SELECT ON document_hourly_stats TO anon, authenticated, service_role;
GRANT SELECT ON document_completion_summary TO anon, authenticated, service_role;
