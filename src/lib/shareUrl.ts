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
