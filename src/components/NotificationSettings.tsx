import React, { useState, useEffect } from 'react';
import {
    Bell,
    MessageCircle,
    Clock,
    ShieldAlert,
    Mail,
    CheckCircle,
    Save,
    Sparkles,
    Calendar,
    Smartphone,
    Eye,
    AlertTriangle,
    Loader2
} from 'lucide-react';

interface NotificationConfig {
    whatsapp_enabled: boolean;
    whatsapp_phone: string;
    dwell_time_alert: boolean;
    dwell_threshold_seconds: number;
    forward_leak_alert: boolean;
    daily_digest_enabled: boolean;
    daily_digest_channel: 'whatsapp' | 'email' | 'both';
    mandate_expiry_alert: boolean;
    mandate_alert_days: number;
    email_on_open: boolean;
    email_on_sign: boolean;
    email_on_download: boolean;
}

export const NotificationSettings: React.FC = () => {
    const [config, setConfig] = useState<NotificationConfig>({
        whatsapp_enabled: true,
        whatsapp_phone: '',
        dwell_time_alert: true,
        dwell_threshold_seconds: 60,
        forward_leak_alert: true,
        daily_digest_enabled: true,
        daily_digest_channel: 'whatsapp',
        mandate_expiry_alert: true,
        mandate_alert_days: 5,
        email_on_open: true,
        email_on_sign: true,
        email_on_download: true
    });

    const [saving, setSaving] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem('doctransfer_notification_settings');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setConfig(prev => ({ ...prev, ...parsed }));
            } catch (e) {
                console.error(e);
            }
        }
    }, []);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setStatusMessage(null);

        localStorage.setItem('doctransfer_notification_settings', JSON.stringify(config));

        setTimeout(() => {
            setSaving(false);
            setStatusMessage({
                type: 'success',
                text: 'WhatsApp and real estate notification preferences saved successfully!'
            });
        }, 400);
    };

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8 animate-fade-in">
            {/* Header */}
            <div className="border-b border-gray-100 pb-6">
                <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
                    <Sparkles size={14} /> Instant Lead Intelligence
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                    WhatsApp & Real Estate Lead Alerts
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                    Receive instant notifications the moment a high-ticket property buyer opens your link or studies your floor plans.
                </p>
            </div>

            {statusMessage && (
                <div className={`p-4 rounded-2xl flex items-center gap-3 shadow-xs ${statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                    {statusMessage.type === 'success' ? <CheckCircle size={20} className="text-emerald-600 shrink-0" /> : <AlertTriangle size={20} className="shrink-0" />}
                    <span className="text-xs font-semibold">{statusMessage.text}</span>
                </div>
            )}

            <form onSubmit={handleSave} className="space-y-8">
                {/* WhatsApp Telemetry Section */}
                <div className="p-6 bg-gradient-to-br from-emerald-50/60 to-teal-50/30 rounded-3xl border border-emerald-100/90 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                                <MessageCircle size={20} />
                            </div>
                            <div>
                                <h3 className="font-extrabold text-gray-900 text-base">Instant WhatsApp Lead Telemetry</h3>
                                <p className="text-xs text-gray-500">Get pinged on WhatsApp the second a prospect opens your brochure.</p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setConfig({ ...config, whatsapp_enabled: !config.whatsapp_enabled })}
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${config.whatsapp_enabled ? 'bg-emerald-600' : 'bg-gray-200'}`}
                        >
                            <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${config.whatsapp_enabled ? 'translate-x-5' : 'translate-x-0'}`}
                            />
                        </button>
                    </div>

                    {config.whatsapp_enabled && (
                        <div className="space-y-4 pt-2">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                    Your WhatsApp Number (for incoming alerts)
                                </label>
                                <div className="relative max-w-md">
                                    <Smartphone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-600" />
                                    <input
                                        type="tel"
                                        value={config.whatsapp_phone}
                                        onChange={(e) => setConfig({ ...config, whatsapp_phone: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm font-medium"
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                                <p className="text-[11px] text-gray-500 mt-1">Alert format: <em>"🔥 Lodha Heights: Buyer in Mumbai just opened Cost Sheet. Reading Page 3 (3BHK Penthouse)."</em></p>
                            </div>

                            {/* Dwell Time Trigger */}
                            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-emerald-100/60">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl mt-0.5">
                                        <Clock size={18} />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-900">High-Intent Dwell Time Trigger</h4>
                                        <p className="text-[11px] text-gray-500">Alert me when a prospect spends over 60 seconds on floor plans or payment milestones.</p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setConfig({ ...config, dwell_time_alert: !config.dwell_time_alert })}
                                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${config.dwell_time_alert ? 'bg-emerald-600' : 'bg-gray-200'}`}
                                >
                                    <span
                                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${config.dwell_time_alert ? 'translate-x-5' : 'translate-x-0'}`}
                                    />
                                </button>
                            </div>

                            {/* Forward / Leak Warning */}
                            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-emerald-100/60">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-amber-50 text-amber-600 rounded-xl mt-0.5">
                                        <ShieldAlert size={18} />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-900">Brochure Forwarding / New Device Detection</h4>
                                        <p className="text-[11px] text-gray-500">Alert me if the link is forwarded to someone outside the original recipient's city or IP range.</p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setConfig({ ...config, forward_leak_alert: !config.forward_leak_alert })}
                                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${config.forward_leak_alert ? 'bg-emerald-600' : 'bg-gray-200'}`}
                                >
                                    <span
                                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${config.forward_leak_alert ? 'translate-x-5' : 'translate-x-0'}`}
                                    />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Daily Digest & Lead Mandate Expiry */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Morning Pipeline Digest */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-200 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                                <Calendar size={18} className="text-emerald-600" />
                                9:00 AM Morning Pipeline Digest
                            </div>
                            <button
                                type="button"
                                onClick={() => setConfig({ ...config, daily_digest_enabled: !config.daily_digest_enabled })}
                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${config.daily_digest_enabled ? 'bg-emerald-600' : 'bg-gray-200'}`}
                            >
                                <span
                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${config.daily_digest_enabled ? 'translate-x-5' : 'translate-x-0'}`}
                                />
                            </button>
                        </div>
                        <p className="text-xs text-gray-500">
                            Receive a daily snapshot of all buyer visits, hottest prospects, and uncompleted e-signatures at 9:00 AM IST.
                        </p>

                        <div className="flex gap-2 pt-2">
                            {(['whatsapp', 'email', 'both'] as const).map(channel => (
                                <button
                                    key={channel}
                                    type="button"
                                    onClick={() => setConfig({ ...config, daily_digest_channel: channel })}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all border ${config.daily_digest_channel === channel ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-gray-50 text-gray-600 border-gray-200'}`}
                                >
                                    {channel}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Exclusivity Mandate Expiry */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-200 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                                <Clock size={18} className="text-indigo-600" />
                                60-Day Mandate Expiry Alert
                            </div>
                            <button
                                type="button"
                                onClick={() => setConfig({ ...config, mandate_expiry_alert: !config.mandate_expiry_alert })}
                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${config.mandate_expiry_alert ? 'bg-emerald-600' : 'bg-gray-200'}`}
                            >
                                <span
                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${config.mandate_expiry_alert ? 'translate-x-5' : 'translate-x-0'}`}
                                />
                            </button>
                        </div>
                        <p className="text-xs text-gray-500">
                            Alert me 5 days before a client's 60-day broker mandate expires so I can request a renewal before the builder desk closes it.
                        </p>

                        <div className="pt-2">
                            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                                🔔 5-Day Pre-Expiry Warning Enabled
                            </span>
                        </div>
                    </div>
                </div>

                {/* Standard Email Notification Preferences */}
                <div className="bg-white rounded-3xl p-6 border border-gray-200 space-y-4">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                        <Mail size={16} className="text-gray-500" />
                        Standard Email Notification Triggers
                    </h3>

                    <div className="space-y-3">
                        <label className="flex items-center justify-between text-xs font-medium text-gray-700 cursor-pointer">
                            <span>Email me immediately whenever any link is viewed</span>
                            <input
                                type="checkbox"
                                checked={config.email_on_open}
                                onChange={(e) => setConfig({ ...config, email_on_open: e.target.checked })}
                                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                            />
                        </label>

                        <label className="flex items-center justify-between text-xs font-medium text-gray-700 cursor-pointer">
                            <span>Email me when an agreement or allotment letter is digitally signed</span>
                            <input
                                type="checkbox"
                                checked={config.email_on_sign}
                                onChange={(e) => setConfig({ ...config, email_on_sign: e.target.checked })}
                                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                            />
                        </label>

                        <label className="flex items-center justify-between text-xs font-medium text-gray-700 cursor-pointer">
                            <span>Email me when a recipient attempts to download view-only files</span>
                            <input
                                type="checkbox"
                                checked={config.email_on_download}
                                onChange={(e) => setConfig({ ...config, email_on_download: e.target.checked })}
                                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                            />
                        </label>
                    </div>
                </div>

                {/* Save Action */}
                <div className="pt-2 flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl font-bold text-xs shadow-md transition-all disabled:opacity-50"
                    >
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Save Notification Preferences
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NotificationSettings;
