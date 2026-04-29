-- COMPLETE COLUMN FIX FOR DOCTRANSFER
-- This script adds EVERY missing column to the documents table to ensure no more "schema cache" errors.
-- Run this in your Supabase SQL Editor.

ALTER TABLE documents 
ADD COLUMN IF NOT EXISTS custom_domain TEXT,
ADD COLUMN IF NOT EXISTS screenshot_protection BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS request_signature BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS requires_signature BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS signature_workflow_type TEXT DEFAULT 'sequential' CHECK (signature_workflow_type IN ('sequential', 'parallel')),
ADD COLUMN IF NOT EXISTS all_signed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS signature_completed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS signature_certificate_path TEXT,
ADD COLUMN IF NOT EXISTS encryption_key TEXT,
ADD COLUMN IF NOT EXISTS encryption_iv TEXT,
ADD COLUMN IF NOT EXISTS is_encrypted BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS original_file_name TEXT,
ADD COLUMN IF NOT EXISTS original_file_type TEXT,
ADD COLUMN IF NOT EXISTS scan_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS is_vault_file BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS apply_watermark BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS watermark_config JSONB,
ADD COLUMN IF NOT EXISTS max_views INTEGER,
ADD COLUMN IF NOT EXISTS burn_after_reading BOOLEAN DEFAULT false;

-- Fix audit_logs just in case
ALTER TABLE audit_logs
ADD COLUMN IF NOT EXISTS ip_address TEXT,
ADD COLUMN IF NOT EXISTS user_agent TEXT,
ADD COLUMN IF NOT EXISTS metadata JSONB;
