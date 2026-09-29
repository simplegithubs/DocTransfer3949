-- Migration: Add require_phone_otp column to documents table
-- Purpose: Fixes "Could not find the 'require_phone_otp' column of 'documents' in the schema cache"
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- 1. Add require_phone_otp column
ALTER TABLE documents 
ADD COLUMN IF NOT EXISTS require_phone_otp BOOLEAN DEFAULT FALSE;

-- 2. Add allowed_phone column if not already present
ALTER TABLE documents 
ADD COLUMN IF NOT EXISTS allowed_phone TEXT DEFAULT NULL;

-- 3. Document the columns
COMMENT ON COLUMN documents.require_phone_otp IS 'Enables OTP verification via mobile number gate before viewing.';
COMMENT ON COLUMN documents.allowed_phone IS 'Optional 10-digit Indian mobile number. If set, only this number can access via OTP.';

-- 4. Reload PostgREST schema cache immediately
NOTIFY pgrst, 'reload schema';
