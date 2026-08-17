import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import type { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export type AuthModalView = 'sign-in' | 'sign-up' | 'forgot-password';

export interface ExtendedUser {
    id: string;
    email?: string;
    fullName?: string;
    imageUrl?: string;
    primaryEmailAddress?: {
        emailAddress: string;
    };
    rawUser: User;
}

interface AuthContextType {
    user: ExtendedUser | null;
    rawUser: User | null;
    session: Session | null;
    loading: boolean;
    isAuthModalOpen: boolean;
    authModalView: AuthModalView;
    openAuthModal: (view?: AuthModalView) => void;
    closeAuthModal: () => void;
    signInWithPassword: (email: string, password: string) => Promise<{ error: AuthError | null }>;
    signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<{ error: AuthError | null; data: { user: User | null; session: Session | null } | null }>;
    signInWithOAuth: (provider: 'google' | 'github') => Promise<{ error: AuthError | null }>;
    signInWithOtp: (email: string) => Promise<{ error: AuthError | null }>;
    resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
    signOut: () => Promise<{ error: AuthError | null }>;
    getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [rawUser, setRawUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authModalView, setAuthModalView] = useState<AuthModalView>('sign-in');

    useEffect(() => {
        // 1. Initial session fetch
        let mounted = true;

        supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
            if (!mounted) return;
            setSession(initialSession);
            setRawUser(initialSession?.user ?? null);
            setLoading(false);
        }).catch((err) => {
            console.error('Error fetching initial auth session:', err);
            if (mounted) setLoading(false);
        });

        // 2. Real-time auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
            if (!mounted) return;
            setSession(currentSession);
            setRawUser(currentSession?.user ?? null);
            setLoading(false);
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const user: ExtendedUser | null = useMemo(() => {
        if (!rawUser) return null;
        const fullName = rawUser.user_metadata?.full_name || 
                         rawUser.user_metadata?.name || 
                         rawUser.email?.split('@')[0] || 
                         'User';
        const imageUrl = rawUser.user_metadata?.avatar_url || 
                         rawUser.user_metadata?.picture || 
                         undefined;

        return {
            id: rawUser.id,
            email: rawUser.email,
            fullName,
            imageUrl,
            primaryEmailAddress: rawUser.email ? { emailAddress: rawUser.email } : undefined,
            rawUser
        };
    }, [rawUser]);

    const openAuthModal = (view: AuthModalView = 'sign-in') => {
        setAuthModalView(view);
        setIsAuthModalOpen(true);
    };

    const closeAuthModal = () => {
        setIsAuthModalOpen(false);
    };

    const signInWithPassword = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error };
    };

    const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: metadata || {}
            }
        });
        return { error, data: data ? { user: data.user, session: data.session } : null };
    };

    const signInWithOAuth = async (provider: 'google' | 'github') => {
        const redirectTo = `${window.location.origin}/dataroom`;
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo
            }
        });
        return { error };
    };

    const signInWithOtp = async (email: string) => {
        const redirectTo = `${window.location.origin}/dataroom`;
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: redirectTo
            }
        });
        return { error };
    };

    const resetPassword = async (email: string) => {
        const redirectTo = `${window.location.origin}/settings`;
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo
        });
        return { error };
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        return { error };
    };

    const getToken = async (): Promise<string | null> => {
        if (!session) {
            const { data } = await supabase.auth.getSession();
            return data.session?.access_token || null;
        }
        return session.access_token;
    };

    const value = {
        user,
        rawUser,
        session,
        loading,
        isAuthModalOpen,
        authModalView,
        openAuthModal,
        closeAuthModal,
        signInWithPassword,
        signUp,
        signInWithOAuth,
        signInWithOtp,
        resetPassword,
        signOut,
        getToken
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const useUser = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useUser must be used within an AuthProvider');
    }
    return {
        user: context.user,
        isLoaded: !context.loading,
        isSignedIn: !!context.user
    };
};

export const SignedIn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading || !user) return null;
    return <>{children}</>;
};

export const SignedOut: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading || user) return null;
    return <>{children}</>;
};
