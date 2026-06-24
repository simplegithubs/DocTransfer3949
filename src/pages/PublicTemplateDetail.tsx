import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { TEMPLATES, type Template } from '../components/templates/templateData';
import { generatePdfFromTemplate } from '../lib/pdfTemplateGenerator';
import { supabase } from '../lib/supabase';
import { 
    FileText, 
    Clock, 
    ShieldCheck, 
    Download, 
    Sparkles, 
    ArrowRight, 
    ArrowLeft, 
    CheckCircle, 
    UserCheck,
    HelpCircle
} from 'lucide-react';

const PublicTemplateDetail: React.FC = () => {
    const { templateId: routeTemplateId, slug } = useParams<{ templateId?: string; slug?: string }>();
    const templateId = routeTemplateId || slug;
    const navigate = useNavigate();
    const [template, setTemplate] = useState<Template | null>(null);
    const [loading, setLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        const fetchTemplate = async () => {
            setLoading(true);
            // 1. Check if template matches predefined ones
            const systemTemplate = TEMPLATES.find(t => t.id === templateId);
            if (systemTemplate) {
                setTemplate(systemTemplate);
                setLoading(false);
                return;
            }

            // 2. Fetch custom template from Supabase
            try {
                const { data, error } = await supabase
                    .from('document_templates')
                    .select('*')
                    .eq('id', templateId)
                    .single();

                if (data && !error) {
                    const mapped: Template = {
                        id: data.id,
                        name: data.name,
                        category: (data.category as any) || 'custom',
                        categoryLabel: data.category === 'hr' ? 'Employment & HR' :
                                       data.category === 'legal' ? 'Legal & Liability' :
                                       data.category === 'sales' ? 'Sales & Finance' : 'Custom Template',
                        description: data.description || 'No description provided.',
                        estimatedTime: '2 mins',
                        pagesCount: 1,
                        popularity: 5,
                        fields: [],
                        generateContent: () => {
                            const text = data.content_json?.text || '';
                            const paragraphs = text.split('\n\n');
                            const sections = paragraphs.map((p: string) => ({ type: 'paragraph' as const, text: p }));
                            sections.unshift({ type: 'title' as const, text: data.name });
                            sections.push({ type: 'signature-block' as const });
                            return sections;
                        }
                    };
                    setTemplate(mapped);
                }
            } catch (err) {
                console.error('Failed to load dynamic template:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTemplate();
    }, [templateId]);

    // Setup SEO Head tags & JSON-LD schema dynamically
    useEffect(() => {
        if (!template) return;

        // Dynamic metadata
        document.title = `${template.name} - Free Template & e-Sign | DocTransfer`;
        
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.setAttribute('name', 'description');
            document.head.appendChild(metaDescription);
        }
        metaDescription.setAttribute('content', `Download or e-sign a legally compliant ${template.name}. ${template.description} Get started instantly on DocTransfer.`);

        // JSON-LD structured data schema
        const schema = {
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": `How to create and sign a ${template.name}`,
            "description": template.description,
            "step": [
                {
                    "@type": "HowToStep",
                    "name": "Configure Template Variables",
                    "text": "Fill in the required template fields (names, dates, values) in the guided wizard."
                },
                {
                    "@type": "HowToStep",
                    "name": "Add Signers & Roles",
                    "text": "Assign recipient signers and coordinate e-signature positions."
                },
                {
                    "@type": "HowToStep",
                    "name": "Sign and Send",
                    "text": "Affix signatures digitally and securely route the document to recipients."
                }
            ],
            "totalTime": "PT3M"
        };

        const scriptId = 'jsonld-schema-template';
        let script = document.getElementById(scriptId);
        if (!script) {
            script = document.createElement('script');
            script.id = scriptId;
            script.setAttribute('type', 'application/ld+json');
            document.head.appendChild(script);
        }
        script.innerHTML = JSON.stringify(schema);

        return () => {
            // Clean up script when leaving page
            const existingScript = document.getElementById(scriptId);
            if (existingScript) {
                existingScript.remove();
            }
        };
    }, [template]);

    const handleDownloadSample = async () => {
        if (!template) return;
        setIsDownloading(true);
        try {
            // Generate content using empty or default parameters
            const defaultVals: Record<string, any> = {};
            template.fields.forEach(f => {
                defaultVals[f.id] = f.defaultValue || `[${f.label}]`;
            });
            const sections = template.generateContent(defaultVals);
            const { pdfBytes } = await generatePdfFromTemplate(template.name, sections);

            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${template.name} - Sample.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error('Failed to generate PDF sample:', err);
            alert('Failed to generate sample PDF. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    };

    const getRelatedComparisons = (category?: string) => {
        switch (category) {
            case 'hr':
                return [
                    { name: 'DocuSign vs DocTransfer', slug: 'docusign-vs-doctransfer' },
                    { name: 'DigiSigner vs DocTransfer', slug: 'digisigner-vs-doctransfer' },
                    { name: 'Adobe Sign vs DocTransfer', slug: 'adobe-sign-vs-doctransfer' }
                ];
            case 'legal':
                return [
                    { name: 'DocuSign vs DocTransfer', slug: 'docusign-vs-doctransfer' },
                    { name: 'HelloSign vs DocuSign vs DocTransfer', slug: 'hellosign-vs-docusign-vs-doctransfer' },
                    { name: 'Adobe Sign vs DocTransfer', slug: 'adobe-sign-vs-doctransfer' }
                ];
            case 'sales':
            default:
                return [
                    { name: 'PandaDoc vs DocTransfer', slug: 'pandadoc-vs-doctransfer' },
                    { name: 'DocSend vs DocTransfer', slug: 'docsend-vs-doctransfer' },
                    { name: 'Zoho Sign vs DocTransfer', slug: 'zoho-sign-vs-doctransfer' }
                ];
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '30px', height: '30px', border: '3px solid #e2e8f0', borderTopColor: '#4f46e5', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Loading template directory...</span>
                </div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (!template) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '1rem' }}>Template Not Found</h2>
                <Link to="/" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: '600' }}>Return to home page</Link>
            </div>
        );
    }

    const categoryColor = 
        template.category === 'hr' ? '#ec4899' :
        template.category === 'legal' ? '#ef4444' : '#10b981';

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1e293b' }}>
            
            {/* Header / Navbar */}
            <header style={{ height: '70px', background: 'white', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', padding: '0 2rem' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#4f46e5', fontWeight: '800', fontSize: '1.25rem' }}>
                    <Sparkles size={22} /> DocTransfer
                </Link>
            </header>

            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem' }}>
                
                {/* Back Link */}
                <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600', marginBottom: '2rem' }}>
                    <ArrowLeft size={16} /> Back to Directory
                </Link>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem' }} className="grid-layout">
                    
                    {/* Left Column: Details & Preview */}
                    <div>
                        {/* Title Banner */}
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: `${categoryColor}12`, border: `1px solid ${categoryColor}25`, padding: '0.4rem 1rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '700', color: categoryColor, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
                            <FileText size={14} /> {template.categoryLabel}
                        </div>
                        
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-0.03em', lineHeight: 1.2, margin: '0 0 1rem 0', color: '#0f172a' }}>
                            {template.name} Template
                        </h1>
                        
                        <p style={{ fontSize: '1.1rem', color: '#475569', lineHeight: 1.6, margin: '0 0 2rem 0' }}>
                            {template.description} Create, fill, sign, and securely route a professional and compliant agreement online in just a few minutes.
                        </p>

                        {/* Quick Stats Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
                            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Clock size={20} color="#4f46e5" />
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Estimated Time</div>
                                    <div style={{ fontSize: '0.95rem', fontWeight: '700' }}>{template.estimatedTime}</div>
                                </div>
                            </div>
                            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <ShieldCheck size={20} color="#10b981" />
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Security Grade</div>
                                    <div style={{ fontSize: '0.95rem', fontWeight: '700' }}>AES-256 E2EE</div>
                                </div>
                            </div>
                            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <UserCheck size={20} color="#8b5cf6" />
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Audit Ready</div>
                                    <div style={{ fontSize: '0.95rem', fontWeight: '700' }}>Full Audit Logs</div>
                                </div>
                            </div>
                        </div>

                        {/* Document Content Crawlable Preview */}
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '1rem' }}>
                            Document Preview & Clauses
                        </h2>
                        
                        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '3rem', maxHeight: '520px', overflowY: 'auto', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', fontFamily: '"Times New Roman", Times, serif', marginBottom: '3rem' }}>
                            {template.generateContent({}).map((section: any, idx: number) => {
                                if (section.type === 'title') {
                                    return <h1 key={idx} style={{ fontSize: '1.5rem', textAlign: 'center', fontWeight: 'bold', margin: '0 0 1.5rem 0' }}>{section.text}</h1>;
                                }
                                if (section.type === 'subtitle') {
                                    return <p key={idx} style={{ fontSize: '0.85rem', textAlign: 'center', color: '#64748b', margin: '-1rem 0 2rem 0', fontFamily: 'system-ui' }}>{section.text}</p>;
                                }
                                if (section.type === 'header') {
                                    return <h3 key={idx} style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '1.5rem 0 0.5rem 0' }}>{section.text}</h3>;
                                }
                                if (section.type === 'paragraph') {
                                    return <p key={idx} style={{ fontSize: '0.95rem', lineHeight: '1.6', textAlign: 'justify', margin: '0 0 1rem 0', textIndent: '1.5rem' }}>{section.text}</p>;
                                }
                                if (section.type === 'signature-block') {
                                    return (
                                        <div key={idx} style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem', marginTop: '2rem', display: 'flex', justifyContent: 'space-between', fontFamily: 'system-ui' }}>
                                            <div>
                                                <div style={{ width: '150px', height: '1px', background: '#cbd5e1', marginBottom: '0.5rem' }} />
                                                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Party A Signature</span>
                                            </div>
                                            <div>
                                                <div style={{ width: '150px', height: '1px', background: '#cbd5e1', marginBottom: '0.5rem' }} />
                                                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Party B Signature</span>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    </div>

                    {/* Right Column: CTA Panel */}
                    <div style={{ position: 'sticky', top: '100px', alignSelf: 'start' }}>
                        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '2rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: '0 0 0.5rem 0' }}>Get Started</h3>
                            <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 1.5rem 0' }}>
                                Choose whether you want to fill and sign the document digitally via our secure workflow, or simply download a sample PDF draft.
                            </p>

                            <button 
                                onClick={() => navigate(`/dataroom?useTemplate=${template.id}`)}
                                style={{
                                    width: '100%',
                                    padding: '0.9rem',
                                    border: 'none',
                                    borderRadius: '14px',
                                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                                    color: 'white',
                                    fontWeight: '700',
                                    fontSize: '0.95rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    marginBottom: '1rem',
                                    boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.2)'
                                }}
                            >
                                Use & Sign This Template <ArrowRight size={16} />
                            </button>

                            <button 
                                onClick={handleDownloadSample}
                                disabled={isDownloading}
                                style={{
                                    width: '100%',
                                    padding: '0.9rem',
                                    border: '1px solid #cbd5e1',
                                    borderRadius: '14px',
                                    background: 'white',
                                    color: '#475569',
                                    fontWeight: '700',
                                    fontSize: '0.95rem',
                                    cursor: isDownloading ? 'wait' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    marginBottom: '2rem'
                                }}
                            >
                                <Download size={16} /> {isDownloading ? 'Generating PDF...' : 'Download Sample PDF'}
                            </button>

                            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.75rem' }}>
                                    <CheckCircle size={14} color="#10b981" /> No credit card required to start
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.75rem' }}>
                                    <CheckCircle size={14} color="#10b981" /> 100% legally binding e-Signatures
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748b' }}>
                                    <CheckCircle size={14} color="#10b981" /> Compliant with ESIGN & eIDAS
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ Section (Programmatic SEO boost) */}
                <div style={{ marginTop: '5rem', borderTop: '1px solid #e2e8f0', paddingTop: '4rem' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <HelpCircle size={24} color="#4f46e5" /> Frequently Asked Questions
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }} className="faq-grid">
                        <div>
                            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
                                Is this {template.name} template legally binding?
                            </h3>
                            <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                                Yes. When signed digitally via DocTransfer's eIDAS/ESIGN compliant workflow, signatures carry full legal force under federal law. An audit trail records timestamps, IP addresses, and user email verification to prove validity.
                            </p>
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
                                Can I modify the clauses in the template?
                            </h3>
                            <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                                Yes. Once you click "Use & Sign This Template" and log into your dashboard, the wizard will guide you through customizing the fields and text elements, or you can create a custom version in the template studio.
                            </p>
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
                                Are my documents encrypted and private?
                            </h3>
                            <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                                Absolutely. DocTransfer uses military-grade AES-256-GCM encryption. We support server-side key management as well as client-side end-to-end encryption (E2EE), meaning nobody—not even DocTransfer—can read your files without the master key.
                            </p>
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
                                Can recipients sign without an account?
                            </h3>
                            <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                                Yes. Recipients only need to click the secure link delivered to their email to sign the document in their browser. They are not required to register or pay any fee to sign the document.
                            </p>
                        </div>
                    </div>
                </div>

                {/* E-Signature Platform Comparisons */}
                <div style={{ marginTop: '4rem', borderTop: '1px solid #e2e8f0', paddingTop: '3rem' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.5rem' }}>
                        E-Signature Platform Comparisons
                    </h3>
                    <p style={{ fontSize: '0.95rem', color: '#64748b', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                        See how DocTransfer compares against legacy platforms in terms of security, features, and cost for {template.categoryLabel || 'legal documents'}.
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                        {getRelatedComparisons(template.category).map((comp, idx) => (
                            <Link
                                key={idx}
                                to={`/comparisons/${comp.slug}`}
                                style={{
                                    background: 'white',
                                    border: '1px solid #e2e8f0',
                                    padding: '0.65rem 1.25rem',
                                    borderRadius: '9999px',
                                    color: '#4f46e5',
                                    textDecoration: 'none',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    transition: 'all 0.2s ease',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.borderColor = '#4f46e5';
                                    e.currentTarget.style.backgroundColor = '#f5f3ff';
                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.borderColor = '#e2e8f0';
                                    e.currentTarget.style.backgroundColor = 'white';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                {comp.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </main>

            {/* Custom Responsive CSS */}
            <style>{`
                .grid-layout {
                    display: grid;
                }
                .faq-grid {
                    display: grid;
                }
                @media (min-width: 768px) {
                    .faq-grid {
                        grid-template-columns: 1fr 1fr !important;
                    }
                }
                @media (min-width: 992px) {
                    .grid-layout {
                        grid-template-columns: 1.6fr 1fr !important;
                    }
                }
                @media (min-width: 768px) {
                    header {
                        padding: 0 4rem !important;
                    }
                    main {
                        padding: 4rem 4rem !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default PublicTemplateDetail;
