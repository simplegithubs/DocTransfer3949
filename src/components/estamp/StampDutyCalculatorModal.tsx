import React, { useState } from 'react';
import type { IndianState } from '../../lib/eStampGenerator';
import { calculateStampDuty, generateStampDutyAssessmentPdf } from '../../lib/stampDutyCalculator';
import type { StampDutyInput, StampDutyResult } from '../../lib/stampDutyCalculator';
import { X, Calculator, ShieldCheck, Download, Sparkles, Building, Info, FileCheck } from 'lucide-react';

interface StampDutyCalculatorModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialAgreementValue?: number;
    initialState?: IndianState;
    propertyName?: string;
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

export const StampDutyCalculatorModal: React.FC<StampDutyCalculatorModalProps> = ({
    isOpen,
    onClose,
    initialAgreementValue = 8500000,
    initialState = 'Maharashtra',
    propertyName = 'Unit 1402, Tower B, Godrej Woodsman'
}) => {
    const [state, setState] = useState<IndianState>(initialState);
    const [agreementValue, setAgreementValue] = useState<number>(initialAgreementValue);
    const [readyReckonerValue, setReadyReckonerValue] = useState<number>(initialAgreementValue * 0.9);
    const [buyerGender, setBuyerGender] = useState<'male' | 'female' | 'joint' | 'company'>('male');
    const [locationType, setLocationType] = useState<'urban_municipal' | 'gram_panchayat' | 'special_investment_region'>('urban_municipal');
    const [isMetroArea, setIsMetroArea] = useState<boolean>(true);
    const [propertyType, setPropertyType] = useState<'residential_apartment' | 'commercial_office' | 'residential_plot' | 'agricultural_land'>('residential_apartment');
    const [isExporting, setIsExporting] = useState(false);

    if (!isOpen) return null;

    const inputParams: StampDutyInput = {
        state,
        agreementValue,
        readyReckonerValue,
        buyerGender,
        locationType,
        isMetroArea,
        propertyType
    };

    const result: StampDutyResult = calculateStampDuty(inputParams);

    const handleDownloadAssessment = async () => {
        setIsExporting(true);
        try {
            const pdfBytes = await generateStampDutyAssessmentPdf(inputParams, result, propertyName);
            const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `StampDuty_Assessment_${state}_${Date.now()}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Failed to generate stamp duty assessment sheet:', err);
            alert('Error exporting Stamp Duty assessment sheet.');
        } finally {
            setIsExporting(false);
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
                maxWidth: '740px',
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
                    background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
                    color: 'white',
                    borderRadius: '20px 20px 0 0'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ padding: '8px', background: 'rgba(255,255,255,0.15)', borderRadius: '10px' }}>
                            <Calculator size={24} color="#93c5fd" />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                                State-Wise Stamp Duty & Ready Reckoner Engine
                            </h2>
                            <p style={{ fontSize: '0.8rem', color: '#bfdbfe', margin: '0.2rem 0 0 0' }}>
                                Inspector General of Registration (IGR) Statutory Assessment
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
                    {/* Inputs Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                                State
                            </label>
                            <select
                                value={state}
                                onChange={(e) => setState(e.target.value as IndianState)}
                                style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', fontWeight: 600 }}
                            >
                                {INDIAN_STATES.map((st) => (
                                    <option key={st} value={st}>{st}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                                Buyer Category & Gender
                            </label>
                            <select
                                value={buyerGender}
                                onChange={(e) => setBuyerGender(e.target.value as any)}
                                style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '0.9rem', outline: 'none' }}
                            >
                                <option value="male">Male (Standard Rate)</option>
                                <option value="female">Female (1-2% Statutory Rebate)</option>
                                <option value="joint">Joint (Male + Female)</option>
                                <option value="company">Corporate / LLP / Partnership</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                                Agreement Value (₹)
                            </label>
                            <input
                                type="number"
                                value={agreementValue}
                                onChange={(e) => setAgreementValue(Number(e.target.value))}
                                step={50000}
                                style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 700, outline: 'none' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                                Ready Reckoner / Circle Rate Base (₹)
                            </label>
                            <input
                                type="number"
                                value={readyReckonerValue}
                                onChange={(e) => setReadyReckonerValue(Number(e.target.value))}
                                step={50000}
                                style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 700, outline: 'none' }}
                            />
                        </div>
                    </div>

                    {/* Location and Metro Cess Options */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1rem', alignItems: 'center' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                                Municipal Jurisdiction
                            </label>
                            <select
                                value={locationType}
                                onChange={(e) => setLocationType(e.target.value as any)}
                                style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '0.88rem', outline: 'none' }}
                            >
                                <option value="urban_municipal">Urban Corporation / Municipal Limit</option>
                                <option value="gram_panchayat">Gram Panchayat / Rural</option>
                                <option value="special_investment_region">Special Investment Region (SIR/SEZ)</option>
                            </select>
                        </div>

                        <div style={{ paddingTop: '1.4rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: '#1e293b' }}>
                                <input
                                    type="checkbox"
                                    checked={isMetroArea}
                                    onChange={(e) => setIsMetroArea(e.target.checked)}
                                    style={{ width: '16px', height: '16px', accentColor: '#2563eb' }}
                                />
                                Include 1% Metro Cess (MMRDA/BBMP)
                            </label>
                        </div>
                    </div>

                    {/* Results Box */}
                    <div style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '16px',
                        padding: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Taxable Consideration Base</span>
                            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>₹{result.taxableConsideration.toLocaleString('en-IN')}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Stamp Duty ({result.stampDutyRate}%)</span>
                            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>₹{result.stampDutyAmount.toLocaleString('en-IN')}</span>
                        </div>
                        {result.cessSurchargeAmount > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Metro / Local Body Surcharge ({result.cessSurchargeRate}%)</span>
                                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>₹{result.cessSurchargeAmount.toLocaleString('en-IN')}</span>
                            </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Registration Fee (IGR)</span>
                            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>₹{result.registrationFeeAmount.toLocaleString('en-IN')}</span>
                        </div>
                        {result.femaleConcessionSavings > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ecfdf5', padding: '0.4rem 0.6rem', borderRadius: '8px' }}>
                                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#047857' }}>👩 Female Buyer Rebate Savings</span>
                                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#047857' }}>- ₹{result.femaleConcessionSavings.toLocaleString('en-IN')}</span>
                            </div>
                        )}

                        <div style={{
                            borderTop: '2px dashed #cbd5e1',
                            paddingTop: '0.75rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>Total Statutory Payable</h3>
                                <p style={{ margin: '0.1rem 0 0 0', fontSize: '0.75rem', color: '#64748b' }}>{result.stateRuleSummary}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1e40af' }}>
                                    ₹{result.totalStatutoryCharges.toLocaleString('en-IN')}
                                </span>
                                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>({result.effectivePercentage}% of property value)</div>
                            </div>
                        </div>
                    </div>

                    {/* Download Assessment Action */}
                    <button
                        type="button"
                        onClick={handleDownloadAssessment}
                        disabled={isExporting}
                        style={{
                            padding: '0.85rem',
                            background: '#1e40af',
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
                            boxShadow: '0 4px 6px -1px rgba(30, 64, 175, 0.25)'
                        }}
                    >
                        <FileCheck size={18} /> {isExporting ? 'Exporting Assessment...' : 'Export Formal Assessment Sheet (PDF)'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StampDutyCalculatorModal;
