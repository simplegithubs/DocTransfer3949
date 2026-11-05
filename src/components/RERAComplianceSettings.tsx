import React, { useState, useEffect } from 'react';
import {
    Scale,
    ShieldCheck,
    CheckCircle,
    Save,
    Clock,
    Lock,
    FileCheck,
    Sparkles,
    AlertTriangle,
    Eye,
    Download,
    Printer,
    Smartphone,
    Loader2,
    Globe
} from 'lucide-react';

interface ComplianceConfig {
    default_stamp: 'difc-adgm' | 'gdpr-pdpl' | 'eidas-esign' | 'institutional-apf' | 'title-cleared-global';
    enable_sec65b_cert: boolean; // Retained internally for backward compatibility, represents eIDAS/ESIGN cert
    include_geo_hash: boolean;
    include_sha256_hash: boolean;
    default_expiry_days: number;
    default_prevent_download: boolean;
    default_prevent_print: boolean;
    require_phone_otp: boolean;
}

const STAMPS_INFO = [
    { id: 'difc-adgm', title: '🏛️ DIFC / ADGM Arbitration Seal', desc: 'English Law commercial arbitration under DIFC-LCIA / ADGM court jurisdiction', color: '#059669', bg: '#ecfdf5' },
    { id: 'gdpr-pdpl', title: '🛡️ GDPR Art. 32 & UAE PDPL Privacy Seal', desc: 'Cryptographic data confidentiality under UAE Federal Decree-Law No. 45/2021 & EU GDPR', color: '#0284c7', bg: '#f0f9ff' },
    { id: 'eidas-esign', title: '⚖️ eIDAS & US ESIGN Digital Admissibility', desc: 'Court-admissible electronic records under EU Regulation 910/2014 & US 15 U.S.C. § 7001', color: '#7c3aed', bg: '#f5f3ff' },
    { id: 'institutional-apf', title: '💼 Institutional Diligence & Escrow Approved', desc: 'Verified for sovereign wealth funds, institutional investment banking & private equity', color: '#d97706', bg: '#fffbeb' },
    { id: 'title-cleared-global', title: '📜 30-Year Clean Title & Freehold Verified', desc: 'International legal search report & freehold ownership covenants attested', color: '#0d9488', bg: '#f0fdfa' }
];

export const RERAComplianceSettings: React.FC = () => {
    const [config, setConfig] = useState<ComplianceConfig>({
        default_stamp: 'difc-adgm',
        enable_sec65b_cert: true,
        include_geo_hash: true,
        include_sha256_hash: true,
        default_expiry_days: 14,
        default_prevent_download: true,
        default_prevent_print: true,
        require_phone_otp: false
    });

    const [saving, setSaving] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem('doctransfer_compliance_settings');
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

        localStorage.setItem('doctransfer_compliance_settings', JSON.stringify(config));

        setTimeout(() => {
            setSaving(false);
            setStatusMessage({
                type: 'success',
                text: 'International statutory & cryptographic compliance defaults saved successfully!'
            });
        }, 400);
    };

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8 animate-fade-in">
            {/* Header */}
            <div className="border-b border-gray-100 pb-6">
                <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
                    <Scale size={14} /> Global Statutory & Legal Compliance Architecture
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                    International Legal & Compliance Defaults
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                    Configure default international compliance seals, eIDAS / ESIGN court-admissible audit certificates, and deal room security policies.
                </p>
            </div>

            {statusMessage && (
                <div className={`p-4 rounded-2xl flex items-center gap-3 shadow-xs ${statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                    {statusMessage.type === 'success' ? <CheckCircle size={20} className="text-emerald-600 shrink-0" /> : <AlertTriangle size={20} className="shrink-0" />}
                    <span className="text-xs font-semibold">{statusMessage.text}</span>
                </div>
            )}

            <form onSubmit={handleSave} className="space-y-8">
                {/* Default Legal Stamp Selection */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-5">
                    <div>
                        <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                            <ShieldCheck size={20} className="text-emerald-600" />
                            Default Cross-Border Legal Seal & Attestation
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Pre-select the default legal seal automatically applied when executing property allotment agreements, broker mandates, and diligence memoranda.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {STAMPS_INFO.map(stamp => {
                            const isSelected = config.default_stamp === stamp.id;
                            return (
                                <div
                                    key={stamp.id}
                                    onClick={() => setConfig({ ...config, default_stamp: stamp.id as any })}
                                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${isSelected ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-2 ring-emerald-500/20' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                                >
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-xs font-bold text-gray-900">{stamp.title}</span>
                                        {isSelected && (
                                            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                                                ✓
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[11px] text-gray-500 leading-snug">{stamp.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* eIDAS & US ESIGN Cryptographic Audit Trail */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-5">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                        <div>
                            <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                                <FileCheck size={20} className="text-indigo-600" />
                                eIDAS & US ESIGN Electronic Record Certificate
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Automatically append tamper-evident SHA-256 cryptographic audit certificates to executed contracts for court admissibility in DIFC, EU, and US tribunals.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setConfig({ ...config, enable_sec65b_cert: !config.enable_sec65b_cert })}
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${config.enable_sec65b_cert ? 'bg-emerald-600' : 'bg-gray-200'}`}
                        >
                            <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${config.enable_sec65b_cert ? 'translate-x-5' : 'translate-x-0'}`}
                            />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={config.include_geo_hash}
                                onChange={(e) => setConfig({ ...config, include_geo_hash: e.target.checked })}
                                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                            />
                            <div>
                                <div className="text-xs font-bold text-gray-800">Include GPS & IP Geolocation Telemetry</div>
                                <div className="text-[10px] text-gray-500">Embed verified viewer location into digital evidence log</div>
                            </div>
                        </label>

                        <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={config.include_sha256_hash}
                                onChange={(e) => setConfig({ ...config, include_sha256_hash: e.target.checked })}
                                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                            />
                            <div>
                                <div className="text-xs font-bold text-gray-800">Include SHA-256 Document Checksum</div>
                                <div className="text-[10px] text-gray-500">Guarantees zero byte alteration post-execution</div>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Default Diligence Room Lifecycle Policies */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-5">
                    <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                        <Clock size={20} className="text-amber-600" />
                        Default Data Room Lifecycle & DRM Policies
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                Default Link Expiry (Days)
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="90"
                                value={config.default_expiry_days}
                                onChange={(e) => setConfig({ ...config, default_expiry_days: parseInt(e.target.value) || 14 })}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                Strict Download Prevention
                            </label>
                            <button
                                type="button"
                                onClick={() => setConfig({ ...config, default_prevent_download: !config.default_prevent_download })}
                                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold border transition-all ${config.default_prevent_download ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-gray-50 border-gray-200 text-gray-600'}`}
                            >
                                {config.default_prevent_download ? '✓ Block Downloads by Default' : 'Allow Downloads'}
                            </button>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                Strict Print & Copy DRM
                            </label>
                            <button
                                type="button"
                                onClick={() => setConfig({ ...config, default_prevent_print: !config.default_prevent_print })}
                                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold border transition-all ${config.default_prevent_print ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-gray-50 border-gray-200 text-gray-600'}`}
                            >
                                {config.default_prevent_print ? '✓ Strict DRM Active' : 'Allow Print'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white font-extrabold rounded-xl text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
                    >
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        {saving ? 'Saving...' : 'Save Global Compliance Defaults'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RERAComplianceSettings;
