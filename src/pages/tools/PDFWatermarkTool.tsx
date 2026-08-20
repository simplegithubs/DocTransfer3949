import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import { Sparkles, ArrowLeft, ShieldCheck, Upload, Download, ArrowRight, CheckCircle2 } from 'lucide-react';
import SEO from '../../components/SEO';
import { getToolBySlug } from '../../data/toolsData';

const PDFWatermarkTool: React.FC = () => {
  const toolData = getToolBySlug('pdf-watermarking-tool');
  const [file, setFile] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL - FOR REVIEW ONLY');
  const [opacity, setOpacity] = useState(0.3);
  const [rotation, setRotation] = useState(45);
  const [processing, setProcessing] = useState(false);

  const applyWatermark = async () => {
    if (!file) return;
    setProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pages = pdfDoc.getPages();

      for (const page of pages) {
        const { width, height } = page.getSize();
        page.drawText(watermarkText, {
          x: width / 4,
          y: height / 2,
          size: 32,
          font,
          color: rgb(0.8, 0.1, 0.1),
          opacity: Number(opacity),
          rotate: degrees(Number(rotation))
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `watermarked-${file.name}`;
      link.click();
    } catch (err) {
      console.error('Watermark application error:', err);
    } finally {
      setProcessing(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    onDrop: acceptedFiles => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
      }
    }
  });

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1e293b' }}>
      <SEO
        title="Free PDF Watermark Tool — Add Confidential Watermarks Online | DocTransfer"
        description="Add custom dynamic text watermarks (Confidential, Recipient Email, Date) to your PDF files free online. 100% private browser-side processing."
        keywords="add watermark to PDF free online, PDF security tool, confidential watermark generator, protect pitch deck watermark"
        url="https://www.doctransfer.app/tools/pdf-watermarking-tool"
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

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <Link to="/tools" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600', marginBottom: '2rem' }}>
          <ArrowLeft size={16} /> Back to Tools
        </Link>

        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#ede9fe', padding: '0.35rem 1rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '700', color: '#7c3aed', textTransform: 'uppercase', marginBottom: '1rem' }}>
            <ShieldCheck size={14} /> 100% Private PDF Security Tool
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
            Free PDF <span style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Watermark Generator</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#475569', maxWidth: '650px', margin: '0 auto', lineHeight: 1.6 }}>
            Overlay custom confidential watermarks onto your PDF documents in seconds. Processed 100% locally in your browser.
          </p>
        </div>

        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '2.5rem', marginBottom: '3rem' }}>
          {/* Upload Dropzone */}
          {!file ? (
            <div
              {...getRootProps()}
              style={{
                background: isDragActive ? '#eff6ff' : '#f8fafc',
                border: `2px dashed ${isDragActive ? '#3b82f6' : '#cbd5e1'}`,
                borderRadius: '20px',
                padding: '3.5rem 2rem',
                textAlign: 'center',
                cursor: 'pointer'
              }}
            >
              <input {...getInputProps()} />
              <div style={{ background: '#f5f3ff', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                <Upload size={28} color="#4f46e5" />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.35rem' }}>Select PDF to Watermark</h3>
              <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Drag & drop or click to select file</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', padding: '1rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a' }}>Selected: {file.name}</span>
                <button onClick={() => setFile(null)} style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '0.85rem', fontWeight: '700' }}>Change File</button>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '0.35rem' }}>Watermark Text</label>
                <input
                  type="text"
                  value={watermarkText}
                  onChange={e => setWatermarkText(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '0.35rem' }}>Opacity: {Math.round(opacity * 100)}%</label>
                  <input
                    type="range"
                    min="0.1"
                    max="0.9"
                    step="0.05"
                    value={opacity}
                    onChange={e => setOpacity(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#4f46e5' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '0.35rem' }}>Rotation Angle: {rotation}°</label>
                  <input
                    type="range"
                    min="0"
                    max="90"
                    step="5"
                    value={rotation}
                    onChange={e => setRotation(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#4f46e5' }}
                  />
                </div>
              </div>

              <button
                onClick={applyWatermark}
                disabled={processing}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  color: 'white',
                  padding: '0.85rem 1.5rem',
                  borderRadius: '14px',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <Download size={18} /> {processing ? 'Applying Watermark...' : 'Apply & Download Watermarked PDF'}
              </button>
            </div>
          )}
        </div>

        {toolData && (
          <section style={{ borderTop: '1px solid #e2e8f0', paddingTop: '3rem' }}>
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

export default PDFWatermarkTool;
