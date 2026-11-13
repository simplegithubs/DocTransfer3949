import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useUser, useAuth } from './components/auth';
import { supabase, createSupabaseClient, getSafeSupabaseToken } from './lib/supabase';
import {
    ArrowLeft,
    Upload,
    FileText,
    Link as LinkIcon,
    Lock,
    Calendar,
    Download,
    Globe,
    Copy,
    Check,
    Eye,
    BarChart2,
    Mail,
    Image as ImageIcon,
    UserPlus,
    Flame,
    Settings,
    Clock,
    Minus,
    Plus,
    Shield,
    Sparkles,
    Loader2,
    MessageCircle,
    Smartphone,
    Scale,
    FileLock,
    FolderLock,
    CopyCheck,
    ShieldAlert,
    Ban,
    Bell,
    Folder,
    FolderOpen,
    MapPin,
    X
} from 'lucide-react';
import ActiveSessionsManager from './components/ActiveSessionsManager';
import Skeleton from './components/ui/Skeleton';
import { hashPassword, generateSecureToken } from './lib/security';
import { encryptFile, generateEncryptionKey } from './lib/encryption';
import AnalyticsDashboard from './components/analytics/AnalyticsDashboard';
import DashboardAnimation from './components/DashboardAnimation';
import AuditTrail from './components/AuditTrail';
import TemplatesDashboard from './components/templates/TemplatesDashboard';

import { logDocumentUpload } from './lib/auditLogger';
import useSubscription from './hooks/useSubscription';
import PremiumBadge from './components/PremiumBadge';
import UpgradeModal from './components/UpgradeModal';
import UsageLimitBanner from './components/UsageLimitBanner';
import { formatWhatsAppShareUrl, formatRealEstateWhatsAppShareUrl, buildShareUrl } from './lib/shareUrl';
import TrialTrackingBar from './components/TrialTrackingBar';
import SelfDestructSettings from './components/SelfDestructSettings';
import SEO from './components/SEO';
import { BASE_URL } from './lib/seo';
import { getComplianceSettings } from './hooks/useComplianceSettings';

interface Document {
    id: string;
    name: string;
    size: string;
    type: string;
    uploadedAt: string;
    link: string;
    file_path: string;
    settings: {
        password: string;
        expiresAt: string;
        allowDownload: boolean;
        customDomain: string;
    };
    watermark_config?: WatermarkConfig;
}

interface WatermarkConfig {
    text: string;
    color: string;
    opacity: number;
    fontSize: number;
    rotation: number;
    layout: 'single' | 'tiled';
    require_nda?: boolean;
    nda_type?: 'standard' | 'real_estate' | 'hotel_mna' | 'startup';
    strict_drm?: boolean;
    allowed_countries?: string[];
    lead_alerts?: {
        notify_on_open?: boolean;
        notify_on_dwell?: boolean;
    };
    category?: 'legal' | 'financials' | 'asset' | 'teasers' | string;
}

const GEOPROTECTION_COUNTRIES = [
    { code: 'AE', label: 'UAE 🇦🇪' },
    { code: 'GB', label: 'UK 🇬🇧' },
    { code: 'US', label: 'USA 🇺🇸' },
    { code: 'SG', label: 'Singapore 🇸🇬' },
    { code: 'FR', label: 'France 🇫🇷' },
    { code: 'DE', label: 'Germany 🇩🇪' },
    { code: 'CH', label: 'Switzerland 🇨🇭' },
    { code: 'IN', label: 'India 🇮🇳' },
];

const VDR_CATEGORIES = [
    { id: 'all', label: '📂 All Documents' },
    { id: 'legal', label: '⚖️ 01_Legal & M&A' },
    { id: 'financials', label: '📊 02_Financial Models' },
    { id: 'asset', label: '🏢 03_Asset Diligence & Deeds' },
    { id: 'teasers', label: '🚀 04_Teasers & Pitch Decks' },
];

const PHONE_COUNTRY_CODES = [
    { code: '+971', flag: '🇦🇪', label: 'UAE (+971)' },
    { code: '+44', flag: '🇬🇧', label: 'UK (+44)' },
    { code: '+1', flag: '🇺🇸', label: 'USA/CA (+1)' },
    { code: '+65', flag: '🇸🇬', label: 'Singapore (+65)' },
    { code: '+33', flag: '🇫🇷', label: 'France (+33)' },
    { code: '+91', flag: '🇮🇳', label: 'India (+91)' },
];

