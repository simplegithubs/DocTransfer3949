import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Sparkles, ArrowLeft, FileCheck, Download, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import SEO from '../../components/SEO';
import { getToolBySlug } from '../../data/toolsData';

const NDAGenerator: React.FC = () => {
  const toolData = getToolBySlug('nda-generator');
  const [ndaType, setNdaType] = useState<'mutual' | 'unilateral'>('mutual');
  const [disclosingParty, setDisclosingParty] = useState('Acme Corp Inc.');
  const [receivingParty, setReceivingParty] = useState('Partner Enterprises LLC');
  const [governingState, setGoverningState] = useState('Delaware');
  const [termYears, setTermYears] = useState('2');
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0]);

  const generatePDF = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]); // Letter size
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const title = ndaType === 'mutual' ? 'MUTUAL NON-DISCLOSURE AGREEMENT' : 'UNILATERAL NON-DISCLOSURE AGREEMENT';

    let y = 740;
    page.drawText(title, { x: 50, y, size: 16, font: fontBold, color: rgb(0.31, 0.27, 0.9) });
    y -= 30;

    page.drawText(`Effective Date: ${effectiveDate}`, { x: 50, y, size: 10, font });
    page.drawText(`Governing Law: State of ${governingState}`, { x: 350, y, size: 10, font });
    y -= 25;

    page.drawLine({ start: { x: 50, y }, end: { x: 562, y }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });
    y -= 25;

    const preamble = `This Non-Disclosure Agreement ("Agreement") is entered into by and between ${disclosingParty} ("Disclosing Party") and ${receivingParty} ("Receiving Party") for the purpose of preventing unauthorized disclosure of Confidential Information.`;
    page.drawText(preamble, { x: 50, y, size: 10, font, maxWidth: 512, lineHeight: 14 });
    y -= 45;

    page.drawText('1. Definition of Confidential Information', { x: 50, y, size: 11, font: fontBold });
    y -= 15;
    const clause1 = 'Confidential Information includes all non-public technical, financial, business, and strategic information disclosed by either party, whether orally or in writing.';
    page.drawText(clause1, { x: 50, y, size: 9.5, font, maxWidth: 512, lineHeight: 13 });
    y -= 35;

    page.drawText('2. Obligations & Non-Disclosure', { x: 50, y, size: 11, font: fontBold });
    y -= 15;
    const clause2 = `The Receiving Party agrees to hold all Confidential Information in strict confidence for a period of ${termYears} year(s) from the Effective Date, using the same degree of care as for its own proprietary information.`;
    page.drawText(clause2, { x: 50, y, size: 9.5, font, maxWidth: 512, lineHeight: 13 });
    y -= 35;

    page.drawText('3. Signatures', { x: 50, y, size: 11, font: fontBold });
    y -= 30;

    page.drawText(`Disclosing Party: ${disclosingParty}`, { x: 50, y, size: 10, font: fontBold });
    page.drawText(`Receiving Party: ${receivingParty}`, { x: 320, y, size: 10, font: fontBold });
    y -= 40;

    page.drawText('By: ___________________________', { x: 50, y, size: 10, font });
    page.drawText('By: ___________________________', { x: 320, y, size: 10, font });
    y -= 20;
    page.drawText('Date: ________________________', { x: 50, y, size: 10, font });
    page.drawText('Date: ________________________', { x: 320, y, size: 10, font });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${ndaType}-nda-${disclosingParty.toLowerCase().replace(/[^a-z0-9]/g, '-')}.pdf`;
    link.click();
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1e293b' }}>
      <SEO
        title="Free NDA Generator — Create Non-Disclosure Agreement Online | DocTransfer"
        description="Generate customized Mutual (2-way) or Unilateral (1-way) Non-Disclosure Agreements for free. Download PDF instantly or send for digital e-signature."
        keywords="free NDA generator, online NDA creator, create non-disclosure agreement free, mutual NDA builder"
        url="https://www.doctransfer.app/tools/nda-generator"
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
            <FileCheck size={14} /> Free Legal Document Builder
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
            Free Interactive <span style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>NDA Generator</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#475569', maxWidth: '650px', margin: '0 auto', lineHeight: 1.6 }}>
            Customize a standard Non-Disclosure Agreement in 2 minutes. Download clean PDF or send directly for e-signature with tracking.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Builder Form */}
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.5rem' }}>
              1. Agreement Details
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '0.5rem' }}>Agreement Type</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setNdaType('mutual')}
                    style={{ flex: 1, padding: '0.65rem', borderRadius: '12px', border: ndaType === 'mutual' ? '2px solid #4f46e5' : '1px solid #e2e8f0', background: ndaType === 'mutual' ? '#f5f3ff' : 'white', color: ndaType === 'mutual' ? '#4f46e5' : '#64748b', fontWeight: '700', fontSize: '0.85rem' }}
                  >
                    Mutual (2-Way)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNdaType('unilateral')}
                    style={{ flex: 1, padding: '0.65rem', borderRadius: '12px', border: ndaType === 'unilateral' ? '2px solid #4f46e5' : '1px solid #e2e8f0', background: ndaType === 'unilateral' ? '#f5f3ff' : 'white', color: ndaType === 'unilateral' ? '#4f46e5' : '#64748b', fontWeight: '700', fontSize: '0.85rem' }}
                  >
                    Unilateral (1-Way)
                  </button>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '0.35rem' }}>Disclosing Party (Company / Name)</label>
                <input
                  type="text"
                  value={disclosingParty}
                  onChange={e => setDisclosingParty(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '0.35rem' }}>Receiving Party (Company / Name)</label>
                <input
                  type="text"
                  value={receivingParty}
                  onChange={e => setReceivingParty(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '0.35rem' }}>Governing State</label>
                  <select
                    value={governingState}
                    onChange={e => setGoverningState(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', background: 'white' }}
                  >
                    {['Delaware', 'California', 'New York', 'Texas', 'Florida', 'Wyoming', 'International / Other'].map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '0.35rem' }}>Term Duration</label>
                  <select
                    value={termYears}
                    onChange={e => setTermYears(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', background: 'white' }}
                  >
                    {['1', '2', '3', '5'].map(yr => (
                      <option key={yr} value={yr}>{yr} Year{yr !== '1' ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={generatePDF}
                  style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#0f172a', color: 'white', padding: '0.85rem', borderRadius: '12px', fontWeight: '700', fontSize: '0.9rem' }}
                >
                  <Download size={16} /> Download PDF
                </button>
              </div>
            </div>
          </div>

          {/* Document Preview */}
          <div style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '24px', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Live Document Preview</span>
              <span style={{ fontSize: '0.75rem', color: '#16a34a', background: '#dcfce7', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontWeight: '700' }}>Legal Ready</span>
            </div>

            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.75rem', flex: 1, fontSize: '0.8rem', color: '#334155', lineHeight: 1.6, boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#4f46e5', marginBottom: '0.75rem', textAlign: 'center' }}>
                {ndaType === 'mutual' ? 'MUTUAL NON-DISCLOSURE AGREEMENT' : 'UNILATERAL NON-DISCLOSURE AGREEMENT'}
              </h3>
              <p><strong>Effective Date:</strong> {effectiveDate} | <strong>State:</strong> {governingState}</p>
              <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '0.75rem 0' }} />
              <p>
                This Agreement is entered into by and between <strong>{disclosingParty}</strong> ("Disclosing Party") and <strong>{receivingParty}</strong> ("Receiving Party").
              </p>
              <p style={{ marginTop: '0.5rem' }}>
                <strong>1. Confidentiality:</strong> The Receiving Party agrees to hold all technical and business information in strict confidence for <strong>{termYears} year(s)</strong>.
              </p>
              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #cbd5e1', paddingTop: '1rem' }}>
                <div>
                  <strong>{disclosingParty}</strong>
                  <br />By: [ Signature ]
                </div>
                <div>
                  <strong>{receivingParty}</strong>
                  <br />By: [ Signature ]
                </div>
              </div>
            </div>

            <Link
              to="/dataroom"
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem', background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', color: 'white', padding: '0.85rem', borderRadius: '12px', fontWeight: '700', textDecoration: 'none', fontSize: '0.9rem' }}
            >
              Send for E-Signature Free <ArrowRight size={16} />
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

export default NDAGenerator;
