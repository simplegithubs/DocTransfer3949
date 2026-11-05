import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser, useAuth } from './components/auth';
import { useGeoCurrency } from './hooks/useGeoCurrency';
import Logo from './components/Logo';
import SEO from './components/SEO';
import Footer from './components/Footer';
import {
    Check,
    X,
    Briefcase,
    Rocket,
    Sparkles,
    Zap,
    Loader2,
    Lock,
    Shield,
    ShieldCheck,
    FolderLock,
    HelpCircle,
    ChevronDown,
    ArrowRight,
    Users,
    FileText,
    FileCheck,
    Eye,
    Globe,
    CreditCard,
    Image as ImageIcon,
    Video,
    File,
    Share2,
    BarChart3,
    PenTool,
    Layout,
    Home,
    Link2,
    Star,
    Crown,
    Ban,
    Scale,
    FileLock,
    Bell,
    MapPin,
    Folder,
    Building2,
    CheckCircle2
} from 'lucide-react';
import { supabase } from './lib/supabase';

type CurrencyCode = 'USD' | 'INR' | 'AED' | 'EUR' | 'GBP';

interface CurrencyRate {
    symbol: string;
    label: string;
    flag: string;
    prices: {
        free: number;
        pro: number;
        business: number;
        dataroom: number;
        singleDeal: number;
    };
}

const CURRENCY_DATA: Record<CurrencyCode, CurrencyRate> = {
    USD: {
        symbol: '$',
        label: 'USD ($)',
        flag: '🇺🇸',
        prices: { free: 0, pro: 29, business: 79, dataroom: 199, singleDeal: 299 }
    },
    INR: {
        symbol: '₹',
        label: 'INR (₹)',
        flag: '🇮🇳',
        prices: { free: 0, pro: 999, business: 2499, dataroom: 6999, singleDeal: 9999 }
    },
    AED: {
        symbol: 'AED ',
        label: 'AED (د.إ)',
        flag: '🇦🇪',
        prices: { free: 0, pro: 199, business: 499, dataroom: 1299, singleDeal: 1899 }
    },
    EUR: {
        symbol: '€',
        label: 'EUR (€)',
        flag: '🇪🇺',
        prices: { free: 0, pro: 27, business: 74, dataroom: 185, singleDeal: 279 }
    },
    GBP: {
        symbol: '£',
        label: 'GBP (£)',
        flag: '🇬🇧',
        prices: { free: 0, pro: 23, business: 63, dataroom: 159, singleDeal: 239 }
    }
};

