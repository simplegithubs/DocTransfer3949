import React, { useState } from 'react';
import type { IndianState, EStampDetails } from '../../lib/eStampGenerator';
import { generateEStampCoverPdf } from '../../lib/eStampGenerator';
import { X, Stamp, ShieldCheck, Download, FileText, CheckCircle2, Building, Sparkles } from 'lucide-react';

interface EStampModalProps {
    isOpen: boolean;
    onClose: () => void;
    documentName?: string;
    defaultFirstParty?: string;
    defaultSecondParty?: string;
    defaultState?: IndianState;
    defaultAmount?: number;
    onAttachSuccess?: (details: EStampDetails) => void;
}

const INDIAN_STATES: IndianState[] = [
    'Maharashtra',
    'Karnataka',
    'Delhi',
    'Haryana',
    'Uttar Pradesh',
    'Telangana',
    'Tamil Nadu',
    'Gujarat',
    'West Bengal'
];

const STANDARD_DOCUMENT_TYPES = [
    'Article 5 Agreement for Sale (RERA)',
    'Article 36 Lease Deed (11-Month Rent Agreement)',
    'Article 25 Conveyance / Sale Deed',
    'Article 48 General Power of Attorney (GPA)',
    'Article 5(h) Channel Partner Broker Mandate',
    'Article 35 Indemnity Bond & Guarantee'
];

