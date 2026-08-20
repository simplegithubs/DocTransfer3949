import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Sparkles, ArrowLeft, Calculator, ArrowRight, CheckCircle2, TrendingDown, DollarSign } from 'lucide-react';
import SEO from '../../components/SEO';
import { getToolBySlug } from '../../data/toolsData';

const VDRCostCalculator: React.FC = () => {
  const toolData = getToolBySlug('vdr-cost-calculator');
  const [seats, setSeats] = useState(5);
  const [dataRooms, setDataRooms] = useState(3);
  const [competitor, setCompetitor] = useState<'docsend' | 'firmex' | 'datasite'>('docsend');

  const calculations = useMemo(() => {
    let compMonthlyPerSeat = 65; // DocSend Advanced
    if (competitor === 'firmex') compMonthlyPerSeat = 180;
    if (competitor === 'datasite') compMonthlyPerSeat = 350;

    const compAnnualTotal = seats * compMonthlyPerSeat * 12 + (dataRooms > 2 ? (dataRooms - 2) * 500 : 0);
    const docTransferAnnualTotal = 39 * 12; // Business Tier ($39/mo flat)

    const annualSavings = Math.max(0, compAnnualTotal - docTransferAnnualTotal);
    const savingsPercent = Math.round((annualSavings / compAnnualTotal) * 100);

    const chartData = [
      { name: competitor.toUpperCase(), cost: compAnnualTotal, fill: '#ef4444' },
      { name: 'DocTransfer Business', cost: docTransferAnnualTotal, fill: '#4f46e5' },
      { name: 'DocTransfer Free', cost: 0, fill: '#22c55e' }
    ];

    return { compAnnualTotal, docTransferAnnualTotal, annualSavings, savingsPercent, chartData };
  }, [seats, dataRooms, competitor]);

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1e293b' }}>
      <SEO
        title="Virtual Data Room Cost & ROI Calculator — Compare VDR Pricing | DocTransfer"
        description="Calculate how much you can save by switching from DocSend, Firmex, or Datasite to DocTransfer. Interactive ROI slider for team seats and data rooms."
        keywords="virtual data room pricing calculator, DocSend cost comparison, VDR ROI calculator, data room price comparison"
        url="https://www.doctransfer.app/tools/vdr-cost-calculator"
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
        <Link to="/tools" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600', marginBottom: '2rem' }}>
          <ArrowLeft size={16} /> Back to Tools
        </Link>

        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#ede9fe', padding: '0.35rem 1rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '700', color: '#7c3aed', textTransform: 'uppercase', marginBottom: '1rem' }}>
            <Calculator size={14} /> Interactive Cost Calculator
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
            Virtual Data Room <span style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Cost & ROI Calculator</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#475569', maxWidth: '650px', margin: '0 auto', lineHeight: 1.6 }}>
            Adjust team seats and data room volume to compare legacy VDR costs against DocTransfer and calculate your annual dollar savings.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Sliders Form */}
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.5rem' }}>
              1. Usage Parameters
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '0.5rem' }}>Compare Provider</label>
                <select
                  value={competitor}
                  onChange={e => setCompetitor(e.target.value as any)}
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', background: 'white' }}
                >
                  <option value="docsend">DocSend (Advanced Plan — $65/user/mo)</option>
                  <option value="firmex">Firmex VDR ($180/user/mo)</option>
                  <option value="datasite">Datasite Enterprise ($350/user/mo)</option>
                </select>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>Team Seats: {seats}</label>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={seats}
                  onChange={e => setSeats(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#4f46e5' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>Active Data Rooms / Decks: {dataRooms}</label>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={dataRooms}
                  onChange={e => setDataRooms(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#4f46e5' }}
                />
              </div>
            </div>
          </div>

          {/* ROI Results Card */}
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#16a34a', background: '#dcfce7', padding: '0.25rem 0.75rem', borderRadius: '9999px', display: 'inline-block', marginBottom: '1rem' }}>
              ★ Calculated Annual Savings
            </div>

            <div style={{ fontSize: '3.5rem', fontWeight: '900', color: '#16a34a', lineHeight: 1 }}>
              ${calculations.annualSavings.toLocaleString()}
            </div>
            <div style={{ fontSize: '1rem', fontWeight: '700', color: '#475569', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
              Save up to {calculations.savingsPercent}% annually with DocTransfer
            </div>

            <div style={{ height: '200px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={calculations.chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Annual Cost']} />
                  <Bar dataKey="cost" radius={[6, 6, 0, 0]}>
                    {calculations.chartData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <Link
              to="/dataroom"
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem', background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', color: 'white', padding: '0.85rem 1.5rem', borderRadius: '14px', fontWeight: '700', textDecoration: 'none', width: '100%' }}
            >
              Switch & Start Saving <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {toolData && (
          <section style={{ marginTop: '4rem', borderTop: '1px solid #e2e8f0', paddingTop: '3rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.5rem' }}>Frequently Asked Questions</h2>
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              {toolData.faqs.map((faq, idx) => (
                <div key={idx} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>{faq.question}</h3>
                  <p style={{ fontSize: '0.925rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default VDRCostCalculator;