const Pricing: React.FC = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [currentPlan, setCurrentPlan] = useState<string | null>(null);
    const [hasUsedTrial, setHasUsedTrial] = useState<boolean>(false);
    const { getToken } = useAuth();

    const { currency, setCurrency, isUSVisitor, showCurrencySwitcher } = useGeoCurrency();
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

    useEffect(() => {
        const fetchCurrentPlan = async () => {
            if (user) {
                const { data } = await supabase
                    .from('subscriptions')
                    .select('plan_type, status, trial_end')
                    .eq('user_id', user.id)
                    .single();
                if (data) {
                    setCurrentPlan(data.plan_type);
                    setHasUsedTrial(!!data.trial_end);
                }
            }
        };
        fetchCurrentPlan();
    }, [user]);

    const handleUpgrade = (planType: string) => {
        const countryParam = isUSVisitor ? '&country=US' : '';
        if (!user) {
            navigate(`/checkout?plan=${planType}&currency=${currency}${countryParam}`);
            return;
        }

        if (planType === 'free') {
            navigate('/dataroom');
            return;
        }

        navigate(`/checkout?plan=${planType}&currency=${currency}${countryParam}`);
    };

    const cur = CURRENCY_DATA[currency];

    const getPlanPrice = (baseMonthly: number) => {
        return baseMonthly;
    };

    const plans = [
        {
            name: 'Free Forever',
            planType: 'free',
            icon: Rocket,
            tagline: 'Essential secure document sharing and tracking for solo brokers and founders.',
            monthlyPrice: cur.prices.free,
            badge: null,
            popular: false,
            headerLabel: "What's included",
            features: [
                { text: '5 active document links', enabled: true, highlight: false },
                { text: '10 MB max file size limit', enabled: true, highlight: false },
                { text: 'Unlimited viewers (zero viewer friction)', enabled: true, highlight: true },
                { text: 'Passcode protection', enabled: true, highlight: false },
                { text: 'Total view count & basic visitor telemetry', enabled: true, highlight: false },
                { text: '1-Click WhatsApp deal memo sharing', enabled: true, highlight: false },
                { text: 'Single PDF per link', enabled: true, highlight: false },
                { text: 'Page-by-page duration heatmaps', enabled: false, highlight: false },
                { text: 'Dynamic anti-leak watermark (Email & IP)', enabled: false, highlight: false },
                { text: 'Pre-flight Click-Through NDA gate', enabled: false, highlight: false },
                { text: 'Strict DRM (Print & text copy block)', enabled: false, highlight: false },
                { text: 'Multi-file document bundles', enabled: false, highlight: false },
                { text: 'Active sessions manager & kill switch', enabled: false, highlight: false },
                { text: 'Virtual Data Room (VDR) folders & Q&A', enabled: false, highlight: false },
            ],
            cta: 'Get Started Free',
            color: '#64748b',
            gradient: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            accentBg: '#f1f5f9',
            ctaGradient: 'linear-gradient(135deg, #475569 0%, #334155 100%)',
        },
        {
            name: 'Pro Plan',
            planType: 'pro',
            icon: Zap,
            tagline: 'Advanced DRM, sector presets, and click-through NDA gates for active dealmakers.',
            monthlyPrice: cur.prices.pro,
            badge: '🔥 MOST POPULAR',
            popular: true,
            headerLabel: 'Everything in Free, plus',
            features: [
                { text: '100 file link shares per month', enabled: true, highlight: true },
                { text: '50 MB max file size limit', enabled: true, highlight: true },
                { text: 'PDF, Image (JPG/PNG) & Video support', enabled: true, highlight: true },
                { text: 'Multi-file secure bundles in single link', enabled: true, highlight: true },
                { text: '1-Click Sector Presets (Dubai RE, M&A, PE)', enabled: true, highlight: true },
                { text: 'Pre-Flight Click-Through NDA Gate (4 templates)', enabled: true, highlight: true },
                { text: 'Strict DRM: Disable Text Copy & Ctrl+P Print', enabled: true, highlight: true },
                { text: 'Custom Link Vanity Slug (doctransfer.com/view/slug)', enabled: true, highlight: true },
                { text: 'Self-Destruct & Burn-After-Reading limits', enabled: true, highlight: false },
                { text: 'Full Analytics: Heatmaps & drop-off analytics', enabled: true, highlight: true },
                { text: 'White-Label CNAME deal domain', enabled: false, highlight: false },
                { text: 'Active sessions manager & kill switch', enabled: false, highlight: false },
                { text: 'Territory Geo-Fencing (IP country allowlist)', enabled: false, highlight: false },
                { text: 'Multi-party isolated bidder deal rooms', enabled: false, highlight: false },
            ],
            cta: 'Upgrade to Pro',
            color: '#3b82f6',
            gradient: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
            accentBg: '#eff6ff',
            ctaGradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        },
        {
            name: 'Business & Agency',
            planType: 'business',
            icon: Briefcase,
            tagline: 'Complete white-labeling, territory geo-fencing, and live investor telemetry for teams.',
            monthlyPrice: cur.prices.business,
            badge: '🏢 BEST FOR AGENTS',
            popular: false,
            headerLabel: 'Everything in Pro, plus',
            features: [
                { text: '1,000 file link shares per month', enabled: true, highlight: true },
                { text: '250 MB max file size limit', enabled: true, highlight: true },
                { text: '5 Team member seats included', enabled: true, highlight: true },
                { text: 'White-Label CNAME domain (deals.yourfirm.com)', enabled: true, highlight: true },
                { text: 'Verified Broker License Seal (DLD ORN, UK, EU)', enabled: true, highlight: true },
                { text: 'Active Sessions Manager & Real-Time Kill Switch', enabled: true, highlight: true },
                { text: 'Territory Geo-Fencing (IP Country Allowlist)', enabled: true, highlight: true },
                { text: 'Instant WhatsApp & Email Lead Alerts (Dwell >60s)', enabled: true, highlight: true },
                { text: 'Global B2B VAT Tax Invoices (UAE TRN 5%, EU Reverse)', enabled: true, highlight: true },
                { text: 'Tamper-Proof Audit Trail (GDPR & UAE PDPL)', enabled: true, highlight: true },
                { text: 'eIDAS & US ESIGN court-admissible audit log', enabled: true, highlight: false },
                { text: 'Multi-party isolated bidder deal rooms', enabled: false, highlight: false },
            ],
            cta: 'Upgrade to Business',
            color: '#8b5cf6',
            gradient: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
            accentBg: '#f5f3ff',
            ctaGradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
        },
        {
            name: 'VDR Enterprise',
            planType: 'dataroom',
            icon: FolderLock,
            tagline: 'Institutional Virtual Data Room for cross-border M&A, private equity, and sovereign funds.',
            monthlyPrice: cur.prices.dataroom,
            badge: '💼 INSTITUTIONAL M&A',
            popular: false,
            headerLabel: 'Everything in Business, plus',
            features: [
                { text: 'Unlimited file shares & deal rooms', enabled: true, highlight: true },
                { text: '2 GB max file size per upload', enabled: true, highlight: true },
                { text: '15 Team seats + Unlimited diligence guests', enabled: true, highlight: true },
                { text: 'Zero-Knowledge Client-Side AES-256 Vault', enabled: true, highlight: true },
                { text: 'Multi-Party Isolated Bidder Rooms (Chinese Walls)', enabled: true, highlight: true },
                { text: 'VDR Diligence Folder Hierarchy & Index Tree', enabled: true, highlight: true },
                { text: 'Due Diligence Q&A Tracking Module', enabled: true, highlight: true },
                { text: 'Bates numbering & 1-Click ZIP archive export', enabled: true, highlight: true },
                { text: 'International Legal Seals (DIFC-LCIA / English Law)', enabled: true, highlight: true },
                { text: '99.99% Uptime SLA with multi-cloud failover', enabled: true, highlight: true },
                { text: 'Dedicated Deal Concierge & 24/7 Priority Support', enabled: true, highlight: true },
            ],
            cta: 'Deploy Virtual Data Room',
            color: '#059669',
            gradient: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
            accentBg: '#ecfdf5',
            ctaGradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
        }
    ];

    const comparisons = [
        { category: 'Capacity & Deal Room Entitlements' },
        { feature: 'Monthly Shared Links', free: '5 Links', pro: '100', business: '1,000', dataroom: 'Unlimited' },
        { feature: 'Max File Size per Upload', free: '10 MB', pro: '50 MB', business: '250 MB', dataroom: '2 GB' },
        { feature: 'Team Member Seats', free: '1 Seat', freeDesc: 'Single user', pro: '1 Seat', business: '5 Seats', dataroom: '15 Seats + Guests' },
        { feature: 'Unlimited File Viewers', free: true, pro: true, business: true, dataroom: true },

        { category: 'Security, DRM & Access Controls' },
        { feature: 'Dynamic Anti-Leak Watermark', free: false, pro: 'Dynamic (Email/IP)', business: 'Custom Agency Brand', dataroom: 'Dynamic Forensic' },
        { feature: 'Passcode & Expiration Timers', free: 'Passcode only', pro: true, business: true, dataroom: true },
        { feature: '1-Click Sector Presets (Dubai RE, M&A, PE)', free: false, pro: true, business: true, dataroom: true },
        { feature: 'Pre-Flight Click-Through NDA Gate', free: false, pro: '4 Templates', business: '4 Templates', dataroom: 'Custom Master NDA' },
        { feature: 'Strict DRM (Block Ctrl+P, Copy & Inspect)', free: false, pro: true, business: true, dataroom: true },
        { feature: 'Custom Link Vanity Slug (/view/slug)', free: false, pro: true, business: true, dataroom: true },
        { feature: 'Active Sessions Manager & Kill Switch', free: false, pro: false, business: true, dataroom: true },
        { feature: 'Territory Geo-Fencing (IP Country Borders)', free: false, pro: false, business: true, dataroom: true },
        { feature: 'Client-Side AES-256 Vault Mode (E2EE)', free: false, pro: false, business: false, dataroom: true },

        { category: 'Virtual Data Room (VDR) Diligence' },
        { feature: 'Multi-File Bundling in 1 Link', free: false, pro: true, business: true, dataroom: true },
        { feature: 'VDR Diligence Folder Hierarchy (01_Legal, 02_Fin)', free: false, pro: false, business: 'Basic Folders', dataroom: 'Full Index Tree' },
        { feature: 'Multi-Party Isolated Bidder Chinese Walls', free: false, pro: false, business: false, dataroom: true },
        { feature: 'Due Diligence Q&A Inquiry Workflow', free: false, pro: false, business: false, dataroom: true },
        { feature: 'Bates Numbering & 1-Click ZIP Archive', free: false, pro: false, business: false, dataroom: true },

        { category: 'White-Labeling & Lead Telemetry' },
        { feature: '1-Click WhatsApp Deal Memo & Pitch Generator', free: true, pro: true, business: true, dataroom: true },
        { feature: 'Page-by-Page Time Forensics & Heatmaps', free: false, pro: 'Full Heatmaps', business: 'Full Heatmaps', dataroom: 'Institutional Forensics' },
        { feature: 'Real-Time WhatsApp & Email Lead Alerts (Dwell >60s)', free: false, pro: false, business: true, dataroom: true },
        { feature: 'White-Label CNAME Domain & Remove Branding', free: false, pro: false, business: true, dataroom: true },
        { feature: 'Verified Broker License Seal (DLD ORN, UK, EU)', free: false, pro: false, business: true, dataroom: true },

        { category: 'Global Invoicing, Legal & SLA' },
        { feature: 'Global B2B VAT Tax Invoices (UAE TRN, EU Reverse)', free: false, pro: false, business: true, dataroom: true },
        { feature: 'International Legal Seals (DIFC, GDPR, eIDAS)', free: false, pro: false, business: true, dataroom: true },
        { feature: '99.99% Uptime SLA & Edge Cloud Guarantee', free: false, pro: false, business: false, dataroom: true },
        { feature: '24/7 Dedicated Deal Concierge & Support', free: 'Community', pro: 'Standard', business: 'Priority Email', dataroom: 'Dedicated Concierge' },
    ];

    const faqs = [
        {
            q: 'Which plan is right for cross-border real estate or corporate M&A?',
            a: 'For real estate brokers, the Pro Plan ($29/mo) provides Click-Through NDA gates, Strict DRM (print blocking), and custom vanity slugs. For luxury agencies and legal teams, the Business Suite ($79/mo) adds white-label CNAME domains, real-time WhatsApp investor alerts, and territory geo-fencing. For institutional M&A, private equity, and multi-bidder transactions, the VDR Enterprise ($199/mo) provides isolated bidder rooms (Chinese walls), structured Q&A, and 2GB file capacity.'
        },
        {
            q: 'How do payments work across India, Dubai, and Europe?',
            a: 'DocTransfer provides secure multi-currency checkout via Razorpay. Indian clients can pay seamlessly using UPI (Google Pay, PhonePe, Paytm, BHIM), Indian Rupee (INR ₹), NetBanking, and corporate cards with instant 18% GST input tax credit (ITC) invoices. Global, Dubai (UAE), and European clients can checkout directly in AED, EUR, GBP, or USD using 3D-Secure International Credit & Debit Cards (Visa, Mastercard, American Express) with automated UAE TRN (5% VAT) or EU VAT Reverse Charge B2B invoicing.'
        },
        {
            q: 'What is the 90-Day Single-Deal VDR Pass and who is it for?',
            a: 'Many brokers selling an exclusive villa in Dubai or M&A advisors closing a mid-market acquisition in Europe or India only need a secure Virtual Data Room for the duration of a single transaction. The Single-Deal Pass grants 90 days of complete VDR Enterprise capability (multi-party Chinese walls, numbered folder index tree, strict DRM print lockout, real-time WhatsApp alerts, and Bates ZIP export) with zero recurring monthly subscription commitments.'
        },
        {
            q: 'Can investors view documents without creating an account or paying?',
            a: 'Yes, 100%. All DocTransfer links feature completely frictionless, zero-login viewing for prospective buyers and investors. There is never any fee or registration required for recipients to review documents.'
        },
        {
            q: 'How does the Strict DRM (Digital Rights Management) defense work?',
            a: 'When Strict DRM is enabled, DocTransfer intercepts print commands (Ctrl+P / Cmd+P), disables clipboard copy commands (Ctrl+C), blocks inspect element (F12), disables right-click menus, and injects dynamic print CSS that blanks the document if a screen capture or print dialog is triggered.'
        },
        {
            q: 'How does monthly billing work?',
            a: 'All DocTransfer subscriptions are billed on a flexible monthly basis with zero long-term commitments. You can cancel auto-renewal anytime directly from your dashboard with zero cancellation fees.'
        },
        {
            q: 'Can I cancel or upgrade my subscription at any time?',
            a: 'Yes. You can upgrade, downgrade, or cancel your subscription anytime directly from your Agency Settings page. When upgrading, proration is calculated automatically.'
        },
        {
            q: 'What is your refund policy for paid subscriptions?',
            a: 'DocTransfer offers a 100% Free Forever plan ($0/mo, no card required) so you can thoroughly test our core security, tracking, and watermarking capabilities before upgrading. As stated in our Terms of Service, all purchases of paid plans are final and non-refundable once billed.'
        }
    ];

    // CSS keyframes injected via style tag
    const keyframesStyle = `
        @keyframes pricing-float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
        }
        @keyframes pricing-pulse-ring {
            0% { transform: scale(0.95); opacity: 0.7; }
            50% { transform: scale(1.05); opacity: 0.3; }
            100% { transform: scale(0.95); opacity: 0.7; }
        }
        @keyframes pricing-gradient-shift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        @keyframes pricing-badge-glow {
            0%, 100% { box-shadow: 0 0 15px rgba(59, 130, 246, 0.3); }
            50% { box-shadow: 0 0 25px rgba(59, 130, 246, 0.6); }
        }
        @keyframes pricing-save-bounce {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.08); }
        }
    `;

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
            <style>{keyframesStyle}</style>
            <SEO
                title="Institutional Pricing Plans - Pro, Business & Virtual Data Room | DocTransfer"
                description="Transparent, institutional pricing for secure document sharing and Virtual Data Rooms. Start free ($0), or upgrade to Pro, Business, or Enterprise VDR. Support for USD, AED, EUR, and GBP."
                keywords="DocTransfer pricing, virtual data room pricing, VDR cost, secure document sharing plans, M&A dataroom price, Dubai real estate document security, UAE VAT invoice"
            />

            {/* Navbar */}
            <header style={{
                padding: '1.25rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                borderBottom: '1px solid rgba(226, 232, 240, 0.7)'
            }}>
                <Link to="/" style={{ textDecoration: 'none' }}><Logo size={32} /></Link>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <Link to="/" style={{ color: '#475569', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>Home</Link>
                    <Link to="/dataroom" style={{ color: '#475569', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>Deal Room</Link>
                    <SignedIn>
                        <UserButton afterSignOutUrl="/pricing" />
                    </SignedIn>
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button style={{
                                padding: '0.55rem 1.3rem',
                                borderRadius: '10px',
                                border: 'none',
                                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                color: 'white',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                            }}>Sign In</button>
                        </SignInButton>
                    </SignedOut>
                </div>
            </header>

            <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '3.5rem 1.5rem' }}>
                {/* Hero Header */}
                <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                        color: '#1e40af',
                        padding: '0.45rem 1.35rem',
                        borderRadius: '100px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        marginBottom: '1.25rem',
                        border: '1px solid #93c5fd',
                        boxShadow: '0 2px 10px rgba(59, 130, 246, 0.1)'
                    }}>
                        <Sparkles size={15} /> Institutional Document Security & Virtual Data Rooms
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(2.4rem, 4vw, 3.8rem)',
                        fontWeight: 900,
                        color: '#0f172a',
                        marginBottom: '1rem',
                        letterSpacing: '-0.03em',
                        lineHeight: 1.15
                    }}>
                        Transparent Pricing for Every{' '}
                        <span style={{
                            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #10b981 100%)',
                            backgroundSize: '200% auto',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            animation: 'pricing-gradient-shift 4s ease infinite'
                        }}>Transaction Size</span>
                    </h1>

                    <p style={{
                        fontSize: '1.15rem',
                        color: '#64748b',
                        maxWidth: '740px',
                        margin: '0 auto 2.5rem',
                        lineHeight: 1.6
                    }}>
                        Deploy bank-grade digital rights management, Click-Through NDA gates, and Virtual Data Rooms across Dubai, Europe, and Asia.
                    </p>

                    {/* Currency Switcher (Hidden for US Visitors who only see USD) */}
                    {showCurrencySwitcher && (
                        <div style={{
                            display: 'inline-flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '1.5rem',
                            background: '#ffffff',
                            padding: '0.85rem 1.75rem',
                            borderRadius: '20px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                    Currency:
                                </span>
                                <div style={{ display: 'flex', gap: '0.3rem', background: '#f1f5f9', padding: '0.25rem', borderRadius: '10px' }}>
                                    {(Object.keys(CURRENCY_DATA) as CurrencyCode[]).map((c) => {
                                        const isSel = currency === c;
                                        return (
                                            <button
                                                key={c}
                                                onClick={() => setCurrency(c)}
                                                style={{
                                                    padding: '0.35rem 0.65rem',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    background: isSel ? '#ffffff' : 'transparent',
                                                    color: isSel ? '#0f172a' : '#64748b',
                                                    fontSize: '0.78rem',
                                                    fontWeight: isSel ? 800 : 600,
                                                    cursor: 'pointer',
                                                    boxShadow: isSel ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                                    transition: 'all 0.15s ease'
                                                }}
                                            >
                                                {CURRENCY_DATA[c].flag} {c}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Dual Gateway Trust Pill */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '1.25rem',
                        marginTop: '1.25rem',
                        flexWrap: 'wrap'
                    }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            background: '#ffffff',
                            padding: '0.4rem 1rem',
                            borderRadius: '100px',
                            border: '1px solid #e2e8f0',
                            fontSize: '0.78rem',
                            color: '#475569',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                        }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, color: '#0284c7' }}>
                                <CreditCard size={15} /> Razorpay
                            </span>
                            <span style={{ color: '#94a3b8' }}>•</span>
                            <span>UPI (GPay / PhonePe), Indian NetBanking, RuPay & 18% GST (ITC)</span>
                        </div>

                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            background: '#ffffff',
                            padding: '0.4rem 1rem',
                            borderRadius: '100px',
                            border: '1px solid #e2e8f0',
                            fontSize: '0.78rem',
                            color: '#475569',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                        }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, color: '#0284c7' }}>
                                <CreditCard size={15} /> 3D Secure Cards
                            </span>
                            <span style={{ color: '#94a3b8' }}>•</span>
                            <span>Visa, Mastercard & Amex (Dubai AED, Europe EUR/GBP, Global USD)</span>
                        </div>
                    </div>
                </div>

                {/* 4 Pricing Cards Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(285px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '6rem',
                    alignItems: 'stretch'
                }}>
                    {plans.map((p) => {
                        const isCurrent = currentPlan === p.planType;
                        const PlanIcon = p.icon;
                        const displayPrice = getPlanPrice(p.monthlyPrice);
                        const isHovered = hoveredPlan === p.planType;

                        return (
                            <div
                                key={p.name}
                                onMouseEnter={() => setHoveredPlan(p.planType)}
                                onMouseLeave={() => setHoveredPlan(null)}
                                style={{
                                    background: 'white',
                                    borderRadius: '24px',
                                    padding: '2.25rem 1.6rem',
                                    border: p.popular ? `2px solid ${p.color}` : '1px solid #e2e8f0',
                                    boxShadow: p.popular
                                        ? isHovered
                                            ? `0 25px 50px -12px ${p.color}40, 0 0 0 1px ${p.color}20`
                                            : `0 20px 40px -12px ${p.color}25, 0 4px 12px rgba(0,0,0,0.04)`
                                        : isHovered
                                            ? '0 20px 40px rgba(0,0,0,0.08)'
                                            : '0 4px 20px rgba(0,0,0,0.03)',
                                    position: 'relative',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'all 0.3s ease',
                                    transform: isHovered ? 'translateY(-6px)' : p.popular ? 'translateY(-3px)' : 'none',
                                }}
                            >
                                {/* Badge */}
                                {p.badge && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '1.1rem',
                                        right: '1.1rem',
                                        background: p.popular
                                            ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                                            : p.color,
                                        color: 'white',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '100px',
                                        fontSize: '0.65rem',
                                        fontWeight: 800,
                                        letterSpacing: '0.04em'
                                    }}>
                                        {p.badge}
                                    </div>
                                )}

                                {/* Plan Icon & Title */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                    <div style={{
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '12px',
                                        background: p.accentBg,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: p.color
                                    }}>
                                        <PlanIcon size={22} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                                            {p.name}
                                        </h3>
                                    </div>
                                </div>

                                <p style={{ fontSize: '0.82rem', color: '#64748b', minHeight: '38px', lineHeight: 1.5, margin: '0 0 1.25rem 0' }}>
                                    {p.tagline}
                                </p>

                                {/* Pricing Display */}
                                <div style={{ marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid #f1f5f9' }}>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                                        <span style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
                                            {p.monthlyPrice === 0 ? 'Free' : `${cur.symbol}${displayPrice}`}
                                        </span>
                                        {p.monthlyPrice > 0 && (
                                            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                                                / month
                                            </span>
                                        )}
                                    </div>

                                    {p.monthlyPrice > 0 ? (
                                        <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                                            Billed monthly • Cancel anytime
                                        </div>
                                    ) : (
                                        <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700, marginTop: '0.25rem' }}>
                                            $0 / No credit card required
                                        </div>
                                    )}
                                </div>

                                {/* Action CTA Button */}
                                <button
                                    onClick={() => handleUpgrade(p.planType)}
                                    style={{
                                        width: '100%',
                                        padding: '0.8rem 1rem',
                                        borderRadius: '12px',
                                        border: 'none',
                                        background: p.popular
                                            ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                                            : p.planType === 'dataroom'
                                                ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                                                : p.ctaGradient,
                                        color: 'white',
                                        fontWeight: 700,
                                        fontSize: '0.9rem',
                                        cursor: 'pointer',
                                        marginBottom: '1.5rem',
                                        boxShadow: p.popular
                                            ? '0 6px 16px rgba(59, 130, 246, 0.35)'
                                            : p.planType === 'dataroom'
                                                ? '0 6px 16px rgba(5, 150, 105, 0.35)'
                                                : 'none',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {isCurrent ? 'Current Plan ✓' : p.cta}
                                </button>

                                {/* Feature List */}
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', marginBottom: '0.75rem' }}>
                                        {p.headerLabel}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                                        {p.features.map((f, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.8rem', color: f.enabled ? '#334155' : '#94a3b8' }}>
                                                {f.enabled ? (
                                                    <Check size={15} color={p.color} style={{ marginTop: '2px', flexShrink: 0 }} />
                                                ) : (
                                                    <X size={15} color="#cbd5e1" style={{ marginTop: '2px', flexShrink: 0 }} />
                                                )}
                                                <span style={{ fontWeight: f.highlight ? 700 : 400, color: f.highlight ? '#0f172a' : undefined }}>
                                                    {f.text}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* 90-Day Single-Deal VDR Pass Banner */}
                <div style={{
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
                    borderRadius: '24px',
                    padding: '2.5rem',
                    marginBottom: '6rem',
                    color: 'white',
                    border: '1px solid rgba(129, 140, 248, 0.25)',
                    boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.3)',
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: '2rem',
                    alignItems: 'center'
                }}>
                    <div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(99, 102, 241, 0.2)', border: '1px solid rgba(129, 140, 248, 0.4)', padding: '0.3rem 0.85rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700, color: '#a5b4fc', marginBottom: '1rem' }}>
                            <FolderLock size={15} />
                            <span>TRANSACTIONAL / ONE-TIME PASS</span>
                        </div>
                        <h3 style={{ fontSize: '1.75rem', fontWeight: 900, margin: '0 0 0.75rem 0', letterSpacing: '-0.02em' }}>
                            Need an Institutional VDR for Just 1 Transaction?
                        </h3>
                        <p style={{ color: '#cbd5e1', fontSize: '0.92rem', lineHeight: 1.6, maxWidth: '780px', margin: '0 0 1.25rem 0' }}>
                            Designed for high-ticket property sales in Dubai, mid-market M&A in Europe, and corporate asset deals in India. No recurring monthly SaaS subscription—get <strong>90 full days</strong> of enterprise Virtual Data Room power, multi-party Chinese walls, strict DRM print lockout, and post-closing compliance ZIP archive for a single transaction.
                        </p>
                        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.82rem', color: '#e2e8f0' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Check size={16} color="#34d399" /> 90 Days Unlimited Diligence
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Check size={16} color="#34d399" /> Multi-Party Isolated Bidders
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Check size={16} color="#34d399" /> Real-Time WhatsApp Telemetry
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Check size={16} color="#34d399" /> Tamper-Evident Bates ZIP Export
                            </span>
                        </div>
                    </div>

                    <div style={{
                        background: 'rgba(255, 255, 255, 0.06)',
                        padding: '1.75rem 2rem',
                        borderRadius: '20px',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        textAlign: 'center',
                        minWidth: '240px'
                    }}>
                        <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                            One-Time Investment
                        </div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#ffffff', marginBottom: '0.25rem' }}>
                            {cur.symbol}{cur.prices.singleDeal}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 700, marginBottom: '1.25rem' }}>
                            90-Day Full Access • No Auto-Renewal
                        </div>
                        <button
                            onClick={() => handleUpgrade('single_deal')}
                            style={{
                                width: '100%',
                                padding: '0.85rem 1.25rem',
                                borderRadius: '12px',
                                border: 'none',
                                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                                color: 'white',
                                fontWeight: 800,
                                fontSize: '0.88rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                boxShadow: '0 6px 20px rgba(79, 70, 229, 0.4)',
                                transition: 'all 0.2s'
                            }}
                        >
                            <span>Get 90-Day Deal Pass</span>
                            <ArrowRight size={15} />
                        </button>
                    </div>
                </div>

                {/* Deep Feature Comparison Matrix */}
                <div style={{
                    background: 'white',
                    borderRadius: '24px',
                    border: '1px solid #e2e8f0',
                    padding: '2.5rem',
                    marginBottom: '6rem',
                    boxShadow: '0 4px 25px rgba(0,0,0,0.03)'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Full Technical Capabilities
                        </span>
                        <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: '0.4rem 0 0.6rem' }}>
                            Detailed Plan Comparison
                        </h2>
                        <p style={{ fontSize: '0.95rem', color: '#64748b' }}>
                            Compare all security, DRM, diligence, and compliance parameters side by side.
                        </p>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '780px' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                                    <th style={{ padding: '1rem', fontSize: '0.9rem', color: '#0f172a', fontWeight: 800 }}>Feature</th>
                                    <th style={{ padding: '1rem', fontSize: '0.9rem', color: '#64748b', fontWeight: 700 }}>Free</th>
                                    <th style={{ padding: '1rem', fontSize: '0.9rem', color: '#3b82f6', fontWeight: 800 }}>Pro</th>
                                    <th style={{ padding: '1rem', fontSize: '0.9rem', color: '#8b5cf6', fontWeight: 800 }}>Business</th>
                                    <th style={{ padding: '1rem', fontSize: '0.9rem', color: '#059669', fontWeight: 800 }}>VDR Enterprise</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comparisons.map((item, idx) => {
                                    if (item.category) {
                                        return (
                                            <tr key={idx} style={{ background: '#f8fafc' }}>
                                                <td colSpan={5} style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                                    {item.category}
                                                </td>
                                            </tr>
                                        );
                                    }

                                    return (
                                        <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', fontWeight: 600, color: '#1e293b' }}>
                                                {item.feature}
                                            </td>
                                            {['free', 'pro', 'business', 'dataroom'].map((tier) => {
                                                const val = (item as any)[tier];
                                                return (
                                                    <td key={tier} style={{ padding: '0.85rem 1rem', fontSize: '0.82rem', color: '#475569' }}>
                                                        {typeof val === 'boolean' ? (
                                                            val ? <Check size={18} color="#059669" /> : <X size={18} color="#cbd5e1" />
                                                        ) : (
                                                            <span style={{ fontWeight: tier === 'dataroom' ? 700 : 500, color: tier === 'dataroom' ? '#059669' : undefined }}>
                                                                {val}
                                                            </span>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* FAQ Section */}
                <div style={{ maxWidth: '880px', margin: '0 auto 6rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Common Questions
                        </span>
                        <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: '0.4rem 0' }}>
                            Frequently Asked Questions
                        </h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                        {faqs.map((faq, index) => {
                            const isOpen = openFaq === index;
                            return (
                                <div
                                    key={index}
                                    style={{
                                        background: 'white',
                                        borderRadius: '16px',
                                        border: '1px solid #e2e8f0',
                                        overflow: 'hidden',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <button
                                        onClick={() => setOpenFaq(isOpen ? null : index)}
                                        style={{
                                            width: '100%',
                                            padding: '1.25rem 1.5rem',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            background: 'none',
                                            border: 'none',
                                            textAlign: 'left',
                                            cursor: 'pointer',
                                            fontSize: '0.98rem',
                                            fontWeight: 700,
                                            color: '#0f172a'
                                        }}
                                    >
                                        <span>{faq.q}</span>
                                        <ChevronDown size={18} color="#64748b" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0, marginLeft: '1rem' }} />
                                    </button>
                                    {isOpen && (
                                        <div style={{ padding: '0 1.5rem 1.25rem', fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6 }}>
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Bottom Trust & Security Banner */}
                <div style={{
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
                    borderRadius: '24px',
                    padding: '3rem 2.5rem',
                    color: 'white',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '2rem',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                }}>
                    <div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
                            <ShieldCheck size={16} /> ISO 27001 • SOC 2 Type II • UAE PDPL • GDPR
                        </div>
                        <h3 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 0.5rem' }}>
                            Institutional Security & Compliance Guaranteed
                        </h3>
                        <p style={{ color: '#94a3b8', fontSize: '0.92rem', maxWidth: '620px', lineHeight: 1.5, margin: 0 }}>
                            All documents are encrypted with Zero-Knowledge client-side cryptography. Our multi-cloud edge infrastructure ensures 99.99% uptime for cross-border deal teams.
                        </p>
                    </div>

                    <button
                        onClick={() => handleUpgrade('dataroom')}
                        style={{
                            padding: '0.9rem 1.8rem',
                            borderRadius: '12px',
                            border: 'none',
                            background: '#10b981',
                            color: 'white',
                            fontWeight: 800,
                            fontSize: '0.95rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
                            transition: 'all 0.2s'
                        }}
                    >
                        Deploy Enterprise VDR <ArrowRight size={16} />
                    </button>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Pricing;
