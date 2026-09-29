import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Building2,
    ShieldCheck,
    CheckCircle2,
    Clock,
    CreditCard,
    FileCheck,
    Upload,
    Users,
    MessageCircle,
    ArrowRight,
    Lock,
    Scale,
    FileText,
    Sparkles,
    AlertCircle,
    Download,
    Eye,
    ChevronRight,
    DollarSign,
    Check,
    Stamp,
    Calculator,
    Landmark,
    Receipt
} from 'lucide-react';
import EStampModal from '../estamp/EStampModal';
import StampDutyCalculatorModal from '../estamp/StampDutyCalculatorModal';
import MultiPartySignerMatrix from './MultiPartySignerMatrix';
import IndianBuyerKycVault from '../kyc/IndianBuyerKycVault';
import BankLoanTripartiteModal from '../banking/BankLoanTripartiteModal';
import DemandNoteGeneratorModal from '../demand-notes/DemandNoteGeneratorModal';
import CPCommissionLedger from '../channel-partner/CPCommissionLedger';

interface DealMilestone {
    id: string;
    title: string;
    hindiTitle?: string;
    description: string;
    status: 'completed' | 'in_progress' | 'pending';
    amount?: number;
    completedDate?: string;
}

export interface RealEstateClosingRoomProps {
    dealId?: string;
    projectName?: string;
    unitNumber?: string;
    allotteeName?: string;
    reraNumber?: string;
    totalConsideration?: number;
    tokenAmount?: number;
    brokerName?: string;
    brokerPhone?: string;
    onClose?: () => void;
}

