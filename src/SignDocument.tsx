
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from './lib/supabase';
import * as pdfjsLib from 'pdfjs-dist';
import {
    Check,
    AlertCircle,
    Calendar,
    Type,
    PenTool,
    Loader2,
    Mail,
    Building,
    Briefcase,
    Stamp as StampIcon,
    ArrowRight,
    Sparkles
} from 'lucide-react';
import { logAuditEvent, getUserIP, getSessionId } from './lib/auditLogger';
import SignatureCanvasComponent from './components/SignatureCanvas';
import StampSelector, { STAMPS } from './components/esignature/StampSelector';
import type { StampType } from './components/esignature/StampSelector';

// Set worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface Signer {
    id: string;
    signer_name: string;
    signer_email: string;
    status: 'pending' | 'viewed' | 'signed';
}

interface DocumentData {
    id: string;
    name: string;
    file_path: string;
    file_type: string;
    is_encrypted: boolean;
    encryption_key?: string;
    encryption_iv?: string;
    original_file_type?: string;
    user_id: string; // owner
}

interface SignatureField {
    id: string;
    field_type: 'signature' | 'initials' | 'text' | 'date' | 'checkbox' | 'email' | 'company' | 'title' | 'stamp';
    page_number: number;
    position_x: number;
    position_y: number;
    width: number;
    height: number;
    assigned_signer_id: string;
    is_required: boolean;
    value?: string;
    stampType?: string;
}

