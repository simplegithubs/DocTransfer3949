import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { comparePassword, rateLimiter } from './lib/security';
import { FileText, Download, AlertCircle, Lock as LockIcon, Package, ArrowRight, ExternalLink, Flame, ShieldCheck, Video, Music, Image as ImageIcon, Table, Archive, Mail } from 'lucide-react';
import { logDocumentView, logDocumentDownload, logPasswordVerification, logEmailVerification } from './lib/auditLogger';
import WatermarkOverlay from './components/WatermarkOverlay';
import { applyPdfWatermark, applyImageWatermark } from './lib/watermarkGenerator';
import WebcamGate from './components/WebcamGate';
import { getPreviewType, getExtension } from './lib/fileTypes';
import { decryptFile } from './lib/encryption';
import SEO from './components/SEO';
import { BASE_URL } from './lib/seo';

interface DocumentData {
    id: string;
    name: string;
    file_path: string;
    file_size: number;
    file_type: string;
    storage_type?: string;
    google_drive_link?: string;
    password?: string;
    allow_download: boolean;
    expires_at?: string;
    screenshot_protection: boolean;
    email_verification: boolean;
    allowed_email?: string;
    apply_watermark?: boolean;
    // Encryption fields
    is_encrypted?: boolean;
    encryption_key?: string;
    encryption_iv?: string;
    original_file_type?: string;
    watermark_config?: {
        text: string;
        color: string;
        opacity: number;
        fontSize: number;
        rotation: number;
        layout: 'single' | 'tiled';
    };
    require_snapshot: boolean;
    scan_status?: 'pending' | 'clean' | 'infected' | 'error';
    max_views?: number;
    view_count?: number;
    burn_after_reading?: boolean;
    share_link?: string; // Added for bundle listing
    user_id?: string;
}

interface BundleData {
    id: string;
    name: string;
    share_link: string;
    created_at: string;
    password?: string;
    expires_at?: string;
    require_email_verification: boolean;
    allowed_email?: string;
    user_id?: string;
}

