import { useState, useEffect } from 'react';

export interface ComplianceConfig {
    default_stamp: 'rera-registered' | 'original-verified' | 'notarized-attested' | 'bank-apf-approved' | 'title-cleared';
    enable_sec65b_cert: boolean;
    include_geo_hash: boolean;
    include_sha256_hash: boolean;
    default_expiry_days: number;
    default_prevent_download: boolean;
    default_prevent_print: boolean;
    require_phone_otp: boolean;
}

export const DEFAULT_COMPLIANCE_CONFIG: ComplianceConfig = {
    default_stamp: 'rera-registered',
    enable_sec65b_cert: true,
    include_geo_hash: true,
    include_sha256_hash: true,
    default_expiry_days: 7,
    default_prevent_download: false,
    default_prevent_print: true,
    require_phone_otp: false
};

export const getComplianceSettings = (): ComplianceConfig => {
    if (typeof window === 'undefined') return DEFAULT_COMPLIANCE_CONFIG;
    try {
        const saved = localStorage.getItem('doctransfer_compliance_settings');
        if (saved) {
            return { ...DEFAULT_COMPLIANCE_CONFIG, ...JSON.parse(saved) };
        }
    } catch (e) {
        console.error('Failed to parse compliance settings from localStorage:', e);
    }
    return DEFAULT_COMPLIANCE_CONFIG;
};

export const saveComplianceSettings = (config: Partial<ComplianceConfig>): ComplianceConfig => {
    const current = getComplianceSettings();
    const updated = { ...current, ...config };
    try {
        localStorage.setItem('doctransfer_compliance_settings', JSON.stringify(updated));
    } catch (e) {
        console.error('Failed to save compliance settings to localStorage:', e);
    }
    return updated;
};

export const useComplianceSettings = () => {
    const [settings, setSettings] = useState<ComplianceConfig>(getComplianceSettings);

    useEffect(() => {
        setSettings(getComplianceSettings());

        const handleStorage = (e: StorageEvent) => {
            if (e.key === 'doctransfer_compliance_settings') {
                setSettings(getComplianceSettings());
            }
        };

        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const updateSettings = (newConfig: Partial<ComplianceConfig>) => {
        const updated = saveComplianceSettings(newConfig);
        setSettings(updated);
    };

    return {
        settings,
        updateSettings
    };
};

export default useComplianceSettings;
