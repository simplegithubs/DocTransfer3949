import React, { useState } from 'react';
import {
    calculateCPCommission,
    generateCPCommissionDisbursementPdf
} from '../../lib/cpCommissionEngine';
import type {
    CPCommissionInput,
    CPCommissionResult
} from '../../lib/cpCommissionEngine';
import {
    Users,
    Percent,
    ShieldCheck,
    Download,
    CheckCircle2,
    FileText,
    Building,
    Phone,
    Receipt,
    Calculator,
    Sparkles
} from 'lucide-react';

interface CPCommissionLedgerProps {
    projectName?: string;
    unitNumber?: string;
    allotteeName?: string;
    totalConsideration?: number;
    brokerName?: string;
    brokerPhone?: string;
    developerName?: string;
}

export const CPCommissionLedger: React.FC<CPCommissionLedgerProps> = ({
    projectName = 'Prestige Falcon City - Phase 2',
    unitNumber = 'Tower B, Flat 1404 (3BHK)',
    allotteeName = 'Rahul & Priya Sharma',
    totalConsideration = 16500000,
    brokerName = 'Apex Realty Advisory',
    brokerPhone = '+91 98765 43210',
    developerName = 'Prestige Estates Projects Ltd'
}) => {
    const [cpName, setCpName] = useState(brokerName);
    const [reraBrokerId, setReraBrokerId] = useState('PRM/KA/RERA/1251/310/AG/180210/00142');
    const [brokerPan, setBrokerPan] = useState('AABCA1234F');
    const [brokerGstin, setBrokerGstin] = useState('29AABCA1234F1Z8');
    const [commissionPercent, setCommissionPercent] = useState<number>(2.0); // 2%
    const [isGstRegistered, setIsGstRegistered] = useState<boolean>(true);
    const [kickerBonus, setKickerBonus] = useState<number>(25000);
    const [isExporting, setIsExporting] = useState(false);
    const [toastMsg, setToastMsg] = useState<string | null>(null);

    const inputParams: CPCommissionInput = {
        brokerName: cpName,
        brokerFirmName: 'Apex Advisory Pvt Ltd',
        reraBrokerRegNo: reraBrokerId,
        brokerPan,
        brokerGstin,
        brokerPhone,
        projectName,
        unitNumber,
        allotteeName,
        agreementValue: totalConsideration,
        commissionPercent,
        isGstRegistered,
        isTdsApplicable: true,
        kickerBonusAmount: kickerBonus
    };

    const result: CPCommissionResult = calculateCPCommission(inputParams);

    const handleExportVoucher = async () => {
        setIsExporting(true);
        try {
            const pdfBytes = await generateCPCommissionDisbursementPdf(inputParams, result, developerName);
            const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `CP_Commission_Voucher_${cpName.replace(/[^a-zA-Z0-9]/g, '_')}_${unitNumber.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            setToastMsg(`Official RERA CP Commission Voucher for ${cpName} exported!`);
        } catch (err) {
            console.error('Failed to export voucher:', err);
            alert('Error generating CP Commission voucher.');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div style={{
            background: 'white',
            borderRadius: '20px',
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
                        <Receipt size={22} color="#4338ca" />
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                            Channel Partner (CP) Commission & TDS Ledger
                        </h3>
                        <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                            RERA Form G Broker Mandate, 18% GST & Section 194H (5% TDS) Accounting
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleExportVoucher}
                    disabled={isExporting}
                    style={{
                        padding: '0.55rem 0.95rem',
                        background: '#047857',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        boxShadow: '0 2px 6px rgba(4, 120, 87, 0.25)'
                    }}
                >
                    <Download size={15} /> {isExporting ? 'Exporting Voucher...' : 'Export Tax Voucher (PDF)'}
                </button>
            </div>

            {toastMsg && (
                <div style={{ padding: '0.75rem 1.5rem', background: '#ecfdf5', borderBottom: '1px solid #a7f3d0', color: '#065f46', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} color="#059669" /> {toastMsg}
                </div>
            )}

            {/* Form & Calculation Area */}
            <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
                {/* Left: Configuration */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                                Channel Partner / Broker Name
                            </label>
                            <input
                                type="text"
                                value={cpName}
                                onChange={(e) => setCpName(e.target.value)}
                                style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.88rem', outline: 'none' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                                RERA Broker Registration ID
                            </label>
                            <input
                                type="text"
                                value={reraBrokerId}
                                onChange={(e) => setReraBrokerId(e.target.value)}
                                style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.82rem', fontFamily: 'monospace', outline: 'none', fontWeight: 700, color: '#059669' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                                Broker PAN
                            </label>
                            <input
                                type="text"
                                value={brokerPan}
                                onChange={(e) => setBrokerPan(e.target.value)}
                                style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'monospace', outline: 'none', fontWeight: 700 }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                                Broker GSTIN (15-Digit)
                            </label>
                            <input
                                type="text"
                                value={brokerGstin}
                                onChange={(e) => setBrokerGstin(e.target.value)}
                                style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'monospace', outline: 'none', fontWeight: 700 }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem', alignItems: 'center' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                                Commission Slab Rate (%)
                            </label>
                            <div style={{ display: 'flex', gap: '0.35rem' }}>
                                {[1.5, 2.0, 2.5, 3.0].map(pct => (
                                    <button
                                        key={pct}
                                        type="button"
                                        onClick={() => setCommissionPercent(pct)}
                                        style={{
                                            flex: 1,
                                            padding: '0.45rem',
                                            borderRadius: '6px',
                                            border: `1.5px solid ${commissionPercent === pct ? '#4338ca' : '#cbd5e1'}`,
                                            background: commissionPercent === pct ? '#e0e7ff' : '#f8fafc',
                                            color: commissionPercent === pct ? '#4338ca' : '#334155',
                                            fontWeight: 700,
                                            fontSize: '0.82rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {pct}%
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                                Kicker Incentive (₹)
                            </label>
                            <input
                                type="number"
                                value={kickerBonus}
                                onChange={(e) => setKickerBonus(Number(e.target.value))}
                                step={5000}
                                style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.88rem', fontWeight: 700, outline: 'none' }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, color: '#1e293b' }}>
                            <input
                                type="checkbox"
                                checked={isGstRegistered}
                                onChange={(e) => setIsGstRegistered(e.target.checked)}
                                style={{ width: '16px', height: '16px', accentColor: '#4338ca' }}
                            />
                            Channel Partner is GST Registered (Adds +18% CGST/SGST with ITC Claim)
                        </label>
                    </div>
                </div>

                {/* Right: Live Calculation Card */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                        Live Brokerage Payout Slip
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span style={{ color: '#64748b' }}>Base Brokerage ({commissionPercent}% of ₹{totalConsideration.toLocaleString('en-IN')})</span>
                        <span style={{ fontWeight: 700, color: '#0f172a' }}>₹{result.baseBrokerageAmount.toLocaleString('en-IN')}</span>
                    </div>

                    {result.kickerBonus > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                            <span style={{ color: '#64748b' }}>Target Kicker Bonus</span>
                            <span style={{ fontWeight: 700, color: '#059669' }}>+ ₹{result.kickerBonus.toLocaleString('en-IN')}</span>
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span style={{ color: '#64748b' }}>Gross Brokerage (Taxable Value)</span>
                        <span style={{ fontWeight: 700, color: '#0f172a' }}>₹{result.totalBrokerageBeforeTax.toLocaleString('en-IN')}</span>
                    </div>

                    {result.gstAmount > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#1e40af' }}>
                            <span>+ 18% GST (CGST 9% + SGST 9%)</span>
                            <span style={{ fontWeight: 700 }}>+ ₹{result.gstAmount.toLocaleString('en-IN')}</span>
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#dc2626' }}>
                        <span>- 5% TDS u/s 194H (IT Act 1961)</span>
                        <span style={{ fontWeight: 700 }}>- ₹{result.tdsDeductionAmount.toLocaleString('en-IN')}</span>
                    </div>

                    <div style={{ borderTop: '2px dashed #cbd5e1', paddingTop: '0.75rem', marginTop: '0.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>Net Disbursable Payout:</div>
                            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Via RTGS / NEFT to Broker</div>
                        </div>
                        <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#047857' }}>
                            ₹{result.netPayableAmount.toLocaleString('en-IN')}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CPCommissionLedger;
