-- ============================================
-- CREATE DOCUMENT DOWNLOADS TABLE
-- Tracks receiver emails for each file download
-- ============================================

-- 1. Create document_downloads table
CREATE TABLE IF NOT EXISTS document_downloads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    receiver_email TEXT NOT NULL,
    downloaded_at TIMESTAMPTZ DEFAULT NOW(),
    ip_address TEXT,
    user_agent TEXT
);

-- 2. Enable RLS
ALTER TABLE document_downloads ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies

-- Allow public insert (receivers can log their download)
CREATE POLICY "Public can insert downloads"
ON document_downloads FOR INSERT
WITH CHECK (true);

-- Allow public select (needed for analytics queries via views/joins)
CREATE POLICY "Public can select downloads"
ON document_downloads FOR SELECT
USING (true);

-- 4. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_downloads_document_id ON document_downloads(document_id);
CREATE INDEX IF NOT EXISTS idx_downloads_receiver_email ON document_downloads(receiver_email);
CREATE INDEX IF NOT EXISTS idx_downloads_downloaded_at ON document_downloads(downloaded_at);
