-- ====================================================================
-- REAL-TIME ANALYTICS RPC: Summary Metrics
-- ====================================================================
-- This RPC provides the absolute current summary stats for a document,
-- calculated directly from raw tracking tables for maximum accuracy.

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
        
        -- 2. Unique Viewers: Count of distinct IP addresses (can be changed to visitor_id if preferred)
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

-- Grant execution permissions
GRANT EXECUTE ON FUNCTION get_realtime_document_stats(UUID) TO anon, authenticated, service_role;

-- Force API cache reload
NOTIFY pgrst, 'reload config';
