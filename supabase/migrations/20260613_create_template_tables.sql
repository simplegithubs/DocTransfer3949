-- Migration: Create Template Engine 2.0 Tables
-- Creates tables for document_templates, template_roles, and template_fields

-- Clean up any existing tables
DROP TABLE IF EXISTS template_fields CASCADE;
DROP TABLE IF EXISTS template_roles CASCADE;
DROP TABLE IF EXISTS document_templates CASCADE;

-- =====================================================
-- 1. DOCUMENT TEMPLATES TABLE
-- Stores metadata for e-signature templates
-- =====================================================
CREATE TABLE document_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  file_path TEXT, -- Null if generated/dynamic, path to PDF if static backdrop upload
  content_json JSONB, -- Rich-text elements or structural JSON
  created_by TEXT, -- Clerk User ID
  category TEXT DEFAULT 'custom',
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_document_templates_created_by ON document_templates(created_by);
CREATE INDEX idx_document_templates_category ON document_templates(category);

-- =====================================================
-- 2. TEMPLATE ROLES TABLE
-- Defines signer roles needed for a template (e.g., "Buyer", "Witness")
-- =====================================================
CREATE TABLE template_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES document_templates(id) ON DELETE CASCADE,
  role_name TEXT NOT NULL,
  signing_order INTEGER NOT NULL DEFAULT 1,
  color TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_template_roles_template_id ON template_roles(template_id);

-- =====================================================
-- 3. TEMPLATE FIELDS TABLE
-- Pre-placed signature & input fields mapped to a role
-- =====================================================
CREATE TABLE template_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES document_templates(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES template_roles(id) ON DELETE CASCADE,
  field_type TEXT NOT NULL CHECK (field_type IN ('signature', 'initials', 'text', 'date', 'checkbox', 'email', 'company', 'title', 'stamp')),
  page_number INTEGER NOT NULL DEFAULT 1,
  position_x DECIMAL NOT NULL, -- percentage coordinate (0-100)
  position_y DECIMAL NOT NULL, -- percentage coordinate (0-100)
  width DECIMAL NOT NULL DEFAULT 150,
  height DECIMAL NOT NULL DEFAULT 50,
  is_required BOOLEAN DEFAULT true,
  placeholder TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_template_fields_template_id ON template_fields(template_id);
CREATE INDEX idx_template_fields_role_id ON template_fields(role_id);

-- =====================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_fields ENABLE ROW LEVEL SECURITY;

-- Document Templates Policies
DROP POLICY IF EXISTS "Public can view templates" ON document_templates;
CREATE POLICY "Public can view templates" ON document_templates FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert templates" ON document_templates;
CREATE POLICY "Public can insert templates" ON document_templates FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update templates" ON document_templates;
CREATE POLICY "Public can update templates" ON document_templates FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public can delete templates" ON document_templates;
CREATE POLICY "Public can delete templates" ON document_templates FOR DELETE USING (true);

-- Template Roles Policies
DROP POLICY IF EXISTS "Public can view template roles" ON template_roles;
CREATE POLICY "Public can view template roles" ON template_roles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert template roles" ON template_roles;
CREATE POLICY "Public can insert template roles" ON template_roles FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update template roles" ON template_roles;
CREATE POLICY "Public can update template roles" ON template_roles FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public can delete template roles" ON template_roles;
CREATE POLICY "Public can delete template roles" ON template_roles FOR DELETE USING (true);

-- Template Fields Policies
DROP POLICY IF EXISTS "Public can view template fields" ON template_fields;
CREATE POLICY "Public can view template fields" ON template_fields FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert template fields" ON template_fields;
CREATE POLICY "Public can insert template fields" ON template_fields FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update template fields" ON template_fields;
CREATE POLICY "Public can update template fields" ON template_fields FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public can delete template fields" ON template_fields;
CREATE POLICY "Public can delete template fields" ON template_fields FOR DELETE USING (true);

-- =====================================================
-- 5. SEED DATA FOR DEMO
-- =====================================================
DO $$
DECLARE
  tpl_id UUID := 'e0000000-0000-0000-0000-000000000001';
  role_a_id UUID := 'e0000000-0000-0000-0000-000000000002';
  role_b_id UUID := 'e0000000-0000-0000-0000-000000000003';
BEGIN
  -- Insert template if not exists
  IF NOT EXISTS (SELECT 1 FROM document_templates WHERE id = tpl_id) THEN
    INSERT INTO document_templates (id, name, description, content_json, is_system, category)
    VALUES (
      tpl_id,
      'NDA Agreement (Role-Based Demo)',
      'Demonstrates the new Template Engine 2.0 with dynamic pre-placed roles (Discloser and Recipient) and automated e-signature layouts.',
      '{"text": "This Mutual Non-Disclosure Agreement is entered into on [Effective Date] by and between [Discloser Company] and [Recipient Company].\n\n1. Purpose\nThe parties wish to explore a business partnership and protect proprietary details.\n\n2. Signatures\nThe parties hereto agree to the terms and execute this agreement."}',
      true,
      'legal'
    );

    -- Insert roles
    INSERT INTO template_roles (id, template_id, role_name, signing_order, color)
    VALUES 
      (role_a_id, tpl_id, 'Discloser', 1, '#4f46e5'),
      (role_b_id, tpl_id, 'Recipient', 2, '#ec4899');

    -- Insert fields
    INSERT INTO template_fields (template_id, role_id, field_type, page_number, position_x, position_y, width, height, is_required)
    VALUES
      (tpl_id, role_a_id, 'signature', 1, 10.0, 75.0, 150, 50, true),
      (tpl_id, role_a_id, 'date', 1, 10.0, 83.0, 120, 35, true),
      (tpl_id, role_b_id, 'signature', 1, 55.0, 75.0, 150, 50, true),
      (tpl_id, role_b_id, 'date', 1, 55.0, 83.0, 120, 35, true);
  END IF;
END $$;

