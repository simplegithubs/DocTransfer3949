import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, FolderCheck, CheckCircle2, AlertTriangle, ArrowRight, Shield, Download, FileText, Check } from 'lucide-react';
import SEO from '../../components/SEO';
import { getToolBySlug } from '../../data/toolsData';
import EmbedToolModal from '../../components/tools/EmbedToolModal';

interface DiligenceItem {
  id: string;
  category: string;
  title: string;
  importance: 'Critical' | 'High' | 'Medium';
  checked: boolean;
}

const initialItems: DiligenceItem[] = [
  // Corporate
  { id: 'c1', category: 'Corporate Structure', title: 'Certificate / Articles of Incorporation (Delaware C-Corp or equivalent)', importance: 'Critical', checked: true },
  { id: 'c2', category: 'Corporate Structure', title: 'Bylaws & Action of Incorporator Minutes', importance: 'Critical', checked: true },
  { id: 'c3', category: 'Corporate Structure', title: 'Certificate of Good Standing (Issued within 30 days)', importance: 'High', checked: false },
  
  // Cap Table & Equity
  { id: 'e1', category: 'Cap Table & Securities', title: 'Detailed Fully-Diluted Cap Table with Shareholder Ledger', importance: 'Critical', checked: true },
  { id: 'e2', category: 'Cap Table & Securities', title: 'Executed 83(b) Election Receipts for All Co-Founders', importance: 'Critical', checked: true },
  { id: 'e3', category: 'Cap Table & Securities', title: 'All Executed SAFE Notes, Convertible Notes & Side Letters', importance: 'Critical', checked: true },
  { id: 'e4', category: 'Cap Table & Securities', title: 'Equity Incentive Plan (Option Plan) & Grant Agreements', importance: 'High', checked: false },

  // IP Assignment
  { id: 'ip1', category: 'Intellectual Property', title: 'Proprietary Information & Inventions Assignment (CIIA) for all founders', importance: 'Critical', checked: true },
  { id: 'ip2', category: 'Intellectual Property', title: 'Contractor IP Transfer & Work-for-Hire Agreements', importance: 'Critical', checked: false },
  { id: 'ip3', category: 'Intellectual Property', title: 'Trademark Registrations & Domain Ownership Documentation', importance: 'Medium', checked: true },

  // Financials
  { id: 'f1', category: 'Financials & Tax', title: 'Past 2-3 Years Profit & Loss (P&L), Balance Sheet & Cash Flow', importance: 'High', checked: true },
  { id: 'f2', category: 'Financials & Tax', title: 'Federal & State Tax Returns (Filed past 2 years)', importance: 'High', checked: false },
  { id: 'f3', category: 'Financials & Tax', title: '18-24 Month Financial Model & Runway Forecast', importance: 'High', checked: true },

  // Material Contracts
  { id: 'm1', category: 'Material Contracts', title: 'Top 5 Customer MSAs / Contracts (> $10k ARR each)', importance: 'High', checked: true },
  { id: 'm2', category: 'Material Contracts', title: 'Critical Cloud / Vendor Service Agreements (AWS, GCP, SaaS)', importance: 'Medium', checked: false },

  // Team & HR
  { id: 'h1', category: 'Team & HR', title: 'Standard Employee Offer Letters & Confidentiality Agreements', importance: 'Medium', checked: true },
  { id: 'h2', category: 'Team & HR', title: 'Key Person Life Insurance or Exec Compensation Plans', importance: 'Medium', checked: false }
];

