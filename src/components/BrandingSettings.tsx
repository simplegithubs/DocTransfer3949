import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useSubscription } from '../hooks/useSubscription';
import {
    Upload,
    Globe,
    Layout,
    Palette,
    Save,
    Loader2,
    CheckCircle,
    AlertCircle,
    FileText,
    Download,
    Shield,
    Lock,
    ExternalLink,
    Smartphone,
    Monitor,
    Zap,
    Eraser,
    Crown,
    Building2,
    MessageCircle,
    ShieldCheck,
    Sparkles,
    Check,
    Eye,
    Sliders
} from 'lucide-react';
import Skeleton from './ui/Skeleton';
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';

interface BrandingSettingsProps {
    userId: string;
}

export interface BrandingConfig {
    subdomain: string;
    site_url: string;
    logo_url: string;
    brand_color: string;
    remove_branding: boolean;
    theme_mode: 'light' | 'dark' | 'auto';
    agency_name: string;
    rera_reg_no: string;
    whatsapp_number: string;
    display_rera_badge: boolean;
    custom_watermark_pattern: string;
    custom_domain: string;
}

const PRESET_THEMES = [
    { name: 'Emerald (RERA)', color: '#059669', gradient: 'linear-gradient(135deg, #10b981 0%, #047857 100%)' },
    { name: 'Indigo', color: '#4f46e5', gradient: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)' },
    { name: 'Ocean', color: '#0ea5e9', gradient: 'linear-gradient(135deg, #38bdf8 0%, #0369a1 100%)' },
    { name: 'Royal', color: '#7c3aed', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' },
    { name: 'Amber Luxury', color: '#d97706', gradient: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)' },
    { name: 'Slate Prime', color: '#0f172a', gradient: 'linear-gradient(135deg, #334155 0%, #020617 100%)' },
];

export const BrandingSettings: React.FC<BrandingSettingsProps> = ({ userId }) => {
    const navigate = useNavigate();
    const { isFeatureLocked } = useSubscription();

    const [activeSection, setActiveSection] = useState<'form' | 'preview'>(() => {
        try {
            return new URLSearchParams(window.location.search).get('subtab') === 'preview' ? 'preview' : 'form';
        } catch {
            return 'form';
        }
    });
    const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

    const [config, setConfig] = useState<BrandingConfig>({
        subdomain: '',
        site_url: '',
        logo_url: '',
        brand_color: '#059669',
        remove_branding: false,
        theme_mode: 'light',
        agency_name: 'Apex Realty Advisory',
        rera_reg_no: 'A51800012345',
        whatsapp_number: '+91 98765 43210',
        display_rera_badge: true,
        custom_watermark_pattern: 'CONFIDENTIAL • {agency} • RERA: {rera_id} • FOR {viewer}',
        custom_domain: ''
    });

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [downloadingPdf, setDownloadingPdf] = useState(false);
    const [actionToast, setActionToast] = useState<{ type: 'success' | 'info', message: string } | null>(null);

    const isWhiteLabelLocked = isFeatureLocked('white_label') && isFeatureLocked('custom_branding');

    useEffect(() => {
        // Instant synchronous hydration from localStorage
        const localKey = `doctransfer_branding_${userId}`;
        const local = localStorage.getItem(localKey) || localStorage.getItem('doctransfer_branding_settings');
        if (local) {
            try {
                const parsed = JSON.parse(local);
                if (parsed) {
                    setConfig(prev => ({ ...prev, ...parsed }));
                    if (parsed.logo_url) setLogoPreview(parsed.logo_url);
                }
            } catch (e) {
                console.error('Failed to parse local branding cache:', e);
            }
        }

        // Only query Supabase if logged-in user with a valid UUID
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId || '');
        if (userId && isUuid) {
            fetchSettings();
        }
    }, [userId]);

    const fetchSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('branding_settings')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.warn('Supabase branding_settings fetch notice:', error.message);
            }

            if (data) {
                const localKey = `doctransfer_branding_${userId}`;
                const local = localStorage.getItem(localKey);
                const parsedLocal = local ? JSON.parse(local) : null;

                const merged: BrandingConfig = {
                    subdomain: data.subdomain || parsedLocal?.subdomain || '',
                    site_url: data.site_url || parsedLocal?.site_url || '',
                    logo_url: data.logo_url || parsedLocal?.logo_url || '',
                    brand_color: data.brand_color || parsedLocal?.brand_color || '#059669',
                    remove_branding: data.remove_branding ?? parsedLocal?.remove_branding ?? false,
                    theme_mode: 'light',
                    agency_name: data.agency_name || parsedLocal?.agency_name || 'Apex Realty Advisory',
                    rera_reg_no: data.rera_reg_no || parsedLocal?.rera_reg_no || 'A51800012345',
                    whatsapp_number: data.whatsapp_number || parsedLocal?.whatsapp_number || '+91 98765 43210',
                    display_rera_badge: data.display_rera_badge ?? parsedLocal?.display_rera_badge ?? true,
                    custom_watermark_pattern: data.custom_watermark_pattern || parsedLocal?.custom_watermark_pattern || 'CONFIDENTIAL • {agency} • RERA: {rera_id} • FOR {viewer}',
                    custom_domain: data.custom_domain || parsedLocal?.custom_domain || ''
                };
                setConfig(merged);
                if (merged.logo_url) setLogoPreview(merged.logo_url);
                localStorage.setItem(localKey, JSON.stringify(merged));
                localStorage.setItem('doctransfer_branding_settings', JSON.stringify(merged));
            }
        } catch (error) {
            console.error('Error fetching branding settings:', error);
        }
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 2 * 1024 * 1024) {
                setMessage({ type: 'error', text: 'Logo must be less than 2MB' });
                return;
            }
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            let finalLogoUrl = config.logo_url;

            if (logoFile) {
                try {
                    const fileExt = logoFile.name.split('.').pop();
                    const fileName = `${userId}/logo.${fileExt}`;
                    const { error: uploadError } = await supabase.storage
                        .from('branding')
                        .upload(fileName, logoFile, { upsert: true });

                    if (!uploadError) {
                        const { data: { publicUrl } } = supabase.storage
                            .from('branding')
                            .getPublicUrl(fileName);
                        finalLogoUrl = publicUrl;
                    } else {
                        const reader = new FileReader();
                        finalLogoUrl = await new Promise<string>((resolve) => {
                            reader.onloadend = () => resolve(reader.result as string);
                            reader.readAsDataURL(logoFile);
                        });
                    }
                } catch {
                    const reader = new FileReader();
                    finalLogoUrl = await new Promise<string>((resolve) => {
                        reader.onloadend = () => resolve(reader.result as string);
                        reader.readAsDataURL(logoFile);
                    });
                }
            }

            const updatedConfig: BrandingConfig = {
                ...config,
                logo_url: finalLogoUrl
            };

            localStorage.setItem(`doctransfer_branding_${userId}`, JSON.stringify(updatedConfig));
            localStorage.setItem('doctransfer_branding_settings', JSON.stringify(updatedConfig));

            try {
                await supabase
                    .from('branding_settings')
                    .upsert({
                        user_id: userId,
                        subdomain: config.subdomain || null,
                        site_url: config.site_url,
                        logo_url: finalLogoUrl,
                        brand_color: config.brand_color,
                        remove_branding: config.remove_branding,
                        agency_name: config.agency_name,
                        rera_reg_no: config.rera_reg_no,
                        whatsapp_number: config.whatsapp_number,
                        display_rera_badge: config.display_rera_badge,
                        custom_watermark_pattern: config.custom_watermark_pattern,
                        custom_domain: config.custom_domain,
                        updated_at: new Date().toISOString()
                    });
            } catch (supaErr) {
                console.warn('Persisted to browser storage (Supabase offline):', supaErr);
            }

            setConfig(updatedConfig);
            setMessage({ type: 'success', text: 'Real Estate Agency & White-Label branding saved successfully!' });
            setLogoFile(null);
        } catch (error: any) {
            console.error('Error saving settings:', error);
            setMessage({ type: 'error', text: error.message || 'Failed to save settings' });
        } finally {
            setSaving(false);
        }
    };

    const insertWatermarkVariable = (varName: string) => {
        if (!config.custom_watermark_pattern.includes(varName)) {
            setConfig({
                ...config,
                custom_watermark_pattern: `${config.custom_watermark_pattern} • ${varName}`
            });
        }
    };

    const renderedWatermarkSample = config.custom_watermark_pattern
        .replace(/{agency}/g, config.agency_name || 'APEX REALTY')
        .replace(/{rera_id}/g, config.rera_reg_no || 'RERA-A51800012345')
        .replace(/{viewer}/g, 'rahul.investor@gmail.com')
        .replace(/{date}/g, new Date().toLocaleDateString('en-IN'));

    const handleContactBroker = () => {
        const rawNumber = config.whatsapp_number || '+91 98765 43210';
        const cleanNumber = rawNumber.replace(/[^0-9]/g, '');
        const formattedNumber = cleanNumber.startsWith('91') || cleanNumber.length > 10 ? cleanNumber : `91${cleanNumber}`;
        const agency = config.agency_name || 'Apex Realty Advisory';
        const text = encodeURIComponent(
            `Hi ${agency}, I am reviewing the "Godrej Sky Terraces" Cost Sheet on your investor portal. I would like to schedule a site visit and discuss payment plans.`
        );
        window.open(`https://wa.me/${formattedNumber}?text=${text}`, '_blank');
        setActionToast({
            type: 'success',
            message: `Opening WhatsApp chat with ${agency} (${rawNumber})...`
        });
        setTimeout(() => setActionToast(null), 4000);
    };

    const handleDownloadPDF = async () => {
        setDownloadingPdf(true);
        try {
            const pdfDoc = await PDFDocument.create();
            const page = pdfDoc.addPage([595.28, 841.89]); // A4
            const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
            const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
            const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

            const { width, height } = page.getSize();

            // 1. Watermark Layer (Rotated diagonally across page)
            const watermarkText = renderedWatermarkSample || `CONFIDENTIAL • ${config.agency_name || 'APEX REALTY'} • RERA: ${config.rera_reg_no || 'A51800012345'}`;
            page.drawText(watermarkText, {
                x: 40,
                y: height / 2 - 50,
                size: 12,
                font: fontBold,
                color: rgb(0.85, 0.88, 0.91),
                rotate: degrees(28)
            });

            // 2. Header Banner with Agency Brand Color
            const hex = (config.brand_color || '#059669').replace('#', '');
            const r = parseInt(hex.substring(0, 2), 16) / 255 || 0.02;
            const g = parseInt(hex.substring(2, 4), 16) / 255 || 0.59;
            const b = parseInt(hex.substring(4, 6), 16) / 255 || 0.41;

            page.drawRectangle({
                x: 0,
                y: height - 100,
                width: width,
                height: 100,
                color: rgb(r, g, b)
            });

            // Agency & RERA Header text
            page.drawText((config.agency_name || 'Apex Realty Advisory').toUpperCase(), {
                x: 45,
                y: height - 42,
                size: 17,
                font: fontBold,
                color: rgb(1, 1, 1)
            });

            if (config.display_rera_badge && config.rera_reg_no) {
                page.drawText(`MAHARERA REGISTERED: ${config.rera_reg_no}`, {
                    x: 45,
                    y: height - 62,
                    size: 9,
                    font: fontBold,
                    color: rgb(0.9, 1, 0.95)
                });
            }

            page.drawText('OFFICIAL PROPERTY COST SHEET & INVESTMENT MEMO', {
                x: 45,
                y: height - 80,
                size: 8.5,
                font: fontRegular,
                color: rgb(0.92, 0.96, 0.96)
            });

            // 3. Property Overview Section
            let y = height - 135;
            page.drawText('Godrej Sky Terraces — Ultra Luxury Residences', {
                x: 45,
                y,
                size: 15,
                font: fontBold,
                color: rgb(0.08, 0.12, 0.2)
            });

            y -= 18;
            page.drawText('Tower B — 3 BHK Sky Penthouse | RERA Carpet: 1,485 Sq. Ft. (Balcony: 120 Sq. Ft.)', {
                x: 45,
                y,
                size: 9.5,
                font: fontRegular,
                color: rgb(0.4, 0.45, 0.5)
            });

            // Table Box
            y -= 30;
            page.drawRectangle({
                x: 45,
                y: y - 180,
                width: width - 90,
                height: 200,
                color: rgb(0.98, 0.99, 1),
                borderColor: rgb(0.88, 0.91, 0.94),
                borderWidth: 1
            });

            // Table Headers
            const tableY = y - 5;
            page.drawText('Cost Component', { x: 60, y: tableY, size: 10, font: fontBold, color: rgb(0.1, 0.15, 0.25) });
            page.drawText('Statutory Basis / Rate', { x: 260, y: tableY, size: 10, font: fontBold, color: rgb(0.1, 0.15, 0.25) });
            page.drawText('Amount (INR)', { x: 440, y: tableY, size: 10, font: fontBold, color: rgb(0.1, 0.15, 0.25) });

            page.drawLine({
                start: { x: 45, y: tableY - 10 },
                end: { x: width - 45, y: tableY - 10 },
                thickness: 1,
                color: rgb(0.85, 0.88, 0.92)
            });

            const rows = [
                { item: 'Base Consideration Value', rate: '₹ 32,659 / Sq. Ft.', amount: '₹ 4,85,00,000' },
                { item: 'Maharashtra Stamp Duty', rate: '6% (Standard + Metro Cess)', amount: '₹ 29,10,000' },
                { item: 'Registration Fee', rate: 'Govt. Capped Fee', amount: '₹ 30,000' },
                { item: 'GST (Under Construction)', rate: '5% (Without ITC)', amount: '₹ 24,25,000' },
                { item: 'Infrastructure & Club Dev.', rate: 'Fixed 2 Covered Car Parks', amount: '₹ 15,00,000' }
            ];

            let currentY = tableY - 28;
            rows.forEach((row) => {
                page.drawText(row.item, { x: 60, y: currentY, size: 9, font: fontRegular, color: rgb(0.2, 0.25, 0.3) });
                page.drawText(row.rate, { x: 260, y: currentY, size: 9, font: fontRegular, color: rgb(0.35, 0.4, 0.45) });
                page.drawText(row.amount, { x: 440, y: currentY, size: 9, font: fontBold, color: rgb(0.1, 0.15, 0.2) });
                currentY -= 22;
            });

            page.drawLine({
                start: { x: 45, y: currentY + 5 },
                end: { x: width - 45, y: currentY + 5 },
                thickness: 1,
                color: rgb(0.85, 0.88, 0.92)
            });

            // Total
            page.drawText('Total All-Inclusive Investment:', { x: 60, y: currentY - 15, size: 10, font: fontBold, color: rgb(r, g, b) });
            page.drawText('₹ 5,53,65,000', { x: 430, y: currentY - 15, size: 12, font: fontBold, color: rgb(r, g, b) });

            // Terms & Mandate
            let termsY = currentY - 55;
            page.drawText('Mandate & Diligence Information:', { x: 45, y: termsY, size: 10, font: fontBold, color: rgb(0.1, 0.15, 0.2) });
            termsY -= 16;
            page.drawText('• Possession Timeline: Target Completion December 2026.', { x: 45, y: termsY, size: 8.5, font: fontRegular, color: rgb(0.3, 0.35, 0.4) });
            termsY -= 14;
            page.drawText(`• Prepared Exclusively by: ${config.agency_name || 'Apex Realty'} | WhatsApp: ${config.whatsapp_number || '+91 98765 43210'}`, { x: 45, y: termsY, size: 8.5, font: fontRegular, color: rgb(0.3, 0.35, 0.4) });
            termsY -= 14;
            page.drawText(`• Verified RERA Agent Number: ${config.rera_reg_no || 'A51800012345'} — Section 10 RERA Compliant.`, { x: 45, y: termsY, size: 8.5, font: fontRegular, color: rgb(0.3, 0.35, 0.4) });
            termsY -= 14;
            page.drawText(`• Generated for: rahul.investor@gmail.com on ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}.`, { x: 45, y: termsY, size: 8.5, font: fontOblique, color: rgb(0.4, 0.45, 0.5) });

            // Footer
            page.drawLine({
                start: { x: 45, y: 55 },
                end: { x: width - 45, y: 55 },
                thickness: 0.5,
                color: rgb(0.85, 0.88, 0.9)
            });
            page.drawText(
                config.remove_branding
                    ? `Secured Document • Managed via ${config.agency_name || 'Private Agency'} Digital Data Room • All Rights Reserved`
                    : `Secured by DocTransfer Enterprise • Section 65B IT Act Electronic Record • ${config.agency_name || 'Agency'}`,
                {
                    x: 45,
                    y: 40,
                    size: 7.5,
                    font: fontRegular,
                    color: rgb(0.5, 0.55, 0.6)
                }
            );

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const cleanName = (config.agency_name || 'Apex_Realty').replace(/[^a-zA-Z0-9]/g, '_');
            a.download = `${cleanName}_Godrej_Sky_Terraces_Cost_Sheet.pdf`;
            a.click();
            URL.revokeObjectURL(url);

            setActionToast({
                type: 'success',
                message: `Downloaded: ${cleanName}_Godrej_Sky_Terraces_Cost_Sheet.pdf`
            });
            setTimeout(() => setActionToast(null), 4000);
        } catch (err) {
            console.error('Failed to generate PDF:', err);
            setActionToast({
                type: 'info',
                message: 'Failed to generate PDF. Please check browser console.'
            });
            setTimeout(() => setActionToast(null), 4000);
        } finally {
            setDownloadingPdf(false);
        }
    };

    return (
        <div style={{ padding: '2rem 2.25rem', maxWidth: '1100px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
            {/* Top Navigation & Sub-Tabs Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '2rem',
                borderBottom: '1px solid #f1f5f9',
                paddingBottom: '1.5rem'
            }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#059669', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
                        <Sparkles size={14} /> Indian PropTech & Deal Room Suite
                    </div>
                    <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                        Agency & White-Label Branding
                    </h2>
                    <p style={{ color: '#64748b', fontSize: '0.875rem', margin: '0.35rem 0 0 0' }}>
                        Configure your real estate identity, RERA credentials, dynamic anti-bypass watermarking, and custom viewer.
                    </p>
                </div>

                {/* Sub-tab view toggle: Form vs Preview */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: '#f1f5f9',
                    padding: '0.35rem',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    gap: '0.25rem'
                }}>
                    <button
                        type="button"
                        onClick={() => setActiveSection('form')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '0.5rem 1rem',
                            borderRadius: '9px',
                            border: 'none',
                            fontSize: '0.825rem',
                            fontWeight: activeSection === 'form' ? 700 : 500,
                            cursor: 'pointer',
                            background: activeSection === 'form' ? '#ffffff' : 'transparent',
                            color: activeSection === 'form' ? '#0f172a' : '#64748b',
                            boxShadow: activeSection === 'form' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                            transition: 'all 0.15s ease'
                        }}
                    >
                        <Sliders size={14} color={activeSection === 'form' ? '#059669' : '#64748b'} />
                        Agency Settings
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveSection('preview')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '0.5rem 1rem',
                            borderRadius: '9px',
                            border: 'none',
                            fontSize: '0.825rem',
                            fontWeight: activeSection === 'preview' ? 700 : 500,
                            cursor: 'pointer',
                            background: activeSection === 'preview' ? '#ffffff' : 'transparent',
                            color: activeSection === 'preview' ? '#059669' : '#64748b',
                            boxShadow: activeSection === 'preview' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                            transition: 'all 0.15s ease'
                        }}
                    >
                        <Eye size={14} color={activeSection === 'preview' ? '#059669' : '#64748b'} />
                        Live Buyer Preview
                        <span style={{ fontSize: '0.65rem', background: '#ecfdf5', color: '#047857', padding: '1px 6px', borderRadius: '4px', fontWeight: 800 }}>
                            LIVE
                        </span>
                    </button>
                </div>
            </div>

            {/* Notification message */}
            {message && (
                <div style={{
                    marginBottom: '1.75rem',
                    padding: '1rem 1.25rem',
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    background: message.type === 'success' ? '#ecfdf5' : '#fef2f2',
                    border: message.type === 'success' ? '1px solid #a7f3d0' : '1px solid #fecaca',
                    color: message.type === 'success' ? '#065f46' : '#991b1b'
                }}>
                    {message.type === 'success' ? <CheckCircle size={20} color="#059669" /> : <AlertCircle size={20} color="#dc2626" />}
                    <span>{message.text}</span>
                </div>
            )}

            {/* VIEW 1: FULL CONFIGURATION FORM */}
            {activeSection === 'form' && (
                <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                    
                    {/* MODULE 1: Real Estate Agency & RERA Identity */}
                    <div style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '20px',
                        padding: '1.75rem',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                <div style={{ width: '36px', height: '36px', background: '#ecfdf5', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Building2 size={20} color="#059669" />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                                        Real Estate Agency & RERA Credentials
                                    </h3>
                                    <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.15rem 0 0 0' }}>
                                        Official identity shown on client brochures, deal rooms, and viewer header.
                                    </p>
                                </div>
                            </div>
                            <span style={{ fontSize: '0.72rem', fontWeight: 800, background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '3px 10px', borderRadius: '9999px' }}>
                                Anti-Bypass Protection
                            </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '0.45rem' }}>
                                    Agency / Developer Firm Name
                                </label>
                                <input
                                    type="text"
                                    value={config.agency_name}
                                    onChange={(e) => setConfig({ ...config, agency_name: e.target.value })}
                                    placeholder="e.g. Apex Realty Advisory / Lodha Partners"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        borderRadius: '12px',
                                        border: '1px solid #cbd5e1',
                                        fontSize: '0.9rem',
                                        color: '#0f172a',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '0.45rem' }}>
                                    RERA Registration Number (Agent / Project)
                                </label>
                                <input
                                    type="text"
                                    value={config.rera_reg_no}
                                    onChange={(e) => setConfig({ ...config, rera_reg_no: e.target.value.toUpperCase() })}
                                    placeholder="e.g. A51800012345 (MahaRERA)"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        borderRadius: '12px',
                                        border: '1px solid #cbd5e1',
                                        fontSize: '0.9rem',
                                        textTransform: 'uppercase',
                                        color: '#0f172a',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '0.45rem' }}>
                                    Broker WhatsApp Inquiry Desk (Direct Leads)
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <MessageCircle size={18} color="#059669" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                                    <input
                                        type="tel"
                                        value={config.whatsapp_number}
                                        onChange={(e) => setConfig({ ...config, whatsapp_number: e.target.value })}
                                        placeholder="+91 98765 43210"
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem 1rem 0.75rem 2.75rem',
                                            borderRadius: '12px',
                                            border: '1px solid #cbd5e1',
                                            fontSize: '0.9rem',
                                            color: '#0f172a',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '0.85rem 1.25rem',
                                background: '#f8fafc',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0'
                            }}>
                                <div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                                        Show Verified RERA Badge in Viewer
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                                        Displays statutory seal beside your document title
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setConfig({ ...config, display_rera_badge: !config.display_rera_badge })}
                                    style={{
                                        width: '46px',
                                        height: '26px',
                                        borderRadius: '9999px',
                                        border: 'none',
                                        background: config.display_rera_badge ? '#059669' : '#cbd5e1',
                                        position: 'relative',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <span style={{
                                        position: 'absolute',
                                        top: '3px',
                                        left: config.display_rera_badge ? '23px' : '3px',
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '50%',
                                        background: '#ffffff',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                                        transition: 'all 0.2s ease'
                                    }} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* MODULE 2: Dynamic Anti-Bypass Watermarking */}
                    <div style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '20px',
                        padding: '1.75rem',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
                            <div style={{ width: '36px', height: '36px', background: '#ecfdf5', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ShieldCheck size={20} color="#059669" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                                    Default Anti-Bypass Dynamic Watermark
                                </h3>
                                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.15rem 0 0 0' }}>
                                    Embedded diagonally across every brochure, floor plan, and cost sheet shared by your team.
                                </p>
                            </div>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.825rem', fontWeight: 700, color: '#334155' }}>
                                    Watermark Pattern
                                </label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>Insert Variable:</span>
                                    <button
                                        type="button"
                                        onClick={() => insertWatermarkVariable('{agency}')}
                                        style={{ fontSize: '0.72rem', fontWeight: 700, background: '#f1f5f9', color: '#0f172a', border: '1px solid #cbd5e1', padding: '2px 8px', borderRadius: '6px', cursor: 'pointer' }}
                                    >
                                        + {'{agency}'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => insertWatermarkVariable('{rera_id}')}
                                        style={{ fontSize: '0.72rem', fontWeight: 700, background: '#f1f5f9', color: '#0f172a', border: '1px solid #cbd5e1', padding: '2px 8px', borderRadius: '6px', cursor: 'pointer' }}
                                    >
                                        + {'{rera_id}'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => insertWatermarkVariable('{viewer}')}
                                        style={{ fontSize: '0.72rem', fontWeight: 700, background: '#f1f5f9', color: '#0f172a', border: '1px solid #cbd5e1', padding: '2px 8px', borderRadius: '6px', cursor: 'pointer' }}
                                    >
                                        + {'{viewer}'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => insertWatermarkVariable('{date}')}
                                        style={{ fontSize: '0.72rem', fontWeight: 700, background: '#f1f5f9', color: '#0f172a', border: '1px solid #cbd5e1', padding: '2px 8px', borderRadius: '6px', cursor: 'pointer' }}
                                    >
                                        + {'{date}'}
                                    </button>
                                </div>
                            </div>

                            <input
                                type="text"
                                value={config.custom_watermark_pattern}
                                onChange={(e) => setConfig({ ...config, custom_watermark_pattern: e.target.value })}
                                placeholder="CONFIDENTIAL • {agency} • RERA: {rera_id} • FOR {viewer}"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '12px',
                                    border: '1px solid #cbd5e1',
                                    fontSize: '0.9rem',
                                    color: '#0f172a',
                                    boxSizing: 'border-box',
                                    background: '#f8fafc'
                                }}
                            />
                        </div>

                        {/* Live Watermark Strip Sample */}
                        <div style={{
                            padding: '0.85rem 1.25rem',
                            background: '#f8fafc',
                            border: '1px dashed #cbd5e1',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '1rem',
                            flexWrap: 'wrap'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b' }}>Live Rendering Sample:</span>
                                <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#047857', letterSpacing: '0.02em' }}>
                                    {renderedWatermarkSample}
                                </span>
                            </div>
                            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                                (Automatically burned into client PDFs at 8% opacity)
                            </span>
                        </div>
                    </div>

                    {/* MODULE 3: Brand Color Themes & Presets */}
                    <div style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '20px',
                        padding: '1.75rem',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
                            <div style={{ width: '36px', height: '36px', background: '#ecfdf5', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Palette size={20} color="#059669" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                                    Brand Color Theme
                                </h3>
                                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.15rem 0 0 0' }}>
                                    Applied to download buttons, verification links, and client portal accents.
                                </p>
                            </div>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))',
                            gap: '0.85rem'
                        }}>
                            {PRESET_THEMES.map((theme) => {
                                const isSelected = config.brand_color === theme.color;
                                return (
                                    <button
                                        key={theme.name}
                                        type="button"
                                        onClick={() => setConfig({ ...config, brand_color: theme.color })}
                                        style={{
                                            padding: '0.85rem',
                                            borderRadius: '14px',
                                            border: isSelected ? '2px solid #059669' : '1px solid #e2e8f0',
                                            background: isSelected ? '#ecfdf5' : '#ffffff',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '0.5rem',
                                            transition: 'all 0.15s ease'
                                        }}
                                    >
                                        <div style={{
                                            width: '100%',
                                            height: '24px',
                                            borderRadius: '8px',
                                            background: theme.gradient,
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
                                        }}></div>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <span style={{ fontSize: '0.78rem', fontWeight: isSelected ? 800 : 600, color: isSelected ? '#065f46' : '#334155' }}>
                                                {theme.name}
                                            </span>
                                            {isSelected && <Check size={14} color="#059669" />}
                                        </div>
                                    </button>
                                );
                            })}

                            {/* Custom Hex Color Picker */}
                            <div style={{
                                padding: '0.85rem',
                                borderRadius: '14px',
                                border: '1px dashed #cbd5e1',
                                background: '#f8fafc',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '0.35rem',
                                position: 'relative'
                            }}>
                                <input
                                    type="color"
                                    value={config.brand_color}
                                    onChange={(e) => setConfig({ ...config, brand_color: e.target.value })}
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        opacity: 0,
                                        width: '100%',
                                        height: '100%',
                                        cursor: 'pointer'
                                    }}
                                />
                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: config.brand_color, border: '2px solid white', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}></div>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Custom Color</span>
                                <span style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase' }}>{config.brand_color}</span>
                            </div>
                        </div>
                    </div>

                    {/* MODULE 4: Agency Logo & Visual Assets */}
                    <div style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '20px',
                        padding: '1.75rem',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
                            <div style={{ width: '36px', height: '36px', background: '#ecfdf5', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Upload size={20} color="#059669" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                                    Agency Logo & Brandmark
                                </h3>
                                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.15rem 0 0 0' }}>
                                    High-resolution logo placed at the top of buyer deal rooms and e-signature execution receipts.
                                </p>
                            </div>
                        </div>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.5rem',
                            flexWrap: 'wrap'
                        }}>
                            <div style={{
                                width: '140px',
                                height: '90px',
                                borderRadius: '14px',
                                border: '2px dashed #cbd5e1',
                                background: '#f8fafc',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                position: 'relative'
                            }}>
                                {logoPreview ? (
                                    <img src={logoPreview} alt="Agency Logo" style={{ maxHeight: '70px', maxWidth: '120px', objectFit: 'contain' }} />
                                ) : (
                                    <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600 }}>
                                        No Logo Uploaded
                                    </div>
                                )}
                            </div>

                            <div style={{ flex: 1, minWidth: '260px' }}>
                                <input
                                    type="file"
                                    id="agency-logo-file"
                                    accept="image/png,image/jpeg,image/svg+xml"
                                    onChange={handleLogoChange}
                                    style={{ display: 'none' }}
                                />
                                <label
                                    htmlFor="agency-logo-file"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.65rem 1.25rem',
                                        background: '#f1f5f9',
                                        border: '1px solid #cbd5e1',
                                        borderRadius: '10px',
                                        fontSize: '0.85rem',
                                        fontWeight: 700,
                                        color: '#1e293b',
                                        cursor: 'pointer',
                                        marginBottom: '0.5rem'
                                    }}
                                >
                                    <Upload size={16} /> Select PNG / SVG Logo
                                </label>
                                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                                    Transparent PNG or SVG recommended. Maximum size: 2MB. Minimum resolution: 300x100px.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* MODULE 5: Full White-Labeling & Stealth Mode */}
                    <div style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '20px',
                        padding: '1.75rem',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                <div style={{ width: '36px', height: '36px', background: '#ecfdf5', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Crown size={20} color="#059669" />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                                        Full White-Labeling & Stealth Mode
                                    </h3>
                                    <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.15rem 0 0 0' }}>
                                        Eliminate all DocTransfer branding so clients only see your real estate agency.
                                    </p>
                                </div>
                            </div>
                            <span style={{ fontSize: '0.72rem', fontWeight: 800, background: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe', padding: '3px 10px', borderRadius: '9999px' }}>
                                Business & Data Room Suite
                            </span>
                        </div>

                        {/* Remove DocTransfer Branding Switch */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '1.25rem',
                            background: config.remove_branding ? '#f0fdf4' : '#f8fafc',
                            border: config.remove_branding ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
                            borderRadius: '14px',
                            marginBottom: '1.25rem',
                            gap: '1rem'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: config.remove_branding ? '#dcfce7' : '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0' }}>
                                    <Eraser size={20} color={config.remove_branding ? '#16a34a' : '#64748b'} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                                        Remove "Powered by DocTransfer"
                                    </div>
                                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                                        Completely hides DocTransfer logo, viral badge, and footer links across all document views.
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    if (isWhiteLabelLocked) {
                                        navigate('/pricing');
                                        return;
                                    }
                                    setConfig({ ...config, remove_branding: !config.remove_branding });
                                }}
                                style={{
                                    width: '50px',
                                    height: '28px',
                                    borderRadius: '9999px',
                                    border: 'none',
                                    background: config.remove_branding ? '#059669' : '#cbd5e1',
                                    position: 'relative',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    flexShrink: 0
                                }}
                            >
                                <span style={{
                                    position: 'absolute',
                                    top: '3px',
                                    left: config.remove_branding ? '25px' : '3px',
                                    width: '22px',
                                    height: '22px',
                                    borderRadius: '50%',
                                    background: '#ffffff',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                                    transition: 'all 0.2s ease'
                                }} />
                            </button>
                        </div>

                        {/* Agency Website URL & Custom Subdomain */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '0.45rem' }}>
                                    Agency Website Link
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <Globe size={18} color="#64748b" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                                    <input
                                        type="url"
                                        value={config.site_url}
                                        onChange={(e) => setConfig({ ...config, site_url: e.target.value })}
                                        placeholder="https://apexrealty.in"
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem 1rem 0.75rem 2.75rem',
                                            borderRadius: '12px',
                                            border: '1px solid #cbd5e1',
                                            fontSize: '0.9rem',
                                            color: '#0f172a',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '0.45rem' }}>
                                    Custom Diligence Subdomain
                                </label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <input
                                        type="text"
                                        value={config.subdomain}
                                        onChange={(e) => setConfig({ ...config, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                                        placeholder="apexrealty"
                                        style={{
                                            flex: 1,
                                            padding: '0.75rem 1rem',
                                            borderRadius: '12px',
                                            border: '1px solid #cbd5e1',
                                            fontSize: '0.9rem',
                                            color: '#0f172a',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', background: '#f1f5f9', padding: '0.75rem 0.85rem', borderRadius: '12px', border: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>
                                        .doctransfer.com
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1.5rem',
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '20px',
                        flexWrap: 'wrap',
                        gap: '1rem'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.825rem' }}>
                            <ShieldCheck size={18} color="#059669" />
                            <span><strong>Auto-Sync Active:</strong> Updates apply instantly to all current and future shared real estate documents.</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <button
                                type="button"
                                onClick={() => setActiveSection('preview')}
                                style={{
                                    padding: '0.75rem 1.25rem',
                                    background: '#f8fafc',
                                    border: '1px solid #cbd5e1',
                                    borderRadius: '12px',
                                    fontSize: '0.875rem',
                                    fontWeight: 700,
                                    color: '#334155',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.4rem'
                                }}
                            >
                                <Eye size={16} /> View Live Preview
                            </button>

                            <button
                                type="submit"
                                disabled={saving}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.75rem 2rem',
                                    background: '#059669',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontSize: '0.9rem',
                                    fontWeight: 700,
                                    cursor: saving ? 'not-allowed' : 'pointer',
                                    boxShadow: '0 4px 14px rgba(5, 150, 105, 0.35)',
                                    opacity: saving ? 0.7 : 1,
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {saving ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" /> Saving Branding...
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} /> Save Agency Branding
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            )}

            {/* VIEW 2: HIGH-FIDELITY LIVE BUYER PREVIEW */}
            {activeSection === 'preview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Preview Toolbar */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '16px',
                        padding: '1rem 1.5rem',
                        flexWrap: 'wrap',
                        gap: '1rem'
                    }}>
                        <div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Interactive Simulation
                            </span>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0.15rem 0 0 0' }}>
                                Prospective Buyer Document Viewer
                            </h3>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                background: '#f1f5f9',
                                padding: '0.25rem',
                                borderRadius: '10px',
                                border: '1px solid #e2e8f0'
                            }}>
                                <button
                                    type="button"
                                    onClick={() => setPreviewDevice('desktop')}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.35rem',
                                        padding: '0.4rem 0.85rem',
                                        borderRadius: '8px',
                                        border: 'none',
                                        fontSize: '0.78rem',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        background: previewDevice === 'desktop' ? '#ffffff' : 'transparent',
                                        color: previewDevice === 'desktop' ? '#0f172a' : '#64748b',
                                        boxShadow: previewDevice === 'desktop' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none'
                                    }}
                                >
                                    <Monitor size={14} /> Desktop (100%)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPreviewDevice('mobile')}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.35rem',
                                        padding: '0.4rem 0.85rem',
                                        borderRadius: '8px',
                                        border: 'none',
                                        fontSize: '0.78rem',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        background: previewDevice === 'mobile' ? '#ffffff' : 'transparent',
                                        color: previewDevice === 'mobile' ? '#0f172a' : '#64748b',
                                        boxShadow: previewDevice === 'mobile' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none'
                                    }}
                                >
                                    <Smartphone size={14} /> Mobile (375px)
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={() => setActiveSection('form')}
                                style={{
                                    padding: '0.45rem 1rem',
                                    background: '#ecfdf5',
                                    border: '1px solid #a7f3d0',
                                    borderRadius: '10px',
                                    fontSize: '0.8rem',
                                    fontWeight: 700,
                                    color: '#065f46',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.35rem'
                                }}
                            >
                                <Sliders size={14} /> Edit Branding
                            </button>
                        </div>
                    </div>

                    {/* SIMULATED BROWSER MOCKUP CONTAINER */}
                    <div style={{
                        maxWidth: previewDevice === 'mobile' ? '390px' : '100%',
                        margin: '0 auto',
                        width: '100%',
                        transition: 'all 0.3s ease'
                    }}>
                        <div style={{
                            background: '#1e293b',
                            borderRadius: previewDevice === 'mobile' ? '40px' : '20px',
                            padding: previewDevice === 'mobile' ? '12px' : '0px',
                            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                            overflow: 'hidden',
                            border: '1px solid #334155'
                        }}>
                            {/* Browser Top Window Bar */}
                            <div style={{
                                background: '#0f172a',
                                padding: '0.75rem 1.25rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                borderBottom: '1px solid #334155',
                                borderTopLeftRadius: previewDevice === 'mobile' ? '32px' : '20px',
                                borderTopRightRadius: previewDevice === 'mobile' ? '32px' : '20px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
                                </div>

                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    background: '#1e293b',
                                    padding: '0.25rem 1rem',
                                    borderRadius: '9999px',
                                    fontSize: '0.75rem',
                                    color: '#94a3b8',
                                    maxWidth: '360px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>
                                    <Lock size={12} color="#10b981" />
                                    <span>https://{config.subdomain ? `${config.subdomain}.doctransfer.com` : 'diligence.apexrealty.in'}/v/godrej-sky-terraces</span>
                                </div>

                                <div style={{ width: '40px' }} />
                            </div>

                            {/* DOCUMENT VIEWER SURFACE */}
                            <div style={{
                                background: '#f8fafc',
                                minHeight: '560px',
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                {/* Dynamic Watermark Overlay Across Document Canvas */}
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    pointerEvents: 'none',
                                    zIndex: 20,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-around',
                                    transform: 'rotate(-22deg) scale(1.15)',
                                    opacity: 0.08,
                                    userSelect: 'none',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {[1, 2, 3, 4].map((idx) => (
                                        <div key={idx} style={{
                                            fontSize: '1.25rem',
                                            fontWeight: 800,
                                            color: '#000000',
                                            textAlign: 'center',
                                            letterSpacing: '0.15em'
                                        }}>
                                            {renderedWatermarkSample}
                                        </div>
                                    ))}
                                </div>

                                {/* Viewer Header Bar */}
                                <div style={{
                                    background: '#ffffff',
                                    borderBottom: '1px solid #e2e8f0',
                                    padding: '1rem 1.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    flexWrap: 'wrap',
                                    gap: '0.75rem',
                                    position: 'relative',
                                    zIndex: 30
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="Agency" style={{ maxHeight: '36px', maxWidth: '120px', objectFit: 'contain' }} />
                                        ) : (
                                            <div style={{
                                                width: '38px',
                                                height: '38px',
                                                borderRadius: '10px',
                                                background: config.brand_color,
                                                color: 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <FileText size={20} />
                                            </div>
                                        )}

                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                                                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                                                    Godrej_Sky_Terraces_Cost_Sheet_V3.pdf
                                                </h4>
                                                {config.display_rera_badge && config.rera_reg_no && (
                                                    <span style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '3px',
                                                        background: '#ecfdf5',
                                                        color: '#047857',
                                                        border: '1px solid #a7f3d0',
                                                        padding: '1px 7px',
                                                        borderRadius: '9999px',
                                                        fontSize: '0.68rem',
                                                        fontWeight: 800
                                                    }}>
                                                        <ShieldCheck size={11} /> RERA: {config.rera_reg_no} Verified
                                                    </span>
                                                )}
                                            </div>
                                            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0.15rem 0 0 0' }}>
                                                Presented by <strong>{config.agency_name || 'Apex Realty'}</strong> • 4.8 MB • Pre-Launch Exclusive
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Feedback Toast */}
                                    {actionToast && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '1rem',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            zIndex: 60,
                                            background: actionToast.type === 'success' ? '#064e3b' : '#1e293b',
                                            color: '#ffffff',
                                            padding: '0.6rem 1.25rem',
                                            borderRadius: '9999px',
                                            fontSize: '0.8rem',
                                            fontWeight: 700,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
                                            border: '1px solid rgba(255,255,255,0.15)'
                                        }}>
                                            <CheckCircle size={15} color="#34d399" />
                                            <span>{actionToast.message}</span>
                                        </div>
                                    )}

                                    {/* Action Buttons in Header */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {config.whatsapp_number && (
                                            <button
                                                type="button"
                                                onClick={handleContactBroker}
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.4rem',
                                                    padding: '0.55rem 0.95rem',
                                                    background: '#047857',
                                                    color: '#ffffff',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: 700,
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    boxShadow: '0 2px 6px rgba(4, 120, 87, 0.25)'
                                                }}
                                                title={`Chat directly with broker on WhatsApp (${config.whatsapp_number})`}
                                            >
                                                <MessageCircle size={15} /> Contact Broker
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={handleDownloadPDF}
                                            disabled={downloadingPdf}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.4rem',
                                                padding: '0.55rem 0.95rem',
                                                background: config.brand_color,
                                                color: '#ffffff',
                                                border: 'none',
                                                borderRadius: '8px',
                                                fontSize: '0.8rem',
                                                fontWeight: 700,
                                                cursor: downloadingPdf ? 'wait' : 'pointer',
                                                opacity: downloadingPdf ? 0.75 : 1,
                                                transition: 'all 0.2s',
                                                boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                                            }}
                                            title="Download official watermarked property cost sheet"
                                        >
                                            {downloadingPdf ? (
                                                <>
                                                    <Loader2 size={15} className="animate-spin" /> Generating...
                                                </>
                                            ) : (
                                                <>
                                                    <Download size={15} /> Download PDF
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Main Document Canvas (Simulated Property PDF) */}
                                <div style={{
                                    flex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '2rem 1.5rem',
                                    position: 'relative',
                                    zIndex: 10
                                }}>
                                    <div style={{
                                        maxWidth: '480px',
                                        width: '100%',
                                        background: '#ffffff',
                                        borderRadius: '20px',
                                        border: '1px solid #e2e8f0',
                                        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)',
                                        padding: '2rem',
                                        textAlign: 'center'
                                    }}>
                                        <div style={{
                                            width: '56px',
                                            height: '56px',
                                            borderRadius: '16px',
                                            background: `${config.brand_color}18`,
                                            color: config.brand_color,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto 1.25rem'
                                        }}>
                                            <FileText size={28} />
                                        </div>

                                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
                                            Godrej Sky Terraces
                                        </h3>
                                        <p style={{ fontSize: '0.825rem', color: '#64748b', margin: '0 0 1.5rem 0' }}>
                                            Tower B — 3 BHK Sky Penthouse • RERA Carpet: 1,485 Sq. Ft.
                                        </p>

                                        <div style={{
                                            background: '#f8fafc',
                                            borderRadius: '12px',
                                            padding: '1rem',
                                            marginBottom: '1.5rem',
                                            border: '1px solid #e2e8f0',
                                            display: 'flex',
                                            justifyContent: 'space-around',
                                            textAlign: 'center'
                                        }}>
                                            <div>
                                                <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Base Price</div>
                                                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>₹ 4.85 Cr</div>
                                            </div>
                                            <div style={{ width: '1px', background: '#e2e8f0' }} />
                                            <div>
                                                <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Possession</div>
                                                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#059669' }}>Dec 2026</div>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleDownloadPDF}
                                            disabled={downloadingPdf}
                                            style={{
                                                width: '100%',
                                                padding: '0.85rem',
                                                background: config.brand_color,
                                                color: '#ffffff',
                                                border: 'none',
                                                borderRadius: '12px',
                                                fontSize: '0.9rem',
                                                fontWeight: 700,
                                                cursor: downloadingPdf ? 'wait' : 'pointer',
                                                opacity: downloadingPdf ? 0.75 : 1,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.5rem',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {downloadingPdf ? (
                                                <>
                                                    <Loader2 size={16} className="animate-spin" /> Generating Watermarked PDF...
                                                </>
                                            ) : (
                                                <>
                                                    <Download size={16} /> Download Full Cost Sheet & Floor Plans
                                                </>
                                            )}
                                        </button>

                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', marginTop: '1rem', color: '#94a3b8', fontSize: '0.72rem' }}>
                                            <Shield size={12} color="#059669" />
                                            <span>Zero-Knowledge AES-256 Client Encryption Protected</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Viewer Footer */}
                                <div style={{
                                    background: '#ffffff',
                                    borderTop: '1px solid #f1f5f9',
                                    padding: '1rem',
                                    textAlign: 'center',
                                    fontSize: '0.78rem',
                                    color: '#64748b',
                                    position: 'relative',
                                    zIndex: 30
                                }}>
                                    {config.site_url && (
                                        <div style={{ marginBottom: '0.35rem' }}>
                                            <a href={config.site_url} target="_blank" rel="noopener noreferrer" style={{ color: '#059669', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                                Visit {config.agency_name || 'Apex Realty'} Portal <ExternalLink size={11} />
                                            </a>
                                        </div>
                                    )}

                                    {!config.remove_branding ? (
                                        <span style={{ color: '#94a3b8', fontSize: '0.72rem' }}>
                                            Powered by DocTransfer Enterprise
                                        </span>
                                    ) : (
                                        <span style={{ color: '#047857', fontSize: '0.72rem', fontWeight: 800, background: '#ecfdf5', padding: '2px 8px', borderRadius: '4px' }}>
                                            ✨ 100% White-Labeled (DocTransfer Branding Removed)
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BrandingSettings;
