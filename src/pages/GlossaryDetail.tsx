import React, { useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, ArrowRight, BookOpen, Shield, Scale, FileText, TrendingUp, ExternalLink, Wrench, Layers, HelpCircle } from 'lucide-react';
import SEO from '../components/SEO';
import { getGlossaryTermBySlug, glossaryTerms, type GlossaryTerm } from '../data/glossaryData';

const categoryMeta: Record<GlossaryTerm['category'], { label: string; color: string; icon: React.FC<{ size?: number }> }> = {
  'document-management': { label: 'Document Management', color: '#4f46e5', icon: FileText },
  'e-signature-legal': { label: 'E-Signature & Legal', color: '#06b6d4', icon: Scale },
  'security-compliance': { label: 'Security & Compliance', color: '#10b981', icon: Shield },
  'business-fundraising': { label: 'Business & Fundraising', color: '#f59e0b', icon: TrendingUp }
};

const GlossaryDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const term = slug ? getGlossaryTermBySlug(slug) : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Related terms resolved
  const relatedTermObjects = useMemo(() => {
    if (!term) return [];
    return term.relatedTerms
      .map(s => glossaryTerms.find(t => t.slug === s))
      .filter(Boolean) as GlossaryTerm[];
  }, [term]);

  if (!term) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        <BookOpen size={48} style={{ color: '#94a3b8', marginBottom: '1rem' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '1rem' }}>Term Not Found</h2>
        <Link to="/glossary" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: '600' }}>Return to Glossary</Link>
      </div>
    );
  }

  const catConfig = categoryMeta[term.category];
  const CatIcon = catConfig.icon;

  const schemaGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "DefinedTerm",
        "name": term.term,
        "description": term.shortDefinition,
        "url": `https://www.doctransfer.app/glossary/${term.slug}`,
        "inDefinedTermSet": {
          "@type": "DefinedTermSet",
          "name": "DocTransfer Document Management Glossary",
          "url": "https://www.doctransfer.app/glossary"
        }
      },
      ...(term.faqs.length > 0 ? [{
        "@type": "FAQPage",
        "mainEntity": term.faqs.map(f => ({
          "@type": "Question",
          "name": f.question,
          "acceptedAnswer": { "@type": "Answer", "text": f.answer }
        }))
      }] : []),
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.doctransfer.app" },
          { "@type": "ListItem", "position": 2, "name": "Glossary", "item": "https://www.doctransfer.app/glossary" },
          { "@type": "ListItem", "position": 3, "name": term.term }
        ]
      }
    ]
  };

  const definitionParagraphs = term.fullDefinition.split('\n\n');

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1e293b' }}>
      <SEO
        title={term.metaTitle}
        description={term.metaDescription}
        keywords={term.keywords}
        url={`https://www.doctransfer.app/glossary/${term.slug}`}
        schema={schemaGraph}
      />

      {/* Header */}
      <header style={{ height: '70px', background: 'white', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#4f46e5', fontWeight: '800', fontSize: '1.25rem' }}>
          <Sparkles size={22} /> DocTransfer
        </Link>
        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/research" style={{ textDecoration: 'none', color: '#64748b', fontWeight: 500, fontSize: '0.95rem' }}>Research</Link>
          <Link to="/tools" style={{ textDecoration: 'none', color: '#64748b', fontWeight: 500, fontSize: '0.95rem' }}>Tools</Link>
          <Link to="/integrations" style={{ textDecoration: 'none', color: '#64748b', fontWeight: 500, fontSize: '0.95rem' }}>Integrations</Link>
          <Link to="/glossary" style={{ textDecoration: 'none', color: '#4f46e5', fontWeight: 600, fontSize: '0.95rem' }}>Glossary</Link>
        </nav>
      </header>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
        {/* Breadcrumb */}
        <Link to="/glossary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#4f46e5', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', marginBottom: '2rem' }}>
          <ArrowLeft size={16} /> Back to Glossary
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
          {/* Main Content */}
          <div>
            {/* Hero Card */}
            <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '2.5rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${catConfig.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CatIcon size={22} />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', color: catConfig.color }}>
                  {catConfig.label}
                </span>
              </div>

              <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: '800', letterSpacing: '-0.03em', lineHeight: 1.15, color: '#0f172a', marginBottom: '1.25rem' }}>
                {term.term}
              </h1>

              {/* Short definition highlight box */}
              <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '14px', padding: '1.25rem 1.5rem', marginBottom: '2rem' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#0284c7', marginBottom: '0.5rem' }}>Quick Definition</div>
                <p style={{ fontSize: '1.05rem', color: '#0f172a', fontWeight: 500, lineHeight: 1.6, margin: 0 }}>
                  {term.shortDefinition}
                </p>
              </div>

              {/* Full definition */}
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem' }}>
                  Full Definition & Explanation
                </h2>
                {definitionParagraphs.map((para, i) => (
                  <p key={i} style={{ fontSize: '1rem', color: '#334155', lineHeight: 1.75, marginBottom: '1.25rem' }}>
                    {para}
                  </p>
                ))}
              </div>

              {/* How DocTransfer Helps */}
              <div style={{ background: 'linear-gradient(135deg, #4f46e510 0%, #7c3aed10 100%)', border: '1px solid #c7d2fe', borderRadius: '16px', padding: '1.5rem 1.75rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#4f46e5', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={18} /> How DocTransfer Helps
                </h3>
                <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.65, margin: 0 }}>
                  DocTransfer provides a free, all-in-one platform for secure document sharing with page-level analytics,
                  e-signatures, dynamic watermarking, and virtual data rooms — everything you need for
                  {term.category === 'document-management' && ' professional document management and tracking.'}
                  {term.category === 'e-signature-legal' && ' legally binding electronic signatures with complete audit trails.'}
                  {term.category === 'security-compliance' && ' enterprise-grade document security and regulatory compliance.'}
                  {term.category === 'business-fundraising' && ' investor-ready document sharing and fundraising workflows.'}
                </p>
                <Link
                  to="/"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                    background: '#4f46e5', color: 'white', padding: '0.7rem 1.5rem',
                    borderRadius: '10px', fontWeight: '600', fontSize: '0.9rem',
                    textDecoration: 'none', marginTop: '1rem', transition: 'all 0.2s'
                  }}
                >
                  Get Started Free <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            {/* FAQs Section */}
            {term.faqs.length > 0 && (
              <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '2rem 2.5rem', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <HelpCircle size={20} /> Frequently Asked Questions
                </h2>
                {term.faqs.map((faq, i) => (
                  <div key={i} style={{ borderTop: i > 0 ? '1px solid #f1f5f9' : 'none', paddingTop: i > 0 ? '1.25rem' : 0, marginBottom: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.6rem' }}>{faq.question}</h3>
                    <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.65, margin: 0 }}>{faq.answer}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside style={{ position: 'sticky', top: '2rem' }}>
            {/* Related Terms */}
            {relatedTermObjects.length > 0 && (
              <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <BookOpen size={16} /> Related Terms
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {relatedTermObjects.map(rt => (
                    <Link
                      key={rt.slug}
                      to={`/glossary/${rt.slug}`}
                      className="related-term-link"
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '0.6rem 0.85rem', background: '#f8fafc', borderRadius: '10px',
                        textDecoration: 'none', color: '#334155', fontSize: '0.88rem', fontWeight: 600,
                        transition: 'all 0.15s', border: '1px solid transparent'
                      }}
                    >
                      {rt.term}
                      <ArrowRight size={14} style={{ color: '#94a3b8' }} />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Related Tools */}
            {term.relatedTools.length > 0 && (
              <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Wrench size={16} /> Related Tools
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {term.relatedTools.map(tool => (
                    <Link
                      key={tool.slug}
                      to={`/tools/${tool.slug}`}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '0.6rem 0.85rem', background: '#fef3c7', borderRadius: '10px',
                        textDecoration: 'none', color: '#92400e', fontSize: '0.88rem', fontWeight: 600,
                        transition: 'all 0.15s'
                      }}
                    >
                      {tool.name}
                      <ExternalLink size={14} />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Related Integrations */}
            {term.relatedIntegrations.length > 0 && (
              <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Layers size={16} /> Related Integrations
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {term.relatedIntegrations.map(integ => (
                    <Link
                      key={integ.slug}
                      to={`/integrations/${integ.slug}`}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '0.6rem 0.85rem', background: '#eff6ff', borderRadius: '10px',
                        textDecoration: 'none', color: '#1e40af', fontSize: '0.88rem', fontWeight: 600,
                        transition: 'all 0.15s'
                      }}
                    >
                      {integ.name}
                      <ExternalLink size={14} />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Related Templates */}
            {term.relatedTemplates.length > 0 && (
              <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <FileText size={16} /> Related Templates
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {term.relatedTemplates.map(tmpl => (
                    <Link
                      key={tmpl.slug}
                      to={`/templates/${tmpl.slug}`}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '0.6rem 0.85rem', background: '#f0fdf4', borderRadius: '10px',
                        textDecoration: 'none', color: '#166534', fontSize: '0.88rem', fontWeight: 600,
                        transition: 'all 0.15s'
                      }}
                    >
                      {tmpl.name}
                      <ExternalLink size={14} />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* More Terms from Same Category */}
        <div style={{ marginTop: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '1.5rem' }}>
            More {catConfig.label} Terms
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {glossaryTerms
              .filter(t => t.category === term.category && t.slug !== term.slug)
              .slice(0, 6)
              .map(t => (
                <Link
                  key={t.slug}
                  to={`/glossary/${t.slug}`}
                  className="glossary-card"
                  style={{
                    background: 'white', border: '1px solid #e2e8f0', borderRadius: '14px',
                    padding: '1.25rem', textDecoration: 'none', display: 'flex', flexDirection: 'column',
                    justifyContent: 'space-between', minHeight: '120px', transition: 'all 0.2s'
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>{t.term}</h3>
                    <p style={{
                      fontSize: '0.85rem', color: '#64748b', margin: 0, lineHeight: 1.5,
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {t.shortDefinition}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#4f46e5', fontSize: '0.8rem', fontWeight: 600, marginTop: '0.75rem' }}>
                    Define <ArrowRight size={13} />
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '3rem 1.5rem', color: '#94a3b8', fontSize: '0.85rem', borderTop: '1px solid #e2e8f0', marginTop: '2rem' }}>
        <p>© {new Date().getFullYear()} DocTransfer. All rights reserved.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '0.75rem' }}>
          <Link to="/" style={{ color: '#64748b', textDecoration: 'none' }}>Home</Link>
          <Link to="/pricing" style={{ color: '#64748b', textDecoration: 'none' }}>Pricing</Link>
          <Link to="/glossary" style={{ color: '#64748b', textDecoration: 'none' }}>Glossary</Link>
          <Link to="/research" style={{ color: '#64748b', textDecoration: 'none' }}>Research</Link>
          <Link to="/tools" style={{ color: '#64748b', textDecoration: 'none' }}>Tools</Link>
          <Link to="/sitemap-directory" style={{ color: '#64748b', textDecoration: 'none' }}>Directory</Link>
        </div>
      </footer>

      <style>{`
        .glossary-card:hover {
          transform: translateY(-2px);
          border-color: #cbd5e1 !important;
          box-shadow: 0 8px 20px -4px rgba(0,0,0,0.05) !important;
        }
        .related-term-link:hover {
          background: #eff6ff !important;
          border-color: #bfdbfe !important;
          color: #1e40af !important;
        }
        @media (max-width: 900px) {
          main > div:nth-child(3) {
            grid-template-columns: 1fr !important;
          }
          aside {
            position: static !important;
          }
        }
      `}</style>
    </div>
  );
};

export default GlossaryDetail;
