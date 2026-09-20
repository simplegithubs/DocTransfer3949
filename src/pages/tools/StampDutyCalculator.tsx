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
  MapPin,
  Building2,
  IndianRupee,
  HelpCircle,
  TrendingDown,
  Percent,
  FileSpreadsheet,
  Share2,
  AlertCircle
} from 'lucide-react';
import SEO from '../../components/SEO';
import { getToolBySlug } from '../../data/toolsData';

interface StateRule {
  name: string;
  code: string;
  defaultCities: string[];
  calculate: (value: number, gender: 'male' | 'female' | 'joint', isUrban: boolean) => {
    stampDutyRate: number;
    stampDutyAmount: number;
    cessRate: number;
    cessAmount: number;
    registrationFee: number;
    totalGovtCost: number;
    femaleSavings: number;
    notes: string[];
  };
}

const STATE_RULES: Record<string, StateRule> = {
  maharashtra: {
    name: 'Maharashtra',
    code: 'MH',
    defaultCities: ['Mumbai', 'Pune', 'Thane', 'Nagpur', 'Nashik'],
    calculate: (val, gender, isUrban) => {
      let baseRate = isUrban ? 5 : 4;
      if (gender === 'female') baseRate = Math.max(1, baseRate - 1);
      const metroCessRate = isUrban ? 1 : 0;
      const lbtRate = isUrban ? 1 : 0;
      const totalStampRate = baseRate + metroCessRate + lbtRate;
      const stampDutyAmount = Math.round((val * totalStampRate) / 100);

      // Registration: 1% capped at ₹30,000 for properties > ₹30 Lakhs
      const registrationFee = val > 3000000 ? 30000 : Math.round((val * 1) / 100);
      const totalGovtCost = stampDutyAmount + registrationFee;

      // Female savings: 1% discount
      const maleRate = (isUrban ? 5 : 4) + metroCessRate + lbtRate;
      const maleCost = Math.round((val * maleRate) / 100) + registrationFee;
      const femaleSavings = gender === 'female' ? Math.max(0, maleCost - totalGovtCost) : 0;

      return {
        stampDutyRate: baseRate,
        stampDutyAmount,
        cessRate: metroCessRate + lbtRate,
        cessAmount: Math.round((val * (metroCessRate + lbtRate)) / 100),
        registrationFee,
        totalGovtCost,
        femaleSavings,
        notes: [
          'Includes 1% Metro Cess & 1% Local Body Tax (LBT) in Municipal Corporation limits.',
          'Women home buyers receive a 1% concession on base stamp duty.',
          'Registration charges capped at ₹30,000 for properties valued above ₹30 Lakhs.'
        ]
      };
    }
  },
  karnataka: {
    name: 'Karnataka',
    code: 'KA',
    defaultCities: ['Bangalore', 'Mysore', 'Hubli', 'Mangalore'],
    calculate: (val) => {
      let stampRate = 5;
      if (val <= 2000000) stampRate = 2;
      else if (val <= 4500000) stampRate = 3;

      const cessRate = 0.5; // 10% cess on 5% = 0.5% + 2% surcharge on stamp duty
      const totalStampDutyRate = stampRate + (stampRate * 0.12);
      const stampDutyAmount = Math.round((val * totalStampDutyRate) / 100);

      // Registration fee: 1% in Karnataka (reduced from 2% in recent amendment)
      const registrationFee = Math.round((val * 1) / 100);
      const totalGovtCost = stampDutyAmount + registrationFee;

      return {
        stampDutyRate: stampRate,
        stampDutyAmount,
        cessRate: 0.6,
        cessAmount: Math.round(stampDutyAmount * 0.12),
        registrationFee,
        totalGovtCost,
        femaleSavings: 0,
        notes: [
          'Standard stamp duty is 5% plus 10% cess and 2% surcharge on stamp duty value (approx 5.6% total).',
          'Properties up to ₹45 Lakhs qualify for subsidized 3% base stamp duty.',
          'Sub-Registrar registration charge is flat 1% of market guidance value.'
        ]
      };
    }
  },
  delhi: {
    name: 'Delhi NCR',
    code: 'DL',
    defaultCities: ['New Delhi', 'South Delhi', 'Dwarka', 'Rohini'],
    calculate: (val, gender) => {
      let rate = 6;
      if (gender === 'female') rate = 4;
      else if (gender === 'joint') rate = 5;

      const stampDutyAmount = Math.round((val * rate) / 100);
      const registrationFee = Math.round((val * 1) / 100);
      const totalGovtCost = stampDutyAmount + registrationFee;

      const maleCost = Math.round((val * 6) / 100) + registrationFee;
      const femaleSavings = (gender === 'female' || gender === 'joint') ? Math.max(0, maleCost - totalGovtCost) : 0;

      return {
        stampDutyRate: rate,
        stampDutyAmount,
        cessRate: 0,
        cessAmount: 0,
        registrationFee,
        totalGovtCost,
        femaleSavings,
        notes: [
          'Women buyers pay 4% stamp duty (a massive 2% discount compared to male buyers at 6%).',
          'Joint ownership (Male + Female) is charged at a blended 5% rate.',
          'Registration charge is flat 1% with no ceiling.'
        ]
      };
    }
  },
  haryana: {
    name: 'Haryana (Gurgaon / Faridabad)',
    code: 'HR',
    defaultCities: ['Gurgaon', 'Faridabad', 'Panchkula', 'Sonipat'],
    calculate: (val, gender, isUrban) => {
      let rate = isUrban ? 7 : 5;
      if (gender === 'female') rate = isUrban ? 5 : 3;
      else if (gender === 'joint') rate = isUrban ? 6 : 4;

      const stampDutyAmount = Math.round((val * rate) / 100);
      // Haryana slab-based registration fee up to ₹50,000 max
      let registrationFee = 50000;
      if (val <= 1000000) registrationFee = 10000;
      else if (val <= 2500000) registrationFee = 25000;

      const totalGovtCost = stampDutyAmount + registrationFee;
      const maleRate = isUrban ? 7 : 5;
      const maleCost = Math.round((val * maleRate) / 100) + registrationFee;
      const femaleSavings = Math.max(0, maleCost - totalGovtCost);

      return {
        stampDutyRate: rate,
        stampDutyAmount,
        cessRate: 0,
        cessAmount: 0,
        registrationFee,
        totalGovtCost,
        femaleSavings,
        notes: [
          'Urban areas like Gurgaon / Faridabad carry a 7% rate for men and 5% for women.',
          'Rural areas enjoy a lower 5% (male) and 3% (female) rate.',
          'Maximum registration fee is capped at ₹50,000 for high-value properties.'
        ]
      };
    }
  },
  uttarpradesh: {
    name: 'Uttar Pradesh (Noida / Lucknow)',
    code: 'UP',
    defaultCities: ['Noida', 'Greater Noida', 'Lucknow', 'Ghaziabad'],
    calculate: (val, gender) => {
      const rate = 7;
      let stampDutyAmount = Math.round((val * rate) / 100);
      let femaleSavings = 0;

      if (gender === 'female') {
        femaleSavings = 10000;
        stampDutyAmount = Math.max(0, stampDutyAmount - 10000);
      }

      const registrationFee = Math.round((val * 1) / 100);
      const totalGovtCost = stampDutyAmount + registrationFee;

      return {
        stampDutyRate: rate,
        stampDutyAmount,
        cessRate: 0,
        cessAmount: 0,
        registrationFee,
        totalGovtCost,
        femaleSavings,
        notes: [
          'Base stamp duty across UP is 7% of circle rate or agreement value.',
          'Women buyers receive a flat ₹10,000 rebate on stamp duty.',
          'Registration fee is 1% of total transaction value.'
        ]
      };
    }
  },
  telangana: {
    name: 'Telangana (Hyderabad)',
    code: 'TS',
    defaultCities: ['Hyderabad', 'Secunderabad', 'Cyberabad', 'Warangal'],
    calculate: (val) => {
      const stampDutyRate = 6;
      const transferDutyRate = 1.5;
      const regFeeRate = 0.5;
      const totalStampRate = stampDutyRate + transferDutyRate;

      const stampDutyAmount = Math.round((val * totalStampRate) / 100);
      const registrationFee = Math.round((val * regFeeRate) / 100);
      const totalGovtCost = stampDutyAmount + registrationFee;

      return {
        stampDutyRate: stampDutyRate,
        stampDutyAmount,
        cessRate: transferDutyRate,
        cessAmount: Math.round((val * transferDutyRate) / 100),
        registrationFee,
        totalGovtCost,
        femaleSavings: 0,
        notes: [
          'Total duty in Telangana is 7.5% (6% Stamp Duty + 1.5% Transfer Duty).',
          'Registration fee is 0.5% (minimum ₹1,000).',
          'Calculated on Dharani portal / Sub-Registrar market guidance values.'
        ]
      };
    }
  },
  tamilnadu: {
    name: 'Tamil Nadu (Chennai)',
    code: 'TN',
    defaultCities: ['Chennai', 'Coimbatore', 'Madurai', 'Trichy'],
    calculate: (val) => {
      const stampRate = 7;
      const regRate = 4;
      const stampDutyAmount = Math.round((val * stampRate) / 100);
      const registrationFee = Math.round((val * regRate) / 100);
      const totalGovtCost = stampDutyAmount + registrationFee;

      return {
        stampDutyRate: stampRate,
        stampDutyAmount,
        cessRate: 0,
        cessAmount: 0,
        registrationFee,
        totalGovtCost,
        femaleSavings: 0,
        notes: [
          'Tamil Nadu levies 7% stamp duty plus 4% registration charges (11% total government levy).',
          'Applies equally to all residential flats and land parcels across CMDA jurisdiction.'
        ]
      };
    }
  }
};

