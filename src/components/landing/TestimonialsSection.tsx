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
    id: 'elena-rostova',
    name: 'Elena Rostova',
    role: 'Partner & Deal Lead',
    company: 'Horizon Capital',
    category: 'vc',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    fallbackInitials: 'ER',
    quote: 'Pitch decks used to get forwarded to competitors without our knowledge. With DocTransfer’s dynamic watermarking and real-time alerts, we control every single view.',
    metric: '100% leak-proof deck distribution',
    metricIcon: Shield,
    caseStudy: {
      title: 'How Horizon Capital Eliminated Deal Memo Leaks Across 40+ Portfolio Deals',
      challenge: 'Confidential investment memos and cap tables were frequently shared outside authorized investor syndicate circles without audit trails.',
      solution: 'Implemented DocTransfer dynamic recipient watermarking, email verification gates, and instant remote link revocation.',
      results: [
        'Zero unauthorized document leaks across 40+ investment rounds',
        'Real-time notifications whenever LP partners opened quarterly reports',
        'Complete forensic audit trails for SEC compliance records'
      ],
      timeframe: 'Over 18 months of active dealmaking'
    }
  },
  {
    id: 'marcus-chen',
    name: 'Marcus Chen',
    role: 'Founder & CEO',
    company: 'Novaflow AI',
    category: 'founders',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    fallbackInitials: 'MC',
    quote: 'Founders remember who got back to them first, but we also remember who actually read our deck. DocTransfer’s tracking helped us close our $14M Series A in 3 weeks.',
    metric: 'Closed $14M Series A in 3 wks',
    metricIcon: Zap,
    caseStudy: {
      title: 'Accelerating a Competitive $14M Series A with Page-by-Page Pitch Deck Analytics',
      challenge: 'Founders had zero visibility into partner deck engagement and wasted critical pitch meetings guessing which slides investors cared about.',
      solution: 'Used DocTransfer to track page-by-page dwell time, jump rates, and forward activity across 35 tier-1 venture funds.',
      results: [
        'Identified high-conviction lead investors within 24 hours of deck dispatch',
        'Customized follow-up pitch meetings targeting the exact slides investors reviewed longest',
        'Secured 4 competing term sheets in 21 days'
      ],
      timeframe: '3-week fundraising cycle'
    }
  },
  {
    id: 'sarah-jenkins',
    name: 'Sarah Jenkins, Esq.',
    role: 'Managing Partner',
    company: 'Apex Legal Counsel',
    category: 'legal',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    fallbackInitials: 'SJ',
    quote: 'The built-in NDA gate and tamper-proof audit trails replaced three separate expensive SaaS subscriptions for our cross-border M&A transactions.',
    metric: '$45K/yr saved on legacy data rooms',
    metricIcon: FileText,
    caseStudy: {
      title: 'Streamlining $120M in Cross-Border M&A Due Diligence and E-Signatures',
      challenge: 'Legacy virtual data rooms cost tens of thousands per deal, had clumsy user interfaces, and required disconnected e-signature tools.',
      solution: 'Standardized client deal rooms on DocTransfer with automated NDA gates, role-based download controls, and legally binding e-signatures.',
      results: [
        'Reduced client data room setup time from 3 days to under 10 minutes',
        'Saved over $45,000 annually compared to traditional legacy data room providers',
        'Accelerated transaction sign-off velocity by 60%'
      ],
      timeframe: 'Across 14 M&A transactions'
    }
  },
  {
    id: 'viraj-ala',
    name: 'Viraj Ala',
    role: 'Creative Director & Producer',
    company: 'StudioKinetix',
    category: 'creative',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    fallbackInitials: 'VA',
    quote: 'I can’t have an interview with a billionaire or a film treatment leak because of an unsecured attachment. DocTransfer makes sure nothing slips.',
    metric: '500+ secure creative transfers',
    metricIcon: Film,
    caseStudy: {
      title: 'Protecting Unreleased Creative Treatments & High-Stakes Talent Proposals',
      challenge: 'High-profile commercial video treatments and sensitive celebrity interview briefs were vulnerable to unauthorized downloads and forwarding.',
      solution: 'Deployed DocTransfer’s ‘Burn After Reading’ links, DRM view-only mode, and automated time-based access expiration.',
      results: [
        '100% confidential delivery of unreleased scripts and storyboard decks',
        'Automated document self-destruct after verified client review',
        'Zero leaks across 500+ high-profile creative productions'
      ],
      timeframe: 'Over 2 years of studio productions'
    }
  },
  {
    id: 'amara-okafor',
    name: 'Amara Okafor',
    role: 'Head of Information Security',
    company: 'CloudScale Global',
    category: 'security',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&auto=format&fit=crop&q=80',
    fallbackInitials: 'AO',
    quote: 'Zero-knowledge client-side encryption and instant remote access revocation made compliance approval effortless across our international deal teams.',
    metric: 'SOC-2 & HIPAA audit ready',
    metricIcon: Lock,
    caseStudy: {
      title: 'Enterprise-Wide Zero-Knowledge Document Governance & Instant Revocation',
      challenge: 'Strict HIPAA and SOC-2 requirements required that enterprise data never rest unencrypted on third-party cloud infrastructure.',
      solution: 'Adopted DocTransfer’s Vault Mode client-side AES-256-GCM encryption with granular IP and domain whitelisting.',
      results: [
        'Passed rigorous third-party SOC-2 Type II audit with zero findings',
        'Instant remote revocation of terminated contractor file access with one click',
        'Complete end-to-end zero-knowledge encryption verified directly in the browser'
      ],
      timeframe: 'Global enterprise rollout to 1,200+ employees'
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
