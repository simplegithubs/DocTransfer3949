import React, { useState, useRef, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { getSafeSupabaseToken, createSupabaseClient } from '../../lib/supabase';
import { saveCustomTemplate } from '../../services/templateService';
import * as pdfjsLib from 'pdfjs-dist';
import { 
    ArrowLeft, Plus, Trash2, ArrowRight, Save, Upload, Sparkles, 
    FileText, Check, PenTool, Type, Calendar, CheckSquare, Building, 
    Briefcase, Stamp, GripVertical, AlertCircle, Info, Mail, Settings, GitCommit
} from 'lucide-react';

// Set worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface TemplateStudioProps {
    onClose: () => void;
    onSuccess: () => void;
}

interface RoleItem {
    role_name: string;
    signing_order: number;
    color: string;
}

interface VariableConfig {
    id: string;
    type: 'text' | 'date' | 'number' | 'select';
    required: boolean;
    placeholder?: string;
    options?: string; // Comma separated options for select dropdown
}

interface StudioField {
    id: string;
    roleIndex: number;
    field_type: 'signature' | 'initials' | 'text' | 'date' | 'checkbox' | 'email' | 'company' | 'title' | 'stamp';
    page_number: number;
    position_x: number; // percentage
    position_y: number; // percentage
    width: number;
    height: number;
    placeholder?: string;
    is_required: boolean;
}

const ROLE_COLORS = [
    '#4f46e5', // Indigo
    '#ec4899', // Pink
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#06b6d4', // Cyan
    '#8b5cf6', // Violet
    '#ef4444'  // Red
];

const ESIGN_TOOLS = [
    { type: 'signature', label: 'Signature', icon: PenTool, color: '#6366f1', defaultW: 150, defaultH: 50 },
    { type: 'initials', label: 'Initials', icon: Type, color: '#8b5cf6', defaultW: 100, defaultH: 50 },
    { type: 'date', label: 'Date Signed', icon: Calendar, color: '#10b981', defaultW: 120, defaultH: 35 },
    { type: 'text', label: 'Text Box', icon: Type, color: '#f59e0b', defaultW: 200, defaultH: 35 },
    { type: 'checkbox', label: 'Checkbox', icon: CheckSquare, color: '#ef4444', defaultW: 30, defaultH: 30 },
    { type: 'email', label: 'Email', icon: Mail, color: '#0ea5e9', defaultW: 200, defaultH: 35 },
    { type: 'company', label: 'Company', icon: Building, color: '#64748b', defaultW: 200, defaultH: 35 },
    { type: 'title', label: 'Job Title', icon: Briefcase, color: '#7c3aed', defaultW: 200, defaultH: 35 },
    { type: 'stamp', label: 'Stamp', icon: Stamp, color: '#e11d48', defaultW: 100, defaultH: 100 },
] as const;

