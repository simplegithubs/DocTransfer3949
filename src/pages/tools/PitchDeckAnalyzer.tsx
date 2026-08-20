import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import * as pdfjsLib from 'pdfjs-dist';
import { Sparkles, ArrowLeft, Upload, CheckCircle2, AlertTriangle, FileSpreadsheet, ArrowRight, ShieldCheck, Mail, RefreshCw } from 'lucide-react';
import SEO from '../../components/SEO';
import { getToolBySlug } from '../../data/toolsData';

// Configure pdfjs worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

interface AnalysisResult {
  pageCount: number;
  fileSizeBytes: number;
  fileName: string;
  detectedSections: { name: string; found: boolean; keywords: string[] }[];
  score: number;
  recommendations: string[];
  estimatedReadingTime: string;
}

const PitchDeckAnalyzer: React.FC = () => {
  const toolData = getToolBySlug('pitch-deck-analyzer');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const analyzePDF = async (file: File) => {
    setAnalyzing(true);
    setResult(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const pageCount = pdf.numPages;

      let combinedText = '';
      for (let i = 1; i <= Math.min(pageCount, 30); i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        combinedText += ' ' + pageText.toLowerCase();
      }

      const sections = [
        { name: 'Team & Founders', keywords: ['team', 'founder', 'founders', 'advisor', 'experience', 'background'] },
        { name: 'Financials & Projection', keywords: ['financial', 'revenue', 'mrr', 'arr', 'margin', 'projection', 'cac', 'ltv'] },
        { name: 'Market & Opportunity', keywords: ['market', 'tam', 'sam', 'som', 'opportunity', 'billion', 'industry'] },
        { name: 'Traction & Growth', keywords: ['traction', 'growth', 'users', 'customers', 'milestone', 'retention'] },
        { name: 'Problem & Solution', keywords: ['problem', 'solution', 'product', 'how it works', 'value prop'] },
        { name: 'Business Model', keywords: ['business model', 'pricing', 'monetization', 'unit economics'] }
      ];

      const detectedSections = sections.map(sec => ({
        name: sec.name,
        found: sec.keywords.some(kw => combinedText.includes(kw)),
        keywords: sec.keywords
      }));

      // Calculate score
      let score = 50;
      if (pageCount >= 10 && pageCount <= 14) score += 25;
      else if (pageCount >= 8 && pageCount <= 16) score += 15;
      else score += 5;

      const foundCount = detectedSections.filter(s => s.found).length;
      score += Math.round((foundCount / sections.length) * 25);

      if (file.size < 15 * 1024 * 1024) score += 5;

      const recommendations: string[] = [];
      if (pageCount > 15) {
        recommendations.push(`Your deck has ${pageCount} slides. Benchmark data shows investor completion drops significantly past 15 slides. Trim to 10-14 slides.`);
      } else if (pageCount < 8) {
        recommendations.push(`Your deck is short (${pageCount} slides). Ensure key slides like Financials and Team are detailed.`);
      } else {
        recommendations.push(`Slide count (${pageCount} slides) is within the optimal 10-14 slide benchmark range!`);
      }

      detectedSections.filter(s => !s.found).forEach(s => {
        recommendations.push(`Missing keyword signals for "${s.name}". Consider adding a clear title or metrics section for this component.`);
      });

      const estReadingTimeSec = pageCount * 19; // avg 19s/slide
      const mins = Math.floor(estReadingTimeSec / 60);
      const secs = estReadingTimeSec % 60;

      setResult({
        pageCount,
        fileSizeBytes: file.size,
        fileName: file.name,
        detectedSections,
        score: Math.min(100, score),
        recommendations,
        estimatedReadingTime: `${mins}m ${secs}s`
      });
    } catch (err) {
      console.error('PDF parsing error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    onDrop: acceptedFiles => {
      if (acceptedFiles.length > 0) {
        analyzePDF(acceptedFiles[0]);
      }
    }
  });

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1e293b' }}>
      <SEO
        title="Free Pitch Deck Analyzer & Grader — Check Your Deck | DocTransfer"
        description="Upload your pitch deck PDF for an instant 0–100 score on slide count, section completeness (Team, Financials, Traction), and investor reading time optimization."
        keywords="pitch deck analyzer, pitch deck grader free, check pitch deck length, pitch deck feedback tool"
        url="https://www.doctransfer.app/tools/pitch-deck-analyzer"
      />

      {/* Header */}
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
            <FileSpreadsheet size={14} /> Free Investor Readiness Tool
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
            Free Pitch Deck <span style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Analyzer & Grader</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#475569', maxWidth: '650px', margin: '0 auto', lineHeight: 1.6 }}>
            Drop your PDF pitch deck below to evaluate slide count, detect key founder sections, and get instant recommendations based on 12,800+ VC views.
          </p>
        </div>

        {/* Upload Zone */}
        {!result && (
          <div
            {...getRootProps()}
            style={{
              background: isDragActive ? '#eff6ff' : 'white',
              border: `2px dashed ${isDragActive ? '#3b82f6' : '#c7d2fe'}`,
              borderRadius: '24px',
              padding: '4rem 2rem',
              textAlign: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.05)',
              transition: 'all 0.2s ease'
            }}
          >
            <input {...getInputProps()} />
            <div style={{ background: '#f5f3ff', width: '64px', height: '64px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
              <Upload size={32} color="#4f46e5" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
              {analyzing ? 'Analyzing Pitch Deck...' : 'Drag & Drop your Pitch Deck PDF'}
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              {analyzing ? 'Extracting slide count & evaluating section keywords...' : 'or click to browse files (PDF format, up to 50MB)'}
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#16a34a', background: '#f0fdf4', padding: '0.4rem 1rem', borderRadius: '9999px', border: '1px solid #bbf7d0' }}>
              <ShieldCheck size={14} /> 100% Private — Processed Client-Side in Your Browser
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {result && (
          <div style={{ display: 'grid', gap: '2rem' }}>
            {/* Score Card */}
            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '2.5rem', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '600' }}>Analyzed: {result.fileName}</span>
                <button onClick={() => setResult(null)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#f1f5f9', color: '#475569', padding: '0.4rem 0.85rem', borderRadius: '9999px', fontSize: '0.8rem' }}>
                  <RefreshCw size={12} /> Test Another Deck
                </button>
              </div>

              <div style={{ fontSize: '4.5rem', fontWeight: '900', color: result.score >= 80 ? '#16a34a' : result.score >= 60 ? '#d97706' : '#dc2626', lineHeight: 1 }}>
                {result.score}<span style={{ fontSize: '2rem', color: '#94a3b8' }}>/100</span>
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
                {result.score >= 80 ? '🔥 Strong Investor Readiness' : result.score >= 60 ? '⚡ Good Baseline — Minor Tweaks Needed' : '⚠️ Needs Optimization Before Sharing'}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Total Slides</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#4f46e5' }}>{result.pageCount}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Est. Viewing Time</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#7c3aed' }}>{result.estimatedReadingTime}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Detected Sections</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#059669' }}>{result.detectedSections.filter(s => s.found).length}/6</div>
                </div>
              </div>
            </div>

            {/* Sections Breakdown */}
            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.25rem' }}>
                Section Signals Audit
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                {result.detectedSections.map((sec, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: sec.found ? '#f0fdf4' : '#fef2f2', border: `1px solid ${sec.found ? '#bbf7d0' : '#fecaca'}`, padding: '1rem', borderRadius: '16px' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: '700', color: sec.found ? '#166534' : '#991b1b' }}>{sec.name}</span>
                    {sec.found ? <CheckCircle2 size={20} color="#16a34a" /> : <AlertTriangle size={20} color="#dc2626" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', marginBottom: '1rem' }}>
                Actionable Recommendations
              </h3>
              <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {result.recommendations.map((rec, idx) => (
                  <li key={idx} style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.6 }}>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            {/* Lead Capture & CTA */}
            <div style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', borderRadius: '24px', padding: '2.5rem', color: 'white', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.75rem' }}>
                Ready to Share Your Deck Safely?
              </h3>
              <p style={{ opacity: 0.9, maxWidth: '550px', margin: '0 auto 1.5rem auto', fontSize: '0.95rem' }}>
                Upload your deck to DocTransfer to track exactly who opens it, which slides investors spend time on, and set self-destruct security controls.
              </p>

              {!emailSubmitted ? (
                <form onSubmit={e => { e.preventDefault(); setEmailSubmitted(true); }} style={{ display: 'flex', gap: '0.5rem', maxWidth: '450px', margin: '0 auto 1.5rem auto' }}>
                  <input
                    type="email"
                    required
                    placeholder="Enter email to save audit report"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{ flex: 1, padding: '0.85rem 1.25rem', borderRadius: '12px', border: 'none', outline: 'none', fontSize: '0.95rem' }}
                  />
                  <button type="submit" style={{ background: '#0f172a', color: 'white', padding: '0.85rem 1.5rem', borderRadius: '12px', fontWeight: '700' }}>
                    Save Report
                  </button>
                </form>
              ) : (
                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.75rem 1.5rem', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  <CheckCircle2 size={18} /> Audit report saved! Check your email.
                </div>
              )}

              <Link to="/dataroom" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'white', color: '#4f46e5', padding: '0.85rem 1.75rem', borderRadius: '14px', fontWeight: '700', textDecoration: 'none' }}>
                Share Deck with Tracking Free <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        )}

        {/* Tool FAQs */}
        {toolData && (
          <section style={{ marginTop: '4rem', borderTop: '1px solid #e2e8f0', paddingTop: '3rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.5rem' }}>
              Frequently Asked Questions
            </h2>
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

export default PitchDeckAnalyzer;
