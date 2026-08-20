import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, ArrowRight, CheckCircle2, Layers, BookOpen, ShieldCheck } from 'lucide-react';
import SEO from '../components/SEO';
import { getIntegrationBySlug, integrationsList } from '../data/integrationsData';

const IntegrationDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const integration = slug ? getIntegrationBySlug(slug) : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!integration) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '1rem' }}>Integration Not Found</h2>
        <Link to="/integrations" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: '600' }}>Return to Integrations Directory</Link>
      </div>
    );
  }

  const schemaGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": `DocTransfer + ${integration.name} Integration`,
        "operatingSystem": "All",
        "applicationCategory": "BusinessApplication",
        "description": integration.metaDescription,
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      },
      {
        "@type": "HowTo",
        "name": `How to connect DocTransfer with ${integration.name}`,
        "step": integration.howItWorks.map(step => ({
          "@type": "HowToStep",
          "position": step.step,
          "name": step.title,
          "itemListElement": [{ "@type": "HowToDirection", "text": step.description }]
        }))
      },
      ...(integration.faqs.length > 0 ? [{
        "@type": "FAQPage",
        "mainEntity": integration.faqs.map(f => ({
          "@type": "Question",
          "name": f.question,
          "acceptedAnswer": { "@type": "Answer", "text": f.answer }
        }))
      }] : []),
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.doctransfer.app" },
          { "@type": "ListItem", "position": 2, "name": "Integrations", "item": "https://www.doctransfer.app/integrations" },
          { "@type": "ListItem", "position": 3, "name": integration.name }
        ]
      }
    ]
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1e293b' }}>
      <SEO
        title={integration.metaTitle}
        description={integration.metaDescription}
        keywords={integration.keywords}
        url={`https://www.doctransfer.app/integrations/${integration.slug}`}
        schema={schemaGraph}
      />

      {/* Header */}
      <header style={{ height: '70px', background: 'white', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#4f46e5', fontWeight: '800', fontSize: '1.25rem' }}>
          <Sparkles size={22} /> DocTransfer
        </Link>
        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/integrations" style={{ textDecoration: 'none', color: '#4f46e5', fontWeight: 600, fontSize: '0.95rem' }}>Integrations Directory</Link>
          <Link to="/research" style={{ textDecoration: 'none', color: '#64748b', fontWeight: 500, fontSize: '0.95rem' }}>Research</Link>
        </nav>
      </header>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        {/* Breadcrumb */}
        <Link to="/integrations" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600', marginBottom: '2rem' }}>
          <ArrowLeft size={16} /> Back to Integrations Directory
        </Link>

        {/* Hero Section with Connected Badges */}
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '3rem 2rem', textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', background: '#f8fafc', padding: '0.75rem 1.5rem', borderRadius: '9999px', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
            <span style={{ fontWeight: '800', color: '#4f46e5', fontSize: '1rem' }}>DocTransfer</span>
            <span style={{ color: '#94a3b8', fontWeight: '800' }}>+</span>
            <span style={{ fontWeight: '800', color: '#0f172a', fontSize: '1rem' }}>{integration.name}</span>
          </div>

          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '1rem', lineHeight: 1.2 }}>
            {integration.name} Integration for <span style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Secure Document Tracking</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#475569', maxWidth: '650px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
            {integration.tagline}
          </p>

          <Link
            to="/dataroom"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              color: 'white',
              padding: '0.85rem 1.75rem',
              borderRadius: '14px',
              fontWeight: '700',
              fontSize: '1rem',
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)'
            }}
          >
            Connect {integration.name} Free <ArrowRight size={18} />
          </Link>
        </div>

        {/* Overview */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '1rem' }}>
            Why Connect {integration.name} with DocTransfer?
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#334155', lineHeight: 1.8 }}>
            {integration.overview}
          </p>
        </section>

        {/* Key Benefits */}
        <section style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '2rem', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.25rem' }}>
            Key Integration Benefits
          </h2>
          <div style={{ display: 'grid', gap: '0.85rem' }}>
            {integration.benefits.map((benefit, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <CheckCircle2 size={20} color="#22c55e" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '1rem', color: '#334155', fontWeight: '500' }}>{benefit}</span>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works (Step-by-Step) */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.5rem' }}>
            How It Works: 4-Step Setup Guide
          </h2>
          <div style={{ display: 'grid', gap: '1.25rem' }}>
            {integration.howItWorks.map((step) => (
              <div key={step.step} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                <div style={{ background: '#4f46e5', color: 'white', width: '36px', height: '36px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', flexShrink: 0 }}>
                  {step.step}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', margin: '0 0 0.35rem 0' }}>{step.title}</h3>
                  <p style={{ fontSize: '0.95rem', color: '#475569', margin: 0, lineHeight: 1.6 }}>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        {integration.faqs.length > 0 && (
          <section style={{ marginBottom: '3rem', borderTop: '1px solid #e2e8f0', paddingTop: '3rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.5rem' }}>
              Frequently Asked Questions
            </h2>
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              {integration.faqs.map((faq, idx) => (
                <div key={idx} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>{faq.question}</h3>
                  <p style={{ fontSize: '0.925rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Document Templates */}
        {integration.relatedTemplates.length > 0 && (
          <section style={{ marginBottom: '3rem', borderTop: '1px solid #e2e8f0', paddingTop: '2.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '1rem' }}>
              Popular Templates Used with {integration.name}
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {integration.relatedTemplates.map((t, idx) => (
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
                    fontWeight: 500
                  }}
                >
                  {t.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Related Integrations Sidebar Mesh */}
        <section style={{ marginBottom: '3rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '1rem' }}>
            Explore Related Integrations
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {integration.relatedIntegrations.map((relSlug) => {
              const rel = getIntegrationBySlug(relSlug);
              return (
                <Link
                  key={relSlug}
                  to={`/integrations/${relSlug}`}
                  style={{
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    padding: '0.5rem 1rem',
                    borderRadius: '9999px',
                    color: '#0f172a',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: 600
                  }}
                >
                  DocTransfer + {rel ? rel.name : relSlug}
                </Link>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          borderRadius: '24px',
          padding: '3rem 2rem',
          textAlign: 'center',
          color: 'white'
        }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '1rem' }}>
            Start Using DocTransfer with {integration.name}
          </h2>
          <p style={{ opacity: 0.9, marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem auto' }}>
            Add page-level analytics, dynamic watermarks, and e-signatures to your files today — 100% Free.
          </p>
          <Link
            to="/dataroom"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'white',
              color: '#4f46e5',
              padding: '0.85rem 1.75rem',
              borderRadius: '14px',
              fontWeight: '700',
              fontSize: '1rem',
              textDecoration: 'none'
            }}
          >
            Connect Now Free <ArrowRight size={18} />
          </Link>
        </section>
      </main>

      <footer style={{ borderTop: '1px solid #e2e8f0', padding: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>
        <Link to="/" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: '700' }}>
          <Sparkles size={14} style={{ verticalAlign: 'middle', marginRight: '0.25rem' }} />
          DocTransfer
        </Link>
        {' '}— Secure Document Sharing & E-Signatures. © 2026 DocTransfer Inc.
      </footer>
    </div>
  );
};

export default IntegrationDetail;
