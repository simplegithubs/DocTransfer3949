import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { supabase, createSupabaseClient, getSafeSupabaseToken } from '../../lib/supabase';
import { generatePdfFromTemplate } from '../../lib/pdfTemplateGenerator';
import { setupTemplateSignatures } from '../../lib/templateSignatures';
import { logDocumentUpload } from '../../lib/auditLogger';
import { type Template } from './templateData';
import type { PlacedField } from '../../lib/templateSignatures';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import {
    ArrowLeft, Save, Sparkles, User, Mail, ChevronRight, Check,
    PenTool, Type, Calendar, CheckSquare, Building, Briefcase, Stamp,
    Trash2, GripVertical, X, MousePointer, Info, AlertCircle, BookmarkCheck,
    FileText
} from 'lucide-react';
import SignatureCanvasComponent from '../SignatureCanvas';
import StampSelector, { STAMPS } from '../esignature/StampSelector';
import type { StampType } from '../esignature/StampSelector';

// Set worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface TemplateWizardProps {
    template: any; // Can be predefined Template or custom dynamic Template
    onClose: () => void;
    onSuccess: () => void;
}

// ─── E-Signature Tool Definitions ───────────────────────────────────────────
const ESIGN_TOOLS = [
    { type: 'signature', label: 'Signature', icon: PenTool, color: '#4f46e5', defaultW: 150, defaultH: 50 },
    { type: 'initials', label: 'Initials', icon: Type, color: '#8b5cf6', defaultW: 100, defaultH: 50 },
    { type: 'date', label: 'Date Signed', icon: Calendar, color: '#059669', defaultW: 120, defaultH: 35 },
    { type: 'text', label: 'Text Box', icon: Type, color: '#f59e0b', defaultW: 200, defaultH: 35 },
    { type: 'checkbox', label: 'Checkbox', icon: CheckSquare, color: '#ef4444', defaultW: 30, defaultH: 30 },
    { type: 'email', label: 'Email', icon: Mail, color: '#0ea5e9', defaultW: 200, defaultH: 35 },
    { type: 'company', label: 'Company', icon: Building, color: '#64748b', defaultW: 200, defaultH: 35 },
    { type: 'title', label: 'Job Title', icon: Briefcase, color: '#7c3aed', defaultW: 200, defaultH: 35 },
    { type: 'stamp', label: 'Stamp', icon: Stamp, color: '#e11d48', defaultW: 100, defaultH: 100 },
] as const;

// ─── Canvas Field Interface ─────────────────────────────────────────────────
interface CanvasField {
    id: string;
    type: string;
    x: number; // pixels
    y: number; // pixels
    width: number;
    height: number;
    signerId: string; // role ID or party_a/party_b
    color: string;
    label: string;
    page_number: number;
    value?: string;
    stampType?: string;
}

