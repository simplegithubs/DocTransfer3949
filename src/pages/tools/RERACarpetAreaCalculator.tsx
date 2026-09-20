import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import {
  Sparkles,
  ArrowLeft,
  Download,
  CheckCircle2,
  ShieldCheck,
  MessageCircle,
  Building,
  IndianRupee,
  HelpCircle,
  TrendingUp,
  Percent,
  Sliders,
  Scale,
  Maximize2
} from 'lucide-react';
import SEO from '../../components/SEO';
import { getToolBySlug } from '../../data/toolsData';

const RERACarpetAreaCalculator: React.FC = () => {
  const toolData = getToolBySlug('rera-carpet-area-calculator');

  const [carpetArea, setCarpetArea] = useState<number>(1050); // sq ft
  const [balconyArea, setBalconyArea] = useState<number>(120); // sq ft
  const [loadingPercent, setLoadingPercent] = useState<number>(28); // 28% loading
  const [quotedRate, setQuotedRate] = useState<number>(9500); // ₹9,500 per sq ft
  const [projectName, setProjectName] = useState<string>('Prestige Falcon City / DLF Cybercity');
  const [unitType, setUnitType] = useState<string>('3BHK Luxury Residence');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Math Calculations:
  // Super Built-up = (Carpet Area + Balcony Area) * (1 + loading / 100)
  const netUsableArea = carpetArea + balconyArea;
  const superBuiltUpArea = Math.round(netUsableArea * (1 + loadingPercent / 100));
  const totalBaseCost = superBuiltUpArea * quotedRate;

  // Real Cost per usable carpet area:
  const realRatePerCarpetSqFt = Math.round(totalBaseCost / carpetArea);
  const realRatePerUsableSqFt = Math.round(totalBaseCost / netUsableArea);
  const loadingMarkupCost = totalBaseCost - (netUsableArea * quotedRate);

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatLakhsCrores = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(amount / 100000).toFixed(1)} Lakhs`;
  };

  // Efficiency Rating
  const efficiency = useMemo(() => {
    if (loadingPercent <= 22) {
      return { label: 'High Space Efficiency (Grade A)', color: '#059669', bg: '#ecfdf5', text: 'Excellent plan. Maximum usable living space with minimal common area wastage.' };
    }
    if (loadingPercent <= 29) {
      return { label: 'Standard Metro Average (Grade B)', color: '#0284c7', bg: '#f0f9ff', text: 'Typical high-rise development with balanced clubhouse and corridor loading.' };
    }
    return { label: 'High Loading Factor (Grade C)', color: '#d97706', bg: '#fffbeb', text: 'Substantial portion of cost is allocated to common lobbies, amenities, and double-height passages.' };
  }, [loadingPercent]);

  const handleShareWhatsApp = () => {
    const text =
      `📐 *RERA Carpet Area vs Super Built-up Analysis*\n\n` +
      `🏢 *Project:* ${projectName} (${unitType})\n` +
      `• RERA Net Carpet Area: ${carpetArea} sq. ft.\n` +
      `• Balcony / Utility Area: ${balconyArea} sq. ft.\n` +
      `• Super Built-up Area: ${superBuiltUpArea} sq. ft. (${loadingPercent}% Loading)\n\n` +
      `💰 *Financial Reality Check:*\n` +
      `• Quoted Rate: ₹${quotedRate}/sq. ft.\n` +
      `• Total Agreement Value: ${formatINR(totalBaseCost)} (${formatLakhsCrores(totalBaseCost)})\n` +
      `⚡ *True Carpet Area Cost:* ₹${realRatePerCarpetSqFt}/sq. ft. (+${Math.round(((realRatePerCarpetSqFt - quotedRate) / quotedRate) * 100)}% markup)\n\n` +
      `📊 *Analyzed with DocTransfer PropTech Engine:* ${window.location.href}`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPdf(true);
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595, 842]);
      const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      // Header Banner
      page.drawRectangle({
        x: 40,
        y: 720,
        width: 515,
        height: 70,
        color: rgb(0.02, 0.58, 0.41)
      });

      page.drawText('DOCTRANSFER REAL ESTATE SUITE', {
        x: 55,
        y: 765,
        size: 10,
        font: fontBold,
        color: rgb(1, 1, 1)
      });

      page.drawText('RERA CARPET AREA VS SUPER BUILT-UP AUDIT', {
        x: 55,
        y: 742,
        size: 14,
        font: fontBold,
        color: rgb(1, 1, 1)
      });

      page.drawText('Real Estate (Regulation & Development) Act 2016 • Space Efficiency Evaluation', {
        x: 55,
        y: 728,
        size: 8.5,
        font: fontRegular,
        color: rgb(0.9, 0.98, 0.94)
      });

      let y = 690;
      page.drawText('1. PROPERTY & CONFIGURATION METADATA', { x: 40, y, size: 10, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
      y -= 16;

      const meta = [
        ['Project / Development Name:', projectName],
        ['Apartment Typology:', unitType],
        ['RERA Net Carpet Area:', `${carpetArea} sq. ft. (Internal walls included, external walls excluded)`],
        ['Exclusive Balcony / Utility:', `${balconyArea} sq. ft.`],
        ['Total Net Usable Private Space:', `${netUsableArea} sq. ft.`],
        ['Calculated Super Built-Up (Saleable):', `${superBuiltUpArea} sq. ft. (${loadingPercent}% Common Area Loading)`]
      ];

      meta.forEach(([k, v]) => {
        page.drawText(k, { x: 45, y, size: 8.5, font: fontBold, color: rgb(0.3, 0.3, 0.3) });
        page.drawText(v, { x: 220, y, size: 8.5, font: fontRegular, color: rgb(0.1, 0.1, 0.1) });
        y -= 14;
      });

      y -= 15;
      page.drawLine({ start: { x: 40, y }, end: { x: 555, y }, thickness: 1, color: rgb(0.85, 0.85, 0.85) });
      y -= 20;

      page.drawText('2. FINANCIAL REALITY CHECK & LOADING ANALYSIS', { x: 40, y, size: 10, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
      y -= 18;

      const rows = [
        ['Quoted Rate (Super Built-Up Basis)', `Rs. ${quotedRate.toLocaleString('en-IN')}/sq. ft.`, formatINR(totalBaseCost)],
        ['True Effective Rate (Usable Space Basis)', `Rs. ${realRatePerUsableSqFt.toLocaleString('en-IN')}/sq. ft.`, `+${Math.round(((realRatePerUsableSqFt - quotedRate) / quotedRate) * 100)}% Loading Gap`],
        ['True Effective Rate (RERA Carpet Only)', `Rs. ${realRatePerCarpetSqFt.toLocaleString('en-IN')}/sq. ft.`, `+${Math.round(((realRatePerCarpetSqFt - quotedRate) / quotedRate) * 100)}% Carpet Premium`],
        ['Total Paid for Common Corridors/Clubhouse', `${loadingPercent}% Loading Share`, formatINR(loadingMarkupCost)]
      ];

      rows.forEach(([title, rate, amt], idx) => {
        const isHighlight = idx === 2;
        if (isHighlight) {
          page.drawRectangle({ x: 40, y: y - 5, width: 515, height: 22, color: rgb(0.94, 0.99, 0.96) });
        }
        page.drawText(title, { x: 50, y, size: 8.5, font: isHighlight ? fontBold : fontRegular, color: isHighlight ? rgb(0.02, 0.58, 0.41) : rgb(0.2, 0.2, 0.2) });
        page.drawText(rate, { x: 300, y, size: 8.5, font: fontBold, color: isHighlight ? rgb(0.02, 0.58, 0.41) : rgb(0.3, 0.3, 0.3) });
        page.drawText(amt, { x: 430, y, size: 8.5, font: fontBold, color: isHighlight ? rgb(0.02, 0.58, 0.41) : rgb(0.1, 0.1, 0.1) });
        y -= 20;
      });

      y -= 20;
      page.drawRectangle({
        x: 40,
        y: y - 50,
        width: 515,
        height: 55,
        color: rgb(0.97, 0.98, 0.99),
        borderColor: rgb(0.85, 0.9, 0.95),
        borderWidth: 1
      });

      page.drawText(`RERA MANDATORY COMPLIANCE NOTE`, { x: 55, y: y - 18, size: 8.5, font: fontBold, color: rgb(0.02, 0.58, 0.41) });
      page.drawText(`Under Section 4(2)(h) and Section 14 of the Real Estate (Regulation & Development) Act 2016,`, { x: 55, y: y - 32, size: 8, font: fontRegular, color: rgb(0.3, 0.3, 0.3) });
      page.drawText(`promoters are legally mandated to sell apartments based strictly on RERA Carpet Area.`, { x: 55, y: y - 44, size: 8, font: fontRegular, color: rgb(0.3, 0.3, 0.3) });

      // Footer
      page.drawLine({ start: { x: 40, y: 70 }, end: { x: 555, y: 70 }, thickness: 0.5, color: rgb(0.8, 0.8, 0.8) });
      page.drawText('Generated via DocTransfer PropTech — Secure Document Rooms for Indian Real Estate', {
        x: 40,
        y: 55,
        size: 7.5,
        font: fontRegular,
        color: rgb(0.5, 0.5, 0.5)
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `rera-carpet-area-audit-${projectName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.pdf`;
      link.click();
    } catch (err) {
      console.error(err);
      alert('Error generating PDF report');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', display: 'flex', flexDirection: 'column' }}>
      <SEO
        title="RERA Carpet Area to Super Built-up Calculator (India) | DocTransfer"
        description="Calculate true per square foot property cost. Convert RERA carpet area to super built-up, calculate loading factor percentage, and download area audit PDF."
        keywords="RERA carpet area calculator, super built up to carpet area converter, property loading percentage India, real estate carpet area formula, DocTransfer PropTech"
      />

      <header style={{
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link
            to="/tools"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#475569',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
              padding: '6px 12px',
              borderRadius: '8px',
              background: '#f1f5f9'
            }}
          >
            <ArrowLeft size={16} /> All Free Tools
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ background: '#ecfdf5', color: '#059669', padding: '6px', borderRadius: '8px' }}>
              <Maximize2 size={20} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                RERA Carpet Area vs Super Built-up Calculator
              </h1>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
                Reveal True Cost per Usable Square Foot & Space Loading Transparency
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={handleShareWhatsApp}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#25d366',
              color: '#ffffff',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            <MessageCircle size={16} /> Share on WhatsApp
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPdf}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#059669',
              color: '#ffffff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: isGeneratingPdf ? 'wait' : 'pointer'
            }}
          >
            <Download size={16} /> {isGeneratingPdf ? 'Generating...' : 'Download Area Audit PDF'}
          </button>
        </div>
      </header>

      <main style={{ flex: 1, padding: '2rem', maxWidth: '1280px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        
        {/* Info Banner */}
        <div style={{
          background: 'linear-gradient(90deg, #ecfdf5 0%, #f0fdf4 100%)',
          border: '1px solid #a7f3d0',
          borderRadius: '16px',
          padding: '1.25rem 1.75rem',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#065f46', fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>
              <Sparkles size={18} /> Transparent PropTech Valuation
            </div>
            <p style={{ margin: 0, color: '#047857', fontSize: '0.825rem' }}>
              Under RERA Act 2016, developers are legally obligated to disclose Net Carpet Area. Uncover what you are actually paying for private bedrooms versus common corridors.
            </p>
          </div>
          <Link
            to="/tools/stamp-duty-calculator"
            style={{
              background: '#059669',
              color: '#ffffff',
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.825rem',
              fontWeight: 600
            }}
          >
            Calculate Stamp Duty →
          </Link>
        </div>

        {/* 2-Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          
          {/* Inputs Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Card 1: Carpet & Balcony Inputs */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', margin: '0 0 1rem 0' }}>
                1. Private Usable Dimensions (Sq. Ft.)
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>
                    RERA Net Carpet Area (sq. ft.)
                  </label>
                  <input
                    type="number"
                    value={carpetArea}
                    onChange={(e) => setCarpetArea(Number(e.target.value))}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', fontWeight: 700, boxSizing: 'border-box' }}
                  />
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Living, dining, bedrooms, kitchen</span>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>
                    Balcony & Utility Area (sq. ft.)
                  </label>
                  <input
                    type="number"
                    value={balconyArea}
                    onChange={(e) => setBalconyArea(Number(e.target.value))}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', fontWeight: 700, boxSizing: 'border-box' }}
                  />
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Exclusive private balconies</span>
                </div>
              </div>

              {/* Total Usable Highlight */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.825rem', color: '#475569' }}>Total Private Living Area:</span>
                <span style={{ fontWeight: 800, color: '#059669', fontSize: '0.95rem' }}>{netUsableArea} sq. ft.</span>
              </div>
            </div>

            {/* Card 2: Loading & Quoted Pricing */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                  2. Loading Factor & Quoted Rate
                </h3>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#059669' }}>
                  {loadingPercent}% Loading
                </span>
              </div>

              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 1rem 0' }}>
                Common area share (lobbies, staircases, lift shafts, club house). Typical Indian metro range is 22%–35%.
              </p>

              <input
                type="range"
                min="15"
                max="45"
                step="1"
                value={loadingPercent}
                onChange={(e) => setLoadingPercent(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#059669', marginBottom: '1.25rem' }}
              />

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  Builder Quoted Rate (₹ per sq. ft. on Super Built-up)
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#94a3b8' }}>₹</span>
                  <input
                    type="number"
                    value={quotedRate}
                    onChange={(e) => setQuotedRate(Number(e.target.value))}
                    style={{ width: '100%', padding: '10px 10px 10px 28px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', fontWeight: 700, boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            </div>

            {/* Card 3: Project Particulars */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', margin: '0 0 1rem 0' }}>
                3. Project & Apartment Details (For PDF Export)
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <input
                  type="text"
                  placeholder="Project Name / Developer"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
                <input
                  type="text"
                  placeholder="Typology (e.g. 3BHK Luxury / Unit 1404)"
                  value={unitType}
                  onChange={(e) => setUnitType(e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>
            </div>

          </div>

          {/* Results Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Primary Analysis Card */}
            <div style={{
              background: '#ffffff',
              border: '2px solid #10b981',
              borderRadius: '20px',
              padding: '2rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)'
            }}>
              
              {/* Efficiency Rating Banner */}
              <div style={{
                background: efficiency.bg,
                border: `1px solid ${efficiency.color}40`,
                borderRadius: '10px',
                padding: '10px 14px',
                marginBottom: '1.5rem'
              }}>
                <div style={{ color: efficiency.color, fontWeight: 700, fontSize: '0.85rem', marginBottom: '2px' }}>
                  {efficiency.label}
                </div>
                <div style={{ color: '#475569', fontSize: '0.75rem' }}>
                  {efficiency.text}
                </div>
              </div>

              {/* Big Metrics Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                    Saleable Area (Super Built-Up)
                  </span>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
                    {superBuiltUpArea} <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>sq. ft.</span>
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                    Total Base Purchase Value
                  </span>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#059669' }}>
                    {formatLakhsCrores(totalBaseCost)}
                  </div>
                </div>
              </div>

              {/* The "Eye-Opener" Rate Comparison */}
              <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1.25rem', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
                <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>
                  Rate Reality Check:
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem' }}>
                    <span style={{ color: '#64748b' }}>Advertised Builder Rate:</span>
                    <span style={{ fontWeight: 600 }}>₹{quotedRate.toLocaleString('en-IN')}/sq. ft.</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem' }}>
                    <span style={{ color: '#64748b' }}>Effective Usable Rate (Carpet + Balcony):</span>
                    <span style={{ fontWeight: 700, color: '#0284c7' }}>₹{realRatePerUsableSqFt.toLocaleString('en-IN')}/sq. ft.</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', borderTop: '1px dashed #cbd5e1', paddingTop: '6px' }}>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>True Cost per RERA Carpet Sq. Ft.:</span>
                    <span style={{ fontWeight: 800, color: '#059669' }}>₹{realRatePerCarpetSqFt.toLocaleString('en-IN')}/sq. ft.</span>
                  </div>
                </div>
              </div>

              {/* Common Area Loading Cost */}
              <div style={{ fontSize: '0.825rem', color: '#475569', marginBottom: '1.5rem' }}>
                You are paying approximately <strong>{formatINR(loadingMarkupCost)}</strong> ({loadingPercent}% of your capital) strictly for common amenities, corridors, and exterior passages.
              </div>

              {/* CTAs */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button
                  onClick={handleDownloadPDF}
                  disabled={isGeneratingPdf}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    background: '#059669',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Download size={16} /> Download PDF
                </button>
                <button
                  onClick={handleShareWhatsApp}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    background: '#25d366',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <MessageCircle size={16} /> Share on WhatsApp
                </button>
              </div>

            </div>

            {/* RERA Legal Guidance Box */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} style={{ color: '#059669' }} /> RERA Act Definition Cheat Sheet
              </h4>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#475569', fontSize: '0.825rem', lineHeight: '1.6' }}>
                <li><strong>Carpet Area (Section 2(k)):</strong> Net usable floor area of an apartment excluding the area covered by external walls, areas under services shafts, exclusive balcony or verandah area.</li>
                <li><strong>Exclusive Balcony:</strong> Balcony or verandah appurtenant to the net carpet area for the exclusive use of the allottee.</li>
                <li><strong>Prohibition on Super Built-up:</strong> Developers cannot penalize buyers for loading variations after signing the standard Agreement for Sale.</li>
              </ul>
            </div>

          </div>

        </div>

      </main>

      <footer style={{ background: '#ffffff', borderTop: '1px solid #e2e8f0', padding: '2rem', textAlign: 'center', fontSize: '0.8rem', color: '#64748b' }}>
        <p style={{ margin: 0 }}>
          DocTransfer PropTech Suite • Built for Indian Home Buyers, Channel Partners & Promoters.
        </p>
      </footer>
    </div>
  );
};

export default RERACarpetAreaCalculator;
