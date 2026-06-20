-- ============================================
-- Audit Trail & Compliance Reports Migration
-- ============================================

-- Clean up any existing partial/broken audit trail objects
DROP TRIGGER IF EXISTS trigger_update_view_count ON audit_events;
DROP TRIGGER IF EXISTS trigger_update_download_count ON audit_events;
DROP FUNCTION IF EXISTS increment_document_view_count() CASCADE;
DROP FUNCTION IF EXISTS increment_document_download_count() CASCADE;
DROP FUNCTION IF EXISTS refresh_audit_analytics() CASCADE;
DROP VIEW IF EXISTS recent_audit_activity CASCADE;
DROP VIEW IF EXISTS audit_analytics CASCADE;
DROP MATERIALIZED VIEW IF EXISTS audit_analytics CASCADE;
DROP TABLE IF EXISTS audit_events CASCADE;

-- Create audit_events table
CREATE TABLE audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(50) NOT NULL,
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    signer_id UUID REFERENCES document_signers(id) ON DELETE SET NULL,
    user_email VARCHAR(255),
    event_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_address VARCHAR(45),
    user_agent TEXT,
    geolocation JSONB,
    event_metadata JSONB,
    session_id VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add comments for documentation
COMMENT ON TABLE audit_events IS 'Stores all audit trail events for documents, signatures, and user activities';
COMMENT ON COLUMN audit_events.event_type IS 'Type of event: document_uploaded, document_viewed, document_downloaded, signature_completed, etc.';
COMMENT ON COLUMN audit_events.document_id IS 'Reference to the document (cascades on delete)';
COMMENT ON COLUMN audit_events.signer_id IS 'Reference to signer if signature-related event';
COMMENT ON COLUMN audit_events.user_email IS 'Email of user performing action (if available)';
COMMENT ON COLUMN audit_events.ip_address IS 'IPv4 or IPv6 address of user';
COMMENT ON COLUMN audit_events.geolocation IS 'JSON with country, region, city, lat, lng from IP lookup';
COMMENT ON COLUMN audit_events.event_metadata IS 'Additional event-specific data in JSON format';
COMMENT ON COLUMN audit_events.session_id IS 'Browser session identifier for tracking user sessions';

-- Create performance indexes
CREATE INDEX idx_audit_document ON audit_events(document_id);
CREATE INDEX idx_audit_type ON audit_events(event_type);
CREATE INDEX idx_audit_timestamp ON audit_events(event_timestamp DESC);
CREATE INDEX idx_audit_session ON audit_events(session_id);
CREATE INDEX idx_audit_user_email ON audit_events(user_email);
CREATE INDEX idx_audit_doc_timestamp ON audit_events(document_id, event_timestamp DESC);

-- Add statistics columns to documents table
ALTER TABLE documents 
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS download_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_viewed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS unique_viewers INTEGER DEFAULT 0;

COMMENT ON COLUMN documents.view_count IS 'Total number of times document has been viewed';
COMMENT ON COLUMN documents.download_count IS 'Total number of times document has been downloaded';
COMMENT ON COLUMN documents.last_viewed_at IS 'Timestamp of most recent view';
COMMENT ON COLUMN documents.unique_viewers IS 'Count of unique IP addresses that viewed the document';

-- Create function to auto-increment view counter
CREATE OR REPLACE FUNCTION increment_document_view_count()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.event_type = 'document_viewed' THEN
        UPDATE documents 
        SET 
            view_count = view_count + 1,
            last_viewed_at = NEW.event_timestamp
        WHERE id = NEW.document_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update document stats
CREATE TRIGGER trigger_update_view_count
    AFTER INSERT ON audit_events
    FOR EACH ROW
    EXECUTE FUNCTION increment_document_view_count();

-- Create function to auto-increment download counter
CREATE OR REPLACE FUNCTION increment_document_download_count()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.event_type = 'document_downloaded' THEN
        UPDATE documents 
        SET download_count = download_count + 1
        WHERE id = NEW.document_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for download count
CREATE TRIGGER trigger_update_download_count
    AFTER INSERT ON audit_events
    FOR EACH ROW
    EXECUTE FUNCTION increment_document_download_count();

-- Row Level Security (RLS) Policies
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;

-- Allow public inserts and selects (matching fix_audit_trail.sql)
DROP POLICY IF EXISTS "Public can insert audit events" ON audit_events;
CREATE POLICY "Public can insert audit events" ON audit_events 
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can select audit events" ON audit_events;
CREATE POLICY "Public can select audit events" ON audit_events 
    FOR SELECT USING (true);

DROP POLICY IF EXISTS audit_read_policy ON audit_events;
CREATE POLICY audit_read_policy ON audit_events
    FOR SELECT USING (true);

DROP POLICY IF EXISTS audit_insert_policy ON audit_events;
CREATE POLICY audit_insert_policy ON audit_events
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS audit_no_update ON audit_events;
CREATE POLICY audit_no_update ON audit_events
    FOR UPDATE USING (false);

DROP POLICY IF EXISTS audit_no_delete ON audit_events;
CREATE POLICY audit_no_delete ON audit_events
    FOR DELETE USING (false);

-- Create views
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

-- Grant permissions
GRANT SELECT, INSERT ON audit_events TO anon, authenticated, service_role;
GRANT SELECT ON recent_audit_activity TO anon, authenticated, service_role;
GRANT SELECT ON audit_analytics TO anon, authenticated, service_role;
