import { supabase } from './supabase';

export interface DailyStat {
    stat_date: string;
    total_views: number;
    total_link_opens: number;
    unique_viewers: number;
    avg_duration_seconds: number;
    engagement_score: number;
    total_downloads: number;
}

export interface PageAttention {
    page_number: number;
    avg_duration_seconds: number;
    total_views: number;
}

export interface GeoStat {
    country_code: string;
    city: string;
    session_count: number;
}

export interface RealtimeStats {
    link_opens: number;
    unique_viewers: number;
    avg_time_seconds: number;
    engagement_score: number;
}

export interface DeviceStat {
    device_type: string;
    browser_name: string;
    session_count: number;
}

export interface FunnelStep {
    step_name: string;
    step_order: number;
    count: number;
    description: string;
}

export interface ReceiverDownload {
    id: string;
    document_id: string;
    receiver_email: string;
    downloaded_at: string;
    ip_address: string;
    user_agent: string;
}

export const analyticsService = {
    /**
     * Get daily statistics for a document
     */
    async getDailyStats(documentId: string, days: number = 30): Promise<DailyStat[]> {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const { data, error } = await supabase
            .from('daily_document_stats')
            .select('*')
            .eq('document_id', documentId)
            .gte('stat_date', startDate.toISOString())
            .order('stat_date', { ascending: true });

        if (error) throw error;
        return data || [];
    },

    /**
     * Get page attention heatmap data
     */
    async getPageAttention(documentId: string): Promise<PageAttention[]> {
        const { data, error } = await supabase
            .from('page_attention_stats')
            .select('*')
            .eq('document_id', documentId)
            .order('page_number', { ascending: true });

        if (error) throw error;
        return data || [];
    },

    /**
     * Get geographic distribution of viewers
     */
    async getGeoStats(documentId: string): Promise<GeoStat[]> {
        const { data, error } = await supabase
            .from('viewer_geo_stats')
            .select('*')
            .eq('document_id', documentId);

        if (error) throw error;
        return data || [];
    },

    /**
     * Get device and browser statistics
     */
    async getDeviceStats(documentId: string): Promise<DeviceStat[]> {
        const { data, error } = await supabase
            .from('device_analytics_stats')
            .select('*')
            .eq('document_id', documentId);

        if (error) throw error;
        return data || [];
    },

    /**
     * Get conversion funnel data
     */
    async getConversionFunnel(documentId: string): Promise<FunnelStep[]> {
        const { data, error } = await supabase
            .rpc('get_document_conversion_funnel', { p_document_id: documentId });

        if (error) throw error;
        return data || [];
    },

    /**
     * Subscribe to real-time session updates
     */
    subscribeToSessions(documentId: string, callback: (payload: any) => void) {
        return supabase
            .channel(`analytics-sessions-${documentId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'document_access_sessions',
                    filter: `document_id=eq.${documentId}`
                },
                callback
            )
            .subscribe();
    },

    /**
     * Subscribe to real-time view updates
     */
    subscribeToViews(documentId: string, callback: (payload: any) => void) {
        return supabase
            .channel(`analytics-views-${documentId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'document_view_tracking',
                    filter: `document_id=eq.${documentId}`
                },
                callback
            )
            .subscribe();
    },

    /**
     * Get receiver download records for a document
     */
    async getReceiverDownloads(documentId: string): Promise<ReceiverDownload[]> {
        const { data, error } = await supabase
            .from('document_downloads')
            .select('*')
            .eq('document_id', documentId)
            .order('downloaded_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    /**
     * Subscribe to real-time download events
     */
    subscribeToDownloads(documentId: string, callback: (payload: any) => void) {
        return supabase
            .channel(`analytics-downloads-${documentId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'document_downloads',
                    filter: `document_id=eq.${documentId}`
                },
                callback
            )
            .subscribe();
    },

    /**
     * Get total download count for a document (efficient count-only query)
     */
    async getDownloadCount(documentId: string): Promise<number> {
        const { count, error } = await supabase
            .from('document_downloads')
            .select('*', { count: 'exact', head: true })
            .eq('document_id', documentId);
        if (error) throw error;
        return count || 0;
    },

    /**
     * Get absolute real-time summary stats for a document
     */
    async getRealtimeStats(documentId: string): Promise<RealtimeStats> {
        const { data, error } = await supabase
            .rpc('get_realtime_document_stats', { p_document_id: documentId });

        if (error) throw error;
        return data && data[0] ? data[0] : {
            link_opens: 0,
            unique_viewers: 0,
            avg_time_seconds: 0,
            engagement_score: 0
        };
    }
};
