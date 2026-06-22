import React, { useEffect, useState } from 'react';
import {
    Clock,
    Shield,
    FileText,
    Download,
    Eye,
    Globe,
    Search,
    RefreshCw,
    PenTool,
    Calendar,
    User,
    Filter,
    Smartphone,
    Monitor
} from 'lucide-react';
import { fetchAuditLogs, exportAuditLogs } from '../lib/auditLogger';
import Skeleton from './ui/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import './AuditTrail.css';

interface AuditLog {
    id: string;
    event_type: string;
    event_timestamp: string;
    document_name?: string;
    signer_name?: string;
    user_email?: string;
    ip_address?: string;
    city?: string;
    country?: string;
    user_agent?: string;
    event_metadata?: any;
}

interface AuditTrailProps {
    documentId?: string | string[]; // Optional: if provided, filters by specific document(s)
}

const AuditTrail: React.FC<AuditTrailProps> = ({ documentId }) => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [filterType, setFilterType] = useState<string>('all');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [userFilter, setUserFilter] = useState<string>('');
    const [showFilters, setShowFilters] = useState(false);

    const loadLogs = async () => {
        setLoading(true);
        setError(null);
        try {
            const filters = {
                eventType: filterType !== 'all' ? filterType : undefined,
                startDate: startDate || undefined,
                endDate: endDate || undefined,
                userEmail: userFilter || undefined
            };

            const { data, error: fetchError } = await fetchAuditLogs(documentId, filters);

            if (fetchError) {
                setError(fetchError);
            } else {
                setLogs(data);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to load audit logs');
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        setExporting(true);
        try {
            const filters = {
                eventType: filterType !== 'all' ? filterType : undefined,
                startDate: startDate || undefined,
                endDate: endDate || undefined,
                userEmail: userFilter || undefined
            };

            await exportAuditLogs(documentId, filters);
        } catch (err) {
            console.error('Export failed', err);
            alert('Failed to export logs');
        } finally {
            setExporting(false);
        }
    };

    useEffect(() => {
        loadLogs();
        // Auto-refresh every 30 seconds
        const interval = setInterval(loadLogs, 30000);
        return () => clearInterval(interval);
    }, [documentId, filterType, startDate, endDate]);

    const getDeviceIcon = (ua?: string) => {
        if (!ua) return <Globe size={14} />;
        if (ua.includes('Mobile') || ua.includes('Android') || ua.includes('iPhone')) return <Smartphone size={14} />;
        return <Monitor size={14} />;
    };

    const getBrowserName = (ua?: string) => {
        if (!ua) return 'Unknown Device';
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Safari')) return 'Safari';
        if (ua.includes('Edge')) return 'Edge';
        return 'Web Browser';
    };

    const getEventIcon = (type: string) => {
        if (type.includes('view')) return <Eye size={16} />;
        if (type.includes('download')) return <Download size={16} />;
        if (type.includes('upload')) return <FileText size={16} />;
        if (type.includes('signature')) return <PenTool size={16} />;
        if (type.includes('security') || type.includes('password') || type.includes('failed')) return <Shield size={16} />;
        return <Clock size={16} />;
    };

    const getBadgeClass = (type: string) => {
        if (type.includes('view')) return 'audit-badge-view';
        if (type.includes('download')) return 'audit-badge-download';
        if (type.includes('upload')) return 'audit-badge-upload';
        if (type.includes('signature')) return 'audit-badge-signature';
        if (type.includes('security') || type.includes('password') || type.includes('failed')) return 'audit-badge-security';
        return 'audit-badge-default';
    }

    const getEventLabel = (type: string) => {
        return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div initial="hidden" animate="show" variants={containerVariants} className="audit-trail-theme">
            {/* Header & Controls */}
            <motion.div variants={itemVariants} className="audit-header">
                <div>
                    <h2 className="audit-title">
                        <Shield size={24} color="#4f46e5" />
                        Cryptographic Audit Trail
                    </h2>
                    <p className="audit-subtitle">
                        Comprehensive, compliance-ready activity log and security timeline.
                    </p>
                </div>
                <div className="audit-controls">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`audit-btn ${showFilters ? 'audit-btn-active' : 'audit-btn-outline'}`}
                    >
                        <Filter size={16} /> Filters
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={exporting}
                        className="audit-btn audit-btn-primary"
                    >
                        <Download size={16} /> {exporting ? 'Exporting...' : 'Export CSV'}
                    </button>
                    <button
                        onClick={loadLogs}
                        className="audit-btn-icon"
                        title="Refresh Logs"
                    >
                        <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                    </button>
                </div>
            </motion.div>

            {/* Expanded Filters */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="audit-filters-panel"
                    >
                        <div className="audit-filter-group">
                            <label className="audit-filter-label">Event Type</label>
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="audit-input"
                            >
                                <option value="all">All Events</option>
                                <option value="document_viewed">Views</option>
                                <option value="document_downloaded">Downloads</option>
                                <option value="document_uploaded">Uploads</option>
                                <option value="signature_completed">Signatures</option>
                                <option value="security_alert">Security Alerts</option>
                            </select>
                        </div>
                        <div className="audit-filter-group">
                            <label className="audit-filter-label">User / Email</label>
                            <div className="audit-input-wrapper">
                                <User size={16} className="audit-input-wrapper-icon" />
                                <input
                                    type="text"
                                    placeholder="Search by email..."
                                    value={userFilter}
                                    onChange={(e) => setUserFilter(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && loadLogs()}
                                    className="audit-input audit-input-icon"
                                />
                            </div>
                        </div>
                        <div className="audit-filter-group">
                            <label className="audit-filter-label">From Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="audit-input"
                            />
                        </div>
                        <div className="audit-filter-group">
                            <label className="audit-filter-label">To Date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="audit-input"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {error && (
                <div className="audit-error">
                    <Shield size={16} /> Error loading logs: {error}
                </div>
            )}

            <motion.div variants={itemVariants} className="audit-table-container">
                <table className="audit-table">
                    <thead>
                        <tr>
                            <th>Timestamp (UTC)</th>
                            <th>Event</th>
                            <th>User & Device</th>
                            <th>Location (IP)</th>
                            <th>Document / Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.length === 0 && !loading ? (
                            <tr>
                                <td colSpan={5}>
                                    <div className="audit-empty-state">
                                        <div className="audit-empty-icon">
                                            <Search size={24} />
                                        </div>
                                        <p>No audit logs found matching your filters.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            logs.map((log) => (
                                <tr key={log.id} className="audit-table-row">
                                    <td>
                                        <div className="audit-flex-col">
                                            <span className="audit-text-primary">{formatDate(log.event_timestamp).split(',')[0]}</span>
                                            <span className="audit-text-secondary">{formatDate(log.event_timestamp).split(',')[1]}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`audit-badge ${getBadgeClass(log.event_type)}`}>
                                            {getEventIcon(log.event_type)}
                                            {getEventLabel(log.event_type)}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="audit-flex-col">
                                            <span className="audit-text-primary audit-flex-row">
                                                {log.user_email || log.signer_name ? (
                                                    <User size={12} color="#9ca3af" />
                                                ) : null}
                                                {log.user_email || log.signer_name || 'Anonymous User'}
                                            </span>
                                            <div className="audit-text-secondary audit-flex-row">
                                                {getDeviceIcon(log.user_agent)}
                                                <span title={log.user_agent}>{getBrowserName(log.user_agent)}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="audit-flex-col">
                                            {log.city ? (
                                                <span className="audit-text-primary">
                                                    {log.city}, {log.country}
                                                </span>
                                            ) : (
                                                <span className="audit-text-secondary" style={{ fontStyle: 'italic' }}>Unresolved Location</span>
                                            )}
                                            <span className="audit-text-secondary" style={{ fontFamily: 'monospace' }}>
                                                {log.ip_address !== 'unknown' ? log.ip_address : ''}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="audit-flex-col" style={{ maxWidth: '280px' }}>
                                            {log.document_name && (
                                                <div className="audit-text-primary audit-flex-row" style={{ marginBottom: '4px' }}>
                                                    <FileText size={12} color="#6366f1" />
                                                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.document_name}</span>
                                                </div>
                                            )}
                                            {log.event_metadata && (() => {
                                                const { storageType, ...displayMetadata } = log.event_metadata;
                                                if (Object.keys(displayMetadata).length === 0) return null;

                                                return (
                                                    <div className="audit-metadata-box">
                                                        {JSON.stringify(displayMetadata)
                                                            .replace(/[{}"]/g, '')
                                                            .replace(/,/g, ', ')
                                                            .replace(/:/g, ': ')}
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        {loading && (
                            [1, 2, 3, 4, 5].map((i) => (
                                <tr key={`skeleton-${i}`}>
                                    <td><Skeleton width="100px" height="1rem" /></td>
                                    <td><Skeleton width="120px" height="1.5rem" borderRadius="9999px" /></td>
                                    <td><Skeleton width="140px" height="1rem" /></td>
                                    <td><Skeleton width="120px" height="1rem" /></td>
                                    <td><Skeleton width="200px" height="1rem" /></td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </motion.div>

            {/* Footer */}
            <motion.div variants={itemVariants} className="audit-footer">
                <span>Showing {logs.length} securely logged events</span>
                <span className="audit-compliance-badge">
                    <Shield size={14} /> Cryptographically Secured Audit Log
                </span>
            </motion.div>
        </motion.div>
    );
};

export default AuditTrail;
