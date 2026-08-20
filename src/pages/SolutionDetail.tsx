import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  BarChart2,
  ShieldCheck,
  RefreshCw,
  Bell,
  Lock,
  FileSignature,
  Shield,
  FileText,
  Eye,
  Upload,
  UserMinus,
  Smartphone,
  CheckSquare,
  FolderPlus,
  Clock,
  Award,
  Cloud,
  ShieldAlert,
  Inbox,
  GitBranch,
  Users,
  CheckCircle,
  Timer,
  List,
  Database,
  BarChart,
  Layout,
  Send,
  Folder,
  Grid,
  Share2,
  Edit3,
  Zap,
  Package,
  FolderCheck,
  UserX,
  Archive,
  Slash,
  Gift,
  TrendingUp,
  UploadCloud,
  FileCheck,
  Trash2,
  DollarSign,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import SEO from '../components/SEO';
import { getSolutionBySlug, solutionsData } from '../data/solutionsData';

const iconMap: Record<string, React.FC<{ size?: number; color?: string }>> = {
  BarChart2: ({ size = 20, color = '#4f46e5' }) => <BarChart2 size={size} color={color} />,
  ShieldCheck: ({ size = 20, color = '#4f46e5' }) => <ShieldCheck size={size} color={color} />,
  RefreshCw: ({ size = 20, color = '#4f46e5' }) => <RefreshCw size={size} color={color} />,
  Bell: ({ size = 20, color = '#4f46e5' }) => <Bell size={size} color={color} />,
  Lock: ({ size = 20, color = '#4f46e5' }) => <Lock size={size} color={color} />,
  FileSignature: ({ size = 20, color = '#4f46e5' }) => <FileSignature size={size} color={color} />,
  Shield: ({ size = 20, color = '#4f46e5' }) => <Shield size={size} color={color} />,
  FileText: ({ size = 20, color = '#4f46e5' }) => <FileText size={size} color={color} />,
  Eye: ({ size = 20, color = '#4f46e5' }) => <Eye size={size} color={color} />,
  Upload: ({ size = 20, color = '#4f46e5' }) => <Upload size={size} color={color} />,
  UserMinus: ({ size = 20, color = '#4f46e5' }) => <UserMinus size={size} color={color} />,
  CheckCircle2: ({ size = 20, color = '#4f46e5' }) => <CheckCircle2 size={size} color={color} />,
  Smartphone: ({ size = 20, color = '#4f46e5' }) => <Smartphone size={size} color={color} />,
  CheckSquare: ({ size = 20, color = '#4f46e5' }) => <CheckSquare size={size} color={color} />,
  FolderPlus: ({ size = 20, color = '#4f46e5' }) => <FolderPlus size={size} color={color} />,
  Clock: ({ size = 20, color = '#4f46e5' }) => <Clock size={size} color={color} />,
  Award: ({ size = 20, color = '#4f46e5' }) => <Award size={size} color={color} />,
  Cloud: ({ size = 20, color = '#4f46e5' }) => <Cloud size={size} color={color} />,
  ShieldAlert: ({ size = 20, color = '#4f46e5' }) => <ShieldAlert size={size} color={color} />,
  Inbox: ({ size = 20, color = '#4f46e5' }) => <Inbox size={size} color={color} />,
  GitBranch: ({ size = 20, color = '#4f46e5' }) => <GitBranch size={size} color={color} />,
  Users: ({ size = 20, color = '#4f46e5' }) => <Users size={size} color={color} />,
  CheckCircle: ({ size = 20, color = '#4f46e5' }) => <CheckCircle size={size} color={color} />,
  Timer: ({ size = 20, color = '#4f46e5' }) => <Timer size={size} color={color} />,
  List: ({ size = 20, color = '#4f46e5' }) => <List size={size} color={color} />,
  Database: ({ size = 20, color = '#4f46e5' }) => <Database size={size} color={color} />,
  BarChart: ({ size = 20, color = '#4f46e5' }) => <BarChart size={size} color={color} />,
  Layout: ({ size = 20, color = '#4f46e5' }) => <Layout size={size} color={color} />,
  Send: ({ size = 20, color = '#4f46e5' }) => <Send size={size} color={color} />,
  Folder: ({ size = 20, color = '#4f46e5' }) => <Folder size={size} color={color} />,
  Grid: ({ size = 20, color = '#4f46e5' }) => <Grid size={size} color={color} />,
  Share2: ({ size = 20, color = '#4f46e5' }) => <Share2 size={size} color={color} />,
  Edit3: ({ size = 20, color = '#4f46e5' }) => <Edit3 size={size} color={color} />,
  Zap: ({ size = 20, color = '#4f46e5' }) => <Zap size={size} color={color} />,
  Package: ({ size = 20, color = '#4f46e5' }) => <Package size={size} color={color} />,
  FolderCheck: ({ size = 20, color = '#4f46e5' }) => <FolderCheck size={size} color={color} />,
  UserX: ({ size = 20, color = '#4f46e5' }) => <UserX size={size} color={color} />,
  Archive: ({ size = 20, color = '#4f46e5' }) => <Archive size={size} color={color} />,
  Slash: ({ size = 20, color = '#4f46e5' }) => <Slash size={size} color={color} />,
  Gift: ({ size = 20, color = '#4f46e5' }) => <Gift size={size} color={color} />,
  TrendingUp: ({ size = 20, color = '#4f46e5' }) => <TrendingUp size={size} color={color} />,
  UploadCloud: ({ size = 20, color = '#4f46e5' }) => <UploadCloud size={size} color={color} />,
  FileCheck: ({ size = 20, color = '#4f46e5' }) => <FileCheck size={size} color={color} />,
  Trash2: ({ size = 20, color = '#4f46e5' }) => <Trash2 size={size} color={color} />,
  DollarSign: ({ size = 20, color = '#4f46e5' }) => <DollarSign size={size} color={color} />
};

const SolutionDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const solution = slug ? getSolutionBySlug(slug) : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!solution) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '1rem' }}>Solution Not Found</h2>
        <Link to="/solutions" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: '600' }}>Return to Solutions Directory</Link>
      </div>
    );
  }

  const schemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: `DocTransfer Solution for ${solution.title}`,
        operatingSystem: 'All',
        applicationCategory: 'BusinessApplication',
        description: solution.metaDescription,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD'
        }
      },
      {
        '@type': 'HowTo',
        name: `How to use DocTransfer for ${solution.title}`,
        step: solution.howItWorks.map(step => ({
          '@type': 'HowToStep',
          position: step.step,
          name: step.title,
          itemListElement: [{ '@type': 'HowToDirection', text: step.description }]
        }))
      },
      ...(solution.faqs.length > 0
        ? [
            {
              '@type': 'FAQPage',
              mainEntity: solution.faqs.map(f => ({
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
          { '@type': 'ListItem', position: 2, name: 'Solutions', item: 'https://www.doctransfer.app/solutions' },
          { '@type': 'ListItem', position: 3, name: solution.title }
        ]
      }
    ]
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1e293b' }}>
      <SEO
        title={solution.metaTitle}
        description={solution.metaDescription}
        keywords={solution.keywords}
        url={`https://www.doctransfer.app/solutions/${solution.slug}`}
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
          <Link to="/solutions" style={{ textDecoration: 'none', color: '#4f46e5', fontWeight: 600, fontSize: '0.95rem' }}>Solutions</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section style={{ background: solution.heroGradient, color: 'white', padding: '4rem 1.5rem 5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <Link to="/solutions" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontWeight: 600, fontSize: '0.88rem', marginBottom: '1.5rem' }}>
            <ArrowLeft size={16} /> Back to Solutions Directory
          </Link>

          <h1 style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', fontWeight: '800', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '1.25rem' }}>
            {solution.headline}
          </h1>

          <p style={{ fontSize: '1.25rem', opacity: 0.92, maxWidth: '750px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
            {solution.subheadline}
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
              Start Free — No Credit Card <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        {/* Pain Points Section */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a' }}>Common Challenges in {solution.title.split(' for ')[1] || solution.title}</h2>
            <p style={{ color: '#64748b', fontSize: '1.05rem', margin: '0.5rem 0 0' }}>Why traditional email attachments and cloud storage links fail modern teams.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {solution.painPoints.map((point, index) => (
              <div key={index} style={{ background: 'white', border: '1px solid #fee2e2', borderRadius: '16px', padding: '1.75rem', boxShadow: '0 2px 4px rgba(239, 68, 68, 0.04)' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <AlertTriangle size={20} color="#ef4444" />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#991b1b', marginBottom: '0.5rem' }}>{point.title}</h3>
                <p style={{ fontSize: '0.92rem', color: '#475569', margin: 0, lineHeight: 1.6 }}>{point.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Feature Matrix Section */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a' }}>Tailored Feature Matrix</h2>
            <p style={{ color: '#64748b', fontSize: '1.05rem', margin: '0.5rem 0 0' }}>Purpose-built capabilities designed to eliminate risk and streamline transactions.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {solution.features.map((feat, index) => {
              const IconComp = iconMap[feat.icon] || (({ size, color }: any) => <CheckCircle2 size={size} color={color} />);
              return (
                <div key={index} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.75rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                    <IconComp size={20} color="#4f46e5" />
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>{feat.title}</h3>
                  <p style={{ fontSize: '0.92rem', color: '#475569', margin: 0, lineHeight: 1.6 }}>{feat.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ROI Stats */}
        <section style={{ background: '#1e1b4b', borderRadius: '24px', padding: '3rem 2rem', color: 'white', marginBottom: '4rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.85rem', fontWeight: '800', marginBottom: '2.5rem' }}>Measurable Business Impact</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
            {solution.stats.map((st, index) => (
              <div key={index} style={{ padding: '1rem' }}>
                <div style={{ fontSize: '3rem', fontWeight: '800', color: '#818cf8', marginBottom: '0.5rem', lineHeight: 1 }}>{st.value}</div>
                <div style={{ fontSize: '1rem', color: '#c7d2fe', fontWeight: 600 }}>{st.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Workflow Visualization */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a' }}>Simple 3-Step Workflow</h2>
            <p style={{ color: '#64748b', fontSize: '1.05rem', margin: '0.5rem 0 0' }}>Get up and running in less than 2 minutes without complex setup.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {solution.howItWorks.map(step => (
              <div key={step.step} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '2rem', position: 'relative' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#4f46e5', color: 'white', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  {step.step}
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>{step.title}</h3>
                <p style={{ fontSize: '0.92rem', color: '#475569', margin: 0, lineHeight: 1.6 }}>{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Cross-Link Mesh Section */}
        <section style={{ background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '2.5rem', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.5rem' }}>Related Ecosystem Resources</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {/* Templates */}
            {solution.relatedTemplates.length > 0 && (
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#4f46e5', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Templates</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {solution.relatedTemplates.map(t => (
                    <Link key={t.slug} to={`/templates/${t.slug}`} style={{ color: '#334155', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <FileText size={14} color="#4f46e5" /> {t.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Tools */}
            {solution.relatedTools.length > 0 && (
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#f59e0b', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Free Tools</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {solution.relatedTools.map(tl => (
                    <Link key={tl.slug} to={`/tools/${tl.slug}`} style={{ color: '#334155', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Sparkles size={14} color="#f59e0b" /> {tl.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Glossary */}
            {solution.relatedGlossary.length > 0 && (
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#10b981', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Glossary Terms</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {solution.relatedGlossary.map(g => (
                    <Link key={g.slug} to={`/glossary/${g.slug}`} style={{ color: '#334155', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Award size={14} color="#10b981" /> {g.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Integrations */}
            {solution.relatedIntegrations.length > 0 && (
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#06b6d4', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Integrations</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {solution.relatedIntegrations.map(ig => (
                    <Link key={ig.slug} to={`/integrations/${ig.slug}`} style={{ color: '#334155', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <ExternalLink size={14} color="#06b6d4" /> {ig.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* FAQs Section */}
        {solution.faqs.length > 0 && (
          <section style={{ background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '2.5rem', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HelpCircle size={22} color="#4f46e5" /> Frequently Asked Questions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {solution.faqs.map((faq, i) => (
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
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1rem' }}>Ready to Supercharge Your Document Workflows?</h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
            Join thousands of modern founders, dealmakers, and enterprises using DocTransfer for bank-grade document sharing and page analytics.
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
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transition: 'all 0.2s'
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
          <Link to="/solutions" style={{ color: '#64748b', textDecoration: 'none' }}>Solutions</Link>
          <Link to="/research" style={{ color: '#64748b', textDecoration: 'none' }}>Research</Link>
          <Link to="/tools" style={{ color: '#64748b', textDecoration: 'none' }}>Tools</Link>
          <Link to="/integrations" style={{ color: '#64748b', textDecoration: 'none' }}>Integrations</Link>
          <Link to="/glossary" style={{ color: '#64748b', textDecoration: 'none' }}>Glossary</Link>
          <Link to="/sitemap-directory" style={{ color: '#64748b', textDecoration: 'none' }}>Directory</Link>
        </div>
      </footer>
    </div>
  );
};

export default SolutionDetail;