const DueDiligenceScorecard: React.FC = () => {
  const toolData = getToolBySlug('due-diligence-scorecard');
  const [items, setItems] = useState<DiligenceItem[]>(initialItems);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const categories = useMemo(() => {
    return ['All', ...Array.from(new Set(items.map(i => i.category)))];
  }, [items]);

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'All') return items;
    return items.filter(i => i.category === selectedCategory);
  }, [items, selectedCategory]);

  const metrics = useMemo(() => {
    const total = items.length;
    const completed = items.filter(i => i.checked).length;
    const criticalTotal = items.filter(i => i.importance === 'Critical').length;
    const criticalCompleted = items.filter(i => i.importance === 'Critical' && i.checked).length;
    
    const score = Math.round((completed / total) * 100);
    const criticalScore = Math.round((criticalCompleted / criticalTotal) * 100);

    let stage = 'Early Seed Stage (Gaps Present)';
    let badgeColor = '#d97706';
    let badgeBg = '#fef3c7';

    if (score >= 90 && criticalScore === 100) {
      stage = 'Series A / M&A Institutional Ready';
      badgeColor = '#16a34a';
      badgeBg = '#dcfce7';
    } else if (score >= 70 && criticalScore >= 80) {
      stage = 'Seed / Angel Round Ready';
      badgeColor = '#4f46e5';
      badgeBg = '#ede9fe';
    }

    return { total, completed, score, criticalScore, stage, badgeColor, badgeBg };
  }, [items]);

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1e293b' }}>
      <SEO
        title="Startup Due Diligence Readiness Scorecard (2026) | DocTransfer"
        description="Interactive diagnostic tool to score your data room completeness for Seed, Series A, or M&A. Check Cap Table, IP Assignment, Financials & Contracts."
        keywords="due diligence readiness scorecard, startup due diligence checklist, virtual data room readiness"
        url="https://www.doctransfer.app/tools/due-diligence-scorecard"
      />

      <header style={{ height: '70px', background: 'white', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#4f46e5', fontWeight: '800', fontSize: '1.25rem' }}>
          <Sparkles size={22} /> DocTransfer
        </Link>
        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/tools" style={{ textDecoration: 'none', color: '#4f46e5', fontWeight: 600, fontSize: '0.95rem' }}>Tools Directory</Link>
          <Link to="/templates" style={{ textDecoration: 'none', color: '#64748b', fontWeight: 500, fontSize: '0.95rem' }}>Templates</Link>
        </nav>
      </header>

      <main style={{ maxWidth: '1050px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <Link to="/tools" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }}>
            <ArrowLeft size={16} /> Back to Tools Directory
          </Link>
          <EmbedToolModal toolSlug="due-diligence-scorecard" toolName="Due Diligence Readiness Scorecard" />
        </div>

        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#dbeafe', padding: '0.35rem 1rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '700', color: '#1d4ed8', textTransform: 'uppercase', marginBottom: '1rem' }}>
            <FolderCheck size={14} /> Venture & M&A Data Room Diagnostic
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#0f172a', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
            Investor Due Diligence Readiness Scorecard
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#64748b', maxWidth: '720px', margin: '0 auto' }}>
            Score your startup's due diligence room across corporate formation, cap table integrity, founder IP assignments, and financial models before sending to venture investors.
          </p>
        </div>

        {/* Top KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Overall Readiness</div>
            <div style={{ fontSize: '2.5rem', fontWeight: '900', color: metrics.badgeColor }}>{metrics.score}%</div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{metrics.completed} of {metrics.total} items ready</div>
          </div>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Critical Deal-Breakers</div>
            <div style={{ fontSize: '2.5rem', fontWeight: '900', color: metrics.criticalScore === 100 ? '#16a34a' : '#dc2626' }}>{metrics.criticalScore}%</div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Core statutory filings</div>
          </div>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Fundraising Status</div>
            <div style={{ display: 'inline-block', background: metrics.badgeBg, color: metrics.badgeColor, padding: '0.4rem 0.8rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: '700', marginTop: '0.5rem' }}>
              {metrics.stage}
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: selectedCategory === cat ? '#4f46e5' : '#e2e8f0',
                background: selectedCategory === cat ? '#4f46e5' : 'white',
                color: selectedCategory === cat ? 'white' : '#64748b',
                fontWeight: '600',
                fontSize: '0.85rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Checklist */}
        <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', marginBottom: '3rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {filteredItems.map(item => (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem 1.25rem',
                  borderRadius: '10px',
                  border: `1px solid ${item.checked ? '#cbd5e1' : '#fecaca'}`,
                  background: item.checked ? '#ffffff' : '#fff1f2',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    background: item.checked ? '#4f46e5' : '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    flexShrink: 0
                  }}
                >
                  {item.checked && <Check size={16} />}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: '600', color: item.checked ? '#0f172a' : '#991b1b' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Category: {item.category}
                  </div>
                </div>

                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '9999px',
                    background: item.importance === 'Critical' ? '#fee2e2' : (item.importance === 'High' ? '#fef3c7' : '#f1f5f9'),
                    color: item.importance === 'Critical' ? '#dc2626' : (item.importance === 'High' ? '#d97706' : '#64748b')
                  }}
                >
                  {item.importance}
                </span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0, color: '#0f172a' }}>
                Ready to organize and share your diligence room securely?
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.25rem 0 0' }}>
                Set up dynamic watermarks, viewer email gates, and second-by-second analytics on DocTransfer for free.
              </p>
            </div>
            <Link
              to="/signup"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#4f46e5',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '0.9rem',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)'
              }}
            >
              Deploy Free Data Room <ArrowRight size={16} />
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

export default DueDiligenceScorecard;
