import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Sparkles, ArrowLeft, FileCheck, Download, ArrowRight, CheckCircle2, ShieldCheck, MessageCircle, MapPin, Building, Calendar, IndianRupee } from 'lucide-react';
import SEO from '../../components/SEO';
import { getToolBySlug } from '../../data/toolsData';

const RentAgreementGenerator: React.FC = () => {
  const toolData = getToolBySlug('rent-agreement-generator');
  const [city, setCity] = useState('Bangalore');
  const [state, setState] = useState('Karnataka');
  const [landlordName, setLandlordName] = useState('Suresh Kumar');
  const [tenantName, setTenantName] = useState('Rahul Sharma');
  const [propertyAddress, setPropertyAddress] = useState('Flat 402, Greenview Heights, Koramangala, Bangalore');
  const [monthlyRent, setMonthlyRent] = useState('28000');
  const [securityDeposit, setSecurityDeposit] = useState('150000');
  const [maintenanceCharges, setMaintenanceCharges] = useState('2500');
  const [lockInMonths, setLockInMonths] = useState('6');
  const [noticeDays, setNoticeDays] = useState('30');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  const handleCityChange = (newCity: string) => {
    setCity(newCity);
    if (newCity === 'Bangalore') setState('Karnataka');
    else if (newCity === 'Mumbai' || newCity === 'Pune') setState('Maharashtra');
    else if (newCity === 'Delhi' || newCity === 'Gurgaon' || newCity === 'Noida') setState('Delhi NCR');
    else if (newCity === 'Hyderabad') setState('Telangana');
    else if (newCity === 'Chennai') setState('Tamil Nadu');
    else if (newCity === 'Kolkata') setState('West Bengal');
  };

  const generatePDF = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let y = 740;
    page.drawText('11-MONTH RESIDENTIAL LEASE AGREEMENT', { x: 50, y, size: 14, font: fontBold, color: rgb(0.31, 0.27, 0.9) });
    y -= 18;
    page.drawText(`Governed under the Indian Contract Act 1872 • State of ${state}`, { x: 50, y, size: 9, font, color: rgb(0.4, 0.4, 0.4) });
    y -= 20;

    page.drawLine({ start: { x: 50, y }, end: { x: 562, y }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });
    y -= 25;

    const preamble = `This Rent Agreement is made and executed on this ${startDate} at ${city}, ${state} between:`;
    page.drawText(preamble, { x: 50, y, size: 9.5, font, maxWidth: 512, lineHeight: 14 });
    y -= 28;

    page.drawText(`LESSOR / LANDLORD: ${landlordName}`, { x: 50, y, size: 10, font: fontBold });
    y -= 16;
    page.drawText(`AND LESSEE / TENANT: ${tenantName}`, { x: 50, y, size: 10, font: fontBold });
    y -= 25;

    page.drawText('1. PREMISES & DURATION', { x: 50, y, size: 10.5, font: fontBold });
    y -= 14;
    const clause1 = `The Lessor agrees to let out and the Lessee agrees to take on lease the residential premises situated at: ${propertyAddress} for an 11-month term commencing from ${startDate}.`;
    page.drawText(clause1, { x: 50, y, size: 9, font, maxWidth: 512, lineHeight: 13 });
    y -= 32;

    page.drawText('2. MONTHLY RENT & MAINTENANCE', { x: 50, y, size: 10.5, font: fontBold });
    y -= 14;
    const clause2 = `The Lessee shall pay a monthly rent of Rs. ${monthlyRent}/- (Rupees ${monthlyRent} only) on or before the 5th day of each calendar month. Additional maintenance charges of Rs. ${maintenanceCharges}/- shall be paid directly as applicable.`;
    page.drawText(clause2, { x: 50, y, size: 9, font, maxWidth: 512, lineHeight: 13 });
    y -= 32;

    page.drawText('3. INTEREST-FREE SECURITY DEPOSIT', { x: 50, y, size: 10.5, font: fontBold });
    y -= 14;
    const clause3 = `The Lessee has paid an interest-free refundable security deposit of Rs. ${securityDeposit}/- to the Lessor, refundable at the time of vacating the premises after adjusting any unpaid utility bills or damages.`;
    page.drawText(clause3, { x: 50, y, size: 9, font, maxWidth: 512, lineHeight: 13 });
    y -= 32;

    page.drawText('4. LOCK-IN PERIOD & TERMINATION NOTICE', { x: 50, y, size: 10.5, font: fontBold });
    y -= 14;
    const clause4 = `This agreement has a mandatory lock-in period of ${lockInMonths} months. Either party may terminate this agreement thereafter by serving a written notice of ${noticeDays} days or paying rent in lieu thereof.`;
    page.drawText(clause4, { x: 50, y, size: 9, font, maxWidth: 512, lineHeight: 13 });
    y -= 40;

    page.drawText('SIGNATURES & WITNESSES', { x: 50, y, size: 10.5, font: fontBold });
    y -= 35;

    page.drawText(`LESSOR: ${landlordName}`, { x: 50, y, size: 9.5, font: fontBold });
    page.drawText(`LESSEE: ${tenantName}`, { x: 320, y, size: 9.5, font: fontBold });
    y -= 35;

    page.drawText('Signature: ______________________', { x: 50, y, size: 9, font });
    page.drawText('Signature: ______________________', { x: 320, y, size: 9, font });
    y -= 20;
    page.drawText('Date: ________________________', { x: 50, y, size: 9, font });
    page.drawText('Date: ________________________', { x: 320, y, size: 9, font });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `rent-agreement-${city.toLowerCase()}-${tenantName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.pdf`;
    link.click();
  };

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(
      `🏠 *11-Month Rent Agreement Draft (${city})*\n\n` +
      `👤 *Landlord:* ${landlordName}\n` +
      `👤 *Tenant:* ${tenantName}\n` +
      `💰 *Monthly Rent:* ₹${monthlyRent}/mo\n` +
      `🛡️ *Deposit:* ₹${securityDeposit}\n\n` +
      `👉 *Draft, track & e-sign legally under IT Act 2000:* https://www.doctransfer.app/tools/rent-agreement-generator`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1e293b' }}>
      <SEO
        title="11-Month Rent Agreement Online Maker (India) — Free PDF & E-Sign | DocTransfer"
        description="Draft legally compliant 11-month rental agreements online for Bangalore, Mumbai, Delhi, Hyderabad. Calculate state stamp duty, download PDF, and share for mobile e-signing."
        keywords="rent agreement generator online India, 11 month rent agreement format, rent agreement Bangalore, rental agreement Mumbai, rent agreement online maker free"
        url="https://www.doctransfer.app/tools/rent-agreement-generator"
      />

      <header style={{ height: '70px', background: 'white', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#4f46e5', fontWeight: '800', fontSize: '1.25rem' }}>
          <Sparkles size={22} /> DocTransfer
        </Link>
        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/tools" style={{ textDecoration: 'none', color: '#4f46e5', fontWeight: 600, fontSize: '0.95rem' }}>Tools Directory</Link>
          <Link to="/pricing" style={{ textDecoration: 'none', color: '#64748b', fontWeight: 500, fontSize: '0.95rem' }}>Pricing (₹0 Free Tier)</Link>
        </nav>
      </header>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem 6rem' }}>
        <Link to="/tools" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#6366f1', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          <ArrowLeft size={16} /> Back to Free Tools
        </Link>

        {/* Hero Banner */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: '#e0e7ff',
            color: '#4338ca',
            padding: '0.35rem 0.9rem',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: '1rem'
          }}>
            <FileCheck size={14} /> IT Act 2000 & Indian Contract Act Compliant
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1rem', letterSpacing: '-0.02em' }}>
            11-Month Rent Agreement Online Maker
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.05rem', maxWidth: '680px', margin: '0 auto', lineHeight: 1.6 }}>
            Generate a customized, court-valid 11-month rental agreement for Bangalore, Mumbai, Delhi, Hyderabad & all Indian cities. Download clean PDF or e-sign instantly.
          </p>
        </div>

        {/* Generator Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          
          {/* Left Form Panel */}
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.5rem' }}>Agreement Parameters</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>City / Metro</label>
                <select
                  value={city}
                  onChange={(e) => handleCityChange(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem' }}
                >
                  <option value="Bangalore">Bangalore (Karnataka)</option>
                  <option value="Mumbai">Mumbai (Maharashtra)</option>
                  <option value="Pune">Pune (Maharashtra)</option>
                  <option value="Delhi">Delhi NCR</option>
                  <option value="Gurgaon">Gurgaon (Haryana)</option>
                  <option value="Hyderabad">Hyderabad (Telangana)</option>
                  <option value="Chennai">Chennai (Tamil Nadu)</option>
                  <option value="Kolkata">Kolkata (West Bengal)</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>Landlord Name</label>
                  <input
                    type="text"
                    value={landlordName}
                    onChange={(e) => setLandlordName(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>Tenant Name</label>
                  <input
                    type="text"
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>Rented Property Address</label>
                <input
                  type="text"
                  value={propertyAddress}
                  onChange={(e) => setPropertyAddress(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>Monthly Rent (₹)</label>
                  <input
                    type="number"
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>Security Deposit (₹)</label>
                  <input
                    type="number"
                    value={securityDeposit}
                    onChange={(e) => setSecurityDeposit(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>Lock-in (Months)</label>
                  <input
                    type="number"
                    value={lockInMonths}
                    onChange={(e) => setLockInMonths(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>Notice Period (Days)</label>
                  <input
                    type="number"
                    value={noticeDays}
                    onChange={(e) => setNoticeDays(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                <button
                  onClick={generatePDF}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '0.85rem',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)'
                  }}
                >
                  <Download size={18} /> Download Agreement PDF
                </button>
                <button
                  onClick={shareViaWhatsApp}
                  style={{
                    background: '#25D366',
                    color: 'white',
                    border: 'none',
                    padding: '0.85rem 1.25rem',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <MessageCircle size={18} /> WhatsApp
                </button>
              </div>
            </div>
          </div>

          {/* Right Live Preview Panel */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Live Legal Preview
              </span>
              <span style={{ fontSize: '0.75rem', background: '#dcfce7', color: '#16a34a', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
                11 Months Valid
              </span>
            </div>

            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '1.5rem',
              fontSize: '0.85rem',
              lineHeight: '1.7',
              color: '#334155',
              flex: 1,
              overflowY: 'auto'
            }}>
              <div style={{ textAlign: 'center', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
                RENTAL AGREEMENT ({state.toUpperCase()})
              </div>
              <p>This Rent Agreement is made on <strong>{startDate}</strong> at <strong>{city}</strong> between <strong>{landlordName}</strong> (Lessor) and <strong>{tenantName}</strong> (Lessee).</p>
              <p><strong>Premises:</strong> {propertyAddress}</p>
              <p><strong>Monthly Rent:</strong> ₹{monthlyRent}/month (Maintenance: ₹{maintenanceCharges}/mo)</p>
              <p><strong>Security Deposit:</strong> ₹{securityDeposit} (Refundable)</p>
              <p><strong>Lock-in Period:</strong> {lockInMonths} Months • <strong>Notice:</strong> {noticeDays} Days</p>
            </div>

            {/* Stamp Duty Guide Box */}
            <div style={{ marginTop: '1.5rem', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '1rem', fontSize: '0.82rem', color: '#1e40af' }}>
              <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>📌 {city} Stamp Duty Note:</div>
              {city === 'Bangalore' && 'Standard ₹100 or ₹200 e-Stamp Paper under Karnataka Stamp Act.'}
              {city === 'Mumbai' && 'Standard ₹500 or 0.25% stamp calculation under Maharashtra Stamp Act.'}
              {city === 'Delhi' && 'Standard ₹100 e-Stamp Paper for 11-month lease terms in Delhi NCR.'}
              {city === 'Hyderabad' && 'Standard ₹100 e-Stamp Paper under Telangana Registration Department norms.'}
              {!['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad'].includes(city) && 'Standard ₹100 e-Stamp Paper under state stamp duty rules.'}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default RentAgreementGenerator;
