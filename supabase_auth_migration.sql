-- ==============================================================================
-- Supabase Native Authentication Migration & RLS Security Policies
-- ==============================================================================
-- Run this script in your Supabase SQL Editor (Dashboard > SQL Editor) to ensure
-- Row Level Security (RLS) policies work seamlessly with native Supabase Auth.
-- ==============================================================================

-- 1. Create or update user_profiles table linked to Supabase auth.users
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop old conflicting policies if they exist
DROP POLICY IF EXISTS "Users can read their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.user_profiles;

CREATE POLICY "Users can read their own profile"
    ON public.user_profiles
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.user_profiles
    FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON public.user_profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- 2. Automatically sync new users from auth.users to public.user_profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', NULL)
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, user_profiles.full_name),
        avatar_url = COALESCE(EXCLUDED.avatar_url, user_profiles.avatar_url),
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT OR UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Update Subscriptions RLS Policies for Supabase Auth (auth.uid())
ALTER TABLE IF EXISTS public.subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own subscription" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscription" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can insert their own subscription" ON public.subscriptions;

CREATE POLICY "Users can view their own subscription"
    ON public.subscriptions
    FOR SELECT
    USING (auth.uid()::text = user_id OR auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own subscription"
    ON public.subscriptions
    FOR INSERT
    WITH CHECK (auth.uid()::text = user_id OR auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own subscription"
    ON public.subscriptions
    FOR UPDATE
    USING (auth.uid()::text = user_id OR auth.uid()::text = user_id::text);

-- 4. Update Documents RLS Policies for Supabase Auth
ALTER TABLE IF EXISTS public.documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can create their own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can update their own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can delete their own documents" ON public.documents;

CREATE POLICY "Users can view their own documents"
    ON public.documents
    FOR SELECT
    USING (auth.uid()::text = user_id OR auth.uid()::text = user_id::text);

CREATE POLICY "Users can create their own documents"
    ON public.documents
    FOR INSERT
    WITH CHECK (auth.uid()::text = user_id OR auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own documents"
    ON public.documents
    FOR UPDATE
    USING (auth.uid()::text = user_id OR auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own documents"
    ON public.documents
    FOR DELETE
    USING (auth.uid()::text = user_id OR auth.uid()::text = user_id::text);

-- 5. Update Document Templates RLS Policies
ALTER TABLE IF EXISTS public.document_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view system and their own templates" ON public.document_templates;
DROP POLICY IF EXISTS "Users can insert their own templates" ON public.document_templates;
DROP POLICY IF EXISTS "Users can update their own templates" ON public.document_templates;
DROP POLICY IF EXISTS "Users can delete their own templates" ON public.document_templates;

CREATE POLICY "Users can view system and their own templates"
    ON public.document_templates
    FOR SELECT
    USING (is_system = true OR created_by = auth.uid()::text);

CREATE POLICY "Users can insert their own templates"
    ON public.document_templates
    FOR INSERT
    WITH CHECK (created_by = auth.uid()::text);

CREATE POLICY "Users can update their own templates"
    ON public.document_templates
    FOR UPDATE
    USING (created_by = auth.uid()::text);

CREATE POLICY "Users can delete their own templates"
    ON public.document_templates
    FOR DELETE
    USING (created_by = auth.uid()::text);

-- ==============================================================================
-- Migration complete! Native Supabase Auth is now configured.
-- ==============================================================================
