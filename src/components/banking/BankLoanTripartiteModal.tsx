import React, { useState } from 'react';
import { PRECONFIGURED_BANK_APFS, generatePermissionToMortgageNoc, generateTripartiteLoanAgreementPdf } from '../../lib/tripartiteLoanEngine';
import type { BankAPFInfo, TripartiteParams } from '../../lib/tripartiteLoanEngine';
import { X, Landmark, FileText, Download, ShieldCheck, CheckCircle2, Building, Percent, Phone, Sparkles } from 'lucide-react';

interface BankLoanTripartiteModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectName?: string;
    unitNumber?: string;
    allotteeName?: string;
    reraNumber?: string;
    totalConsideration?: number;
    developerName?: string;
}

export const BankLoanTripartiteModal: React.FC<BankLoanTripartiteModalProps> = ({
    isOpen,
    onClose,
    projectName = 'Prestige Falcon City - Phase 2',
    unitNumber = 'Tower B, Flat 1404 (3BHK)',
    allotteeName = 'Rahul & Priya Sharma',
    reraNumber = 'PRM/KA/RERA/1251/310/PR/170915/000234',
    totalConsideration = 16500000,
    developerName = 'Prestige Estates Projects Ltd'
}) => {
    const [selectedBankId, setSelectedBankId] = useState<string>('sbi');
    const [loanAmount, setLoanAmount] = useState<number>(() => Math.round(totalConsideration * 0.8));
    const [isGeneratingNoc, setIsGeneratingNoc] = useState(false);
    const [isGeneratingTripartite, setIsGeneratingTripartite] = useState(false);
    const [statusToast, setStatusToast] = useState<string | null>(null);

    if (!isOpen) return null;

    const selectedBank: BankAPFInfo = PRECONFIGURED_BANK_APFS.find(b => b.bankId === selectedBankId) || PRECONFIGURED_BANK_APFS[0];

    const params: TripartiteParams = {
        projectName,
        unitNumber,
        reraNumber,
        developerName,
        allotteeName,
        bankName: selectedBank.bankName,
        apfCode: selectedBank.apfProjectCode,
        totalConsideration,
        sanctionedLoanAmount: loanAmount,
        escrowAccount: selectedBank.escrowAccountDesignated
    };

    const handleDownloadNoc = async () => {
        setIsGeneratingNoc(true);
        try {
            const pdfBytes = await generatePermissionToMortgageNoc(params);
            const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Builder_PTM_NOC_${selectedBank.shortName}_${unitNumber.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            setStatusToast(`Builder Permission To Mortgage NOC for ${selectedBank.shortName} exported!`);
        } catch (err) {
            console.error(err);
            alert('Error generating Permission to Mortgage NOC');
        } finally {
            setIsGeneratingNoc(false);
        }
    };

    const handleDownloadTripartite = async () => {
        setIsGeneratingTripartite(true);
        try {
            const pdfBytes = await generateTripartiteLoanAgreementPdf(params);
            const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Tripartite_Agreement_${selectedBank.shortName}_${unitNumber.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            setStatusToast(`Tripartite Home Loan Agreement for ${selectedBank.shortName} exported!`);
        } catch (err) {
            console.error(err);
            alert('Error generating Tripartite Agreement');
        } finally {
            setIsGeneratingTripartite(false);
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
                maxWidth: '720px',
                maxHeight: '92vh',
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
                    background: 'linear-gradient(135deg, #0f2b48 0%, #1e40af 100%)',
                    color: 'white',
                    borderRadius: '20px 20px 0 0'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ padding: '8px', background: 'rgba(255,255,255,0.15)', borderRadius: '10px' }}>
                            <Landmark size={24} color="#93c5fd" />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                                Bank APF & Tripartite Loan Engine
                            </h2>
                            <p style={{ fontSize: '0.8rem', color: '#bfdbfe', margin: '0.2rem 0 0 0' }}>
                                Pre-approved Project Approvals & Builder Mortgage NOC
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{ background: 'transparent', border: 'none', color: '#bfdbfe', cursor: 'pointer', padding: '4px' }}
                    >
                        <X size={22} />
                    </button>
                </div>

                {/* Form Body */}
                <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {statusToast && (
                        <div style={{ padding: '0.75rem 1rem', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '10px', color: '#065f46', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <CheckCircle2 size={16} color="#059669" /> {statusToast}
                        </div>
                    )}

                    {/* Lender Selector */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                            Select Approved APF Home Loan Lender
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem' }}>
                            {PRECONFIGURED_BANK_APFS.map(b => (
                                <div
                                    key={b.bankId}
                                    onClick={() => setSelectedBankId(b.bankId)}
                                    style={{
                                        padding: '0.65rem',
                                        borderRadius: '10px',
                                        border: `2px solid ${selectedBankId === b.bankId ? '#2563eb' : '#e2e8f0'}`,
                                        background: selectedBankId === b.bankId ? '#eff6ff' : '#ffffff',
                                        cursor: 'pointer',
                                        textAlign: 'center'
                                    }}
                                >
                                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>{b.shortName}</div>
                                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{b.roiRange.split('-')[0]} ROI</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Selected Bank Details Card */}
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <div>
                                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>{selectedBank.bankName}</h4>
                                <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', color: '#64748b' }}>Branch: {selectedBank.branchName}</p>
                            </div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1e40af', background: '#dbeafe', padding: '3px 8px', borderRadius: '6px' }}>
                                APF Code: {selectedBank.apfProjectCode}
                            </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.85rem', paddingTop: '0.85rem', borderTop: '1px solid #e2e8f0', fontSize: '0.8rem' }}>
                            <div>
                                <span style={{ color: '#64748b' }}>Designated RERA Escrow:</span>
                                <div style={{ fontWeight: 700, color: '#059669', fontSize: '0.78rem', marginTop: '0.1rem' }}>{selectedBank.escrowAccountDesignated}</div>
                            </div>
                            <div>
                                <span style={{ color: '#64748b' }}>Mortgage Desk Contact:</span>
                                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.78rem', marginTop: '0.1rem' }}>{selectedBank.contactManager} ({selectedBank.managerPhone})</div>
                            </div>
                        </div>
                    </div>

                    {/* Loan Sanction Input */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                                Agreement Value (₹)
                            </label>
                            <input
                                type="text"
                                readOnly
                                value={`₹ ${totalConsideration.toLocaleString('en-IN')}`}
                                style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '0.9rem', background: '#f1f5f9', fontWeight: 700, color: '#475569' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                                Sanctioned Home Loan Amount (₹)
                            </label>
                            <input
                                type="number"
                                value={loanAmount}
                                onChange={(e) => setLoanAmount(Number(e.target.value))}
                                step={100000}
                                style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 700, outline: 'none' }}
                            />
                            <div style={{ fontSize: '0.72rem', color: '#059669', marginTop: '0.2rem', fontWeight: 600 }}>
                                {((loanAmount / totalConsideration) * 100).toFixed(1)}% LTV Ratio (Max {selectedBank.maxLtvPercent}%)
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem' }}>
                        <button
                            type="button"
                            onClick={handleDownloadNoc}
                            disabled={isGeneratingNoc}
                            style={{
                                padding: '0.85rem',
                                background: '#059669',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontWeight: 700,
                                fontSize: '0.88rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.4rem',
                                boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.25)'
                            }}
                        >
                            <FileText size={17} /> {isGeneratingNoc ? 'Generating NOC...' : 'Export Builder PTM / NOC (PDF)'}
                        </button>

                        <button
                            type="button"
                            onClick={handleDownloadTripartite}
                            disabled={isGeneratingTripartite}
                            style={{
                                padding: '0.85rem',
                                background: '#1e40af',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontWeight: 700,
                                fontSize: '0.88rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.4rem',
                                boxShadow: '0 4px 6px -1px rgba(30, 64, 175, 0.25)'
                            }}
                        >
                            <Landmark size={17} /> {isGeneratingTripartite ? 'Generating Agreement...' : 'Export Tripartite Agreement (PDF)'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BankLoanTripartiteModal;