const StampDutyCalculator: React.FC = () => {
  const toolData = getToolBySlug('stamp-duty-calculator');

  const [selectedState, setSelectedState] = useState<string>('maharashtra');
  const [propertyValue, setPropertyValue] = useState<number>(8500000); // 85 Lakhs default
  const [gender, setGender] = useState<'male' | 'female' | 'joint'>('female');
  const [isUrban, setIsUrban] = useState<boolean>(true);
  const [buyerName, setBuyerName] = useState<string>('Priya & Rahul Sharma');
  const [propertyDetails, setPropertyDetails] = useState<string>('3BHK Apartment, Sector 62 / Koramangala');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const stateRule = STATE_RULES[selectedState] || STATE_RULES.maharashtra;

  const result = useMemo(() => {
    return stateRule.calculate(propertyValue, gender, isUrban);
  }, [stateRule, propertyValue, gender, isUrban]);

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

  const handleShareWhatsApp = () => {
    const text =
      `🏠 *Property Stamp Duty & Registration Estimate (India)*\n\n` +
      `📍 *State:* ${stateRule.name} (${isUrban ? 'Urban' : 'Rural'})\n` +
      `👤 *Ownership:* ${gender.toUpperCase()}\n` +
      `💰 *Property Consideration:* ${formatINR(propertyValue)} (${formatLakhsCrores(propertyValue)})\n\n` +
      `📑 *Government Fee Breakdown:*\n` +
      `• Stamp Duty: ${formatINR(result.stampDutyAmount)}\n` +
      `• Sub-Registrar Fee: ${formatINR(result.registrationFee)}\n` +
      `⚡ *Total Govt Charges:* ${formatINR(result.totalGovtCost)} (${((result.totalGovtCost / propertyValue) * 100).toFixed(2)}%)\n` +
      (result.femaleSavings > 0 ? `🎉 *Female Buyer Rebate Saved:* ${formatINR(result.femaleSavings)}\n\n` : '\n') +
      `📊 *Calculated via DocTransfer Real Estate Suite:* ${window.location.href}`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPdf(true);
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595, 842]); // A4 format
      const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      let y = 790;

      // Header Banner
      page.drawRectangle({
        x: 40,
        y: 720,
        width: 515,
        height: 70,
        color: rgb(0.02, 0.58, 0.41) // Emerald #059669
      });

      page.drawText('DOCTRANSFER REAL ESTATE SUITE', {
        x: 55,
        y: 765,
        size: 10,
        font: fontBold,
        color: rgb(1, 1, 1)
      });

      page.drawText('OFFICIAL STAMP DUTY & REGISTRATION ESTIMATE', {
        x: 55,
        y: 742,
        size: 14,
        font: fontBold,
        color: rgb(1, 1, 1)
      });

      page.drawText(`State: ${stateRule.name} • Governed by Indian Stamp Act & Registration Act 1908`, {
        x: 55,
        y: 728,
        size: 8.5,
        font: fontRegular,
        color: rgb(0.9, 0.98, 0.94)
      });

      y = 695;

      // Property & Buyer Metadata Box
      page.drawText('1. TRANSACTION & PROPERTY PARTICULARS', { x: 40, y, size: 10, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
      y -= 16;

      const metadataRows = [
        ['Client / Buyer Name:', buyerName || 'Prospective Buyer'],
        ['Property Description:', propertyDetails || 'Residential Apartment / Plot'],
        ['Jurisdiction State:', `${stateRule.name} (${isUrban ? 'Municipal Corporation / Urban' : 'Rural / Gram Panchayat'})`],
        ['Ownership Gender Category:', gender === 'female' ? 'Female (Eligible for State Concession)' : gender === 'joint' ? 'Joint Ownership' : 'Male Ownership'],
        ['Total Consideration Value:', `${formatINR(propertyValue)} (${formatLakhsCrores(propertyValue)})`],
        ['Date of Calculation:', new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })]
      ];

      metadataRows.forEach(([k, v]) => {
        page.drawText(k, { x: 45, y, size: 8.5, font: fontBold, color: rgb(0.3, 0.3, 0.3) });
        page.drawText(v, { x: 210, y, size: 8.5, font: fontRegular, color: rgb(0.1, 0.1, 0.1) });
        y -= 14;
      });

      y -= 10;
      page.drawLine({ start: { x: 40, y }, end: { x: 555, y }, thickness: 1, color: rgb(0.85, 0.85, 0.85) });
      y -= 20;

      // Calculation Breakdown Table
      page.drawText('2. STATUTORY GOVERNMENT LEVIES BREAKDOWN', { x: 40, y, size: 10, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
      y -= 18;

      const tableRows = [
        ['Base Stamp Duty', `${result.stampDutyRate}%`, formatINR(result.stampDutyAmount)],
        ['Local Body / Metro Cess', `${result.cessRate}%`, formatINR(result.cessAmount)],
        ['Sub-Registrar Registration Charges', 'State Fixed / Capped', formatINR(result.registrationFee)],
        ['TOTAL GOVERNMENT OUTFLOW', `${((result.totalGovtCost / propertyValue) * 100).toFixed(2)}%`, formatINR(result.totalGovtCost)]
      ];

      tableRows.forEach(([title, rate, amt], idx) => {
        const isTotal = idx === tableRows.length - 1;
        if (isTotal) {
          page.drawRectangle({ x: 40, y: y - 5, width: 515, height: 22, color: rgb(0.94, 0.99, 0.96) });
        }
        page.drawText(title, { x: 50, y, size: isTotal ? 9.5 : 8.5, font: isTotal ? fontBold : fontRegular, color: isTotal ? rgb(0.02, 0.58, 0.41) : rgb(0.2, 0.2, 0.2) });
        page.drawText(rate, { x: 320, y, size: isTotal ? 9.5 : 8.5, font: isTotal ? fontBold : fontRegular, color: isTotal ? rgb(0.02, 0.58, 0.41) : rgb(0.4, 0.4, 0.4) });
        page.drawText(amt, { x: 430, y, size: isTotal ? 10 : 8.5, font: fontBold, color: isTotal ? rgb(0.02, 0.58, 0.41) : rgb(0.1, 0.1, 0.1) });
        y -= 20;
      });

      y -= 15;

      // Net Outflow Summary Box
      page.drawRectangle({
        x: 40,
        y: y - 45,
        width: 515,
        height: 50,
        color: rgb(0.97, 0.98, 0.99),
        borderColor: rgb(0.85, 0.9, 0.95),
        borderWidth: 1
      });

      page.drawText('NET TOTAL ESTIMATED ACQUISITION BUDGET', { x: 55, y: y - 18, size: 8.5, font: fontBold, color: rgb(0.3, 0.35, 0.4) });
      page.drawText(`Property Value (${formatINR(propertyValue)}) + Govt Charges (${formatINR(result.totalGovtCost)}) = ${formatINR(propertyValue + result.totalGovtCost)}`, {
        x: 55,
        y: y - 35,
        size: 9.5,
        font: fontBold,
        color: rgb(0.05, 0.2, 0.4)
      });

      y -= 70;

      // State-specific legal notes
      page.drawText('3. STATE REGULATORY & REBATE OBSERVATIONS', { x: 40, y, size: 10, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
      y -= 16;

      (result.notes || []).forEach((note: string) => {
        page.drawText(`• ${note}`, { x: 45, y, size: 8, font: fontRegular, color: rgb(0.35, 0.35, 0.35), maxWidth: 500, lineHeight: 12 });
        y -= 15;
      });

      if (result.femaleSavings > 0) {
        y -= 5;
        page.drawText(`* FEMALE OWNERSHIP BENEFIT: A total rebate of ${formatINR(result.femaleSavings)} has been applied based on state gender concessions.`, {
          x: 45,
          y,
          size: 8,
          font: fontBold,
          color: rgb(0.02, 0.58, 0.41)
        });
        y -= 15;
      }

      // Security and DocTransfer Footer
      page.drawLine({ start: { x: 40, y: 70 }, end: { x: 555, y: 70 }, thickness: 0.5, color: rgb(0.8, 0.8, 0.8) });
      page.drawText('Generated via DocTransfer — Leading Indian Virtual Data Room & RERA Deal Closing Platform', {
        x: 40,
        y: 55,
        size: 7.5,
        font: fontRegular,
        color: rgb(0.5, 0.5, 0.5)
      });
      page.drawText('Disclaimer: Estimates based on current state schedules. Subject to sub-registrar guidance value assessment.', {
        x: 40,
        y: 45,
        size: 7,
        font: fontRegular,
        color: rgb(0.6, 0.6, 0.6)
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `stamp-duty-estimate-${stateRule.code.toLowerCase()}-${buyerName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.pdf`;
      link.click();
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      alert('Failed to generate PDF. Please check your browser settings.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', display: 'flex', flexDirection: 'column' }}>
      <SEO
        title="India Stamp Duty & Property Registration Calculator (2026) — All States | DocTransfer"
        description="Calculate property stamp duty and registration fees for Maharashtra, Karnataka, Delhi, Haryana, UP, Telangana, Tamil Nadu. Download free official cost breakdown PDF."
        keywords="stamp duty calculator India, property registration charges Bangalore, stamp duty Mumbai, stamp duty Delhi, RERA property calculator, DocTransfer PropTech"
      />

      {/* Navigation Header */}
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
              <Building2 size={20} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                India Stamp Duty & Registration Calculator
              </h1>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
                State-by-State Statutory Fee Estimator & Sub-Registrar Cost Engine
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
            <Download size={16} /> {isGeneratingPdf ? 'Generating PDF...' : 'Download Cost Sheet PDF'}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '2rem', maxWidth: '1280px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        
        {/* Real Estate Persona Banner */}
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
              <Sparkles size={18} /> For Channel Partners, Builders & Property Advocates
            </div>
            <p style={{ margin: 0, color: '#047857', fontSize: '0.825rem' }}>
              Generate stamped acquisition cost sheets for clients in under 10 seconds. Includes female concessions, metro cess, and sub-registrar registration caps.
            </p>
          </div>
          <Link
            to="/dataroom"
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
            Create RERA Deal Room →
          </Link>
        </div>

        {/* 2-Column Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          
          {/* LEFT COLUMN: Controls & Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Card 1: State Selection */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={16} style={{ color: '#059669' }} /> 1. Select State & Territory
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.5rem' }}>
                {Object.entries(STATE_RULES).map(([key, item]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedState(key)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: selectedState === key ? '2px solid #059669' : '1px solid #e2e8f0',
                      background: selectedState === key ? '#ecfdf5' : '#ffffff',
                      color: selectedState === key ? '#065f46' : '#475569',
                      fontWeight: selectedState === key ? 700 : 500,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px'
                    }}
                  >
                    <span>{item.name}</span>
                    <span style={{ fontSize: '0.7rem', color: selectedState === key ? '#059669' : '#94a3b8' }}>
                      {item.defaultCities[0]}, {item.defaultCities[1]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Card 2: Property Value Slider & Presets */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <IndianRupee size={16} style={{ color: '#059669' }} /> 2. Property Consideration (Agreement Value)
                </label>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#059669' }}>
                  {formatINR(propertyValue)}
                </span>
              </div>

              <input
                type="range"
                min="1000000"
                max="100000000"
                step="500000"
                value={propertyValue}
                onChange={(e) => setPropertyValue(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#059669', marginBottom: '1rem' }}
              />

              {/* Quick Presets */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {[3500000, 6000000, 8500000, 12500000, 20000000, 45000000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setPropertyValue(amt)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: propertyValue === amt ? '#059669' : '#f1f5f9',
                      color: propertyValue === amt ? '#ffffff' : '#475569',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {formatLakhsCrores(amt)}
                  </button>
                ))}
              </div>
            </div>

            {/* Card 3: Buyer Demographics & Location Type */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.75rem', display: 'block' }}>
                3. Ownership Gender & Urban / Rural Area
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
                {[
                  { id: 'female', label: 'Female Buyer 👩', sub: 'Rebate Eligible' },
                  { id: 'male', label: 'Male Buyer 👨', sub: 'Standard Rate' },
                  { id: 'joint', label: 'Joint (M+F) 👥', sub: 'Blended Rate' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setGender(item.id as any)}
                    style={{
                      padding: '10px 8px',
                      borderRadius: '8px',
                      border: gender === item.id ? '2px solid #059669' : '1px solid #e2e8f0',
                      background: gender === item.id ? '#ecfdf5' : '#ffffff',
                      color: gender === item.id ? '#065f46' : '#475569',
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <div>{item.label}</div>
                    <div style={{ fontSize: '0.65rem', color: gender === item.id ? '#059669' : '#94a3b8' }}>{item.sub}</div>
                  </button>
                ))}
              </div>

              {/* Urban vs Rural Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#334155' }}>
                  Location within Municipal / Metro Limits?
                </span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setIsUrban(true)}
                    style={{
                      padding: '4px 12px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      border: 'none',
                      background: isUrban ? '#059669' : '#e2e8f0',
                      color: isUrban ? '#ffffff' : '#64748b',
                      cursor: 'pointer'
                    }}
                  >
                    Urban
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsUrban(false)}
                    style={{
                      padding: '4px 12px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      border: 'none',
                      background: !isUrban ? '#059669' : '#e2e8f0',
                      color: !isUrban ? '#ffffff' : '#64748b',
                      cursor: 'pointer'
                    }}
                  >
                    Rural
                  </button>
                </div>
              </div>
            </div>

            {/* Optional Metadata for PDF */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.75rem', display: 'block' }}>
                4. Client & Project Details (For PDF Cost Sheet)
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <input
                  type="text"
                  placeholder="Client / Buyer Full Name"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem'
                  }}
                />
                <input
                  type="text"
                  placeholder="Unit No, Project Name, Location"
                  value={propertyDetails}
                  onChange={(e) => setPropertyDetails(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem'
                  }}
                />
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Results & Summary Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Highlight Results Card */}
            <div style={{
              background: '#ffffff',
              border: '2px solid #10b981',
              borderRadius: '20px',
              padding: '2rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#059669' }}>
                    Government Statutory Dues
                  </span>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '4px 0 0 0' }}>
                    {formatINR(result.totalGovtCost)}
                  </h3>
                  <span style={{ fontSize: '0.825rem', color: '#64748b' }}>
                    Approx {((result.totalGovtCost / propertyValue) * 100).toFixed(2)}% of Property Consideration
                  </span>
                </div>
                <div style={{
                  background: '#ecfdf5',
                  color: '#059669',
                  borderRadius: '50%',
                  width: '56px',
                  height: '56px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Percent size={28} />
                </div>
              </div>

              {/* Female Savings Alert */}
              {result.femaleSavings > 0 && (
                <div style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '1.5rem',
                  color: '#991b1b',
                  fontSize: '0.85rem',
                  fontWeight: 600
                }}>
                  <TrendingDown size={18} />
                  <span>Female Concession Applied: You save <strong>{formatINR(result.femaleSavings)}</strong>!</span>
                </div>
              )}

              {/* Line Items Table */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                  <span style={{ color: '#475569' }}>Base Stamp Duty ({result.stampDutyRate}%):</span>
                  <span style={{ fontWeight: 700, color: '#1e293b' }}>{formatINR(result.stampDutyAmount)}</span>
                </div>

                {result.cessRate > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                    <span style={{ color: '#475569' }}>Cess & Surcharge ({result.cessRate}%):</span>
                    <span style={{ fontWeight: 700, color: '#1e293b' }}>{formatINR(result.cessAmount)}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                  <span style={{ color: '#475569' }}>Sub-Registrar Registration Fee:</span>
                  <span style={{ fontWeight: 700, color: '#1e293b' }}>{formatINR(result.registrationFee)}</span>
                </div>

                <div style={{
                  borderTop: '2px dashed #cbd5e1',
                  paddingTop: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '1rem',
                  fontWeight: 800,
                  color: '#0f172a'
                }}>
                  <span>Total Acquisition Outflow:</span>
                  <span style={{ color: '#059669', fontSize: '1.15rem' }}>
                    {formatINR(propertyValue + result.totalGovtCost)}
                  </span>
                </div>
              </div>

              {/* Action CTAs */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1.75rem' }}>
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
                  <MessageCircle size={16} /> Send via WhatsApp
                </button>
              </div>
            </div>

            {/* State-specific observations */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} style={{ color: '#059669' }} /> {stateRule.name} Statutory Rules
              </h4>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#475569', fontSize: '0.825rem', lineHeight: '1.6' }}>
                {(result.notes || []).map((note: string, idx: number) => (
                  <li key={idx} style={{ marginBottom: '4px' }}>{note}</li>
                ))}
              </ul>
            </div>

            {/* DocTransfer PropTech Pitch */}
            <div style={{
              background: '#0f172a',
              color: '#ffffff',
              borderRadius: '16px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={20} style={{ color: '#34d399' }} />
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>
                  Sharing this property with buyers?
                </h4>
              </div>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.825rem', lineHeight: '1.5' }}>
                Don't send plain PDF brochures that clients use to bypass you. Upload to <strong>DocTransfer</strong> to apply dynamic anti-poaching watermarks, track reading dwell time, and get instant alerts on WhatsApp.
              </p>
              <Link
                to="/dataroom"
                style={{
                  color: '#34d399',
                  textDecoration: 'none',
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                Launch Protected Deal Room Free →
              </Link>
            </div>

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer style={{ background: '#ffffff', borderTop: '1px solid #e2e8f0', padding: '2rem', textAlign: 'center', fontSize: '0.8rem', color: '#64748b' }}>
        <p style={{ margin: 0 }}>
          DocTransfer PropTech Suite • Compliant with Indian Stamp Act 1899, Registration Act 1908 & RERA Act 2016.
        </p>
      </footer>
    </div>
  );
};

export default StampDutyCalculator;
