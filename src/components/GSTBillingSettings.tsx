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
    Loader2
} from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const INDIAN_STATES_MAP: Record<string, string> = {
    '01': 'Jammu & Kashmir',
    '02': 'Himachal Pradesh',
    '03': 'Punjab',
    '04': 'Chandigarh',
    '06': 'Haryana',
    '07': 'Delhi',
    '08': 'Rajasthan',
    '09': 'Uttar Pradesh',
    '10': 'Bihar',
    '19': 'West Bengal',
    '23': 'Madhya Pradesh',
    '24': 'Gujarat',
    '27': 'Maharashtra',
    '29': 'Karnataka',
    '32': 'Kerala',
    '33': 'Tamil Nadu',
    '36': 'Telangana',
    '37': 'Andhra Pradesh'
};

export const GSTBillingSettings: React.FC = () => {
    const navigate = useNavigate();
    const { subscription } = useSubscription();

    const [legalEntityName, setLegalEntityName] = useState('');
    const [gstin, setGstin] = useState('');
    const [pan, setPan] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [stateName, setStateName] = useState('');
    const [pincode, setPincode] = useState('');
    const [saving, setSaving] = useState(false);
    const [downloadingInv, setDownloadingInv] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Load saved GST profile
    useEffect(() => {
        const saved = localStorage.getItem('doctransfer_gst_profile');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setLegalEntityName(parsed.legalEntityName || '');
                setGstin(parsed.gstin || '');
                setPan(parsed.pan || '');
                setAddress(parsed.address || '');
                setCity(parsed.city || '');
                setStateName(parsed.stateName || '');
                setPincode(parsed.pincode || '');
            } catch (e) {
                console.error(e);
            }
        }
    }, []);

    // Auto-extract PAN & State from GSTIN
    const handleGstinChange = (val: string) => {
        const upper = val.toUpperCase().trim();
        setGstin(upper);

        if (upper.length >= 2) {
            const stateCode = upper.substring(0, 2);
            if (INDIAN_STATES_MAP[stateCode]) {
                setStateName(INDIAN_STATES_MAP[stateCode]);
            }
        }

        if (upper.length >= 12) {
            const extractedPan = upper.substring(2, 12);
            setPan(extractedPan);
        }
    };

    const isGstinValid = (val: string): boolean => {
        const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        return regex.test(val);
    };

    const handleSaveGST = (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setStatusMessage(null);

        if (gstin && !isGstinValid(gstin)) {
            setStatusMessage({ type: 'error', text: 'Please enter a valid 15-character Indian GSTIN number (e.g. 27AAAAA0000A1Z5).' });
            setSaving(false);
            return;
        }

        const profile = {
            legalEntityName,
            gstin,
            pan,
            address,
            city,
            stateName,
            pincode,
            updatedAt: new Date().toISOString()
        };

        localStorage.setItem('doctransfer_gst_profile', JSON.stringify(profile));

        setTimeout(() => {
            setSaving(false);
            setStatusMessage({ type: 'success', text: 'B2B GST Tax Profile saved successfully. All future tax invoices will reflect these details.' });
        }, 400);
    };

    // Plan pricing display
    const planType = subscription?.plan_type || 'free';
    const planDetails = {
        free: { name: 'Free Forever', price: '₹0', cycle: 'Lifetime', isFree: true },
        pro: { name: 'Pro Plan', price: '₹499 / mo', cycle: 'Annual (₹5,988/yr)', isFree: false },
        standard: { name: 'Pro Plan', price: '₹499 / mo', cycle: 'Annual (₹5,988/yr)', isFree: false },
        business: { name: 'Business & Agency Suite', price: '₹1,349 / mo', cycle: 'Annual (₹16,188/yr)', isFree: false },
        dataroom: { name: 'Virtual Data Room (VDR)', price: '₹3,749 / mo', cycle: 'Annual (₹44,988/yr)', isFree: false }
    }[planType] || { name: 'Free Plan', price: '₹0', cycle: 'Free', isFree: true };

    // Sample invoices for billing history
    const sampleInvoices = [
        {
            id: 'DT-INV-2026-09-001',
            date: '15 Sep 2026',
            plan: planDetails.name,
            taxable: 499,
            gstRate: '18%',
            taxAmount: 89.82,
            total: 588.82,
            status: 'Paid'
        },
        {
            id: 'DT-INV-2026-08-001',
            date: '15 Aug 2026',
            plan: planDetails.name,
            taxable: 499,
            gstRate: '18%',
            taxAmount: 89.82,
            total: 588.82,
            status: 'Paid'
        }
    ];

    // 1-Click PDF Tax Invoice Generator
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
            page.drawText('TAX INVOICE (INPUT TAX CREDIT ELIGIBLE)', {
                x: 50,
                y,
                size: 16,
                font: fontBold,
                color: rgb(0.02, 0.58, 0.41)
            });

            y -= 25;
            page.drawText('DocTransfer Technologies India Pvt. Ltd.', { x: 50, y, size: 11, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
            y -= 14;
            page.drawText('GSTIN: 27AABCD1234E1Z8 | HSN/SAC Code: 998313 (Cloud IT & Data Hosting Services)', { x: 50, y, size: 9, font: fontRegular, color: rgb(0.4, 0.4, 0.4) });
            y -= 14;
            page.drawText('Registered Office: Bandra Kurla Complex (BKC), Mumbai, Maharashtra 400051', { x: 50, y, size: 9, font: fontRegular, color: rgb(0.4, 0.4, 0.4) });

            y -= 25;
            page.drawLine({ start: { x: 50, y }, end: { x: 545, y }, thickness: 1, color: rgb(0.85, 0.85, 0.85) });

            // Invoice Meta
            y -= 25;
            page.drawText(`Invoice No: ${inv.id}`, { x: 50, y, size: 10, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
            page.drawText(`Invoice Date: ${inv.date}`, { x: 350, y, size: 10, font: fontRegular, color: rgb(0.3, 0.3, 0.3) });

            y -= 16;
            page.drawText(`Place of Supply: ${stateName || 'Maharashtra (27)'}`, { x: 50, y, size: 9, font: fontRegular, color: rgb(0.3, 0.3, 0.3) });
            page.drawText(`Payment Mode: UPI / Razorpay Gateway`, { x: 350, y, size: 9, font: fontRegular, color: rgb(0.3, 0.3, 0.3) });

            // Billed To
            y -= 30;
            page.drawText('Billed To (Customer Details):', { x: 50, y, size: 11, font: fontBold, color: rgb(0.02, 0.58, 0.41) });
            y -= 16;
            page.drawText(`Entity Name: ${legalEntityName || 'Registered DocTransfer Subscriber'}`, { x: 50, y, size: 10, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
            y -= 14;
            page.drawText(`Customer GSTIN: ${gstin || 'B2C / Consumer (No GSTIN provided)'}`, { x: 50, y, size: 9, font: fontRegular, color: rgb(0.3, 0.3, 0.3) });
            if (pan) {
                y -= 14;
                page.drawText(`PAN: ${pan}`, { x: 50, y, size: 9, font: fontRegular, color: rgb(0.3, 0.3, 0.3) });
            }
            if (address) {
                y -= 14;
                page.drawText(`Address: ${address}, ${city} ${stateName} ${pincode}`, { x: 50, y, size: 9, font: fontRegular, color: rgb(0.4, 0.4, 0.4) });
            }

            // Table Header
            y -= 35;
            page.drawRectangle({ x: 50, y: y - 5, width: 495, height: 22, color: rgb(0.95, 0.97, 0.96) });
            page.drawText('Description of Software Services', { x: 55, y, size: 9, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
            page.drawText('SAC', { x: 270, y, size: 9, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
            page.drawText('Taxable (INR)', { x: 340, y, size: 9, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
            page.drawText('GST 18%', { x: 420, y, size: 9, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
            page.drawText('Total (INR)', { x: 480, y, size: 9, font: fontBold, color: rgb(0.1, 0.1, 0.1) });

            y -= 25;
            page.drawText(`${inv.plan} Subscription`, { x: 55, y, size: 9, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });
            page.drawText('998313', { x: 270, y, size: 9, font: fontRegular, color: rgb(0.3, 0.3, 0.3) });
            page.drawText(`Rs. ${inv.taxable.toFixed(2)}`, { x: 340, y, size: 9, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });
            page.drawText(`Rs. ${inv.taxAmount.toFixed(2)}`, { x: 420, y, size: 9, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });
            page.drawText(`Rs. ${inv.total.toFixed(2)}`, { x: 480, y, size: 9, font: fontBold, color: rgb(0.1, 0.1, 0.1) });

            y -= 35;
            page.drawLine({ start: { x: 50, y }, end: { x: 545, y }, thickness: 1, color: rgb(0.85, 0.85, 0.85) });

            // Tax Breakdown
            y -= 20;
            page.drawText('GST Breakdown:', { x: 320, y, size: 9, font: fontBold, color: rgb(0.2, 0.2, 0.2) });
            y -= 14;
            page.drawText(`CGST (9%): Rs. ${(inv.taxAmount / 2).toFixed(2)}`, { x: 320, y, size: 8.5, font: fontRegular, color: rgb(0.3, 0.3, 0.3) });
            y -= 14;
            page.drawText(`SGST (9%): Rs. ${(inv.taxAmount / 2).toFixed(2)}`, { x: 320, y, size: 8.5, font: fontRegular, color: rgb(0.3, 0.3, 0.3) });
            y -= 16;
            page.drawText(`Total Invoiced: Rs. ${inv.total.toFixed(2)}`, { x: 320, y, size: 11, font: fontBold, color: rgb(0.02, 0.58, 0.41) });

            // Footer
            y = 60;
            page.drawLine({ start: { x: 50, y: y + 10 }, end: { x: 545, y: y + 10 }, thickness: 0.5, color: rgb(0.8, 0.8, 0.8) });
            page.drawText('This is a computer-generated tax invoice and requires no physical signature under IT Act 2000.', { x: 50, y, size: 8, font: fontRegular, color: rgb(0.5, 0.5, 0.5) });
            y -= 12;
            page.drawText('Tax is paid on reverse charge basis: NO | Certified 18% Input Tax Credit (ITC) Eligible under CGST Act 2017.', { x: 50, y, size: 8, font: fontRegular, color: rgb(0.5, 0.5, 0.5) });

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
                        <ShieldCheck size={14} /> GST Tax Invoicing & Subscription Hub
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Billing & Plans (India B2B)</h2>
                    <p className="text-gray-500 text-sm mt-1">Manage active plans, claim 18% GST Input Tax Credit (ITC), and download invoices.</p>
                </div>
                <button
                    onClick={() => navigate('/pricing')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-xs rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all w-fit"
                >
                    <Sparkles size={14} />
                    View Real Estate Plans <ArrowUpRight size={14} />
                </button>
            </div>

            {statusMessage && (
                <div className={`p-4 rounded-2xl flex items-center gap-3 shadow-xs ${statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                    {statusMessage.type === 'success' ? <CheckCircle size={20} className="text-emerald-600 shrink-0" /> : <AlertCircle size={20} className="shrink-0" />}
                    <span className="text-xs font-semibold">{statusMessage.text}</span>
                </div>
            )}

            {/* Active Subscription Card */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                    <div>
                        <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Current Tier</span>
                        <h3 className="text-2xl font-black text-white mt-1 mb-2">{planDetails.name}</h3>
                        <p className="text-xs text-gray-400">
                            {planDetails.isFree ? 'Free Forever with 3 active documents limit' : 'Active Paid License • RERA & VDR Unlocked'}
                        </p>
                    </div>

                    <div>
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Pricing & Cycle</span>
                        <div className="text-2xl font-black text-white mt-1 mb-2">{planDetails.price}</div>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                            <Calendar size={12} className="text-emerald-400" />
                            {planDetails.cycle}
                        </p>
                    </div>

                    <div className="flex flex-col justify-center sm:items-end">
                        <span className="text-[11px] text-emerald-300 bg-emerald-950/80 border border-emerald-700/60 px-3 py-1 rounded-full font-bold mb-3 w-fit">
                            💳 Razorpay Verified (UPI / Cards / NetBanking)
                        </span>
                        <button
                            onClick={() => navigate('/pricing')}
                            className="px-5 py-2.5 bg-white text-gray-900 hover:bg-gray-100 rounded-xl font-bold text-xs transition-all shadow-md active:scale-95"
                        >
                            {planDetails.isFree ? 'Upgrade to Pro / Business' : 'Change Plan or Add Seats'}
                        </button>
                    </div>
                </div>
            </div>

            {/* B2B GST Profile Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div>
                        <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                            <Building2 size={20} className="text-emerald-600" />
                            GST Tax Profile (18% Input Tax Credit)
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Enter your Indian registered business details. All subscription charges generate valid B2B tax invoices for ITC claims.
                        </p>
                    </div>
                    <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                        <CheckCircle size={13} /> 100% Tax Deductible
                    </span>
                </div>

                <form onSubmit={handleSaveGST} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Company / Brokerage Legal Name</label>
                            <input
                                type="text"
                                value={legalEntityName}
                                onChange={(e) => setLegalEntityName(e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm font-medium"
                                placeholder="e.g. Prestige Reality Advisors Pvt Ltd"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                                GSTIN (15-Character GST Identification Number)
                            </label>
                            <input
                                type="text"
                                maxLength={15}
                                value={gstin}
                                onChange={(e) => handleGstinChange(e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm font-mono font-bold uppercase"
                                placeholder="27AAAAA0000A1Z5"
                            />
                            {gstin && !isGstinValid(gstin) && (
                                <p className="text-[11px] text-amber-600 mt-1 font-semibold">
                                    Format: 2 digits (State) + 10 chars (PAN) + 1 entity + 1 'Z' + 1 checksum.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">PAN Number</label>
                            <input
                                type="text"
                                maxLength={10}
                                value={pan}
                                onChange={(e) => setPan(e.target.value.toUpperCase())}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm font-mono font-bold uppercase"
                                placeholder="ABCDE1234F"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">State</label>
                            <input
                                type="text"
                                value={stateName}
                                onChange={(e) => setStateName(e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm font-medium"
                                placeholder="Maharashtra / Karnataka"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Pincode</label>
                            <input
                                type="text"
                                maxLength={6}
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, ''))}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm font-medium"
                                placeholder="400051"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Registered Tax Billing Address</label>
                        <textarea
                            rows={2}
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm font-medium"
                            placeholder="e.g. Unit 402, Signature Tower, Bandra Kurla Complex (BKC), Mumbai"
                        />
                    </div>

                    <div className="pt-2 flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-xs transition-all disabled:opacity-50"
                        >
                            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            Save GST Tax Profile
                        </button>
                    </div>
                </form>
            </div>

            {/* Invoices History Table */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                            <FileText size={20} className="text-emerald-600" />
                            Tax Invoice Archive (18% ITC)
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">Download court-valid PDF tax invoices for accounting & CA filing.</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                                <th className="py-3 px-3">Invoice No</th>
                                <th className="py-3 px-3">Date</th>
                                <th className="py-3 px-3">Plan / Description</th>
                                <th className="py-3 px-3">Taxable Value</th>
                                <th className="py-3 px-3">18% GST</th>
                                <th className="py-3 px-3">Total (INR)</th>
                                <th className="py-3 px-3">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 font-medium">
                            {sampleInvoices.map((inv) => (
                                <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="py-3.5 px-3 font-mono font-bold text-gray-900">{inv.id}</td>
                                    <td className="py-3.5 px-3 text-gray-600">{inv.date}</td>
                                    <td className="py-3.5 px-3 text-gray-800">{inv.plan}</td>
                                    <td className="py-3.5 px-3 text-gray-600">₹{inv.taxable.toFixed(2)}</td>
                                    <td className="py-3.5 px-3 text-emerald-700 font-semibold">₹{inv.taxAmount.toFixed(2)}</td>
                                    <td className="py-3.5 px-3 font-bold text-gray-900">₹{inv.total.toFixed(2)}</td>
                                    <td className="py-3.5 px-3">
                                        <button
                                            onClick={() => downloadTaxInvoicePDF(inv)}
                                            disabled={downloadingInv === inv.id}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold transition-all border border-emerald-200 cursor-pointer disabled:opacity-50"
                                        >
                                            {downloadingInv === inv.id ? (
                                                <Loader2 size={12} className="animate-spin" />
                                            ) : (
                                                <Download size={12} />
                                            )}
                                            PDF Invoice
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default GSTBillingSettings;
