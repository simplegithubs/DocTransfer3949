import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not found in environment variables');
}

export const supabase = createClient(
    supabaseUrl || '',
    supabaseAnonKey || '',
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
        },
    }
);

/**
 * Safely get the active Supabase JWT session token.
 * Can accept an optional token getter for backward compatibility.
 */
export const getSafeSupabaseToken = async (getToken?: () => Promise<string | null>): Promise<string | null> => {
    try {
        if (getToken) {
            const token = await getToken();
            if (token) return token;
        }
        const { data: { session } } = await supabase.auth.getSession();
        return session?.access_token || null;
    } catch (error) {
        console.error('Error fetching Supabase auth token:', error);
        return null;
    }
};

/**
 * Helper to get a Supabase client.
 * If a custom token is provided, creates a client configured with that Authorization header;
 * otherwise returns the shared singleton client which automatically tracks the active auth session.
 */
export const createSupabaseClient = (token?: string) => {
    if (!token) {
        return supabase;
    }
    return createClient(
        supabaseUrl || '',
        supabaseAnonKey || '',
        {
            auth: {
                persistSession: false,
            },
            global: {
                headers: { Authorization: `Bearer ${token}` },
            },
        }
    );
};
