import React, { useState } from 'react';
import { Shield, CheckCircle, ArrowRight, X, Sparkles, Star, Lock, Zap, FileText, Film } from 'lucide-react';
import './TestimonialsSection.css';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  category: 'all' | 'founders' | 'vc' | 'legal' | 'creative' | 'security';
  avatar: string;
  fallbackInitials: string;
  quote: string;
  metric: string;
  metricIcon: React.ComponentType<{ size?: number; className?: string; color?: string; style?: React.CSSProperties }>;
  caseStudy: {
    title: string;
    challenge: string;
    solution: string;
    results: string[];
    timeframe: string;
  };
}

const testimonials: Testimonial[] = [
  {
    id: 'marcus-vance',
    name: 'Marcus Vance',
    role: 'Founder & CEO',
    company: 'AetherFlow AI (San Francisco)',
    category: 'founders',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    fallbackInitials: 'MV',
    quote: 'Pitching US and global VCs used to be a black box. With DocTransfer’s slide-by-slide dwell time tracking, we knew down to the second when tier-1 partners were reading our unit economics, helping us close our $1.2M seed round in 14 days.',
    metric: 'Closed $1.2M Seed in 14 days',
    metricIcon: Zap,
    caseStudy: {
      title: 'Accelerating a $1.2M Seed Round with Real-Time Pitch Deck Engagement Analytics',
      challenge: 'Pitching 40+ US and cross-border VC funds with zero visibility into partner engagement or slide drop-off rates.',
      solution: 'Shared trackable pitch deck links with dynamic recipient watermarking, real-time Slack/Email alerts, and instant mobile viewing.',
      results: [
        'Identified high-conviction partner leads within 12 hours of link dispatch',
        'Tailored pitch calls around the specific financial slides investors reviewed longest',
        'Executed convertible SAFE notes online with full ESIGN Act and Delaware legal validity'
      ],
      timeframe: '14-day seed round across SF & New York'
    }
  },
  {
    id: 'rohan-sharma',
    name: 'Rohan Sharma',
    role: 'Founder & CEO',
    company: 'BharatPulse AI (Bengaluru)',
    category: 'founders',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    fallbackInitials: 'RS',
    quote: 'Indian founders used to waste hours guessing if VCs read our pitch deck. With DocTransfer, we knew down to the second which partner read our unit economics, helping us close our $850K seed round in 18 days.',
    metric: 'Closed $850K Seed in 18 days',
    metricIcon: Zap,
    caseStudy: {
      title: 'Accelerating an $850K Seed Round with Page-by-Page Pitch Deck Analytics',
      challenge: 'Pitching 30+ Indian angel syndicates and VC funds with zero visibility into partner engagement or slide drop-off rates.',
      solution: 'Shared pitch deck links with dynamic recipient watermarks, slide dwell-time tracking, and instant WhatsApp link delivery.',
      results: [
        'Identified high-conviction lead angels within 24 hours of pitch link dispatch',
        'Tailored partner pitch calls focusing on the exact financial slides investors reviewed longest',
        'Signed iSAFE investment notes online with 100% legal validity under IT Act 2000'
      ],
      timeframe: '18-day fundraising cycle across Bengaluru & Mumbai'
    }
  },
  {
    id: 'elena-rostova',
    name: 'Elena Rostova',
    role: 'Cross-Border M&A Partner',
    company: 'Vanguard Legal LLP (London)',
    category: 'legal',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    fallbackInitials: 'ER',
    quote: 'Managing multi-jurisdiction M&A data rooms across London, Frankfurt, and Singapore used to be painfully complex on legacy VDRs. DocTransfer’s zero-knowledge vaults and eIDAS-admissible audit logs made our due diligence seamless.',
    metric: '$42M Cross-Border Deal Closed',
    metricIcon: Shield,
    caseStudy: {
      title: 'Executing a $42M Cross-Border Tech Acquisition Under eIDAS & GDPR Standards',
      challenge: 'Coordinating multi-party due diligence across UK, EU, and US buyers with strict cross-border data privacy regulations.',
      solution: 'Deployed DocTransfer virtual data rooms with granular viewer permissions, dynamic watermarking, and eIDAS & GDPR compliance.',
      results: [
        'Reduced deal due diligence turnaround by 40%',
        'Maintained 100% tamper-evident audit trails compliant with EU/UK eIDAS standards',
        'Zero unauthorized document leaks across 12 participating buyer entities'
      ],
      timeframe: 'Across a 60-day cross-border acquisition process'
    }
  },
  {
    id: 'ananya-iyer',
    name: 'CA Ananya Iyer',
    role: 'Managing Partner',
    company: 'Iyer & Associates Tax Firm (Mumbai)',
    category: 'legal',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    fallbackInitials: 'AI',
    quote: 'Collecting Form 16, GST returns, and bank statements from 400+ clients during tax audit season was chaos over WhatsApp. DocTransfer’s zero-knowledge client vaults cut our collection time by 75%.',
    metric: '75% faster ITR document collection',
    metricIcon: FileText,
    caseStudy: {
      title: 'Streamlining 400+ Tax Audits and Statutory Filings Under ICAI & DPDP Guidelines',
      challenge: 'Unsecured client transmissions of PAN and Aadhaar files over email with no confidentiality safeguards or tracking.',
      solution: 'Created dedicated client data rooms with AES-256 client-side encryption and automated link expiration for tax computation sheets.',
      results: [
        'Collected 100% of audit working papers securely before statutory MCA and ITR deadlines',
        'Eliminated risk of client financial data leaks complying with DPDP Act 2023 norms',
        'Executed CA engagement letters and representation certificates with instant mobile e-signing'
      ],
      timeframe: 'During July-September busy tax season'
    }
  },
  {
    id: 'arjun-mehta',
    name: 'Arjun Mehta',
    role: 'General Partner',
    company: 'Indus & Pacific Ventures (Singapore)',
    category: 'vc',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    fallbackInitials: 'AM',
    quote: 'Confidential deal memos and cap tables used to leak into syndicate investor channels. DocTransfer’s dynamic recipient watermarking and remote link kill-switch completely solved our leak problem across cross-border investments.',
    metric: '100% leak-proof LP deal rooms',
    metricIcon: Shield,
    caseStudy: {
      title: 'How Indus & Pacific Eliminated Deal Memo Leaks Across 35+ Portfolio Investments',
      challenge: 'Confidential term sheets and startup cap tables were frequently shared outside authorized investor syndicates across US, India, and SEA.',
      solution: 'Implemented DocTransfer dynamic recipient watermarking, email verification gates, and instant remote link revocation.',
      results: [
        'Zero unauthorized document leaks across 35+ investment rounds in US, SEA, and India',
        'Real-time notifications whenever LP partners opened quarterly MIS reports',
        'Complete forensic audit trails conforming to international electronic evidence standards'
      ],
      timeframe: 'Over 2 years of active venture investing'
    }
  },
  {
    id: 'david-chen',
    name: 'David Chen',
    role: 'VP of Information Security',
    company: 'ApexCloud Technologies (New York)',
    category: 'security',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&auto=format&fit=crop&q=80',
    fallbackInitials: 'DC',
    quote: 'Zero-knowledge browser-side encryption, granular domain access controls, and instant remote link revocation made SOC-2, GDPR, and DPDP Act compliance effortless across our enterprise deal teams.',
    metric: 'SOC-2 Type II & GDPR Compliant',
    metricIcon: Lock,
    caseStudy: {
      title: 'Enterprise-Wide Zero-Knowledge Document Governance & Instant Revocation',
      challenge: 'Strict international enterprise privacy mandates required that customer data and vendor contracts never rest unencrypted on third-party cloud hosts.',
      solution: 'Adopted DocTransfer’s Vault Mode client-side AES-256-GCM encryption with granular IP and domain whitelisting.',
      results: [
        'Passed enterprise SOC-2 Type II, GDPR, and DPDP Act compliance audits with zero data exposure findings',
        'Instant remote revocation of vendor document links with one click',
        'Complete end-to-end cryptographic verification directly in the browser'
      ],
      timeframe: 'Rollout across 1,200+ employees and external enterprise vendors'
    }
  }
];

