import { BASE_URL } from './seo';

/**
 * Universal helper to resolve shareable links across Localhost and Production.
 * If running on localhost or 127.0.0.1, it provides the option to use the public production domain
 * so that links sent to mobile phones via WhatsApp can actually be opened.
 */
export const getShareBaseUrl = (preferProduction = false): string => {
    if (typeof window === 'undefined') return BASE_URL;

    const hostname = window.location.hostname;
    const isLocal = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.') || hostname.startsWith('10.');

    if (preferProduction && isLocal) {
        return BASE_URL; // 'https://www.doctransfer.app'
    }

    return window.location.origin;
};

/**
 * Constructs a fully qualified shareable link for a document or signing session.
 */
export const buildShareUrl = (path: string, preferProduction = false): string => {
    const base = getShareBaseUrl(preferProduction);
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${base}${cleanPath}`;
};

/**
 * Encodes a rich WhatsApp message with title, description, and share URL.
 * Works seamlessly on mobile WhatsApp app and desktop WhatsApp Web.
 */
export const formatWhatsAppShareUrl = (url: string, title?: string): string => {
    const text = 
        `🔒 *Confidential Document Shared via DocTransfer*\n\n` +
        `📄 *File:* ${title || 'Secure Document'}\n` +
        `⚡ *Security:* Zero-Knowledge Encrypted • Real-time View Tracking\n\n` +
        `👉 *Click to View / Sign:* ${url}`;

    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
};

export interface RealEstateShareOptions {
    url: string;
    projectName?: string;
    location?: string;
    bhkConfig?: string;
    reraNumber?: string;
    brokerName?: string;
    brokerPhone?: string;
    priceStarting?: string;
    type?: 'pitch' | 'dossier' | 'rate-card';
}

/**
 * Formats specialized WhatsApp messages for Indian Real Estate:
 * - 'pitch': Project brochure, floor plans & cost sheet for prospective buyers
 * - 'dossier': 30-year title due diligence room for advocates & buyers
 * - 'rate-card': Confidential channel partner pricing & discount sheets
 */
export const formatRealEstateWhatsAppShareUrl = (opts: RealEstateShareOptions): string => {
    const {
        url,
        projectName = 'Exclusive Property',
        location,
        bhkConfig,
        reraNumber,
        brokerName,
        brokerPhone,
        priceStarting,
        type = 'pitch'
    } = opts;

    let text = '';

    if (type === 'dossier') {
        text =
            `📑 *Property Due Diligence & 30-Year Title Search Dossier*\n\n` +
            `🏢 *Property:* ${projectName}\n` +
            (location ? `📍 *Location:* ${location}\n` : '') +
            (reraNumber ? `📜 *RERA Reg:* ${reraNumber}\n` : '') +
            `✅ *Verified:* 30-Yr EC • Revenue Records (7/12 / Khata / Patta) • Bank APF Approved\n\n` +
            `🔒 *Access Protected Virtual Due Diligence Room:*\n` +
            `👉 ${url}\n\n` +
            (brokerName ? `⚖️ *Legal Due Diligence by:* ${brokerName}\n` : '') +
            `⚡ *Tamper-Proof Audit Trail via DocTransfer*`;
    } else if (type === 'rate-card') {
        text =
            `🤫 *CONFIDENTIAL: Channel Partner Rate Card & Inventory*\n\n` +
            `🏢 *Project:* ${projectName}\n` +
            (location ? `📍 *Location:* ${location}\n` : '') +
            `⚠️ *Strictly for Authorized Channel Partners — Do Not Circulate*\n\n` +
            `📊 *View Protected Rate Card & Milestone Disclosures:*\n` +
            `👉 ${url}\n\n` +
            (brokerName ? `👤 *Circulated to:* ${brokerName}\n` : '') +
            `🔒 *Protected with Recipient Dynamic Watermark via DocTransfer*`;
    } else {
        // default: property pitch
        text =
            `🏡 *${projectName} — Project Dossier & Layouts*\n\n` +
            (location ? `📍 *Location:* ${location}\n` : '') +
            (bhkConfig ? `✨ *Typology:* ${bhkConfig}\n` : '') +
            (priceStarting ? `💰 *Starting Price:* ${priceStarting}\n` : '') +
            (reraNumber ? `📜 *RERA Reg:* ${reraNumber}\n` : '') +
            `\n📊 *Verified Floor Plans, Brochure & Cost Sheet:*\n` +
            `👉 ${url}\n\n` +
            (brokerName ? `🛡️ *Marketed Exclusively by:* ${brokerName}\n` : '') +
            (brokerPhone ? `📞 *For VIP Site Visits & Booking:* ${brokerPhone}\n` : '') +
            `⚡ *View-Tracked via DocTransfer PropTech*`;
    }

    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
};