export const RealEstateClosingRoom: React.FC<RealEstateClosingRoomProps> = ({
    dealId = 'DT-DEAL-84920',
    projectName = 'Prestige Falcon City - Phase 2',
    unitNumber = 'Tower B, Flat 1404 (3BHK, 1450 sq. ft.)',
    allotteeName = 'Rahul & Priya Sharma',
    reraNumber = 'PRM/KA/RERA/1251/310/PR/170915/000234',
    totalConsideration = 16500000,
    tokenAmount = 50000,
    brokerName = 'Apex Realty Advisory',
    brokerPhone = '+919876543210',
    onClose
}) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'milestones' | 'kyc' | 'signing' | 'documents' | 'banking' | 'demand_notes' | 'cp_commission'>('milestones');
    const [tokenPaid, setTokenPaid] = useState(false);
    const [payingToken, setPayingToken] = useState(false);
    const [statusToast, setStatusToast] = useState<{ type: 'success' | 'info'; text: string } | null>(null);

    // Modal State
    const [showEStampModal, setShowEStampModal] = useState(false);
    const [showDutyCalculatorModal, setShowDutyCalculatorModal] = useState(false);
    const [showBankLoanModal, setShowBankLoanModal] = useState(false);
    const [showDemandNoteModal, setShowDemandNoteModal] = useState(false);
    const [eStampAttached, setEStampAttached] = useState(false);

    const [milestones, setMilestones] = useState<DealMilestone[]>([
        {
            id: 'm1',
            title: '1. Token Advance & Expression of Interest (EOI)',
            hindiTitle: 'टोकन रक्कम व प्राथमिक नोंदणी',
            description: 'Immediate unit block holding deposit to lock inventory and rates.',
            status: tokenPaid ? 'completed' : 'in_progress',
            amount: tokenAmount,
            completedDate: tokenPaid ? 'Today' : undefined
        },
        {
            id: 'm2',
            title: '2. Buyer KYC & Legal Title Verification',
            hindiTitle: 'केवायसी व कायदेशीर छाननी',
            description: 'Aadhaar, PAN & 30-year Encumbrance Certificate (EC) scrutiny sign-off.',
            status: tokenPaid ? 'in_progress' : 'pending'
        },
        {
            id: 'm3',
            title: '3. Execution of RERA Builder-Buyer Agreement (BBA)',
            hindiTitle: 'महारेरा / रेरा अधिकृत विक्री करार',
            description: '10% milestone agreement with Section 65B digital audit certificate.',
            status: 'pending',
            amount: 1650000
        },
        {
            id: 'm4',
            title: '4. Bank APF Home Loan Sanction & Construction Milestones',
            hindiTitle: 'गृहकर्ज मंजुरी व बांधकाम टप्पे',
            description: 'Direct disbursement from SBI / HDFC / ICICI approved project APF line.',
            status: 'pending'
        },
        {
            id: 'm5',
            title: '5. Occupancy Certificate (OC) & Key Handover',
            hindiTitle: 'भोगवटा प्रमाणपत्र व ताबा पत्र',
            description: 'Final physical possession, BESCOM/MSEDCL meter handover, and key delivery.',
            status: 'pending'
        }
    ]);

    // Handle Token Advance Payment via Razorpay
    const handlePayToken = () => {
        setPayingToken(true);
        const rzpKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

        // If Razorpay SDK is available on window
        if ((window as any).Razorpay && rzpKey) {
            const options = {
                key: rzpKey,
                amount: tokenAmount * 100, // in paise
                currency: 'INR',
                name: projectName,
                description: `Booking Token for Unit ${unitNumber}`,
                handler: function (response: any) {
                    setPayingToken(false);
                    setTokenPaid(true);
                    setMilestones(prev => prev.map(m => m.id === 'm1' ? { ...m, status: 'completed', completedDate: new Date().toLocaleDateString('en-IN') } : m.id === 'm2' ? { ...m, status: 'in_progress' } : m));
                    setStatusToast({
                        type: 'success',
                        text: `Payment of ₹${tokenAmount.toLocaleString('en-IN')} received successfully! Unit reserved.`
                    });
                },
                prefill: {
                    name: allotteeName,
                    contact: brokerPhone
                },
                theme: {
                    color: '#059669'
                }
            };
            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } else {
            // Simulated payment fallback for demo / test environments
            setTimeout(() => {
                setPayingToken(false);
                setTokenPaid(true);
                setMilestones(prev => prev.map(m => m.id === 'm1' ? { ...m, status: 'completed', completedDate: new Date().toLocaleDateString('en-IN') } : m.id === 'm2' ? { ...m, status: 'in_progress' } : m));
                setStatusToast({
                    type: 'success',
                    text: `Token Advance of ₹${tokenAmount.toLocaleString('en-IN')} confirmed! Provisional Allotment generated.`
                });
            }, 800);
        }
    };

    const handleWhatsAppBroker = () => {
        const msg = `Hi ${brokerName}, I am in the PropTech Closing Room for "${projectName}" (Unit: ${unitNumber}, Deal ID: ${dealId}). I would like to discuss next steps regarding agreement execution and bank loan sanction.`;
        const phone = brokerPhone.replace(/[^0-9]/g, '');
        window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(msg)}`, '_blank');
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
            {/* Top Deal Room Navigation Bar */}
            <header style={{
                background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)',
                color: 'white',
                padding: '1.25rem 2rem',
                boxShadow: '0 4px 20px -4px rgba(6, 78, 59, 0.4)',
                position: 'sticky',
                top: 0,
                zIndex: 40
            }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '0.6rem', borderRadius: '12px', display: 'flex' }}>
                            <Building2 size={24} color="#ffffff" />
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
                                    {projectName}
                                </h1>
                                <span style={{ background: '#ecfdf5', color: '#065f46', fontSize: '0.7rem', fontWeight: 800, padding: '0.15rem 0.6rem', borderRadius: '6px' }}>
                                    RERA DEAL ROOM
                                </span>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#a7f3d0', marginTop: '0.2rem' }}>
                                Unit: {unitNumber} • Allottee: <strong>{allotteeName}</strong> • Deal Ref: #{dealId}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                        <button
                            type="button"
                            onClick={() => setShowEStampModal(true)}
                            style={{
                                background: 'rgba(255, 255, 255, 0.15)',
                                color: 'white',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                padding: '0.55rem 0.9rem',
                                borderRadius: '10px',
                                fontWeight: 700,
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem'
                            }}
                        >
                            <Stamp size={15} color="#34d399" /> {eStampAttached ? '✓ e-Stamp Attached' : 'Attach State e-Stamp'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowDutyCalculatorModal(true)}
                            style={{
                                background: 'rgba(255, 255, 255, 0.15)',
                                color: 'white',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                padding: '0.55rem 0.9rem',
                                borderRadius: '10px',
                                fontWeight: 700,
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem'
                            }}
                        >
                            <Calculator size={15} color="#93c5fd" /> Stamp Duty Calc
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowBankLoanModal(true)}
                            style={{
                                background: 'rgba(255, 255, 255, 0.15)',
                                color: 'white',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                padding: '0.55rem 0.9rem',
                                borderRadius: '10px',
                                fontWeight: 700,
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem'
                            }}
                        >
                            <Landmark size={15} color="#cbd5e1" /> Bank APF & NOC
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowDemandNoteModal(true)}
                            style={{
                                background: 'rgba(255, 255, 255, 0.15)',
                                color: 'white',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                padding: '0.55rem 0.9rem',
                                borderRadius: '10px',
                                fontWeight: 700,
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem'
                            }}
                        >
                            <Building2 size={15} color="#fde047" /> Demand Note
                        </button>
                        <button
                            onClick={handleWhatsAppBroker}
                            style={{
                                background: '#25d366',
                                color: 'white',
                                border: 'none',
                                padding: '0.55rem 1.1rem',
                                borderRadius: '10px',
                                fontWeight: 700,
                                fontSize: '0.82rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)'
                            }}
                        >
                            <MessageCircle size={16} /> WhatsApp Broker
                        </button>
                        {onClose && (
                            <button
                                onClick={onClose}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.15)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.55rem 1rem',
                                    borderRadius: '10px',
                                    fontWeight: 600,
                                    fontSize: '0.82rem',
                                    cursor: 'pointer'
                                }}
                            >
                                Back
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Notification Toast */}
            {statusToast && (
                <div style={{
                    maxWidth: '1280px',
                    margin: '1rem auto 0',
                    padding: '0.75rem 1.5rem',
                    background: statusToast.type === 'success' ? '#ecfdf5' : '#eff6ff',
                    border: `1px solid ${statusToast.type === 'success' ? '#a7f3d0' : '#bfdbfe'}`,
                    borderRadius: '12px',
                    color: statusToast.type === 'success' ? '#065f46' : '#1e40af',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.85rem',
                    fontWeight: 600
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CheckCircle2 size={18} color="#059669" />
                        <span>{statusToast.text}</span>
                    </div>
                    <button
                        onClick={() => setStatusToast(null)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 800 }}
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Main Content Hub */}
            <main style={{ maxWidth: '1280px', margin: '2rem auto', padding: '0 1.5rem', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                
                {/* Left Column: Deal Milestones & Navigation */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    
                    {/* Navigation Tabs */}
                    <div style={{ display: 'flex', gap: '0.4rem', background: '#e2e8f0', padding: '0.35rem', borderRadius: '12px', flexWrap: 'wrap' }}>
                        {[
                            { id: 'milestones', label: '🚀 Milestones' },
                            { id: 'signing', label: '👥 Multi-Signers' },
                            { id: 'banking', label: '🏦 Bank APF & NOC' },
                            { id: 'demand_notes', label: '🏗️ Demand Notes' },
                            { id: 'cp_commission', label: '💼 Broker (CP)' },
                            { id: 'kyc', label: '🪪 Buyer KYC' },
                            { id: 'documents', label: '📜 Title Pack' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                style={{
                                    flex: 1,
                                    minWidth: '100px',
                                    padding: '0.65rem 0.65rem',
                                    borderRadius: '9px',
                                    border: 'none',
                                    background: activeTab === tab.id ? 'white' : 'transparent',
                                    color: activeTab === tab.id ? '#0f172a' : '#64748b',
                                    fontWeight: 700,
                                    fontSize: '0.8rem',
                                    cursor: 'pointer',
                                    boxShadow: activeTab === tab.id ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
                                    transition: 'all 0.15s ease',
                                    whiteSpace: 'nowrap',
                                    textAlign: 'center'
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Active Tab Content */}
                    {activeTab === 'milestones' && (
                        <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <div>
                                    <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                                        Unit Acquisition Progress
                                    </h2>
                                    <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.2rem 0 0' }}>
                                        Governed strictly under RERA statutory guidelines with Section 65B digital audit protection.
                                    </p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Total Consideration</div>
                                    <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#059669' }}>
                                        ₹{totalConsideration.toLocaleString('en-IN')}
                                    </div>
                                </div>
                            </div>

                            {/* Milestone Steps Timeline */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {milestones.map((m, idx) => {
                                    const isDone = m.status === 'completed';
                                    const isCurrent = m.status === 'in_progress';
                                    return (
                                        <div
                                            key={m.id}
                                            style={{
                                                border: `1.5px solid ${isDone ? '#a7f3d0' : isCurrent ? '#059669' : '#e2e8f0'}`,
                                                background: isDone ? '#f0fdf4' : isCurrent ? '#ffffff' : '#f8fafc',
                                                borderRadius: '16px',
                                                padding: '1.25rem 1.5rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                boxShadow: isCurrent ? '0 10px 15px -3px rgba(5, 150, 105, 0.1)' : 'none'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                                <div style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '50%',
                                                    background: isDone ? '#059669' : isCurrent ? '#059669' : '#cbd5e1',
                                                    color: 'white',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontWeight: 800,
                                                    fontSize: '0.85rem',
                                                    flexShrink: 0
                                                }}>
                                                    {isDone ? <Check size={18} strokeWidth={3} /> : idx + 1}
                                                </div>
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <span style={{ fontSize: '0.95rem', fontWeight: 800, color: isDone ? '#065f46' : '#0f172a' }}>
                                                            {m.title}
                                                        </span>
                                                        {m.hindiTitle && (
                                                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                                                ({m.hindiTitle})
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.2rem 0 0' }}>
                                                        {m.description}
                                                    </p>
                                                    {m.completedDate && (
                                                        <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700, marginTop: '0.3rem' }}>
                                                            ✓ Verified on {m.completedDate}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                {m.id === 'm1' && !tokenPaid && (
                                                    <button
                                                        onClick={handlePayToken}
                                                        disabled={payingToken}
                                                        style={{
                                                            background: '#059669',
                                                            color: 'white',
                                                            border: 'none',
                                                            padding: '0.55rem 1rem',
                                                            borderRadius: '10px',
                                                            fontWeight: 700,
                                                            fontSize: '0.82rem',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.4rem',
                                                            boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
                                                        }}
                                                    >
                                                        <CreditCard size={15} /> Pay Token (₹{tokenAmount.toLocaleString('en-IN')})
                                                    </button>
                                                )}
                                                {m.id === 'm1' && tokenPaid && (
                                                    <span style={{ color: '#059669', fontWeight: 800, fontSize: '0.85rem' }}>
                                                        ✓ PAID
                                                    </span>
                                                )}
                                                {m.id === 'm3' && (
                                                    <>
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowEStampModal(true)}
                                                            style={{
                                                                background: '#ecfdf5',
                                                                color: '#065f46',
                                                                border: '1px solid #a7f3d0',
                                                                padding: '0.45rem 0.85rem',
                                                                borderRadius: '8px',
                                                                fontWeight: 700,
                                                                fontSize: '0.78rem',
                                                                cursor: 'pointer',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '0.3rem'
                                                            }}
                                                        >
                                                            <Stamp size={13} /> {eStampAttached ? 'e-Stamp ✓' : 'Attach e-Stamp'}
                                                        </button>
                                                        <button
                                                            onClick={() => setActiveTab('signing')}
                                                            style={{
                                                                background: '#1e40af',
                                                                color: 'white',
                                                                border: 'none',
                                                                padding: '0.45rem 0.85rem',
                                                                borderRadius: '8px',
                                                                fontWeight: 600,
                                                                fontSize: '0.78rem',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            Execute Deed →
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Multi-Party Signing Matrix Tab */}
                    {activeTab === 'signing' && (
                        <MultiPartySignerMatrix dealId={dealId} propertyName={projectName} />
                    )}

                    {/* Bank APF & Tripartite Tab */}
                    {activeTab === 'banking' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ background: 'white', borderRadius: '20px', padding: '1.75rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                                    <div>
                                        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                                            Bank APF Home Loan & Mortgage NOC Hub
                                        </h2>
                                        <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.2rem 0 0' }}>
                                            Approved project financial (APF) codes and instant Builder Permission to Mortgage (PTM) NOC generation.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowBankLoanModal(true)}
                                        style={{
                                            padding: '0.6rem 1.1rem',
                                            background: '#1e40af',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '10px',
                                            fontWeight: 700,
                                            fontSize: '0.82rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.4rem'
                                        }}
                                    >
                                        <Landmark size={16} /> Open APF & Tripartite Generator
                                    </button>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    {[
                                        { bank: 'State Bank of India (SBI)', apf: 'SBI-BLR-RES-2024-88912', ltv: '80%', roi: '8.35% p.a.', mgr: 'Sunil Kumar (+91 94480 12345)' },
                                        { bank: 'HDFC Bank Ltd', apf: 'HDFC-APF-MUM-440192', ltv: '85%', roi: '8.40% p.a.', mgr: 'Pooja Deshmukh (+91 98200 66778)' },
                                        { bank: 'ICICI Bank Home Finance', apf: 'ICICI-BLR-APF-00982', ltv: '80%', roi: '8.45% p.a.', mgr: 'Rajesh Nair (+91 98450 99881)' },
                                        { bank: 'Axis Bank RAC', apf: 'AXIS-NCR-RES-77610', ltv: '80%', roi: '8.50% p.a.', mgr: 'Amit Verma (+91 98100 44321)' }
                                    ].map((b, i) => (
                                        <div key={i} style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>{b.bank}</span>
                                                <span style={{ fontSize: '0.72rem', background: '#dbeafe', color: '#1e40af', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>APF APPROVED</span>
                                            </div>
                                            <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '0.4rem' }}>
                                                Code: <strong>{b.apf}</strong> • LTV: {b.ltv} • ROI: {b.roi}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                                                Desk: {b.mgr}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Milestone Demand Notes Tab */}
                    {activeTab === 'demand_notes' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ background: 'white', borderRadius: '20px', padding: '1.75rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                                    <div>
                                        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                                            RERA Construction Milestone Demand Notes
                                        </h2>
                                        <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.2rem 0 0' }}>
                                            Issue construction stage demand notes with Architect Form 1 & 5% Real Estate GST billing.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowDemandNoteModal(true)}
                                        style={{
                                            padding: '0.6rem 1.1rem',
                                            background: '#047857',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '10px',
                                            fontWeight: 700,
                                            fontSize: '0.82rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.4rem'
                                        }}
                                    >
                                        <Building2 size={16} /> Create Demand Note
                                    </button>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {[
                                        { slab: 'Plinth Level Foundation (15%)', amount: '₹24,75,000 + 5% GST', cert: 'Architect Form 1 #ARC-2026-081', status: 'Ready to Dispatch' },
                                        { slab: '5th Floor RCC Slab (15%)', amount: '₹24,75,000 + 5% GST', cert: 'Structural Engineer Cert #STR-2026-042', status: 'In Progress' },
                                        { slab: 'Top Terrace Roof Slab (20%)', amount: '₹33,00,000 + 5% GST', cert: 'Quarterly Progress Report', status: 'Scheduled Q3' }
                                    ].map((s, i) => (
                                        <div key={i} style={{ padding: '1rem 1.25rem', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>{s.slab}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem' }}>{s.cert}</div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontWeight: 800, color: '#047857', fontSize: '0.92rem' }}>{s.amount}</div>
                                                <span style={{ fontSize: '0.7rem', color: '#0284c7', background: '#e0f2fe', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>{s.status}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Channel Partner Commission Tab */}
                    {activeTab === 'cp_commission' && (
                        <CPCommissionLedger
                            projectName={projectName}
                            unitNumber={unitNumber}
                            allotteeName={allotteeName}
                            totalConsideration={totalConsideration}
                            brokerName={brokerName}
                            brokerPhone={brokerPhone}
                        />
                    )}

                    {/* Buyer KYC Tab */}
                    {activeTab === 'kyc' && (
                        <IndianBuyerKycVault />
                    )}

                    {/* Documents Tab */}
                    {activeTab === 'documents' && (
                        <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', border: '1px solid #e2e8f0' }}>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                                Project Sanctions & 30-Year Title Search
                            </h2>
                            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1.5rem' }}>
                                Verified statutory certificates, sanctioned building layout, and bank APF codes.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {[
                                    { name: '30-Year Title Search & Encumbrance Certificate (EC Form 15)', pages: '42 Pages', date: '1996 - 2026' },
                                    { name: 'State RERA Registration Sanction Certificate', pages: '4 Pages', date: 'Valid till Dec 2028' },
                                    { name: 'BBMP / Corporation Sanctioned Floor Plan (Unit 1404)', pages: '2 Pages', date: 'Architect Certified' },
                                    { name: 'Bank APF Home Loan Approval Code Master (SBI, HDFC, ICICI)', pages: '1 Page', date: 'Active Line' }
                                ].map((doc, idx) => (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', border: '1px solid #f1f5f9', background: '#f8fafc', borderRadius: '10px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                            <FileText size={18} color="#059669" />
                                            <div>
                                                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>{doc.name}</div>
                                                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{doc.pages} • {doc.date}</div>
                                            </div>
                                        </div>
                                        <button style={{ background: 'white', border: '1px solid #cbd5e1', padding: '0.35rem 0.65rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                            <Eye size={12} /> View
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Project Details, RERA Badge & Channel Partner */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    
                    {/* RERA Statutory Trust Card */}
                    <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '20px', padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#065f46', fontWeight: 800, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            <ShieldCheck size={18} color="#059669" /> Statutory RERA Protection
                        </div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#065f46', marginTop: '0.4rem', marginBottom: '0.3rem' }}>
                            RERA Compliant Project
                        </h3>
                        <p style={{ fontSize: '0.75rem', color: '#047857', lineHeight: '1.5', margin: 0 }}>
                            Reg: <strong>{reraNumber}</strong>
                        </p>
                        <div style={{ marginTop: '0.8rem', padding: '0.6rem', background: 'rgba(255, 255, 255, 0.7)', borderRadius: '10px', fontSize: '0.72rem', color: '#065f46' }}>
                            ✓ 70% Funds escrowed in RERA project bank account.
                            <br />
                            ✓ 5-Year statutory structural defect liability warranty.
                        </div>
                    </div>

                    {/* Section 65B Electronic Records Security */}
                    <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4f46e5', fontWeight: 800, fontSize: '0.82rem' }}>
                            <Scale size={16} /> Section 65B Electronic Audit
                        </div>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginTop: '0.4rem' }}>
                            Court-Admissible Digital Proof
                        </h3>
                        <p style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: '1.5', margin: '0.3rem 0 0.8rem' }}>
                            All signing events, token payments, and milestone acknowledgments generate cryptographic SHA-256 evidence certificates admissible under Indian Evidence Act 1872 & BSA 2023.
                        </p>
                    </div>

                    {/* Channel Partner Broker Support Card */}
                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.5rem' }}>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                            Designated Sales Advisory
                        </div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginTop: '0.3rem', marginBottom: '0.2rem' }}>
                            {brokerName}
                        </h3>
                        <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 1rem' }}>
                            RERA Registered Channel Partner
                        </p>
                        <button
                            onClick={handleWhatsAppBroker}
                            style={{
                                width: '100%',
                                background: '#25d366',
                                color: 'white',
                                border: 'none',
                                padding: '0.65rem 1rem',
                                borderRadius: '10px',
                                fontWeight: 700,
                                fontSize: '0.82rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <MessageCircle size={16} /> Instant WhatsApp Support
                        </button>
                    </div>

                </div>

            </main>

            {/* E-Stamp Cover Modal */}
            <EStampModal
                isOpen={showEStampModal}
                onClose={() => setShowEStampModal(false)}
                documentName={`Agreement for Sale - ${projectName} (Unit ${unitNumber})`}
                defaultFirstParty={allotteeName}
                defaultSecondParty={brokerName || 'Godrej Properties Ltd'}
                defaultState="Karnataka"
                defaultAmount={500}
                onAttachSuccess={(details) => {
                    setEStampAttached(true);
                    setStatusToast({
                        type: 'success',
                        text: `e-Stamp Paper (Cert #${details.certificateNo}) stitched as Page 1!`
                    });
                    setShowEStampModal(false);
                }}
            />

            {/* Stamp Duty & Ready Reckoner Calculator Modal */}
            <StampDutyCalculatorModal
                isOpen={showDutyCalculatorModal}
                onClose={() => setShowDutyCalculatorModal(false)}
                initialAgreementValue={totalConsideration}
                initialState="Karnataka"
                propertyName={`${projectName} - ${unitNumber}`}
            />

            {/* Bank Loan APF & Tripartite Modal */}
            <BankLoanTripartiteModal
                isOpen={showBankLoanModal}
                onClose={() => setShowBankLoanModal(false)}
                projectName={projectName}
                unitNumber={unitNumber}
                allotteeName={allotteeName}
                reraNumber={reraNumber}
                totalConsideration={totalConsideration}
            />

            {/* Demand Note Generator Modal */}
            <DemandNoteGeneratorModal
                isOpen={showDemandNoteModal}
                onClose={() => setShowDemandNoteModal(false)}
                projectName={projectName}
                unitNumber={unitNumber}
                allotteeName={allotteeName}
                reraNumber={reraNumber}
                totalConsideration={totalConsideration}
            />
        </div>
    );
};

export default RealEstateClosingRoom;