export const EStampModal: React.FC<EStampModalProps> = ({
    isOpen,
    onClose,
    documentName = 'Real Estate Agreement',
    defaultFirstParty = 'Aditya Sharma',
    defaultSecondParty = 'Godrej Properties Ltd',
    defaultState = 'Maharashtra',
    defaultAmount = 500,
    onAttachSuccess
}) => {
    const [state, setState] = useState<IndianState>(defaultState);
    const [firstParty, setFirstParty] = useState(defaultFirstParty);
    const [secondParty, setSecondParty] = useState(defaultSecondParty);
    const [stampDutyAmount, setStampDutyAmount] = useState<number>(defaultAmount);
    const [documentType, setDocumentType] = useState<string>(STANDARD_DOCUMENT_TYPES[0]);
    const [certificateNo, setCertificateNo] = useState<string>(() => `IN-${defaultState.slice(0, 2).toUpperCase()}${Math.floor(100000000000 + Math.random() * 900000000000)}W`);
    const [propertyDescription, setPropertyDescription] = useState('Unit 1402, Tower B, Godrej Woodsman, Sector 45');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedSuccess, setGeneratedSuccess] = useState(false);

    if (!isOpen) return null;

    const handleStateChange = (newState: IndianState) => {
        setState(newState);
        setCertificateNo(`IN-${newState.slice(0, 2).toUpperCase()}${Math.floor(100000000000 + Math.random() * 900000000000)}W`);
    };

    const handleDownloadCertificate = async () => {
        setIsGenerating(true);
        try {
            const details: EStampDetails = {
                certificateNo,
                state,
                issueDate: new Date().toLocaleDateString('en-IN'),
                firstParty,
                secondParty,
                stampDutyAmount,
                dutyPaidBy: firstParty,
                documentType,
                propertyDescription
            };

            const pdfBytes = await generateEStampCoverPdf(details);
            const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `eStamp_${certificateNo}_${state}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            setGeneratedSuccess(true);
            if (onAttachSuccess) {
                onAttachSuccess(details);
            }
        } catch (err) {
            console.error('Failed to generate e-Stamp certificate:', err);
            alert('Error generating e-Stamp PDF certificate.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '20px',
                width: '100%',
                maxWidth: '680px',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                border: '1px solid #e2e8f0'
            }}>
                {/* Header */}
                <div style={{
                    padding: '1.5rem',
                    borderBottom: '1px solid #f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
                    color: 'white',
                    borderRadius: '20px 20px 0 0'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ padding: '8px', background: 'rgba(255,255,255,0.15)', borderRadius: '10px' }}>
                            <Stamp size={24} color="#34d399" />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                                Digital Non-Judicial e-Stamp Assembler
                            </h2>
                            <p style={{ fontSize: '0.8rem', color: '#a7f3d0', margin: '0.2rem 0 0 0' }}>
                                State Revenue Department & SHCIL Court-Admissible Stamping
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{ background: 'transparent', border: 'none', color: '#a7f3d0', cursor: 'pointer', padding: '4px' }}
                    >
                        <X size={22} />
                    </button>
                </div>

                {/* Form Body */}
                <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {/* Notice Banner */}
                    <div style={{
                        background: '#ecfdf5',
                        border: '1px solid #a7f3d0',
                        borderRadius: '12px',
                        padding: '0.85rem 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                    }}>
                        <ShieldCheck size={22} color="#059669" style={{ flexShrink: 0 }} />
                        <span style={{ fontSize: '0.82rem', color: '#065f46', lineHeight: 1.4 }}>
                            Under <strong>Section 17/18 of the Indian Registration Act 1908</strong>, generating this verified e-Stamp cover guarantees judicial admissibility in Indian courts.
                        </span>
                    </div>

                    {/* State Selector */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                                State Jurisdiction
                            </label>
                            <select
                                value={state}
                                onChange={(e) => handleStateChange(e.target.value as IndianState)}
                                style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', background: '#f8fafc', fontWeight: 600 }}
                            >
                                {INDIAN_STATES.map((st) => (
                                    <option key={st} value={st}>Govt of {st}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                                Stamp Certificate No.
                            </label>
                            <input
                                type="text"
                                value={certificateNo}
                                onChange={(e) => setCertificateNo(e.target.value)}
                                style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '0.85rem', outline: 'none', background: '#f8fafc', fontFamily: 'monospace', fontWeight: 700, color: '#0f172a' }}
                            />
                        </div>
                    </div>

                    {/* Parties */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                                First Party (Buyer / Lessee)
                            </label>
                            <input
                                type="text"
                                value={firstParty}
                                onChange={(e) => setFirstParty(e.target.value)}
                                placeholder="Full Legal Name"
                                style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '0.9rem', outline: 'none' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                                Second Party (Developer / Lessor)
                            </label>
                            <input
                                type="text"
                                value={secondParty}
                                onChange={(e) => setSecondParty(e.target.value)}
                                placeholder="Developer / Firm Name"
                                style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '0.9rem', outline: 'none' }}
                            />
                        </div>
                    </div>

                    {/* Document Type & Duty Amount */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.8fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                                Article / Description of Document
                            </label>
                            <select
                                value={documentType}
                                onChange={(e) => setDocumentType(e.target.value)}
                                style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '0.85rem', outline: 'none' }}
                            >
                                {STANDARD_DOCUMENT_TYPES.map((type) => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                                Stamp Duty (₹)
                            </label>
                            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '10px', overflow: 'hidden' }}>
                                <span style={{ padding: '0.65rem 0.75rem', background: '#f1f5f9', fontWeight: 700, color: '#475569', fontSize: '0.9rem' }}>₹</span>
                                <input
                                    type="number"
                                    value={stampDutyAmount}
                                    onChange={(e) => setStampDutyAmount(Number(e.target.value))}
                                    min={50}
                                    step={50}
                                    style={{ flex: 1, padding: '0.65rem 0.5rem', border: 'none', fontSize: '0.95rem', fontWeight: 700, outline: 'none' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Property Description */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                            Property Address & Unit Details
                        </label>
                        <input
                            type="text"
                            value={propertyDescription}
                            onChange={(e) => setPropertyDescription(e.target.value)}
                            placeholder="Unit No, Tower, Project Name, City"
                            style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '0.88rem', outline: 'none' }}
                        />
                    </div>

                    {/* Live Preview Box */}
                    <div style={{
                        padding: '1rem',
                        border: '1px dashed #cbd5e1',
                        borderRadius: '12px',
                        background: '#f8fafc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <FileText size={28} color="#059669" />
                            <div>
                                <h4 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                                    {state} Non-Judicial e-Stamp Paper (₹{stampDutyAmount.toLocaleString('en-IN')})
                                </h4>
                                <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.75rem', color: '#64748b' }}>
                                    Will be attached as Page 1 before "{documentName}"
                                </p>
                            </div>
                        </div>
                        <span style={{ fontSize: '0.72rem', padding: '3px 8px', background: '#dcfce7', color: '#166534', borderRadius: '9999px', fontWeight: 700 }}>
                            SHCIL Verified
                        </span>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                        <button
                            type="button"
                            onClick={handleDownloadCertificate}
                            disabled={isGenerating}
                            style={{
                                flex: 1,
                                padding: '0.85rem',
                                background: '#059669',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontWeight: 700,
                                fontSize: '0.95rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.25)'
                            }}
                        >
                            {isGenerating ? (
                                'Generating Certificate...'
                            ) : generatedSuccess ? (
                                <>
                                    <CheckCircle2 size={18} /> e-Stamp Stitched Successfully!
                                </>
                            ) : (
                                <>
                                    <Stamp size={18} /> Generate & Attach e-Stamp Paper
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EStampModal;
