import React, { useEffect, useState } from 'react';
import Skeleton from '../ui/Skeleton';
import {
    Activity,
    PieChart as PieChartIcon,
    Clock,
    Users,
    Calendar,
    BarChart2,
    Globe,
    Monitor,
    Smartphone,
    Tablet,
    CheckCircle,
    TrendingUp,
    Zap,
    Mail,
    Download,
    ArrowLeft,
    Lock
} from 'lucide-react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { analyticsService } from '../../lib/analyticsService';
import type { ReceiverDownload, RealtimeStats } from '../../lib/analyticsService';
import DeviceStats from './DeviceStats';
import PageAttentionHeatmap from './PageAttentionHeatmap';
import ViewerGeoMap from './ViewerGeoMap';
import ConversionFunnel from './ConversionFunnel';
import './Analytics.css';

const exportToCSV = (data: ReceiverDownload[], docName?: string) => {
    const headers = ['Email', 'Downloaded At', 'IP Address', 'Device'];
    const rows = data.map(dl => {
        const ua = dl.user_agent || '';
        const isMobile = /mobile|android|iphone/i.test(ua);
        const isTablet = /tablet|ipad/i.test(ua);
        const deviceLabel = isTablet ? 'Tablet' : isMobile ? 'Mobile' : 'Desktop';
        return [
            dl.receiver_email,
            new Date(dl.downloaded_at).toLocaleString(),
            dl.ip_address || 'Unknown',
            deviceLabel
        ];
    });
    const csvContent = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${docName || 'document'}_downloads.csv`;
    a.click();
    URL.revokeObjectURL(url);
};

interface AnalyticsDashboardProps {
    documentId?: string;
    documentName?: string;
    onBack?: () => void;
}

// Country code to name mapping
const countryNames: Record<string, string> = {
    'IN': 'India', 'US': 'United States', 'JP': 'Japan', 'GB': 'United Kingdom',
    'UK': 'United Kingdom', 'DE': 'Germany', 'CA': 'Canada', 'AU': 'Australia',
    'FR': 'France', 'BR': 'Brazil', 'CN': 'China', 'RU': 'Russia', 'ES': 'Spain',
    'IT': 'Italy', 'NL': 'Netherlands', 'KR': 'South Korea', 'MX': 'Mexico',
    'SG': 'Singapore', 'AE': 'UAE', 'SA': 'Saudi Arabia', 'ZA': 'South Africa',
    'SE': 'Sweden', 'CH': 'Switzerland', 'PL': 'Poland', 'AT': 'Austria',
    'BE': 'Belgium', 'NO': 'Norway', 'DK': 'Denmark', 'FI': 'Finland',
    'IE': 'Ireland', 'NZ': 'New Zealand', 'PT': 'Portugal', 'HK': 'Hong Kong',
    'TW': 'Taiwan', 'TH': 'Thailand', 'ID': 'Indonesia', 'MY': 'Malaysia',
    'PH': 'Philippines', 'VN': 'Vietnam', 'PK': 'Pakistan', 'BD': 'Bangladesh',
    'NG': 'Nigeria', 'EG': 'Egypt', 'TR': 'Turkey', 'AR': 'Argentina',
    'CL': 'Chile', 'CO': 'Colombia', 'PE': 'Peru'
};

const getCountryName = (code: string | null | undefined): string => {
    if (!code) return 'Unknown';
    const upperCode = code.toUpperCase();
    return countryNames[upperCode] || code;
};

// Custom tooltip component
const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/95 backdrop-blur-md px-4 py-3 rounded-xl shadow-xl border border-gray-100/50">
                <p className="font-bold text-gray-900 mb-2">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                        <span className="text-gray-600">{entry.name}:</span>
                        <span className="font-bold text-gray-900">{entry.value}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants: any = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ documentId, documentName, onBack }) => {
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState<number>(30);
    const [activeMetric, setActiveMetric] = useState<'all' | 'views' | 'devices' | 'pages' | 'locations' | 'hours' | 'completion' | 'downloads'>('all');
    const [isLive, setIsLive] = useState(true);

    // Data states
    const [dailyStats, setDailyStats] = useState<any[]>([]);
    const [pageAttention, setPageAttention] = useState<any[]>([]);
    const [geoStats, setGeoStats] = useState<any[]>([]);
    const [deviceStats, setDeviceStats] = useState<any[]>([]);
    const [funnelData, setFunnelData] = useState<any[]>([]);
    const [receiverDownloads, setReceiverDownloads] = useState<ReceiverDownload[]>([]);
    const [downloadCount, setDownloadCount] = useState<number>(0);
    const [realtimeStats, setRealtimeStats] = useState<RealtimeStats>({
        link_opens: 0,
        unique_viewers: 0,
        avg_time_seconds: 0,
        engagement_score: 0
    });
    const [hourlyStats, setHourlyStats] = useState<any[]>([]);
    const [completionStats, setCompletionStats] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    useEffect(() => {
        if (!documentId) return;
        fetchData();

        const sessionSub = analyticsService.subscribeToSessions(documentId, () => { fetchData(); setLastUpdated(new Date()); });
        const viewSub = analyticsService.subscribeToViews(documentId, () => { fetchData(); setLastUpdated(new Date()); });
        const downloadSub = analyticsService.subscribeToDownloads(documentId, () => { fetchData(); setLastUpdated(new Date()); });

        const interval = isLive ? setInterval(() => { fetchData(); setLastUpdated(new Date()); }, 30000) : null;

        return () => {
            sessionSub.unsubscribe(); viewSub.unsubscribe(); downloadSub.unsubscribe();
            if (interval) clearInterval(interval);
        };
    }, [documentId, timeRange, isLive]);

    const fetchData = async () => {
        if (!documentId) return;
        setLoading(true); setError(null);
        try {
            const [daily, pages, geo, devices, funnel, downloads, dlCount, rtStats, hourly, completion] = await Promise.all([
                analyticsService.getDailyStats(documentId, timeRange),
                analyticsService.getPageAttention(documentId),
                analyticsService.getGeoStats(documentId),
                analyticsService.getDeviceStats(documentId),
                analyticsService.getConversionFunnel(documentId),
                analyticsService.getReceiverDownloads(documentId),
                analyticsService.getDownloadCount(documentId),
                analyticsService.getRealtimeStats(documentId),
                analyticsService.getHourlyStats(documentId),
                analyticsService.getCompletionStats(documentId)
            ]);

            setDailyStats(Array.isArray(daily) ? daily : []);
            setPageAttention(Array.isArray(pages) ? pages : []);
            setGeoStats(Array.isArray(geo) ? geo : []);
            setDeviceStats(Array.isArray(devices) ? devices : []);
            setFunnelData(Array.isArray(funnel) ? funnel : []);
            setReceiverDownloads(Array.isArray(downloads) ? downloads : []);
            setDownloadCount(typeof dlCount === 'number' ? dlCount : (Array.isArray(downloads) ? downloads.length : 0));
            setRealtimeStats(rtStats);
            setHourlyStats(Array.isArray(hourly) ? hourly : []);
            setCompletionStats(Array.isArray(completion) ? completion : []);
        } catch (error: any) {
            console.error('Failed to fetch analytics:', error);
            setError(error.message || 'Failed to load analytics data. Please ensure database views are created.');
        } finally {
            setLoading(false);
        }
    };

    const safeDailyStats = Array.isArray(dailyStats) ? dailyStats : [];
    const totalViews = safeDailyStats.reduce((acc, curr) => acc + (curr.total_views || 0), 0);
    const totalLinkOpens = realtimeStats.link_opens;
    const uniqueViewers = realtimeStats.unique_viewers;
    const avgDuration = Math.round(realtimeStats.avg_time_seconds);
    const engagement = Math.round(realtimeStats.engagement_score);

    const prepareUnifiedData = () => {
        const data: any[] = [];
        const viewsData = dailyStats.slice(-7).map((stat) => ({ category: 'Views', label: new Date(stat.stat_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), value: stat.total_views, type: 'views' }));
        const devicesData = deviceStats.map((device) => ({ category: 'Devices', label: device.device_type ? device.device_type.charAt(0).toUpperCase() + device.device_type.slice(1) : 'Unknown', value: device.session_count, type: 'devices' }));
        const pagesData = pageAttention.slice(0, 5).map((page) => ({ category: 'Pages', label: `Page ${page.page_number}`, value: Math.round(page.avg_duration_seconds), type: 'pages' }));
        const locationsData = (Array.isArray(geoStats) ? geoStats : []).slice(0, 5).map((geo) => ({ category: 'Locations', label: getCountryName(geo.country_code), value: geo.session_count || 0, type: 'locations' }));
        
        // Real Hourly Views mapping
        const hoursMap: Record<string, number> = {};
        for (let i = 0; i < 24; i++) {
            const h = i.toString().padStart(2, '0') + ':00';
            hoursMap[h] = 0;
        }
        hourlyStats.forEach(stat => {
            if (stat.hour_label in hoursMap) {
                hoursMap[stat.hour_label] = stat.view_count;
            }
        });
        const hoursData = Object.entries(hoursMap).map(([hour, count]) => ({
            category: 'Hours',
            label: hour,
            value: count,
            type: 'hours'
        }));

        // Real Completion Status mapping
        const completionMap: Record<string, number> = {
            'Completed': 0,
            'Pending': 0,
            'Dropped': 0
        };
        completionStats.forEach(stat => {
            if (stat.completion_status in completionMap) {
                completionMap[stat.completion_status] = stat.status_count;
            }
        });
        const completionData = [
            { category: 'Status', label: 'Completed', value: completionMap['Completed'], type: 'completion' },
            { category: 'Status', label: 'Pending', value: completionMap['Pending'], type: 'completion' },
            { category: 'Status', label: 'Dropped', value: completionMap['Dropped'], type: 'completion' }
        ];


        if (activeMetric === 'all') { data.push(...viewsData, ...devicesData, ...pagesData, ...locationsData, ...hoursData, ...completionData); }
        else if (activeMetric === 'views') { data.push(...viewsData); }
        else if (activeMetric === 'devices') { data.push(...devicesData); }
        else if (activeMetric === 'pages') { data.push(...pagesData); }
        else if (activeMetric === 'locations') { data.push(...locationsData); }
        else if (activeMetric === 'hours') { data.push(...hoursData); }
        else if (activeMetric === 'completion') { data.push(...completionData); }
        else if (activeMetric === 'downloads') {
            const downloadsData = dailyStats.slice(-7).map((stat) => ({ category: 'Downloads', label: new Date(stat.stat_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), value: stat.total_downloads || 0, type: 'downloads' }));
            data.push(...downloadsData);
        }
        return data;
    };

    const getBarColor = (type: string) => {
        switch (type) {
            case 'views': return 'url(#gradViews)';
            case 'devices': return 'url(#gradDevices)';
            case 'pages': return 'url(#gradPages)';
            case 'locations': return 'url(#gradLocations)';
            case 'hours': return 'url(#gradHours)';
            case 'completion': return 'url(#gradCompletion)';
            case 'downloads': return 'url(#gradDownloads)';
            default: return 'url(#gradViews)';
        }
    };

    const chartData = prepareUnifiedData();

    if (!documentId) {
        return (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center p-12 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/40 shadow-xl min-h-[400px]">
                <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl shadow-indigo-500/30">
                    <BarChart2 size={48} className="text-white" />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Select a Document</h3>
                <p className="text-gray-500 text-center max-w-md text-lg">Choose a document from your library to view comprehensive real-time analytics.</p>
                {onBack && (
                    <button onClick={onBack} className="mt-8 flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-2xl text-gray-700 font-bold hover:bg-gray-50 hover:scale-105 transition-all shadow-sm">
                        <ArrowLeft size={18} /> Back to Documents
                    </button>
                )}
            </motion.div>
        );
    }

    if (error) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 bg-white/80 backdrop-blur-lg rounded-3xl border border-red-100 shadow-xl text-center">
                <div className="w-20 h-20 bg-red-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                    <Lock size={40} className="text-red-500" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">Analytics Missing</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
                    The analytics database views are not yet set up or are missing permissions. 
                    Please run the <strong>master_analytics_setup.sql</strong> script in your Supabase SQL Editor to fix this.
                </p>
                <div className="flex flex-col gap-4 max-w-sm mx-auto">
                    <button onClick={fetchData} className="px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-bold hover:shadow-lg hover:scale-105 transition-all">
                        Retry Loading
                    </button>
                    <button onClick={onBack} className="px-6 py-4 bg-gray-50 text-gray-600 rounded-2xl font-bold hover:bg-gray-100 transition-colors">
                        Back to Documents
                    </button>
                </div>
                <div className="mt-8 p-4 bg-red-50/50 rounded-2xl text-left font-mono text-xs text-red-600 overflow-auto border border-red-100">
                    <strong>Technical Error:</strong> {error}
                </div>
            </motion.div>
        );
    }

    if (loading && !dailyStats.length) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    {onBack && <Skeleton width="48px" height="48px" borderRadius="16px" />}
                    <Skeleton width="300px" height="2rem" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 border border-gray-100/50">
                            <Skeleton width="80px" height="1rem" style={{ marginBottom: '1rem', display: 'block' }} />
                            <Skeleton width="80px" height="2.5rem" style={{ marginBottom: '0.5rem', display: 'block' }} />
                            <Skeleton width="60px" height="0.75rem" />
                        </div>
                    ))}
                </div>
                <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-100/50">
                    <Skeleton width="250px" height="1.5rem" style={{ marginBottom: '2rem', display: 'block' }} />
                    <Skeleton width="100%" height="400px" borderRadius="24px" />
                </div>
            </div>
        );
    }

    return (
        <motion.div initial="hidden" animate="show" variants={containerVariants} className="analytics-dashboard-theme">
            {/* Header */}
            <motion.div variants={itemVariants} className="flex flex-wrap justify-between items-center gap-4 bg-white/60 backdrop-blur-xl p-4 rounded-3xl border border-white/40 shadow-sm">
                <div>
                    <div className="flex items-center gap-4">
                        {onBack && (
                            <button onClick={onBack} className="p-3 bg-white hover:bg-gray-50 rounded-2xl transition-all shadow-sm border border-gray-100 group" title="Back to Documents">
                                <ArrowLeft size={20} className="text-gray-500 group-hover:text-gray-900 transition-colors" />
                            </button>
                        )}
                        <div>
                            {documentName && (
                                <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 mb-0.5 tracking-wide uppercase">Analytics for: {documentName}</p>
                            )}
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Unified Analytics</h2>
                        </div>
                        {isLive && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full ml-2">
                                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                <span className="text-emerald-700 text-xs font-bold uppercase tracking-wider">Live</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsLive(!isLive)}
                        className={`px-5 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 ${isLive
                            ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 hover:scale-105'
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <Zap size={18} className={isLive ? "fill-white" : ""} />
                        {isLive ? 'Live Mode' : 'Paused'}
                    </button>
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(Number(e.target.value))}
                        className="px-5 py-3 rounded-2xl border border-gray-200 bg-white text-gray-700 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow appearance-none cursor-pointer"
                    >
                        <option value={7}>Last 7 Days</option>
                        <option value={30}>Last 30 Days</option>
                        <option value={90}>Last 3 Months</option>
                    </select>
                    <button
                        onClick={() => fetchData()}
                        className="p-3 bg-white border border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        <Calendar size={20} />
                    </button>
                </div>
            </motion.div>

            {/* Summary Cards */}
            <motion.div variants={containerVariants} className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <motion.div variants={itemVariants} className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 rounded-3xl text-white relative overflow-hidden group shadow-xl shadow-indigo-500/20">
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors duration-500"></div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
                            <Users size={20} className="text-indigo-100" />
                        </div>
                        <span className="text-indigo-100 text-sm font-bold tracking-wide uppercase">Link Opens</span>
                    </div>
                    <div className="text-4xl font-black tracking-tight">{totalLinkOpens}</div>
                    <div className="text-indigo-200 text-xs mt-2 font-medium">Total link clicks</div>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-3xl text-white relative overflow-hidden group shadow-xl shadow-emerald-500/20">
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors duration-500"></div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
                            <PieChartIcon size={20} className="text-emerald-100" />
                        </div>
                        <span className="text-emerald-100 text-sm font-bold tracking-wide uppercase">Unique Viewers</span>
                    </div>
                    <div className="text-4xl font-black tracking-tight">{uniqueViewers}</div>
                    <div className="text-emerald-200 text-xs mt-2 font-medium">Unique sessions</div>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-gradient-to-br from-amber-500 to-orange-500 p-6 rounded-3xl text-white relative overflow-hidden group shadow-xl shadow-orange-500/20">
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors duration-500"></div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
                            <Clock size={20} className="text-orange-100" />
                        </div>
                        <span className="text-orange-100 text-sm font-bold tracking-wide uppercase">Avg. Time</span>
                    </div>
                    <div className="text-4xl font-black tracking-tight">{avgDuration}s</div>
                    <div className="text-orange-200 text-xs mt-2 font-medium">Per session</div>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-gradient-to-br from-violet-500 to-purple-600 p-6 rounded-3xl text-white relative overflow-hidden group shadow-xl shadow-purple-500/20">
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors duration-500"></div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
                            <Activity size={20} className="text-purple-100" />
                        </div>
                        <span className="text-purple-100 text-sm font-bold tracking-wide uppercase">Engagement</span>
                    </div>
                    <div className="text-4xl font-black tracking-tight">{engagement}%</div>
                    <div className="text-purple-200 text-xs mt-2 font-medium">Time-based score</div>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-gradient-to-br from-pink-500 to-rose-500 p-6 rounded-3xl text-white relative overflow-hidden group shadow-xl shadow-pink-500/20">
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors duration-500"></div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
                            <Download size={20} className="text-pink-100" />
                        </div>
                        <span className="text-pink-100 text-sm font-bold tracking-wide uppercase">Downloads</span>
                    </div>
                    <div className="text-4xl font-black tracking-tight">{downloadCount}</div>
                    <div className="text-pink-200 text-xs mt-2 font-medium">With email captured</div>
                </motion.div>
            </motion.div>

            {/* Metric Filter Pills */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
                {[
                    { key: 'all', label: 'All Metrics', icon: BarChart2, colorClass: 'bg-indigo-500 shadow-indigo-500/30' },
                    { key: 'views', label: 'Views', icon: TrendingUp, colorClass: 'bg-indigo-500 shadow-indigo-500/30' },
                    { key: 'devices', label: 'Devices', icon: Monitor, colorClass: 'bg-emerald-500 shadow-emerald-500/30' },
                    { key: 'pages', label: 'Pages', icon: Activity, colorClass: 'bg-violet-500 shadow-violet-500/30' },
                    { key: 'locations', label: 'Locations', icon: Globe, colorClass: 'bg-orange-500 shadow-orange-500/30' },
                    { key: 'hours', label: 'By Hour', icon: Clock, colorClass: 'bg-blue-500 shadow-blue-500/30' },
                    { key: 'completion', label: 'Status', icon: CheckCircle, colorClass: 'bg-teal-500 shadow-teal-500/30' },
                    { key: 'downloads', label: 'Downloads', icon: Download, colorClass: 'bg-pink-500 shadow-pink-500/30' }
                ].map((filter) => {
                    const isActive = activeMetric === filter.key;
                    return (
                        <button
                            key={filter.key}
                            onClick={() => setActiveMetric(filter.key as any)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all relative overflow-hidden group ${isActive
                                ? `${filter.colorClass} text-white shadow-lg scale-105`
                                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                                }`}
                        >
                            {isActive && <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-colors pointer-events-none"></div>}
                            <filter.icon size={16} className="relative z-10" />
                            <span className="relative z-10">{filter.label}</span>
                        </button>
                    )
                })}
            </motion.div>

            {/* Unified Chart / Sub-Component Views */}
            <motion.div variants={itemVariants} style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(24px)', padding: '2rem', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.4)', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
                    <div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#111827', letterSpacing: '-0.025rem' }}>
                            {activeMetric === 'all' ? 'Complete Analytics Overview' :
                                activeMetric === 'views' ? 'Views Over Time' :
                                    activeMetric === 'devices' ? 'Device Distribution' :
                                        activeMetric === 'pages' ? 'Page Attention (seconds)' :
                                            activeMetric === 'locations' ? 'Top Locations' :
                                                activeMetric === 'hours' ? 'Views by Hour' :
                                                    activeMetric === 'completion' ? 'Conversion Funnel' :
                                                        activeMetric === 'downloads' ? 'Downloads Over Time' :
                                                            'Document Completion Status'}
                        </h3>
                        <p style={{ color: '#6b7280', fontWeight: 500, marginTop: '0.25rem' }}>Real-time data visualization</p>
                    </div>
                    {(activeMetric === 'all' || activeMetric === 'views' || activeMetric === 'hours' || activeMetric === 'downloads') && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', background: 'rgba(249,250,251,0.5)', padding: '0.5rem 1rem', borderRadius: '1rem', border: '1px solid rgba(243,244,246,0.5)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ width: '0.75rem', height: '0.75rem', borderRadius: '9999px', background: 'linear-gradient(90deg, #6366f1, #a855f7)' }}></div>
                                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#4b5563' }}>Views</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ width: '0.75rem', height: '0.75rem', borderRadius: '9999px', background: 'linear-gradient(90deg, #10b981, #14b8a6)' }}></div>
                                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#4b5563' }}>Devices</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ width: '0.75rem', height: '0.75rem', borderRadius: '9999px', background: 'linear-gradient(90deg, #f97316, #f59e0b)' }}></div>
                                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#4b5563' }}>Locations</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Conditionally render sub-components or bar chart */}
                {activeMetric === 'devices' ? (
                    <DeviceStats data={deviceStats} />
                ) : activeMetric === 'pages' ? (
                    <PageAttentionHeatmap data={pageAttention} />
                ) : activeMetric === 'locations' ? (
                    <ViewerGeoMap data={geoStats} />
                ) : activeMetric === 'completion' ? (
                    <ConversionFunnel data={funnelData} />
                ) : (
                    <div style={{ height: '450px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={chartData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                                barCategoryGap="15%"
                            >
                                <defs>
                                    <linearGradient id="gradViews" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#818cf8" stopOpacity={0.5} />
                                    </linearGradient>
                                    <linearGradient id="gradDevices" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#34d399" stopOpacity={0.5} />
                                    </linearGradient>
                                    <linearGradient id="gradPages" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.5} />
                                    </linearGradient>
                                    <linearGradient id="gradLocations" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#f97316" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#fb923c" stopOpacity={0.5} />
                                    </linearGradient>
                                    <linearGradient id="gradHours" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.5} />
                                    </linearGradient>
                                    <linearGradient id="gradCompletion" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#14b8a6" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#2dd4bf" stopOpacity={0.5} />
                                    </linearGradient>
                                    <linearGradient id="gradDownloads" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#ec4899" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#f472b6" stopOpacity={0.5} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis
                                    dataKey="label"
                                    stroke="#9ca3af"
                                    tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 600 }}
                                    axisLine={false}
                                    tickLine={false}
                                    angle={-45}
                                    textAnchor="end"
                                    height={80}
                                    interval={0}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="#9ca3af"
                                    tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 600 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.05)', radius: 8 }} />
                                <Bar
                                    dataKey="value"
                                    name="Value"
                                    radius={[8, 8, 0, 0]}
                                    maxBarSize={50}
                                    animationDuration={1500}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={getBarColor(entry.type)} className="hover:opacity-80 transition-opacity" />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </motion.div>

            {/* Quick Stats Grid */}
            <motion.div variants={containerVariants} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {/* Device Icons */}
                {deviceStats.slice(0, 3).map((device, index) => (
                    <motion.div variants={itemVariants} key={`dev-${index}`} className="bg-white/80 backdrop-blur-lg p-5 rounded-3xl border border-gray-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/10 transition-all group">
                        <div className="flex flex-col items-center text-center gap-3">
                            <div className="p-3 bg-gray-50 group-hover:bg-indigo-50 rounded-2xl transition-colors">
                                {device.device_type === 'desktop' ? <Monitor size={28} className="text-emerald-500" /> :
                                    device.device_type === 'mobile' ? <Smartphone size={28} className="text-blue-500" /> :
                                        <Tablet size={28} className="text-violet-500" />}
                            </div>
                            <div>
                                <div className="text-2xl font-black text-gray-900 tracking-tight">{device.session_count}</div>
                                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">{device.device_type || 'Unknown'}</div>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {/* Top Countries */}
                {geoStats.slice(0, 3).map((geo, index) => (
                    <motion.div variants={itemVariants} key={`geo-${index}`} className="bg-white/80 backdrop-blur-lg p-5 rounded-3xl border border-gray-100 hover:border-orange-100 hover:shadow-xl hover:shadow-orange-500/10 transition-all group">
                        <div className="flex flex-col items-center text-center gap-3">
                            <div className="p-3 bg-gray-50 group-hover:bg-orange-50 rounded-2xl transition-colors">
                                <Globe size={28} className="text-orange-500" />
                            </div>
                            <div>
                                <div className="text-2xl font-black text-gray-900 tracking-tight">{geo.session_count}</div>
                                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1 truncate max-w-[80px]" title={getCountryName(geo.country_code)}>
                                    {getCountryName(geo.country_code)}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Receiver Downloads Section */}
            <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-white/40 shadow-xl shadow-gray-200/50">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg shadow-pink-500/30">
                            <Mail size={24} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Receiver Downloads</h3>
                            <p className="text-gray-500 font-medium mt-1">
                                {receiverDownloads.length} {receiverDownloads.length === 1 ? 'person has' : 'people have'} downloaded this file
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {receiverDownloads.length > 0 && (
                            <button
                                onClick={() => exportToCSV(receiverDownloads, documentName)}
                                className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-2xl text-gray-700 font-bold hover:bg-gray-50 hover:scale-105 transition-all shadow-sm"
                            >
                                <Download size={18} />
                                Export CSV
                            </button>
                        )}
                        <div className="px-5 py-3 bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-100 rounded-2xl flex items-center gap-2">
                            <span className="text-pink-600 font-black text-xl">{receiverDownloads.length}</span>
                            <span className="text-pink-500 text-sm font-bold uppercase tracking-wider">total</span>
                        </div>
                    </div>
                </div>

                {receiverDownloads.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-rose-100 rounded-[2rem] flex items-center justify-center mb-6">
                            <Mail size={40} className="text-pink-400" />
                        </div>
                        <p className="text-gray-900 font-black text-xl mb-2 tracking-tight">No downloads yet</p>
                        <p className="text-gray-500 text-lg max-w-md">
                            When a receiver opens your share link and clicks <strong>Download</strong>, their email will appear here.
                        </p>
                        <div className="mt-6 flex items-center gap-2 px-5 py-3 bg-indigo-50 border border-indigo-100 rounded-2xl text-indigo-600 text-sm font-bold">
                            <TrendingUp size={16} />
                            Share your link to start tracking
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-3xl border border-gray-100 shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gradient-to-r from-pink-50/50 to-rose-50/50 border-b border-pink-100/50">
                                    <th className="py-5 px-6 text-xs font-black text-pink-800 uppercase tracking-widest w-1/3">Email</th>
                                    <th className="py-5 px-6 text-xs font-black text-pink-800 uppercase tracking-widest w-1/3">Downloaded At</th>
                                    <th className="py-5 px-6 text-xs font-black text-pink-800 uppercase tracking-widest w-1/3">Device</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                <AnimatePresence>
                                    {receiverDownloads.map((dl, index) => {
                                        const ua = dl.user_agent || '';
                                        const isMobile = /mobile|android|iphone/i.test(ua);
                                        const isTablet = /tablet|ipad/i.test(ua);
                                        const deviceLabel = isTablet ? 'Tablet' : isMobile ? 'Mobile' : 'Desktop';
                                        const browserMatch = ua.match(/(Chrome|Firefox|Safari|Edge|Opera|OPR)/i);
                                        const browserName = browserMatch ? browserMatch[1].replace('OPR', 'Opera') : 'Unknown';

                                        return (
                                            <motion.tr
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                key={dl.id}
                                                className="hover:bg-pink-50/30 transition-colors group"
                                            >
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-black text-lg shadow-sm group-hover:scale-110 transition-transform">
                                                            {dl.receiver_email.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="font-bold text-gray-900 group-hover:text-pink-700 transition-colors">
                                                            {dl.receiver_email}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-sm font-medium text-gray-500">
                                                    {new Date(dl.downloaded_at).toLocaleString()}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide ${
                                                        isMobile ? 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20' : 
                                                        isTablet ? 'bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-600/20' : 
                                                        'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
                                                    }`}>
                                                        {deviceLabel} <span className="opacity-50">•</span> {browserName}
                                                    </span>
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

export default AnalyticsDashboard;
