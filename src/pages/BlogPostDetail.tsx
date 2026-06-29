import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, Clock, Calendar, User, ArrowRight, BookOpen } from 'lucide-react';
import SEO from '../components/SEO';
import { getBlogArticleBySlug, blogArticles } from '../data/blogData';

const BlogPostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getBlogArticleBySlug(slug) : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!article) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '1rem' }}>Article Not Found</h2>
        <Link to="/blog" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: '600' }}>Return to Blog</Link>
      </div>
    );
  }

  // Build JSON-LD schema
  const schemaGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "headline": article.title,
        "description": article.metaDescription,
        "image": article.heroImageUrl,
        "author": {
          "@type": "Organization",
          "name": article.author,
          "url": "https://www.doctransfer.app"
        },
        "publisher": {
          "@type": "Organization",
          "name": "DocTransfer",
          "logo": {
            "@type": "ImageObject",
            "url": "https://www.doctransfer.app/logo.png"
          }
        },
        "datePublished": article.publishedDate,
        "dateModified": article.publishedDate
      },
      ...(article.faqs.length > 0 ? [{
        "@type": "FAQPage",
        "mainEntity": article.faqs.map(f => ({
          "@type": "Question",
          "name": f.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.answer
          }
        }))
      }] : [])
    ]
  };

  // Other articles for "More Articles" section
  const otherArticles = blogArticles.filter(a => a.slug !== slug).slice(0, 2);

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1e293b' }}>
      <SEO
        title={article.metaTitle}
        description={article.metaDescription}
        keywords={article.keywords}
        url={`https://www.doctransfer.app/blog/${article.slug}`}
        schema={schemaGraph}
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

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        {/* Back Link */}
        <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600', marginBottom: '2rem' }}>
          <ArrowLeft size={16} /> Back to Blog
        </Link>

        {/* Article Header */}
        <div style={{ marginBottom: '2rem' }}>
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
            marginBottom: '1rem'
          }}>
            {article.category}
          </span>

          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-0.03em', lineHeight: 1.2, color: '#0f172a', margin: '0 0 1.5rem 0' }}>
            {article.title}
          </h1>

          {/* Meta Info */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.5rem', fontSize: '0.875rem', color: '#64748b', marginBottom: '2rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <User size={14} /> {article.author}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar size={14} /> {new Date(article.publishedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Clock size={14} /> {article.readTime}
            </span>
          </div>
        </div>

        {/* Hero Image */}
        <div style={{ borderRadius: '20px', overflow: 'hidden', marginBottom: '3rem', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <img src={article.heroImageUrl} alt={article.heroImageAlt} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }} />
        </div>

        {/* Article Body */}
        <div style={{ lineHeight: 1.8 }}>
          {article.sections.map((section, idx) => (
            <section key={idx} style={{ marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '1rem', lineHeight: 1.3 }}>
                {section.title}
              </h2>
              <p style={{ fontSize: '1.05rem', color: '#334155', lineHeight: 1.8 }}>
                {section.content}
              </p>

              {/* Contextual Template Link (Blog → Template internal link) */}
              {section.templateLink && (
                <Link
                  to={`/templates/${section.templateLink.slug}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginTop: '1.25rem',
                    padding: '0.75rem 1.25rem',
                    background: 'linear-gradient(135deg, #ede9fe 0%, #e0e7ff 100%)',
                    border: '1px solid #c7d2fe',
                    borderRadius: '14px',
                    color: '#4338ca',
                    fontWeight: '700',
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #ddd6fe 0%, #c7d2fe 100%)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #ede9fe 0%, #e0e7ff 100%)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <BookOpen size={16} /> {section.templateLink.label} <ArrowRight size={14} />
                </Link>
              )}
            </section>
          ))}
        </div>

        {/* FAQs */}
        {article.faqs.length > 0 && (
          <section style={{ marginTop: '4rem', borderTop: '1px solid #e2e8f0', paddingTop: '3rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', marginBottom: '2rem' }}>
              Frequently Asked Questions
            </h2>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {article.faqs.map((faq, idx) => (
                <div key={idx} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
                    {faq.question}
                  </h3>
                  <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Templates (Blog → Template links) */}
        <section style={{ marginTop: '4rem', borderTop: '1px solid #e2e8f0', paddingTop: '3rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.5rem' }}>
            Related Document Templates
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {article.relatedTemplates.map((t, idx) => (
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
        </section>

        {/* More Articles */}
        {otherArticles.length > 0 && (
          <section style={{ marginTop: '4rem', borderTop: '1px solid #e2e8f0', paddingTop: '3rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.5rem' }}>
              More Articles
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {otherArticles.map((a) => (
                <Link
                  key={a.slug}
                  to={`/blog/${a.slug}`}
                  style={{
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    textDecoration: 'none',
                    color: '#1e293b',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = '#c7d2fe';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#7c3aed', textTransform: 'uppercase' }}>{a.category}</span>
                  <h4 style={{ fontSize: '1rem', fontWeight: '700', margin: '0.5rem 0', lineHeight: 1.3 }}>{a.title}</h4>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{a.readTime}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section style={{
          marginTop: '4rem',
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          borderRadius: '24px',
          padding: '3rem 2rem',
          textAlign: 'center',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: '-50%', right: '-20%', width: '300px', height: '300px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '1rem', position: 'relative' }}>
            Ready to secure your documents?
          </h2>
          <p style={{ opacity: 0.9, marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem auto', position: 'relative' }}>
            Create, sign, and share professional contracts for free with DocTransfer.
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
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
              position: 'relative'
            }}
          >
            Get Started Free <ArrowRight size={18} />
          </Link>
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
    </div>
  );
};

export default BlogPostDetail;
