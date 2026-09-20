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
    Loader2
} from 'lucide-react';

interface ComplianceConfig {
    default_stamp: 'rera-registered' | 'original-verified' | 'notarized-attested' | 'bank-apf-approved' | 'title-cleared';
    enable_sec65b_cert: boolean;
    include_geo_hash: boolean;
    include_sha256_hash: boolean;
    default_expiry_days: number;
    default_prevent_download: boolean;
    default_prevent_print: boolean;
    require_phone_otp: boolean;
}

const STAMPS_INFO = [
    { id: 'rera-registered', title: 'RERA Registered / महारेरा मान्यताप्राप्त', desc: 'Compliant with Section 4 RERA Act 2016 for builder-buyer agreements', color: '#059669', bg: '#ecfdf5' },
    { id: 'original-verified', title: 'Original Verified / मूळ प्रत पडताळणी', desc: 'Standard advocate scrutiny seal for title deeds and 7/12 extracts', color: '#0284c7', bg: '#f0f9ff' },
    { id: 'notarized-attested', title: 'Notarized & Attested / नोटरी प्रमाणित', desc: 'Court-admissible seal under Notaries Act 1952 for lease contracts', color: '#7c3aed', bg: '#f5f3ff' },
    { id: 'bank-apf-approved', title: 'Bank APF Approved / गृहकर्ज मंजूर', desc: 'Ready for SBI, HDFC, ICICI home loan sanction files', color: '#d97706', bg: '#fffbeb' },
    { id: 'title-cleared', title: 'Title Cleared (30-Yr) / निर्वेध मालकी हक्क', desc: 'Advocate 30-year search & scrutiny report certification', color: '#0d9488', bg: '#f0fdfa' }
];

export const RERAComplianceSettings: React.FC = () => {
    const [config, setConfig] = useState<ComplianceConfig>({
        default_stamp: 'rera-registered',
        enable_sec65b_cert: true,
        include_geo_hash: true,
        include_sha256_hash: true,
        default_expiry_days: 7,
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
                text: 'RERA statutory & Indian evidence compliance defaults saved successfully!'
            });
        }, 400);
    };

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8 animate-fade-in">
            {/* Header */}
            <div className="border-b border-gray-100 pb-6">
                <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
                    <Scale size={14} /> Statutory RERA & IT Act 2000 Compliance
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                    RERA & Indian Legal Defaults
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                    Configure default statutory stamps, court-admissible Section 65B certificates, and rate sheet expiry policies.
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
                            Default Indian Legal E-Signature Stamp
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Pre-select the default bilingual seal applied when executing property allotment letters, broker mandates, and leases.
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

                {/* Section 65B Electronic Audit Trail */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-5">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                        <div>
                            <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                                <FileCheck size={20} className="text-indigo-600" />
                                Section 65B Electronic Record Certificate (IT Act 2000)
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Automatically append tamper-evident cryptographic audit certificate to executed contracts for court admissibility in Indian tribunals.
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

                    {config.enable_sec65b_cert && (
                        <div className="space-y-3 pt-1">
                            <label className="flex items-center justify-between text-xs font-semibold text-gray-700 cursor-pointer p-3 bg-gray-50 rounded-xl hover:bg-gray-100/70 transition-colors">
                                <div>
                                    <div>Include City, ISP & Geolocation Stamp</div>
                                    <div className="text-[11px] text-gray-400 font-normal">Records viewer geographical coordinates and network IP for fraud defense</div>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={config.include_geo_hash}
                                    onChange={(e) => setConfig({ ...config, include_geo_hash: e.target.checked })}
                                    className="w-4 h-4 text-emerald-600 rounded"
                                />
                            </label>

                            <label className="flex items-center justify-between text-xs font-semibold text-gray-700 cursor-pointer p-3 bg-gray-50 rounded-xl hover:bg-gray-100/70 transition-colors">
                                <div>
                                    <div>Include SHA-256 Document Cryptographic Digest</div>
                                    <div className="text-[11px] text-gray-400 font-normal">Proves the document has not been altered or modified since signing</div>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={config.include_sha256_hash}
                                    onChange={(e) => setConfig({ ...config, include_sha256_hash: e.target.checked })}
                                    className="w-4 h-4 text-emerald-600 rounded"
                                />
                            </label>
                        </div>
                    )}
                </div>

                {/* Default Document Rights & DRM Policies */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-5">
                    <div>
                        <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                            <Lock size={20} className="text-emerald-600" />
                            Default Deal Room Security & DRM Policies
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">Applied automatically when creating new real estate project folders or sharing brochures.</p>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-2.5">
                                <Download size={16} className="text-gray-500" />
                                <div>
                                    <div className="text-xs font-bold text-gray-800">Prevent File Downloads (View-Only Mode)</div>
                                    <div className="text-[11px] text-gray-500">Stops clients and competitors from extracting raw PDF files</div>
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                checked={config.default_prevent_download}
                                onChange={(e) => setConfig({ ...config, default_prevent_download: e.target.checked })}
                                className="w-4 h-4 text-emerald-600 rounded"
                            />
                        </div>

                        <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-2.5">
                                <Printer size={16} className="text-gray-500" />
                                <div>
                                    <div className="text-xs font-bold text-gray-800">Disable Browser Printing</div>
                                    <div className="text-[11px] text-gray-500">Blocks Ctrl+P and print-to-PDF commands</div>
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                checked={config.default_prevent_print}
                                onChange={(e) => setConfig({ ...config, default_prevent_print: e.target.checked })}
                                className="w-4 h-4 text-emerald-600 rounded"
                            />
                        </div>

                        <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-2.5">
                                <Clock size={16} className="text-gray-500" />
                                <div>
                                    <div className="text-xs font-bold text-gray-800">Default Rate Card Auto-Expiry</div>
                                    <div className="text-[11px] text-gray-500">Time-limit for pre-launch discounts and builder pricing sheets</div>
                                </div>
                            </div>
                            <select
                                value={config.default_expiry_days}
                                onChange={(e) => setConfig({ ...config, default_expiry_days: Number(e.target.value) })}
                                className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold text-gray-800 outline-none"
                            >
                                <option value={3}>3 Days Auto-Expiry</option>
                                <option value={7}>7 Days Auto-Expiry</option>
                                <option value={14}>14 Days Auto-Expiry</option>
                                <option value={30}>30 Days Auto-Expiry</option>
                                <option value={0}>Permanent (No Expiry)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="pt-2 flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl font-bold text-xs shadow-md transition-all disabled:opacity-50"
                    >
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Save RERA Compliance Defaults
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RERAComplianceSettings;