const DataRoom: React.FC = () => {
    const { user } = useUser();
    const { getToken } = useAuth();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [activeTab, setActiveTab] = useState<'upload' | 'documents' | 'analytics' | 'audit' | 'templates'>('upload');
    const [selectedDocumentId, setSelectedDocumentId] = useState<string | undefined>(undefined);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const useTemplate = searchParams.get('useTemplate');
        if (useTemplate) {
            setActiveTab('templates');
        }
    }, [searchParams]);


    const [selectedFiles, setSelectedFiles] = useState<File[]>([]); // Changed to array
    const [uploadedDoc, setUploadedDoc] = useState<Document | null>(null);
    const [uploadedBundleLink, setUploadedBundleLink] = useState<string | null>(null); // New state for bundle link
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadProgressStage, setUploadProgressStage] = useState('Preparing file...');
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isLoadingDocs, setIsLoadingDocs] = useState(true);

    // Settings State - Pre-populated with User's RERA Compliance & Agency Defaults
    const complianceDefaults = getComplianceSettings();
    const [passwordProtection, setPasswordProtection] = useState(false);
    const [linkExpiration, setLinkExpiration] = useState(complianceDefaults.default_expiry_days > 0);
    const [allowDownloads, setAllowDownloads] = useState(!complianceDefaults.default_prevent_download);
    const [password, setPassword] = useState('');
    const [expiresAt, setExpiresAt] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() + (complianceDefaults.default_expiry_days || 7));
        return d.toISOString().split('T')[0];
    });
    const [emailVerification, setEmailVerification] = useState(false);
    const [allowedEmail, setAllowedEmail] = useState('');
    const [requirePhoneOtp, setRequirePhoneOtp] = useState(false);
    const [allowedPhone, setAllowedPhone] = useState('');
    const [allowedPhoneCountryCode, setAllowedPhoneCountryCode] = useState('+971');
    const [applyWatermark, setApplyWatermark] = useState(false);
    const [watermarkConfig, setWatermarkConfig] = useState<WatermarkConfig>({
        text: 'CONFIDENTIAL • FOR {{email}} • IP: {{ip}}',
        color: '#000000',
        opacity: 0.3,
        fontSize: 24,
        rotation: -45,
        layout: 'tiled'
    });

    const [expirationMode, setExpirationMode] = useState<'date' | 'duration'>('duration');
    const [durationValue, setDurationValue] = useState(complianceDefaults.default_expiry_days || 7);
    const [durationUnit, setDurationUnit] = useState<'hours' | 'days' | 'weeks'>('days');

    const [maxViewsEnabled, setMaxViewsEnabled] = useState(false);
    const [maxViews, setMaxViews] = useState(1);
    const [aesEncryptionEnabled, setAesEncryptionEnabled] = useState(false);

    // High-Demand Phase 1 Features: Sector Presets, NDA Gate, Strict DRM, Custom Slug
    const [activePreset, setActivePreset] = useState<'dubai_re' | 'hotel_mna' | 'startup' | 'pe_finance' | null>(null);
    const [requireNda, setRequireNda] = useState(false);
    const [ndaType, setNdaType] = useState<'standard' | 'real_estate' | 'hotel_mna' | 'startup'>('standard');
    const [strictDrm, setStrictDrm] = useState(false);
    const [customSlug, setCustomSlug] = useState('');
    const [copiedMemo, setCopiedMemo] = useState(false);

    // Advanced VDR Phase 2 States: Sessions Modal, Geo-Fencing, Real-Time Lead Alerts, Folder Filter
    const [sessionManagerDoc, setSessionManagerDoc] = useState<{ id: string; name: string } | null>(null);
    const [geoFencingEnabled, setGeoFencingEnabled] = useState(false);
    const [allowedCountries, setAllowedCountries] = useState<string[]>(['AE', 'GB', 'US', 'SG']);
    const [notifyOnOpen, setNotifyOnOpen] = useState(true);
    const [notifyOnDwell, setNotifyOnDwell] = useState(true);
    const [selectedVdrCategory, setSelectedVdrCategory] = useState<string>('all');
    const [uploadCategory, setUploadCategory] = useState<'legal' | 'financials' | 'asset' | 'teasers'>('legal');

    const toggleAllowedCountry = (code: string) => {
        setAllowedCountries(prev =>
            prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
        );
    };

    const applySectorPreset = (preset: 'dubai_re' | 'hotel_mna' | 'startup' | 'pe_finance') => {
        setActivePreset(preset);
        if (preset === 'dubai_re') {
            setRequirePhoneOtp(true);
            setAllowedPhoneCountryCode('+971');
            setApplyWatermark(true);
            setWatermarkConfig(prev => ({
                ...prev,
                text: 'CONFIDENTIAL • DUBAI LUXURY ASSET • VIEWED BY {{phone}} • IP: {{ip}}',
                layout: 'tiled',
                opacity: 0.18
            }));
            setAllowDownloads(false);
            setStrictDrm(true);
            setRequireNda(false);
            setGeoFencingEnabled(true);
            setAllowedCountries(['AE', 'GB', 'US', 'SG']);
            setUploadCategory('asset');
            setLinkExpiration(true);
            setDurationValue(14);
            setDurationUnit('days');
        } else if (preset === 'hotel_mna') {
            setRequireNda(true);
            setNdaType('hotel_mna');
            setEmailVerification(true);
            setApplyWatermark(true);
            setWatermarkConfig(prev => ({
                ...prev,
                text: 'STRICTLY CONFIDENTIAL • FOR M&A ACQUISITION REVIEW ONLY • {{email}}',
                layout: 'tiled',
                opacity: 0.16
            }));
            setAllowDownloads(false);
            setStrictDrm(true);
            setGeoFencingEnabled(true);
            setAllowedCountries(['AE', 'GB', 'US', 'FR', 'DE', 'CH']);
            setUploadCategory('legal');
            setLinkExpiration(true);
            setDurationValue(30);
            setDurationUnit('days');
        } else if (preset === 'startup') {
            setEmailVerification(true);
            setRequireNda(true);
            setNdaType('startup');
            setApplyWatermark(true);
            setWatermarkConfig(prev => ({
                ...prev,
                text: 'CONFIDENTIAL PITCH DECK • FOR {{email}} • DO NOT CIRCULATE',
                layout: 'tiled',
                opacity: 0.18
            }));
            setAllowDownloads(false);
            setStrictDrm(true);
            setGeoFencingEnabled(false);
            setUploadCategory('teasers');
            setLinkExpiration(true);
            setDurationValue(21);
            setDurationUnit('days');
        } else if (preset === 'pe_finance') {
            setAesEncryptionEnabled(true);
            setPasswordProtection(true);
            setRequirePhoneOtp(true);
            setAllowedPhoneCountryCode('+971');
            setRequireNda(true);
            setNdaType('standard');
            setApplyWatermark(true);
            setWatermarkConfig(prev => ({
                ...prev,
                text: 'INSTITUTIONAL DUE DILIGENCE • {{email}} • {{phone}} • {{date}}',
                layout: 'tiled',
                opacity: 0.2
            }));
            setAllowDownloads(false);
            setStrictDrm(true);
            setGeoFencingEnabled(true);
            setAllowedCountries(['AE', 'GB', 'US', 'SG', 'CH', 'DE']);
            setUploadCategory('financials');
            setLinkExpiration(true);
            setDurationValue(7);
            setDurationUnit('days');
        }
    };

    const copyWhatsAppDealMemo = (link: string, docName: string) => {
        const memo = `👋 Confidential Deal Memo\n\n📄 Document: ${docName}\n🔗 Secure Link: ${link}\n\n🔒 Protected with DocTransfer (Anti-Leak Watermarking, NDA Gate & Audit Telemetry Enforced).`;
        navigator.clipboard.writeText(memo);
        setCopiedMemo(true);
        setTimeout(() => setCopiedMemo(false), 2500);
    };


    // Subscription and premium features
    const { subscription, usage, dailyUploadCount, yearlyUploadCount, activeDocCount, monthlyUploadCount, isLoading: subLoading, isFeatureLocked, getRemainingUploads, getMaxFileSize, refreshSubscription } = useSubscription();
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [lockedFeatureName, setLockedFeatureName] = useState<string | undefined>();

    // Create preview URL when file is selected - Adjusted for multiple files (preview first one)
    useEffect(() => {
        if (selectedFiles.length > 0) {
            const objectUrl = URL.createObjectURL(selectedFiles[0]);
            setFilePreview(objectUrl);

            // Cleanup function to revoke object URL
            return () => {
                URL.revokeObjectURL(objectUrl);
            };
        } else {
            setFilePreview(null);
        }
    }, [selectedFiles]);



    useEffect(() => {
        fetchDocuments();
        refreshSubscription(); // Refresh counts on load
    }, []);

    const fetchDocuments = async () => {
        setIsLoadingDocs(true);
        try {
            const token = await getSafeSupabaseToken(getToken);
            const authenticatedSupabase = createSupabaseClient(token || undefined);

            let query = authenticatedSupabase
                .from('documents')
                .select('*')
                .order('created_at', { ascending: false });

            // Filter by user if authenticated
            if (user) {
                query = query.eq('user_id', user.id);
            }

            const { data, error } = await query;

            if (error) throw error;

            if (data) {
                const formattedDocs: Document[] = data.map(doc => ({
                    id: doc.id,
                    name: doc.name,
                    size: (doc.file_size / 1024).toFixed(2) + ' KB',
                    type: doc.file_type,
                    uploadedAt: new Date(doc.created_at).toLocaleDateString(),
                    link: `${window.location.origin}/view/${doc.share_link}`,
                    file_path: doc.file_path,
                    settings: {
                        password: doc.password || '',
                        expiresAt: doc.expires_at || '',
                        allowDownload: doc.allow_download,
                        customDomain: doc.custom_domain || '',
                    },
                    watermark_config: doc.watermark_config
                }));
                setDocuments(formattedDocs);
            }
        } catch (error) {
            console.error('Error fetching documents:', error);
        } finally {
            setIsLoadingDocs(false);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            handleFileSelection(files);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFileSelection(Array.from(e.target.files));
            e.target.value = ''; // Reset to allow re-selection
        }
    };

    const handleFileSelection = (files: File[]) => {
        setUploadError(null);
        const isFree = !subscription || subscription.plan_type === 'free';

        // 1. Plan-based Bundling Check (Free plan allows only 1 file per upload)
        if (files.length > 1 && (isFree || isFeatureLocked('document_bundles'))) {
            setSelectedFiles([files[0]]);
            setUploadError("Multi-file document bundling is a Pro feature. Free plan allows 1 file per upload. Please upgrade to Pro to bundle multiple files.");
            handleLockedFeatureClick('Document Bundles');
            return;
        }

        // 2. Active Documents / Link Limits Check (5 active document links for Free)
        const remaining = getRemainingUploads();
        if (isFree && (remaining <= 0 || files.length > remaining)) {
            setUploadError(`Free tier limit reached (5 active document links). You currently have ${activeDocCount || 0} active links. Please delete an existing document or upgrade to Pro for 100 links/month.`);
            handleLockedFeatureClick('Unlimited Uploads');
            setSelectedFiles([]);
            return;
        }

        // 3. Strict File Size Validation (Immediate pre-upload rejection)
        const maxSizeBytes = getMaxFileSize();
        const oversizeFiles = files.filter(f => f.size > maxSizeBytes);
        if (oversizeFiles.length > 0) {
            const formatMb = (bytes: number) => (bytes / (1024 * 1024)).toFixed(0);
            const planName = subscription?.plan_type ? subscription.plan_type.toUpperCase() : 'FREE';
            const firstOversize = oversizeFiles[0];
            const fileSizeMb = (firstOversize.size / (1024 * 1024)).toFixed(1);
            setUploadError(
                `File too large. Your ${planName} plan allows up to ${formatMb(maxSizeBytes)} MB per file. ` +
                `Selected file "${firstOversize.name}" is ${fileSizeMb} MB. ` +
                `Please upgrade to Pro (50MB) or Business (250MB) for larger uploads.`
            );
            setSelectedFiles([]);
            handleLockedFeatureClick('File Size Limit');
            return;
        }

        setSelectedFiles(files);
        setUploadedDoc(null);
        setUploadedBundleLink(null);
        setUploadError(null);
        setFilePreview(null); // Will be set by useEffect
    };


    const handleUpload = async () => {
        if (selectedFiles.length === 0) return;

        // Check overall limits first
        const remainingUploads = getRemainingUploads();
        const isFree = !subscription || subscription.plan_type === 'free';
        if (isFree && (remainingUploads <= 0 || selectedFiles.length > remainingUploads)) {
            setUploadError(`Free tier limit reached (5 active document links). You currently have ${activeDocCount || 0} active links. Please delete an existing document or upgrade to Pro for 100 links/month.`);
            handleLockedFeatureClick('Unlimited Uploads');
            return;
        }

        // Check file sizes
        const maxSizeBytes = getMaxFileSize();
        const oversizeFiles = selectedFiles.filter(f => f.size > maxSizeBytes);
        if (oversizeFiles.length > 0) {
            const formatSize = (bytes: number) => (bytes / (1024 * 1024)).toFixed(0);
            const planName = subscription?.plan_type ? subscription.plan_type.toUpperCase() : 'FREE';
            setUploadError(`File too large. Your ${planName} plan allows up to ${formatSize(maxSizeBytes)} MB per file. The following files are too large: ${oversizeFiles.map(f => `${f.name} (${(f.size / (1024 * 1024)).toFixed(1)}MB)`).join(', ')}`);
            handleLockedFeatureClick('File Size Limit');
            return;
        }

        if (selectedFiles.length > 1 && isFeatureLocked('document_bundles')) {
            handleLockedFeatureClick('Document Bundles');
            return;
        }

        setIsUploading(true);
        setUploadProgress(15);
        setUploadProgressStage('Preparing file & initial security handshake...');
        setUploadError(null);

        const progressInterval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev < 85) return prev + Math.floor(Math.random() * 6 + 2);
                return prev;
            });
        }, 180);

        const isEncrypted = aesEncryptionEnabled;
        const encryptionKey = isEncrypted ? generateEncryptionKey() : null;

        try {
            const token = await getSafeSupabaseToken(getToken);
            const authenticatedSupabase = createSupabaseClient(token || undefined);

            console.log('=== UPLOAD DEBUG START ===');
            console.log(`Selected ${selectedFiles.length} files`);


            // --- BUNDLE CREATION (if > 1 file) ---
            let bundleId: string | null = null;
            let bundleShareLink: string | null = null;

            if (selectedFiles.length > 1) {
                setUploadProgressStage('Configuring secure document bundle...');
                // Generates friendly name e.g. "Contract.pdf and 2 others"
                const bundleName = `${selectedFiles[0].name} and ${selectedFiles.length - 1} others`;
                bundleShareLink = generateSecureToken(12);

                const { data: bundleData, error: bundleError } = await authenticatedSupabase
                    .from('document_bundles')
                    .insert({
                        name: bundleName,
                        share_link: bundleShareLink,
                        user_id: user?.id || null,
                        password: passwordProtection ? await hashPassword(password) : null,
                        expires_at: (linkExpiration && !isFeatureLocked?.('link_expiration')) ? (
                            expirationMode === 'date' ? expiresAt : new Date(Date.now() + durationValue * (durationUnit === 'hours' ? 3600000 : durationUnit === 'days' ? 86400000 : 604800000)).toISOString()
                        ) : null,
                        require_email_verification: emailVerification && !isFeatureLocked?.('email_verification'),
                        allowed_email: (emailVerification && !isFeatureLocked?.('email_verification')) ? allowedEmail : null
                    })
                    .select('id')
                    .single();

                if (bundleError) throw new Error(`Failed to create bundle: ${bundleError.message}`);
                bundleId = bundleData.id;
                console.log('Bundle created:', bundleId);
            }

            // --- FILE UPLOAD LOOP ---
            const uploadedDocs: Document[] = [];

            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i];
                console.log('Processing file:', file.name);

                // 2. Generate unique file path
                const timestamp = Date.now();
                const randomString = Math.random().toString(36).substring(7);
                const filePath = `uploads/${file.name}_${timestamp}_${randomString}`;
                const sanitizedFilePath = filePath.replace(/[^a-zA-Z0-9._/-]/g, '_');

                console.log('Uploading to path:', sanitizedFilePath);

                // 3. Encrypt if enabled
                let fileToUpload: File | Blob = file;
                let encryptionIv: string | null = null;

                if (isEncrypted && encryptionKey) {
                    setUploadProgressStage(`Encrypting ${file.name} with AES-256...`);
                    console.log('Encrypting file...');
                    const { encryptedBlob, iv } = await encryptFile(file, encryptionKey);
                    fileToUpload = encryptedBlob;
                    encryptionIv = iv;
                } else {
                    setUploadProgressStage(`Uploading ${file.name} to cloud storage...`);
                }

                // 4. Upload to Supabase storage
                const { error: uploadError } = await authenticatedSupabase.storage
                    .from('documents')
                    .upload(sanitizedFilePath, fileToUpload, {
                        cacheControl: '3600',
                        upsert: false
                    });

                if (uploadError) {
                    console.error('✗ Storage upload error:', uploadError);
                    if (uploadError.message?.includes('fetch') || uploadError.message?.includes('CORS')) {
                        throw new Error(`CORS Error: Your Supabase project is blocking requests from localhost.`);
                    }
                    if (uploadError.message?.includes('Bucket not found')) {
                        throw new Error(`Storage bucket 'documents' not found. Please run the SQL script in MASTER_SETUP.sql in your Supabase SQL Editor to fix this.`);
                    }
                    throw new Error(`Storage upload failed for ${file.name}: ${uploadError.message}`);
                }

                setUploadProgressStage('Creating access controls & tracking rules...');
                let docShareLink = generateSecureToken(12);
                if (customSlug.trim()) {
                    const cleanSlug = customSlug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-').replace(/-+/g, '-');
                    if (cleanSlug.length >= 3) {
                        docShareLink = cleanSlug;
                    }
                }

                // 4. Save document metadata to database
                const documentPayload: Record<string, any> = {
                    name: file.name,
                    file_path: sanitizedFilePath,
                    file_size: file.size,
                    file_type: file.type,
                    share_link: docShareLink,
                    bundle_id: bundleId, // Link to bundle if exists

                    // Inherit settings from UI (strictly gated by plan entitlements)
                    allow_download: allowDownloads,
                    password: passwordProtection ? await hashPassword(password) : null,
                    expires_at: (linkExpiration && !isFeatureLocked?.('link_expiration')) ? (
                        expirationMode === 'date' ? expiresAt : new Date(Date.now() + durationValue * (durationUnit === 'hours' ? 3600000 : durationUnit === 'days' ? 86400000 : 604800000)).toISOString()
                    ) : null,
                    custom_domain: null,
                    email_verification: emailVerification && !isFeatureLocked?.('email_verification'),
                    allowed_email: (emailVerification && !isFeatureLocked?.('email_verification')) ? allowedEmail : null,
                    apply_watermark: applyWatermark && !isFeatureLocked?.('watermarking'),
                    watermark_config: {
                        ...(applyWatermark && !isFeatureLocked?.('watermarking') ? watermarkConfig : {
                            text: 'CONFIDENTIAL',
                            color: '#000000',
                            opacity: 0.15,
                            fontSize: 24,
                            rotation: -45,
                            layout: 'tiled' as const
                        }),
                        require_nda: requireNda,
                        nda_type: ndaType,
                        strict_drm: strictDrm,
                        allowed_countries: geoFencingEnabled && allowedCountries.length > 0 ? allowedCountries : undefined,
                        lead_alerts: {
                            notify_on_open: notifyOnOpen,
                            notify_on_dwell: notifyOnDwell
                        },
                        category: uploadCategory
                    },
                    max_views: (maxViewsEnabled && !isFeatureLocked?.('burn_after_reading')) ? maxViews : null,
                    burn_after_reading: maxViewsEnabled && !isFeatureLocked?.('burn_after_reading'),

                    // Encryption / Vault Fields
                    is_vault_file: false,
                    is_encrypted: isEncrypted,
                    encryption_key: null, // Stored in URL hash only
                    encryption_iv: encryptionIv,

                    original_file_name: file.name,
                    original_file_type: file.type,
                    user_id: user?.id || null,
                    scan_status: 'pending'
                };

                // Include phone OTP gate if enabled and unlocked
                if (requirePhoneOtp && !isFeatureLocked?.('phone_otp')) {
                    documentPayload.require_phone_otp = true;
                    if (allowedPhone.trim()) {
                        const cleanDigits = allowedPhone.trim().replace(/[^0-9]/g, '');
                        documentPayload.allowed_phone = `${allowedPhoneCountryCode}${cleanDigits}`;
                    }
                }

                let { data: docData, error: dbError } = await authenticatedSupabase
                    .from('documents')
                    .insert(documentPayload)
                    .select()
                    .single();

                // Graceful fallback: If require_phone_otp is missing in the schema cache, retry without it
                if (dbError && dbError.message?.includes('require_phone_otp')) {
                    console.warn("Database missing 'require_phone_otp' column, retrying insert without it...");
                    delete documentPayload.require_phone_otp;
                    const retryResult = await authenticatedSupabase
                        .from('documents')
                        .insert(documentPayload)
                        .select()
                        .single();
                    docData = retryResult.data;
                    dbError = retryResult.error;
                }

                if (dbError) throw new Error(`Database save failed for ${file.name}: ${dbError.message}`);

                // Construct Link for this doc
                let finalLink = `${window.location.origin}/view/${docShareLink}`;
                if (isEncrypted && encryptionKey) {
                    finalLink += `#key=${encryptionKey}`;
                }

                uploadedDocs.push({
                    id: docData.id,
                    name: file.name,
                    size: (file.size / 1024).toFixed(2) + ' KB',
                    type: file.type,
                    uploadedAt: new Date().toLocaleDateString(),
                    link: finalLink,
                    file_path: sanitizedFilePath,
                    settings: {
                        password: passwordProtection ? 'protected' : '',
                        expiresAt: linkExpiration ? expiresAt : '',
                        allowDownload: allowDownloads,
                        customDomain: ''
                    }
                });

                // Log audit event
                await logDocumentUpload(docData.id, file.name, file.size, {
                    metadata: {
                        passwordProtected: passwordProtection,
                        bundleId: bundleId
                    }
                });
            } // End Loop

            console.log('All files uploaded successfully');
            setUploadProgressStage('Finalizing shareable link...');
            clearInterval(progressInterval);
            setUploadProgress(95);

            // Set state based on Single vs Bundle
            if (bundleId && bundleShareLink) {
                let finalBundleLink = `${window.location.origin}/view/${bundleShareLink}`;
                if (isEncrypted && encryptionKey) {
                    finalBundleLink += `#key=${encryptionKey}`;
                }
                setUploadedBundleLink(finalBundleLink);
                setUploadedDoc(uploadedDocs[0]); // Just to trigger "Success" UI if it relies on this
            } else {
                setUploadedDoc(uploadedDocs[0]);
                setUploadedBundleLink(null);
            }

            refreshSubscription(); // Refresh daily limit count

            // Update subscription usage
            if (user?.id) {
                const currentMonth = new Date().toISOString().slice(0, 7) + '-01';
                const totalSizeBytes = selectedFiles.reduce((acc, file) => acc + file.size, 0);

                const { data: currentUsage } = await authenticatedSupabase
                    .from('subscription_usage')
                    .select('*')
                    .eq('user_id', user.id)
                    .eq('month', currentMonth)
                    .single();

                if (currentUsage) {
                    await authenticatedSupabase
                        .from('subscription_usage')
                        .update({
                            documents_uploaded: currentUsage.documents_uploaded + uploadedDocs.length,
                            storage_used: currentUsage.storage_used + totalSizeBytes
                        })
                        .eq('id', currentUsage.id);
                } else {
                    await authenticatedSupabase
                        .from('subscription_usage')
                        .insert({
                            user_id: user.id,
                            month: currentMonth,
                            documents_uploaded: uploadedDocs.length,
                            storage_used: totalSizeBytes
                        });
                }
            }


            setDocuments(prev => [...uploadedDocs, ...prev]);
            setSelectedFiles([]);

            setUploadProgress(100);
            setUploadProgressStage('Secure link ready!');
            await new Promise(res => setTimeout(res, 400));

        } catch (error: any) {
            clearInterval(progressInterval);
            console.error('Upload error:', error);
            const errorMessage = error.message || 'Upload failed';
            setUploadError(errorMessage);
        } finally {
            clearInterval(progressInterval);
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const copyLink = (link: string) => { // Modified to accept any link
        navigator.clipboard.writeText(link);
        setCopiedId('link');
        setTimeout(() => setCopiedId(null), 2000);
    };

    const shareOnWhatsApp = (link: string, title?: string, isRealEstate = false) => {
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        let targetUrl = link;
        if (isLocalhost && link.includes('localhost')) {
            const sharePath = new URL(link).pathname;
            targetUrl = buildShareUrl(sharePath, true);
        }
        if (isRealEstate) {
            window.open(formatRealEstateWhatsAppShareUrl({ url: targetUrl, projectName: title }), '_blank');
        } else {
            window.open(formatWhatsAppShareUrl(targetUrl, title), '_blank');
        }
    };

    const handlePreview = async () => {
        if (!uploadedDoc) return;

        try {
            const token = await getSafeSupabaseToken(getToken);
            const authenticatedSupabase = createSupabaseClient(token || undefined);

            // Get public URL from Supabase storage
            const { data } = authenticatedSupabase.storage
                .from('documents')
                .getPublicUrl(uploadedDoc.file_path);

            if (data?.publicUrl) {
                setPreviewUrl(data.publicUrl);
                setShowPreviewModal(true);
            }
        } catch (error) {
            console.error('Error loading preview:', error);
        }
    };

    const handleLockedFeatureClick = (featureName: string) => {
        setLockedFeatureName(featureName);
        setShowUpgradeModal(true);
    };

    return (
        <div style={{ background: '#f9fafb', minHeight: '100vh' }}>
            <SEO 
                title="Dashboard — Manage Your Secure Documents" 
                description="Upload, manage, and track your secure documents. View real-time analytics and audit trails."
                url={`${BASE_URL}/dataroom`}
            />
            {/* Header */}
            <header style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '1.5rem 2rem' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <button
                                onClick={() => navigate('/dashboard')}
                                style={{
                                    padding: '0.625rem',
                                    background: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    color: '#374151',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                                title="Back to Command Center"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <div>
                                <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.35rem' }}>Virtual Data Room & Diligence Vault</h1>
                                <p style={{ fontSize: '0.92rem', color: '#64748b', margin: 0 }}>Institutional multi-party document hierarchy, Chinese walls, and forensic audit logs.</p>
                            </div>
                        </div>

                    </div>

                    {/* Trial Banner */}
                    {subscription?.trial_end && subscription?.status !== 'active' && (
                        <div style={{ marginBottom: '2rem' }}>
                            {new Date(subscription.trial_end) > new Date() ? (
                                <div style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', border: '1px solid #bae6fd', borderRadius: '12px', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ background: '#3b82f6', color: 'white', padding: '0.5rem', borderRadius: '50%' }}>
                                            <Clock size={20} />
                                        </div>
                                        <div>
                                            <h4 style={{ margin: 0, color: '#0369a1', fontSize: '1rem', fontWeight: 600 }}>Your Free Trial is Active</h4>
                                            <p style={{ margin: 0, color: '#0284c7', fontSize: '0.875rem' }}>
                                                You have {Math.ceil((new Date(subscription.trial_end).getTime() - new Date().getTime()) / (1000 * 3600 * 24))} days remaining in your trial.
                                            </p>
                                        </div>
                                    </div>
                                    <button onClick={() => navigate('/pricing')} style={{ padding: '0.5rem 1rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                                        Upgrade Now
                                    </button>
                                </div>
                            ) : (
                                <div style={{ background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)', border: '1px solid #fecaca', borderRadius: '12px', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ background: '#ef4444', color: 'white', padding: '0.5rem', borderRadius: '50%' }}>
                                            <Flame size={20} />
                                        </div>
                                        <div>
                                            <h4 style={{ margin: 0, color: '#991b1b', fontSize: '1rem', fontWeight: 600 }}>Your Free Trial has Expired</h4>
                                            <p style={{ margin: 0, color: '#b91c1c', fontSize: '0.875rem' }}>
                                                Your account has been downgraded to the Free plan. Upgrade to regain access to premium features.
                                            </p>
                                        </div>
                                    </div>
                                    <button onClick={() => navigate('/pricing')} style={{ padding: '0.5rem 1rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                                        View Plans
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* VDR Diligence Status Strip */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '16px',
                        padding: '1rem 1.5rem',
                        marginBottom: '1.75rem',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                        flexWrap: 'wrap',
                        gap: '1rem'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                                width: '42px',
                                height: '42px',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <FolderLock size={22} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                                    Enterprise Diligence Vault Status
                                </h3>
                                <p style={{ margin: '0.15rem 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                                    Zero-knowledge AES-256 client vault • Multi-party bidder isolation • Bates numbering ready
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <button
                                onClick={() => navigate('/dashboard')}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '8px',
                                    background: '#eef2ff',
                                    color: '#4338ca',
                                    border: '1px solid #c7d2fe',
                                    fontSize: '0.82rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem'
                                }}
                            >
                                <ArrowLeft size={15} /> Back to Overview
                            </button>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div style={{ display: 'flex', gap: '0.5rem', background: '#f3f4f6', padding: '0.5rem', borderRadius: '12px', width: 'fit-content' }}>
                        <button onClick={() => navigate('/dashboard')} style={{ padding: '0.625rem 1.25rem', background: 'transparent', color: '#4338ca', border: 'none', borderRadius: '8px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                            <ArrowLeft size={16} /> Overview
                        </button>

                        <button onClick={() => setActiveTab('upload')} style={{ padding: '0.625rem 1.5rem', background: activeTab === 'upload' ? '#8b5cf6' : 'transparent', color: activeTab === 'upload' ? 'white' : '#6b7280', border: 'none', borderRadius: '8px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                            <Upload size={16} /> Upload
                        </button>

                        <button onClick={() => setActiveTab('documents')} style={{ padding: '0.625rem 1.5rem', background: activeTab === 'documents' ? '#8b5cf6' : 'transparent', color: activeTab === 'documents' ? 'white' : '#6b7280', border: 'none', borderRadius: '8px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                            <FileText size={16} /> Documents
                        </button>
                        <button onClick={() => {
                            if (isFeatureLocked('advanced_analytics')) {
                                handleLockedFeatureClick('Advanced Analytics');
                            } else {
                                setActiveTab('analytics');
                            }
                        }} style={{ padding: '0.625rem 1.5rem', background: activeTab === 'analytics' ? '#8b5cf6' : 'transparent', color: activeTab === 'analytics' ? 'white' : '#6b7280', border: 'none', borderRadius: '8px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                            <BarChart2 size={16} /> Analytics
                            {isFeatureLocked('advanced_analytics') && <Lock size={14} />}
                        </button>
                        <button onClick={() => {
                            if (isFeatureLocked('audit_trails')) {
                                handleLockedFeatureClick('Audit Trail');
                            } else {
                                setActiveTab('audit');
                            }
                        }} style={{ padding: '0.625rem 1.5rem', background: activeTab === 'audit' ? '#8b5cf6' : 'transparent', color: activeTab === 'audit' ? 'white' : '#6b7280', border: 'none', borderRadius: '8px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                            <Shield size={16} /> Audit Trail
                            {isFeatureLocked('audit_trails') && <Lock size={14} />}
                        </button>

                        <button onClick={() => setActiveTab('templates')} style={{ padding: '0.625rem 1.5rem', background: activeTab === 'templates' ? '#8b5cf6' : 'transparent', color: activeTab === 'templates' ? 'white' : '#6b7280', border: 'none', borderRadius: '8px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                            <Sparkles size={16} /> Templates
                        </button>

                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
                {activeTab === 'templates' ?
                    <TemplatesDashboard 
                        initialTemplateId={searchParams.get('useTemplate') || undefined}
                        onBackToDocuments={() => { setActiveTab('documents'); fetchDocuments(); }} 
                    />
                : activeTab === 'analytics' ?
                    (isFeatureLocked('advanced_analytics') ? (
                        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', maxWidth: '800px', margin: '2rem auto' }}>
                            <Lock size={48} color="#6366f1" style={{ margin: '0 auto 1.5rem' }} />
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>Forensic Heatmaps & Analytics is a Pro Feature</h2>
                            <p style={{ color: '#64748b', marginBottom: '2rem' }}>Upgrade to the Pro or Business plan to view page-by-page duration heatmaps, drop-off curves, and viewer locations.</p>
                            <button
                                onClick={() => handleLockedFeatureClick('Advanced Analytics')}
                                style={{ padding: '0.75rem 2rem', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}
                            >
                                Upgrade to Pro
                            </button>
                        </div>
                    ) : (
                        <AnalyticsDashboard
                            documentId={selectedDocumentId}
                            documentName={documents.find(d => d.id === selectedDocumentId)?.name}
                            onBack={() => { setActiveTab('documents'); setSelectedDocumentId(undefined); }}
                        />
                    ))
                : activeTab === 'audit' ?

                    <div className="animate-fade-in">
                        {isFeatureLocked('audit_trails') ? (
                            <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'white', borderRadius: '24px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                                <div style={{ width: '80px', height: '80px', background: '#eef2ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                                    <Shield size={40} color="#4f46e5" />
                                </div>
                                <h2 style={{ fontSize: '1.875rem', fontWeight: '800', color: '#111827', marginBottom: '1rem' }}>Audit Trail is Locked</h2>
                                <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '2.5rem', maxWidth: '500px', margin: '0 auto 2.5rem' }}>
                                    Track every document interaction with a compliance-ready activity log. Available on Pro, Business, and Data Room plans.
                                </p>
                                <button
                                    onClick={() => handleLockedFeatureClick('Audit Trail')}
                                    style={{
                                        padding: '1rem 2.5rem',
                                        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                                        color: 'white',
                                        borderRadius: '12px',
                                        border: 'none',
                                        fontWeight: '600',
                                        fontSize: '1.125rem',
                                        cursor: 'pointer',
                                        boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)',
                                        transition: 'transform 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    Upgrade to Unlock
                                </button>
                            </div>
                        ) : (
                            <AuditTrail documentId={selectedDocumentId || documents.map(d => d.id)} />
                        )}
                    </div>
                : activeTab === 'documents' ?

                    <div className="animate-fade-in">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827' }}>My Documents & Virtual Data Room</h2>
                                <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0.2rem 0 0' }}>Manage confidential files, monitor live investor sessions, and trigger instant kill-switches</p>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <input
                                    type="text"
                                    placeholder="Search documents..."
                                    style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #d1d5db', minWidth: '250px' }}
                                />
                            </div>
                        </div>

                        {/* VDR Diligence Folders Strip */}
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid #f1f5f9' }}>
                            {VDR_CATEGORIES.map(cat => {
                                const isSel = selectedVdrCategory === cat.id;
                                const count = cat.id === 'all' 
                                    ? documents.length 
                                    : documents.filter(d => (d.watermark_config as any)?.category === cat.id).length;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedVdrCategory(cat.id)}
                                        style={{
                                            padding: '0.45rem 0.85rem',
                                            borderRadius: '8px',
                                            border: isSel ? '1.5px solid #4f46e5' : '1px solid #e2e8f0',
                                            background: isSel ? '#eef2ff' : '#ffffff',
                                            color: isSel ? '#4338ca' : '#475569',
                                            fontSize: '0.82rem',
                                            fontWeight: isSel ? 700 : 500,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.4rem',
                                            transition: 'all 0.15s ease'
                                        }}
                                    >
                                        <span>{cat.label}</span>
                                        <span style={{ fontSize: '0.7rem', padding: '1px 6px', borderRadius: '999px', background: isSel ? '#c7d2fe' : '#f1f5f9', color: isSel ? '#312e81' : '#64748b' }}>
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {isLoadingDocs ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.25rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                            <Skeleton width="40px" height="40px" borderRadius="8px" />
                                            <div style={{ flex: 1 }}>
                                                <Skeleton width="70%" height="1rem" style={{ marginBottom: '0.5rem', display: 'block' }} />
                                                <Skeleton width="40%" height="0.75rem" />
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <Skeleton width="100%" height="2.25rem" borderRadius="8px" />
                                            <Skeleton width="2.25rem" height="2.25rem" borderRadius="8px" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : documents.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                                <FileText size={48} color="#9ca3af" style={{ marginBottom: '1rem' }} />
                                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>No documents found</h3>
                                <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>Upload your first document to get started.</p>
                                <button
                                    onClick={() => setActiveTab('upload')}
                                    style={{ padding: '0.75rem 1.5rem', background: '#4f46e5', color: 'white', borderRadius: '8px', border: 'none', fontWeight: '500', cursor: 'pointer' }}
                                >
                                    Upload Document
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                {documents
                                    .filter(doc => selectedVdrCategory === 'all' || (doc.watermark_config as any)?.category === selectedVdrCategory)
                                    .map(doc => (
                                    <div key={doc.id} style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', transition: 'transform 0.2s', cursor: 'pointer' }}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                    >
                                        <div style={{ padding: '1.25rem', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{ padding: '0.5rem', background: '#eff6ff', borderRadius: '8px', color: '#3b82f6' }}>
                                                    <FileText size={20} />
                                                </div>
                                                <div>
                                                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>{doc.name}</h3>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                                                        <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>{doc.size} • {doc.uploadedAt}</p>
                                                        {((doc as any).scan_status === 'pending') && (
                                                            <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: '#e0f2fe', color: '#0284c7', border: '1px solid #bae6fd' }}>Scanning...</span>
                                                        )}
                                                        {((doc as any).scan_status === 'infected') && (
                                                            <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5' }}>INFECTED</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        shareOnWhatsApp(doc.link, doc.name);
                                                    }}
                                                    style={{ padding: '0.5rem', background: 'transparent', border: 'none', cursor: 'pointer', color: '#25D366' }}
                                                    title="Share on WhatsApp"
                                                >
                                                    <MessageCircle size={18} />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        // Copy link logic
                                                        navigator.clipboard.writeText(doc.link);
                                                        setCopiedId(doc.id);
                                                        setTimeout(() => setCopiedId(null), 2000);
                                                    }}
                                                    style={{ padding: '0.5rem', background: 'transparent', border: 'none', cursor: 'pointer', color: copiedId === doc.id ? '#10b981' : '#9ca3af' }}
                                                    title="Copy Link"
                                                >
                                                    {copiedId === doc.id ? <Check size={18} /> : <Copy size={18} />}
                                                </button>
                                            </div>
                                        </div>
                                        <div style={{ padding: '1rem', background: '#f9fafb', display: 'flex', gap: '0.5rem' }}>
                                            <a
                                                href={doc.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ flex: 1, padding: '0.5rem', textAlign: 'center', background: 'white', border: '1px solid #e5e7eb', borderRadius: '6px', color: '#374151', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500' }}
                                            >
                                                View
                                            </a>
                                            <button
                                                onClick={() => {
                                                    if (isFeatureLocked('advanced_analytics')) {
                                                        handleLockedFeatureClick('Advanced Analytics');
                                                        return;
                                                    }
                                                    setSelectedDocumentId(doc.id);
                                                    setActiveTab('analytics');
                                                }}
                                                style={{ flex: 1, padding: '0.5rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', color: '#166534', fontSize: '0.875rem', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                                            >
                                                <BarChart2 size={16} /> Analytics
                                                {isFeatureLocked('advanced_analytics') && <Lock size={12} color="#166534" />}
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (isFeatureLocked('audit_trails')) {
                                                        handleLockedFeatureClick('Audit Trail');
                                                        return;
                                                    }
                                                    setSelectedDocumentId(doc.id);
                                                    setActiveTab('audit');
                                                }}
                                                style={{ padding: '0.5rem', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '6px', color: '#0369a1', fontSize: '0.875rem', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                                                title="View Audit Trail"
                                            >
                                                <Shield size={16} />
                                                {isFeatureLocked('audit_trails') && <Lock size={12} color="#0369a1" />}
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (isFeatureLocked('active_sessions')) {
                                                        handleLockedFeatureClick('Active Sessions & Kill Switch');
                                                        return;
                                                    }
                                                    setSessionManagerDoc({ id: doc.id, name: doc.name });
                                                }}
                                                style={{ padding: '0.5rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', color: '#dc2626', fontSize: '0.875rem', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                                                title="Active Sessions & Kill Switch"
                                            >
                                                <Ban size={16} />
                                                {isFeatureLocked('active_sessions') && <Lock size={12} color="#dc2626" />}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Active Sessions & Kill Switch Modal */}
                        {sessionManagerDoc && (
                            <div style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'rgba(15, 23, 42, 0.65)',
                                backdropFilter: 'blur(4px)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 9999,
                                padding: '1.5rem'
                            }}>
                                <div style={{
                                    background: 'white',
                                    borderRadius: '24px',
                                    maxWidth: '850px',
                                    width: '100%',
                                    maxHeight: '90vh',
                                    overflowY: 'auto',
                                    position: 'relative',
                                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                                }}>
                                    <button
                                        onClick={() => setSessionManagerDoc(null)}
                                        style={{
                                            position: 'absolute',
                                            top: '1.25rem',
                                            right: '1.25rem',
                                            background: '#f1f5f9',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '36px',
                                            height: '36px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            color: '#475569',
                                            zIndex: 10
                                        }}
                                        title="Close Modal"
                                    >
                                        <X size={18} />
                                    </button>
                                    <div style={{ padding: '0.5rem' }}>
                                        <ActiveSessionsManager
                                            documentId={sessionManagerDoc.id}
                                            documentName={sessionManagerDoc.name}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                :

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', border: '1px solid #f3f4f6', maxWidth: '100%', margin: '0 auto', overflow: 'hidden' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '600px' }}>
                                {/* Upload Document Section - Left Side */}
                                <div style={{ padding: '2.5rem', borderRight: '1px solid #f3f4f6', background: 'white' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                        <Upload size={24} style={{ color: '#4f46e5' }} />
                                        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827' }}>Upload Document</h2>
                                    </div>
                                    <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Upload any document to generate a secure sharing link</p>

                                    {/* Error Display */}
                                    {uploadError && (
                                        <div style={{ padding: '1rem', background: '#fee2e2', color: '#dc2626', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                            <Shield size={18} />
                                            <span>{uploadError}</span>
                                        </div>
                                    )}

                                    {/* Usage Limit Banner / Free Tier Tracking */}
                                    {(!subscription || subscription.status === 'trialing' || subscription.plan_type === 'free') ? (
                                        <TrialTrackingBar
                                            currentUploads={activeDocCount || 0}
                                            maxUploads={5}
                                            label="active document links (Free Tier Limit)"
                                        />
                                    ) : null}

                                    {/* Upload Area */}
                                    <div
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        onClick={() => {
                                            document.getElementById('file-upload')?.click();
                                        }}
                                        style={{
                                            padding: '3rem 2rem',
                                            border: isDragging ? '2px dashed #4f46e5' : selectedFiles.length > 0 ? '2px dashed #10b981' : '2px dashed #e5e7eb',
                                            borderRadius: '12px',
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            marginBottom: '1.5rem',
                                            background: isDragging ? '#f0f4ff' : selectedFiles.length > 0 ? '#f0fdf4' : '#fafbfc',
                                            transition: 'all 0.2s',
                                            opacity: 1
                                        }}
                                    >
                                        {/* Icon with checkmark when file selected */}
                                        <div style={{
                                            width: '80px',
                                            height: '80px',
                                            margin: '0 auto 1rem',
                                            background: selectedFiles.length > 0 ? '#dcfce7' : '#f3f4f6',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            position: 'relative',
                                            transition: 'all 0.3s ease'
                                        }}>
                                            {selectedFiles.length > 0 ? (
                                                <Check size={40} color="#10b981" strokeWidth={3} />
                                            ) : (
                                                <FileText size={36} color="#6b7280" />
                                            )}
                                        </div>
                                        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: selectedFiles.length > 0 ? '#047857' : '#374151' }}>
                                            {selectedFiles.length > 0
                                                ? (selectedFiles.length === 1 ? selectedFiles[0].name : `${selectedFiles.length} files selected`)
                                                : 'Click to upload or drag and drop'}
                                        </h3>
                                        <div style={{ fontSize: '0.875rem', color: selectedFiles.length > 0 ? '#10b981' : '#9ca3af', fontWeight: selectedFiles.length > 0 ? '500' : '400' }}>
                                            {selectedFiles.length > 0 ? (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                                    <span>Ready to upload</span>
                                                    {selectedFiles.length > 1 && (
                                                        <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', textAlign: 'left', background: 'rgba(255,255,255,0.5)', padding: '0.5rem', borderRadius: '8px' }}>
                                                            {selectedFiles.slice(0, 3).map((f, i) => (
                                                                <div key={i} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>• {f.name}</div>
                                                            ))}
                                                            {selectedFiles.length > 3 && <div>...and {selectedFiles.length - 3} more</div>}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'center', gap: '0.25rem' }}>
                                                    <span>Supports multiple files (Bundles)</span>
                                                    {isFeatureLocked('document_bundles') && <Lock size={12} color="#9ca3af" />}
                                                </div>
                                            )}
                                        </div>
                                        {selectedFiles.length === 0 && (
                                            <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem', fontWeight: 500 }}>
                                                Max file size: {(getMaxFileSize() / (1024 * 1024)).toFixed(0)} MB per file {!subscription || subscription.plan_type === 'free' ? '(Free Plan)' : `(${subscription.plan_type.toUpperCase()} Plan)`}
                                            </p>
                                        )}
                                        <input
                                            type="file"
                                            onChange={handleFileInput}
                                            id="file-upload"
                                            accept=".pdf,.doc,.docx,.pptx,.ppt,.key,.odp,.xlsx,.xls,.csv,.tsv,.ods,.png,.jpg,.jpeg,.mp4,.mov,.avi,.webm,.ogg,.m4a,.mp3,.zip,.kml,.kmz"
                                            disabled={isUploading}
                                            multiple // Enable multiple selection
                                            style={{ display: 'none' }}
                                        />
                                    </div>

                                    {/* ⚡ 1-Click Sector Security Presets Strip */}
                                    <div style={{
                                        marginBottom: '1.5rem',
                                        background: '#f8fafc',
                                        padding: '1.1rem 1.25rem',
                                        borderRadius: '14px',
                                        border: '1px solid #e2e8f0',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                                                <Sparkles size={16} color="#6366f1" />
                                                <span>1-Click Sector Deal Presets</span>
                                                {isFeatureLocked('sector_presets') && <PremiumBadge size={13} />}
                                            </div>
                                            {activePreset && (
                                                <span style={{ fontSize: '0.7rem', color: '#047857', background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.15rem 0.6rem', borderRadius: '999px', fontWeight: 700 }}>
                                                    Preset Active ✓
                                                </span>
                                            )}
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                                            {[
                                                { id: 'dubai_re', label: '🏢 Dubai Luxury Real Estate', desc: 'Phone Gate (+971) • Watermark • No Download' },
                                                { id: 'hotel_mna', label: '🏨 Resort & Hotel Diligence', desc: 'Click-Through NDA • Email Gate • View-Only' },
                                                { id: 'startup', label: '🚀 Startup Pitch Deck', desc: 'Email Gate • Pitch Watermark • Strict DRM' },
                                                { id: 'pe_finance', label: '💼 Institutional M&A / PE', desc: 'AES-256 Vault • NDA • Passcode & OTP' }
                                            ].map(item => {
                                                const isSel = activePreset === item.id;
                                                return (
                                                    <button
                                                        key={item.id}
                                                        type="button"
                                                        onClick={() => {
                                                            if (isFeatureLocked('sector_presets')) {
                                                                handleLockedFeatureClick('1-Click Sector Presets');
                                                                return;
                                                            }
                                                            applySectorPreset(item.id as any);
                                                        }}
                                                        style={{
                                                            padding: '0.65rem 0.85rem',
                                                            textAlign: 'left',
                                                            background: isSel ? '#eff6ff' : '#ffffff',
                                                            border: isSel ? '1.5px solid #3b82f6' : '1px solid #cbd5e1',
                                                            borderRadius: '10px',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.15s ease'
                                                        }}
                                                    >
                                                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: isSel ? '#1d4ed8' : '#1e293b' }}>
                                                            {item.label}
                                                        </div>
                                                        <div style={{ fontSize: '0.68rem', color: isSel ? '#2563eb' : '#64748b', marginTop: '0.15rem' }}>
                                                            {item.desc}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Settings */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
                                        {/* Password Protection */}
                                        <div style={{ padding: '1rem', border: '1px solid #f3f4f6', borderRadius: '12px', background: passwordProtection ? '#fef2f2' : '#ffffff', transition: 'all 0.2s' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: passwordProtection ? '0.75rem' : '0' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div style={{ padding: '8px', background: '#fee2e2', borderRadius: '8px' }}>
                                                        <Lock size={18} style={{ color: '#dc2626' }} />
                                                    </div>
                                                    <div>
                                                        <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#374151', display: 'block' }}>Password Protection</span>
                                                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Restrict access with a password</span>
                                                    </div>
                                                </div>
                                                <label className="toggle-switch">
                                                    <input type="checkbox" checked={passwordProtection} onChange={(e) => setPasswordProtection(e.target.checked)} />
                                                    <span className="toggle-slider"></span>
                                                </label>
                                            </div>
                                            {passwordProtection && (
                                                <input
                                                    type="password"
                                                    placeholder="Enter password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.625rem 0.875rem',
                                                        border: '1px solid #e5e7eb',
                                                        borderRadius: '8px',
                                                        fontSize: '0.875rem',
                                                        outline: 'none',
                                                        background: 'white'
                                                    }}
                                                />
                                            )}
                                        </div>                                        {/* AES-256 Encryption */}
                                        <div style={{ padding: '1rem', border: '1px solid #f3f4f6', borderRadius: '12px', background: aesEncryptionEnabled ? '#f5f3ff' : '#ffffff', transition: 'all 0.2s' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div style={{ padding: '8px', background: '#e0e7ff', borderRadius: '8px' }}>
                                                        <Shield size={18} style={{ color: '#4f46e5' }} />
                                                    </div>
                                                    <div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#374151' }}>AES-256 Encryption</span>
                                                            {isFeatureLocked('aes_encryption') && <PremiumBadge size={14} />}
                                                        </div>
                                                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Encrypt file content client-side</span>
                                                    </div>
                                                </div>
                                                <label className="toggle-switch">
                                                    <input
                                                        type="checkbox"
                                                        checked={aesEncryptionEnabled}
                                                        onChange={(e) => {
                                                            if (isFeatureLocked('aes_encryption')) {
                                                                 e.preventDefault();
                                                                 handleLockedFeatureClick('AES-256 Encryption');
                                                            } else {
                                                                 setAesEncryptionEnabled(e.target.checked);
                                                            }
                                                        }}
                                                        disabled={isFeatureLocked('aes_encryption')}
                                                    />
                                                    <span className="toggle-slider"></span>
                                                </label>
                                            </div>
                                        </div>

                                        {/* Self-Destruct Rules (Expiration & View Limits) */}
                                        <SelfDestructSettings
                                            linkExpiration={linkExpiration}
                                            setLinkExpiration={setLinkExpiration}
                                            expirationMode={expirationMode}
                                            setExpirationMode={setExpirationMode}
                                            durationValue={durationValue}
                                            setDurationValue={setDurationValue}
                                            durationUnit={durationUnit}
                                            setDurationUnit={setDurationUnit}
                                            expiresAt={expiresAt}
                                            setExpiresAt={setExpiresAt}
                                            maxViewsEnabled={maxViewsEnabled}
                                            setMaxViewsEnabled={setMaxViewsEnabled}
                                            maxViews={maxViews}
                                            setMaxViews={setMaxViews}
                                            isFeatureLocked={isFeatureLocked}
                                            handleLockedFeatureClick={handleLockedFeatureClick}
                                        />

                                        {/* Allow Downloads */}
                                        <div style={{ padding: '1rem', border: '1px solid #f3f4f6', borderRadius: '12px', background: allowDownloads ? '#f0fdf4' : '#ffffff', transition: 'all 0.2s' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div style={{ padding: '8px', background: '#dcfce7', borderRadius: '8px' }}>
                                                        <Download size={18} style={{ color: '#16a34a' }} />
                                                    </div>
                                                    <div>
                                                        <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#374151', display: 'block' }}>Allow Downloads</span>
                                                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Let recipients download the file</span>
                                                    </div>
                                                </div>
                                                <label className="toggle-switch">
                                                    <input type="checkbox" checked={allowDownloads} onChange={(e) => setAllowDownloads(e.target.checked)} />
                                                    <span className="toggle-slider"></span>
                                                </label>
                                            </div>
                                        </div>

                                        {/* Strict DRM: Text Copy & Print Block */}
                                        <div style={{ padding: '1rem', border: '1px solid #f3f4f6', borderRadius: '12px', background: strictDrm && !isFeatureLocked('strict_drm') ? '#fff7ed' : '#ffffff', transition: 'all 0.2s', opacity: isFeatureLocked('strict_drm') ? 0.85 : 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div style={{ padding: '8px', background: '#ffedd5', borderRadius: '8px' }}>
                                                        <FileLock size={18} style={{ color: '#ea580c' }} />
                                                    </div>
                                                    <div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                            <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#374151' }}>Disable Text Copy & Print (Strict DRM)</span>
                                                            <span style={{ fontSize: '0.65rem', padding: '1px 5px', background: '#fed7aa', color: '#9a3412', borderRadius: '4px', fontWeight: 700 }}>DRM Defense</span>
                                                            {isFeatureLocked('strict_drm') && <PremiumBadge size={14} />}
                                                        </div>
                                                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Blocks Ctrl+P printing, right-click menu, and text clipboard copy</span>
                                                    </div>
                                                </div>
                                                <div onClick={() => {
                                                    if (isFeatureLocked('strict_drm')) {
                                                        handleLockedFeatureClick('Strict DRM');
                                                    }
                                                }}>
                                                    <label className="toggle-switch" style={{ pointerEvents: isFeatureLocked('strict_drm') ? 'none' : 'auto' }}>
                                                        <input
                                                            type="checkbox"
                                                            checked={strictDrm && !isFeatureLocked('strict_drm')}
                                                            onChange={(e) => {
                                                                if (isFeatureLocked('strict_drm')) {
                                                                    handleLockedFeatureClick('Strict DRM');
                                                                    return;
                                                                }
                                                                setStrictDrm(e.target.checked);
                                                            }}
                                                            disabled={isFeatureLocked('strict_drm')}
                                                        />
                                                        <span className="toggle-slider"></span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Email Verification */}
                                        <div style={{ padding: '1rem', border: '1px solid #f3f4f6', borderRadius: '12px', background: emailVerification ? '#f0f9ff' : '#ffffff', transition: 'all 0.2s' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: emailVerification ? '0.75rem' : '0' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div style={{ padding: '8px', background: '#e0f2fe', borderRadius: '8px' }}>
                                                        <Mail size={18} style={{ color: '#0ea5e9' }} />
                                                    </div>
                                                    <div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#374151' }}>Email Verification</span>
                                                            {isFeatureLocked?.('email_verification') && <PremiumBadge size={14} />}
                                                        </div>
                                                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Require recipient email</span>
                                                    </div>
                                                </div>
                                                <label className="toggle-switch">
                                                    <input
                                                        type="checkbox"
                                                        checked={emailVerification}
                                                        onChange={(e) => {
                                                            if (isFeatureLocked?.('email_verification')) {
                                                                e.preventDefault();
                                                                handleLockedFeatureClick('Email Verification');
                                                            } else {
                                                                setEmailVerification(e.target.checked);
                                                            }
                                                        }}
                                                        disabled={isFeatureLocked?.('email_verification')}
                                                    />
                                                    <span className="toggle-slider"></span>
                                                </label>
                                            </div>
                                            {emailVerification && (
                                                <input
                                                    type="email"
                                                    placeholder="Enter recipient email (optional)"
                                                    value={allowedEmail}
                                                    onChange={(e) => setAllowedEmail(e.target.value)}
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.625rem 0.875rem',
                                                        border: '1px solid #e5e7eb',
                                                        borderRadius: '8px',
                                                        fontSize: '0.875rem',
                                                        outline: 'none',
                                                        background: 'white'
                                                    }}
                                                />
                                            )}
                                        </div>

                                        {/* Pre-Flight Click-Through NDA & Disclaimer Gate */}
                                        <div style={{ padding: '1rem', border: '1px solid #f3f4f6', borderRadius: '12px', background: requireNda && !isFeatureLocked('nda_gate') ? '#f5f3ff' : '#ffffff', transition: 'all 0.2s', opacity: isFeatureLocked('nda_gate') ? 0.85 : 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: (requireNda && !isFeatureLocked('nda_gate')) ? '0.75rem' : '0' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div style={{ padding: '8px', background: '#ede9fe', borderRadius: '8px' }}>
                                                        <Scale size={18} style={{ color: '#7c3aed' }} />
                                                    </div>
                                                    <div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#111827' }}>Click-Through NDA & Confidentiality Gate</span>
                                                            <span style={{ fontSize: '0.68rem', padding: '1px 6px', background: '#ede9fe', color: '#6d28d9', borderRadius: '4px', fontWeight: 700 }}>Legal Gate</span>
                                                            {isFeatureLocked('nda_gate') && <PremiumBadge size={14} />}
                                                        </div>
                                                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Require viewers to click-accept legal terms before viewing file</span>
                                                    </div>
                                                </div>
                                                <div onClick={() => {
                                                    if (isFeatureLocked('nda_gate')) {
                                                        handleLockedFeatureClick('Click-Through NDA Gate');
                                                    }
                                                }}>
                                                    <label className="toggle-switch" style={{ pointerEvents: isFeatureLocked('nda_gate') ? 'none' : 'auto' }}>
                                                        <input
                                                            type="checkbox"
                                                            checked={requireNda && !isFeatureLocked('nda_gate')}
                                                            onChange={(e) => {
                                                                if (isFeatureLocked('nda_gate')) {
                                                                    handleLockedFeatureClick('Click-Through NDA Gate');
                                                                    return;
                                                                }
                                                                setRequireNda(e.target.checked);
                                                            }}
                                                            disabled={isFeatureLocked('nda_gate')}
                                                        />
                                                        <span className="toggle-slider"></span>
                                                    </label>
                                                </div>
                                            </div>

                                            {requireNda && !isFeatureLocked('nda_gate') && (
                                                <div style={{ paddingLeft: '2.8rem' }}>
                                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                                                        Select Agreement Template:
                                                    </label>
                                                    <select
                                                        value={ndaType}
                                                        onChange={(e) => setNdaType(e.target.value as any)}
                                                        style={{
                                                            width: '100%',
                                                            padding: '0.55rem 0.75rem',
                                                            border: '1px solid #cbd5e1',
                                                            borderRadius: '8px',
                                                            fontSize: '0.85rem',
                                                            fontWeight: 600,
                                                            color: '#334155',
                                                            background: '#f8fafc',
                                                            outline: 'none',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        <option value="standard">⚖️ Standard Cross-Border Mutual NDA</option>
                                                        <option value="real_estate">🏢 Luxury Real Estate Off-Plan Exclusivity Disclaimer</option>
                                                        <option value="hotel_mna">🏨 Hotel & Resort Asset Diligence Non-Disclosure</option>
                                                        <option value="startup">🚀 Startup Teaser & Proprietary IP Disclaimer</option>
                                                    </select>
                                                    <p style={{ fontSize: '0.72rem', color: '#64748b', margin: '0.35rem 0 0' }}>
                                                        Recipients must review and agree to terms with a legal acknowledgment checkbox before viewing.
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Mobile Number Gate (Global Phone OTP) */}
                                        <div style={{
                                            padding: '1rem',
                                            border: '1px solid #f3f4f6',
                                            borderRadius: '12px',
                                            background: requirePhoneOtp && !isFeatureLocked?.('phone_otp') ? '#ecfdf5' : '#ffffff',
                                            opacity: isFeatureLocked?.('phone_otp') ? 0.85 : 1,
                                            transition: 'all 0.2s'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div style={{ padding: '8px', background: '#d1fae5', borderRadius: '8px' }}>
                                                        <Smartphone size={18} style={{ color: '#059669' }} />
                                                    </div>
                                                    <div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#111827' }}>Mobile Number Gate (Global Phone OTP)</span>
                                                            <span style={{ fontSize: '0.68rem', padding: '1px 6px', background: '#dcfce7', color: '#15803d', borderRadius: '4px', fontWeight: 700 }}>Global Deal Gate</span>
                                                            {isFeatureLocked?.('phone_otp') && <PremiumBadge size={14} />}
                                                        </div>
                                                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Require phone OTP verification (+971, +44, +1, +65, +33, +91) before viewing</span>
                                                    </div>
                                                </div>
                                                <label className="toggle-switch">
                                                    <input
                                                        type="checkbox"
                                                        checked={requirePhoneOtp}
                                                        disabled={isFeatureLocked?.('phone_otp')}
                                                        onChange={(e) => {
                                                            if (isFeatureLocked?.('phone_otp')) {
                                                                e.preventDefault();
                                                                handleLockedFeatureClick('Mobile Number Gate (Global Phone OTP)');
                                                                return;
                                                            }
                                                            setRequirePhoneOtp(e.target.checked);
                                                            if (e.target.checked && !applyWatermark && !isFeatureLocked?.('watermarking')) {
                                                                setApplyWatermark(true);
                                                                setWatermarkConfig(prev => ({
                                                                    ...prev,
                                                                    text: prev.text.includes('{{phone}}') ? prev.text : `${prev.text} • {{phone}}`
                                                                }));
                                                            }
                                                        }}
                                                    />
                                                    <span className="toggle-slider"></span>
                                                </label>
                                            </div>
                                            {requirePhoneOtp && !isFeatureLocked?.('phone_otp') && (
                                                <div style={{ marginTop: '0.75rem', paddingLeft: '2.8rem' }}>
                                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                                                        Lock to Specific Recipient Phone (Optional)
                                                    </label>
                                                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '8px', overflow: 'hidden', background: '#f9fafb' }}>
                                                        <select
                                                            value={allowedPhoneCountryCode}
                                                            onChange={(e) => setAllowedPhoneCountryCode(e.target.value)}
                                                            style={{
                                                                padding: '0.5rem 0.6rem',
                                                                fontSize: '0.82rem',
                                                                fontWeight: 600,
                                                                color: '#334155',
                                                                background: '#f1f5f9',
                                                                border: 'none',
                                                                borderRight: '1px solid #e5e7eb',
                                                                cursor: 'pointer',
                                                                outline: 'none'
                                                            }}
                                                        >
                                                            {PHONE_COUNTRY_CODES.map((item) => (
                                                                <option key={item.code} value={item.code}>
                                                                    {item.flag} {item.code} ({item.label.split(' ')[0]})
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <input
                                                            type="tel"
                                                            maxLength={15}
                                                            placeholder="e.g. 50 123 4567 (leave blank for any visitor)"
                                                            value={allowedPhone}
                                                            onChange={(e) => setAllowedPhone(e.target.value.replace(/[^0-9]/g, ''))}
                                                            style={{ flex: 1, padding: '0.5rem 0.75rem', border: 'none', outline: 'none', fontSize: '0.875rem', background: 'transparent' }}
                                                        />
                                                    </div>
                                                    <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0.25rem 0 0' }}>
                                                        Leave blank to allow any visitor from supported countries to verify OTP, or enter a number to restrict access exclusively to this person.
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Watermark */}
                                        <div style={{
                                            padding: '1rem',
                                            border: '1px solid #f3f4f6',
                                            borderRadius: '12px',
                                            background: applyWatermark && !isFeatureLocked?.('watermarking') ? '#f5f3ff' : '#ffffff',
                                            transition: 'all 0.2s',
                                            opacity: isFeatureLocked?.('watermarking') ? 0.85 : 1
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div style={{ padding: '8px', background: '#ede9fe', borderRadius: '8px' }}>
                                                        <ImageIcon size={18} style={{ color: '#8b5cf6' }} />
                                                    </div>
                                                    <div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                            <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#374151' }}>Apply Dynamic Watermark</span>
                                                            {isFeatureLocked?.('watermarking') && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleLockedFeatureClick('Dynamic Watermarking')}
                                                                    style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', display: 'inline-flex' }}
                                                                    title="Click to upgrade"
                                                                >
                                                                    <PremiumBadge size={14} />
                                                                </button>
                                                            )}
                                                        </div>
                                                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Add dynamic buyer/agency overlay</span>
                                                    </div>
                                                </div>
                                                <div
                                                    onClick={(e) => {
                                                        if (isFeatureLocked?.('watermarking')) {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            handleLockedFeatureClick('Dynamic Watermarking');
                                                        }
                                                    }}
                                                    style={{ cursor: isFeatureLocked?.('watermarking') ? 'pointer' : 'default' }}
                                                >
                                                    <label className="toggle-switch" style={{ pointerEvents: isFeatureLocked?.('watermarking') ? 'none' : 'auto' }}>
                                                        <input
                                                            type="checkbox"
                                                            checked={applyWatermark && !isFeatureLocked?.('watermarking')}
                                                            onChange={(e) => {
                                                                if (isFeatureLocked?.('watermarking')) {
                                                                    e.preventDefault();
                                                                    handleLockedFeatureClick('Dynamic Watermarking');
                                                                } else {
                                                                    setApplyWatermark(e.target.checked);
                                                                }
                                                            }}
                                                            disabled={isFeatureLocked?.('watermarking')}
                                                        />
                                                        <span className="toggle-slider"></span>
                                                    </label>
                                                </div>
                                            </div>
                                            {applyWatermark && !isFeatureLocked?.('watermarking') && (
                                                <div style={{ marginTop: '1rem', padding: '1rem', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                                    {/* Text Template */}
                                                    <div style={{ marginBottom: '1rem' }}>
                                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: '#64748b', marginBottom: '0.25rem' }}>Watermark Text</label>
                                                        <input
                                                            type="text"
                                                            value={watermarkConfig.text}
                                                            onChange={(e) => setWatermarkConfig({ ...watermarkConfig, text: e.target.value })}
                                                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.9rem' }}
                                                        />
                                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
                                                            {['{{phone}}', '{{rera_id}}', '{{agency}}', '{{email}}', '{{ip}}', '{{date}}'].map(tag => (
                                                                <button
                                                                    key={tag}
                                                                    onClick={() => setWatermarkConfig(prev => ({ ...prev, text: prev.text + ' ' + tag }))}
                                                                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#e0e7ff', color: '#4338ca', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
                                                                >
                                                                    + {tag}
                                                                </button>
                                                            ))}
                                                            <button
                                                                type="button"
                                                                onClick={() => setWatermarkConfig(prev => ({ ...prev, text: 'Exclusively Marketed by {{agency}} • RERA: {{rera_id}} • Buyer: {{phone}} • Confidential', layout: 'tiled', opacity: 0.18 }))}
                                                                style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
                                                            >
                                                                🛡️ Broker Anti-Bypass
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => setWatermarkConfig(prev => ({ ...prev, text: 'CONFIDENTIAL RERA PROJECT DOSSIER • ISSUED TO {{phone}} • DO NOT FORWARD', layout: 'tiled', opacity: 0.15 }))}
                                                                style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
                                                            >
                                                                📜 RERA Confidential
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Settings Grid */}
                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                                        <div>
                                                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: '#64748b' }}>Color</label>
                                                            <input
                                                                type="color"
                                                                value={watermarkConfig.color}
                                                                onChange={(e) => setWatermarkConfig({ ...watermarkConfig, color: e.target.value })}
                                                                style={{ width: '100%', height: '36px', border: 'none', cursor: 'pointer' }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: '#64748b' }}>Opacity ({watermarkConfig.opacity})</label>
                                                            <input
                                                                type="range"
                                                                min="0.1" max="1" step="0.1"
                                                                value={watermarkConfig.opacity}
                                                                onChange={(e) => setWatermarkConfig({ ...watermarkConfig, opacity: parseFloat(e.target.value) })}
                                                                style={{ width: '100%' }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: '#64748b' }}>Size ({watermarkConfig.fontSize}px)</label>
                                                            <input
                                                                type="range"
                                                                min="12" max="72" step="2"
                                                                value={watermarkConfig.fontSize}
                                                                onChange={(e) => setWatermarkConfig({ ...watermarkConfig, fontSize: parseInt(e.target.value) })}
                                                                style={{ width: '100%' }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: '#64748b' }}>Rotation ({watermarkConfig.rotation}°)</label>
                                                            <input
                                                                type="range"
                                                                min="-90" max="90" step="5"
                                                                value={watermarkConfig.rotation}
                                                                onChange={(e) => setWatermarkConfig({ ...watermarkConfig, rotation: parseInt(e.target.value) })}
                                                                style={{ width: '100%' }}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Layout Toggle */}
                                                    <div style={{ marginTop: '1rem' }}>
                                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: '#64748b', marginBottom: '0.25rem' }}>Layout</label>
                                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                            <button
                                                                onClick={() => setWatermarkConfig({ ...watermarkConfig, layout: 'single' })}
                                                                style={{
                                                                    flex: 1, padding: '0.5rem',
                                                                    background: watermarkConfig.layout === 'single' ? '#3b82f6' : 'white',
                                                                    color: watermarkConfig.layout === 'single' ? 'white' : '#64748b',
                                                                    border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer'
                                                                }}
                                                            >
                                                                Single
                                                            </button>
                                                            <button
                                                                onClick={() => setWatermarkConfig({ ...watermarkConfig, layout: 'tiled' })}
                                                                style={{
                                                                    flex: 1, padding: '0.5rem',
                                                                    background: watermarkConfig.layout === 'tiled' ? '#3b82f6' : 'white',
                                                                    color: watermarkConfig.layout === 'tiled' ? 'white' : '#64748b',
                                                                    border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer'
                                                                }}
                                                            >
                                                                Tiled
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Live Preview */}
                                                    <div style={{
                                                        marginTop: '1rem',
                                                        height: '150px',
                                                        background: 'white',
                                                        border: '1px dashed #cbd5e1',
                                                        position: 'relative',
                                                        overflow: 'hidden',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}>
                                                        <div style={{
                                                            position: 'absolute',
                                                            inset: 0,
                                                            display: 'flex',
                                                            flexWrap: 'wrap',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            transform: `rotate(${watermarkConfig.rotation}deg)`,
                                                            pointerEvents: 'none'
                                                        }}>
                                                            {[...Array(watermarkConfig.layout === 'tiled' ? 6 : 1)].map((_, i) => (
                                                                <span key={i} style={{
                                                                    color: watermarkConfig.color,
                                                                    opacity: watermarkConfig.opacity,
                                                                    fontSize: `${watermarkConfig.fontSize}px`,
                                                                    margin: '20px',
                                                                    whiteSpace: 'nowrap'
                                                                }}>
                                                                    {watermarkConfig.text}
                                                                </span>
                                                            ))}
                                                        </div>
                                                        <span style={{ position: 'relative', zIndex: -1, color: '#94a3b8', fontSize: '0.8rem' }}>Document Content Preview</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* 🌐 Territory Geo-Fencing & Country Allowlist */}
                                        <div style={{ padding: '1rem', border: '1px solid #f3f4f6', borderRadius: '12px', background: geoFencingEnabled && !isFeatureLocked('geo_fencing') ? '#f0fdfa' : '#ffffff', transition: 'all 0.2s', opacity: isFeatureLocked('geo_fencing') ? 0.85 : 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: (geoFencingEnabled && !isFeatureLocked('geo_fencing')) ? '0.75rem' : '0' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div style={{ padding: '8px', background: '#ccfbf1', borderRadius: '8px' }}>
                                                        <MapPin size={18} style={{ color: '#0d9488' }} />
                                                    </div>
                                                    <div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                            <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#111827' }}>Territory Geo-Fencing & Country Allowlist</span>
                                                            <span style={{ fontSize: '0.65rem', padding: '1px 6px', background: '#ccfbf1', color: '#0f766e', borderRadius: '4px', fontWeight: 700 }}>IP Border</span>
                                                            {isFeatureLocked('geo_fencing') && <PremiumBadge size={14} />}
                                                        </div>
                                                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Restrict access strictly to viewers located in authorized countries</span>
                                                    </div>
                                                </div>
                                                <div onClick={() => {
                                                    if (isFeatureLocked('geo_fencing')) {
                                                        handleLockedFeatureClick('Territory Geo-Fencing');
                                                    }
                                                }}>
                                                    <label className="toggle-switch" style={{ pointerEvents: isFeatureLocked('geo_fencing') ? 'none' : 'auto' }}>
                                                        <input
                                                            type="checkbox"
                                                            checked={geoFencingEnabled && !isFeatureLocked('geo_fencing')}
                                                            onChange={(e) => {
                                                                if (isFeatureLocked('geo_fencing')) {
                                                                    handleLockedFeatureClick('Territory Geo-Fencing');
                                                                    return;
                                                                }
                                                                setGeoFencingEnabled(e.target.checked);
                                                            }}
                                                            disabled={isFeatureLocked('geo_fencing')}
                                                        />
                                                        <span className="toggle-slider"></span>
                                                    </label>
                                                </div>
                                            </div>

                                            {geoFencingEnabled && !isFeatureLocked('geo_fencing') && (
                                                <div style={{ paddingLeft: '2.8rem' }}>
                                                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                                                        Authorized Jurisdictions (Click to toggle):
                                                    </label>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.4rem' }}>
                                                        {GEOPROTECTION_COUNTRIES.map(c => {
                                                            const isAllowed = allowedCountries.includes(c.code);
                                                            return (
                                                                <button
                                                                    key={c.code}
                                                                    type="button"
                                                                    onClick={() => toggleAllowedCountry(c.code)}
                                                                    style={{
                                                                        padding: '0.35rem 0.65rem',
                                                                        borderRadius: '999px',
                                                                        fontSize: '0.78rem',
                                                                        fontWeight: 600,
                                                                        cursor: 'pointer',
                                                                        border: isAllowed ? '1.5px solid #0d9488' : '1px solid #cbd5e1',
                                                                        background: isAllowed ? '#14b8a6' : '#ffffff',
                                                                        color: isAllowed ? '#ffffff' : '#475569',
                                                                        transition: 'all 0.15s ease'
                                                                    }}
                                                                >
                                                                    {c.label} {isAllowed ? '✓' : '+'}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                    <p style={{ fontSize: '0.72rem', color: '#64748b', margin: 0 }}>
                                                        Viewers attempting access outside {allowedCountries.join(', ')} will be blocked with an IP jurisdiction alert.
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* 🔔 Real-Time Investor Engagement & Lead Telemetry Alerts */}
                                        <div style={{ padding: '1rem', border: '1px solid #f3f4f6', borderRadius: '12px', background: '#faf5ff', transition: 'all 0.2s' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                                <div style={{ padding: '8px', background: '#f3e8ff', borderRadius: '8px' }}>
                                                    <Bell size={18} style={{ color: '#9333ea' }} />
                                                </div>
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                        <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#111827' }}>Investor Engagement & Lead Telemetry</span>
                                                        <span style={{ fontSize: '0.65rem', padding: '1px 6px', background: '#f3e8ff', color: '#7e22ce', borderRadius: '4px', fontWeight: 700 }}>Telemetry</span>
                                                        {isFeatureLocked('lead_alerts') && <PremiumBadge size={14} />}
                                                    </div>
                                                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Receive high-priority alerts when investors engage with this document</span>
                                                </div>
                                            </div>
                                            <div style={{ paddingLeft: '2.8rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#374151', cursor: 'pointer', fontWeight: 500 }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={notifyOnOpen}
                                                        onChange={(e) => setNotifyOnOpen(e.target.checked)}
                                                        style={{ width: '15px', height: '15px', accentColor: '#9333ea' }}
                                                    />
                                                    <span>Instant notification the moment an investor opens this link</span>
                                                </label>
                                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#374151', cursor: 'pointer', fontWeight: 500 }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={notifyOnDwell}
                                                        onChange={(e) => setNotifyOnDwell(e.target.checked)}
                                                        style={{ width: '15px', height: '15px', accentColor: '#9333ea' }}
                                                    />
                                                    <span>🔥 Hot Lead Alert: Notify if investor studies material for &gt; 60 seconds</span>
                                                </label>
                                            </div>
                                        </div>

                                        {/* 📁 VDR Diligence Folder Category */}
                                        <div style={{ padding: '1rem', border: '1px solid #f3f4f6', borderRadius: '12px', background: '#ffffff', transition: 'all 0.2s' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div style={{ padding: '8px', background: '#eff6ff', borderRadius: '8px' }}>
                                                        <Folder size={18} style={{ color: '#2563eb' }} />
                                                    </div>
                                                    <div>
                                                        <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#111827' }}>VDR Deal Room Folder</span>
                                                        <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block' }}>Assign document into organized diligence folder hierarchy</span>
                                                    </div>
                                                </div>
                                                <select
                                                    value={uploadCategory}
                                                    onChange={(e) => setUploadCategory(e.target.value as any)}
                                                    style={{
                                                        padding: '0.45rem 0.75rem',
                                                        border: '1px solid #cbd5e1',
                                                        borderRadius: '8px',
                                                        fontSize: '0.82rem',
                                                        fontWeight: 600,
                                                        color: '#1e293b',
                                                        background: '#f8fafc',
                                                        outline: 'none',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    <option value="legal">⚖️ 01_Legal & M&A</option>
                                                    <option value="financials">📊 02_Financial Models</option>
                                                    <option value="asset">🏢 03_Asset Diligence & Deeds</option>
                                                    <option value="teasers">🚀 04_Teasers & Pitch Decks</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Custom Link Vanity Slug (Optional) */}
                                    <div style={{ marginBottom: '1.25rem', padding: '0.9rem 1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', opacity: isFeatureLocked('custom_slug') ? 0.85 : 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                                            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                                <LinkIcon size={14} color="#6366f1" /> Custom Link Slug (Optional)
                                                {isFeatureLocked('custom_slug') && <PremiumBadge size={13} />}
                                            </label>
                                            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Branded Deal Link</span>
                                        </div>
                                        <div 
                                            onClick={() => {
                                                if (isFeatureLocked('custom_slug')) {
                                                    handleLockedFeatureClick('Custom Link Vanity Slug');
                                                }
                                            }}
                                            style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden', background: isFeatureLocked('custom_slug') ? '#f1f5f9' : '#ffffff', cursor: isFeatureLocked('custom_slug') ? 'pointer' : 'text' }}
                                        >
                                            <span style={{ padding: '0.5rem 0.65rem', fontSize: '0.8rem', background: '#f1f5f9', color: '#64748b', borderRight: '1px solid #cbd5e1', fontWeight: 600 }}>
                                                doctransfer.com/view/
                                            </span>
                                            <input
                                                type="text"
                                                maxLength={40}
                                                disabled={isFeatureLocked('custom_slug')}
                                                placeholder={isFeatureLocked('custom_slug') ? "Upgrade to Pro to customize deal link slug" : "e.g. palm-skyvilla-q4"}
                                                value={customSlug}
                                                onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '-'))}
                                                style={{ flex: 1, padding: '0.5rem 0.75rem', border: 'none', outline: 'none', fontSize: '0.85rem', color: '#0f172a', fontWeight: 600, background: 'transparent', cursor: isFeatureLocked('custom_slug') ? 'pointer' : 'text' }}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => {
                                            handleUpload();
                                        }}
                                        disabled={selectedFiles.length === 0 || isUploading}
                                        style={{
                                            marginTop: '1.5rem',
                                            width: '100%',
                                            padding: isUploading ? '0.75rem 1rem' : '0.875rem 1.5rem',
                                            background: selectedFiles.length === 0 
                                                ? '#9ca3af' 
                                                : isUploading 
                                                    ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' 
                                                    : '#6366f1',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '12px',
                                            fontWeight: '600',
                                            fontSize: '0.95rem',
                                            cursor: selectedFiles.length === 0 || isUploading ? 'not-allowed' : 'pointer',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            boxShadow: selectedFiles.length > 0 && !isUploading ? '0 4px 14px rgba(99, 102, 241, 0.4)' : 'none',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        {isUploading ? (
                                            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                                                    <span>Generating Link... {uploadProgress}%</span>
                                                </div>
                                                {/* Button Inner Loading Bar */}
                                                <div style={{ width: '100%', height: '4px', background: 'rgba(255, 255, 255, 0.25)', borderRadius: '999px', overflow: 'hidden' }}>
                                                    <div 
                                                        style={{ 
                                                            height: '100%', 
                                                            width: `${uploadProgress}%`, 
                                                            background: '#ffffff', 
                                                            borderRadius: '999px', 
                                                            transition: 'width 0.3s ease' 
                                                        }} 
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <LinkIcon size={18} />
                                                {selectedFiles.length > 1 ? 'Generate Bundle Link' : 'Generate Secure Link'}
                                            </div>
                                        )}
                                    </button>
                                </div>

                                {/* Sharing & Signing Section - Right Side */}
                                <div style={{ padding: '2.5rem', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                        <LinkIcon size={24} style={{ color: '#3b82f6' }} />
                                        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827' }}>Sharing Link</h2>
                                    </div>
                                    <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '2rem' }}>Your secure, trackable document link</p>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minHeight: '400px', justifyContent: (!isUploading && !uploadedDoc && !uploadedBundleLink) ? 'center' : 'flex-start' }}>
                                        {/* Loading State in Sharing Link Section */}
                                        {isUploading && (
                                            <div style={{
                                                padding: '2rem',
                                                background: 'white',
                                                borderRadius: '16px',
                                                border: '1px solid #e0e7ff',
                                                boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.1), 0 8px 10px -6px rgba(99, 102, 241, 0.05)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '1.25rem'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div style={{
                                                        width: '42px',
                                                        height: '42px',
                                                        borderRadius: '12px',
                                                        background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: '#4f46e5',
                                                        flexShrink: 0
                                                    }}>
                                                        <Lock size={20} style={{ animation: 'pulse 1.5s infinite' }} />
                                                    </div>
                                                    <div>
                                                        <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#1e1b4b', margin: 0 }}>
                                                            Generating Secure Share Link
                                                        </h3>
                                                        <p style={{ fontSize: '0.85rem', color: '#6366f1', margin: 0, fontWeight: 500 }}>
                                                            {uploadProgressStage}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Shimmering Progress Bar */}
                                                <div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Security & Link Setup</span>
                                                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#4f46e5' }}>{uploadProgress}%</span>
                                                    </div>
                                                    <div style={{
                                                        width: '100%',
                                                        height: '8px',
                                                        background: '#f1f5f9',
                                                        borderRadius: '999px',
                                                        overflow: 'hidden',
                                                        position: 'relative'
                                                    }}>
                                                        <div style={{
                                                            height: '100%',
                                                            width: `${uploadProgress}%`,
                                                            background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
                                                            borderRadius: '999px',
                                                            transition: 'width 0.3s ease',
                                                            boxShadow: '0 0 12px rgba(99, 102, 241, 0.5)'
                                                        }} />
                                                    </div>
                                                </div>

                                                {/* Skeleton Placeholders for Public Share Link Box */}
                                                <div style={{ marginTop: '0.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>Encrypting & securing document URL...</div>
                                                    <div style={{
                                                        width: '100%',
                                                        height: '48px',
                                                        background: '#f8fafc',
                                                        border: '1.5px dashed #cbd5e1',
                                                        borderRadius: '10px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        padding: '0 1rem',
                                                        justifyContent: 'space-between'
                                                    }}>
                                                        <div style={{ width: '70%', height: '14px', background: '#e2e8f0', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
                                                        <div style={{ width: '32px', height: '32px', background: '#e2e8f0', borderRadius: '6px', animation: 'pulse 1.5s infinite' }} />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Bundle Link Display */}
                                        {!isUploading && uploadedBundleLink && (
                                            <div style={{ padding: '1.5rem', background: '#ecfdf5', borderRadius: '12px', border: '1px solid #a7f3d0' }}>
                                                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#065f46' }}>📦 Bundle Share Link Ready</h3>
                                                <p style={{ fontSize: '0.85rem', color: '#047857', marginBottom: '1rem' }}>
                                                    Share this link to give instant access to all uploaded documents.
                                                </p>
                                                <div style={{
                                                    width: '100%',
                                                    padding: '0.4rem 0.5rem 0.4rem 0.85rem',
                                                    background: 'white',
                                                    border: copiedId === 'link' ? '1.5px solid #86efac' : '1.5px solid #cbd5e1',
                                                    borderRadius: '10px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    marginBottom: '0.75rem',
                                                    transition: 'all 0.2s ease',
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                                                }}>
                                                    <input
                                                        type="text"
                                                        value={uploadedBundleLink}
                                                        readOnly
                                                        onClick={(e) => (e.target as HTMLInputElement).select()}
                                                        onFocus={(e) => e.target.select()}
                                                        style={{ fontSize: '0.85rem', flex: 1, border: 'none', background: 'transparent', outline: 'none', color: '#374151', fontFamily: 'monospace' }}
                                                    />
                                                    <button
                                                        onClick={() => copyLink(uploadedBundleLink)}
                                                        style={{
                                                            background: copiedId === 'link' ? '#16a34a' : '#059669',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '8px',
                                                            padding: '0.55rem 0.95rem',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.35rem',
                                                            cursor: 'pointer',
                                                            fontWeight: 600,
                                                            fontSize: '0.82rem',
                                                            transition: 'all 0.2s ease',
                                                            flexShrink: 0,
                                                            boxShadow: copiedId === 'link' ? '0 2px 6px rgba(22, 163, 74, 0.3)' : '0 2px 6px rgba(5, 150, 105, 0.25)'
                                                        }}
                                                        title="Copy Bundle Link"
                                                    >
                                                        {copiedId === 'link' ? (
                                                            <>
                                                                <Check size={15} /> Copied!
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Copy size={15} /> Copy Link
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                                    <button
                                                        onClick={() => shareOnWhatsApp(uploadedBundleLink, 'Document Bundle')}
                                                        style={{
                                                            width: '100%',
                                                            background: '#25D366',
                                                            color: 'white',
                                                            border: 'none',
                                                            padding: '0.65rem 0.75rem',
                                                            borderRadius: '8px',
                                                            fontWeight: 600,
                                                            fontSize: '0.82rem',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            gap: '0.4rem',
                                                            boxShadow: '0 2px 8px rgba(37, 211, 102, 0.3)'
                                                        }}
                                                    >
                                                        <MessageCircle size={15} /> WhatsApp
                                                    </button>
                                                    <button
                                                        onClick={() => shareOnWhatsApp(uploadedBundleLink, 'Document Bundle', true)}
                                                        style={{
                                                            width: '100%',
                                                            background: '#059669',
                                                            color: 'white',
                                                            border: 'none',
                                                            padding: '0.65rem 0.75rem',
                                                            borderRadius: '8px',
                                                            fontWeight: 600,
                                                            fontSize: '0.82rem',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            gap: '0.4rem',
                                                            boxShadow: '0 2px 8px rgba(5, 150, 105, 0.3)'
                                                        }}
                                                    >
                                                        🏡 Property Pitch
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Single Doc Link Display */}
                                        {!isUploading && uploadedDoc && !uploadedBundleLink && (
                                            <div style={{ padding: '1.5rem', background: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                                                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#111827' }}>Public Share Link Ready</h3>
                                                <div style={{
                                                    width: '100%',
                                                    padding: '0.4rem 0.5rem 0.4rem 0.85rem',
                                                    background: 'white',
                                                    border: copiedId === 'link' ? '1.5px solid #86efac' : '1.5px solid #cbd5e1',
                                                    borderRadius: '10px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    marginBottom: '0.75rem',
                                                    transition: 'all 0.2s ease',
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                                                }}>
                                                    <input
                                                        type="text"
                                                        value={uploadedDoc.link}
                                                        readOnly
                                                        onClick={(e) => (e.target as HTMLInputElement).select()}
                                                        onFocus={(e) => e.target.select()}
                                                        style={{ fontSize: '0.85rem', flex: 1, border: 'none', background: 'transparent', outline: 'none', color: '#374151', fontFamily: 'monospace' }}
                                                    />
                                                    <button
                                                        onClick={() => copyLink(uploadedDoc.link)}
                                                        style={{
                                                            background: copiedId === 'link' ? '#16a34a' : '#4f46e5',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '8px',
                                                            padding: '0.55rem 0.95rem',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.35rem',
                                                            cursor: 'pointer',
                                                            fontWeight: 600,
                                                            fontSize: '0.82rem',
                                                            transition: 'all 0.2s ease',
                                                            flexShrink: 0,
                                                            boxShadow: copiedId === 'link' ? '0 2px 6px rgba(22, 163, 74, 0.3)' : '0 2px 6px rgba(79, 70, 229, 0.25)'
                                                        }}
                                                        title="Copy Public Link"
                                                    >
                                                        {copiedId === 'link' ? (
                                                            <>
                                                                <Check size={15} /> Copied!
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Copy size={15} /> Copy Link
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                                    <button
                                                        onClick={() => shareOnWhatsApp(uploadedDoc.link, uploadedDoc.name)}
                                                        style={{
                                                            width: '100%',
                                                            background: '#25D366',
                                                            color: 'white',
                                                            border: 'none',
                                                            padding: '0.65rem 0.75rem',
                                                            borderRadius: '8px',
                                                            fontWeight: 600,
                                                            fontSize: '0.82rem',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            gap: '0.4rem',
                                                            boxShadow: '0 2px 8px rgba(37, 211, 102, 0.3)'
                                                        }}
                                                    >
                                                        <MessageCircle size={15} /> WhatsApp
                                                    </button>
                                                    <button
                                                        onClick={() => shareOnWhatsApp(uploadedDoc.link, uploadedDoc.name, true)}
                                                        style={{
                                                            width: '100%',
                                                            background: '#059669',
                                                            color: 'white',
                                                            border: 'none',
                                                            padding: '0.65rem 0.75rem',
                                                            borderRadius: '8px',
                                                            fontWeight: 600,
                                                            fontSize: '0.82rem',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            gap: '0.4rem',
                                                            boxShadow: '0 2px 8px rgba(5, 150, 105, 0.3)'
                                                        }}
                                                    >
                                                        🏡 Property Pitch
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => copyWhatsAppDealMemo(uploadedDoc.link, uploadedDoc.name)}
                                                    style={{
                                                        marginTop: '0.5rem',
                                                        width: '100%',
                                                        background: copiedMemo ? '#10b981' : '#f1f5f9',
                                                        color: copiedMemo ? 'white' : '#334155',
                                                        border: '1px solid #cbd5e1',
                                                        padding: '0.6rem 0.85rem',
                                                        borderRadius: '8px',
                                                        fontWeight: 600,
                                                        fontSize: '0.82rem',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '0.4rem',
                                                        transition: 'all 0.2s'
                                                    }}
                                                >
                                                    {copiedMemo ? <Check size={14} /> : <CopyCheck size={14} color="#6366f1" />}
                                                    {copiedMemo ? 'Deal Memo Copied to Clipboard!' : '📋 Copy WhatsApp Deal Memo'}
                                                </button>
                                            </div>
                                        )}



                                        {/* Preview section */}
                                        {!isUploading && selectedFiles.length > 0 && filePreview && !uploadedDoc && !uploadedBundleLink && (
                                            <div style={{ width: '100%', maxHeight: '350px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1rem', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                                                {selectedFiles.length > 1 && (
                                                    <div style={{ marginBottom: '1rem', fontWeight: '600', color: '#374151' }}>Previewing first file:</div>
                                                )}
                                                {selectedFiles[0].type.startsWith('image/') ? (
                                                    <img
                                                        src={filePreview}
                                                        alt="Preview"
                                                        style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain', borderRadius: '8px' }}
                                                    />
                                                ) : selectedFiles[0].type === 'application/pdf' ? (
                                                    <iframe
                                                        src={filePreview}
                                                        style={{ width: '100%', height: '300px', border: 'none', borderRadius: '8px' }}
                                                        title="PDF Preview"
                                                    />
                                                ) : selectedFiles[0].type === 'text/plain' ? (
                                                    <iframe
                                                        src={filePreview}
                                                        style={{ width: '100%', height: '300px', border: 'none', borderRadius: '8px', background: 'white' }}
                                                        title="Text Preview"
                                                    />
                                                ) : (
                                                    <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                                                        <FileText size={64} color="#9ca3af" style={{ marginBottom: '1rem' }} />
                                                        <p style={{ fontSize: '0.875rem' }}>Preview not available for this file type</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {!isUploading && uploadedDoc && !uploadedBundleLink && (
                                            <button
                                                onClick={handlePreview}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem',
                                                    background: '#f9fafb',
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '10px',
                                                    color: '#374151',
                                                    fontWeight: '600',
                                                    fontSize: '0.9rem',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '0.5rem',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = '#f9fafb'}
                                            >
                                                <Eye size={18} />
                                                Preview Document
                                            </button>
                                        )}

                                        {/* Empty State / Placeholder */}
                                        {!isUploading && !uploadedDoc && !uploadedBundleLink && selectedFiles.length === 0 && (
                                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d1d5db', flexDirection: 'column', gap: '1rem' }}>
                                                <LinkIcon size={64} style={{ opacity: 0.3 }} />
                                                <p style={{ textAlign: 'center', maxWidth: '200px' }}>Upload a document and click "Generate Secure Link" to create a shareable link</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </main>

            {/* Preview Modal */}
            {
                showPreviewModal && (
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0, 0, 0, 0.85)',
                            zIndex: 9999,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '2rem'
                        }}
                        onClick={() => setShowPreviewModal(false)}
                    >
                        <div
                            style={{
                                background: 'white',
                                borderRadius: '16px',
                                maxWidth: '1200px',
                                width: '100%',
                                maxHeight: '90vh',
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden'
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div style={{
                                padding: '1.5rem',
                                borderBottom: '1px solid #e5e7eb',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827', marginBottom: '0.25rem' }}>
                                        {uploadedDoc?.name}
                                    </h3>
                                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                        {uploadedDoc?.size} • {uploadedDoc?.type}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowPreviewModal(false)}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '8px',
                                        border: '1px solid #e5e7eb',
                                        background: 'white',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#6b7280',
                                        fontSize: '1.5rem'
                                    }}
                                >
                                    ×
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div style={{
                                flex: 1,
                                overflow: 'auto',
                                padding: '1.5rem',
                                background: '#f9fafb',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {uploadedDoc?.type?.startsWith('image/') ? (
                                    <img
                                        src={previewUrl || undefined}
                                        alt={uploadedDoc?.name}
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '100%',
                                            objectFit: 'contain',
                                            borderRadius: '8px'
                                        }}
                                    />
                                ) : uploadedDoc?.type === 'application/pdf' ? (
                                    <iframe
                                        src={previewUrl || undefined}
                                        style={{
                                            width: '100%',
                                            height: '600px',
                                            border: 'none',
                                            borderRadius: '8px',
                                            background: 'white'
                                        }}
                                        title="PDF Preview"
                                    />
                                ) : uploadedDoc?.type === 'text/plain' ? (
                                    <iframe
                                        src={previewUrl || undefined}
                                        style={{
                                            width: '100%',
                                            height: '600px',
                                            border: 'none',
                                            borderRadius: '8px',
                                            background: 'white',
                                            padding: '1rem'
                                        }}
                                        title="Text Preview"
                                    />
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                                        <FileText size={80} color="#9ca3af" style={{ marginBottom: '1.5rem' }} />
                                        <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                                            Preview not available
                                        </h4>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                            This file type cannot be previewed in the browser
                                        </p>
                                        <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: '#9ca3af' }}>
                                            {uploadedDoc?.type || 'Unknown type'}
                                        </p>
                                        <a
                                            href={uploadedDoc?.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                display: 'inline-block',
                                                marginTop: '1.5rem',
                                                padding: '0.75rem 1.5rem',
                                                background: '#4f46e5',
                                                color: 'white',
                                                borderRadius: '8px',
                                                textDecoration: 'none',
                                                fontWeight: '600',
                                                fontSize: '0.875rem'
                                            }}
                                        >
                                            Open in New Tab
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }





            {/* Upgrade Modal */}
            <UpgradeModal
                isOpen={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
                featureName={lockedFeatureName}
            />
        </div >
    );
};

export default DataRoom;
