import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not found in environment variables');
}

export const supabase = createClient(
    supabaseUrl || '',
    supabaseAnonKey || ''
);

/**
 * Safely get a Supabase token from Clerk, handling missing template errors
 */
export const getSafeSupabaseToken = async (getToken: (options?: { template?: string }) => Promise<string | null>) => {
    try {
        // Attempt to get the dedicated Supabase template
        const token = await getToken({ template: 'supabase' });
        
        // CRITICAL FIX: If the token is RS256 (starts with eyJhbGciOiJSUzI1NiI), 
        // Supabase will reject it with "'alg' (Algorithm) Header Parameter value not allowed".
        // This happens if the Clerk template is misconfigured or using default signing.
        if (token && token.startsWith('eyJhbGciOiJSUzI1NiI')) {
            console.error(
                "CLERK CONFIGURATION ERROR: Your 'supabase' JWT template is using RS256, but Supabase requires HS256. " +
                "1. Go to Clerk Dashboard > JWT Templates > 'supabase'. " +
                "2. Change the signing algorithm to HS256. " +
                "3. Ensure the signing key is your Supabase JWT Secret."
            );
            return null; // Fallback to anonymous access to prevent the hard 'alg' error
        }
        
        return token;
    } catch (error: any) {
        // If template doesn't exist, avoid falling back to the default Clerk token (which is RS256)
        if (error.message?.includes('No JWT template exists')) {
            console.warn(
                "CLERK SETUP REQUIRED: Please create a JWT template named 'supabase' in your Clerk Dashboard. " +
                "Using anonymous access for now to prevent 'alg' errors."
            );
            return null;
        }
        throw error;
    }
};

/**
 * Helper to create a Supabase client with a custom JWT token (e.g., from Clerk)
 * This allows RLS policies to work correctly.
 */
export const createSupabaseClient = (token?: string) => {
    return createClient(
        supabaseUrl || '',
        supabaseAnonKey || '',
        {
            global: {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            },
        }
    );
};