const TemplateWizard: React.FC<TemplateWizardProps> = ({ template, onClose, onSuccess }) => {
    const { user } = useUser();
    const { getToken } = useAuth();

    // ─── State Management for Custom vs. System Templates ──────────────────
    const [variables, setVariables] = useState<string[]>([]);
    
    // Extract variables from text brackets
    useEffect(() => {
        if (template.isCustom && template.rawTemplate?.content_json?.text) {
            const matches = template.rawTemplate.content_json.text.match(/\[([^\]]+)\]/g);
            if (matches) {
                const uniqueVars = Array.from(new Set(matches.map((m: string) => m.slice(1, -1)))) as string[];
                setVariables(uniqueVars);
            }
        }
    }, [template]);

    // Render uploaded PDF backdrop if custom template has PDF backdrop file
    const [pdfPages, setPdfPages] = useState<string[]>([]);
    const [renderingPdf, setRenderingPdf] = useState(false);

    useEffect(() => {
        const renderPDFBackdrop = async () => {
            if (!template.isCustom || !template.rawTemplate?.file_path) {
                setPdfPages([]);
                return;
            }
            setRenderingPdf(true);
            try {
                const token = await getSafeSupabaseToken(getToken);
                const authenticatedSupabase = createSupabaseClient(token || undefined);
                const { data: fileData, error: downloadError } = await authenticatedSupabase.storage
                    .from('documents')
                    .download(template.rawTemplate.file_path);

                if (downloadError) throw new Error(`Failed to download template backdrop: ${downloadError.message}`);

                const arrayBuffer = await fileData.arrayBuffer();
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
            } catch (err) {
                console.error('Failed to render PDF pages locally in Wizard:', err);
                setErrorMsg('Error rendering PDF backdrop. You can still proceed, but pages won\'t display visually.');
            } finally {
                setRenderingPdf(false);
            }
        };

        renderPDFBackdrop();
    }, [template]);

    // Calculate Steps dynamically
    const isCustomText = template.isCustom && template.rawTemplate?.content_json?.text;
    
    // If text template has variables configured or parsed
    const hasVars = template.isCustom 
        ? (template.rawTemplate.content_json?.variables?.length > 0 || variables.length > 0)
        : true;

    const formStepsCount = template.isCustom 
        ? (isCustomText && hasVars ? 1 : 0)
        : Math.max(...template.fields.map((f: any) => f.step));

    const signerStep = formStepsCount + 1;
    const prepareStep = formStepsCount + 2;
    const totalSteps = prepareStep;
    
    const [currentStep, setCurrentStep] = useState(1);

    // If step calculation yields 0 form steps, start directly at Signer Step
    useEffect(() => {
        if (formStepsCount === 0 && currentStep === 1) {
            setCurrentStep(signerStep);
        }
    }, [formStepsCount]);

    // Initialize form values
    const [formValues, setFormValues] = useState<Record<string, any>>(() => {
        const initialValues: Record<string, any> = {};
        if (template.isCustom) {
            // Handled dynamically
        } else {
            template.fields.forEach((field: any) => {
                initialValues[field.id] = field.defaultValue;
            });
        }
        return initialValues;
    });

    // Recipient state for e-signing (System templates)
    const [recipientName, setRecipientName] = useState('');
    const [recipientEmail, setRecipientEmail] = useState('');

    // Signer Details state for Custom templates (roleId -> { name, email })
    const [signerDetails, setSignerDetails] = useState<Record<string, { name: string; email: string }>>({});

    // Populate initial signers for custom template
    useEffect(() => {
        if (template.isCustom && template.rawTemplate?.roles) {
            const initialDetails: Record<string, { name: string; email: string }> = {};
            template.rawTemplate.roles.forEach((r: any, idx: number) => {
                if (idx === 0) {
                    initialDetails[r.id] = {
                        name: user?.fullName || '',
                        email: user?.primaryEmailAddress?.emailAddress || ''
                    };
                } else {
                    initialDetails[r.id] = { name: '', email: '' };
                }
            });
            setSignerDetails(initialDetails);
        }
    }, [template, user]);

    const [isGenerating, setIsGenerating] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // ─── E-Signature Canvas State ───────────────────────────────────────────
    const [canvasFields, setCanvasFields] = useState<CanvasField[]>([]);
    const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
    
    // Default active signer ID
    const [activeSigner, setActiveSigner] = useState<string>('party_a');
    
    // Sync default active signer
    useEffect(() => {
        if (template.isCustom && template.rawTemplate?.roles?.length > 0) {
            setActiveSigner(template.rawTemplate.roles[0].id);
        } else {
            setActiveSigner('party_a');
        }
    }, [template]);

    // Preload canvas fields if custom template
    useEffect(() => {
        if (template.isCustom && template.rawTemplate?.fields) {
            const loaded = template.rawTemplate.fields.map((f: any) => {
                const role = template.rawTemplate.roles?.find((r: any) => r.id === f.role_id);
                return {
                    id: f.id,
                    type: f.field_type,
                    x: (parseFloat(f.position_x) / 100) * 680, // 680 is canvas width in step 3 view
                    y: (parseFloat(f.position_y) / 100) * 960,  // 960 is canvas height
                    width: parseFloat(f.width),
                    height: parseFloat(f.height),
                    signerId: f.role_id,
                    page_number: f.page_number || 1,
                    color: role?.color || '#6366f1',
                    label: `${role?.role_name || 'Role'} ${f.field_type.toUpperCase()}`
                };
            });
            setCanvasFields(loaded);
        }
    }, [template]);

    const [draggingTool, setDraggingTool] = useState<typeof ESIGN_TOOLS[number] | null>(null);
    const [isDraggingField, setIsDraggingField] = useState(false);
    const wasDraggingRef = useRef(false); // Track if a real drag occurred (used to skip onClick after drag)
    const canvasRef = useRef<HTMLDivElement>(null);

    const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
    const [isStampSelectorOpen, setIsStampSelectorOpen] = useState(false);
    const [activeFieldToSignId, setActiveFieldToSignId] = useState<string | null>(null);

    const handleInputChange = (fieldId: string, value: any) => {
        setFormValues(prev => ({ ...prev, [fieldId]: value }));
    };

    const isSenderField = (field: CanvasField) => {
        if (template.isCustom) {
            const firstRole = template.rawTemplate?.roles?.[0];
            return firstRole && field.signerId === firstRole.id;
        }
        return field.signerId === 'party_a';
    };

    const handleSignatureSave = (data: string, _type?: 'drawn' | 'typed' | 'uploaded') => {
        if (activeFieldToSignId) {
            setCanvasFields(prev => prev.map(f => f.id === activeFieldToSignId ? { ...f, value: data } : f));
            setIsSignatureModalOpen(false);
            setActiveFieldToSignId(null);
        }
    };

    const handleStampSelect = (stampType: StampType) => {
        if (activeFieldToSignId) {
            setCanvasFields(prev => prev.map(f => f.id === activeFieldToSignId ? { ...f, value: stampType, stampType } : f));
            setIsStampSelectorOpen(false);
            setActiveFieldToSignId(null);
        }
    };

    // ─── Signer colors & definitions ────────────────────────────────────────────
    const getSignerColor = (signerId: string) => {
        if (template.isCustom) {
            const role = template.rawTemplate?.roles?.find((r: any) => r.id === signerId);
            return role?.color || '#6366f1';
        }
        return signerId === 'party_a' ? '#4f46e5' : '#ec4899';
    };

    // ─── Highlight helper for live document preview ─────────────────────────
    const renderTextWithHighlights = (text: string) => {
        if (!text) return '';
        
        const sortedValues = Object.entries(formValues)
            .filter(([_, val]) => val !== undefined && val !== null && String(val).trim() !== '' && typeof val !== 'boolean')
            .map(([_, val]) => String(val))
            .sort((a, b) => b.length - a.length);

        if (sortedValues.length === 0) return text;

        const escapedVals = sortedValues.map(v => v.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
        const regex = new RegExp(`(${escapedVals.join('|')})`, 'g');
        const parts = text.split(regex);

        return parts.map((part, index) => {
            const isMatch = sortedValues.includes(part);
            return isMatch ? (
                <span 
                    key={index} 
                    style={{
                        background: 'linear-gradient(120deg, #e0e7ff 0%, #f3e8ff 100%)',
                        color: '#4f46e5',
                        padding: '2px 6px',
                        borderRadius: '6px',
                        fontWeight: '600',
                        border: '1px solid #c7d2fe',
                        display: 'inline-block',
                        margin: '0 2px',
                        boxShadow: '0 2px 4px rgba(79, 70, 229, 0.05)'
                    }}
                >
                    {part}
                </span>
            ) : part;
        });
    };

    // ─── Canvas field management ────────────────────────────────────────────
    const handleCanvasDrop = useCallback((e: React.DragEvent, pageNumber: number) => {
        e.preventDefault();
        if (!draggingTool) return;

        const pageContainer = e.currentTarget as HTMLDivElement;
        const rect = pageContainer.getBoundingClientRect();
        const x = e.clientX - rect.left - draggingTool.defaultW / 2;
        const y = e.clientY - rect.top - draggingTool.defaultH / 2;

        const newField: CanvasField = {
            id: `field_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            type: draggingTool.type,
            x: Math.max(0, Math.min(x, rect.width - draggingTool.defaultW)),
            y: Math.max(0, Math.min(y, rect.height - draggingTool.defaultH)),
            width: draggingTool.defaultW,
            height: draggingTool.defaultH,
            signerId: activeSigner,
            page_number: pageNumber,
            color: getSignerColor(activeSigner),
            label: `${template.isCustom ? (template.rawTemplate.roles.find((r: any) => r.id === activeSigner)?.role_name || 'Role') : (activeSigner === 'party_a' ? 'You' : 'Recipient')} ${draggingTool.label}`
        };

        setCanvasFields(prev => [...prev, newField]);
        setSelectedFieldId(newField.id);
        setDraggingTool(null);
    }, [draggingTool, activeSigner, template]);

    const handleFieldMouseDown = (e: React.MouseEvent, fieldId: string) => {
        e.stopPropagation();
        // NOTE: Do NOT call e.preventDefault() here — it prevents onClick from firing,
        // which is needed to open signature/stamp modals.
        const field = canvasFields.find(f => f.id === fieldId);
        if (!field) return;

        setSelectedFieldId(fieldId);
        wasDraggingRef.current = false; // Reset at the start of each interaction

        const pageContainer = e.currentTarget.parentElement as HTMLDivElement;
        const rect = pageContainer.getBoundingClientRect();

        const startX = e.clientX;
        const startY = e.clientY;
        const startX_px = field.x;
        const startY_px = field.y;
        const DRAG_THRESHOLD = 5; // px – ignore tiny movements to allow click-through

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const deltaX = moveEvent.clientX - startX;
            const deltaY = moveEvent.clientY - startY;

            // Only start dragging after exceeding the threshold
            if (!wasDraggingRef.current && Math.abs(deltaX) < DRAG_THRESHOLD && Math.abs(deltaY) < DRAG_THRESHOLD) {
                return;
            }
            wasDraggingRef.current = true;
            setIsDraggingField(true);

            setCanvasFields(prev => prev.map(f => {
                if (f.id !== fieldId) return f;
                return {
                    ...f,
                    x: Math.max(0, Math.min(startX_px + deltaX, rect.width - f.width)),
                    y: Math.max(0, Math.min(startY_px + deltaY, rect.height - f.height))
                };
            }));
        };

        const handleMouseUp = () => {
            setIsDraggingField(false);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const deleteField = (fieldId: string) => {
        setCanvasFields(prev => prev.filter(f => f.id !== fieldId));
        if (selectedFieldId === fieldId) setSelectedFieldId(null);
    };

    // ─── Generate & Send ────────────────────────────────────────────────────
    const handleGenerate = async () => {
        setIsGenerating(true);
        setErrorMsg(null);

        try {
            const token = await getSafeSupabaseToken(getToken);
            const authenticatedSupabase = createSupabaseClient(token || undefined);

            let pdfBytes: Uint8Array;
            let pageCount = 1;
            let signatureY = 150;

            if (template.isCustom) {
                if (template.rawTemplate.file_path) {
                    const { data: fileData, error: downloadError } = await authenticatedSupabase.storage
                        .from('documents')
                        .download(template.rawTemplate.file_path);

                    if (downloadError) throw new Error(`Failed to download template backdrop: ${downloadError.message}`);
                    
                    pdfBytes = new Uint8Array(await fileData.arrayBuffer());
                    
                    try {
                        const pdfDoc = await PDFDocument.load(pdfBytes);
                        pageCount = pdfDoc.getPageCount();
                    } catch (e) {
                        console.error('Failed to parse PDF pages, defaulting to 1 page:', e);
                        pageCount = 1;
                    }
                } else {
                    let text = template.rawTemplate.content_json?.text || '';
                    Object.entries(formValues).forEach(([key, val]) => {
                        text = text.replaceAll(`[${key}]`, val || '');
                    });

                    const paragraphs = text.split('\n\n');
                    const sections = paragraphs.map((p: string) => ({ type: 'paragraph' as const, text: p }));
                    sections.unshift({ type: 'title' as const, text: template.name });
                    sections.push({ type: 'signature-block' as const });

                    const gen = await generatePdfFromTemplate(template.name, sections);
                    pdfBytes = gen.pdfBytes;
                    pageCount = gen.pageCount;
                    signatureY = gen.signatureY;
                }
            } else {
                const sections = template.generateContent(formValues);
                const gen = await generatePdfFromTemplate(template.name, sections);
                pdfBytes = gen.pdfBytes;
                pageCount = gen.pageCount;
                signatureY = gen.signatureY;
            }

            // Load PDF for manipulation and draw filled placed fields
            try {
                const pdfDoc = await PDFDocument.load(pdfBytes);
                const pages = pdfDoc.getPages();
                pageCount = pages.length;
                const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

                for (const cf of canvasFields) {
                    if (!cf.value) continue;
                    
                    const pageNum = cf.page_number || 1;
                    if (pageNum < 1 || pageNum > pages.length) continue;
                    const page = pages[pageNum - 1];
                    const { width: pageWidth, height: pageHeight } = page.getSize();

                    // Convert visual coordinates (680x960 px) to absolute PDF coordinates
                    const pdfX = (cf.x / 680) * pageWidth;
                    const pdfWidth = (cf.width / 680) * pageWidth;
                    const pdfHeight = (cf.height / 960) * pageHeight;
                    const pdfY = pageHeight - ((cf.y / 960) * pageHeight) - pdfHeight;

                    if (cf.type === 'signature' || cf.type === 'initials') {
                        const base64Data = cf.value.split(',')[1];
                        const binaryString = atob(base64Data);
                        const len = binaryString.length;
                        const bytes = new Uint8Array(len);
                        for (let i = 0; i < len; i++) {
                            bytes[i] = binaryString.charCodeAt(i);
                        }
                        const pngImage = await pdfDoc.embedPng(bytes.buffer);
                        
                        const imgDims = pngImage.scale(0.5);
                        let drawWidth = pdfWidth;
                        let drawHeight = (imgDims.height / imgDims.width) * drawWidth;
                        if (drawHeight > pdfHeight) {
                            drawHeight = pdfHeight;
                            drawWidth = (imgDims.width / imgDims.height) * drawHeight;
                        }
                        const xOffset = (pdfWidth - drawWidth) / 2;
                        const yOffset = (pdfHeight - drawHeight) / 2;

                        page.drawImage(pngImage, {
                            x: pdfX + xOffset,
                            y: pdfY + yOffset,
                            width: drawWidth,
                            height: drawHeight
                        });
                    } else if (cf.type === 'stamp') {
                        const stampKey = cf.value || cf.stampType;
                        if (stampKey && STAMPS[stampKey as StampType]) {
                            try {
                                const stampDef = STAMPS[stampKey as StampType];
                                const svgString = stampDef.svgString;
                                const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
                                const url = URL.createObjectURL(blob);
                                const img = new Image();
                                await new Promise((resolve, reject) => {
                                    img.onload = resolve;
                                    img.onerror = reject;
                                    img.src = url;
                                });

                                const canvas = document.createElement('canvas');
                                canvas.width = stampDef.width * 2;
                                canvas.height = stampDef.height * 2;
                                const ctx = canvas.getContext('2d');
                                if (ctx) {
                                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                                    const pngDataUrl = canvas.toDataURL('image/png');
                                    const base64Data = pngDataUrl.split(',')[1];
                                    const binaryString = atob(base64Data);
                                    const len = binaryString.length;
                                    const bytes = new Uint8Array(len);
                                    for (let i = 0; i < len; i++) {
                                        bytes[i] = binaryString.charCodeAt(i);
                                    }
                                    const pngImage = await pdfDoc.embedPng(bytes.buffer);

                                    page.drawImage(pngImage, {
                                        x: pdfX,
                                        y: pdfY,
                                        width: pdfWidth,
                                        height: pdfHeight
                                    });
                                }
                                URL.revokeObjectURL(url);
                            } catch (e) {
                                console.error("Failed to render stamp on PDF:", e);
                            }
                        }
                    } else if (cf.type === 'checkbox') {
                        if (cf.value === 'true') {
                            page.drawText('X', {
                                x: pdfX + (pdfWidth / 2) - 5,
                                y: pdfY + (pdfHeight / 2) - 5,
                                size: 14,
                                font: helveticaFont,
                                color: rgb(0, 0, 0)
                            });
                        }
                    } else if (['text', 'date', 'email', 'company', 'title'].includes(cf.type)) {
                        let textToDraw = cf.value;
                        if (cf.type === 'date') {
                            try {
                                const dateObj = new Date(cf.value);
                                if (!isNaN(dateObj.getTime())) {
                                    textToDraw = dateObj.toLocaleDateString();
                                }
                            } catch (e) {
                                // Fallback
                            }
                        }
                        page.drawText(textToDraw, {
                            x: pdfX + 5,
                            y: pdfY + (pdfHeight / 2) - 4,
                            size: 10,
                            font: helveticaFont,
                            color: rgb(0, 0, 0)
                        });
                    }
                }
                pdfBytes = await pdfDoc.save();
            } catch (err) {
                console.error("Failed to draw filled canvas fields onto PDF:", err);
            }

            const timestamp = Date.now();
            const fileName = `${template.id}_${timestamp}.pdf`;
            const filePath = `uploads/templates/${fileName}`;

            const { error: uploadError } = await authenticatedSupabase.storage
                .from('documents')
                .upload(filePath, pdfBytes, {
                    contentType: 'application/pdf',
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) throw new Error(`Storage upload failed: ${uploadError.message}`);

            const shareLink = Math.random().toString(36).substring(2, 12);

            const firstRecipientName = template.isCustom
                ? Object.values(signerDetails)[1]?.name || 'Recipient'
                : recipientName;

            const { data: docData, error: dbError } = await authenticatedSupabase
                .from('documents')
                .insert({
                    name: `${template.name} - ${firstRecipientName}.pdf`,
                    file_path: filePath,
                    file_size: pdfBytes.length,
                    file_type: 'application/pdf',
                    share_link: shareLink,
                    requires_signature: true,
                    user_id: user?.id || null,
                    all_signed: false,
                    scan_status: 'completed'
                })
                .select('id')
                .single();

            if (dbError) throw new Error(`Database save failed: ${dbError.message}`);

            // Convert visual canvas fields (680x960 px) back to database percentage coordinates
            let customFields: PlacedField[] | undefined;
            if (canvasFields.length > 0) {
                customFields = canvasFields.map(cf => ({
                    type: cf.type,
                    x: (cf.x / 680) * 100,
                    y: (cf.y / 960) * 100,
                    width: (cf.width / 680) * 100,
                    height: (cf.height / 960) * 100,
                    signerId: cf.signerId,
                    page: cf.page_number,
                    value: cf.value,
                    stampType: cf.stampType
                }));
            }

            if (template.isCustom) {
                const signersList = template.rawTemplate.roles.map((r: any) => {
                    const details = signerDetails[r.id] || { name: '', email: '' };
                    return {
                        id: r.id,
                        name: details.name,
                        email: details.email,
                        order: r.signing_order,
                        color: r.color
                    };
                });

                const { success: esigSuccess, error: esigError } = await setupTemplateSignatures({
                    documentId: docData.id,
                    pageCount,
                    signatureY: 150,
                    signersList,
                    dynamicFields: customFields,
                    workflowType: template.rawTemplate.content_json?.sequential_routing ? 'sequential' : 'parallel'
                });

                if (!esigSuccess) throw new Error(esigError || 'Failed to setup document signers and fields.');
            } else {
                const partyAName = user?.fullName || user?.primaryEmailAddress?.emailAddress?.split('@')[0] || 'Sender';
                const partyAEmail = user?.primaryEmailAddress?.emailAddress || '';

                const { success: esigSuccess, error: esigError } = await setupTemplateSignatures({
                    documentId: docData.id,
                    pageCount,
                    signatureY,
                    partyAName,
                    partyAEmail,
                    partyBName: recipientName,
                    partyBEmail: recipientEmail,
                    customFields
                });

                if (!esigSuccess) throw new Error(esigError || 'Failed to setup document signers and fields.');
            }

            await logDocumentUpload(docData.id, `${template.name}.pdf`, pdfBytes.length, {
                metadata: {
                    generatedFromTemplate: template.id,
                    isCustomTemplate: template.isCustom || false
                }
            });

            try {
                const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `${template.name} - ${firstRecipientName}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (downloadErr) {
                console.error('Failed to trigger automatic download:', downloadErr);
            }

            onSuccess();
        } catch (err: any) {
            console.error('Template Generation Error:', err);
            setErrorMsg(err.message || 'An unexpected error occurred during template generation.');
        } finally {
            setIsGenerating(false);
        }
    };

    // Filter fields of current step
    const currentFields = template.isCustom ? [] : template.fields.filter((f: any) => f.step === currentStep);
    const isPrepareStep = currentStep === prepareStep;
    const isSignerStep = currentStep === signerStep;

    const getToolInfo = (type: string) => ESIGN_TOOLS.find(t => t.type === type);

    // ═══════════════════════════════════════════════════════════════════════
    // RENDER: Prepare Document Step (full-screen canvas editor)
    // ═══════════════════════════════════════════════════════════════════════
    if (isPrepareStep) {
        return (
            <div style={{
                position: 'fixed', inset: 0, background: '#f3f4f6', zIndex: 999,
                display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                    backgroundSize: '24px 24px', opacity: 0.3, pointerEvents: 'none'
                }} />

                {/* Header */}
                <div style={{
                    position: 'absolute', top: '16px', left: '16px', right: '16px', height: '68px',
                    background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.4)', borderRadius: '20px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0 1.5rem', boxShadow: '0 4px 20px -5px rgba(0,0,0,0.06)', zIndex: 50
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button
                            onClick={() => setCurrentStep(signerStep)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                background: 'white', border: '1px solid #e5e7eb',
                                padding: '0.55rem 1.25rem', borderRadius: '12px',
                                cursor: 'pointer', color: '#374151', fontSize: '0.9rem',
                                fontWeight: '600', boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                            }}
                        >
                            <ArrowLeft size={16} /> Back
                        </button>
                        <div style={{ width: '1px', height: '24px', background: '#e5e7eb' }} />
                        <div>
                            <h2 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#111827', margin: 0 }}>
                                Prepare Document
                            </h2>
                            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                                Drag fields onto the document • {canvasFields.length} field{canvasFields.length !== 1 ? 's' : ''} placed
                            </span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        {canvasFields.length > 0 && (
                            <div style={{
                                background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px',
                                padding: '0.4rem 0.85rem', fontSize: '0.8rem', fontWeight: '700',
                                color: '#15803d', display: 'flex', alignItems: 'center', gap: '0.4rem'
                            }}>
                                <Check size={14} /> {canvasFields.length} fields ready
                            </div>
                        )}
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            style={{
                                padding: '0.6rem 1.5rem',
                                background: isGenerating ? '#9ca3af' : 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                                border: 'none', borderRadius: '12px',
                                color: 'white', fontWeight: '700', fontSize: '0.9rem',
                                cursor: isGenerating ? 'not-allowed' : 'pointer',
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                boxShadow: isGenerating ? 'none' : '0 4px 12px rgba(16, 185, 129, 0.3)'
                            }}
                        >
                            {isGenerating ? 'Generating...' : <><Save size={16} /> Generate & Send</>}
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div style={{ display: 'flex', flex: 1, marginTop: '100px', height: 'calc(100vh - 100px)', overflow: 'hidden' }}>
                    
                    {/* Left Sidebar */}
                    <div style={{
                        width: '290px', margin: '0 0 16px 16px',
                        background: 'rgba(255, 255, 255, 0.92)', backdropFilter: 'blur(16px)',
                        border: '1px solid rgba(255, 255, 255, 0.5)', borderRadius: '20px',
                        padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.5rem',
                        zIndex: 40, boxShadow: '0 8px 24px -4px rgba(0,0,0,0.04)', overflowY: 'auto'
                    }}>
                        {/* Signers Toggle */}
                        <div>
                            <h4 style={{ fontSize: '0.7rem', fontWeight: '800', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
                                Assign Fields To
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {template.isCustom ? (
                                    template.rawTemplate.roles.map((r: any) => (
                                        <button
                                            key={r.id}
                                            onClick={() => setActiveSigner(r.id)}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                                padding: '0.65rem 0.75rem', borderRadius: '12px',
                                                border: activeSigner === r.id ? `2px solid ${r.color}` : '2px solid #e5e7eb',
                                                background: activeSigner === r.id ? `${r.color}10` : 'white',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: r.color }} />
                                            <span style={{ fontSize: '0.8rem', fontWeight: '600', color: activeSigner === r.id ? r.color : '#6b7280' }}>
                                                {r.role_name}
                                            </span>
                                        </button>
                                    ))
                                ) : (
                                    [
                                        { id: 'party_a', label: user?.fullName?.split(' ')[0] || 'You', color: '#4f46e5' },
                                        { id: 'party_b', label: recipientName.split(' ')[0] || 'Recipient', color: '#ec4899' }
                                    ].map(signer => (
                                        <button
                                            key={signer.id}
                                            onClick={() => setActiveSigner(signer.id)}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                                padding: '0.65rem 0.75rem', borderRadius: '12px',
                                                border: activeSigner === signer.id ? `2px solid ${signer.color}` : '2px solid #e5e7eb',
                                                background: activeSigner === signer.id ? `${signer.color}10` : 'white',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: signer.color }} />
                                            <span style={{ fontSize: '0.8rem', fontWeight: '600', color: activeSigner === signer.id ? signer.color : '#6b7280' }}>
                                                {signer.label}
                                            </span>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>

                        <div style={{ height: '1px', background: '#f3f4f6' }} />

                        {/* Drag tools */}
                        <div>
                            <h4 style={{ fontSize: '0.7rem', fontWeight: '800', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
                                Add More Fields
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {ESIGN_TOOLS.map(tool => {
                                    const IconComp = tool.icon;
                                    const roleColor = getSignerColor(activeSigner);
                                    return (
                                        <div
                                            key={tool.type}
                                            draggable
                                            onDragStart={(e) => {
                                                setDraggingTool(tool);
                                                e.dataTransfer.effectAllowed = 'copy';
                                            }}
                                            onDragEnd={() => setDraggingTool(null)}
                                            onClick={() => {
                                                // Automatically place field in the center of page 1
                                                const defaultX = (680 - tool.defaultW) / 2;
                                                const defaultY = (960 - tool.defaultH) / 2;
                                                const newField: CanvasField = {
                                                    id: `field_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
                                                    type: tool.type,
                                                    x: defaultX,
                                                    y: defaultY,
                                                    width: tool.defaultW,
                                                    height: tool.defaultH,
                                                    signerId: activeSigner,
                                                    page_number: 1, // Default page 1
                                                    color: getSignerColor(activeSigner),
                                                    label: `${template.isCustom ? (template.rawTemplate.roles.find((r: any) => r.id === activeSigner)?.role_name || 'Role') : (activeSigner === 'party_a' ? 'You' : 'Recipient')} ${tool.label}`
                                                };
                                                setCanvasFields(prev => [...prev, newField]);
                                                setSelectedFieldId(newField.id);
                                            }}
                                            style={{
                                                padding: '0.6rem 0.85rem', background: 'white', border: '1px solid #e5e7eb',
                                                borderRadius: '12px', cursor: 'grab', display: 'flex', alignItems: 'center', gap: '0.65rem'
                                            }}
                                        >
                                            <IconComp size={14} color={roleColor} />
                                            <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#1f2937', flex: 1 }}>{tool.label}</span>
                                            <GripVertical size={14} color="#d1d5db" />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Canvas Area */}
                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 2rem 4rem 2rem' }} onClick={() => setSelectedFieldId(null)}>
                        {renderingPdf && (
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '1rem', background: '#e0e7ff', borderRadius: '8px', color: '#4f46e5', fontWeight: '600', marginBottom: '1rem' }}>
                                <div style={{ width: '16px', height: '16px', border: '2px solid rgba(79,70,229,0.3)', borderTopColor: '#4f46e5', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                                Parsing baseline PDF...
                            </div>
                        )}

                        {/* Visual PDF rendered pages list */}
                        {template.isCustom && template.rawTemplate.file_path && pdfPages.length > 0 ? (
                            pdfPages.map((pageDataUrl, pageIdx) => {
                                const pageNum = pageIdx + 1;
                                return (
                                    <div
                                        key={pageNum}
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={(e) => handleCanvasDrop(e, pageNum)}
                                        style={{
                                            width: '680px',
                                            height: '960px',
                                            backgroundImage: `url(${pageDataUrl})`,
                                            backgroundSize: '100% 100%',
                                            position: 'relative',
                                            marginBottom: '2rem',
                                            border: '1px solid #e5e7eb',
                                            boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                                            boxSizing: 'border-box'
                                        }}
                                    >
                                        <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '600' }}>
                                            Page {pageNum} of {pdfPages.length}
                                        </div>

                                        {/* Fields on this page */}
                                        {canvasFields.filter(f => f.page_number === pageNum).map(field => {
                                            const isSelected = selectedFieldId === field.id;
                                            const IconComp = getToolInfo(field.type)?.icon || Type;
                                            const color = getSignerColor(field.signerId);

                                            return (
                                                <div
                                                    key={field.id}
                                                    onMouseDown={(e) => handleFieldMouseDown(e, field.id)}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedFieldId(field.id);

                                                        // Skip modal-opening if user just finished dragging
                                                        if (wasDraggingRef.current) {
                                                            wasDraggingRef.current = false;
                                                            return;
                                                        }
                                                        
                                                        // If it's a sender's field, let them sign/fill it!
                                                        if (isSenderField(field)) {
                                                            setActiveFieldToSignId(field.id);
                                                            if (field.type === 'signature' || field.type === 'initials') {
                                                                setIsSignatureModalOpen(true);
                                                            } else if (field.type === 'stamp') {
                                                                setIsStampSelectorOpen(true);
                                                            } else if (field.type === 'checkbox') {
                                                                setCanvasFields(prev => prev.map(f => f.id === field.id ? { ...f, value: f.value === 'true' ? '' : 'true' } : f));
                                                            } else if (['text', 'email', 'company', 'title', 'date'].includes(field.type)) {
                                                                if (field.type !== 'date') {
                                                                    const text = prompt(`Enter ${field.type}:`, field.value || '');
                                                                    if (text !== null) {
                                                                        setCanvasFields(prev => prev.map(f => f.id === field.id ? { ...f, value: text } : f));
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }}
                                                    style={{
                                                        position: 'absolute', left: field.x, top: field.y,
                                                        width: field.width, height: field.height,
                                                        background: field.value ? '#ecfdf5' : (isSelected ? `${color}20` : `${color}12`),
                                                        border: `2px solid ${field.value ? '#10b981' : (isSelected ? color : color + '80')}`,
                                                        borderRadius: '6px', cursor: 'move', zIndex: 20,
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                    }}
                                                >
                                                    {(() => {
                                                        const isSender = isSenderField(field);
                                                        const value = field.value;

                                                        if (field.type === 'signature' || field.type === 'initials') {
                                                            return value ? (
                                                                <img src={value} alt="Signature" style={{ maxHeight: '100%', maxWidth: '100%', pointerEvents: 'none' }} />
                                                            ) : (
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: color, fontSize: '0.72rem', fontWeight: '700', fontFamily: 'system-ui' }}>
                                                                    <IconComp size={12} />
                                                                    <span>{isSender ? 'Sign Here' : field.label.split(' ').slice(0, -1).join(' ')}</span>
                                                                </div>
                                                            );
                                                        }

                                                        if (field.type === 'date') {
                                                            if (activeFieldToSignId === field.id && isSender) {
                                                                return (
                                                                    <input
                                                                        type="date"
                                                                        autoFocus
                                                                        value={value || ''}
                                                                        onChange={(e) => {
                                                                            setCanvasFields(prev => prev.map(f => f.id === field.id ? { ...f, value: e.target.value } : f));
                                                                        }}
                                                                        onBlur={() => setActiveFieldToSignId(null)}
                                                                        style={{ width: '100%', height: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '11px', color: '#374151', padding: '0 4px', zIndex: 30 }}
                                                                        onClick={(e) => e.stopPropagation()}
                                                                        onMouseDown={(e) => e.stopPropagation()}
                                                                    />
                                                                );
                                                            }
                                                            return (
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: field.value ? '#10b981' : color, fontSize: '0.72rem', fontWeight: '700', fontFamily: 'system-ui' }}>
                                                                    <IconComp size={12} />
                                                                    <span>{value ? new Date(value).toLocaleDateString() : (isSender ? 'Select Date' : field.label.split(' ').slice(0, -1).join(' '))}</span>
                                                                </div>
                                                            );
                                                        }

                                                        if (field.type === 'stamp') {
                                                            const stampKey = value || field.stampType;
                                                            return stampKey && STAMPS[stampKey as StampType] ? (
                                                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                                                                    {STAMPS[stampKey as StampType].component}
                                                                </div>
                                                            ) : (
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: color, fontSize: '0.72rem', fontWeight: '700', fontFamily: 'system-ui' }}>
                                                                    <IconComp size={12} />
                                                                    <span>{isSender ? 'Add Stamp' : field.label.split(' ').slice(0, -1).join(' ')}</span>
                                                                </div>
                                                            );
                                                        }

                                                        if (field.type === 'checkbox') {
                                                            return (
                                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', pointerEvents: 'none' }}>
                                                                    {value === 'true' ? <Check size={16} color={color} strokeWidth={3} /> : <span style={{ fontSize: '0.72rem', color: color }}>[ ]</span>}
                                                                </div>
                                                            );
                                                        }

                                                        return (
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: field.value ? '#10b981' : color, fontSize: '0.72rem', fontWeight: '700', padding: '0 4px', overflow: 'hidden', whiteSpace: 'nowrap', fontFamily: 'system-ui' }}>
                                                                <IconComp size={12} />
                                                                <span>{value || field.label.split(' ').slice(0, -1).join(' ')}</span>
                                                            </div>
                                                        );
                                                    })()}
                                                    {isSelected && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                deleteField(field.id);
                                                            }}
                                                            style={{
                                                                position: 'absolute', top: '-10px', right: '-10px',
                                                                width: '20px', height: '20px', borderRadius: '50%',
                                                                background: '#ef4444', color: 'white', border: '2px solid white',
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 30
                                                            }}
                                                        >
                                                            ✕
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })
                        ) : (
                            /* Text Template Visual single page */
                            <div
                                ref={canvasRef}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => handleCanvasDrop(e, 1)}
                                style={{
                                    width: '680px', minHeight: '960px', background: 'white', borderRadius: '12px',
                                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.08)', padding: '4.5rem',
                                    position: 'relative', boxSizing: 'border-box', display: 'flex', flexDirection: 'column',
                                    justifyContent: 'space-between', fontFamily: '"Times New Roman", Times, serif'
                                }}
                            >
                                <div style={{ position: 'relative', zIndex: 1 }}>
                                    {template.isCustom ? (
                                        <div style={{ whiteSpace: 'pre-wrap' }}>
                                            {(() => {
                                                let text = template.rawTemplate.content_json?.text || '';
                                                Object.entries(formValues).forEach(([key, val]) => {
                                                    text = text.replaceAll(`[${key}]`, val || '');
                                                });
                                                return text;
                                            })()}
                                        </div>
                                    ) : (
                                        template.generateContent(formValues).map((section: any, idx: number) => {
                                            if (section.type === 'title') return <h1 key={idx} style={{ fontSize: '1.65rem', textAlign: 'center', fontWeight: 'bold', margin: '0 0 1.5rem 0' }}>{renderTextWithHighlights(section.text || '')}</h1>;
                                            if (section.type === 'subtitle') return <p key={idx} style={{ fontSize: '0.85rem', textAlign: 'center', color: '#6b7280', margin: '-1rem 0 2rem 0' }}>{renderTextWithHighlights(section.text || '')}</p>;
                                            if (section.type === 'header') return <h3 key={idx} style={{ fontSize: '1.05rem', fontWeight: 'bold', margin: '1.5rem 0 0.5rem 0' }}>{renderTextWithHighlights(section.text || '')}</h3>;
                                            if (section.type === 'paragraph') return <p key={idx} style={{ fontSize: '0.95rem', lineHeight: '1.5', textAlign: 'justify', margin: '0 0 1rem 0', textIndent: '1.5rem' }}>{renderTextWithHighlights(section.text || '')}</p>;
                                            return null;
                                        })
                                    )}
                                </div>

                                {/* Placed Fields on page 1 */}
                                {canvasFields.filter(f => f.page_number === 1).map(field => {
                                    const isSelected = selectedFieldId === field.id;
                                    const IconComp = getToolInfo(field.type)?.icon || Type;
                                    const color = getSignerColor(field.signerId);

                                    return (
                                                <div
                                                    key={field.id}
                                                    onMouseDown={(e) => handleFieldMouseDown(e, field.id)}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedFieldId(field.id);

                                                        // Skip modal-opening if user just finished dragging
                                                        if (wasDraggingRef.current) {
                                                            wasDraggingRef.current = false;
                                                            return;
                                                        }
                                                        
                                                        // If it's a sender's field, let them sign/fill it!
                                                        if (isSenderField(field)) {
                                                            setActiveFieldToSignId(field.id);
                                                            if (field.type === 'signature' || field.type === 'initials') {
                                                                setIsSignatureModalOpen(true);
                                                            } else if (field.type === 'stamp') {
                                                                setIsStampSelectorOpen(true);
                                                            } else if (field.type === 'checkbox') {
                                                                setCanvasFields(prev => prev.map(f => f.id === field.id ? { ...f, value: f.value === 'true' ? '' : 'true' } : f));
                                                            } else if (['text', 'email', 'company', 'title', 'date'].includes(field.type)) {
                                                                if (field.type !== 'date') {
                                                                    const text = prompt(`Enter ${field.type}:`, field.value || '');
                                                                    if (text !== null) {
                                                                        setCanvasFields(prev => prev.map(f => f.id === field.id ? { ...f, value: text } : f));
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }}
                                                    style={{
                                                        position: 'absolute', left: field.x, top: field.y,
                                                        width: field.width, height: field.height,
                                                        background: field.value ? '#ecfdf5' : (isSelected ? `${color}20` : `${color}12`),
                                                        border: `2px solid ${field.value ? '#10b981' : (isSelected ? color : color + '80')}`,
                                                        borderRadius: '6px', cursor: 'move', zIndex: 20,
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                    }}
                                                >
                                                    {(() => {
                                                        const isSender = isSenderField(field);
                                                        const value = field.value;

                                                        if (field.type === 'signature' || field.type === 'initials') {
                                                            return value ? (
                                                                <img src={value} alt="Signature" style={{ maxHeight: '100%', maxWidth: '100%', pointerEvents: 'none' }} />
                                                            ) : (
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: color, fontSize: '0.72rem', fontWeight: '700', fontFamily: 'system-ui' }}>
                                                                    <IconComp size={12} />
                                                                    <span>{isSender ? 'Sign Here' : field.label.split(' ').slice(0, -1).join(' ')}</span>
                                                                </div>
                                                            );
                                                        }

                                                        if (field.type === 'date') {
                                                            if (activeFieldToSignId === field.id && isSender) {
                                                                return (
                                                                    <input
                                                                        type="date"
                                                                        autoFocus
                                                                        value={value || ''}
                                                                        onChange={(e) => {
                                                                            setCanvasFields(prev => prev.map(f => f.id === field.id ? { ...f, value: e.target.value } : f));
                                                                        }}
                                                                        onBlur={() => setActiveFieldToSignId(null)}
                                                                        style={{ width: '100%', height: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '11px', color: '#374151', padding: '0 4px', zIndex: 30 }}
                                                                        onClick={(e) => e.stopPropagation()}
                                                                        onMouseDown={(e) => e.stopPropagation()}
                                                                    />
                                                                );
                                                            }
                                                            return (
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: field.value ? '#10b981' : color, fontSize: '0.72rem', fontWeight: '700', fontFamily: 'system-ui' }}>
                                                                    <IconComp size={12} />
                                                                    <span>{value ? new Date(value).toLocaleDateString() : (isSender ? 'Select Date' : field.label.split(' ').slice(0, -1).join(' '))}</span>
                                                                </div>
                                                            );
                                                        }

                                                        if (field.type === 'stamp') {
                                                            const stampKey = value || field.stampType;
                                                            return stampKey && STAMPS[stampKey as StampType] ? (
                                                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                                                                    {STAMPS[stampKey as StampType].component}
                                                                </div>
                                                            ) : (
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: color, fontSize: '0.72rem', fontWeight: '700', fontFamily: 'system-ui' }}>
                                                                    <IconComp size={12} />
                                                                    <span>{isSender ? 'Add Stamp' : field.label.split(' ').slice(0, -1).join(' ')}</span>
                                                                </div>
                                                            );
                                                        }

                                                        if (field.type === 'checkbox') {
                                                            return (
                                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', pointerEvents: 'none' }}>
                                                                    {value === 'true' ? <Check size={16} color={color} strokeWidth={3} /> : <span style={{ fontSize: '0.72rem', color: color }}>[ ]</span>}
                                                                </div>
                                                            );
                                                        }

                                                        return (
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: field.value ? '#10b981' : color, fontSize: '0.72rem', fontWeight: '700', padding: '0 4px', overflow: 'hidden', whiteSpace: 'nowrap', fontFamily: 'system-ui' }}>
                                                                <IconComp size={12} />
                                                                <span>{value || field.label.split(' ').slice(0, -1).join(' ')}</span>
                                                            </div>
                                                        );
                                                    })()}
                                                    {isSelected && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                deleteField(field.id);
                                                            }}
                                                            style={{
                                                                position: 'absolute', top: '-10px', right: '-10px',
                                                                width: '20px', height: '20px', borderRadius: '50%',
                                                                background: '#ef4444', color: 'white', border: '2px solid white',
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 30
                                                            }}
                                                        >
                                                            ✕
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                })}
                            </div>
                        )}
                {/* Signature Modal */}
                {isSignatureModalOpen && (
                    <SignatureCanvasComponent
                        onSave={handleSignatureSave}
                        onClose={() => { setIsSignatureModalOpen(false); setActiveFieldToSignId(null); }}
                        title={activeFieldToSignId && canvasFields.find(f => f.id === activeFieldToSignId)?.type === 'initials' ? 'Adopt your initials' : 'Adopt your signature'}
                        isInitials={!!(activeFieldToSignId && canvasFields.find(f => f.id === activeFieldToSignId)?.type === 'initials')}
                    />
                )}

                {/* Stamp Selector Modal */}
                {isStampSelectorOpen && (
                    <StampSelector
                        isOpen={isStampSelectorOpen}
                        onClose={() => { setIsStampSelectorOpen(false); setActiveFieldToSignId(null); }}
                        onSelect={handleStampSelect}
                    />
                )}
                    </div>
                </div>
            </div>
        );
    }

    // ─── RENDER: Form Steps + Signer Step ──────────────────────────────────
    return (
        <div style={{
            position: 'fixed', inset: 0, background: '#f9fafb', zIndex: 999,
            display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            {/* Header */}
            <div style={{
                height: '70px', background: 'white', borderBottom: '1px solid #e5e7eb',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                        onClick={onClose}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            border: '1px solid #e5e7eb', background: 'white',
                            color: '#374151', padding: '0.5rem 1rem', borderRadius: '10px',
                            fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem'
                        }}
                    >
                        <ArrowLeft size={16} /> Exit Editor
                    </button>
                    <div style={{ width: '1px', height: '24px', background: '#e5e7eb' }} />
                    <div>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#111827', margin: 0 }}>
                            Configure {template.name}
                        </h2>
                        <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                            Step {currentStep} of {totalSteps}
                        </span>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {Array.from({ length: totalSteps }).map((_, idx) => (
                        <div 
                            key={idx} 
                            style={{
                                width: '32px', height: '6px', borderRadius: '3px',
                                background: currentStep >= idx + 1
                                    ? (idx + 1 === totalSteps ? '#059669' : '#8b5cf6')
                                    : '#e5e7eb',
                                transition: 'all 0.3s'
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Split Screen Layout */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                
                {/* Left Panel Form inputs */}
                <div style={{
                    width: '420px', background: 'white', borderRight: '1px solid #e5e7eb',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    boxShadow: '4px 0 10px rgba(0, 0, 0, 0.01)'
                }}>
                    <div style={{ padding: '2rem', overflowY: 'auto', flex: 1 }}>
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1f2937', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Sparkles size={18} color="#8b5cf6" />
                                {isSignerStep ? 'Signers details' : `Step ${currentStep}: Details`}
                            </h3>
                            <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: 0 }}>
                                {isSignerStep 
                                    ? 'Provide names and emails for each role placeholder in the template.'
                                    : 'Fill out the form fields to customize the baseline text.'}
                            </p>
                        </div>

                        {errorMsg && (
                            <div style={{ padding: '1rem', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '12px', color: '#dc2626', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                                {errorMsg}
                            </div>
                        )}

                        {/* Inputs render */}
                        {!isSignerStep ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {template.isCustom ? (
                                    template.rawTemplate.content_json?.variables?.length > 0 ? (
                                        // Dynamic token types configurations
                                        template.rawTemplate.content_json.variables.map((v: any) => (
                                            <div key={v.id}>
                                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#374151', marginBottom: '0.5rem' }}>
                                                    {v.id} {v.required && <span style={{ color: '#ef4444' }}>*</span>}
                                                </label>
                                                
                                                {v.type === 'select' ? (
                                                    <select
                                                        value={formValues[v.id] || ''}
                                                        onChange={(e) => handleInputChange(v.id, e.target.value)}
                                                        style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #d1d5db', outline: 'none', fontSize: '0.95rem', background: '#f9fafb' }}
                                                    >
                                                        <option value="">-- Select Option --</option>
                                                        {v.options?.split(',').map((opt: string) => {
                                                            const clean = opt.trim();
                                                            return <option key={clean} value={clean}>{clean}</option>;
                                                        })}
                                                    </select>
                                                ) : (
                                                    <input
                                                        type={v.type === 'number' ? 'number' : v.type === 'date' ? 'date' : 'text'}
                                                        value={formValues[v.id] || ''}
                                                        onChange={(e) => handleInputChange(v.id, e.target.value)}
                                                        placeholder={v.placeholder || `Enter ${v.id}`}
                                                        style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #d1d5db', outline: 'none', fontSize: '0.95rem', background: '#f9fafb' }}
                                                    />
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        // Plain fallback variables
                                        variables.map(v => (
                                            <div key={v}>
                                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#374151', marginBottom: '0.5rem' }}>
                                                    {v} *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formValues[v] || ''}
                                                    onChange={(e) => handleInputChange(v, e.target.value)}
                                                    placeholder={`Enter ${v}`}
                                                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #d1d5db', outline: 'none', fontSize: '0.95rem', background: '#f9fafb' }}
                                                />
                                            </div>
                                        ))
                                    )
                                ) : (
                                    // Predefined template fields
                                    currentFields.map((field: any) => (
                                        <div key={field.id}>
                                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#374151', marginBottom: '0.5rem' }}>
                                                {field.label} {field.required && <span style={{ color: '#ef4444' }}>*</span>}
                                            </label>
                                            {field.type === 'select' ? (
                                                <select
                                                    value={formValues[field.id]}
                                                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                                                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #d1d5db', outline: 'none', fontSize: '0.95rem', background: '#f9fafb' }}
                                                >
                                                    {field.options?.map((opt: string) => (
                                                        <option key={opt} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                            ) : field.type === 'checkbox' ? (
                                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={!!formValues[field.id]}
                                                        onChange={(e) => handleInputChange(field.id, e.target.checked)}
                                                        style={{ width: '18px', height: '18px', borderRadius: '6px', border: '1px solid #d1d5db', accentColor: '#8b5cf6' }}
                                                    />
                                                    <span style={{ fontSize: '0.9rem', color: '#4b5563' }}>{field.helpText}</span>
                                                </label>
                                            ) : (
                                                <input
                                                    type={field.type}
                                                    value={formValues[field.id]}
                                                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                                                    placeholder={field.placeholder}
                                                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #d1d5db', outline: 'none', fontSize: '0.95rem', background: '#f9fafb' }}
                                                />
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        ) : (
                            // Signers details
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {template.isCustom ? (
                                    template.rawTemplate.roles.map((r: any, idx: number) => (
                                        <div key={r.id}>
                                            <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: r.color, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                                Role {idx + 1}: {r.role_name}
                                            </h4>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: `${r.color}05`, padding: '1rem', borderRadius: '12px', border: `1px solid ${r.color}20` }}>
                                                <div>
                                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#4b5563', marginBottom: '0.25rem' }}>Full Name</label>
                                                    <input
                                                        type="text"
                                                        value={signerDetails[r.id]?.name || ''}
                                                        onChange={(e) => setSignerDetails(prev => ({
                                                            ...prev,
                                                            [r.id]: { ...prev[r.id], name: e.target.value }
                                                        }))}
                                                        placeholder="Name"
                                                        style={{ width: '100%', padding: '0.55rem 0.8rem', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', fontSize: '0.9rem' }}
                                                    />
                                                </div>
                                                <div>
                                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#4b5563', marginBottom: '0.25rem' }}>Email Address</label>
                                                    <input
                                                        type="email"
                                                        value={signerDetails[r.id]?.email || ''}
                                                        onChange={(e) => setSignerDetails(prev => ({
                                                            ...prev,
                                                            [r.id]: { ...prev[r.id], email: e.target.value }
                                                        }))}
                                                        placeholder="Email"
                                                        style={{ width: '100%', padding: '0.55rem 0.8rem', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', fontSize: '0.9rem' }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <>
                                        <div>
                                            <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
                                                Party A (You)
                                            </h4>
                                            <div style={{ padding: '1rem', background: '#f3f4f6', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                                                <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1f2937' }}>{user?.fullName || 'Initiator'}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{user?.primaryEmailAddress?.emailAddress}</div>
                                            </div>
                                        </div>

                                        <div style={{ height: '1px', background: '#f3f4f6' }} />

                                        <div>
                                            <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
                                                Party B (Recipient)
                                            </h4>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                                <div>
                                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#374151', marginBottom: '0.5rem' }}>Signer Name *</label>
                                                    <input
                                                        type="text"
                                                        value={recipientName}
                                                        onChange={(e) => setRecipientName(e.target.value)}
                                                        placeholder="Name"
                                                        style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #d1d5db', outline: 'none', fontSize: '0.95rem' }}
                                                    />
                                                </div>
                                                <div>
                                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#374151', marginBottom: '0.5rem' }}>Signer Email *</label>
                                                    <input
                                                        type="email"
                                                        value={recipientEmail}
                                                        onChange={(e) => setRecipientEmail(e.target.value)}
                                                        placeholder="Email"
                                                        style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #d1d5db', outline: 'none', fontSize: '0.95rem' }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer Controls */}
                    <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '1rem', background: '#fafafa' }}>
                        {currentStep > 1 && (
                            <button
                                onClick={() => setCurrentStep(prev => prev - 1)}
                                style={{ flex: 1, padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '12px', background: 'white', color: '#4b5563', fontWeight: '600', cursor: 'pointer' }}
                            >
                                Back
                            </button>
                        )}
                        <button
                            onClick={() => {
                                if (!isSignerStep) {
                                    if (template.isCustom) {
                                        const variablesConfigs = template.rawTemplate.content_json?.variables;
                                        if (variablesConfigs?.length > 0) {
                                            const missing = variablesConfigs.some((v: any) => v.required && !formValues[v.id]);
                                            if (missing) {
                                                setErrorMsg('Please fill out all required fields');
                                                return;
                                            }
                                        } else {
                                            const missing = variables.some(v => !formValues[v]);
                                            if (missing) {
                                                setErrorMsg('Please fill out all custom fields');
                                                return;
                                            }
                                        }
                                    } else {
                                        const missingRequired = currentFields.some((f: any) => f.required && !formValues[f.id]);
                                        if (missingRequired) {
                                            setErrorMsg('Please fill in all required fields marked with *');
                                            return;
                                        }
                                    }
                                } else {
                                    if (template.isCustom) {
                                        const missing = template.rawTemplate.roles.some((r: any) => {
                                            const details = signerDetails[r.id];
                                            return !details?.name || !details?.email;
                                        });
                                        if (missing) {
                                            setErrorMsg('Please fill out details for all recipient roles.');
                                            return;
                                        }
                                    } else {
                                        if (!recipientName || !recipientEmail) {
                                            setErrorMsg('Please provide recipient name and email.');
                                            return;
                                        }
                                    }
                                }
                                setErrorMsg(null);
                                setCurrentStep(prev => prev + 1);
                            }}
                            style={{
                                flex: 2, padding: '0.75rem', border: 'none', borderRadius: '12px',
                                background: isSignerStep ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)' : 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                                color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                            }}
                        >
                            {isSignerStep ? 'Prepare Document' : 'Continue'} <ChevronRight size={16} />
                        </button>
                    </div>
                </div>

                {/* Right Panel Preview */}
                <div style={{ flex: 1, background: '#f3f4f6', overflowY: 'auto', padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                        width: '740px', minHeight: '1046px', background: 'white', borderRadius: '12px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.08)', padding: '4rem 4.5rem',
                        position: 'relative', boxSizing: 'border-box', display: 'flex', flexDirection: 'column',
                        justifyContent: 'space-between', fontFamily: '"Times New Roman", Times, serif'
                    }}>
                        <div>
                            {template.isCustom ? (
                                template.rawTemplate.file_path ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px', border: '1px dashed #e5e7eb', color: '#9ca3af' }}>
                                        <FileText size={48} />
                                        <span>Baseline PDF Backdrop loaded</span>
                                    </div>
                                ) : (
                                    <div style={{ whiteSpace: 'pre-wrap' }}>
                                        {(() => {
                                            let text = template.rawTemplate.content_json?.text || '';
                                            Object.entries(formValues).forEach(([key, val]) => {
                                                text = text.replaceAll(`[${key}]`, val || '');
                                            });
                                            return text;
                                        })()}
                                    </div>
                                )
                            ) : (
                                template.generateContent(formValues).map((section: any, idx: number) => {
                                    if (section.type === 'title') return <h1 key={idx} style={{ fontSize: '1.65rem', textAlign: 'center', fontWeight: 'bold', margin: '0 0 1.5rem 0' }}>{renderTextWithHighlights(section.text || '')}</h1>;
                                    if (section.type === 'subtitle') return <p key={idx} style={{ fontSize: '0.85rem', textAlign: 'center', color: '#6b7280', margin: '-1rem 0 2rem 0' }}>{renderTextWithHighlights(section.text || '')}</p>;
                                    if (section.type === 'header') return <h3 key={idx} style={{ fontSize: '1.05rem', fontWeight: 'bold', margin: '1.5rem 0 0.5rem 0' }}>{renderTextWithHighlights(section.text || '')}</h3>;
                                    if (section.type === 'paragraph') return <p key={idx} style={{ fontSize: '0.95rem', lineHeight: '1.5', textAlign: 'justify', margin: '0 0 1rem 0', textIndent: '1.5rem' }}>{renderTextWithHighlights(section.text || '')}</p>;
                                    return null;
                                })
                            )}
                        </div>

                        <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '1rem', marginTop: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#9ca3af', fontFamily: 'system-ui, sans-serif' }}>
                            <div>DocTransfer Templates Engine v1.0</div>
                            <div>Page 1 of 1</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TemplateWizard;