const SignDocument: React.FC = () => {
    const { signingLink } = useParams<{ signingLink: string }>();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [signer, setSigner] = useState<Signer | null>(null);
    const [documentData, setDocumentData] = useState<DocumentData | null>(null);
    const [fields, setFields] = useState<SignatureField[]>([]);
    const [pdfPages, setPdfPages] = useState<string[]>([]);
    const [activeFieldId, setActiveFieldId] = useState<string | null>(null);
    const [showSignatureCanvas, setShowSignatureCanvas] = useState(false);
    const [isStampSelectorOpen, setIsStampSelectorOpen] = useState(false);
    const [signatureRecords, setSignatureRecords] = useState<Record<string, string>>({}); // fieldId -> signatureData (base64)
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    // Initial Fetch
    useEffect(() => {
        const init = async () => {
            if (!signingLink) return;

            try {
                // 1. Get Signer & Document Info
                const { data: signerData, error: signerError } = await supabase
                    .from('document_signers')
                    .select('*, documents(*)')
                    .eq('signing_link', signingLink)
                    .single();

                if (signerError || !signerData) {
                    throw new Error('Invalid signing link.');
                }

                setSigner({
                    id: signerData.id,
                    signer_name: signerData.signer_name,
                    signer_email: signerData.signer_email,
                    status: signerData.status
                });

                const doc = signerData.documents;
                if (!doc) throw new Error('Document not found.');

                setDocumentData(doc);

                // 2. Mark as viewed if pending
                if (signerData.status === 'pending') {
                    await supabase
                        .from('document_signers')
                        .update({ status: 'viewed', viewed_at: new Date().toISOString() })
                        .eq('id', signerData.id);

                    // Log audit event for signer viewing
                    const ip = await getUserIP();
                    logAuditEvent({
                        eventType: 'document_viewed',
                        documentId: doc.id,
                        signerId: signerData.id,
                        userEmail: signerData.signer_email,
                        ipAddress: ip,
                        sessionId: getSessionId(),
                        userAgent: navigator.userAgent,
                        metadata: { source: 'signing_link' }
                    });
                }

                // 3. Get Signature Fields
                const { data: fieldsData } = await supabase
                    .from('signature_fields')
                    .select('*')
                    .eq('document_id', doc.id);

                if (fieldsData) {
                    setFields(fieldsData);
                    if (fieldsData.length > 0) {
                        const fieldIds = fieldsData.map(f => f.id);
                        const { data: recordsData, error: recordsError } = await supabase
                            .from('signature_records')
                            .select('signature_field_id, signature_data')
                            .in('signature_field_id', fieldIds);

                        if (recordsError) {
                            console.error('Error fetching signature records:', recordsError);
                        } else if (recordsData) {
                            const recordsMap: Record<string, string> = {};
                            recordsData.forEach(rec => {
                                recordsMap[rec.signature_field_id] = rec.signature_data;
                            });
                            setSignatureRecords(recordsMap);
                        }
                    }
                }

                // 4. Download & Render Document
                await renderDocument(doc);

            } catch (err: any) {
                console.error('Initialization error:', err);
                setError(err.message || 'Failed to load document.');
            } finally {
                setLoading(false);
            }
        };

        init();
    }, [signingLink]);

    const renderDocument = async (doc: DocumentData) => {
        try {
            const { data, error } = await supabase.storage
                .from('documents')
                .download(doc.file_path);

            if (error) throw error;

            let blob = data;

            if (doc.file_type === 'application/pdf' || doc.original_file_type === 'application/pdf') {
                // Render PDF
                const arrayBuffer = await blob.arrayBuffer();
                const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                const pages: string[] = [];

                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const viewport = page.getViewport({ scale: 1.5 });
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    if (context) {
                        await page.render({ canvasContext: context, canvas, viewport }).promise;
                        pages.push(canvas.toDataURL('image/jpeg'));
                    }
                }
                setPdfPages(pages);
            } else {
                // Image
                const url = URL.createObjectURL(blob);
                setPdfPages([url]);
            }
        } catch (err) {
            console.error('Render error:', err);
            setError('Failed to render document.');
        }
    };

    const handleFieldClick = (field: SignatureField) => {
        if (field.assigned_signer_id !== signer?.id) return;
        setActiveFieldId(field.id);

        if (field.field_type === 'signature' || field.field_type === 'initials') {
            setShowSignatureCanvas(true);
        } else if (field.field_type === 'checkbox') {
            // Toggle checkbox
            const currentVal = signatureRecords[field.id];
            const newVal = currentVal === 'checked' ? '' : 'checked';
            handleSignatureSave(newVal, 'value');
        } else if (['text', 'email', 'company', 'title'].includes(field.field_type)) {
            const currentVal = signatureRecords[field.id] || '';
            const val = window.prompt(`Enter ${field.field_type}:`, currentVal);
            if (val !== null) {
                handleSignatureSave(val, 'value');
            }
        } else if (field.field_type === 'date') {
            handleSignatureSave(new Date().toLocaleDateString(), 'value');
        } else if (field.field_type === 'stamp') {
            setIsStampSelectorOpen(true);
        }
    };

    const handleStampSelect = async (stampType: StampType) => {
        if (!activeFieldId || !signer) return;
        setIsStampSelectorOpen(false);
        await handleSignatureSave(stampType, 'uploaded');
    };

    const handleSignatureSave = async (data: string, type: 'drawn' | 'typed' | 'uploaded' | 'value') => {
        if (!activeFieldId || !signer) return;

        // Optimistic update
        setSignatureRecords(prev => ({
            ...prev,
            [activeFieldId]: data
        }));

        if (type !== 'value') {
            setShowSignatureCanvas(false);
        }
        setActiveFieldId(null);

        // Ideally we save to DB here or at the end. Saving here is safer.
        // But for 'value' types we might want to wait. 
        // Let's implement 'Finish' to save all.
        // OR save individual records now? The requirements say "Users can ...".
        // Let's save individually for better UX persistence? 
        // Actually, let's just keep in state and save all at 'Finish' 
        // OR save to DB immediately to avoid data loss.
        // Let's save immediately.

        try {
            // Check if record exists
            const { data: existing } = await supabase
                .from('signature_records')
                .select('id')
                .eq('signature_field_id', activeFieldId)
                .single();

            if (existing) {
                await supabase
                    .from('signature_records')
                    .update({
                        signature_data: data,
                        signature_type: type,
                        signed_at: new Date().toISOString()
                    })
                    .eq('signature_field_id', activeFieldId);
            } else {
                await supabase
                    .from('signature_records')
                    .insert({
                        signature_field_id: activeFieldId,
                        signer_id: signer.id,
                        signature_data: data,
                        signature_type: type,
                        ip_address: await getUserIP(),
                        user_agent: navigator.userAgent
                    });
            }
        } catch (err) {
            console.error('Error saving signature record:', err);
        }
    };

    const handleFinish = async () => {
        if (!signer || !documentData) return;

        // Validate required fields
        const myFields = fields.filter(f => f.assigned_signer_id === signer.id);
        const missing = myFields.filter(f => f.is_required && !signatureRecords[f.id]);

        if (missing.length > 0) {
            alert(`Please fill in all required fields (${missing.length} remaining).`);
            return;
        }

        setSubmitting(true);
        try {
            // Update signer status
            const { error } = await supabase
                .from('document_signers')
                .update({
                    status: 'signed',
                    signed_at: new Date().toISOString(),
                    ip_address: await getUserIP(),
                    user_agent: navigator.userAgent
                })
                .eq('id', signer.id);

            if (error) throw error;

            // Log audit event for signing
            await logAuditEvent({
                eventType: 'document_signed',
                documentId: documentData.id,
                signerId: signer.id,
                userEmail: signer.signer_email,
                ipAddress: await getUserIP(),
                sessionId: getSessionId(),
                userAgent: navigator.userAgent,
                metadata: {
                    workflow_status: 'completed'
                }
            });

            setSuccess(true);
        } catch (err: any) {
            console.error('Finish error:', err);
            alert('Failed to complete signing. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
                <div style={{ textAlign: 'center' }}>
                    <Loader2 className="animate-spin" size={48} color="#4f46e5" style={{ margin: '0 auto 1rem' }} />
                    <p style={{ color: '#6b7280' }}>Loading document...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
                <div style={{ textAlign: 'center', padding: '2rem', background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <AlertCircle size={48} color="#ef4444" style={{ margin: '0 auto 1rem' }} />
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>Unable to Access Document</h2>
                    <p style={{ color: '#6b7280' }}>{error}</p>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <>
                {/* Keyframe animations for the success screen */}
                <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                    
                    @keyframes dt-fadeInUp {
                        from { opacity: 0; transform: translateY(24px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes dt-scalePulse {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.08); }
                    }
                    @keyframes dt-shimmer {
                        0% { background-position: -200% center; }
                        100% { background-position: 200% center; }
                    }
                    @keyframes dt-float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-6px); }
                    }
                    @keyframes dt-checkDraw {
                        from { stroke-dashoffset: 36; }
                        to { stroke-dashoffset: 0; }
                    }
                    @keyframes dt-ringExpand {
                        0% { transform: scale(0.6); opacity: 0; }
                        50% { transform: scale(1.15); opacity: 0.4; }
                        100% { transform: scale(1); opacity: 1; }
                    }
                    .dt-cta-btn:hover {
                        transform: translateY(-2px) !important;
                        box-shadow: 0 8px 30px rgba(79, 70, 229, 0.4) !important;
                    }
                    .dt-cta-btn:active {
                        transform: translateY(0px) !important;
                    }
                    .dt-secondary-link:hover {
                        color: #4f46e5 !important;
                    }
                    .dt-feature-row:hover {
                        background: rgba(79, 70, 229, 0.04);
                    }
                `}</style>
                
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(145deg, #0f172a 0%, #1e1b4b 40%, #312e81 70%, #1e1b4b 100%)',
                    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                    padding: '1.5rem',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Ambient background orbs */}
                    <div style={{ position: 'absolute', top: '-120px', right: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', bottom: '-100px', left: '-60px', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', top: '30%', left: '10%', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

                    {/* Main glassmorphic card */}
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.06)',
                        backdropFilter: 'blur(24px)',
                        WebkitBackdropFilter: 'blur(24px)',
                        borderRadius: '28px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        padding: '2.5rem 2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        maxWidth: '480px',
                        width: '100%',
                        boxShadow: '0 32px 64px -12px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
                        animation: 'dt-fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                    }}>
                        
                        {/* Animated Success Badge */}
                        <div style={{
                            position: 'relative',
                            marginBottom: '1.75rem',
                            animation: 'dt-ringExpand 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both'
                        }}>
                            {/* Outer pulse ring */}
                            <div style={{
                                position: 'absolute',
                                inset: '-8px',
                                borderRadius: '50%',
                                border: '2px solid rgba(74, 222, 128, 0.25)',
                                animation: 'dt-scalePulse 2.5s ease-in-out infinite'
                            }} />
                            <div style={{
                                width: '76px',
                                height: '76px',
                                background: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 0 32px rgba(16, 185, 129, 0.3), 0 0 0 6px rgba(16, 185, 129, 0.08)'
                            }}>
                                <Check size={38} color="#ffffff" strokeWidth={3} />
                            </div>
                        </div>

                        <h1 style={{
                            fontSize: '1.85rem',
                            fontWeight: '900',
                            background: 'linear-gradient(135deg, #ffffff 0%, #c7d2fe 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            marginBottom: '0.6rem',
                            letterSpacing: '-0.03em',
                            lineHeight: '1.2'
                        }}>
                            Document Signed Successfully
                        </h1>
                        <p style={{
                            color: 'rgba(203, 213, 225, 0.85)',
                            fontSize: '0.9rem',
                            lineHeight: '1.65',
                            marginBottom: '1.75rem',
                            maxWidth: '380px'
                        }}>
                            A confirmation will be sent to <span style={{ color: '#a5b4fc', fontWeight: '600' }}>{signer?.signer_email}</span> once all parties have completed signing.
                        </p>

                        {/* Divider */}
                        <div style={{ width: '100%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)', marginBottom: '1.75rem' }} />

                        {/* PLG Growth Loop Banner */}
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.08) 100%)',
                            border: '1px solid rgba(129, 140, 248, 0.15)',
                            borderRadius: '20px',
                            padding: '1.5rem',
                            width: '100%',
                            boxSizing: 'border-box',
                            marginBottom: '1.5rem',
                            textAlign: 'left',
                            animation: 'dt-fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both'
                        }}>
                            {/* Pro badge */}
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
                                color: '#a5b4fc',
                                padding: '0.3rem 0.85rem',
                                borderRadius: '9999px',
                                fontSize: '0.7rem',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                letterSpacing: '0.08em',
                                marginBottom: '0.85rem',
                                border: '1px solid rgba(129, 140, 248, 0.15)'
                            }}>
                                <Sparkles size={11} style={{ animation: 'dt-float 3s ease-in-out infinite' }} /> DocTransfer
                            </div>
                            
                            <h2 style={{
                                fontSize: '1.15rem',
                                fontWeight: '800',
                                color: '#f1f5f9',
                                margin: '0 0 0.45rem 0',
                                letterSpacing: '-0.01em',
                                lineHeight: '1.3'
                            }}>
                                Need to send or track your own documents?
                            </h2>
                            <p style={{
                                fontSize: '0.82rem',
                                color: 'rgba(148, 163, 184, 0.9)',
                                lineHeight: '1.55',
                                margin: '0 0 1.25rem 0'
                            }}>
                                Create contracts, send legally-binding signature requests, and track views with military-grade security.
                            </p>

                            {/* Feature checklist */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', marginBottom: '1.35rem' }}>
                                {[
                                    'Send 3 free document requests/month',
                                    'Compliant with ESIGN & eIDAS',
                                    'Real-time access & download analytics'
                                ].map((feature, i) => (
                                    <div
                                        key={i}
                                        className="dt-feature-row"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.6rem',
                                            fontSize: '0.8rem',
                                            color: 'rgba(203, 213, 225, 0.9)',
                                            fontWeight: '500',
                                            padding: '0.3rem 0.4rem',
                                            borderRadius: '8px',
                                            transition: 'background 0.2s ease'
                                        }}
                                    >
                                        <div style={{
                                            width: '18px',
                                            height: '18px',
                                            borderRadius: '50%',
                                            background: 'rgba(16, 185, 129, 0.15)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0
                                        }}>
                                            <Check size={11} color="#34d399" strokeWidth={3} />
                                        </div>
                                        {feature}
                                    </div>
                                ))}
                            </div>

                            {/* Primary CTA button */}
                            <button
                                className="dt-cta-btn"
                                onClick={() => window.location.href = '/checkout?utm_source=signature_success'}
                                style={{
                                    width: '100%',
                                    padding: '0.85rem 1rem',
                                    border: 'none',
                                    borderRadius: '14px',
                                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #6366f1 100%)',
                                    backgroundSize: '200% auto',
                                    color: 'white',
                                    fontWeight: '700',
                                    fontSize: '0.92rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    boxShadow: '0 4px 20px rgba(79, 70, 229, 0.3), inset 0 1px 0 rgba(255,255,255,0.15)',
                                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                    letterSpacing: '-0.01em',
                                    fontFamily: "'Inter', system-ui, sans-serif"
                                }}
                            >
                                Send 3 Free Documents
                                <ArrowRight size={16} style={{ transition: 'transform 0.2s' }} />
                            </button>
                        </div>

                        {/* Secondary link */}
                        <button
                            className="dt-secondary-link"
                            onClick={() => window.location.href = '/'}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'rgba(148, 163, 184, 0.7)',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                transition: 'color 0.2s ease',
                                fontFamily: "'Inter', system-ui, sans-serif"
                            }}
                        >
                            Learn More About DocTransfer
                        </button>

                        {/* Powered by footer */}
                        <div style={{
                            marginTop: '1.5rem',
                            paddingTop: '1rem',
                            borderTop: '1px solid rgba(255,255,255,0.06)',
                            width: '100%',
                            textAlign: 'center'
                        }}>
                            <span style={{
                                fontSize: '0.7rem',
                                color: 'rgba(100, 116, 139, 0.6)',
                                fontWeight: '500',
                                letterSpacing: '0.03em'
                            }}>
                                Secured & powered by DocTransfer
                            </span>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <div style={{ background: '#f3f4f6', minHeight: '100vh', paddingBottom: '100px' }}>
            {/* Header */}
            <header style={{
                position: 'sticky', top: 0, zIndex: 50, background: 'white', borderBottom: '1px solid #e5e7eb',
                padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', background: '#4f46e5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700' }}>
                        DT
                    </div>
                    <div>
                        <h1 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#111827', margin: 0 }}>{documentData?.name}</h1>
                        <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: 0 }}>Signing as {signer?.signer_name}</p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={handleFinish}
                        disabled={submitting}
                        style={{
                            padding: '0.75rem 1.5rem', background: '#4f46e5', color: 'white',
                            border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            opacity: submitting ? 0.7 : 1
                        }}
                    >
                        {submitting && <Loader2 className="animate-spin" size={18} />}
                        Finish Signing
                    </button>
                </div>
            </header>

            {/* Document Content */}
            <main style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
                {pdfPages.map((pageImg, index) => (
                    <div
                        key={index}
                        style={{
                            position: 'relative',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                            background: 'white',
                            maxWidth: '100%',
                            width: '800px' // Ideal width, but responsive
                        }}
                    >
                        <img src={pageImg} alt={`Page ${index + 1}`} style={{ width: '100%', display: 'block' }} />

                        {/* Fields Overlay */}
                        {fields.filter(f => f.page_number === index + 1).map(field => {
                            const isMyField = field.assigned_signer_id === signer?.id;
                            const isSigned = !!signatureRecords[field.id];

                            return (
                                <div
                                    key={field.id}
                                    onClick={() => handleFieldClick(field)}
                                    style={{
                                        position: 'absolute',
                                        left: `${field.position_x}%`,
                                        top: `${field.position_y}%`,
                                        width: `${field.width}%`,
                                        height: `${field.height}%`,
                                        background: isSigned ? 'rgba(220, 252, 231, 0.8)' : isMyField ? 'rgba(238, 242, 255, 0.6)' : 'rgba(243, 244, 246, 0.5)',
                                        border: isSigned ? '2px solid #16a34a' : isMyField ? '2px dashed #4f46e5' : '1px solid #d1d5db',
                                        borderRadius: '4px',
                                        cursor: isMyField ? 'pointer' : 'default',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.2s',
                                        pointerEvents: isMyField ? 'auto' : 'none'
                                    }}
                                >
                                    {isSigned ? (
                                        field.field_type === 'signature' || field.field_type === 'initials' ? (
                                            <img src={signatureRecords[field.id]} alt="Signature" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                        ) : field.field_type === 'checkbox' ? (
                                            signatureRecords[field.id] === 'checked' || signatureRecords[field.id] === 'true' ? <Check color="#16a34a" /> : null
                                        ) : field.field_type === 'stamp' ? (
                                            STAMPS[signatureRecords[field.id] as StampType]?.component || (
                                                <span style={{ fontSize: '0.9rem', color: '#dc2626', fontWeight: 'bold' }}>STAMPED</span>
                                            )
                                        ) : (
                                            <span style={{ fontSize: '0.9rem', color: '#166534', fontWeight: '500' }}>{signatureRecords[field.id]}</span>
                                        )
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: isMyField ? '#4f46e5' : '#9ca3af', fontSize: '0.8rem', fontWeight: '600', width: '100%', justifyContent: 'center', overflow: 'hidden', whiteSpace: 'nowrap', textTransform: 'capitalize' }}>
                                            {field.field_type === 'signature' && <PenTool size={14} />}
                                            {field.field_type === 'initials' && <Type size={14} />}
                                            {field.field_type === 'date' && <Calendar size={14} />}
                                            {field.field_type === 'email' && <Mail size={14} />}
                                            {field.field_type === 'company' && <Building size={14} />}
                                            {field.field_type === 'title' && <Briefcase size={14} />}
                                            {field.field_type === 'stamp' && <StampIcon size={14} />}
                                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {isMyField ? (field.field_type === 'signature' ? 'Sign Here' : field.field_type === 'initials' ? 'Initials' : field.field_type) : 'Other Signer'}
                                            </span>
                                            {field.is_required && <span style={{ color: '#dc2626' }}>*</span>}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </main>

            {/* Signature Canvas Modal */}
            {showSignatureCanvas && activeFieldId && (
                <SignatureCanvasComponent
                    onClose={() => setShowSignatureCanvas(false)}
                    onSave={handleSignatureSave}
                    isInitials={fields.find(f => f.id === activeFieldId)?.field_type === 'initials'}
                    title={fields.find(f => f.id === activeFieldId)?.field_type === 'initials' ? 'Adopt Your Initials' : 'Adopt Your Signature'}
                    defaultValue={signer?.signer_name || ''}
                />
            )}

            {/* Stamp Selector Modal */}
            {isStampSelectorOpen && (
                <StampSelector
                    isOpen={isStampSelectorOpen}
                    onClose={() => setIsStampSelectorOpen(false)}
                    onSelect={handleStampSelect}
                />
            )}
        </div>
    );
};

export default SignDocument;
