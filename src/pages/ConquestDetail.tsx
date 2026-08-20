import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  BarChart2,
  ShieldAlert,
  FileSignature,
  FolderPlus,
  Rocket,
  Target,
  Scale,
  Home,
  RefreshCw,
  GitBranch,
  FileText,
  Cloud,
  DollarSign,
  Gift,
  CheckCircle,
  Unlock,
  TrendingUp,
  Bell,
  Eye,
  Shield,
  Award,
  Clock,
  Layers,
  Users,
  Zap,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import SEO from '../components/SEO';
import { getConquestBySlug, conquestData } from '../data/conquestData';

const iconMap: Record<string, React.FC<{ size?: number; color?: string }>> = {
  Gift: ({ size = 20, color = '#4f46e5' }) => <Gift size={size} color={color} />,
  Users: ({ size = 20, color = '#4f46e5' }) => <Users size={size} color={color} />,
  Zap: ({ size = 20, color = '#4f46e5' }) => <Zap size={size} color={color} />,
  CheckCircle: ({ size = 20, color = '#4f46e5' }) => <CheckCircle size={size} color={color} />,
  Unlock: ({ size = 20, color = '#4f46e5' }) => <Unlock size={size} color={color} />,
  TrendingUp: ({ size = 20, color = '#4f46e5' }) => <TrendingUp size={size} color={color} />,
  Bell: ({ size = 20, color = '#4f46e5' }) => <Bell size={size} color={color} />,
  Eye: ({ size = 20, color = '#4f46e5' }) => <Eye size={size} color={color} />,
  Target: ({ size = 20, color = '#4f46e5' }) => <Target size={size} color={color} />,
  Shield: ({ size = 20, color = '#4f46e5' }) => <Shield size={size} color={color} />,
  Lock: ({ size = 20, color = '#4f46e5' }) => <Shield size={size} color={color} />,
  Layers: ({ size = 20, color = '#4f46e5' }) => <Layers size={size} color={color} />,
  Award: ({ size = 20, color = '#4f46e5' }) => <Award size={size} color={color} />,
  Cloud: ({ size = 20, color = '#4f46e5' }) => <Cloud size={size} color={color} />,
  Clock: ({ size = 20, color = '#4f46e5' }) => <Clock size={size} color={color} />,
  DollarSign: ({ size = 20, color = '#4f46e5' }) => <DollarSign size={size} color={color} />,
  Sparkles: ({ size = 20, color = '#4f46e5' }) => <Sparkles size={size} color={color} />,
  Smartphone: ({ size = 20, color = '#4f46e5' }) => <Sparkles size={size} color={color} />,
  CheckSquare: ({ size = 20, color = '#4f46e5' }) => <CheckCircle size={size} color={color} />
};

const ConquestDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const page = slug ? getConquestBySlug(slug) : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!page) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '1rem' }}>Guide Not Found</h2>
        <Link to="/docsend-alternative" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: '600' }}>Return to Conquest Directory</Link>
      </div>
    );
  }

  const schemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: `DocTransfer — ${page.title}`,
        operatingSystem: 'All',
        applicationCategory: 'BusinessApplication',
        description: page.metaDescription,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD'
        }
      },
      ...(page.faqs.length > 0
        ? [
            {
              '@type': 'FAQPage',
              mainEntity: page.faqs.map(f => ({
                '@type': 'Question',
                name: f.question,
                acceptedAnswer: { '@type': 'Answer', text: f.answer }
              }))
            }
          ]
        : []),
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.doctransfer.app' },
          { '@type': 'ListItem', position: 2, name: 'DocSend Alternative', item: 'https://www.doctransfer.app/docsend-alternative' },
          { '@type': 'ListItem', position: 3, name: page.title }
        ]
      }
    ]
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1e293b' }}>
      <SEO
        title={page.metaTitle}
        description={page.metaDescription}
        keywords={page.keywords}
        url={`https://www.doctransfer.app/docsend-alternative/${page.slug}`}
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
          <Link to="/glossary" style={{ textDecoration: 'none', color: '#64748b', fontWeight: 500, fontSize: '0.95rem' }}>Glossary</Link>
          <Link to="/solutions" style={{ textDecoration: 'none', color: '#64748b', fontWeight: 500, fontSize: '0.95rem' }}>Solutions</Link>
          <Link to="/docsend-alternative" style={{ textDecoration: 'none', color: '#4f46e5', fontWeight: 600, fontSize: '0.95rem' }}>DocSend Alternative</Link>
        </nav>
      </header>

      {/* Hero */}
      <section style={{ background: page.heroGradient, color: 'white', padding: '4rem 1.5rem 5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <Link to="/docsend-alternative" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontWeight: 600, fontSize: '0.88rem', marginBottom: '1.5rem' }}>
            <ArrowLeft size={16} /> Back to DocSend Alternative Hub
          </Link>

          <h1 style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', fontWeight: '800', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '1.25rem' }}>
            {page.headline}
          </h1>

          <p style={{ fontSize: '1.25rem', opacity: 0.92, maxWidth: '750px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
            {page.subheadline}
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/"
              style={{
                background: 'white',
                color: '#4f46e5',
                padding: '0.9rem 2.25rem',
                borderRadius: '12px',
                fontWeight: '700',
                fontSize: '1rem',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              Switch to DocTransfer Free <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        {/* DocSend Limitations */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a' }}>Why Users Leave DocSend</h2>
            <p style={{ color: '#64748b', fontSize: '1.05rem', margin: '0.5rem 0 0' }}>The core pain points driving teams to seek modern alternatives.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {page.docsendLimitations.map((lim, index) => (
              <div key={index} style={{ background: 'white', border: '1px solid #fee2e2', borderRadius: '16px', padding: '1.75rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <AlertTriangle size={20} color="#ef4444" />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#991b1b', marginBottom: '0.5rem' }}>{lim.title}</h3>
                <p style={{ fontSize: '0.92rem', color: '#475569', margin: 0, lineHeight: 1.6 }}>{lim.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Feature Comparison Table */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a' }}>Side-by-Side Comparison</h2>
            <p style={{ color: '#64748b', fontSize: '1.05rem', margin: '0.5rem 0 0' }}>See how DocTransfer compares directly against legacy alternatives.</p>
          </div>

          <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.95rem', color: '#475569', fontWeight: 700 }}>Feature / Metric</th>
                  <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.95rem', color: '#dc2626', fontWeight: 700, width: '30%' }}>Competitor / Legacy</th>
                  <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.95rem', color: '#4f46e5', fontWeight: 800, width: '35%', background: '#eef2ff' }}>DocTransfer</th>
                </tr>
              </thead>
              <tbody>
                {page.comparisonMatrix.map((row, index) => (
                  <tr key={index} style={{ borderBottom: index < page.comparisonMatrix.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#1e293b', fontSize: '0.92rem' }}>{row.feature}</td>
                    <td style={{ padding: '1rem 1.5rem', color: '#64748b', fontSize: '0.92rem' }}>
                      {row.docsend || row.pandadoc || row.notion || row.googleDrive || 'N/A'}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: '#4f46e5', fontWeight: 700, fontSize: '0.92rem', background: '#f8fafc' }}>
                      {row.doctransfer}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Key Benefits Grid */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a' }}>Key Switcher Advantages</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {page.keyBenefits.map((ben, index) => {
              const IconComp = iconMap[ben.icon] || (({ size, color }: any) => <CheckCircle2 size={size} color={color} />);
              return (
                <div key={index} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.75rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                    <IconComp size={20} color="#4f46e5" />
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>{ben.title}</h3>
                  <p style={{ fontSize: '0.92rem', color: '#475569', margin: 0, lineHeight: 1.6 }}>{ben.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Cross-Link Mesh */}
        <section style={{ background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '2.5rem', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.5rem' }}>Explore Related Ecosystem Hubs</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {page.relatedSolutions.length > 0 && (
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#4f46e5', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Solutions</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {page.relatedSolutions.map(s => (
                    <Link key={s.slug} to={`/solutions/${s.slug}`} style={{ color: '#334155', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Target size={14} color="#4f46e5" /> {s.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {page.relatedTools.length > 0 && (
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#f59e0b', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Interactive Tools</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {page.relatedTools.map(t => (
                    <Link key={t.slug} to={`/tools/${t.slug}`} style={{ color: '#334155', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Sparkles size={14} color="#f59e0b" /> {t.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {page.relatedGlossary.length > 0 && (
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#10b981', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Glossary Terms</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {page.relatedGlossary.map(g => (
                    <Link key={g.slug} to={`/glossary/${g.slug}`} style={{ color: '#334155', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Award size={14} color="#10b981" /> {g.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {page.relatedIntegrations.length > 0 && (
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#06b6d4', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Integrations</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {page.relatedIntegrations.map(ig => (
                    <Link key={ig.slug} to={`/integrations/${ig.slug}`} style={{ color: '#334155', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <ExternalLink size={14} color="#06b6d4" /> {ig.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* FAQs */}
        {page.faqs.length > 0 && (
          <section style={{ background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '2.5rem', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HelpCircle size={22} color="#4f46e5" /> Frequently Asked Questions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {page.faqs.map((faq, i) => (
                <div key={i} style={{ borderTop: i > 0 ? '1px solid #f1f5f9' : 'none', paddingTop: i > 0 ? '1.25rem' : 0 }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.4rem' }}>{faq.question}</h3>
                  <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Final CTA */}
        <section style={{ textAlign: 'center', padding: '3.5rem 2rem', background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', borderRadius: '24px', color: 'white' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1rem' }}>Ready to Make the Switch?</h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
            Join thousands of dealmakers who replaced expensive monthly subscriptions with DocTransfer's free, secure platform.
          </p>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'white',
              color: '#4f46e5',
              padding: '0.9rem 2.25rem',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '1rem',
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            Start Free — No Credit Card <ArrowRight size={18} />
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '3rem 1.5rem', color: '#94a3b8', fontSize: '0.85rem', borderTop: '1px solid #e2e8f0', marginTop: '4rem' }}>
        <p>© {new Date().getFullYear()} DocTransfer. All rights reserved.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '0.75rem' }}>
          <Link to="/" style={{ color: '#64748b', textDecoration: 'none' }}>Home</Link>
          <Link to="/pricing" style={{ color: '#64748b', textDecoration: 'none' }}>Pricing</Link>
          <Link to="/docsend-alternative" style={{ color: '#64748b', textDecoration: 'none' }}>DocSend Alternative</Link>
          <Link to="/research" style={{ color: '#64748b', textDecoration: 'none' }}>Research</Link>
          <Link to="/tools" style={{ color: '#64748b', textDecoration: 'none' }}>Tools</Link>
          <Link to="/solutions" style={{ color: '#64748b', textDecoration: 'none' }}>Solutions</Link>
          <Link to="/sitemap-directory" style={{ color: '#64748b', textDecoration: 'none' }}>Directory</Link>
        </div>
      </footer>
    </div>
  );
};

export default ConquestDetail;
