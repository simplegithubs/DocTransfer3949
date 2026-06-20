import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { templateSeoData } from '../data/templateSeoData';
import { TEMPLATES } from '../components/templates/templateData';
import { generatePdfFromTemplate } from '../lib/pdfTemplateGenerator';
import { 
  FileText, 
  Clock, 
  ShieldCheck, 
  Download, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  HelpCircle,
  UserCheck
} from 'lucide-react';

const PublicTemplateSEO: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);

  // Fallback to home if slug doesn't exist in our SEO data
  const data = slug ? templateSeoData[slug] : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!data) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '1rem' }}>Template Not Found</h2>
        <Link to="/" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: '600' }}>Return to home page</Link>
      </div>
    );
  }

  // Find system template to get dynamic structure for PDF generation
  const systemTemplate = TEMPLATES.find(t => t.id === data.templateId);

  const handleDownloadSample = async () => {
    if (!systemTemplate) return;
    setIsDownloading(true);
    try {
      // Generate content using empty or default parameters
      const defaultVals: Record<string, any> = {};
      systemTemplate.fields.forEach(f => {
        defaultVals[f.id] = f.defaultValue || `[${f.label}]`;
      });
      const sections = systemTemplate.generateContent(defaultVals);
      const { pdfBytes } = await generatePdfFromTemplate(systemTemplate.name, sections);

      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${systemTemplate.name} - Sample.pdf`;
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

  const handleUseTemplate = () => {
    navigate(`/dataroom?useTemplate=${data.templateId}`);
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

  // Structured Schema data for SEO (JSON-LD @graph)
  const schemas: any[] = [
    {
      "@type": "HowTo",
      "name": `How to edit and sign a ${data.templateName}`,
      "description": data.metaDescription,
      "step": [
        {
          "@type": "HowToStep",
          "name": "Prepare Details",
          "text": "Identify disclosers, recipients, and details of the transaction or agreement."
        },
        {
          "@type": "HowToStep",
          "name": "Customize Placeholders",
          "text": "Fill out key fields such as names, dates, values, and jurisdiction states."
        },
        {
          "@type": "HowToStep",
          "name": "Collect e-Signatures",
          "text": "Add electronic signature blocks and route digitally to all recipients via DocTransfer."
        }
      ],
      "totalTime": "PT4M"
    }
  ];

  if (data.faqs && data.faqs.length > 0) {
    schemas.push({
      "@type": "FAQPage",
      "mainEntity": data.faqs.map(f => ({
        "@type": "Question",
        "name": f.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.answer
        }
      }))
    });
  }

  const schemaGraph = {
    "@context": "https://schema.org",
    "@graph": schemas
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1e293b' }}>
      <SEO
        title={data.pageTitle}
        description={data.metaDescription}
        keywords={`${data.templateName.toLowerCase()}, free ${data.templateName.toLowerCase()} template, download ${data.templateName.toLowerCase()}, e-sign ${data.templateName.toLowerCase()}`}
        url={`https://doctransfer.app/templates/${data.slug}`}
        schema={schemaGraph}
      />

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
            {data.imageUrl && (
              <div className="seo-hero-image-wrapper" style={{ marginBottom: '2rem', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                <img src={data.imageUrl} alt={data.imageAlt || `Free ${data.templateName} template sample`} style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }} />
              </div>
            )}
            {/* Title Banner */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#e0e7ff', border: '1px solid #c7d2fe', padding: '0.4rem 1rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '700', color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
              <FileText size={14} /> Ready-to-Use Template
            </div>
            
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-0.03em', lineHeight: 1.2, margin: '0 0 1.5rem 0', color: '#0f172a' }}>
              Free {data.templateName} Template
            </h1>
            
            <div style={{ fontSize: '1.1rem', color: '#475569', lineHeight: 1.6, margin: '0 0 2rem 0' }}>
              {data.introduction}
            </div>

            {/* Quick Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
              <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Clock size={20} color="#4f46e5" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Estimated Time</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '700' }}>4 mins</div>
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
              Boilerplate Contract Preview
            </h2>
            
            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '3rem', maxHeight: '520px', overflowY: 'auto', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', fontFamily: '"Times New Roman", Times, serif', marginBottom: '3rem' }}>
              <h1 style={{ fontSize: '1.5rem', textAlign: 'center', fontWeight: 'bold', margin: '0 0 1.5rem 0' }}>{data.boilerplateTitle}</h1>
              {data.boilerplateSections.map((section, idx) => (
                <div key={idx} style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '1.5rem 0 0.5rem 0' }}>{section.title}</h3>
                  <p style={{ fontSize: '0.95rem', lineHeight: '1.6', textAlign: 'justify', margin: '0 0 1rem 0' }}>{section.text}</p>
                </div>
              ))}
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem', marginTop: '2.5rem', display: 'flex', justifyContent: 'space-between', fontFamily: 'system-ui' }}>
                <div>
                  <div style={{ width: '150px', height: '1px', background: '#cbd5e1', marginBottom: '0.5rem' }} />
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Authorized Signature</span>
                </div>
                <div>
                  <div style={{ width: '150px', height: '1px', background: '#cbd5e1', marginBottom: '0.5rem' }} />
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Recipient Signature</span>
                </div>
              </div>
            </div>

            {/* How to use */}
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
              How to Prepare and Sign the {data.templateName}
            </h3>
            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '2rem', marginBottom: '3rem', lineHeight: 1.6, color: '#475569' }}>
              {data.instructions}
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
                onClick={handleUseTemplate}
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
                Use & Sign Online <ArrowRight size={16} />
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

        {/* FAQ Section */}
        <div style={{ marginTop: '5rem', borderTop: '1px solid #e2e8f0', paddingTop: '4rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HelpCircle size={24} color="#4f46e5" /> Frequently Asked Questions
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }} className="faq-grid">
            {data.faqs.map((faq, idx) => (
              <div key={idx}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
                  {faq.question}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* References & Authoritative Sources */}
        {data.externalLinks && data.externalLinks.length > 0 && (
          <div style={{ marginTop: '4rem', borderTop: '1px solid #e2e8f0', paddingTop: '3rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.5rem' }}>
              References & Authoritative Sources
            </h3>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: 0 }}>
              {data.externalLinks.map((link, idx) => (
                <li key={idx} style={{ fontSize: '0.95rem', color: '#475569' }}>
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ color: '#4f46e5', fontWeight: '600', textDecoration: 'underline' }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Related Templates (Internal Links) */}
        {data.relatedTemplates && data.relatedTemplates.length > 0 && (
          <div style={{ marginTop: '4rem', borderTop: '1px solid #e2e8f0', paddingTop: '3rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.5rem' }}>
              Related Document Templates
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              {data.relatedTemplates.map((t, idx) => (
                <Link
                  key={idx}
                  to={`/templates/${t.slug}`}
                  style={{
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    padding: '0.5rem 1rem',
                    borderRadius: '9999px',
                    color: '#4f46e5',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = '#4f46e5';
                    e.currentTarget.style.backgroundColor = '#f5f3ff';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  {t.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* E-Signature Platform Comparisons */}
        <div style={{ marginTop: '4rem', borderTop: '1px solid #e2e8f0', paddingTop: '3rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.5rem' }}>
            E-Signature Platform Comparisons
          </h3>
          <p style={{ fontSize: '0.95rem', color: '#64748b', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            See how DocTransfer compares against legacy platforms in terms of security, features, and cost for {systemTemplate?.categoryLabel || 'legal documents'}.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {getRelatedComparisons(systemTemplate?.category).map((comp, idx) => (
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

export default PublicTemplateSEO;
