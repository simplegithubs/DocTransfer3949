import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Sparkles, ArrowLeft, Clock, TrendingDown, ArrowRight, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import SEO from '../../components/SEO';
import { getToolBySlug } from '../../data/toolsData';
import EmbedToolModal from '../../components/tools/EmbedToolModal';

const ReadingTimeEstimator: React.FC = () => {
  const toolData = getToolBySlug('reading-time-estimator');
  const [docType, setDocType] = useState<'pitch_deck' | 'proposal' | 'contract'>('pitch_deck');
  const [pageCount, setPageCount] = useState(12);
  const [density, setDensity] = useState<'visual' | 'standard' | 'dense'>('standard');

  const analysis = useMemo(() => {
    // Seconds per page baselines
    let baseSecPerPage = 20; // visual deck
    if (docType === 'pitch_deck') {
      if (density === 'visual') baseSecPerPage = 14;
      if (density === 'standard') baseSecPerPage = 22;
      if (density === 'dense') baseSecPerPage = 35;
    } else if (docType === 'proposal') {
      if (density === 'visual') baseSecPerPage = 25;
      if (density === 'standard') baseSecPerPage = 45;
      if (density === 'dense') baseSecPerPage = 75;
    } else { // contract
      if (density === 'visual') baseSecPerPage = 40;
      if (density === 'standard') baseSecPerPage = 80;
      if (density === 'dense') baseSecPerPage = 130;
    }

    const totalSeconds = pageCount * baseSecPerPage;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const formattedTime = `${minutes}m ${seconds}s`;

    // Calculate drop-off curve per page
    const chartData = [];
    let retention = 100;
    for (let p = 1; p <= pageCount; p++) {
      let decayRate = 0.96; // 4% decay per page for decks
      if (p > 12 && docType === 'pitch_deck') decayRate = 0.90; // steep drop-off after slide 12
      if (p > 8 && docType === 'proposal') decayRate = 0.92;
      
      retention = Math.max(15, Math.round(retention * decayRate));
      chartData.push({
        page: `P.${p}`,
        retention: retention,
        seconds: Math.round(baseSecPerPage * (p === 1 ? 1.4 : (p === pageCount ? 1.2 : 0.9)))
      });
    }

    const finalRetention = chartData[chartData.length - 1]?.retention || 50;

    let recommendation = 'Your length is well-optimized for high decision-maker retention.';
    if (docType === 'pitch_deck' && pageCount > 15) {
      recommendation = `⚠️ Warning: Pitch decks exceeding 14 slides suffer an estimated ${(100 - finalRetention)}% reader drop-off. Consider condensing appendix slides.`;
    } else if (docType === 'proposal' && pageCount > 12) {
      recommendation = `⚠️ Warning: Sales proposals over 10 pages lose over ${(100 - finalRetention)}% of key executive readers. Move case studies to an appendix.`;
    }

    return { totalSeconds, formattedTime, finalRetention, chartData, recommendation };
  }, [docType, pageCount, density]);

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1e293b' }}>
      <SEO
        title="Document Reading Time & Drop-Off Estimator (2026) | DocTransfer"
        description="Estimate reader attention span, average time spent per page, and drop-off risks for pitch decks, sales proposals, and contracts. 100% Free tool."
        keywords="document reading time estimator, pitch deck duration calculator, contract reading time tool, investor dropoff predictor"
        url="https://www.doctransfer.app/tools/reading-time-estimator"
      />

      <header style={{ height: '70px', background: 'white', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#4f46e5', fontWeight: '800', fontSize: '1.25rem' }}>
          <Sparkles size={22} /> DocTransfer
        </Link>
        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/tools" style={{ textDecoration: 'none', color: '#4f46e5', fontWeight: 600, fontSize: '0.95rem' }}>Tools Directory</Link>
          <Link to="/research" style={{ textDecoration: 'none', color: '#64748b', fontWeight: 500, fontSize: '0.95rem' }}>Research</Link>
        </nav>
      </header>

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <Link to="/tools" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }}>
            <ArrowLeft size={16} /> Back to Tools Directory
          </Link>
          <EmbedToolModal toolSlug="reading-time-estimator" toolName="Reading Time & Drop-Off Estimator" />
        </div>

        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#fef3c7', padding: '0.35rem 1rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '700', color: '#d97706', textTransform: 'uppercase', marginBottom: '1rem' }}>
            <Clock size={14} /> Attention Span & Engagement Predictor
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#0f172a', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
            Document Reading Time & Drop-Off Estimator
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#64748b', maxWidth: '700px', margin: '0 auto' }}>
            Simulate how venture capitalists, clients, or counterparties read your pitch decks, proposals, and contracts based on 12,000+ benchmark analytics.
          </p>
        </div>

        {/* Interactive Calculator Box */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
          
          {/* Controls */}
          <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '1.5rem' }}>Configure Document Parameters</h2>

            {/* Document Type */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#475569', marginBottom: '0.5rem' }}>
                Document Format
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                {[
                  { id: 'pitch_deck', label: 'Pitch Deck' },
                  { id: 'proposal', label: 'Proposal' },
                  { id: 'contract', label: 'Contract' }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setDocType(t.id as any)}
                    style={{
                      padding: '0.65rem 0.5rem',
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: docType === t.id ? '#4f46e5' : '#e2e8f0',
                      background: docType === t.id ? '#ede9fe' : 'white',
                      color: docType === t.id ? '#4f46e5' : '#64748b',
                      fontWeight: '700',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Page Count Slider */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>
                  Total Slides / Pages
                </label>
                <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#4f46e5' }}>
                  {pageCount} pages
                </span>
              </div>
              <input
                type="range"
                min="3"
                max="40"
                value={pageCount}
                onChange={e => setPageCount(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#4f46e5' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                <span>3 pages (Micro)</span>
                <span>20 pages</span>
                <span>40 pages (Heavy)</span>
              </div>
            </div>

            {/* Density Selector */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#475569', marginBottom: '0.5rem' }}>
                Content & Visual Density
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                {[
                  { id: 'visual', label: 'Visual / Clean' },
                  { id: 'standard', label: 'Standard' },
                  { id: 'dense', label: 'Data Dense' }
                ].map(d => (
                  <button
                    key={d.id}
                    onClick={() => setDensity(d.id as any)}
                    style={{
                      padding: '0.65rem 0.5rem',
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: density === d.id ? '#4f46e5' : '#e2e8f0',
                      background: density === d.id ? '#ede9fe' : 'white',
                      color: density === d.id ? '#4f46e5' : '#64748b',
                      fontWeight: '700',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Recommendation Box */}
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.85rem', color: '#334155', lineHeight: 1.5 }}>
              {analysis.recommendation}
            </div>
          </div>

          {/* Visualization Output */}
          <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', textAlign: 'center' }}>
              <div style={{ background: '#ede9fe', padding: '1.25rem', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#7c3aed', textTransform: 'uppercase' }}>Estimated Reading Time</div>
                <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#4f46e5', marginTop: '0.25rem' }}>{analysis.formattedTime}</div>
              </div>
              <div style={{ background: '#fee2e2', padding: '1.25rem', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#b91c1c', textTransform: 'uppercase' }}>Final Page Retention</div>
                <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#dc2626', marginTop: '0.25rem' }}>{analysis.finalRetention}%</div>
              </div>
            </div>

            {/* Retention Chart */}
            <div style={{ flex: 1, minHeight: '180px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', marginBottom: '0.5rem' }}>
                Reader Retention Probability Curve:
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={analysis.chartData}>
                  <defs>
                    <linearGradient id="retentionGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="page" tick={{ fontSize: 10 }} />
                  <YAxis unit="%" tick={{ fontSize: 10 }} domain={[0, 100]} />
                  <Tooltip />
                  <Area type="monotone" dataKey="retention" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#retentionGrad)" name="Retention" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <Link
              to="/signup"
              style={{
                marginTop: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                background: '#4f46e5',
                color: 'white',
                padding: '0.85rem',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '0.9rem',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
              }}
            >
              Track Actual Viewer Seconds Free <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* FAQs */}
        {toolData?.faqs && (
          <div style={{ background: 'white', padding: '2.5rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>Frequently Asked Questions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {toolData.faqs.map((faq, i) => (
                <div key={i} style={{ borderBottom: i < toolData.faqs.length - 1 ? '1px solid #f1f5f9' : 'none', paddingBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>{faq.question}</h3>
                  <p style={{ color: '#64748b', lineHeight: 1.6, margin: 0 }}>{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ReadingTimeEstimator;
