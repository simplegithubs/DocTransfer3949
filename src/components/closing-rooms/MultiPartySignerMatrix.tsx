import React, { useState } from 'react';
import { UserCheck, ShieldCheck, Clock, CheckCircle2, AlertCircle, PenTool, FileText, Send, User } from 'lucide-react';
import { generateSec65BCertificatePdf } from '../../lib/sec65bGenerator';

export interface SignerParty {
    id: string;
    role: 'developer' | 'primary_buyer' | 'co_applicant' | 'witness_1' | 'witness_2';
    roleTitle: string;
    name: string;
    contact: string;
    kycType: 'PAN + Aadhaar' | 'Aadhaar eSign' | 'RERA Seal' | 'Biometric Signature';
    status: 'signed' | 'pending' | 'invited';
    signedAt?: string;
    ipAddress?: string;
}

interface MultiPartySignerMatrixProps {
    dealId?: string;
    propertyName?: string;
    documentName?: string;
}

export const MultiPartySignerMatrix: React.FC<MultiPartySignerMatrixProps> = ({
    dealId = 'DL-2024-MUM-8921',
    propertyName = 'Godrej Woodsman Tower B - Unit 1402',
    documentName = 'Agreement for Sale (RERA ATS Deed)'
}) => {
    const [signers, setSigners] = useState<SignerParty[]>([
        {
            id: 'sign_1',
            role: 'developer',
            roleTitle: 'Developer / Authorized Signatory',
            name: 'Vikram Godrej (Director)',
            contact: '+91 98200 11223',
            kycType: 'RERA Seal',
            status: 'signed',
            signedAt: '28 Sep 2026, 11:30 AM',
            ipAddress: '49.36.120.45 (Mumbai)'
        },
        {
            id: 'sign_2',
            role: 'primary_buyer',
            roleTitle: 'Primary Buyer (Allottee)',
            name: 'Aditya Sharma',
            contact: '+91 98765 43210',
            kycType: 'Aadhaar eSign',
            status: 'signed',
            signedAt: '28 Sep 2026, 04:15 PM',
            ipAddress: '103.21.14.88 (Bangalore)'
        },
        {
            id: 'sign_3',
            role: 'co_applicant',
            roleTitle: 'Co-Applicant / Joint Purchaser',
            name: 'Neha A. Sharma',
            contact: '+91 98765 43211',
            kycType: 'Aadhaar eSign',
            status: 'pending',
            signedAt: undefined,
            ipAddress: undefined
        },
        {
            id: 'sign_4',
            role: 'witness_1',
            roleTitle: 'Statutory Witness 1 (Sec 32A Reg Act)',
            name: 'Rohan Mehta (Advocate)',
            contact: '+91 98110 55443',
            kycType: 'PAN + Aadhaar',
            status: 'signed',
            signedAt: '28 Sep 2026, 05:00 PM',
            ipAddress: '49.36.120.45 (Mumbai)'
        },
        {
            id: 'sign_5',
            role: 'witness_2',
            roleTitle: 'Statutory Witness 2 (Sec 32A Reg Act)',
            name: 'Karan Joshi',
            contact: '+91 98220 99887',
            kycType: 'PAN + Aadhaar',
            status: 'pending',
            signedAt: undefined,
            ipAddress: undefined
        }
    ]);

    const [isGeneratingAudit, setIsGeneratingAudit] = useState(false);

    const handleSimulateSign = (id: string) => {
        setSigners(prev => prev.map(s => {
            if (s.id === id) {
                return {
                    ...s,
                    status: 'signed',
                    signedAt: new Date().toLocaleString('en-IN'),
                    ipAddress: '103.21.14.88 (Verified)'
                };
            }
            return s;
        }));
    };

    const handleDownloadSec65BCertificate = async () => {
        setIsGeneratingAudit(true);
        try {
            const primarySigner = signers.find(s => s.role === 'primary_buyer');
            const pdfBytes = await generateSec65BCertificatePdf({
                documentName: `${propertyName} - ${documentName}`,
                signerName: primarySigner ? primarySigner.name : 'Aditya Sharma',
                signerEmail: 'aditya.sharma@example.com',
                signerPhone: '+91 98765 43210',
                ipAddress: '103.21.14.88',
                signedAt: new Date().toISOString(),
                documentHashSha256: `SHA256-${Date.now().toString(16)}-RERA-${dealId}`,
                stampType: 'Section 32A Indian Registration Act 1908 Multi-Party Execution'
            });

            const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Section65B_Execution_Certificate_${dealId}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Failed to generate Section 65B Certificate:', err);
            alert('Error generating Certificate.');
        } finally {
            setIsGeneratingAudit(false);
        }
    };

    const totalSigned = signers.filter(s => s.status === 'signed').length;
    const allSigned = totalSigned === signers.length;

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
                    <div style={{ padding: '8px', background: '#e0e7ff', borderRadius: '8px' }}>
                        <PenTool size={20} color="#4338ca" />
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                            Multi-Party Legal Signing Sequence
                        </h3>
                        <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                            Section 32A Indian Registration Act 1908 Execution Matrix ({totalSigned}/{signers.length} Complete)
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleDownloadSec65BCertificate}
                    disabled={isGeneratingAudit}
                    style={{
                        padding: '0.5rem 0.85rem',
                        background: '#047857',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                    }}
                >
                    <ShieldCheck size={15} /> {isGeneratingAudit ? 'Exporting Certificate...' : 'Download Sec 65B Audit Certificate'}
                </button>
            </div>

            {/* Signers Table */}
            <div style={{ padding: '1rem 1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {signers.map((signer, idx) => (
                        <div key={signer.id} style={{
                            padding: '1rem',
                            borderRadius: '12px',
                            border: `1px solid ${signer.status === 'signed' ? '#bbf7d0' : '#e2e8f0'}`,
                            background: signer.status === 'signed' ? '#f0fdf4' : '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '1rem'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                                <div style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    background: signer.status === 'signed' ? '#dcfce7' : '#f1f5f9',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: signer.status === 'signed' ? '#16a34a' : '#64748b',
                                    fontWeight: 700,
                                    fontSize: '0.85rem'
                                }}>
                                    {signer.status === 'signed' ? <CheckCircle2 size={18} /> : idx + 1}
                                </div>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, color: '#0f172a' }}>
                                            {signer.name}
                                        </h4>
                                        <span style={{ fontSize: '0.7rem', padding: '1px 6px', background: '#e2e8f0', color: '#334155', borderRadius: '4px', fontWeight: 600 }}>
                                            {signer.roleTitle}
                                        </span>
                                    </div>
                                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                                        {signer.contact} • {signer.kycType} {signer.signedAt && `• Signed at ${signer.signedAt}`}
                                    </p>
                                </div>
                            </div>

                            <div>
                                {signer.status === 'signed' ? (
                                    <span style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        padding: '4px 10px',
                                        background: '#dcfce7',
                                        color: '#15803d',
                                        borderRadius: '9999px',
                                        fontSize: '0.75rem',
                                        fontWeight: 700
                                    }}>
                                        <CheckCircle2 size={13} /> Legally Executed
                                    </span>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => handleSimulateSign(signer.id)}
                                        style={{
                                            padding: '0.45rem 0.85rem',
                                            background: '#3b82f6',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontSize: '0.78rem',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}
                                    >
                                        <PenTool size={13} /> Sign via Aadhaar OTP
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MultiPartySignerMatrix;
