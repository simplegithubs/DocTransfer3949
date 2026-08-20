import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, ArrowRight, Clock, Calendar, User, TrendingUp, TrendingDown, Minus, Shield, BookOpen, BarChart3, RefreshCw } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import SEO from '../components/SEO';
import { getResearchReportBySlug, researchReports } from '../data/researchData';
import ResearchAnimation from '../components/seo-layouts/ResearchAnimation';

const CHART_COLORS = ['#4f46e5', '#7c3aed', '#a855f7', '#c084fc', '#ddd6fe', '#e2e8f0'];

const ResearchDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const report = slug ? getResearchReportBySlug(slug) : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!report) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '1rem' }}>Report Not Found</h2>
        <Link to="/research" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: '600' }}>Return to Research Hub</Link>
      </div>
    );
  }

  // JSON-LD Schema
  const schemaGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ScholarlyArticle",
        "headline": report.title,
        "description": report.metaDescription,
        "author": { "@type": "Organization", "name": report.author, "url": "https://www.doctransfer.app" },
        "publisher": {
          "@type": "Organization",
          "name": "DocTransfer",
          "logo": { "@type": "ImageObject", "url": "https://www.doctransfer.app/logo.png" }
        },
        "datePublished": report.publishedDate,
        "dateModified": report.lastUpdated,
        "about": report.category
      },
      ...(report.faqs.length > 0 ? [{
        "@type": "FAQPage",
        "mainEntity": report.faqs.map(f => ({
          "@type": "Question",
          "name": f.question,
          "acceptedAnswer": { "@type": "Answer", "text": f.answer }
        }))
      }] : []),
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.doctransfer.app" },
          { "@type": "ListItem", "position": 2, "name": "Research", "item": "https://www.doctransfer.app/research" },
          { "@type": "ListItem", "position": 3, "name": report.title }
        ]
      }
    ]
  };

  const otherReports = researchReports.filter(r => r.slug !== slug).slice(0, 2);

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1e293b' }}>
      <SEO
        title={report.metaTitle}
        description={report.metaDescription}
        keywords={report.keywords}
        url={`https://www.doctransfer.app/research/${report.slug}`}
        schema={schemaGraph}
      />

      {/* Header */}
      <header style={{ height: '70px', background: 'white', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#4f46e5', fontWeight: '800', fontSize: '1.25rem' }}>
          <Sparkles size={22} /> DocTransfer
        </Link>
        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/comparisons" style={{ textDecoration: 'none', color: '#64748b', fontWeight: 500, fontSize: '0.95rem' }}>Comparisons</Link>
          <Link to="/alternatives" style={{ textDecoration: 'none', color: '#64748b', fontWeight: 500, fontSize: '0.95rem' }}>Alternatives</Link>
          <Link to="/blog" style={{ textDecoration: 'none', color: '#64748b', fontWeight: 500, fontSize: '0.95rem' }}>Blog</Link>
          <Link to="/research" style={{ textDecoration: 'none', color: '#4f46e5', fontWeight: 600, fontSize: '0.95rem' }}>Research</Link>
        </nav>
      </header>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        {/* Breadcrumb */}
        <Link to="/research" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600', marginBottom: '2rem' }}>
          <ArrowLeft size={16} /> Back to Research
        </Link>

        {/* Article Header */}
        <div style={{ marginBottom: '2rem' }}>
          <span style={{
            display: 'inline-block',
            background: report.category === 'fundraising' ? '#ede9fe' : report.category === 'security' ? '#d1fae5' : report.category === 'legal' ? '#fef3c7' : '#e0e7ff',
            color: report.category === 'fundraising' ? '#7c3aed' : report.category === 'security' ? '#059669' : report.category === 'legal' ? '#d97706' : '#4338ca',
            fontSize: '0.7rem',
            fontWeight: '700',
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '1rem'
          }}>
            {report.category} Research
          </span>

          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-0.03em', lineHeight: 1.2, color: '#0f172a', margin: '0 0 1.5rem 0' }}>
            {report.title}
          </h1>

          {/* Meta Info */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.5rem', fontSize: '0.875rem', color: '#64748b', marginBottom: '2rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <User size={14} /> {report.author}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar size={14} /> Published {new Date(report.publishedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <RefreshCw size={14} /> Updated {new Date(report.lastUpdated).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Clock size={14} /> {report.readTime}
            </span>
          </div>
        </div>

        {/* Research Animation Hero */}
        <ResearchAnimation slug={report.slug} />

        {/* ──────────────────────────────────────────── */}
        {/* Key Findings Section */}
        {/* ──────────────────────────────────────────── */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart3 size={22} color="#4f46e5" /> Key Findings
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {report.keyFindings.map((finding, idx) => (
              <div key={idx} style={{
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '20px',
                padding: '1.5rem',
                textAlign: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#c7d2fe';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(79, 70, 229, 0.08)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                <div style={{ fontSize: '2.25rem', fontWeight: '900', color: '#4f46e5', lineHeight: 1, marginBottom: '0.5rem' }}>
                  {finding.value}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.4, marginBottom: '0.5rem' }}>
                  {finding.label}
                </div>
                {finding.changePercent && (
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '9999px',
                    background: finding.trend === 'up' ? '#f0fdf4' : finding.trend === 'down' ? '#fef2f2' : '#f8fafc',
                    color: finding.trend === 'up' ? '#16a34a' : finding.trend === 'down' ? '#dc2626' : '#64748b',
                    border: `1px solid ${finding.trend === 'up' ? '#bbf7d0' : finding.trend === 'down' ? '#fecaca' : '#e2e8f0'}`
                  }}>
                    {finding.trend === 'up' && <TrendingUp size={12} />}
                    {finding.trend === 'down' && <TrendingDown size={12} />}
                    {finding.trend === 'neutral' && <Minus size={12} />}
                    {finding.changePercent}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ──────────────────────────────────────────── */}
        {/* Interactive Charts Section */}
        {/* ──────────────────────────────────────────── */}
        {report.chartData && report.chartData.length > 0 && (
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.5rem' }}>
              Data Visualizations
            </h2>
            <div style={{ display: 'grid', gap: '2rem' }}>
              {report.chartData.map((chart, idx) => (
                <div key={idx} style={{
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '20px',
                  padding: '2rem',
                }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '1.5rem', textAlign: 'center' }}>
                    {chart.title}
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    {chart.chartType === 'bar' ? (
                      <BarChart data={chart.data} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                        <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                        <Tooltip
                          contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                        />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                          {chart.data.map((entry, i) => (
                            <Cell key={i} fill={entry.fill || CHART_COLORS[i % CHART_COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    ) : chart.chartType === 'line' ? (
                      <LineChart data={chart.data} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                        <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                        <Tooltip
                          contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                        />
                        <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={2.5} dot={{ fill: '#4f46e5', r: 4 }} activeDot={{ r: 6, fill: '#7c3aed' }} />
                      </LineChart>
                    ) : (
                      <PieChart>
                        <Pie data={chart.data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={50} paddingAngle={3} label={({ name, percent }: any) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`} labelLine={{ stroke: '#94a3b8' }}>
                          {chart.data.map((entry, i) => (
                            <Cell key={i} fill={entry.fill || CHART_COLORS[i % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                        <Legend />
                      </PieChart>
                    )}
                  </ResponsiveContainer>
                  {chart.xAxisLabel && (
                    <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                      {chart.xAxisLabel}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ──────────────────────────────────────────── */}
        {/* Article Body */}
        {/* ──────────────────────────────────────────── */}
        <article style={{ lineHeight: 1.8 }}>
          {report.sections.map((section, idx) => (
            <section key={idx} style={{ marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '1rem', lineHeight: 1.3 }}>
                {section.title}
              </h2>
              <p style={{ fontSize: '1.05rem', color: '#334155', lineHeight: 1.8 }}>
                {section.content}
              </p>

              {/* Internal link to template */}
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

              {/* Internal link to another research report */}
              {section.researchLink && (
                <Link
                  to={`/research/${section.researchLink.slug}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginTop: '1.25rem',
                    padding: '0.75rem 1.25rem',
                    background: 'linear-gradient(135deg, #e0e7ff 0%, #eff6ff 100%)',
                    border: '1px solid #bfdbfe',
                    borderRadius: '14px',
                    color: '#1d4ed8',
                    fontWeight: '700',
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #c7d2fe 0%, #dbeafe 100%)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #e0e7ff 0%, #eff6ff 100%)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <BarChart3 size={16} /> {section.researchLink.label} <ArrowRight size={14} />
                </Link>
              )}
            </section>
          ))}
        </article>

        {/* ──────────────────────────────────────────── */}
        {/* Methodology Section (E-E-A-T Signal) */}
        {/* ──────────────────────────────────────────── */}
        <section style={{
          marginTop: '2rem',
          marginBottom: '3rem',
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '20px',
          padding: '2rem'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e40af', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={20} /> Methodology & Data Sources
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Sample Size</div>
              <div style={{ fontSize: '0.95rem', color: '#1e40af', fontWeight: '600' }}>{report.methodology.sampleSize}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Time Period</div>
              <div style={{ fontSize: '0.95rem', color: '#1e40af', fontWeight: '600' }}>{report.methodology.timePeriod}</div>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Data Source</div>
              <div style={{ fontSize: '0.95rem', color: '#1e40af', lineHeight: 1.6 }}>{report.methodology.dataSource}</div>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Limitations</div>
              <div style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6, fontStyle: 'italic' }}>{report.methodology.limitations}</div>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────── */}
        {/* FAQs */}
        {/* ──────────────────────────────────────────── */}
        {report.faqs.length > 0 && (
          <section style={{ marginTop: '3rem', borderTop: '1px solid #e2e8f0', paddingTop: '3rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', marginBottom: '2rem' }}>
              Frequently Asked Questions
            </h2>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {report.faqs.map((faq, idx) => (
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

        {/* ──────────────────────────────────────────── */}
        {/* Related Templates */}
        {/* ──────────────────────────────────────────── */}
        <section style={{ marginTop: '3rem', borderTop: '1px solid #e2e8f0', paddingTop: '3rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.5rem' }}>
            Related Document Templates
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {report.relatedTemplates.map((t, idx) => (
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

        {/* ──────────────────────────────────────────── */}
        {/* Related Blog Posts */}
        {/* ──────────────────────────────────────────── */}
        {report.relatedBlogPosts.length > 0 && (
          <section style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem' }}>
              Related Articles
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {report.relatedBlogPosts.map((b, idx) => (
                <Link
                  key={idx}
                  to={`/blog/${b.slug}`}
                  style={{
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    padding: '0.5rem 1rem',
                    borderRadius: '9999px',
                    color: '#7c3aed',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = '#7c3aed';
                    e.currentTarget.style.backgroundColor = '#f5f3ff';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  {b.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ──────────────────────────────────────────── */}
        {/* More Research Reports */}
        {/* ──────────────────────────────────────────── */}
        {otherReports.length > 0 && (
          <section style={{ marginTop: '3rem', borderTop: '1px solid #e2e8f0', paddingTop: '3rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.5rem' }}>
              More Research Reports
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {otherReports.map((r) => (
                <Link
                  key={r.slug}
                  to={`/research/${r.slug}`}
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
                  <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#7c3aed', textTransform: 'uppercase' }}>{r.category} Research</span>
                  <h4 style={{ fontSize: '1rem', fontWeight: '700', margin: '0.5rem 0', lineHeight: 1.3 }}>{r.title}</h4>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{r.readTime}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ──────────────────────────────────────────── */}
        {/* CTA */}
        {/* ──────────────────────────────────────────── */}
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
            Get These Analytics for Your Own Documents
          </h2>
          <p style={{ opacity: 0.9, marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem auto', position: 'relative' }}>
            Track page-level engagement, monitor viewer behavior, and benchmark your documents against these industry standards — free.
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
            Start Free Trial <ArrowRight size={18} />
          </Link>
        </section>
      </main>

      {/* Footer */}
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

export default ResearchDetail;