const ViewDocument: React.FC = () => {
    const { t } = useTranslation();
    const { shareLink } = useParams<{ shareLink: string }>();
    const [document, setDocument] = useState<DocumentData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [passwordInput, setPasswordInput] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [downloading, setDownloading] = useState(false);

    // Bundle State
    const [isBundle, setIsBundle] = useState(false);
    const [bundleData, setBundleData] = useState<BundleData | null>(null);
    const [bundleDocs, setBundleDocs] = useState<DocumentData[]>([]);

    // Email Verification State
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [sentCode, setSentCode] = useState<string | null>(null);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [showCodeInput, setShowCodeInput] = useState(false);

    // Biometric/Snapshot State
    const [isSnapshotVerified, setIsSnapshotVerified] = useState(false);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

    // Receiver Email Gate State (mandatory before download)
    const [receiverEmail, setReceiverEmail] = useState('');
    const [isReceiverEmailSubmitted, setIsReceiverEmailSubmitted] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);


    // Watermark State
    const [watermarkedUrl, setWatermarkedUrl] = useState<string | null>(null);
    const [viewerIp, setViewerIp] = useState<string>('Unknown IP');
    const [isWatermarking, setIsWatermarking] = useState(false);


    const [branding, setBranding] = useState<{
        logo_url?: string;
        brand_color?: string;
        site_url?: string;
        remove_branding?: boolean;
    } | null>(null);

    // Encryption State
    const [decryptionKey, setDecryptionKey] = useState<string | null>(null);
    const [decryptedUrl, setDecryptedUrl] = useState<string | null>(null);
    const [isDecrypting, setIsDecrypting] = useState(false);

    useEffect(() => {
        fetchDocument();
        fetchViewerIp();
        
        // Extract encryption key from hash
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const key = hashParams.get('key');
        if (key) setDecryptionKey(key);
    }, [shareLink]);

    useEffect(() => {
        if (document?.is_encrypted && decryptionKey && isAuthenticated && (document.email_verification ? isEmailVerified : true) && (document.require_snapshot ? isSnapshotVerified : true)) {
            handleDecryption();
        }
    }, [document, decryptionKey, isAuthenticated, isEmailVerified, isSnapshotVerified]);

    const handleDecryption = async () => {
        if (!document || !decryptionKey || !document.encryption_iv || decryptedUrl) return;
        
        setIsDecrypting(true);
        try {
            const { data, error } = await supabase.storage
                .from('documents')
                .download(document.file_path);

            if (error) throw error;

            const decryptedBuffer = await decryptFile(data, decryptionKey, document.encryption_iv);
            const blob = new Blob([decryptedBuffer], { type: document.file_type });
            const url = URL.createObjectURL(blob);
            setDecryptedUrl(url);
        } catch (err) {
            console.error('Decryption failed:', err);
            setError('Failed to decrypt document. The encryption key might be missing or invalid.');
        } finally {
            setIsDecrypting(false);
        }
    };

    const fetchViewerIp = async () => {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            if (data.ip) setViewerIp(data.ip);
        } catch (e) {
            console.warn('Failed to fetch viewer IP:', e);
        }
    };

    const fetchDocument = async () => {
        try {
            // 1. Try to find Single Document
            const { data: docData } = await supabase
                .from('documents')
                .select('*')
                .eq('share_link', shareLink)
                .maybeSingle();

            if (docData) {
                setDocument(docData);
                handleDocLoaded(docData);
                return;
            }

            // 2. If not found, try to find Bundle
            const { data: bundle } = await supabase
                .from('document_bundles')
                .select('*')
                .eq('share_link', shareLink)
                .maybeSingle();

            if (bundle) {
                setIsBundle(true);
                setBundleData(bundle);

                // Fetch docs in bundle
                const { data: docs } = await supabase
                    .from('documents')
                    .select('*')
                    .eq('bundle_id', bundle.id)
                    .order('created_at', { ascending: true });

                if (docs) setBundleDocs(docs);

                handleBundleLoaded(bundle);
                return;
            }

            throw new Error('Not found');

        } catch (err: any) {
            console.error('Error fetching resource:', err);
            setError('Link is invalid or has expired.');
        } finally {
            setLoading(false);
        }
    };

    const handleDocLoaded = (data: DocumentData) => {
        // Fetch branding settings
        if (data.user_id) {
            supabase
                .from('branding_settings')
                .select('logo_url, brand_color, site_url')
                .eq('user_id', data.user_id)
                .single()
                .then(({ data: brandingData }) => {
                    if (brandingData) setBranding(brandingData);
                    
                    // Apply Watermarking if enabled - do it after branding fetch to ensure order
                    const previewType = getPreviewType(getExtension(data.name));
                    if (data.apply_watermark && (previewType === 'pdf' || previewType === 'image') && !data.is_encrypted) {
                        handleDocumentWatermarking(data);
                    }
                });
        }

        // Start basic view tracking
        trackView(data.id);

        // Increment Secure View Count
        supabase.rpc('increment_view_count', { doc_id: data.id }).then(({ error }) => {
            if (error) console.error('Failed to increment view count:', error);
        });

        // Log to audit system
        logDocumentView(data.id, {
            metadata: {
                viewer_agent: navigator.userAgent
            }
        });

        // SECURITY: Check Malware Scan Status
        if (data.scan_status === 'infected') {
            setError('This file has been flagged as malicious and cannot be accessed.');
            return;
        }

        // Check Max Views (Burn After Reading Fail-safe)
        if (data.max_views && (data.view_count || 0) >= data.max_views) {
            setError(`This document is self-destructed. The view limit (${data.max_views}) has been reached.`);
            return;
        }

        // Check for expiration
        if (data.expires_at) {
            const expirationDate = new Date(data.expires_at);
            const now = new Date();
            expirationDate.setHours(23, 59, 59, 999);

            if (now > expirationDate) {
                setError('This link has expired.');
                return;
            }
        }

        // Auto-authenticate logic
        if ((!data.password || data.password === '') && !data.email_verification) {
            setIsAuthenticated(true);
        }
    };

    const handleDocumentWatermarking = async (data: any) => {
        setIsWatermarking(true);
        try {
            console.log('Applying interior watermark...');
            const { data: fileData, error: downloadError } = await supabase.storage
                .from('documents')
                .download(data.file_path);

            if (downloadError) throw downloadError;

            const watermarkConfig = data.watermark_config || {
                text: 'CONFIDENTIAL',
                color: '#ff0000',
                opacity: 0.2,
                fontSize: 24,
                rotation: -45,
                layout: 'tiled'
            };

            const previewType = getPreviewType(getExtension(data.name));
            let processedUrl = '';

            if (previewType === 'pdf') {
                const processedPdf = await applyPdfWatermark(
                    await fileData.arrayBuffer(),
                    watermarkConfig,
                    {
                        email: isEmailVerified ? email : undefined,
                        ip: viewerIp,
                        date: new Date().toLocaleDateString()
                    }
                );
                const blob = new Blob([processedPdf as BlobPart], { type: 'application/pdf' });
                processedUrl = URL.createObjectURL(blob);
            } else if (previewType === 'image') {
                const processedImageBlob = await applyImageWatermark(
                    fileData,
                    watermarkConfig,
                    {
                        email: isEmailVerified ? email : undefined,
                        ip: viewerIp,
                        date: new Date().toLocaleDateString()
                    }
                );
                processedUrl = URL.createObjectURL(processedImageBlob);
            }

            if (processedUrl) {
                setWatermarkedUrl(processedUrl);
                console.log('✓ Interior watermark applied successfully');
            }
        } catch (err) {
            console.error('Failed to apply interior watermark:', err);
        } finally {
            setIsWatermarking(false);
        }
    };

    const handleBundleLoaded = (data: BundleData) => {
        // Fetch branding
        if (data.user_id) {
            supabase
                .from('branding_settings')
                .select('logo_url, brand_color, site_url')
                .eq('user_id', data.user_id)
                .single()
                .then(({ data: brandingData }) => {
                    if (brandingData) setBranding(brandingData);
                });
        }

        // Check Expiration
        if (data.expires_at) {
            const expirationDate = new Date(data.expires_at);
            const now = new Date();
            expirationDate.setHours(23, 59, 59, 999);

            if (now > expirationDate) {
                setError('This bundle link has expired.');
                return;
            }
        }

        // Auto-authenticate logic
        if ((!data.password || data.password === '') && !data.require_email_verification) {
            setIsAuthenticated(true);
        }
    };

    // Track View Logic
    const trackView = async (documentId: string) => {
        try {
            // 1. Get/Create Session Logic
            let geoData = null;
            try {
                // Try a privacy-friendly IP/location service if available, or just send null to let backend/edge handle it
                // For this demo we'll skip external fetch to avoid CORS blocks on localhost, backend will handle IP
            } catch (e) {
                console.warn('Failed to fetch geolocation', e);
            }

            // Create Session
            const { data: sessionData, error: sessionError } = await supabase
                .from('document_access_sessions')
                .insert({
                    document_id: documentId,
                    user_agent: navigator.userAgent,
                    // geolocation: geoData // Let supabase edge/triggers handle this if possible, or backend
                })
                .select('session_id')
                .single();

            if (sessionError) {
                console.error('Session creation failed:', sessionError);
                return;
            }

            if (sessionData) {
                setCurrentSessionId(sessionData.session_id);

                // 2. Track View (Initial Page 1)
                const { data: viewData, error: viewError } = await supabase
                    .from('document_view_tracking')
                    .insert({
                        session_id: sessionData.session_id,
                        document_id: documentId,
                        page_number: 1
                    })
                    .select('id')
                    .single();

                if (viewData && !viewError) {
                    // Start Heartbeat for Duration
                    const startTime = Date.now();
                    const heartbeatInterval = setInterval(async () => {
                        const duration = Math.round((Date.now() - startTime) / 1000);
                        if (duration > 0 && duration % 5 === 0) { // Update every 5 seconds
                            await supabase
                                .from('document_view_tracking')
                                .update({ duration_seconds: duration })
                                .eq('id', viewData.id);
                        }
                    }, 5000);

                    // Cleanup
                    const cleanup = () => {
                        clearInterval(heartbeatInterval);
                        const finalDuration = Math.round((Date.now() - startTime) / 1000);
                        supabase
                            .from('document_view_tracking')
                            .update({ duration_seconds: finalDuration })
                            .eq('id', viewData.id)
                            .then(() => { });
                    };

                    window.addEventListener('beforeunload', cleanup);
                    return cleanup;
                }
            }
        } catch (err) {
            console.error('Error tracking view:', err);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const target = isBundle ? bundleData : document;

        if (target?.password && await comparePassword(passwordInput, target.password)) {
            setIsAuthenticated(true);
            if (document) await logPasswordVerification(document.id, true); // Log for single doc
        } else {
            if (document) await logPasswordVerification(document.id, false);
            alert('Incorrect password');
        }
    };

    const handleSendCode = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        // Rate limiting: Only allow one code every 60 seconds per email
        const rateCheck = rateLimiter.check(email, 1, 60000);
        if (!rateCheck.allowed) {
            alert(`Please wait ${rateCheck.waitTime} seconds before requesting a new code.`);
            return;
        }

        const target = isBundle ? bundleData : document;

        // Check if specific email is required
        const targetAllowedEmail = target?.allowed_email?.trim().toLowerCase();
        const inputEmail = email.trim().toLowerCase();

        if (targetAllowedEmail && targetAllowedEmail !== inputEmail) {
            alert('Access denied. This document is not shared with this email address.');
            return;
        }

        // Generate verification code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setSentCode(code);
        setShowCodeInput(true);

        // TODO: In production, integrate real email service (Resend/SendGrid/AWS SES)
        alert(`Verification code sent to ${email}. Check your email. (DEMO MODE: Your code is ${code})`);

        // Development only - show code in console
        if (import.meta.env.DEV) {
            console.log(`[DEV ONLY] Verification code: ${code}`);
        }
    };

    const handleVerifyCode = (e: React.FormEvent) => {
        e.preventDefault();
        if (verificationCode === sentCode) {
            setIsEmailVerified(true);
            if (document) logEmailVerification(document.id, email, true);
        } else {
            if (document) logEmailVerification(document.id, email, false);
            alert('Invalid code');
        }
    };


    const handleSnapshotSuccess = async (url: string) => {
        setIsSnapshotVerified(true);
        if (currentSessionId) {
            await supabase
                .from('document_access_sessions')
                .update({ snapshot_url: url })
                .eq('session_id', currentSessionId);
        }
    };

    const handleReceiverEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!receiverEmail.trim()) return;
        setIsReceiverEmailSubmitted(true);
        setShowEmailModal(false);
        // Trigger download after email is submitted
        setTimeout(() => {
            handleDownload();
        }, 100);
    };

    const handleDownloadClick = () => {
        if (isReceiverEmailSubmitted) {
            handleDownload();
        } else {
            setShowEmailModal(true);
        }
    };

    const handleDownload = async () => {
        if (!document) return;
        setDownloading(true);

        try {
            console.log('=== DOWNLOAD DEBUG START ===');
            console.log('Document:', {
                name: document.name,
                storage_type: document.storage_type,
                file_type: document.file_type,
                original_file_type: document.original_file_type,
                is_encrypted: document.is_encrypted,
                has_encryption_key: !!document.encryption_key,
                has_encryption_iv: !!document.encryption_iv
            });

            // Track receiver download in document_downloads table
            if (receiverEmail) {
                try {
                    await supabase
                        .from('document_downloads')
                        .insert({
                            document_id: document.id,
                            receiver_email: receiverEmail.trim().toLowerCase(),
                            ip_address: viewerIp,
                            user_agent: navigator.userAgent
                        });
                    console.log('✓ Download tracked for:', receiverEmail);
                } catch (trackErr) {
                    console.error('Failed to track download:', trackErr);
                }
            }

            // Check if it's a Google Drive link
            if (document.storage_type === 'google_drive' && document.google_drive_link) {
                // Redirect to Google Drive
                window.location.href = document.google_drive_link;
                return;
            }

            // Handle Supabase storage download
            console.log('Downloading from storage:', document.file_path);
            
            let blob: Blob;
            
            if (document.is_encrypted && decryptedUrl) {
                // Already decrypted for preview
                const response = await fetch(decryptedUrl);
                blob = await response.blob();
            } else if (document.is_encrypted && decryptionKey && document.encryption_iv) {
                // Decrypt on the fly
                console.log('Decrypting on the fly for download...');
                const { data, error } = await supabase.storage
                    .from('documents')
                    .download(document.file_path);
                
                if (error) throw error;
                
                const decryptedBuffer = await decryptFile(data, decryptionKey, document.encryption_iv);
                blob = new Blob([decryptedBuffer], { type: document.file_type });
            } else {
                // Standard download
                const { data, error } = await supabase.storage
                    .from('documents')
                    .download(document.file_path);

                if (error) {
                    console.error('Storage download error:', error);
                    throw error;
                }
                blob = data;
            }

            console.log('✓ Blob ready, size:', blob.size, 'bytes');

            // Verify blob has content
            if (blob.size === 0) {
                console.error('Error: Downloaded blob is empty');
                alert('Error: Downloaded file is empty.');
                return;
            }

            console.log('Creating download link...');
            
            // Create download link
            const url = watermarkedUrl || window.URL.createObjectURL(blob);
            const a = window.document.createElement('a');
            a.href = url;
            a.download = document.name;
            window.document.body.appendChild(a);
            a.click();

            console.log('✓ Download triggered');

            // Cleanup
            if (!watermarkedUrl) {
                window.URL.revokeObjectURL(url);
            }
            window.document.body.removeChild(a);

            console.log('✓ Download triggered');

            // BURN AFTER READING CHECK
            if (document.burn_after_reading) {
                await burnDocument();
            }

            console.log('=== DOWNLOAD DEBUG END ===');
        } catch (err: any) {
            console.error('Download error:', err);
            console.error('Error details:', {
                message: err.message,
                stack: err.stack
            });
            alert(`Failed to download file: ${err.message || 'Unknown error'}`);
        } finally {
            if (document) {
                logDocumentDownload(document.id, {
                    userEmail: receiverEmail || email || undefined,
                    metadata: { storageType: document.storage_type }
                });
            }
            setDownloading(false);
        }
    };

    const burnDocument = async () => {
        if (!document) return;

        try {
            console.log('🔥 Initiating Burn After Reading sequence...');

            // 1. Delete file from storage
            const { error: storageError } = await supabase.storage
                .from('documents')
                .remove([document.file_path]);

            if (storageError) {
                console.error('Failed to delete file from storage:', storageError);
                // Continue to delete record anyway to prevent access
            }

            // 2. Delete document record
            const { error: dbError } = await supabase
                .from('documents')
                .delete()
                .eq('id', document.id);

            if (dbError) {
                console.error('Failed to delete document record:', dbError);
            }

            // 3. UI Feedback
            alert('This message will self-destruct... \n\nFile has been incinerated as per "Burn After Reading" protocol.');
            setError('This document has been burned and is no longer available.');
            setDocument(null);

        } catch (err) {
            console.error('Error burning document:', err);
        }
    };

    // Determine targets
    const targetData = isBundle ? bundleData : document;

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
                <SEO 
                    title={targetData ? `View: ${targetData.name}` : 'View Document'} 
                    description="Securely view documents shared via DocTransfer."
                    url={`${window.location.origin}/view/${shareLink}`}
                />
                <div className="animate-spin" style={{ width: '32px', height: '32px', border: '3px solid #e5e7eb', borderTopColor: '#4f46e5', borderRadius: '50%' }}></div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', padding: '1rem' }}>
                <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
                    <div style={{ width: '64px', height: '64px', background: '#fee2e2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                        <AlertCircle size={32} color="#dc2626" />
                    </div>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>{t('view.accessDenied')}</h1>
                    <p style={{ color: '#6b7280' }}>{error}</p>
                </div>
            </div>
        );
    }


    // Auth Check (Password or Email)
    const requiresEmail = isBundle
        ? bundleData?.require_email_verification
        : document?.email_verification;

    if ((targetData?.password && !isAuthenticated) || (requiresEmail && !isEmailVerified)) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', padding: '1rem' }}>
                <div style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', maxWidth: '440px', width: '100%' }}>

                    {/* Branding Logo */}
                    {branding?.logo_url && (
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                            <img src={branding.logo_url} alt="Logo" style={{ height: '40px', objectFit: 'contain' }} />
                        </div>
                    )}

                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={{ width: '64px', height: '64px', background: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                            <LockIcon size={32} color="#3b82f6" />
                        </div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>
                            {requiresEmail && !isEmailVerified ? t('view.emailTitle') : t('view.passwordTitle')}
                        </h1>
                        <p style={{ color: '#6b7280' }}>
                            {isBundle
                                ? "This document bundle is secured."
                                : t('view.passwordDesc')
                            }
                        </p>
                    </div>

                    {/* Email Verification UI */}
                    {requiresEmail && !isEmailVerified ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {!showCodeInput ? (
                                <form onSubmit={handleSendCode} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder={t('view.emailPlaceholder')}
                                        style={{ width: '100%', padding: '0.875rem', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '1rem', outline: 'none' }}
                                        required
                                    />
                                    <button type="submit" style={{ width: '100%', padding: '0.875rem', background: branding?.brand_color || '#2563eb', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '600', fontSize: '1rem', cursor: 'pointer' }}>
                                        {t('view.sendCode')}
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleVerifyCode} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <input
                                        type="text"
                                        value={verificationCode}
                                        onChange={(e) => setVerificationCode(e.target.value)}
                                        placeholder="Enter 6-digit code"
                                        style={{ width: '100%', padding: '0.875rem', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '1rem', outline: 'none', textAlign: 'center', letterSpacing: '0.25rem' }}
                                        required
                                    />
                                    <button type="submit" style={{ width: '100%', padding: '0.875rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '600', fontSize: '1rem', cursor: 'pointer' }}>
                                        {t('view.verify')}
                                    </button>
                                    <button type="button" onClick={() => setShowCodeInput(false)} style={{ background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '0.875rem' }}>
                                        {t('view.changeEmail')}
                                    </button>
                                </form>
                            )}
                        </div>
                    ) : (
                        /* Password UI */
                        <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input
                                type="password"
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                placeholder={t('view.passwordPlaceholder')}
                                style={{ width: '100%', padding: '0.875rem', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '1rem', outline: 'none' }}
                                required
                            />
                            <button type="submit" style={{ width: '100%', padding: '0.875rem', background: branding?.brand_color || '#2563eb', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '600', fontSize: '1rem', cursor: 'pointer' }}>
                                {t('view.unlock')}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        );
    }

    // --- BUNDLE VIEW ---
    if (isBundle && bundleData) {
        return (
            <div style={{ minHeight: '100vh', background: '#f3f4f6', padding: '2rem' }}>
                <SEO 
                    title={`Bundle: ${bundleData.name}`} 
                    description="Securely view document bundles shared via DocTransfer."
                    url={`${BASE_URL}/view/${shareLink}`}
                />
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    {/* Bundle Header */}
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        {branding?.logo_url && (
                            <img src={branding.logo_url} alt="Logo" style={{ height: '32px', marginBottom: '1.5rem' }} />
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                            <div style={{ background: '#ecfdf5', padding: '0.75rem', borderRadius: '10px' }}>
                                <Package size={32} color="#059669" />
                            </div>
                            <div>
                                <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827' }}>{bundleData.name}</h1>
                                <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                                    {bundleDocs.length} files • Created {new Date(bundleData.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Files List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {bundleDocs.map((doc) => (
                            <div key={doc.id} style={{
                                background: 'white',
                                padding: '1.25rem',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                cursor: 'pointer',
                                border: '1px solid transparent'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
                                    e.currentTarget.style.borderColor = '#e5e7eb';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'none';
                                    e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
                                    e.currentTarget.style.borderColor = 'transparent';
                                }}
                                onClick={() => {
                                    // Navigate to individual document view
                                    window.open(`${window.location.origin}/view/${doc.share_link}`, '_blank');
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        background: '#f3f4f6',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <FileText size={24} color="#6b7280" />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>{doc.name}</h3>
                                        <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{(doc.file_size / 1024).toFixed(2)} KB</p>
                                    </div>
                                </div>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: '#f9fafb',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <ExternalLink size={20} color="#6b7280" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {!branding?.remove_branding && (
                        <div style={{ marginTop: '2rem', textAlign: 'center', color: '#9ca3af', fontSize: '0.8rem' }}>
                            Powered by DocTransfer
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // --- SINGLE DOC VIEW (Existing + Interface) ---
    // At this point, we assume it's NOT a bundle, so 'document' must be present 
    // unless loading failed (handled above) or not initialized.
    if (!document) return null;

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f3f4f6',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <SEO 
                title={`View: ${document.name}`} 
                description="Securely view documents shared via DocTransfer."
                url={`${BASE_URL}/view/${shareLink}`}
            />
            {/* Watermark Overlay */}
            {document.watermark_config && (
                <WatermarkOverlay
                    config={document.watermark_config}
                    viewerInfo={{
                        email: isEmailVerified ? email : undefined,
                        ip: viewerIp,
                        date: new Date().toLocaleString()
                    }}
                />
            )}

            {/* Content Container */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem'
            }}>
                <div style={{
                    background: 'white',
                    borderRadius: '24px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                    width: '100%',
                    maxWidth: '1000px',
                    overflow: 'hidden',
                    position: 'relative'
                }}>

                    {/* Header */}
                    <div style={{
                        padding: '1.5rem 2rem',
                        borderBottom: '1px solid #f3f4f6',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: 'white'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            {branding?.logo_url ? (
                                <img src={branding.logo_url} alt="Logo" style={{ height: '32px' }} />
                            ) : (
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    background: branding?.brand_color || '#4f46e5',
                                    borderRadius: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <FileText size={20} color="white" />
                                </div>
                            )}
                            <div>
                                <h2 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#111827' }}>
                                    {document.name}
                                </h2>
                                <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                                    {(document.file_size / 1024 / 1024).toFixed(2)} MB • {document.file_type}
                                </p>
                            </div>
                        </div>

                        {document.allow_download && (
                            <button
                                onClick={handleDownloadClick}
                                disabled={downloading || isWatermarking}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: (downloading || isWatermarking) ? '#9ca3af' : (branding?.brand_color || '#4f46e5'),
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '10px',
                                    fontWeight: '600',
                                    fontSize: '0.9rem',
                                    cursor: (downloading || isWatermarking) ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    transition: 'all 0.2s',
                                    boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)'
                                }}
                            >
                                {downloading ? 'Downloading...' : isWatermarking ? 'Applying Watermark...' : (
                                    <>
                                        <Download size={18} />
                                        Download File
                                    </>
                                )}
                            </button>
                        )}
                    </div>

                    {/* Snapshot Gate */}
                    {document.require_snapshot && !isSnapshotVerified ? (
                        <div style={{ padding: '4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', minHeight: '400px' }}>
                            <WebcamGate
                                documentName={document.name}
                                onVerified={handleSnapshotSuccess}
                            />
                        </div>
                    ) : (() => {
                        /* Document Preview Area - Determine preview type */
                        const fileExt = getExtension(document.name);
                        const previewType = getPreviewType(fileExt);

                        // Get file icon based on type
                        const getFileIconForType = () => {
                            if (document.is_encrypted) return <LockIcon size={48} color="#4f46e5" />;
                            switch (previewType) {
                                case 'video': return <Video size={48} color="#4f46e5" />;
                                case 'audio': return <Music size={48} color="#4f46e5" />;
                                case 'image': return <ImageIcon size={48} color="#4f46e5" />;
                                default:
                                    if (['xlsx', 'xls', 'csv', 'tsv', 'ods'].includes(fileExt)) return <Table size={48} color="#4f46e5" />;
                                    if (['zip', 'kml', 'kmz'].includes(fileExt)) return <Archive size={48} color="#4f46e5" />;
                                    return <FileText size={48} color="#4f46e5" />;
                            }
                        };

                        // For encrypted files or non-Google Drive storage, show icon
                        // Show inline preview for PDF if watermarked
                        const showInlinePreview = !!watermarkedUrl;

                        return (
                            <div style={{
                                background: '#f8fafc',
                                padding: showInlinePreview ? '2rem' : '4rem 2rem',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                minHeight: '400px',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                <style>
                                    {`
                                        @keyframes float {
                                            0% { transform: translateY(0px) rotate(0deg); }
                                            50% { transform: translateY(-20px) rotate(2deg); }
                                            100% { transform: translateY(0px) rotate(0deg); }
                                        }
                                        @keyframes pulse-glow {
                                            0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.2); }
                                            70% { box-shadow: 0 0 0 20px rgba(99, 102, 241, 0); }
                                            100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
                                        }
                                    `}
                                </style>

                                {/* Inline Preview for supported types */}
                                {showInlinePreview && previewType === 'image' && (
                                    <div style={{ maxWidth: '100%', maxHeight: '500px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}>
                                        <img
                                            src={watermarkedUrl || decryptedUrl || supabase.storage.from('documents').getPublicUrl(document.file_path).data.publicUrl}
                                            alt={document.name}
                                            style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' }}
                                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                        />
                                    </div>
                                )}

                                {showInlinePreview && previewType === 'video' && (
                                    <div style={{ width: '100%', maxWidth: '800px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}>
                                        <video
                                            controls
                                            style={{ width: '100%', maxHeight: '500px' }}
                                            src={decryptedUrl || supabase.storage.from('documents').getPublicUrl(document.file_path).data.publicUrl}
                                        >
                                            Your browser does not support video playback.
                                        </video>
                                    </div>
                                )}

                                {showInlinePreview && previewType === 'audio' && (
                                    <div style={{ width: '100%', maxWidth: '500px', padding: '2rem', background: 'white', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                            <div style={{ padding: '1rem', background: '#f3f4f6', borderRadius: '12px' }}>
                                                <Music size={32} color="#4f46e5" />
                                            </div>
                                            <div>
                                                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827' }}>{document.name}</h3>
                                                <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>Audio File</p>
                                            </div>
                                        </div>
                                        <audio
                                            controls
                                            style={{ width: '100%' }}
                                            src={decryptedUrl || supabase.storage.from('documents').getPublicUrl(document.file_path).data.publicUrl}
                                        >
                                            Your browser does not support audio playback.
                                        </audio>
                                    </div>
                                )}

                                {showInlinePreview && previewType === 'pdf' && (
                                    <div style={{ width: '100%', height: '800px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}>
                                        <iframe
                                            src={watermarkedUrl || decryptedUrl || supabase.storage.from('documents').getPublicUrl(document.file_path).data.publicUrl}
                                            style={{ width: '100%', height: '100%', border: 'none' }}
                                            title={document.name}
                                        />
                                    </div>
                                )}

                                {/* Icon display for non-previewable types */}
                                {!showInlinePreview && (
                                    <div style={{
                                        position: 'relative',
                                        animation: 'float 6s ease-in-out infinite'
                                    }}>
                                        {/* Glow Effect */}
                                        <div style={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            width: '120px',
                                            height: '120px',
                                            background: 'rgba(99, 102, 241, 0.15)',
                                            borderRadius: '50%',
                                            filter: 'blur(20px)',
                                            animation: 'pulse-glow 3s infinite'
                                        }} />

                                        {/* Icon Container */}
                                        <div style={{
                                            width: '100px',
                                            height: '100px',
                                            background: 'white',
                                            borderRadius: '24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                                            position: 'relative',
                                            zIndex: 10,
                                            border: '1px solid #e0e7ff'
                                        }}>
                                            {getFileIconForType()}
                                        </div>

                                        {/* Floating Elements */}
                                        <div style={{
                                            position: 'absolute',
                                            top: -10,
                                            right: -10,
                                            background: '#ecfdf5',
                                            borderRadius: '50%',
                                            padding: '8px',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                            animation: 'float 4s ease-in-out infinite reverse',
                                            zIndex: 11
                                        }}>
                                            <ShieldCheck size={16} color="#059669" />
                                        </div>
                                    </div>
                                )}

                                {/* File type label for non-previewable */}
                                {!showInlinePreview && (
                                    <p style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: '#6b7280', textAlign: 'center' }}>
                                        {document.is_encrypted
                                            ? 'Secure encrypted file - Download to view'
                                            : `${fileExt.toUpperCase()} file - Click download to access`}
                                    </p>
                                )}

                                {/* Decrypting Overlay */}
                                {isDecrypting && (
                                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.8)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 50, backdropFilter: 'blur(4px)' }}>
                                        <div className="animate-spin" style={{ width: '32px', height: '32px', border: '3px solid #e5e7eb', borderTopColor: '#4f46e5', borderRadius: '50%', marginBottom: '1rem' }}></div>
                                        <p style={{ fontWeight: '600', color: '#4f46e5' }}>Decrypting secure content...</p>
                                    </div>
                                )}

                                {/* Missing Key UI */}
                                {document.is_encrypted && !decryptionKey && !isDecrypting && (
                                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.95)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 60, padding: '2rem', textAlign: 'center' }}>
                                        <div style={{ padding: '1.5rem', background: '#fee2e2', borderRadius: '50%', marginBottom: '1.5rem' }}>
                                            <AlertCircle size={48} color="#dc2626" />
                                        </div>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>Encrypted Content</h3>
                                        <p style={{ color: '#6b7280', maxWidth: '300px' }}>This document is encrypted with AES-256. You need the full secure link with the encryption key to view it.</p>
                                    </div>
                                )}
                            </div>
                        );
                    })()}

                    {document.burn_after_reading && (
                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fff7ed', border: '1px solid #ffedd5', borderRadius: '12px', color: '#c2410c', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Flame size={20} />
                            <span><strong>Burn After Reading:</strong> This file will be deleted permanently after the first view/download.</span>
                        </div>
                    )}

                </div>

                {/* Branding Footer */}
                {branding?.site_url && (
                    <a href={branding.site_url} target="_blank" rel="noopener noreferrer" style={{ marginTop: '2rem', color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        Visit {new URL(branding.site_url).hostname} <ArrowRight size={14} />
                    </a>
                )}
            </div>

            {/* Email Gate Modal */}
            {showEmailModal && (
                <div
                    onClick={() => setShowEmailModal(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.5)',
                        backdropFilter: 'blur(4px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999,
                        animation: 'fadeIn 0.2s ease'
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: 'white',
                            borderRadius: '20px',
                            padding: '2.5rem',
                            maxWidth: '440px',
                            width: '90%',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                            animation: 'slideUp 0.3s ease'
                        }}
                    >
                        {/* Modal Header */}
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1rem'
                            }}>
                                <Mail size={28} color="white" />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>
                                Enter your email to download
                            </h3>
                            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                Please provide your email address to proceed with the download
                            </p>
                        </div>

                        {/* Email Form */}
                        <form onSubmit={handleReceiverEmailSubmit}>
                            <input
                                type="email"
                                value={receiverEmail}
                                onChange={(e) => setReceiverEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                autoFocus
                                style={{
                                    width: '100%',
                                    padding: '0.875rem 1rem',
                                    borderRadius: '12px',
                                    border: '2px solid #e5e7eb',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    transition: 'border-color 0.2s',
                                    marginBottom: '1rem',
                                    boxSizing: 'border-box'
                                }}
                                onFocus={(e) => e.currentTarget.style.borderColor = '#4f46e5'}
                                onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                            />
                            <button
                                type="submit"
                                style={{
                                    width: '100%',
                                    padding: '0.875rem',
                                    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontWeight: '700',
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    transition: 'all 0.2s',
                                    boxShadow: '0 4px 14px -3px rgba(79, 70, 229, 0.4)'
                                }}
                            >
                                <Download size={18} />
                                Download File
                            </button>
                        </form>

                        {/* Cancel */}
                        <button
                            onClick={() => setShowEmailModal(false)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                background: 'transparent',
                                color: '#6b7280',
                                border: 'none',
                                borderRadius: '10px',
                                fontWeight: '500',
                                fontSize: '0.875rem',
                                cursor: 'pointer',
                                marginTop: '0.5rem',
                                transition: 'color 0.2s'
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Modal animations */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </div>
    );
};
export default ViewDocument;