const TemplateStudio: React.FC<TemplateStudioProps> = ({ onClose, onSuccess }) => {
    const { user } = useUser();
    const { getToken } = useAuth();

    // Steps: 1 (Settings) -> 2 (Roles) -> 3 (Placement Canvas)
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Step 1: Settings
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('custom');
    
    // Contract boilerplate text & dynamic variables configs
    const [templateText, setTemplateText] = useState('This Agreement is entered into on [Effective Date] by and between the parties.\n\nSection 1: Scope of Work\nThe parties agree to collaborate on the project details as outlined.\n\nSection 2: Signatures\nThe parties hereto agree to the terms and execute this agreement.');
    const [variables, setVariables] = useState<VariableConfig[]>([]);

    // Uploaded baseline file info & rendered PDF pages
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [uploadedFilePath, setUploadedFilePath] = useState<string | null>(null);
    const [fileUploading, setFileUploading] = useState(false);
    const [pdfPages, setPdfPages] = useState<string[]>([]);
    const [renderingPdf, setRenderingPdf] = useState(false);

    // Step 2: Roles & Routing
    const [roles, setRoles] = useState<RoleItem[]>([
        { role_name: 'Sender', signing_order: 1, color: ROLE_COLORS[0] },
        { role_name: 'Recipient', signing_order: 2, color: ROLE_COLORS[1] }
    ]);
    const [enforceSigningOrder, setEnforceSigningOrder] = useState(false);

    // Step 3: Fields & Placement
    const [fields, setFields] = useState<StudioField[]>([]);
    const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
    const [activeRoleIndex, setActiveRoleIndex] = useState<number>(0);
    const [draggingTool, setDraggingTool] = useState<typeof ESIGN_TOOLS[number] | null>(null);

    // File input ref
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Parse variables from text on change
    useEffect(() => {
        if (uploadedFile) {
            setVariables([]);
            return;
        }

        const matches = templateText.match(/\[([^\]]+)\]/g);
        if (!matches) {
            setVariables([]);
            return;
        }

        const uniqueNames = Array.from(new Set(matches.map(m => m.slice(1, -1))));
        setVariables(prev => {
            return uniqueNames.map(name => {
                const existing = prev.find(p => p.id === name);
                if (existing) return existing;
                return {
                    id: name,
                    type: name.toLowerCase().includes('date') ? 'date' : 'text',
                    required: true,
                    placeholder: `Enter ${name}`
                };
            });
        });
    }, [templateText, uploadedFile]);

    // Render uploaded PDF into images using PDF.js
    useEffect(() => {
        const renderPDFBackdrop = async () => {
            if (!uploadedFile) {
                setPdfPages([]);
                return;
            }
            setRenderingPdf(true);
            try {
                const arrayBuffer = await uploadedFile.arrayBuffer();
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
                console.error('Failed to render PDF pages locally:', err);
                setErrorMsg('Error rendering PDF backdrop. You can still place fields, but pages won\'t display visually.');
            } finally {
                setRenderingPdf(false);
            }
        };

        renderPDFBackdrop();
    }, [uploadedFile]);

    const addRole = () => {
        if (roles.length >= 7) return;
        const nextColor = ROLE_COLORS[roles.length];
        setRoles(prev => [
            ...prev,
            { role_name: `Role ${prev.length + 1}`, signing_order: prev.length + 1, color: nextColor }
        ]);
    };

    const updateRole = (index: number, key: keyof RoleItem, value: any) => {
        setRoles(prev => prev.map((r, i) => i === index ? { ...r, [key]: value } : r));
    };

    const removeRole = (index: number) => {
        if (roles.length <= 1) return;
        setRoles(prev => prev.filter((_, i) => i !== index));
        setFields(prev => prev.filter(f => f.roleIndex !== index).map(f => {
            if (f.roleIndex > index) {
                return { ...f, roleIndex: f.roleIndex - 1 };
            }
            return f;
        }));
        if (activeRoleIndex >= roles.length - 1) {
            setActiveRoleIndex(Math.max(0, roles.length - 2));
        }
    };

    const handleVariableChange = (id: string, key: keyof VariableConfig, value: any) => {
        setVariables(prev => prev.map(v => v.id === id ? { ...v, [key]: value } : v));
    };

    // File upload backdrop
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadedFile(file);
        setFileUploading(true);
        setErrorMsg(null);

        try {
            const token = await getSafeSupabaseToken(getToken);
            const supabase = createSupabaseClient(token || undefined);

            const timestamp = Date.now();
            const fileName = `template_backdrop_${timestamp}_${file.name}`;
            const path = `uploads/templates/baselines/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('documents')
                .upload(path, file, {
                    contentType: file.type,
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) throw new Error(uploadError.message);

            setUploadedFilePath(path);
        } catch (err: any) {
            console.error('File upload failed:', err);
            setErrorMsg(`Failed to upload document backdrop: ${err.message}`);
        } finally {
            setFileUploading(false);
        }
    };

    // Drag-and-Drop functionality on canvas
    const handleCanvasDrop = (e: React.DragEvent, pageNumber: number) => {
        e.preventDefault();
        if (!draggingTool) return;

        const pageContainer = e.currentTarget as HTMLDivElement;
        const rect = pageContainer.getBoundingClientRect();
        const x = e.clientX - rect.left - draggingTool.defaultW / 2;
        const y = e.clientY - rect.top - draggingTool.defaultH / 2;

        const newField: StudioField = {
            id: `field_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            roleIndex: activeRoleIndex,
            field_type: draggingTool.type,
            page_number: pageNumber,
            position_x: Math.max(0, Math.min((x / rect.width) * 100, 100 - (draggingTool.defaultW / rect.width) * 100)),
            position_y: Math.max(0, Math.min((y / rect.height) * 100, 100 - (draggingTool.defaultH / rect.height) * 100)),
            width: draggingTool.defaultW,
            height: draggingTool.defaultH,
            is_required: true
        };

        setFields(prev => [...prev, newField]);
        setSelectedFieldId(newField.id);
        setDraggingTool(null);
    };

    const handleFieldMouseDown = (e: React.MouseEvent, fieldId: string) => {
        e.stopPropagation();
        e.preventDefault();
        const field = fields.find(f => f.id === fieldId);
        if (!field) return;

        setSelectedFieldId(fieldId);

        // Find the specific page container
        const pageContainer = e.currentTarget.parentElement as HTMLDivElement;
        const rect = pageContainer.getBoundingClientRect();

        const startX = e.clientX;
        const startY = e.clientY;
        const startPctX = field.position_x;
        const startPctY = field.position_y;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const deltaX = moveEvent.clientX - startX;
            const deltaY = moveEvent.clientY - startY;

            const deltaPctX = (deltaX / rect.width) * 100;
            const deltaPctY = (deltaY / rect.height) * 100;

            setFields(prev => prev.map(f => {
                if (f.id !== fieldId) return f;
                return {
                    ...f,
                    position_x: Math.max(0, Math.min(startPctX + deltaPctX, 100 - (f.width / rect.width) * 100)),
                    position_y: Math.max(0, Math.min(startPctY + deltaPctY, 100 - (f.height / rect.height) * 100))
                };
            }));
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const deleteField = (fieldId: string) => {
        setFields(prev => prev.filter(f => f.id !== fieldId));
        if (selectedFieldId === fieldId) setSelectedFieldId(null);
    };

    // Save Template layout
    const handleSaveTemplate = async () => {
        if (!name.trim()) {
            setErrorMsg('Please specify a template name.');
            setStep(1);
            return;
        }

        setLoading(true);
        setErrorMsg(null);

        try {
            const token = await getSafeSupabaseToken(getToken);

            const result = await saveCustomTemplate(
                token || undefined,
                {
                    name,
                    description,
                    file_path: uploadedFilePath || undefined,
                    content_json: {
                        text: !uploadedFilePath ? templateText : undefined,
                        variables: !uploadedFilePath ? variables : undefined,
                        sequential_routing: enforceSigningOrder
                    },
                    userId: user?.id,
                    category
                },
                roles,
                fields.map(f => ({
                    roleIndex: f.roleIndex,
                    field_type: f.field_type,
                    page_number: f.page_number,
                    position_x: f.position_x,
                    position_y: f.position_y,
                    width: f.width,
                    height: f.height,
                    is_required: f.is_required,
                    placeholder: f.placeholder
                }))
            );

            if (!result.success) throw new Error(result.error);

            onSuccess();
        } catch (err: any) {
            console.error('Save template failed:', err);
            setErrorMsg(err.message || 'An error occurred while saving the template.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, background: '#f9fafb', zIndex: 999,
            display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            {/* Header */}
            <div style={{
                height: '70px', background: 'white', borderBottom: '1px solid #e5e7eb',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.4rem',
                            fontWeight: '600', fontSize: '0.9rem'
                        }}
                    >
                        <ArrowLeft size={16} /> Back to Library
                    </button>
                    <div style={{ width: '1px', height: '20px', background: '#e5e7eb' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Sparkles size={16} color="#4f46e5" />
                        <h1 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#111827', margin: 0 }}>
                            Template Studio
                        </h1>
                    </div>
                </div>

                {/* Progress */}
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.85rem', fontWeight: '600' }}>
                        <span style={{
                            width: '24px', height: '24px', borderRadius: '50%',
                            background: step === 1 ? '#4f46e5' : '#e5e7eb', color: step === 1 ? 'white' : '#6b7280',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem'
                        }}>1</span>
                        <span style={{ color: step === 1 ? '#111827' : '#9ca3af' }}>Setup Backdrop</span>
                        
                        <div style={{ width: '24px', height: '1px', background: '#d1d5db' }} />

                        <span style={{
                            width: '24px', height: '24px', borderRadius: '50%',
                            background: step === 2 ? '#4f46e5' : '#e5e7eb', color: step === 2 ? 'white' : '#6b7280',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem'
                        }}>2</span>
                        <span style={{ color: step === 2 ? '#111827' : '#9ca3af' }}>Define Roles</span>

                        <div style={{ width: '24px', height: '1px', background: '#d1d5db' }} />

                        <span style={{
                            width: '24px', height: '24px', borderRadius: '50%',
                            background: step === 3 ? '#4f46e5' : '#e5e7eb', color: step === 3 ? 'white' : '#6b7280',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem'
                        }}>3</span>
                        <span style={{ color: step === 3 ? '#111827' : '#9ca3af' }}>Place Fields</span>
                    </div>
                </div>

                <button
                    onClick={step === 3 ? handleSaveTemplate : () => setStep((prev) => (prev + 1) as any)}
                    disabled={loading || fileUploading || renderingPdf}
                    style={{
                        padding: '0.55rem 1.25rem',
                        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                        color: 'white', border: 'none', borderRadius: '10px',
                        fontWeight: '700', fontSize: '0.88rem', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                        boxShadow: '0 4px 10px rgba(79, 70, 229, 0.2)'
                    }}
                >
                    {step === 3 ? (
                        <><Save size={16} /> Save Template</>
                    ) : (
                        <>Continue <ArrowRight size={16} /></>
                    )}
                </button>
            </div>

            {/* Error */}
            {errorMsg && (
                <div style={{
                    background: '#fef2f2', borderBottom: '1px solid #fee2e2',
                    padding: '0.75rem 2rem', color: '#b91c1c', display: 'flex',
                    alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '600'
                }}>
                    <AlertCircle size={16} />
                    <span>{errorMsg}</span>
                </div>
            )}

            {/* Main Area */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

                {/* ─── STEP 1: Settings & Variables ─── */}
                {step === 1 && (
                    <div style={{ flex: 1, display: 'flex', gap: '2rem', padding: '2rem', overflowY: 'auto' }}>
                        
                        {/* Left Column: Backdrop Type */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
                            <div>
                                <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#111827', marginBottom: '0.4rem' }}>
                                    Template Setup
                                </h2>
                                <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: 0 }}>
                                    Configure core metadata and upload or write standard boilerplate terms.
                                </p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                    <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#374151' }}>Template Name</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Sales Invoice"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        style={{ padding: '0.65rem 0.85rem', border: '1px solid #d1d5db', borderRadius: '10px', fontSize: '0.88rem' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                    <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#374151' }}>Description</label>
                                    <textarea 
                                        placeholder="Template description..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={2}
                                        style={{ padding: '0.65rem 0.85rem', border: '1px solid #d1d5db', borderRadius: '10px', fontSize: '0.88rem' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                        <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#374151' }}>Category</label>
                                        <select 
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            style={{ padding: '0.65rem 0.85rem', border: '1px solid #d1d5db', borderRadius: '10px', fontSize: '0.88rem', background: 'white' }}
                                        >
                                            <option value="hr">Employment & HR</option>
                                            <option value="legal">Legal & Liability</option>
                                            <option value="sales">Sales & Finance</option>
                                            <option value="custom">Other / Custom</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    style={{
                                        border: uploadedFile ? '2px solid #4f46e5' : '2px dashed #d1d5db',
                                        background: uploadedFile ? '#f5f3ff' : 'white',
                                        borderRadius: '12px', padding: '1.25rem', textAlign: 'center', cursor: 'pointer',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem'
                                    }}
                                >
                                    <Upload size={20} color="#4f46e5" />
                                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1f2937' }}>Upload PDF Backdrop</span>
                                    <input 
                                        type="file" 
                                        ref={fileInputRef}
                                        style={{ display: 'none' }} 
                                        accept=".pdf"
                                        onChange={handleFileUpload}
                                    />
                                </div>

                                <div 
                                    onClick={() => {
                                        setUploadedFile(null);
                                        setUploadedFilePath(null);
                                    }}
                                    style={{
                                        border: !uploadedFile ? '2px solid #4f46e5' : '2px solid #e5e7eb',
                                        background: !uploadedFile ? '#f5f3ff' : 'white',
                                        borderRadius: '12px', padding: '1.25rem', textAlign: 'center', cursor: 'pointer',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem'
                                    }}
                                >
                                    <FileText size={20} color="#10b981" />
                                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1f2937' }}>Use Digital Text Builder</span>
                                </div>
                            </div>

                            {!uploadedFile && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                    <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#374151' }}>Agreement Text Boilerplate</label>
                                    <textarea 
                                        value={templateText}
                                        onChange={(e) => setTemplateText(e.target.value)}
                                        rows={6}
                                        style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '10px', fontFamily: 'Times New Roman, Times, serif', lineHeight: 1.4, fontSize: '0.88rem' }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Right Column: Dynamic Variables Configuration (Only if Text Editor mode) */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#111827', marginBottom: '0.4rem' }}>
                                    Merge Token Configurations
                                </h3>
                                <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: 0 }}>
                                    {!uploadedFile && variables.length > 0 
                                        ? `Detected ${variables.length} tokens inside brackets [...]. Set their input type selectors below.`
                                        : 'No merge tokens detected. Write brackets like [Client Name] in the editor to define variables.'}
                                </p>
                            </div>

                            {!uploadedFile && variables.length > 0 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {variables.map(v => (
                                        <div key={v.id} style={{ background: 'white', padding: '1rem', borderRadius: '12px', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: '0.88rem', fontWeight: '700', color: '#1f2937' }}>Token: [{v.id}]</span>
                                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: '#4b5563', cursor: 'pointer' }}>
                                                    <input 
                                                        type="checkbox" 
                                                        checked={v.required} 
                                                        onChange={(e) => handleVariableChange(v.id, 'required', e.target.checked)}
                                                    /> Required
                                                </label>
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                                <div>
                                                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: '#6b7280', marginBottom: '0.25rem' }}>Input Type</label>
                                                    <select
                                                        value={v.type}
                                                        onChange={(e) => handleVariableChange(v.id, 'type', e.target.value)}
                                                        style={{ width: '100%', padding: '0.4rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.8rem', background: 'white' }}
                                                    >
                                                        <option value="text">Text Input</option>
                                                        <option value="date">Date Picker</option>
                                                        <option value="number">Number</option>
                                                        <option value="select">Dropdown Select</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: '#6b7280', marginBottom: '0.25rem' }}>Helper Placeholder</label>
                                                    <input
                                                        type="text"
                                                        value={v.placeholder || ''}
                                                        onChange={(e) => handleVariableChange(v.id, 'placeholder', e.target.value)}
                                                        placeholder="Help text"
                                                        style={{ width: '100%', padding: '0.4rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.8rem' }}
                                                    />
                                                </div>
                                            </div>

                                            {v.type === 'select' && (
                                                <div>
                                                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: '#6b7280', marginBottom: '0.25rem' }}>Dropdown Options (Comma-separated)</label>
                                                    <input
                                                        type="text"
                                                        value={v.options || ''}
                                                        onChange={(e) => handleVariableChange(v.id, 'options', e.target.value)}
                                                        placeholder="e.g. Yes, No, N/A"
                                                        style={{ width: '100%', padding: '0.4rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.8rem' }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ─── STEP 2: Roles & Routing order ─── */}
                {step === 2 && (
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '3rem', overflowY: 'auto' }}>
                        <div style={{ width: '100%', maxWidth: '640px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#111827', marginBottom: '0.5rem' }}>
                                    Define Recipient Roles
                                </h2>
                                <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: 0 }}>
                                    Add signers or roles required to sign or approve this document.
                                </p>
                            </div>

                            {/* Sequential Routing Toggle */}
                            <div style={{
                                padding: '1.25rem', background: '#f5f3ff', border: '1px solid #e0e7ff',
                                borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem'
                            }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <GitCommit size={20} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1f2937' }}>Enforce Sequential Signing Order</div>
                                    <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>Signers will be invited one by one according to their sorting order.</div>
                                </div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input 
                                        type="checkbox" 
                                        checked={enforceSigningOrder}
                                        onChange={(e) => setEnforceSigningOrder(e.target.checked)}
                                        style={{ width: '20px', height: '20px', accentColor: '#4f46e5' }}
                                    />
                                </label>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {roles.map((role, idx) => (
                                    <div 
                                        key={idx} 
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '1rem',
                                            background: 'white', padding: '1.25rem', borderRadius: '14px',
                                            border: `1.5px solid ${role.color}40`, boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                        }}
                                    >
                                        <div style={{
                                            width: '32px', height: '32px', borderRadius: '8px',
                                            background: `${role.color}15`, color: role.color,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontWeight: '800', fontSize: '0.85rem'
                                        }}>
                                            {idx + 1}
                                        </div>

                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                            <input 
                                                type="text" 
                                                value={role.role_name}
                                                onChange={(e) => updateRole(idx, 'role_name', e.target.value)}
                                                placeholder="e.g. Witness, Guarantor"
                                                style={{ border: 'none', borderBottom: '1px solid #e5e7eb', padding: '0.2rem 0', fontWeight: '600', color: '#1f2937', outline: 'none', fontSize: '0.95rem' }}
                                            />
                                        </div>

                                        {enforceSigningOrder && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#6b7280' }}>Order</label>
                                                <input 
                                                    type="number" 
                                                    value={role.signing_order}
                                                    min={1}
                                                    onChange={(e) => updateRole(idx, 'signing_order', parseInt(e.target.value) || 1)}
                                                    style={{ width: '50px', padding: '0.3rem', border: '1px solid #e5e7eb', borderRadius: '6px', textAlign: 'center', fontWeight: '600' }}
                                                />
                                            </div>
                                        )}

                                        <button
                                            onClick={() => removeRole(idx)}
                                            disabled={roles.length <= 1}
                                            style={{
                                                background: 'none', border: 'none', cursor: roles.length <= 1 ? 'not-allowed' : 'pointer',
                                                color: roles.length <= 1 ? '#d1d5db' : '#ef4444', padding: '0.4rem', borderRadius: '6px'
                                            }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}

                                {roles.length < 7 && (
                                    <button
                                        onClick={addRole}
                                        style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                            padding: '1rem', border: '2px dashed #d1d5db', borderRadius: '14px',
                                            background: 'none', cursor: 'pointer', color: '#4f46e5', fontWeight: '700',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        <Plus size={16} /> Add Role Placeholder
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── STEP 3: Placement Canvas ─── */}
                {step === 3 && (
                    <div style={{ flex: 1, display: 'flex', height: '100%', overflow: 'hidden' }}>
                        
                        {/* Drag Sidebar */}
                        <div style={{
                            width: '290px', background: 'white', borderRight: '1px solid #e5e7eb',
                            padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.5rem',
                            overflowY: 'auto'
                        }}>
                            {/* Active Role Selector */}
                            <div>
                                <h4 style={{ fontSize: '0.7rem', fontWeight: '800', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
                                    Active Design Role
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                    {roles.map((role, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                setActiveRoleIndex(idx);
                                                setSelectedFieldId(null);
                                            }}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '0.65rem',
                                                padding: '0.6rem 0.75rem', borderRadius: '10px',
                                                border: activeRoleIndex === idx ? `2px solid ${role.color}` : '1.5px solid #e5e7eb',
                                                background: activeRoleIndex === idx ? `${role.color}10` : 'white',
                                                cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left'
                                            }}
                                        >
                                            <div style={{
                                                width: '18px', height: '18px', borderRadius: '50%',
                                                background: role.color, color: 'white', display: 'flex',
                                                alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: '800'
                                            }}>
                                                {idx + 1}
                                            </div>
                                            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#374151', flex: 1 }}>
                                                {role.role_name}
                                            </span>
                                            {activeRoleIndex === idx && <Check size={14} color={role.color} />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div style={{ height: '1px', background: '#f3f4f6' }} />

                            {/* Drag tools */}
                            <div>
                                <h4 style={{ fontSize: '0.7rem', fontWeight: '800', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
                                    Drag Signature Fields
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {ESIGN_TOOLS.map(tool => {
                                        const IconComp = tool.icon;
                                        const roleColor = roles[activeRoleIndex]?.color || '#4f46e5';
                                        return (
                                            <div
                                                key={tool.type}
                                                draggable
                                                onDragStart={(e) => {
                                                    setDraggingTool(tool);
                                                    e.dataTransfer.effectAllowed = 'copy';
                                                }}
                                                onDragEnd={() => setDraggingTool(null)}
                                                style={{
                                                    padding: '0.65rem 0.8rem', background: 'white',
                                                    border: '1px solid #e5e7eb', borderRadius: '10px',
                                                    cursor: 'grab', display: 'flex', alignItems: 'center', gap: '0.5rem',
                                                    boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.borderColor = roleColor;
                                                    e.currentTarget.style.boxShadow = `0 4px 10px ${roleColor}15`;
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.borderColor = '#e5e7eb';
                                                    e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.03)';
                                                }}
                                            >
                                                <div style={{
                                                    color: 'white', background: roleColor,
                                                    padding: '5px', borderRadius: '6px',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                }}>
                                                    <IconComp size={13} />
                                                </div>
                                                <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#374151', flex: 1 }}>
                                                    {tool.label}
                                                </span>
                                                <GripVertical size={13} color="#d1d5db" />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Canvas Board */}
                        <div 
                            style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                            onClick={() => setSelectedFieldId(null)}
                        >
                            {renderingPdf && (
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '1rem', background: '#e0e7ff', borderRadius: '8px', color: '#4f46e5', fontWeight: '600', marginBottom: '1rem' }}>
                                    <div style={{ width: '16px', height: '16px', border: '2px solid rgba(79,70,229,0.3)', borderTopColor: '#4f46e5', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                                    Parsing baseline PDF pages...
                                </div>
                            )}

                            {/* Render visual PDF pages backdrop scrollably */}
                            {uploadedFile && pdfPages.length > 0 ? (
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
                                            {/* Page number badge */}
                                            <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '600', fontFamily: 'system-ui' }}>
                                                Page {pageNum} of {pdfPages.length}
                                            </div>

                                            {/* Rendered fields on this page */}
                                            {fields.filter(f => f.page_number === pageNum).map(field => {
                                                const isSelected = selectedFieldId === field.id;
                                                const activeRole = roles[field.roleIndex];
                                                const color = activeRole?.color || '#4f46e5';
                                                const toolInfo = ESIGN_TOOLS.find(t => t.type === field.field_type);
                                                const IconComp = toolInfo?.icon || PenTool;

                                                return (
                                                    <div
                                                        key={field.id}
                                                        onMouseDown={(e) => handleFieldMouseDown(e, field.id)}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedFieldId(field.id);
                                                        }}
                                                        style={{
                                                            position: 'absolute',
                                                            left: `${field.position_x}%`,
                                                            top: `${field.position_y}%`,
                                                            width: `${field.width}px`,
                                                            height: `${field.height}px`,
                                                            border: `2px solid ${color}`,
                                                            background: isSelected ? `${color}25` : `${color}10`,
                                                            borderRadius: '6px', cursor: 'move', zIndex: 10,
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            userSelect: 'none'
                                                        }}
                                                    >
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: color, fontSize: '0.72rem', fontWeight: '700', fontFamily: 'system-ui' }}>
                                                            <IconComp size={12} />
                                                            <span>{activeRole?.role_name || 'Role'}</span>
                                                        </div>

                                                        <div style={{
                                                            position: 'absolute', top: '-8px', left: '-8px',
                                                            width: '18px', height: '18px', borderRadius: '50%',
                                                            background: color, color: 'white', display: 'flex',
                                                            alignItems: 'center', justifyContent: 'center', fontSize: '0.62rem', fontWeight: '900',
                                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                        }}>
                                                            {field.roleIndex + 1}
                                                        </div>

                                                        {isSelected && (
                                                            <button
                                                                onClick={() => deleteField(field.id)}
                                                                style={{
                                                                    position: 'absolute', top: '-9px', right: '-9px',
                                                                    background: '#ef4444', color: 'white', border: 'none',
                                                                    borderRadius: '50%', width: '18px', height: '18px',
                                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                    cursor: 'pointer', fontSize: '0.65rem'
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
                                /* Text template editor visual backdrop page 1 */
                                <div
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => handleCanvasDrop(e, 1)}
                                    style={{
                                        width: '680px', minHeight: '960px', background: 'white',
                                        borderRadius: '12px', border: '1px solid #e5e7eb',
                                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)',
                                        padding: '3rem', position: 'relative', boxSizing: 'border-box',
                                        fontFamily: 'Times New Roman, Times, serif', fontSize: '0.95rem',
                                        lineHeight: 1.6, color: '#374151', display: 'flex', flexDirection: 'column',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <div>
                                        <div style={{ whiteSpace: 'pre-wrap' }}>
                                            {templateText}
                                        </div>
                                    </div>

                                    {/* Fields on page 1 */}
                                    {fields.filter(f => f.page_number === 1).map(field => {
                                        const isSelected = selectedFieldId === field.id;
                                        const activeRole = roles[field.roleIndex];
                                        const color = activeRole?.color || '#4f46e5';
                                        const toolInfo = ESIGN_TOOLS.find(t => t.type === field.field_type);
                                        const IconComp = toolInfo?.icon || PenTool;

                                        return (
                                            <div
                                                key={field.id}
                                                onMouseDown={(e) => handleFieldMouseDown(e, field.id)}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedFieldId(field.id);
                                                }}
                                                style={{
                                                    position: 'absolute',
                                                    left: `${field.position_x}%`,
                                                    top: `${field.position_y}%`,
                                                    width: `${field.width}px`,
                                                    height: `${field.height}px`,
                                                    border: `2px solid ${color}`,
                                                    background: isSelected ? `${color}25` : `${color}10`,
                                                    borderRadius: '6px', cursor: 'move', zIndex: 10,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    userSelect: 'none'
                                                }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: color, fontSize: '0.72rem', fontWeight: '700', fontFamily: 'system-ui' }}>
                                                    <IconComp size={12} />
                                                    <span>{activeRole?.role_name || 'Role'}</span>
                                                </div>

                                                <div style={{
                                                    position: 'absolute', top: '-8px', left: '-8px',
                                                    width: '18px', height: '18px', borderRadius: '50%',
                                                    background: color, color: 'white', display: 'flex',
                                                    alignItems: 'center', justifyContent: 'center', fontSize: '0.62rem', fontWeight: '900',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                }}>
                                                    {field.roleIndex + 1}
                                                </div>

                                                {isSelected && (
                                                    <button
                                                        onClick={() => deleteField(field.id)}
                                                        style={{
                                                            position: 'absolute', top: '-9px', right: '-9px',
                                                            background: '#ef4444', color: 'white', border: 'none',
                                                            borderRadius: '50%', width: '18px', height: '18px',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            cursor: 'pointer', fontSize: '0.65rem'
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
                        </div>

                    </div>
                )}

            </div>
        </div>
    );
};

export default TemplateStudio;
