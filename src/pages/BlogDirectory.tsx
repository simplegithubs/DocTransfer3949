import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, BookOpen, Clock, Calendar } from 'lucide-react';
import SEO from '../components/SEO';
import { blogArticles } from '../data/blogData';
import BlogAnimation from '../components/BlogAnimation';

const BlogDirectory: React.FC = () => {
  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1e293b' }}>
      <SEO
        title="Blog - Document Security, E-Signatures & Legal Guides | DocTransfer"
        description="Expert articles on document security, electronic signatures, IP protection, NDAs, and contract management. Free templates and actionable legal guides."
        keywords="document security blog, e-signature guides, NDA guide, freelance contract tips, subcontractor agreement guide"
        url="https://www.doctransfer.app/blog"
      />

      {/* Header / Navbar */}
      <header style={{ height: '70px', background: 'white', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#4f46e5', fontWeight: '800', fontSize: '1.25rem' }}>
          <Sparkles size={22} /> DocTransfer
        </Link>
        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/comparisons" style={{ textDecoration: 'none', color: '#64748b', fontWeight: 500, fontSize: '0.95rem' }}>Comparisons</Link>
          <Link to="/alternatives" style={{ textDecoration: 'none', color: '#64748b', fontWeight: 500, fontSize: '0.95rem' }}>Alternatives</Link>
          <Link to="/blog" style={{ textDecoration: 'none', color: '#4f46e5', fontWeight: 600, fontSize: '0.95rem' }}>Blog</Link>
        </nav>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '0.4rem 1.25rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '700', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
            <BookOpen size={14} /> DocTransfer Blog
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: '800', letterSpacing: '-0.03em', lineHeight: 1.1, color: '#0f172a', marginBottom: '1rem' }}>
            Legal Guides & <span style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Contract Insights</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#475569', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
            Expert articles on document security, e-signatures, IP protection, and contract best practices. Actionable advice backed by free templates.
          </p>
        </div>

        {/* Articles Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
          {blogArticles.map((article) => (
            <article
              key={article.slug}
              className="blog-card"
              style={{
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)',
                transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column'
              }}
              onClick={() => window.location.href = `/blog/${article.slug}`}
            >
              {/* Blog Card Animation */}
              <BlogAnimation slug={article.slug} isCompact={true} />

              {/* Content */}
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                {/* Category Badge */}
                <span style={{
                  display: 'inline-block',
                  background: '#f5f3ff',
                  color: '#7c3aed',
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '1rem',
                  width: 'fit-content'
                }}>
                  {article.category}
                </span>

                <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.75rem 0', lineHeight: 1.3 }}>
                  {article.title}
                </h2>
                <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5, margin: '0 0 1.5rem 0', flex: 1 }}>
                  {article.excerpt}
                </p>

                {/* Meta */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: '#94a3b8', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={12} /> {article.readTime}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={12} /> {new Date(article.publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                {/* CTA */}
                <Link
                  to={`/blog/${article.slug}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    color: '#4f46e5',
                    fontWeight: '700',
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                    marginTop: '1rem'
                  }}
                >
                  Read Article <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Related Templates Section - Internal Link Hub */}
        <section style={{ marginTop: '5rem', borderTop: '1px solid #e2e8f0', paddingTop: '3rem', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '1rem' }}>
            Featured Document Templates
          </h3>
          <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '1rem' }}>
            Download, customize, and sign these templates for free with DocTransfer.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
            {[
              { name: 'NDA Template', slug: 'nda-template' },
              { name: 'Subcontractor Agreement', slug: 'subcontractor-agreement-template' },
              { name: 'Freelance Agreement', slug: 'freelance-agreement-template' },
              { name: 'Service Agreement', slug: 'service-agreement-template' },
              { name: 'IP Assignment', slug: 'ip-assignment-template' },
              { name: 'Consulting Agreement', slug: 'consulting-agreement-template' },
              { name: 'Lease Agreement', slug: 'lease-agreement-template' },
              { name: 'Partnership Agreement', slug: 'partnership-agreement-template' },
            ].map((t, i) => (
              <Link
                key={i}
                to={`/templates/${t.slug}`}
                style={{
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  padding: '0.5rem 1.25rem',
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
        </section>
      </main>

      {/* Footer Brand Anchor */}
      <footer style={{ borderTop: '1px solid #e2e8f0', padding: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>
        <Link to="/" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: '700' }}>
          <Sparkles size={14} style={{ verticalAlign: 'middle', marginRight: '0.25rem' }} />
          DocTransfer
        </Link>
        {' '}— Secure Document Sharing & E-Signatures. © 2026 DocTransfer Inc.
      </footer>

      <style>{`
        .blog-card:hover {
          transform: translateY(-4px);
          border-color: #c7d2fe !important;
          box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.1) !important;
        }
        .blog-card:hover img {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};

export default BlogDirectory;
