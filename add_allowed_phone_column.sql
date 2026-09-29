-- Migration: Add allowed_phone column to documents table
-- Purpose: Enables locking a document to a specific Indian mobile number for the Mobile Number Gate (+91 OTP) feature
-- When set, only the designated phone number can request an OTP and view the document.
-- When NULL, any valid Indian mobile number can verify via OTP (open lead-capture mode).

ALTER TABLE documents
ADD COLUMN IF NOT EXISTS allowed_phone TEXT DEFAULT NULL;

-- Add a comment for documentation
COMMENT ON COLUMN documents.allowed_phone IS 'Optional 10-digit Indian mobile number. If set, only this number can access the document via OTP. NULL = any number allowed.';
