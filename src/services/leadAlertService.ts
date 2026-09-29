/**
 * Lead Alert & Telemetry Dispatch Engine
 * Reads notification preferences and triggers real-time alerts when clients view/dwell on property documents
 */

export interface NotificationConfig {
    whatsapp_enabled: boolean;
    whatsapp_phone: string;
    dwell_time_alert: boolean;
    dwell_threshold_seconds: number;
    forward_leak_alert: boolean;
    daily_digest_enabled: boolean;
    daily_digest_channel: 'whatsapp' | 'email' | 'both';
    mandate_expiry_alert: boolean;
    mandate_alert_days: number;
    email_on_open: boolean;
    email_on_sign: boolean;
    email_on_download: boolean;
    webhook_url?: string;
}

export interface LeadAlertPayload {
    eventType: 'document_opened' | 'hot_lead_dwell' | 'document_downloaded' | 'document_signed';
    documentId: string;
    documentName: string;
    durationSeconds?: number;
    viewerIp?: string;
    viewerEmail?: string;
    viewerPhone?: string;
    pageNumber?: number;
    timestamp?: string;
}

export const DEFAULT_NOTIFICATION_CONFIG: NotificationConfig = {
    whatsapp_enabled: true,
    whatsapp_phone: '',
    dwell_time_alert: true,
    dwell_threshold_seconds: 60,
    forward_leak_alert: true,
    daily_digest_enabled: true,
    daily_digest_channel: 'whatsapp',
    mandate_expiry_alert: true,
    mandate_alert_days: 5,
    email_on_open: true,
    email_on_sign: true,
    email_on_download: true
};

export const getNotificationConfig = (): NotificationConfig => {
    if (typeof window === 'undefined') return DEFAULT_NOTIFICATION_CONFIG;
    try {
        const saved = localStorage.getItem('doctransfer_notification_settings');
        if (saved) {
            return { ...DEFAULT_NOTIFICATION_CONFIG, ...JSON.parse(saved) };
        }
    } catch (e) {
        console.error('Failed to parse notification settings:', e);
    }
    return DEFAULT_NOTIFICATION_CONFIG;
};

// Track alerts sent in current session to prevent spamming
const dispatchedAlerts = new Set<string>();

/**
 * Dispatches an event alert to broker/developer based on notification settings
 */
export const dispatchLeadAlert = async (payload: LeadAlertPayload): Promise<boolean> => {
    const config = getNotificationConfig();
    const alertKey = `${payload.documentId}_${payload.eventType}_${payload.pageNumber || 1}`;

    // Prevent duplicate alerts in same session
    if (dispatchedAlerts.has(alertKey)) {
        return false;
    }

    // Check if event type is enabled
    if (payload.eventType === 'document_opened' && !config.email_on_open && !config.whatsapp_enabled) {
        return false;
    }
    if (payload.eventType === 'hot_lead_dwell' && !config.dwell_time_alert) {
        return false;
    }
    if (payload.eventType === 'document_downloaded' && !config.email_on_download) {
        return false;
    }
    if (payload.eventType === 'document_signed' && !config.email_on_sign) {
        return false;
    }

    dispatchedAlerts.add(alertKey);

    const timeString = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });
    const viewerLabel = payload.viewerPhone || payload.viewerEmail || payload.viewerIp || 'A prospective client';

    let alertTitle = '🔔 Document Activity Alert';
    let alertMessage = '';

    if (payload.eventType === 'hot_lead_dwell') {
        alertTitle = '🔥 HOT LEAD ALERT: High Buyer Interest!';
        alertMessage = `${viewerLabel} has spent ${payload.durationSeconds}s studying "${payload.documentName}". Excellent time for a follow-up call!`;
    } else if (payload.eventType === 'document_opened') {
        alertTitle = '👀 Document Opened';
        alertMessage = `${viewerLabel} just opened "${payload.documentName}" at ${timeString} IST.`;
    } else if (payload.eventType === 'document_signed') {
        alertTitle = '✍️ Document Executed';
        alertMessage = `Agreement for "${payload.documentName}" was successfully signed by ${viewerLabel}.`;
    } else if (payload.eventType === 'document_downloaded') {
        alertTitle = '📥 Document Downloaded';
        alertMessage = `A copy of "${payload.documentName}" was downloaded by ${viewerLabel}.`;
    }

    // 1. Browser Push Notification (if permitted)
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        try {
            new Notification(alertTitle, {
                body: alertMessage,
                icon: '/favicon.ico'
            });
        } catch (e) {
            console.warn('Browser notification failed:', e);
        }
    }

    // 2. Broadcast to In-App Listeners / Event Bus
    if (typeof window !== 'undefined') {
        const event = new CustomEvent('doctransfer:lead_alert', {
            detail: {
                title: alertTitle,
                message: alertMessage,
                payload,
                timestamp: new Date().toISOString()
            }
        });
        window.dispatchEvent(event);

        // Store in local alert history log
        try {
            const history = JSON.parse(localStorage.getItem('doctransfer_lead_alerts_log') || '[]');
            history.unshift({
                id: `alert_${Date.now()}`,
                title: alertTitle,
                message: alertMessage,
                payload,
                timestamp: new Date().toISOString(),
                read: false
            });
            // Keep latest 50 alerts
            localStorage.setItem('doctransfer_lead_alerts_log', JSON.stringify(history.slice(0, 50)));
        } catch (e) {
            console.error('Failed to log lead alert history:', e);
        }
    }

    // 3. Trigger Webhook if configured (e.g. LeadSquared, Sell.Do, Zapier, WhatsApp Gateway)
    if (config.webhook_url) {
        try {
            fetch(config.webhook_url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    alertTitle,
                    alertMessage,
                    ...payload,
                    brokerWhatsApp: config.whatsapp_phone,
                    timestamp: new Date().toISOString()
                })
            }).catch(e => console.warn('Webhook dispatch failed:', e));
        } catch (e) {
            console.error('Webhook error:', e);
        }
    }

    console.log(`[LeadAlertService] Dispatched: ${alertTitle} -> ${alertMessage}`);
    return true;
};
