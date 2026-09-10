import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser, useAuth } from './components/auth';
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
    CreditCard
} from 'lucide-react';
import { supabase } from './lib/supabase';

const Pricing: React.FC = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [currentPlan, setCurrentPlan] = useState<string | null>(null);
    const [hasUsedTrial, setHasUsedTrial] = useState<boolean>(false);
    const { getToken } = useAuth();
    const [startingTrial, setStartingTrial] = useState<string | null>(null);

    const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
    const [openFaq, setOpenFaq] = useState<number | null>(null);

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

    const handleUpgrade = async (planType: string) => {
        if (!user) {
            navigate('/checkout?plan=' + planType + '&currency=' + currency + '&cycle=' + billingCycle);
            return;
        }

        if (planType === 'free') {
            navigate('/dataroom');
            return;
        }

        navigate(`/checkout?plan=${planType}&currency=${currency}&cycle=${billingCycle}`);
    };

    const getPriceInfo = (type: 'free' | 'pro' | 'business' | 'dataroom') => {
        if (type === 'free') {
            return {
                display: currency === 'INR' ? '₹0' : '$0',
                billed: 'Free forever',
                amountNum: 0
            };
        }
        if (type === 'pro') {
            if (currency === 'INR') {
                return billingCycle === 'annual'
                    ? { display: '₹499', billed: '₹5,988 billed annually', amountNum: 499 }
                    : { display: '₹699', billed: 'billed monthly', amountNum: 699 };
            }
            return billingCycle === 'annual'
                ? { display: '$15', billed: '$180 billed annually', amountNum: 15 }
                : { display: '$19', billed: 'billed monthly', amountNum: 19 };
        }
        if (type === 'business') {
            if (currency === 'INR') {
                return billingCycle === 'annual'
                    ? { display: '₹1,349', billed: '₹16,188 billed annually', amountNum: 1349 }
                    : { display: '₹1,799', billed: 'billed monthly', amountNum: 1799 };
            }
            return billingCycle === 'annual'
                ? { display: '$39', billed: '$468 billed annually', amountNum: 39 }
                : { display: '$49', billed: 'billed monthly', amountNum: 49 };
        }
        if (type === 'dataroom') {
            if (currency === 'INR') {
                return billingCycle === 'annual'
                    ? { display: '₹3,749', billed: '₹44,988 billed annually', amountNum: 3749 }
                    : { display: '₹4,999', billed: 'billed monthly', amountNum: 4999 };
            }
            return billingCycle === 'annual'
                ? { display: '$99', billed: '$1,188 billed annually', amountNum: 99 }
                : { display: '$129', billed: 'billed monthly', amountNum: 129 };
        }
        return { display: '', billed: '', amountNum: 0 };
    };

    const plans = [
        {
            name: 'Free Forever',
            planType: 'free',
            icon: Rocket,
            tagline: 'Essential document tracking for early consultants & solo property advisors.',
            price: getPriceInfo('free').display,
            period: '/month',
            subText: getPriceInfo('free').billed,
            badge: null,
            features: [
                { text: '3 Active Documents in account', enabled: true, highlight: true },
                { text: '5MB Maximum file size limit', enabled: true },
                { text: '1-Click WhatsApp & Email sharing', enabled: true },
                { text: 'Basic total views counter', enabled: true },
                { text: '7-Day auto-expiring links', enabled: true },
                { text: 'Mandatory "Powered by DocTransfer"', enabled: false },
                { text: 'Slide-by-slide dwell analytics', enabled: false },
                { text: 'Anti-leak dynamic watermarking', enabled: false },
                { text: 'Legally binding e-signatures', enabled: false },
                { text: 'Deal Room & folder creation', enabled: false }
            ],
            cta: 'Start Free Trial',
            color: '#64748b',
            accentBg: '#f1f5f9'
        },
        {
            name: 'Pro Plan',
            planType: 'pro',
            icon: Zap,
            tagline: 'For Channel Partners & Brokers: WhatsApp brochure tracking, dwell time alerts & anti-leak watermarks.',
            price: getPriceInfo('pro').display,
            period: '/month',
            subText: getPriceInfo('pro').billed,
            badge: '🔥 POPULAR FOR BROKERS',
            features: [
                { text: 'Unlimited Document Uploads', enabled: true, highlight: true },
                { text: '50MB File size limit (High-res brochures)', enabled: true },
                { text: '5 Active Virtual Deal Rooms & Project Kits', enabled: true },
                { text: 'Page-by-page floor plan & payment dwell analytics', enabled: true, highlight: true },
                { text: 'Anti-leak watermark with Recipient Phone & Email', enabled: true, highlight: true },
                { text: 'RERA Allotment Letters & 11-Month Leases', enabled: true },
                { text: 'Court-admissible Sec 65B electronic audit trail', enabled: true },
                { text: 'Password protection & instant link revocation', enabled: true },
                { text: 'View-only mode (Disable download & printing)', enabled: true },
                { text: 'Remove DocTransfer branding', enabled: true }
            ],
            cta: 'Upgrade to Pro',
            popular: true,
            color: '#3b82f6',
            accentBg: '#eff6ff'
        },
        {
            name: 'Business & Broker Agency',
            planType: 'business',
            icon: Briefcase,
            tagline: 'For Broker Agencies & Sales Teams: 3 seats, agency branding, lead protection & GST ITC.',
            price: getPriceInfo('business').display,
            period: '/month',
            subText: getPriceInfo('business').billed,
            badge: 'BEST FOR AGENCIES & TEAMS',
            features: [
                { text: 'Everything in Pro Plan', enabled: true },
                { text: '500MB File size limit', enabled: true },
                { text: 'Unlimited Project Deal Rooms & folders', enabled: true, highlight: true },
                { text: 'Zero-Knowledge Vault (AES-256 E2EE)', enabled: true, highlight: true },
                { text: 'Custom agency branding & white-label viewer', enabled: true },
                { text: 'Client intake portals for buyer KYC & documents', enabled: true },
                { text: 'B2B GST Tax Invoicing with 18% ITC eligibility', enabled: true, highlight: true },
                { text: '3 Team member seats for sales managers', enabled: true },
                { text: 'Lead registration protection & DRM controls', enabled: true },
                { text: 'Priority WhatsApp & phone assistance', enabled: true }
            ],
            cta: 'Upgrade to Business',
            color: '#8b5cf6',
            accentBg: '#f5f3ff'
        },
        {
            name: 'Virtual Data Room (VDR)',
            planType: 'dataroom',
            icon: FolderLock,
            tagline: 'For Builders, Land M&A, REITs & Title Advocates: 30-year property title scrutiny & Bank APF rooms.',
            price: getPriceInfo('dataroom').display,
            period: '/month',
            subText: getPriceInfo('dataroom').billed,
            badge: 'BUILDERS & RERA DEALS',
            features: [
                { text: 'Everything in Business Suite', enabled: true },
                { text: '2GB File size limit per upload (Heavy scans & blueprints)', enabled: true, highlight: true },
                { text: '30-Year Title Search Dossier Rooms (7/12, Khata, Patta, EC)', enabled: true, highlight: true },
                { text: 'Bank APF File Submission Rooms (SBI, HDFC, ICICI)', enabled: true, highlight: true },
                { text: 'Multi-party isolated bidder deal rooms', enabled: true },
                { text: 'Due diligence Q&A module with approvals', enabled: true },
                { text: 'Bates numbering & auto-numbered index tree', enabled: true },
                { text: '1-Click compliance ZIP / DVD archive export', enabled: true },
                { text: '10 Team seats + unlimited guest reviewers & banks', enabled: true, highlight: true },
                { text: 'Dedicated real estate deal room account concierge', enabled: true }
            ],
            cta: 'Upgrade to Data Room',
            color: '#10b981',
            accentBg: '#ecfdf5'
        }
    ];

    const comparisons = [
        { category: 'Indian Real Estate & PropTech Workflows' },
        { feature: '1-Click WhatsApp Tracked Link Sharing', free: true, pro: true, business: true, dataroom: true },
        { feature: 'Anti-Rate-Leak Recipient Mobile Watermark', free: false, pro: 'Phone & Email', business: 'Custom Logo & Phone', dataroom: 'Forensic DRM' },
        { feature: 'RERA Allotment & Broker Mandate E-Signs', free: 'Sign Only', pro: 'Unlimited', business: 'Unlimited', dataroom: 'Unlimited' },
        { feature: '30-Year Title Search Dossier Rooms (7/12, EC)', free: false, pro: '5 Rooms', business: 'Unlimited', dataroom: 'Bank APF Certified' },
        { feature: '18% GST Invoicing with B2B Input Tax Credit (ITC)', free: false, pro: 'Standard', business: 'Automated ITC', dataroom: 'Corporate Tax Package' },

        { category: 'Document Sharing & Limits' },
        { feature: 'Active Documents in Account', free: '3 Documents', pro: 'Unlimited', business: 'Unlimited', dataroom: 'Unlimited' },
        { feature: 'File Size Limit per Upload', free: '5 MB', pro: '50 MB', business: '500 MB', dataroom: '2,048 MB (2 GB)' },
        { feature: 'Active Virtual Deal Rooms', free: '0 (Single links)', pro: '5 Rooms', business: 'Unlimited', dataroom: 'Unlimited Multi-Party' },
        { feature: 'Link Lifetime', free: '7 Days Auto-Expiry', pro: 'Permanent / Custom', business: 'Permanent / Custom', dataroom: 'Automated Lifecycle' },
        { feature: 'Custom Document Watermarking', free: false, pro: 'Dynamic Email/IP', business: 'Full Custom Text/Logo', dataroom: 'Forensic DRM' },
        { feature: 'DocTransfer Branding', free: 'Mandatory', pro: 'Removed', business: 'Custom Branding', dataroom: 'Full White-Label' },

        { category: 'Tracking & Forensic Analytics' },
        { feature: 'Real-Time Total Views', free: true, pro: true, business: true, dataroom: true },
        { feature: 'Slide-by-Slide Dwell Time Analytics', free: false, pro: true, business: true, dataroom: true },
        { feature: 'Viewer Drop-off Heatmaps', free: false, pro: true, business: true, dataroom: true },
        { feature: 'Visitor Geo, IP & Device Forensics', free: false, pro: true, business: true, dataroom: true },
        { feature: 'Section 65B Tamper-Proof Audit Certificate', free: false, pro: true, business: true, dataroom: true },

        { category: 'E-Signatures & Security' },
        { feature: 'Legally Valid E-Signatures (IT Act 2000)', free: 'Sign Only', pro: 'Unlimited Sending', business: 'Unlimited Sending', dataroom: 'Unlimited Batch Execution' },
        { feature: 'Email OTP / Whitelist Access', free: false, pro: true, business: true, dataroom: true },
        { feature: 'AES-256 Cloud Encryption', free: true, pro: true, business: true, dataroom: true },
        { feature: 'Zero-Knowledge Vault Mode (Client E2EE)', free: false, pro: false, business: true, dataroom: true },
        { feature: 'Remote Self-Destruct / Kill Switch', free: false, pro: true, business: true, dataroom: true },

        { category: 'Enterprise & M&A Deal Room Features' },
        { feature: 'Multi-Party Isolated Bidder Groups', free: false, pro: false, business: false, dataroom: true },
        { feature: 'Structured Due Diligence Q&A Module', free: false, pro: false, business: false, dataroom: true },
        { feature: 'Bates Numbering & Auto-Index Tree', free: false, pro: false, business: false, dataroom: true },
        { feature: '1-Click Deal Room ZIP / DVD Archive', free: false, pro: false, business: false, dataroom: true },
        { feature: 'Included Team Member Seats', free: '1 User', pro: '1 User', business: '3 Seats', dataroom: '10 Seats + Unl. Guests' },
        { feature: 'GST Tax Invoicing with ITC Credit (India)', free: false, pro: 'Standard', business: 'Automatic B2B ITC', dataroom: 'Corporate Tax Package' }
    ];

    const faqs = [
        {
            q: 'Can real estate builders and channel partner firms claim 18% GST Input Tax Credit (ITC)?',
            a: 'Yes! All Pro, Business, and Virtual Data Room subscriptions include automated GST-compliant B2B tax invoices. Simply enter your company GSTIN and billing address at checkout to claim 18% Input Tax Credit as an allowable business operating expense.'
        },
        {
            q: 'How does the anti-leak watermark stop brokers from leaking confidential builder price sheets?',
            a: 'DocTransfer dynamically embeds the viewer’s mobile number or email, timestamp, and IP address as a transparent diagonal watermark across every page. Additionally, downloads and printing are disabled, and you can revoke access or set auto-expiration instantly if rates change.'
        },
        {
            q: 'Can we organize 30-year property title records for bank APF and legal due diligence?',
            a: 'Yes. Our Virtual Data Room (VDR) plan includes pre-configured folders for 7/12 extracts, Encumbrance Certificates (EC), Khata/Patta, RERA sanctions, and Bank APF approval codes (SBI, HDFC, ICICI). You can grant granular view-only permissions to bank advocates and legal counsels with full Section 65B electronic audit logs.'
        },
        {
            q: 'Which payment methods do you accept via Razorpay?',
            a: 'Through Razorpay, we accept all Indian payment methods including UPI (Google Pay, PhonePe, Paytm, BHIM, Cred), RuPay, Visa, Mastercard, American Express cards, NetBanking from 50+ banks, Wallets, and international credit/debit cards.'
        },
        {
            q: 'How does the Free Plan work with the 3-document limit?',
            a: 'The Free tier is 100% free forever without requiring a credit card or payment. You can have up to 3 active trackable documents in your account at any time with a 5MB size limit. To share more documents, access slide-by-slide dwell analytics, or create virtual deal rooms, simply upgrade to Pro or Business.'
        },
        {
            q: 'Can I claim GST Input Tax Credit (ITC) on my subscription in India?',
            a: 'Yes! All Pro, Business, and Virtual Data Room subscriptions include automated GST-compliant B2B tax invoices. Simply enter your company GSTIN and billing address at checkout to claim 18% Input Tax Credit.'
        },
        {
            q: 'Are e-signatures legally binding in India and internationally?',
            a: 'Yes. DocTransfer e-signatures comply with the Indian Information Technology Act, 2000 (Section 65B admissible electronic records) as well as the US ESIGN Act and EU eIDAS regulations.'
        },
        {
            q: 'What makes the Virtual Data Room (VDR) plan different from Business?',
            a: 'The Virtual Data Room (VDR) plan is purpose-built for complex corporate M&A, VC/PE fundraising rounds, and legal audits. It includes isolated multi-party bidder rooms (so bidders cannot see each other), formal diligence Q&A with approvals, Bates numbering, 2GB upload limits, and 1-click tamper-proof archive export.'
        },
        {
            q: 'Can I cancel or switch plans anytime?',
            a: 'Yes. You have complete control over your subscription. You can upgrade, downgrade, or cancel recurring billing anytime directly from your dashboard billing settings.'
        }
    ];

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
            <SEO
                title="Pricing Plans (Free, Pro, Business, Virtual Data Room) | DocTransfer"
                description="DocTransfer transparent pricing in INR (₹) and USD ($). Start with 100% Free tier, or upgrade to Pro, Business, or Virtual Data Room (VDR) with UPI, Cards, and GST tax invoicing."
                keywords="DocTransfer pricing, virtual data room cost, DocSend alternative pricing, secure document sharing India, UPI payment data room, INR USD pricing"
            />

            {/* Navbar */}
            <header style={{
                padding: '1.25rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(12px)',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                borderBottom: '1px solid #e2e8f0'
            }}>
                <Link to="/" style={{ textDecoration: 'none' }}><Logo size={32} /></Link>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <Link to="/" style={{ color: '#475569', textDecoration: 'none', fontWeight: 500 }}>Home</Link>
                    <SignedIn>
                        <Link to="/dataroom" style={{ color: '#475569', textDecoration: 'none', fontWeight: 500 }}>Dashboard</Link>
                        <UserButton afterSignOutUrl="/pricing" />
                    </SignedIn>
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button style={{
                                padding: '0.6rem 1.4rem',
                                borderRadius: '10px',
                                border: 'none',
                                background: '#3b82f6',
                                color: 'white',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}>Sign In</button>
                        </SignInButton>
                    </SignedOut>
                </div>
            </header>

            <main style={{ maxWidth: '1360px', margin: '0 auto', padding: '3.5rem 1.5rem' }}>
                {/* Hero */}
                <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: '#ecfdf5',
                        color: '#065f46',
                        padding: '0.45rem 1.25rem',
                        borderRadius: '100px',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        marginBottom: '1.25rem',
                        border: '1px solid #a7f3d0'
                    }}>
                        <Sparkles size={16} /> 🏢 Built for Indian Real Estate • WhatsApp Tracking • Anti-Rate-Leak Watermarking • 18% GST ITC
                    </div>
                    <h1 style={{
                        fontSize: 'clamp(2.4rem, 4.5vw, 3.75rem)',
                        fontWeight: 800,
                        color: '#0f172a',
                        marginBottom: '1rem',
                        letterSpacing: '-0.025em',
                        lineHeight: 1.15
                    }}>
                        Predictable, High-Impact <span style={{ color: '#059669' }}>Pricing</span>
                    </h1>
                    <p style={{
                        fontSize: '1.15rem',
                        color: '#64748b',
                        maxWidth: '780px',
                        margin: '0 auto',
                        lineHeight: 1.6
                    }}>
                        Tailored for Indian builders, channel partner brokers, real estate advocates, and enterprise dealmakers. Start free with zero credit card required, or upgrade to run full-fledged RERA and title diligence deal rooms.
                    </p>

                    {/* Dual-Currency & Billing Cycle Switchers */}
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '1.25rem',
                        marginTop: '2.5rem'
                    }}>
                        {/* Currency Selector */}
                        <div style={{
                            display: 'inline-flex',
                            background: '#e2e8f0',
                            padding: '0.35rem',
                            borderRadius: '14px'
                        }}>
                            <button
                                onClick={() => setCurrency('INR')}
                                style={{
                                    padding: '0.5rem 1.25rem',
                                    borderRadius: '10px',
                                    border: 'none',
                                    background: currency === 'INR' ? '#ffffff' : 'transparent',
                                    color: currency === 'INR' ? '#0f172a' : '#64748b',
                                    fontWeight: 700,
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    boxShadow: currency === 'INR' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                🇮🇳 INR (₹)
                            </button>
                            <button
                                onClick={() => setCurrency('USD')}
                                style={{
                                    padding: '0.5rem 1.25rem',
                                    borderRadius: '10px',
                                    border: 'none',
                                    background: currency === 'USD' ? '#ffffff' : 'transparent',
                                    color: currency === 'USD' ? '#0f172a' : '#64748b',
                                    fontWeight: 700,
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    boxShadow: currency === 'USD' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                🌐 USD ($)
                            </button>
                        </div>

                        {/* Billing Cycle Selector */}
                        <div style={{
                            display: 'inline-flex',
                            background: '#e2e8f0',
                            padding: '0.35rem',
                            borderRadius: '14px'
                        }}>
                            <button
                                onClick={() => setBillingCycle('monthly')}
                                style={{
                                    padding: '0.5rem 1.25rem',
                                    borderRadius: '10px',
                                    border: 'none',
                                    background: billingCycle === 'monthly' ? '#ffffff' : 'transparent',
                                    color: billingCycle === 'monthly' ? '#0f172a' : '#64748b',
                                    fontWeight: 700,
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    boxShadow: billingCycle === 'monthly' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                Monthly Billing
                            </button>
                            <button
                                onClick={() => setBillingCycle('annual')}
                                style={{
                                    padding: '0.5rem 1.25rem',
                                    borderRadius: '10px',
                                    border: 'none',
                                    background: billingCycle === 'annual' ? '#ffffff' : 'transparent',
                                    color: billingCycle === 'annual' ? '#0f172a' : '#64748b',
                                    fontWeight: 700,
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    boxShadow: billingCycle === 'annual' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                Annual Billing
                                <span style={{
                                    background: '#dcfce7',
                                    color: '#16a34a',
                                    fontSize: '0.72rem',
                                    padding: '0.2rem 0.5rem',
                                    borderRadius: '6px',
                                    fontWeight: 800
                                }}>SAVE ~25%</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 4 Pricing Cards Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '1.75rem',
                    marginBottom: '6rem',
                    alignItems: 'stretch'
                }}>
                    {plans.map((p) => {
                        const isCurrent = currentPlan === p.planType;
                        const PlanIcon = p.icon;

                        return (
                            <div
                                key={p.name}
                                style={{
                                    background: 'white',
                                    borderRadius: '24px',
                                    padding: '2.25rem 1.75rem',
                                    border: p.popular ? `2px solid ${p.color}` : '1px solid #e2e8f0',
                                    boxShadow: p.popular
                                        ? `0 24px 48px -12px ${p.color}30, 0 4px 12px rgba(0,0,0,0.04)`
                                        : '0 8px 30px rgba(0,0,0,0.05)',
                                    position: 'relative',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    overflow: 'hidden'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-6px)';
                                    e.currentTarget.style.boxShadow = p.popular
                                        ? `0 30px 60px -15px ${p.color}45`
                                        : '0 16px 40px rgba(0,0,0,0.09)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = p.popular
                                        ? `0 24px 48px -12px ${p.color}30, 0 4px 12px rgba(0,0,0,0.04)`
                                        : '0 8px 30px rgba(0,0,0,0.05)';
                                }}
                            >
                                {p.badge && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '1rem',
                                        right: '1rem',
                                        background: p.color,
                                        color: 'white',
                                        padding: '0.3rem 0.75rem',
                                        borderRadius: '100px',
                                        fontSize: '0.68rem',
                                        fontWeight: 800,
                                        letterSpacing: '0.04em'
                                    }}>
                                        {p.badge}
                                    </div>
                                )}

                                {/* Card Header */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '14px',
                                        background: p.accentBg,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: p.color
                                    }}>
                                        <PlanIcon size={24} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{p.name}</h3>
                                    </div>
                                </div>

                                <p style={{ color: '#64748b', fontSize: '0.88rem', minHeight: '2.8rem', lineHeight: 1.45, margin: '0 0 1.25rem' }}>
                                    {p.tagline}
                                </p>

                                {/* Price block */}
                                <div style={{ marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid #f1f5f9' }}>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                                        <span style={{ fontSize: '2.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                                            {p.price}
                                        </span>
                                        <span style={{ color: '#64748b', fontSize: '1rem', fontWeight: 500 }}>
                                            {p.period}
                                        </span>
                                    </div>
                                    <p style={{ color: '#94a3b8', fontSize: '0.78rem', margin: '0.35rem 0 0', fontWeight: 500 }}>
                                        {p.subText}
                                    </p>
                                </div>

                                {/* Feature List */}
                                <div style={{ flex: 1, marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {p.features.map((f, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                                            <div style={{
                                                width: '18px',
                                                height: '18px',
                                                borderRadius: '50%',
                                                background: f.enabled ? (f.highlight ? p.color : '#dcfce7') : '#f1f5f9',
                                                color: f.enabled ? (f.highlight ? 'white' : '#166534') : '#94a3b8',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0,
                                                marginTop: '2px'
                                            }}>
                                                {f.enabled ? <Check size={11} strokeWidth={3.5} /> : <X size={11} strokeWidth={2} />}
                                            </div>
                                            <span style={{
                                                fontSize: '0.85rem',
                                                color: f.enabled ? (f.highlight ? '#0f172a' : '#334155') : '#94a3b8',
                                                fontWeight: f.highlight ? 700 : 500,
                                                lineHeight: 1.4
                                            }}>
                                                {f.text}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* CTA Button */}
                                <button
                                    onClick={() => handleUpgrade(p.planType)}
                                    disabled={isCurrent}
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        borderRadius: '14px',
                                        border: 'none',
                                        background: isCurrent
                                            ? '#f1f5f9'
                                            : p.planType === 'free'
                                                ? '#334155'
                                                : p.color,
                                        color: isCurrent ? '#94a3b8' : 'white',
                                        fontWeight: 700,
                                        fontSize: '0.98rem',
                                        cursor: isCurrent ? 'default' : 'pointer',
                                        transition: 'all 0.2s',
                                        boxShadow: isCurrent ? 'none' : `0 8px 20px -6px ${p.color}55`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isCurrent) e.currentTarget.style.filter = 'brightness(1.08)';
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isCurrent) e.currentTarget.style.filter = 'brightness(1)';
                                    }}
                                >
                                    {isCurrent ? 'Current Active Plan' : p.cta}
                                    {!isCurrent && <ArrowRight size={16} />}
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Razorpay Trust Banner */}
                <div style={{
                    background: 'white',
                    borderRadius: '20px',
                    border: '1px solid #e2e8f0',
                    padding: '2rem 2.5rem',
                    marginBottom: '6rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '2rem',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <div style={{
                            width: '54px',
                            height: '54px',
                            borderRadius: '14px',
                            background: '#eff6ff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#3b82f6'
                        }}>
                            <CreditCard size={26} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                                Powered by Razorpay Payment Gateway
                            </h3>
                            <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.88rem' }}>
                                Instant activation via UPI (GPay, PhonePe, Paytm), RuPay / Visa / Mastercard, NetBanking & International cards.
                            </p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        {['UPI (GPay / PhonePe)', 'RuPay Cards', 'Visa / Mastercard', '50+ Banks NetBanking', 'GST ITC Invoices'].map(t => (
                            <span key={t} style={{
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                color: '#1e40af',
                                background: '#dbeafe',
                                padding: '0.4rem 0.8rem',
                                borderRadius: '8px'
                            }}>{t}</span>
                        ))}
                    </div>
                </div>

                {/* Feature Comparison Table */}
                <div style={{ marginBottom: '6rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
                            Full Plan Specification Matrix
                        </h2>
                        <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '650px', margin: '0 auto' }}>
                            Compare all features across Free, Pro, Business, and Virtual Data Room tiers.
                        </p>
                    </div>

                    <div style={{
                        background: 'white',
                        borderRadius: '24px',
                        border: '1px solid #e2e8f0',
                        overflowX: 'auto',
                        boxShadow: '0 4px 25px rgba(0,0,0,0.04)'
                    }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                            <thead>
                                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                    <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>Features</th>
                                    <th style={{ padding: '1.25rem 1rem', fontSize: '0.9rem', fontWeight: 800, color: '#64748b', width: '18%' }}>Free Forever</th>
                                    <th style={{ padding: '1.25rem 1rem', fontSize: '0.9rem', fontWeight: 800, color: '#3b82f6', width: '20%' }}>Pro Plan</th>
                                    <th style={{ padding: '1.25rem 1rem', fontSize: '0.9rem', fontWeight: 800, color: '#8b5cf6', width: '20%' }}>Business Suite</th>
                                    <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.9rem', fontWeight: 800, color: '#10b981', width: '22%' }}>Virtual Data Room</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comparisons.map((row, idx) => {
                                    if (row.category) {
                                        return (
                                            <tr key={idx} style={{ background: '#f1f5f9', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                                                <td colSpan={5} style={{ padding: '0.85rem 1.5rem', fontWeight: 800, fontSize: '0.8rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                    {row.category}
                                                </td>
                                            </tr>
                                        );
                                    }

                                    const renderCell = (val: any) => {
                                        if (typeof val === 'boolean') {
                                            return val ? (
                                                <Check size={18} color="#16a34a" strokeWidth={3} />
                                            ) : (
                                                <X size={18} color="#cbd5e1" strokeWidth={2} />
                                            );
                                        }
                                        return <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b' }}>{val}</span>;
                                    };

                                    return (
                                        <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}>
                                            <td style={{ padding: '1rem 1.5rem', fontSize: '0.88rem', color: '#334155', fontWeight: 500 }}>
                                                {row.feature}
                                            </td>
                                            <td style={{ padding: '1rem', color: '#64748b' }}>{renderCell(row.free)}</td>
                                            <td style={{ padding: '1rem', background: '#eff6ff30' }}>{renderCell(row.pro)}</td>
                                            <td style={{ padding: '1rem', background: '#f5f3ff30' }}>{renderCell(row.business)}</td>
                                            <td style={{ padding: '1rem 1.5rem', background: '#ecfdf530' }}>{renderCell(row.dataroom)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* FAQ Section */}
                <div style={{ maxWidth: '840px', margin: '0 auto 6rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                            Frequently Asked Questions
                        </h2>
                        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                            Everything you need to know about DocTransfer billing, compliance, and payment processing.
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {faqs.map((faq, index) => (
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
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                    style={{
                                        width: '100%',
                                        padding: '1.25rem 1.5rem',
                                        background: 'transparent',
                                        border: 'none',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        cursor: 'pointer',
                                        textAlign: 'left'
                                    }}
                                >
                                    <span style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>{faq.q}</span>
                                    <ChevronDown
                                        size={20}
                                        color="#64748b"
                                        style={{
                                            transform: openFaq === index ? 'rotate(180deg)' : 'rotate(0deg)',
                                            transition: 'transform 0.2s ease'
                                        }}
                                    />
                                </button>
                                {openFaq === index && (
                                    <div style={{ padding: '0 1.5rem 1.25rem', color: '#475569', fontSize: '0.92rem', lineHeight: 1.6 }}>
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Pricing;
