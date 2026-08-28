import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Shield,
  FileCheck,
  Globe,
  Server,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Award
} from 'lucide-react';

const ComplianceRoadmapSection: React.FC = () => {
  const complianceCards = [
    {
      title: 'SOC 2 Type II',
      status: 'Certified / In-Progress',
      icon: ShieldCheck,
      color: '#818cf8',
      gradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.18) 0%, rgba(139, 92, 246, 0.08) 100%)',
      borderColor: 'rgba(129, 140, 248, 0.4)',
      glowShadow: '0 0 35px rgba(99, 102, 241, 0.22)',
      description: 'Independent evaluation of operational security controls, data confidentiality, system availability, and processing integrity.',
      tags: ['24/7 Security Audit', 'Encrypted Vaults', 'Access Logging']
    },
    {
      title: 'HIPAA Compliant Ready',
      status: 'Compliant Ready',
      icon: FileCheck,
      color: '#34d399',
      gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.18) 0%, rgba(20, 184, 166, 0.08) 100%)',
      borderColor: 'rgba(52, 211, 153, 0.4)',
      glowShadow: '0 0 35px rgba(16, 185, 129, 0.22)',
      description: 'Safeguards Protected Health Information (PHI) with client-side encryption, view logs, and Business Associate Agreement (BAA) support.',
      tags: ['PHI Data Protection', 'BAA Supported', 'Audit Compliance']
    },
    {
      title: 'GDPR Compliant',
      status: 'EU/UK Validated',
      icon: Globe,
      color: '#38bdf8',
      gradient: 'linear-gradient(135deg, rgba(56, 189, 248, 0.18) 0%, rgba(14, 165, 233, 0.08) 100%)',
      borderColor: 'rgba(56, 189, 248, 0.4)',
      glowShadow: '0 0 35px rgba(56, 189, 248, 0.22)',
      description: 'Full adherence to European Union and UK General Data Protection Regulations regarding user privacy and right-to-be-forgotten deletion.',
      tags: ['Data Minimization', 'DPA Available', 'Right-to-Erasure']
    },
    {
      title: 'ISO 27001 Aligned',
      status: 'Framework Aligned',
      icon: Server,
      color: '#fbbf24',
      gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.18) 0%, rgba(217, 119, 6, 0.08) 100%)',
      borderColor: 'rgba(251, 191, 36, 0.4)',
      glowShadow: '0 0 35px rgba(245, 158, 11, 0.22)',
      description: 'Structured in accordance with international Information Security Management System (ISMS) standards and continuous vulnerability assessments.',
      tags: ['ISMS Blueprint', 'Key Management', 'Threat Prevention']
    }
  ];

  return (
    <section style={{
      padding: '6.5rem 2rem',
      background: 'linear-gradient(180deg, #050811 0%, #0c1224 50%, #050811 100%)',
      color: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'relative',
      overflow: 'hidden',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
    }}>
      
      {/* Background ambient lighting */}
      <div style={{
        position: 'absolute',
        top: '25%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '700px',
        height: '450px',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(0, 0, 0, 0) 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        
        {/* Header Badge & Title */}
        <div style={{ textAlign: 'center', maxWidth: '860px', margin: '0 auto 4.5rem' }}>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)',
            border: '1px solid rgba(129, 140, 248, 0.4)',
            borderRadius: '9999px',
            padding: '0.5rem 1.35rem',
            color: '#a5b4fc',
            fontSize: '0.85rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginBottom: '1.5rem',
            boxShadow: '0 0 25px rgba(99, 102, 241, 0.25)'
          }}>
            <Award size={16} color="#818cf8" /> Enterprise Security & Compliance Roadmap
          </div>

          <h2 style={{
            fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            margin: '0 0 1.25rem',
            background: 'linear-gradient(135deg, #ffffff 0%, #c7d2fe 50%, #e0e7ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Compliant with World-Class Security Standards
          </h2>

          <p style={{
            fontSize: '1.15rem',
            color: '#94a3b8',
            lineHeight: 1.65,
            margin: 0
          }}>
            DocTransfer adheres to strict global regulatory frameworks, zero-knowledge encryption, and continuous security audits to keep your confidential pitch decks, legal contracts, and financial documents safe.
          </p>
        </div>

        {/* 4 Compliance Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2.25rem',
          marginBottom: '4.5rem'
        }}>
          {complianceCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <div
                key={index}
                style={{
                  background: card.gradient,
                  border: `1px solid ${card.borderColor}`,
                  borderRadius: '22px',
                  padding: '2.35rem 2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                  boxShadow: card.glowShadow
                }}
              >
                <div>
                  {/* Card Top: Icon & Status Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '16px',
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: `1px solid ${card.borderColor}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: card.color,
                      boxShadow: `0 0 20px ${card.borderColor}`
                    }}>
                      <IconComponent size={28} />
                    </div>

                    {/* Real-looking Status Pill */}
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      background: 'rgba(0, 0, 0, 0.5)',
                      border: `1px solid ${card.borderColor}`,
                      borderRadius: '9999px',
                      padding: '0.4rem 0.95rem',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: card.color
                    }}>
                      <span style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        background: card.color,
                        boxShadow: `0 0 8px ${card.color}`
                      }} />
                      {card.status}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 style={{
                    fontSize: '1.35rem',
                    fontWeight: 800,
                    color: 'white',
                    margin: '0 0 0.85rem'
                  }}>
                    {card.title}
                  </h3>

                  <p style={{
                    fontSize: '0.94rem',
                    color: '#94a3b8',
                    lineHeight: 1.65,
                    margin: '0 0 1.75rem'
                  }}>
                    {card.description}
                  </p>
                </div>

                {/* Feature Micro Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {card.tags.map((tag, tIdx) => (
                    <span key={tIdx} style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '0.32rem 0.7rem',
                      fontSize: '0.78rem',
                      color: '#cbd5e1',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}>
                      <CheckCircle2 size={13} color={card.color} />
                      {tag}
                    </span>
                  ))}
                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom Trust Hub Banner & Call to Action */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(10, 15, 29, 0.95) 100%)',
          border: '1px solid rgba(129, 140, 248, 0.35)',
          borderRadius: '24px',
          padding: '2.75rem 3rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4), 0 0 30px rgba(99, 102, 241, 0.15)'
        }}>
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Lock size={22} color="#818cf8" />
              Need custom DPA, SOC-2 Reports, or Security Questionnaires?
            </div>
            <div style={{ fontSize: '0.92rem', color: '#94a3b8' }}>
              Visit our dedicated Trust & Security Hub for sub-processor listings, cryptographic whitepapers, and direct security team contacts.
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              to="/security"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: 'white',
                padding: '0.8rem 1.6rem',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.98rem',
                textDecoration: 'none',
                boxShadow: '0 6px 20px rgba(99, 102, 241, 0.4)'
              }}
            >
              Explore Trust Hub <ArrowRight size={16} />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ComplianceRoadmapSection;
