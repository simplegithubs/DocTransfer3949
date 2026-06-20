import React, { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { getSafeSupabaseToken } from '../../lib/supabase';
import { fetchCustomTemplates, deleteCustomTemplate, type DocumentTemplate } from '../../services/templateService';
import { TEMPLATES, TEMPLATE_CATEGORIES, type Template } from './templateData';
import TemplateWizard from './TemplateWizard';
import TemplateStudio from './TemplateStudio';
import TemplateCover from './TemplateCover';
import { 
    Search, 
    FileText, 
    Clock, 
    Layers, 
    Sparkles, 
    CheckCircle, 
    ArrowRight, 
    X,
    TrendingUp,
    BookmarkCheck,
    Plus,
    Trash2
} from 'lucide-react';

interface TemplatesDashboardProps {
    onBackToDocuments?: () => void;
    initialTemplateId?: string;
}

const TemplatesDashboard: React.FC<TemplatesDashboardProps> = ({ onBackToDocuments, initialTemplateId }) => {
    const { user } = useUser();
    const { getToken } = useAuth();

    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    
    // Details drawer/wizard states
    const [previewTemplate, setPreviewTemplate] = useState<any | null>(null);
    const [activeWizardTemplate, setActiveWizardTemplate] = useState<any | null>(null);
    const [isStudioOpen, setIsStudioOpen] = useState(false);
    
    // Custom templates fetched from Supabase
    const [customTemplates, setCustomTemplates] = useState<DocumentTemplate[]>([]);
    const [loadingTemplates, setLoadingTemplates] = useState(false);

    // Success notification state
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    const loadCustomTemplates = async () => {
        if (!user) return;
        setLoadingTemplates(true);
        try {
            const token = await getSafeSupabaseToken(getToken);
            const res = await fetchCustomTemplates(token || undefined, user.id);
            if (res.success) {
                setCustomTemplates(res.data);
            }
        } catch (err) {
            console.error('Failed to load custom templates:', err);
        } finally {
            setLoadingTemplates(false);
        }
    };

    useEffect(() => {
        loadCustomTemplates();
    }, [user]);

    // Map database templates to internal Template structure
    const mappedCustomTemplates = customTemplates.map(ct => ({
        id: ct.id,
        name: ct.name,
        category: ct.category || 'custom',
        categoryLabel: ct.category === 'hr' ? 'Employment & HR' :
                       ct.category === 'legal' ? 'Legal & Liability' :
                       ct.category === 'sales' ? 'Sales & Finance' : 'Custom Template',
        description: ct.description || 'No description provided.',
        estimatedTime: '2 mins',
        pagesCount: 1,
        popularity: 5,
        fields: ct.fields?.map(f => ({
            id: f.id,
            label: `${f.field_type.toUpperCase()} Field`,
            type: 'text',
            required: f.is_required,
            defaultValue: ''
        })) || [],
        isCustom: true,
        rawTemplate: ct
    }));

    const combinedTemplates = [
        ...TEMPLATES,
        ...mappedCustomTemplates
    ];

    // Auto-launch template wizard if initialTemplateId matches
    useEffect(() => {
        if (initialTemplateId && combinedTemplates.length > 0) {
            const found = combinedTemplates.find(t => t.id === initialTemplateId);
            if (found) {
                setActiveWizardTemplate(found);
            }
        }
    }, [initialTemplateId, combinedTemplates.length]);

    // Filter templates based on search & category
    const filteredTemplates = combinedTemplates.filter(tpl => {
        const matchesCategory = activeCategory === 'all' || tpl.category === activeCategory;
        const matchesSearch = tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              tpl.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const getCategoryColor = (catId: string) => {
        return TEMPLATE_CATEGORIES.find(c => c.id === catId)?.color || '#6366f1';
    };

    const handleWizardSuccess = () => {
        setActiveWizardTemplate(null);
        setPreviewTemplate(null);
        setShowSuccessToast(true);
        setTimeout(() => {
            setShowSuccessToast(false);
            if (onBackToDocuments) {
                onBackToDocuments(); // Redirect back to documents list to see new signature request
            }
        }, 3000);
    };

    if (isStudioOpen) {
        return (
            <TemplateStudio 
                onClose={() => setIsStudioOpen(false)}
                onSuccess={() => {
                    setIsStudioOpen(false);
                    loadCustomTemplates();
                }}
            />
        );
    }

    if (activeWizardTemplate) {
        return (
            <TemplateWizard
                template={activeWizardTemplate}
                onClose={() => setActiveWizardTemplate(null)}
                onSuccess={handleWizardSuccess}
            />
        );
    }

    return (
        <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', paddingBottom: '5rem' }}>
            
            {/* Header Banner - Glassmorphic / Gradient */}
            <div style={{
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                borderRadius: '24px',
                padding: '3rem',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 20px 30px -10px rgba(79, 70, 229, 0.3)',
                marginBottom: '3rem'
            }}>
                {/* Visual decorations */}
                <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 65%)', borderRadius: '50%' }}></div>
                <div style={{ position: 'absolute', bottom: '-40%', left: '10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 65%)', borderRadius: '50%' }}></div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem', position: 'relative', zIndex: 2 }}>
                    <div style={{ maxWidth: '800px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)', padding: '0.4rem 1rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                            <Sparkles size={14} /> Ready-to-Sign Templates
                        </div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-0.03em', marginBottom: '1rem', lineHeight: 1.2 }}>
                            Generate & Sign Agreements Instantly
                        </h1>
                        <p style={{ fontSize: '1.1rem', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.6, margin: 0 }}>
                            Select a document template, populate required details in our interactive form wizard, and instantly prepare it for binding e-signatures with auto-placed fields.
                        </p>
                    </div>
                </div>
            </div>

            {/* Success Toast */}
            {showSuccessToast && (
                <div style={{
                    position: 'fixed',
                    bottom: '30px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#059669',
                    color: 'white',
                    padding: '1rem 2rem',
                    borderRadius: '16px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    zIndex: 1000,
                    animation: 'slideUp 0.3s ease-out'
                }}>
                    <CheckCircle size={20} />
                    <span style={{ fontWeight: '600' }}>Document generated & signature request sent successfully!</span>
                </div>
            )}

            {/* Navigation and Search controls */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                {/* Categories */}
                <div style={{ display: 'flex', gap: '0.5rem', background: '#f3f4f6', padding: '0.35rem', borderRadius: '14px', width: 'fit-content' }}>
                    {TEMPLATE_CATEGORIES.map(cat => {
                        const isActive = activeCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                style={{
                                    padding: '0.5rem 1.25rem',
                                    background: isActive ? cat.color : 'transparent',
                                    color: isActive ? 'white' : '#4b5563',
                                    border: 'none',
                                    borderRadius: '10px',
                                    fontWeight: '600',
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                                }}
                            >
                                {cat.label}
                            </button>
                        );
                    })}
                </div>

                {/* Search Bar */}
                <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
                    <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: '14px', top: '13px' }} />
                    <input
                        type="text"
                        placeholder="Search templates..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.7rem 1rem 0.7rem 2.5rem',
                            borderRadius: '12px',
                            border: '1px solid #e5e7eb',
                            background: 'white',
                            outline: 'none',
                            fontSize: '0.9rem',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.01)',
                            transition: 'all 0.2s'
                        }}
                        className="focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100"
                    />
                </div>
            </div>

            {/* Templates Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                gap: '1.5rem'
            }}>
                {filteredTemplates.map(tpl => {
                    const cardColor = getCategoryColor(tpl.category);
                    return (
                        <div
                            key={tpl.id}
                            style={{
                                background: 'white',
                                borderRadius: '20px',
                                border: '1px solid #e5e7eb',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                cursor: 'pointer',
                                overflow: 'hidden',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.01)'
                            }}
                            className="template-card"
                            onClick={() => setPreviewTemplate(tpl)}
                        >
                            <div style={{ width: '100%', height: '180px', overflow: 'hidden', borderBottom: '1px solid #f3f4f6', position: 'relative' }}>
                                <div className="template-cover-zoom-inner">
                                    <TemplateCover template={tpl} />
                                </div>
                            </div>
                            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                                <div>
                                    {/* Card Top Row / Category Tag */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                        <span style={{
                                            fontSize: '0.7rem',
                                            fontWeight: '700',
                                            color: cardColor,
                                            background: `${cardColor}10`,
                                            padding: '0.2rem 0.6rem',
                                            borderRadius: '9999px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em'
                                        }}>
                                            {tpl.categoryLabel}
                                        </span>
                                        {tpl.popularity >= 5 && (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.15rem', fontSize: '0.7rem', color: '#fbbf24', fontWeight: 'bold' }}>
                                                ★ Popular
                                            </span>
                                        )}
                                    </div>

                                    {/* Title & Subtitle */}
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#111827', margin: '0 0 0.5rem 0', letterSpacing: '-0.02em', lineHeight: '1.3' }}>
                                        {tpl.name}
                                    </h3>
                                    <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0 0 1rem 0', lineHeight: 1.5 }}>
                                        {tpl.description}
                                    </p>
                                </div>

                                {/* Card Footer */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    paddingTop: '1rem',
                                    borderTop: '1px solid #f3f4f6'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#9ca3af', fontSize: '0.75rem', fontWeight: 600 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                            <Clock size={12} /> {tpl.estimatedTime}
                                        </div>
                                        <div style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#d1d5db' }}></div>
                                        <div>{tpl.pagesCount} Page{tpl.pagesCount > 1 ? 's' : ''}</div>
                                    </div>
                                    <span style={{
                                        fontSize: '0.8rem',
                                        fontWeight: '700',
                                        color: '#4f46e5',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.2rem'
                                    }}>
                                        Configure <ArrowRight size={12} />
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Preview Slide-Over Drawer */}
            {previewTemplate && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 1000,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    fontFamily: 'system-ui, sans-serif'
                }}>
                    {/* Backdrop */}
                    <div 
                        onClick={() => setPreviewTemplate(null)}
                        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }} 
                    />
                    
                    {/* Drawer Content */}
                    <div style={{
                        position: 'relative',
                        width: '100%',
                        maxWidth: '460px',
                        background: 'white',
                        height: '100%',
                        boxShadow: '-10px 0 30px rgba(0,0,0,0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        animation: 'slideLeft 0.3s ease-out'
                    }}>
                        <div style={{ padding: '2rem', overflowY: 'auto', flex: 1 }}>
                            {/* Drawer Close */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.9rem', fontWeight: 600 }}>
                                    <BookmarkCheck size={16} /> Template Preview
                                </div>
                                <button 
                                    onClick={() => setPreviewTemplate(null)}
                                    style={{ padding: '0.5rem', borderRadius: '50%', border: 'none', background: '#f3f4f6', cursor: 'pointer', color: '#4b5563' }}
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Logo Category Banner */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '14px',
                                    background: `${getCategoryColor(previewTemplate.category)}15`,
                                    color: getCategoryColor(previewTemplate.category),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: `1px solid ${getCategoryColor(previewTemplate.category)}25`
                                }}>
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: getCategoryColor(previewTemplate.category), textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        {previewTemplate.categoryLabel}
                                    </span>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#111827', margin: 0, letterSpacing: '-0.025em' }}>
                                        {previewTemplate.name}
                                    </h2>
                                </div>
                            </div>

                            <p style={{ color: '#4b5563', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                                {previewTemplate.description}
                             </p>

                            <div style={{ height: '1px', background: '#f3f4f6', marginBottom: '2rem' }} />

                            {/* Template Summary Info */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
                                <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                                    Configuration Details
                                </h4>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                                        <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Est. Time to Fill</div>
                                        <div style={{ fontSize: '1rem', fontWeight: '700', color: '#1f2937' }}>{previewTemplate.estimatedTime}</div>
                                    </div>
                                    <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                                        <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Contract Length</div>
                                        <div style={{ fontSize: '1rem', fontWeight: '700', color: '#1f2937' }}>{previewTemplate.pagesCount} Page{previewTemplate.pagesCount > 1 ? 's' : ''}</div>
                                    </div>
                                </div>

                                <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                    <TrendingUp size={20} color="#10b981" />
                                    <div>
                                        <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Compliance Grade</div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1f2937' }}>Certified Legal Standards</div>
                                    </div>
                                </div>
                            </div>

                            {/* Input Checklist */}
                            <div>
                                <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
                                    Required Information
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {previewTemplate.isCustom ? (
                                        <>
                                            {previewTemplate.rawTemplate?.roles?.map((r: any) => (
                                                <div key={r.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.9rem', color: '#4b5563' }}>
                                                    <CheckCircle size={16} color={r.color} style={{ marginTop: '2px', flexShrink: 0 }} />
                                                    <span>{r.role_name} Signature Details (Name & Email)</span>
                                                </div>
                                            ))}
                                        </>
                                    ) : (
                                        <>
                                            {previewTemplate.fields.map((f: any) => (
                                                <div key={f.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.9rem', color: '#4b5563' }}>
                                                    <CheckCircle size={16} color="#4f46e5" style={{ marginTop: '2px', flexShrink: 0 }} />
                                                    <span>{f.label}</span>
                                                </div>
                                            ))}
                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.9rem', color: '#4b5563' }}>
                                                <CheckCircle size={16} color="#ec4899" style={{ marginTop: '2px', flexShrink: 0 }} />
                                                <span>Recipient Signature Details (Name & Email)</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{
                            padding: '1.5rem 2rem',
                            borderTop: '1px solid #e5e7eb',
                            background: '#fafafa',
                            display: 'flex',
                            gap: '1rem'
                        }}>
                            {previewTemplate.isCustom && (
                                <button
                                    onClick={async () => {
                                        if (confirm(`Are you sure you want to delete "${previewTemplate.name}"?`)) {
                                            const token = await getSafeSupabaseToken(getToken);
                                            const res = await deleteCustomTemplate(token || undefined, previewTemplate.id);
                                            if (res.success) {
                                                setPreviewTemplate(null);
                                                loadCustomTemplates();
                                            } else {
                                                alert(`Error deleting template: ${res.error}`);
                                            }
                                        }
                                    }}
                                    style={{
                                        flex: 1,
                                        padding: '0.75rem',
                                        border: '1px solid #fee2e2',
                                        borderRadius: '12px',
                                        background: '#fef2f2',
                                        color: '#ef4444',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        fontSize: '0.95rem'
                                    }}
                                >
                                    Delete
                                </button>
                            )}
                            <button
                                onClick={() => setPreviewTemplate(null)}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '12px',
                                    background: 'white',
                                    color: '#4b5563',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    fontSize: '0.95rem'
                                }}
                            >
                                Close
                            </button>
                            <button
                                onClick={() => setActiveWizardTemplate(previewTemplate)}
                                style={{
                                    flex: 2,
                                    padding: '0.75rem',
                                    border: 'none',
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                                    color: 'white',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    fontSize: '0.95rem',
                                    boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)'
                                }}
                            >
                                Use Template
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Custom Animations Styling */}
            <style>{`
                @keyframes slideLeft {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                .template-card {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .template-card:hover {
                    transform: translateY(-6px) scale(1.01);
                    box-shadow: 0 20px 25px -5px rgba(0,0,0,0.06), 0 10px 10px -5px rgba(0,0,0,0.03) !important;
                    border-color: #cbd5e1 !important;
                }
                .template-card:hover .template-cover-zoom-inner {
                    transform: scale(1.05);
                }
                .template-cover-zoom-inner {
                    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                    height: 100%;
                    width: 100%;
                }
                .hover\\:scale-101:hover {
                    transform: translateY(-4px) scale(1.01);
                }
                .hover\\:shadow-lg:hover {
                    box-shadow: 0 20px 25px -5px rgba(0,0,0,0.06), 0 10px 10px -5px rgba(0,0,0,0.03) !important;
                }
                .hover\\:border-gray-300:hover {
                    border-color: #cbd5e1 !important;
                }
                @keyframes slideUp {
                    from { transform: translate(-50%, 20px); opacity: 0; }
                    to { transform: translate(-50%, 0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default TemplatesDashboard;
