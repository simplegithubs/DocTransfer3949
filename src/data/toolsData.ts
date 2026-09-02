export interface ToolMetadata {
  slug: string;
  name: string;
  tagline: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  category: 'fundraising' | 'legal' | 'security' | 'calculators';
  icon: string; // Lucide icon name
  popular?: boolean;
  estimatedTime: string;
  features: string[];
  ctaText: string;
  ctaRoute: string;
  faqs: { question: string; answer: string }[];
}

export const toolsList: ToolMetadata[] = [
  {
    slug: 'rent-agreement-generator',
    name: '11-Month Rent Agreement Online Maker (India)',
    tagline: 'Draft legally compliant 11-month residential and commercial rental agreements for Bangalore, Mumbai, Delhi & all Indian cities.',
    metaTitle: '11-Month Rent Agreement Online Maker (India) — Free PDF & E-Sign | DocTransfer',
    metaDescription: 'Create custom 11-month rental agreements online with state stamp duty calculations for Bangalore, Mumbai, Delhi, Hyderabad. Download PDF and tap to e-sign.',
    keywords: 'rent agreement generator online India, 11 month rent agreement format, rent agreement Bangalore, rental agreement Mumbai, rent agreement online maker free',
    category: 'legal',
    icon: 'FileCheck',
    popular: true,
    estimatedTime: '2 mins',
    features: [
      'Pre-formatted for Karnataka, Maharashtra, Delhi, Telangana & all Indian states',
      'Automatic Stamp Duty & Security Deposit calculation',
      'Includes mandatory lock-in period, maintenance & eviction clauses',
      'Download court-admissible PDF or share via WhatsApp for mobile e-signing'
    ],
    ctaText: 'Create Rent Agreement Free',
    ctaRoute: '/tools/rent-agreement-generator',
    faqs: [
      {
        question: 'Why are rental agreements in India typically drafted for 11 months?',
        answer: 'Under the Registration Act 1908 (Section 17), leases exceeding 11 months require mandatory government sub-registrar registration. An 11-month agreement on appropriate stamp paper is legally valid and binding under the Indian Contract Act 1872 without cumbersome sub-registrar visits.'
      },
      {
        question: 'Is an online e-signed rent agreement valid in Indian courts?',
        answer: 'Yes. E-signatures executed on rental agreements are legally enforceable under Section 5 and Section 10A of the Information Technology Act 2000 when accompanied by tamper-proof Section 65B electronic audit certificates.'
      },
      {
        question: 'How much stamp paper value is required for an 11-month lease?',
        answer: 'Stamp duty varies by state. In Karnataka, a ₹100 or ₹200 e-stamp is standard for 11-month leases; Maharashtra uses a 0.25% calculation; Delhi typically utilizes ₹100 e-stamp paper.'
      }
    ]
  },
  {
    slug: 'pitch-deck-analyzer',
    name: 'Free Pitch Deck Analyzer & Grader',
    tagline: 'Instant slide count, section analysis, and investor engagement score for your pitch deck.',
    metaTitle: 'Free Pitch Deck Analyzer & Grader (2026) — Check Your Deck | DocTransfer',
    metaDescription: 'Upload your pitch deck PDF for an instant 0–100 score on slide count, section completeness (Team, Financials, Traction), and investor reading time optimization.',
    keywords: 'pitch deck analyzer, pitch deck grader free, check pitch deck length, pitch deck feedback tool, pitch deck score, investor pitch deck check',
    category: 'fundraising',
    icon: 'FileSpreadsheet',
    popular: true,
    estimatedTime: '< 1 min',
    features: [
      'Automatic slide count evaluation against 10–14 slide benchmarks',
      'AI section detection (Team, Financials, Market, Traction, Solution)',
      'File size and mobile optimization audit',
      'Investor reading time prediction and actionable recommendations'
    ],
    ctaText: 'Analyze My Pitch Deck Free',
    ctaRoute: '/tools/pitch-deck-analyzer',
    faqs: [
      {
        question: 'How does the Pitch Deck Analyzer grade my deck?',
        answer: 'Our tool extracts text and metadata from your PDF client-side to evaluate slide count against our 12,847 pitch deck benchmark database. It checks for critical sections (Team, Financials, Market Size, Traction) and calculates an investor readiness score from 0 to 100.'
      },
      {
        question: 'Is my pitch deck kept confidential during analysis?',
        answer: 'Yes, 100%. All PDF processing happens locally in your browser using web standards. Your pitch deck is never uploaded to external server storage unless you explicitly choose to create a secure DocTransfer share link.'
      },
      {
        question: 'What is the ideal pitch deck slide length?',
        answer: 'According to our 2026 Pitch Deck Benchmarks report, the optimal length for funded pitch decks is 10 to 14 slides. Decks exceeding 20 slides experience a 34% drop-off rate among VC viewers.'
      }
    ]
  },
  {
    slug: 'nda-generator',
    name: 'Free Interactive NDA Generator',
    tagline: 'Create, customize, and download legally binding Mutual or Unilateral NDAs in 2 minutes.',
    metaTitle: 'Free NDA Generator — Create Non-Disclosure Agreement Online | DocTransfer',
    metaDescription: 'Generate customized Mutual (2-way) or Unilateral (1-way) Non-Disclosure Agreements for free. Download PDF instantly or send for digital e-signature.',
    keywords: 'free NDA generator, online NDA creator, create non-disclosure agreement free, mutual NDA builder, unilateral NDA maker, legal agreement generator',
    category: 'legal',
    icon: 'FileCheck',
    popular: true,
    estimatedTime: '2 mins',
    features: [
      'Build Mutual (2-way) or Unilateral (1-way) NDAs instantly',
      'Custom confidentiality period (1, 2, 3, or 5 years)',
      'US State & International jurisdiction selection',
      'Download clean PDF or send for instant e-signature'
    ],
    ctaText: 'Build Free NDA Now',
    ctaRoute: '/tools/nda-generator',
    faqs: [
      {
        question: 'Are the NDAs generated by DocTransfer legally binding?',
        answer: 'Yes. The generated NDAs incorporate standard commercial non-disclosure terms recognized across US state courts and international jurisdictions. When signed via DocTransfer e-signature, they comply with the ESIGN Act and eIDAS.'
      },
      {
        question: 'What is the difference between a Mutual and Unilateral NDA?',
        answer: 'A Unilateral NDA protects one disclosing party (e.g. hiring a freelancer), while a Mutual NDA protects both parties when sharing reciprocal trade secrets (e.g. strategic partnership or M&A due diligence).'
      }
    ]
  },
  {
    slug: 'vdr-cost-calculator',
    name: 'Virtual Data Room (VDR) ROI Calculator',
    tagline: 'Compare DocSend and enterprise VDR costs against DocTransfer and calculate your annual savings.',
    metaTitle: 'Virtual Data Room Cost & ROI Calculator — Compare VDR Pricing | DocTransfer',
    metaDescription: 'Calculate how much you can save by switching from DocSend, Firmex, or Datasite to DocTransfer. Interactive ROI slider for team seats and data rooms.',
    keywords: 'virtual data room pricing calculator, DocSend cost comparison, VDR ROI calculator, data room price comparison, cheap virtual data room',
    category: 'calculators',
    icon: 'Calculator',
    popular: false,
    estimatedTime: '30 secs',
    features: [
      'Interactive team seats & document volume sliders',
      'Direct pricing comparison against DocSend, Firmex, and Datasite',
      'Instant dollar & percentage annual savings breakdown',
      'Export ROI breakdown chart'
    ],
    ctaText: 'Calculate Savings',
    ctaRoute: '/tools/vdr-cost-calculator',
    faqs: [
      {
        question: 'How much does DocSend cost compared to DocTransfer?',
        answer: 'DocSend charges $45/user/month (Standard) to $150/user/month (Advanced) with strict seat limits. DocTransfer offers a 100% Free core plan and a $39/mo Business tier with unlimited document tracking.'
      },
      {
        question: 'Why are traditional VDRs so expensive?',
        answer: 'Legacy VDR providers (Datasite, Intralinks) charge per-page upload fees ($0.60–$1.00/page) and enterprise seat licensing, resulting in $1,000–$5,000+ monthly bills for simple M&A due diligence.'
      }
    ]
  },
  {
    slug: 'pdf-watermarking-tool',
    name: 'Free PDF Watermark Tool & Security Audit',
    tagline: 'Apply dynamic confidential text, recipient email, and date watermarks to your PDF files client-side.',
    metaTitle: 'Free PDF Watermark Tool — Add Confidential Watermarks Online | DocTransfer',
    metaDescription: 'Add custom dynamic text watermarks (Confidential, Recipient Email, Date) to your PDF files free online. 100% private browser-side processing.',
    keywords: 'add watermark to PDF free online, PDF security tool, confidential watermark generator, protect pitch deck watermark, pdf watermark maker',
    category: 'security',
    icon: 'ShieldCheck',
    popular: false,
    estimatedTime: '1 min',
    features: [
      'Custom watermark text, email, and timestamp overlays',
      'Adjustable opacity, rotation angle, font size, and color',
      '100% local client-side processing (PDF never leaves browser)',
      'Download watermarked PDF instantly'
    ],
    ctaText: 'Watermark PDF Free',
    ctaRoute: '/tools/pdf-watermarking-tool',
    faqs: [
      {
        question: 'Does this watermark tool upload my PDF to a server?',
        answer: 'No. The watermarking algorithm runs entirely inside your browser using client-side JavaScript (pdf-lib). Your document content stays 100% private.'
      },
      {
        question: 'Why should I watermark sensitive documents?',
        answer: 'Watermarking prevents unauthorized screenshot sharing and identifies leaks by linking shared copies to specific recipient names or timestamps.'
      }
    ]
  },
  {
    slug: 'esign-compliance-checker',
    name: 'Free ESIGN & eIDAS Legal Compliance Checker',
    tagline: 'Audit digital signature workflows against US ESIGN Act, UETA, and EU eIDAS statutory requirements.',
    metaTitle: 'Free ESIGN & eIDAS Compliance Checker (2026) | DocTransfer',
    metaDescription: 'Test your electronic signature workflow for court admissibility, tamper-evident seals, signer consent, and audit trail fidelity. 100% Free diagnostic.',
    keywords: 'esign act compliance checker, is electronic signature legal, ueta compliance test, eidas signature audit tool, digital signature validity check',
    category: 'legal',
    icon: 'Scale',
    popular: true,
    estimatedTime: '1 min',
    features: [
      'Interactive 5-point statutory requirement audit',
      'Instant legal admissibility rating (0–100%)',
      'Court-admissibility breakdown for US (ESIGN/UETA) and EU (eIDAS)',
      'Actionable recommendations to ensure tamper-proof enforceability'
    ],
    ctaText: 'Audit Signature Workflow Free',
    ctaRoute: '/tools/esign-compliance-checker',
    faqs: [
      {
        question: 'What makes an electronic signature legally binding?',
        answer: 'Under the US ESIGN Act and EU eIDAS, an e-signature is legally binding if it satisfies five core criteria: intent to sign, explicit consent to do business electronically, association of the signature with the record, attribution to the signer, and a tamper-evident audit trail.'
      },
      {
        question: 'Are DocTransfer electronic signatures legally compliant?',
        answer: 'Yes! DocTransfer complies with ESIGN, UETA, and EU eIDAS regulations, generating SHA-256 cryptographic hashes, timestamped audit logs, and IP verification certificates for every document.'
      }
    ]
  },
  {
    slug: 'due-diligence-scorecard',
    name: 'Investor Due Diligence Readiness Scorecard',
    tagline: 'Evaluate your startup data room readiness across 6 key venture audit categories.',
    metaTitle: 'Startup Due Diligence Readiness Scorecard (2026) | DocTransfer',
    metaDescription: 'Interactive diagnostic tool to score your data room completeness for Seed, Series A, or M&A. Check Cap Table, IP Assignment, Financials & Contracts.',
    keywords: 'due diligence readiness scorecard, startup due diligence checklist, virtual data room readiness, series a due diligence audit, investor data room grader',
    category: 'fundraising',
    icon: 'FolderCheck',
    popular: true,
    estimatedTime: '2 mins',
    features: [
      '6-pillar startup diligence evaluation (Corporate, IP, Financials, Team, Legal, Tech)',
      'Instant readiness score out of 100 with category grading',
      'Missing document alerts that prevent closing delays',
      '1-click export to structured DocTransfer Data Room structure'
    ],
    ctaText: 'Check Diligence Readiness',
    ctaRoute: '/tools/due-diligence-scorecard',
    faqs: [
      {
        question: 'What documents are required for venture due diligence?',
        answer: 'Investors typically require Articles of Incorporation, Cap Table, 83(b) elections, IP Assignment Agreements (CIIA), historical financial models, customer contracts, material vendor agreements, and employee offer letters.'
      },
      {
        question: 'How does DocTransfer accelerate due diligence?',
        answer: 'DocTransfer provides instant folder structures, zero-knowledge encryption, dynamic watermarking with viewer email stamps, and page-by-page analytics to see which investors review which diligence files.'
      }
    ]
  },
  {
    slug: 'pdf-encryption-tool',
    name: 'Client-Side PDF Encryptor & Password Shield',
    tagline: 'Encrypt sensitive PDF files locally in your browser with AES-256 before sharing.',
    metaTitle: 'Free Client-Side PDF Encryption Tool (AES-256) | DocTransfer',
    metaDescription: 'Encrypt sensitive documents directly inside your browser with AES-256 encryption. Zero server upload, maximum privacy, instant download.',
    keywords: 'encrypt pdf online free, client side pdf encryptor, browser pdf password protection, aes 256 pdf encryption tool, zero knowledge file encryptor',
    category: 'security',
    icon: 'Lock',
    popular: false,
    estimatedTime: '< 1 min',
    features: [
      '100% Client-side AES-256 encryption using Web Crypto API',
      'Zero server upload — files never touch an external network',
      'Custom password protection and high-entropy key generator',
      'Direct integration with DocTransfer zero-knowledge sharing'
    ],
    ctaText: 'Encrypt PDF Now',
    ctaRoute: '/tools/pdf-encryption-tool',
    faqs: [
      {
        question: 'Is client-side PDF encryption safe?',
        answer: 'Yes! Client-side encryption ensures that encryption keys and raw file bytes never leave your browser memory. Even if your network connection is intercepted, the data remains unreadable without the secret key.'
      },
      {
        question: 'Can DocTransfer read my encrypted files?',
        answer: 'No. DocTransfer operates on a zero-knowledge architecture, meaning our servers never have access to your decryption keys or unencrypted file contents.'
      }
    ]
  },
  {
    slug: 'reading-time-estimator',
    name: 'Document Reading Time & Drop-Off Estimator',
    tagline: 'Calculate investor reading duration and page drop-off risk for decks, proposals, and contracts.',
    metaTitle: 'Document Reading Time & Drop-Off Estimator (2026) | DocTransfer',
    metaDescription: 'Estimate reader attention span, average time spent per page, and drop-off risks for pitch decks, sales proposals, and contracts. 100% Free tool.',
    keywords: 'document reading time estimator, pitch deck duration calculator, contract reading time tool, investor dropoff predictor, sales proposal analytics',
    category: 'calculators',
    icon: 'Clock',
    popular: false,
    estimatedTime: '30 secs',
    features: [
      'Estimates total reading duration based on page count and content density',
      'Calculates slide-by-slide investor drop-off probability',
      'Provides actionable length recommendations for pitch decks and sales proposals',
      'Benchmarked against 12,000+ real-world document engagement records'
    ],
    ctaText: 'Estimate Reading Time',
    ctaRoute: '/tools/reading-time-estimator',
    faqs: [
      {
        question: 'How long do investors typically spend reading a pitch deck?',
        answer: 'According to industry benchmark data, the average VC spends only 2 minutes and 42 seconds reviewing a pitch deck before making an initial pass/meet decision.'
      },
      {
        question: 'How can I measure the actual time people spend on my documents?',
        answer: 'DocTransfer provides second-by-second viewer telemetry, showing you exactly which pages were viewed, how many seconds were spent on each slide, and where readers stopped.'
      }
    ]
  }
];

export function getToolBySlug(slug: string): ToolMetadata | undefined {
  return toolsList.find(t => t.slug === slug);
}