const categories = [
  { id: 'all', label: 'All Stories' },
  { id: 'founders', label: 'Founders' },
  { id: 'vc', label: 'Venture Capital' },
  { id: 'legal', label: 'Legal & M&A' },
  { id: 'creative', label: 'Creators' },
  { id: 'security', label: 'Security' },
];

const TestimonialsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<Testimonial | null>(null);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const filteredTestimonials = activeCategory === 'all'
    ? testimonials
    : testimonials.filter((t) => t.category === activeCategory);

  const handleImageError = (id: string) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section className="testimonials-section" id="stories">
      <div className="testimonials-container">
        {/* Section Header */}
        <div className="testimonials-header">
          <div className="testimonials-badge">
            <Sparkles size={15} className="badge-sparkle" />
            <span>Customer Stories</span>
          </div>
          <h2 className="testimonials-title">
            Loved by the busiest people
          </h2>
          <p className="testimonials-subtitle">
            From high-stakes founders and top-tier VCs to M&amp;A attorneys and studio producers—see how high-velocity leaders rely on DocTransfer to share, track, and close deals securely.
          </p>

          {/* Category Filter Tabs */}
          <div className="testimonials-categories">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`category-pill ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="testimonials-grid">
          {filteredTestimonials.map((item) => {
            const MetricIconComponent = item.metricIcon;
            return (
              <div key={item.id} className="testimonial-card">
                {/* Metric / Category Badge */}
                <div className="testimonial-card-top">
                  <div className="metric-pill">
                    <MetricIconComponent size={14} className="metric-icon" />
                    <span>{item.metric}</span>
                  </div>
                  <div className="rating-stars" aria-label="5 stars">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} fill="#f59e0b" color="#f59e0b" />
                    ))}
                  </div>
                </div>

                {/* Quote Content */}
                <div className="testimonial-quote-body">
                  <p className="testimonial-quote">
                    “{item.quote.replace(/^[“"]|[”"]$/g, '')}”
                  </p>
                </div>

                {/* Action Link */}
                <button
                  type="button"
                  className="case-study-link-btn"
                  onClick={() => setSelectedCaseStudy(item)}
                >
                  <span>Read case study</span>
                  <ArrowRight size={15} className="arrow-icon" />
                </button>

                {/* Profile Footer */}
                <div className="testimonial-author">
                  <div className="author-avatar-wrapper">
                    {!imgErrors[item.id] ? (
                      <img
                        src={item.avatar}
                        alt={item.name}
                        className="author-avatar"
                        loading="lazy"
                        onError={() => handleImageError(item.id)}
                      />
                    ) : (
                      <div className="author-avatar-fallback">
                        {item.fallbackInitials}
                      </div>
                    )}
                    <span className="verified-badge-mini" title="Verified Customer">
                      <CheckCircle size={12} fill="#3b82f6" color="#ffffff" />
                    </span>
                  </div>

                  <div className="author-info">
                    <div className="author-name-row">
                      <span className="author-name">{item.name}</span>
                    </div>
                    <div className="author-role-company">
                      {item.role}, <span className="company-highlight">{item.company}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Social Proof Bar */}
        <div className="testimonials-footer-proof">
          <div className="proof-stat-item">
            <span className="stat-number">10,000+</span>
            <span className="stat-label">Decks &amp; Contracts Shared</span>
          </div>
          <div className="proof-divider" />
          <div className="proof-stat-item">
            <span className="stat-number">100%</span>
            <span className="stat-label">Zero-Knowledge Encrypted</span>
          </div>
          <div className="proof-divider" />
          <div className="proof-stat-item">
            <span className="stat-number">4.9 / 5</span>
            <span className="stat-label">Customer Satisfaction Rating</span>
          </div>
        </div>
      </div>

      {/* Case Study Modal */}
      {selectedCaseStudy && (
        <div className="case-study-modal-backdrop" onClick={() => setSelectedCaseStudy(null)}>
          <div
            className="case-study-modal-content"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setSelectedCaseStudy(null)}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div className="modal-header">
              <div className="modal-person-row">
                {!imgErrors[selectedCaseStudy.id] ? (
                  <img
                    src={selectedCaseStudy.avatar}
                    alt={selectedCaseStudy.name}
                    className="modal-person-avatar"
                  />
                ) : (
                  <div className="modal-person-fallback">
                    {selectedCaseStudy.fallbackInitials}
                  </div>
                )}
                <div>
                  <h3 className="modal-person-name">{selectedCaseStudy.name}</h3>
                  <p className="modal-person-role">
                    {selectedCaseStudy.role} • <strong>{selectedCaseStudy.company}</strong>
                  </p>
                </div>
              </div>
              <div className="modal-metric-badge">
                <selectedCaseStudy.metricIcon size={16} />
                <span>{selectedCaseStudy.metric}</span>
              </div>
            </div>

            <div className="modal-body">
              <h4 className="modal-study-title">{selectedCaseStudy.caseStudy.title}</h4>

              <div className="modal-section">
                <span className="modal-label">The Challenge</span>
                <p className="modal-text">{selectedCaseStudy.caseStudy.challenge}</p>
              </div>

              <div className="modal-section">
                <span className="modal-label">The Solution</span>
                <p className="modal-text">{selectedCaseStudy.caseStudy.solution}</p>
              </div>

              <div className="modal-section">
                <span className="modal-label">Key Outcomes &amp; Impact</span>
                <ul className="modal-results-list">
                  {selectedCaseStudy.caseStudy.results.map((res, idx) => (
                    <li key={idx}>
                      <CheckCircle size={16} className="result-check-icon" />
                      <span>{res}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="modal-timeframe">
                <strong>Timeline:</strong> {selectedCaseStudy.caseStudy.timeframe}
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="modal-primary-btn"
                onClick={() => setSelectedCaseStudy(null)}
              >
                Close Story
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TestimonialsSection;
