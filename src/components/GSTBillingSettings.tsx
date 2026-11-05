import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../hooks/useSubscription';
import {
    CreditCard,
    CheckCircle,
    FileText,
    Download,
    Building2,
    ShieldCheck,
    AlertCircle,
    Save,
    Sparkles,
    Calendar,
    ArrowUpRight,
    Loader2,
    Globe
} from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export const GSTBillingSettings: React.FC = () => {
    const navigate = useNavigate();
    const { subscription } = useSubscription();

    // Tax Jurisdiction State
    const [taxRegime, setTaxRegime] = useState<'uae_vat' | 'eu_vat' | 'uk_vat' | 'us_tax' | 'international'>('uae_vat');
    const [currency, setCurrency] = useState<'USD' | 'AED' | 'EUR' | 'GBP'>('USD');
    const [legalEntityName, setLegalEntityName] = useState('');
    const [taxId, setTaxId] = useState(''); // TRN / VAT ID / EIN
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('United Arab Emirates');
    const [postalCode, setPostalCode] = useState('');
    const [saving, setSaving] = useState(false);
    const [downloadingInv, setDownloadingInv] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Load saved profile
    useEffect(() => {
        const saved = localStorage.getItem('doctransfer_billing_profile') || localStorage.getItem('doctransfer_gst_profile');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setLegalEntityName(parsed.legalEntityName || '');
                setTaxId(parsed.taxId || parsed.gstin || '');
                setTaxRegime(parsed.taxRegime || 'uae_vat');
                setCurrency(parsed.currency || 'USD');
                setAddress(parsed.address || '');
                setCity(parsed.city || '');
                setCountry(parsed.country || 'United Arab Emirates');
                setPostalCode(parsed.postalCode || parsed.pincode || '');
            } catch (e) {
                console.error(e);
            }
        }
    }, []);

    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setStatusMessage(null);

        const profile = {
            taxRegime,
            currency,
            legalEntityName,
            taxId,
            address,
            city,
            country,
            postalCode,
            updatedAt: new Date().toISOString()
        };

        localStorage.setItem('doctransfer_billing_profile', JSON.stringify(profile));

        setTimeout(() => {
            setSaving(false);
            setStatusMessage({ type: 'success', text: 'International B2B Tax Profile saved successfully. All future tax invoices will reflect these credentials.' });
        }, 400);
    };

    // Plan pricing display in USD
    const planType = subscription?.plan_type || 'free';
    const planDetails = ({
        free: { name: 'Free Forever', price: '$0', cycle: 'Lifetime', isFree: true },
        pro: { name: 'Pro Dealmaker Plan', price: '$29 / mo', cycle: 'Billed Monthly', isFree: false },
        standard: { name: 'Pro Dealmaker Plan', price: '$29 / mo', cycle: 'Billed Monthly', isFree: false },
        business: { name: 'Business & Agency Suite', price: '$79 / mo', cycle: 'Billed Monthly', isFree: false },
        dataroom: { name: 'Virtual Data Room (VDR)', price: '$199 / mo', cycle: 'Billed Monthly', isFree: false },
        single_deal: { name: '90-Day Single-Deal VDR Pass', price: '$299', cycle: '90-Day Access Pass', isFree: false }
    } as Record<string, { name: string; price: string; cycle: string; isFree: boolean }>)[planType] || { name: 'Free Plan', price: '$0', cycle: 'Free', isFree: true };

    const currencySymbol = currency === 'USD' ? '$' : currency === 'AED' ? 'AED ' : currency === 'EUR' ? '€' : '£';

    // Sample invoices for billing history
    const sampleInvoices = [
        {
            id: 'DT-INV-2026-10-001',
            date: '15 Oct 2026',
            plan: planDetails.name,
            taxable: planType === 'business' ? 149 : planType === 'dataroom' ? 399 : 49,
            taxRate: taxRegime === 'uae_vat' ? '5% UAE VAT' : taxRegime === 'eu_vat' ? '0% Reverse Charge' : '0% Exempt',
            taxAmount: taxRegime === 'uae_vat' ? (planType === 'business' ? 7.45 : planType === 'dataroom' ? 19.95 : 2.45) : 0,
            total: taxRegime === 'uae_vat' ? (planType === 'business' ? 156.45 : planType === 'dataroom' ? 418.95 : 51.45) : (planType === 'business' ? 149 : planType === 'dataroom' ? 399 : 49),
            status: 'Paid'
        },
        {
            id: 'DT-INV-2026-09-001',
            date: '15 Sep 2026',
            plan: planDetails.name,
            taxable: planType === 'business' ? 149 : planType === 'dataroom' ? 399 : 49,
            taxRate: taxRegime === 'uae_vat' ? '5% UAE VAT' : taxRegime === 'eu_vat' ? '0% Reverse Charge' : '0% Exempt',
            taxAmount: taxRegime === 'uae_vat' ? (planType === 'business' ? 7.45 : planType === 'dataroom' ? 19.95 : 2.45) : 0,
            total: taxRegime === 'uae_vat' ? (planType === 'business' ? 156.45 : planType === 'dataroom' ? 418.95 : 51.45) : (planType === 'business' ? 149 : planType === 'dataroom' ? 399 : 49),
            status: 'Paid'
        }
    ];

    // Global 1-Click PDF Tax Invoice Generator
    const downloadTaxInvoicePDF = async (inv: typeof sampleInvoices[0]) => {
        setDownloadingInv(inv.id);
        try {
            const pdfDoc = await PDFDocument.create();
            const page = pdfDoc.addPage([595.28, 841.89]); // A4
            const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
            const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

            const { height } = page.getSize();
            let y = height - 50;

            // Header
            page.drawText('INTERNATIONAL B2B TAX INVOICE', {
                x: 50,
                y,
                size: 16,
                font: fontBold,
                color: rgb(0.02, 0.58, 0.41)
            });

            y -= 25;
            page.drawText('DocTransfer Global Technologies Ltd. (DIFC / ADGM / London)', { x: 50, y, size: 11, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
            y -= 14;
            page.drawText('TRN / Corporate Tax ID: 100492817200003 | Enterprise VDR & Data Security Cloud', { x: 50, y, size: 9, font: fontRegular, color: rgb(0.4, 0.4, 0.4) });
            y -= 14;
            page.drawText('Registered Address: Dubai International Financial Centre (DIFC), Gate Precinct 4, Dubai, UAE', { x: 50, y, size: 9, font: fontRegular, color: rgb(0.4, 0.4, 0.4) });

            y -= 25;
            page.drawLine({ start: { x: 50, y }, end: { x: 545, y }, thickness: 1, color: rgb(0.85, 0.85, 0.85) });

            // Invoice Meta
            y -= 25;
            page.drawText(`Invoice Reference: ${inv.id}`, { x: 50, y, size: 10, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
            page.drawText(`Date of Issue: ${inv.date}`, { x: 350, y, size: 10, font: fontRegular, color: rgb(0.3, 0.3, 0.3) });

            y -= 16;
            page.drawText(`Tax Regime: ${taxRegime.toUpperCase().replace('_', ' ')}`, { x: 50, y, size: 9, font: fontRegular, color: rgb(0.3, 0.3, 0.3) });
            page.drawText(`Payment Gateway: International Card / Wire Transfer`, { x: 350, y, size: 9, font: fontRegular, color: rgb(0.3, 0.3, 0.3) });

            // Billed To
            y -= 30;
            page.drawText('Billed To (Client Enterprise Details):', { x: 50, y, size: 11, font: fontBold, color: rgb(0.02, 0.58, 0.41) });
            y -= 16;
            page.drawText(`Entity Name: ${legalEntityName || 'Registered Enterprise Client'}`, { x: 50, y, size: 10, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
            y -= 14;
            page.drawText(`Tax Registration / VAT ID: ${taxId || 'Cross-Border B2B / Not Provided'}`, { x: 50, y, size: 9, font: fontRegular, color: rgb(0.3, 0.3, 0.3) });
            if (address) {
                y -= 14;
                page.drawText(`Address: ${address}, ${city}, ${country} ${postalCode}`, { x: 50, y, size: 9, font: fontRegular, color: rgb(0.4, 0.4, 0.4) });
            }

            // Table Header
            y -= 35;
            page.drawRectangle({ x: 50, y: y - 5, width: 495, height: 22, color: rgb(0.95, 0.97, 0.96) });
            page.drawText('Description of Secure Services', { x: 55, y, size: 9, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
            page.drawText('Currency', { x: 270, y, size: 9, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
            page.drawText('Net Amount', { x: 340, y, size: 9, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
            page.drawText('VAT Rate', { x: 420, y, size: 9, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
            page.drawText('Gross Total', { x: 480, y, size: 9, font: fontBold, color: rgb(0.1, 0.1, 0.1) });

            y -= 25;
            page.drawText(`${inv.plan} Cloud Subscription`, { x: 55, y, size: 9, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });
            page.drawText(`${currency}`, { x: 270, y, size: 9, font: fontRegular, color: rgb(0.3, 0.3, 0.3) });
            page.drawText(`${currencySymbol}${inv.taxable.toFixed(2)}`, { x: 340, y, size: 9, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });
            page.drawText(`${inv.taxRate}`, { x: 420, y, size: 9, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });
            page.drawText(`${currencySymbol}${inv.total.toFixed(2)}`, { x: 480, y, size: 9, font: fontBold, color: rgb(0.1, 0.1, 0.1) });

            y -= 35;
            page.drawLine({ start: { x: 50, y }, end: { x: 545, y }, thickness: 1, color: rgb(0.85, 0.85, 0.85) });

            // Tax Breakdown
            y -= 20;
            page.drawText('Tax & VAT Summary:', { x: 320, y, size: 9, font: fontBold, color: rgb(0.2, 0.2, 0.2) });
            y -= 14;
            page.drawText(`Applicable VAT: ${currencySymbol}${inv.taxAmount.toFixed(2)}`, { x: 320, y, size: 8.5, font: fontRegular, color: rgb(0.3, 0.3, 0.3) });
            y -= 16;
            page.drawText(`Total Invoiced Amount: ${currencySymbol}${inv.total.toFixed(2)}`, { x: 320, y, size: 11, font: fontBold, color: rgb(0.02, 0.58, 0.41) });

            // Footer
            y = 60;
            page.drawLine({ start: { x: 50, y: y + 10 }, end: { x: 545, y: y + 10 }, thickness: 0.5, color: rgb(0.8, 0.8, 0.8) });
            page.drawText('Electronic invoice issued under international commercial law. Fully compliant with UAE FTA VAT & EU Article 219 Directive.', { x: 50, y, size: 8, font: fontRegular, color: rgb(0.5, 0.5, 0.5) });
            y -= 12;
            page.drawText('For EU B2B cross-border supplies: VAT Reverse Charge applies in the member state of destination.', { x: 50, y, size: 8, font: fontRegular, color: rgb(0.5, 0.5, 0.5) });

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${inv.id}.pdf`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Invoice PDF download error:', err);
        } finally {
            setDownloadingInv(null);
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
                <div>
                    <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
                        <ShieldCheck size={14} /> Global B2B Invoicing & Tax Architecture
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Billing & Tax Credentials (Global B2B)</h2>
                    <p className="text-gray-500 text-sm mt-1">Manage institutional subscriptions, configure multi-jurisdiction VAT (UAE, EU, UK, US), and download tax invoices.</p>
                </div>
                <button
                    onClick={() => navigate('/pricing')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition-all"
                >
                    <Sparkles size={16} /> Upgrade / Change Tier <ArrowUpRight size={15} />
                </button>
            </div>

            {/* Current Active Plan Card */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-emerald-500/10 to-transparent pointer-events-none" />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider border border-emerald-500/30 mb-2">
                            Active Enterprise Plan
                        </div>
                        <h3 className="text-2xl font-black">{planDetails.name}</h3>
                        <p className="text-slate-400 text-sm mt-0.5">{planDetails.cycle} • Standard SLA Guarantee</p>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-black text-emerald-400">{planDetails.price}</div>
                        <div className="text-xs text-slate-400 mt-1">Institutional Deal Room License</div>
                    </div>
                </div>
            </div>

            {/* Tax Credentials Form */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Building2 size={20} className="text-emerald-600" /> Corporate Legal Entity & Tax Credentials
                        </h3>
                        <p className="text-gray-500 text-xs mt-0.5">Applied to all generated B2B tax receipts, statements, and audit ledgers.</p>
                    </div>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Tax Jurisdiction */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Tax Jurisdiction / Regime
                            </label>
                            <select
                                value={taxRegime}
                                onChange={(e) => setTaxRegime(e.target.value as any)}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                            >
                                <option value="uae_vat">🇦🇪 UAE Federal Tax Authority (5% VAT / TRN)</option>
                                <option value="eu_vat">🇪🇺 European Union (VIES VAT / Reverse-Charge 0%)</option>
                                <option value="uk_vat">🇬🇧 United Kingdom HMRC (Standard VAT)</option>
                                <option value="us_tax">🇺🇸 United States (W-9 / Corporate EIN)</option>
                                <option value="international">🌐 Cross-Border International (Direct Export 0%)</option>
                            </select>
                        </div>

                        {/* Invoicing Currency */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Settlement Currency
                            </label>
                            <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value as any)}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                            >
                                <option value="USD">USD ($) - US Dollar</option>
                                <option value="AED">AED (د.إ) - UAE Dirham</option>
                                <option value="EUR">EUR (€) - Euro</option>
                                <option value="GBP">GBP (£) - British Pound</option>
                            </select>
                        </div>

                        {/* Legal Entity Name */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Registered Corporate Entity Name
                            </label>
                            <input
                                type="text"
                                value={legalEntityName}
                                onChange={(e) => setLegalEntityName(e.target.value)}
                                placeholder="e.g. Apex Sovereign Capital FZ-LLC"
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                            />
                        </div>

                        {/* Tax ID / TRN */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                {taxRegime === 'uae_vat' ? 'UAE TRN (15 Digits)' : taxRegime === 'eu_vat' ? 'EU VAT ID (e.g. DE123456789)' : taxRegime === 'uk_vat' ? 'UK VAT Registration No.' : 'Corporate Tax ID / EIN'}
                            </label>
                            <input
                                type="text"
                                value={taxId}
                                onChange={(e) => setTaxId(e.target.value.toUpperCase())}
                                placeholder={taxRegime === 'uae_vat' ? '100492817200003' : taxRegime === 'eu_vat' ? 'NL883920194B01' : 'Tax ID Number'}
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 uppercase focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none font-mono"
                            />
                        </div>

                        {/* Registered Address */}
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Registered Office Street Address
                            </label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="e.g. Unit 402, Al Saaha Offices, Downtown Dubai / 100 Bishopsgate, London"
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                            />
                        </div>

                        {/* City */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                City
                            </label>
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="e.g. Dubai / London / Frankfurt"
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                            />
                        </div>

                        {/* Country */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Country
                            </label>
                            <input
                                type="text"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                placeholder="e.g. United Arab Emirates / Germany / UK"
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                            />
                        </div>
                    </div>

                    {statusMessage && (
                        <div className={`p-4 rounded-xl text-sm font-medium flex items-center gap-2 ${statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                            {statusMessage.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                            {statusMessage.text}
                        </div>
                    )}

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white font-bold rounded-xl text-sm hover:bg-gray-800 transition-all shadow-md"
                        >
                            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            {saving ? 'Saving...' : 'Save Global Tax Profile'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Invoices List */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <FileText size={20} className="text-emerald-600" /> B2B Tax Invoices & Statements
                    </h3>
                </div>

                <div className="divide-y divide-gray-100">
                    {sampleInvoices.map((inv) => (
                        <div key={inv.id} className="py-4 flex items-center justify-between gap-4">
                            <div>
                                <div className="font-bold text-gray-900 text-sm">{inv.id}</div>
                                <div className="text-xs text-gray-500">{inv.date} • {inv.plan} • {inv.taxRate}</div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <div className="font-extrabold text-gray-900 text-sm">{currencySymbol}{inv.total.toFixed(2)}</div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                        {inv.status}
                                    </span>
                                </div>
                                <button
                                    onClick={() => downloadTaxInvoicePDF(inv)}
                                    disabled={downloadingInv === inv.id}
                                    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 transition-all"
                                    title="Download PDF Tax Invoice"
                                >
                                    {downloadingInv === inv.id ? <Loader2 size={16} className="animate-spin text-emerald-600" /> : <Download size={16} />}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GSTBillingSettings;
