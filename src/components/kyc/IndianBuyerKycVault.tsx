import React, { useState } from 'react';
import { validatePan, validateAadhaar } from '../../lib/kycValidator';
import type { PanValidationResult, AadhaarValidationResult } from '../../lib/kycValidator';
import { ShieldCheck, UserCheck, AlertCircle, CheckCircle2, FileText, Upload, Lock, Smartphone, Building } from 'lucide-react';

interface KycDocumentItem {
    id: string;
    title: string;
    subtitle: string;
    status: 'verified' | 'uploaded' | 'pending';
    fileName?: string;
    verifiedTag?: string;
}

export const IndianBuyerKycVault: React.FC = () => {
    const [panInput, setPanInput] = useState('ABCPS1234K');
    const [panResult, setPanResult] = useState<PanValidationResult>(() => validatePan('ABCPS1234K'));

    const [aadhaarInput, setAadhaarInput] = useState('234567890123'); // Demo valid 12-digit format
    const [aadhaarResult, setAadhaarResult] = useState<AadhaarValidationResult>(() => validateAadhaar('234567890123'));

    const [kycDocs, setKycDocs] = useState<KycDocumentItem[]>([
        { id: '1', title: 'PAN Card (Buyer)', subtitle: 'Income Tax Dept Format (Form 49A)', status: 'verified', fileName: 'pan_aditya_sharma.pdf', verifiedTag: 'PAN Verified (Individual)' },
        { id: '2', title: 'Masked Aadhaar Card', subtitle: 'UIDAI Safe Format (Last 4 Digits)', status: 'verified', fileName: 'aadhaar_masked_secure.pdf', verifiedTag: 'UIDAI Masked (XXXX-XXXX-0123)' },
        { id: '3', title: 'Income Tax Return (ITR-V)', subtitle: 'Past 2 Assessment Years for APF Loan', status: 'uploaded', fileName: 'itr_assessment_ay25.pdf' },
        { id: '4', title: 'Permanent Address Proof', subtitle: 'Passport / Electricity Bill / Voter ID', status: 'verified', fileName: 'passport_front_back.pdf', verifiedTag: 'Address Match Verified' },
        { id: '5', title: 'Co-Applicant KYC (Joint Owner)', subtitle: 'PAN & Aadhaar of Co-Purchaser', status: 'pending' }
    ]);

    const handlePanChange = (val: string) => {
        setPanInput(val);
        setPanResult(validatePan(val));
    };

    const handleAadhaarChange = (val: string) => {
        setAadhaarInput(val);
        setAadhaarResult(validateAadhaar(val));
    };

    return (
        <div style={{
            background: 'white',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
        }}>
            {/* Header */}
            <div style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#f8fafc'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ padding: '8px', background: '#ecfdf5', borderRadius: '8px' }}>
                        <ShieldCheck size={22} color="#059669" />
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                            Statutory Buyer & Tenant KYC Vault
                        </h3>
                        <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                            UIDAI Aadhaar Masking & Income Tax PAN Checksum Validation
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#dcfce7', color: '#15803d', padding: '4px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
                    <CheckCircle2 size={13} /> RERA KYC Compliant
                </div>
            </div>

            {/* Quick Live KYC Validator Tool */}
            <div style={{
                padding: '1.25rem 1.5rem',
                background: '#f8fafc',
                borderBottom: '1px solid #e2e8f0',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1.25rem'
            }}>
                {/* PAN Validator Box */}
                <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                        Live PAN Checksum Check
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                            type="text"
                            maxLength={10}
                            value={panInput}
                            onChange={(e) => handlePanChange(e.target.value)}
                            placeholder="ABCDE1234F"
                            style={{ flex: 1, padding: '0.55rem 0.75rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', fontFamily: 'monospace', fontWeight: 700, textTransform: 'uppercase', outline: 'none' }}
                        />
                    </div>
                    <div style={{ marginTop: '0.4rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {panResult.isValid ? (
                            <span style={{ color: '#059669', fontWeight: 600 }}>
                                ✓ {panResult.entityType} ({panResult.pan})
                            </span>
                        ) : (
                            <span style={{ color: '#dc2626' }}>
                                ✗ {panResult.error || 'Invalid PAN structure'}
                            </span>
                        )}
                    </div>
                </div>

                {/* Aadhaar Verhoeff Validator Box */}
                <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                        Aadhaar Masking & Verhoeff Check
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                            type="text"
                            maxLength={14}
                            value={aadhaarInput}
                            onChange={(e) => handleAadhaarChange(e.target.value)}
                            placeholder="12-Digit Aadhaar"
                            style={{ flex: 1, padding: '0.55rem 0.75rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', fontFamily: 'monospace', fontWeight: 700, outline: 'none' }}
                        />
                    </div>
                    <div style={{ marginTop: '0.4rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {aadhaarResult.isValid ? (
                            <span style={{ color: '#059669', fontWeight: 600 }}>
                                ✓ Safe Masked: {aadhaarResult.maskedAadhaar}
                            </span>
                        ) : (
                            <span style={{ color: '#dc2626' }}>
                                ✗ {aadhaarResult.error || 'Invalid 12-digit Aadhaar'}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Document Items List */}
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {kycDocs.map((doc) => (
                    <div key={doc.id} style={{
                        padding: '0.9rem 1.1rem',
                        borderRadius: '12px',
                        border: `1px solid ${doc.status === 'verified' ? '#bbf7d0' : '#e2e8f0'}`,
                        background: doc.status === 'verified' ? '#f0fdf4' : '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                            <div style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '10px',
                                background: doc.status === 'verified' ? '#dcfce7' : '#f1f5f9',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <FileText size={20} color={doc.status === 'verified' ? '#16a34a' : '#64748b'} />
                            </div>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                                        {doc.title}
                                    </h4>
                                    {doc.verifiedTag && (
                                        <span style={{ fontSize: '0.68rem', padding: '1px 6px', background: '#dcfce7', color: '#15803d', borderRadius: '4px', fontWeight: 700 }}>
                                            {doc.verifiedTag}
                                        </span>
                                    )}
                                </div>
                                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.75rem', color: '#64748b' }}>
                                    {doc.subtitle} {doc.fileName && `• ${doc.fileName}`}
                                </p>
                            </div>
                        </div>

                        <div>
                            {doc.status === 'verified' ? (
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16a34a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <CheckCircle2 size={15} /> Verified
                                </span>
                            ) : doc.status === 'uploaded' ? (
                                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0284c7', background: '#e0f2fe', padding: '3px 8px', borderRadius: '6px' }}>
                                    Audit In Progress
                                </span>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => alert(`Upload link sent to Co-Applicant for ${doc.title}`)}
                                    style={{ padding: '0.4rem 0.75rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                                >
                                    <Upload size={13} /> Request Upload
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default IndianBuyerKycVault;
