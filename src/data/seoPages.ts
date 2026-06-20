export type SEOCategory = 'alternatives' | 'comparisons' | 'templates' | 'how-to' | 'industry' | 'gen-z';

export interface BaseSEOPageData {
  slug: string;
  category: SEOCategory;
  title: string;
  metaTitle: string;
  description: string;
  keywords: string;
  relatedSlugs: string[];
  imageUrl?: string;
  imageAlt?: string;
  externalLinks?: { label: string; url: string }[];
  bodySections?: { title: string; text: string }[];
  faqs?: { question: string; answer: string }[];
}

export interface AlternativeItem {
  name: string;
  pricing: string;
  highlightBenefit?: string;
  isFirst: boolean;
  description: string;
}

export interface AlternativePageData extends BaseSEOPageData {
  category: 'alternatives';
  competitorName: string;
  valueProp: string;
  comparisonFeatures: {
    feature: string;
    docTransfer: string | boolean;
    competitor: string | boolean;
  }[];
  pricingDocTransfer?: string;
  pricingCompetitor?: string;
  migrationSteps?: { stepNumber: number; title: string; description: string }[];
  verdict: string;
  alternativesList?: AlternativeItem[];
}

export interface ComparisonPageData extends BaseSEOPageData {
  category: 'comparisons';
  competitorName: string;
  overview: string;
  sideBySideTable: {
    capability: string;
    docTransferVal: string;
    competitorVal: string;
  }[];
  prosCons: {
    docTransferPros: string[];
    docTransferCons: string[];
    competitorPros: string[];
    competitorCons: string[];
  };
  verdict: string;
  matrix: {
    feature: string;
    docTransfer: boolean;
    competitor: boolean;
    notes: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

export interface TemplatePageData extends BaseSEOPageData {
  category: 'templates';
  templateName: string;
  estimatedTime: string;
  whatsIncluded: string[];
  usageSteps: string[];
  clauses: {
    title: string;
    text: string;
  }[];
}

export interface HowToPageData extends BaseSEOPageData {
  category: 'how-to';
  howToTitle: string;
  steps: {
    stepNumber: number;
    title: string;
    description: string;
  }[];
  benefits: string[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

export interface IndustryPageData extends BaseSEOPageData {
  category: 'industry';
  industryName: string;
  painPoints: string[];
  features: {
    title: string;
    description: string;
  }[];
  complianceNotes: string;
  stats: {
    value: string;
    label: string;
  }[];
}

export interface GenZPageData extends BaseSEOPageData {
  category: 'gen-z';
  tagline: string;
  headline: string;
  cards: {
    emoji: string;
    title: string;
    description: string;
  }[];
  socialProof: string;
}

export type SEOPageData =
  | AlternativePageData
  | ComparisonPageData
  | TemplatePageData
  | HowToPageData
  | IndustryPageData
  | GenZPageData;

const baseSEOPages: SEOPageData[] = [
  // ALTERNATIVES
  {
    slug: 'docusign-alternative',
    category: 'alternatives',
    title: 'Best Free DocuSign Alternative for Secure E-Signing',
    metaTitle: 'Best Free DocuSign Alternative - Sign Documents Online | DocTransfer',
    description: 'Looking for a free DocuSign alternative? DocTransfer lets you fill, sign, track, and protect your contracts without paying expensive monthly fees.',
    keywords: 'DocuSign alternative, free e-signature, secure document signing, online signatures, sign documents free',
    relatedSlugs: ['pandadoc-alternative', 'docusign-vs-doctransfer', 'sign-contract-online'],
    competitorName: 'DocuSign',
    valueProp: 'A simpler, more secure, and completely cost-effective way to get documents signed.',
    comparisonFeatures: [
      { feature: 'Free Tier', docTransfer: '100% Free with Full Features', competitor: 'Very Limited Trial Only' },
      { feature: 'E-Signatures', docTransfer: true, competitor: true },
      { feature: 'Dynamic View Tracking', docTransfer: 'Included Free', competitor: 'Only on high-tier Enterprise' },
      { feature: 'End-to-End Encryption', docTransfer: 'AES-256-GCM E2EE', competitor: 'Standard Server-side' },
      { feature: 'Sender Verification', docTransfer: 'SMS & Email Multi-Factor', competitor: 'Paid Add-on' },
      { feature: 'Custom Branding', docTransfer: 'Included Free', competitor: 'Standard on business tiers only' }
    ],
    pricingDocTransfer: 'Free Forever ($0/mo) for core features, premium plan for custom data rooms',
    pricingCompetitor: 'Starts at $10/user/month (limited to 5 sends), Business Pro at $40/user/month',
    migrationSteps: [
      { stepNumber: 1, title: 'Export your documents', description: 'Download your active PDF templates and signing records from DocuSign.' },
      { stepNumber: 2, title: 'Import templates into DocTransfer', description: 'Upload your PDFs directly to your DocTransfer templates library.' },
      { stepNumber: 3, title: 'Set up signers', description: 'Re-assign fields and add signature boxes using our drag-and-drop studio.' },
      { stepNumber: 4, title: 'Send securely', description: 'Distribute signature links with instant tracking and AES-256 encryption enabled.' }
    ] as any, // mapping structure compatibility if needed, we'll keep it simple
    verdict: 'DocuSign is a legacy tool with heavy sales cycles and expensive tiers. DocTransfer offers the same legal validity, enhanced E2E security, and real-time page tracking—completely free for core signing workflows.'
  },
  {
    slug: 'pandadoc-alternative',
    category: 'alternatives',
    title: 'Modern PandaDoc Alternative for Beautiful Proposals & Signatures',
    metaTitle: 'Free PandaDoc Alternative - Proposal Builder & E-Sign | DocTransfer',
    description: 'Need a PandaDoc alternative? Build proposal templates, add e-signatures, and track recipient views page-by-page. Save hundreds of dollars monthly.',
    keywords: 'PandaDoc alternative, free proposal creator, document tracking, sign contracts online, contract management',
    relatedSlugs: ['docusign-alternative', 'docusign-vs-doctransfer', 'sign-contract-online'],
    competitorName: 'PandaDoc',
    valueProp: 'Beautiful proposal templates, interactive form fields, and bulletproof security without the high price tag.',
    comparisonFeatures: [
      { feature: 'Interactive Templates', docTransfer: 'Drag-and-Drop Studio', competitor: 'Template Builder' },
      { feature: 'Real-time View Tracking', docTransfer: 'Page-by-page analytics', competitor: 'Basic open status' },
      { feature: 'Security Standards', docTransfer: 'Zero-Knowledge E2EE Support', competitor: 'Standard Cloud Security' },
      { feature: 'Branding Controls', docTransfer: 'Fully customizable', competitor: 'Paid feature only' },
      { feature: 'Cost per Seat', docTransfer: '$0 / Free tier available', competitor: 'Starts at $19/user/month' }
    ],
    pricingDocTransfer: 'Free Core Tier, Premium at $15/user/month for advanced DRM controls',
    pricingCompetitor: 'Starts at $19/user/month (annual prepay), scaling to $49/user/month for API',
    migrationSteps: [
      { stepNumber: 1, title: 'Save your PandaDoc drafts', description: 'Download your files as PDFs or copy contract text.' },
      { stepNumber: 2, title: 'Create new DocTransfer templates', description: 'Paste clauses into our Template Studio or upload PDFs.' },
      { stepNumber: 3, title: 'Design your variables', description: 'Set up dynamic variables for names, values, and signing dates.' },
      { stepNumber: 4, title: 'Share and close deals', description: 'Get signatures with instant recipient analytics and tracking.' }
    ] as any,
    verdict: 'PandaDoc is powerful for document creation but locks key custom branding and deep analytics behind expensive team tiers. DocTransfer gives you full analytics, unlimited signing, and custom branding from day one.'
  },

  // COMPARISONS
  {
    slug: 'docusign-vs-doctransfer',
    category: 'comparisons',
    title: 'DocuSign vs DocTransfer: The Detailed Security & Cost Comparison',
    metaTitle: 'DocuSign vs DocTransfer: Security, Features & Pricing Compared | DocTransfer',
    description: 'Compare DocuSign and DocTransfer. Learn how DocTransfer outperforms legacy e-signature tools in document security, page tracking, and affordability.',
    keywords: 'DocuSign vs DocTransfer, contract signature comparison, secure document sharing, e-signature pricing comparison',
    relatedSlugs: ['docusign-alternative', 'pandadoc-alternative', 'sign-contract-online'],
    competitorName: 'DocuSign',
    overview: 'DocuSign is the market pioneer, but its legacy infrastructure makes it bloated and expensive. DocTransfer was built with a security-first approach, offering zero-knowledge encryption alongside page-level engagement tracking, optimized for modern remote businesses.',
    sideBySideTable: [
      { capability: 'Pricing', docTransferVal: 'Free Core tier, Premium at $15/user/month', competitorVal: 'Starts at $10/user/month (limited to 5 sends)' },
      { capability: 'Core Features', docTransferVal: 'Unlimited signatures, E2EE, page-level tracking', competitorVal: 'E-signatures, basic audit trails' },
      { capability: 'Integrations', docTransferVal: 'Google Drive, Supabase, PDF-lib', competitorVal: 'Salesforce, Microsoft Office, Google Workspace' }
    ],
    prosCons: {
      docTransferPros: ['Free core tier', 'Zero-knowledge E2EE security', 'Page-level read tracking analytics'],
      docTransferCons: ['Fewer legacy enterprise integrations', 'Smaller brand recognition compared to pioneer'],
      competitorPros: ['Massive brand recognition', 'Extensive ecosystem of pre-built CRM integrations'],
      competitorCons: ['Very expensive pricing plans', 'No end-to-end encryption or page-level tracking']
    },
    verdict: 'Best for Legal Teams requiring rigorous document protection and page-level clause tracking without the bloat of expensive seat licenses.',
    matrix: [
      { feature: 'eIDAS & ESIGN Compliance', docTransfer: true, competitor: true, notes: 'Both provide full legal validity globally.' },
      { feature: 'End-to-End Encryption (E2EE)', docTransfer: true, competitor: false, notes: 'DocuSign holds the keys; DocTransfer offers client-side keys.' },
      { feature: 'Recipient Page Tracking', docTransfer: true, competitor: false, notes: 'DocTransfer lets you see how long signers spend on each clause.' },
      { feature: 'SMS / Email Verification', docTransfer: true, competitor: true, notes: 'DocuSign charges extra credits; DocTransfer includes basic verification.' },
      { feature: 'Free Document Templates', docTransfer: true, competitor: false, notes: 'DocuSign template sharing is heavily restricted on free tiers.' }
    ],
    faqs: [
      { question: 'Is DocTransfer as legal as DocuSign?', answer: 'Yes. DocTransfer conforms to both the United States ESIGN Act and European Union eIDAS regulations. Signatures created on DocTransfer are legally binding and admissible in court.' },
      { question: 'Why does DocTransfer offer a free tier when DocuSign does not?', answer: 'We believe secure communication and basic contract signing should be accessible to everyone. We monetize via advanced enterprise features, virtual data rooms, and custom compliance environments, leaving core signatures free.' },
      { question: 'How does the tracking feature help close deals?', answer: 'It shows you exactly when a recipient opened the document and which pages they studied. If a client spends 5 minutes on the "Termination" clause, you know exactly what to discuss during follow-up calls.' }
    ]
  },
  {
    slug: 'pandadoc-vs-doctransfer',
    category: 'comparisons',
    title: 'PandaDoc vs DocTransfer: Features, Pricing, Reviews',
    metaTitle: 'PandaDoc vs DocTransfer: Features, Pricing & Reviews Compared | DocTransfer',
    description: 'Compare PandaDoc and DocTransfer side-by-side. Discover how DocTransfer offers better page-by-page analytics, branding control, and zero-knowledge encryption.',
    keywords: 'PandaDoc vs DocTransfer, proposal builder alternative, document analytics comparison, e-sign proposal pricing',
    relatedSlugs: ['pandadoc-alternative', 'docusign-alternative', 'sign-contract-online'],
    competitorName: 'PandaDoc',
    overview: 'PandaDoc is widely known for proposal building and document editing, but its price tag scales rapidly with custom branding and team integrations. DocTransfer focuses on high-speed page-by-page recipient analytics and secure end-to-end encryption.',
    sideBySideTable: [
      { capability: 'Pricing', docTransferVal: 'Free Core tier, Premium at $15/user/month', competitorVal: 'Starts at $19/user/month (annual prepay)' },
      { capability: 'Core Features', docTransferVal: 'Dynamic template editor, view tracking, eIDAS signatures', competitorVal: 'Proposal builder, document editor, basic signatures' },
      { capability: 'Integrations', docTransferVal: 'Google Drive, Supabase, Clerk', competitorVal: 'Salesforce, HubSpot, Stripe, QuickBooks' }
    ],
    prosCons: {
      docTransferPros: ['Zero-Knowledge E2EE Support', 'Page-by-page read time analytics', 'Full branding controls on free tier'],
      docTransferCons: ['Lacks built-in billing/payment gateway integrations', 'Fewer CRM connectors'],
      competitorPros: ['Rich document editor with drag-and-drop elements', 'Built-in catalog and pricing list features'],
      competitorCons: ['Advanced branding locked behind high tiers', 'No zero-knowledge client-side encryption options']
    },
    verdict: 'Best for Sales & Account Management Teams who want clear visibility into how prospects review proposals and agreements before signing.',
    matrix: [
      { feature: 'eIDAS & ESIGN Compliance', docTransfer: true, competitor: true, notes: 'Both platforms offer standard digital signature validity.' },
      { feature: 'Page-level Read Analytics', docTransfer: true, competitor: false, notes: 'DocTransfer tells you how many seconds are spent on each page.' },
      { feature: 'Zero-knowledge E2EE Support', docTransfer: true, competitor: false, notes: 'DocTransfer supports client-side encryption keys.' },
      { feature: 'White-Label Branding', docTransfer: true, competitor: false, notes: 'PandaDoc restricts custom branding to higher-tier enterprise packages.' }
    ],
    faqs: [
      { question: 'Does DocTransfer support custom branding?', answer: 'Yes. DocTransfer includes full control over company logos, custom styles, and colors on the free tier, whereas PandaDoc restricts these to high-tier subscriptions.' },
      { question: 'Can I track pitch decks with DocTransfer?', answer: 'Absolutely. DocTransfer lets you share pitch decks, proposals, or contracts, and tracks exactly which pages the recipient views and for how long.' }
    ]
  },
  {
    slug: 'adobe-sign-vs-doctransfer',
    category: 'comparisons',
    title: 'Adobe Sign vs DocTransfer: E-signature Comparison',
    metaTitle: 'Adobe Sign vs DocTransfer: E-signature Features & Pricing Compared | DocTransfer',
    description: 'Adobe Sign vs DocTransfer. Learn how DocTransfer outperforms legacy document signing tools with zero-knowledge E2EE and page tracking for free.',
    keywords: 'Adobe Sign vs DocTransfer, e-signature comparison, secure document signing, Adobe Sign alternative',
    relatedSlugs: ['docusign-alternative', 'pandadoc-alternative', 'sign-contract-online'],
    competitorName: 'Adobe Sign',
    overview: 'Adobe Sign has strong enterprise roots and PDF legacy, but it comes with a high licensing cost and legacy interface. DocTransfer offers a modern, secure, and completely free alternative for standard e-signing and page tracking.',
    sideBySideTable: [
      { capability: 'Pricing', docTransferVal: 'Free Core tier, Premium at $15/user/month', competitorVal: 'Starts at $13/user/month, scaling to enterprise tiers' },
      { capability: 'Core Features', docTransferVal: 'E-signatures, template library, audit trails, E2EE', competitorVal: 'Acrobat integration, e-signatures, form creation' },
      { capability: 'Integrations', docTransferVal: 'Google Drive, Supabase, Clerk, PDF-lib', competitorVal: 'Adobe Acrobat ecosystem, Microsoft, Workday' }
    ],
    prosCons: {
      docTransferPros: ['100% Free core features', 'E2EE zero-knowledge support', 'Detailed page view tracking'],
      docTransferCons: ['Lacks direct Acrobat native app integrations', 'Fewer pre-built ERP connectors'],
      competitorPros: ['Deep native integration with Adobe Acrobat PDF reader', 'Excellent enterprise compliance certifications'],
      competitorCons: ['High cost per user', 'Complex interface, no zero-knowledge encryption options']
    },
    verdict: 'Best for Remote Teams seeking legally-compliant digital signatures and secure file transfers without paying expensive licensing fees.',
    matrix: [
      { feature: 'eIDAS & ESIGN Compliance', docTransfer: true, competitor: true, notes: 'Both provide legally valid e-signatures globally.' },
      { feature: 'Zero-knowledge Encryption', docTransfer: true, competitor: false, notes: 'Adobe Sign stores keys server-side; DocTransfer allows zero-knowledge E2EE.' },
      { feature: 'Page-level Engagement Logs', docTransfer: true, competitor: false, notes: 'DocTransfer lets you see how long recipients read each section.' }
    ],
    faqs: [
      { question: 'Is Adobe Sign better for large enterprises?', answer: 'Adobe Sign has extensive ERP integrations that suit huge corporate ecosystems, but DocTransfer is significantly faster to deploy, simpler to use, and much more cost-effective.' },
      { question: 'Do I need Acrobat to sign documents?', answer: 'No. Both DocTransfer and Adobe Sign run directly in any standard mobile or desktop web browser without requiring external software.' }
    ]
  },
  {
    slug: 'airslate-vs-doctransfer',
    category: 'comparisons',
    title: 'AirSlate vs DocTransfer: Document Transfer Tools',
    metaTitle: 'AirSlate vs DocTransfer: Workflow & E-Sign Comparison | DocTransfer',
    description: 'Compare airSlate and DocTransfer. Learn why DocTransfer is preferred for secure, simple e-signatures and page analytics without complex workflow bots.',
    keywords: 'airSlate vs DocTransfer, document transfer tools, workflow automation alternative, secure e-signatures',
    relatedSlugs: ['docusign-alternative', 'pandadoc-alternative', 'legal-document-transfer'],
    competitorName: 'airSlate',
    overview: 'airSlate is a complex, multi-step no-code workflow automation suite that has a steep pricing model and learning curve. DocTransfer provides streamlined, secure file sharing, watermarking, page tracking, and e-signatures in a simple package.',
    sideBySideTable: [
      { capability: 'Pricing', docTransferVal: 'Free Core tier, Premium at $15/user/month', competitorVal: 'Starts at $36/user/month (annual prepay)' },
      { capability: 'Core Features', docTransferVal: 'Secure file transfer, e-signatures, E2EE, view logs', competitorVal: 'No-code workflow automation, web forms, contract management' },
      { capability: 'Integrations', docTransferVal: 'Google Drive, Supabase, Clerk, PDF-lib', competitorVal: 'Salesforce, SharePoint, NetSuite, Slack' }
    ],
    prosCons: {
      docTransferPros: ['Zero-knowledge E2EE support', 'Instant page-by-page recipient analytics', 'Completely free core tier'],
      docTransferCons: ['No complex no-code multi-step process automation', 'Smaller suite of web forms tools'],
      competitorPros: ['Extensive no-code bots and business process automation', 'Strong web form builders'],
      competitorCons: ['Extremely high entry pricing', 'Steep learning curve for basic signing workflows']
    },
    verdict: 'Best for Document Transfer & E-Signing workflows where speed, file security, and tracking are preferred over complex business process automation.',
    matrix: [
      { feature: 'E-signatures & Legal Compliance', docTransfer: true, competitor: true, notes: 'Both support legally binding e-signatures.' },
      { feature: 'Client-side E2E Encryption', docTransfer: true, competitor: false, notes: 'DocTransfer supports zero-knowledge files; airSlate relies on standard cloud security.' },
      { feature: 'Page View Analytics', docTransfer: true, competitor: false, notes: 'DocTransfer tracks recipient study habits page-by-page.' }
    ],
    faqs: [
      { question: 'When should I choose airSlate?', answer: 'Choose airSlate if you need complex multi-stage database integrations and no-code business process bots. Otherwise, DocTransfer is much easier, faster, and cheaper.' },
      { question: 'Is my data encrypted during transfer?', answer: 'Yes. Both secure transit via SSL/TLS. DocTransfer also offers vault encryption directly in the browser so even our servers cannot read it.' }
    ]
  },
  {
    slug: 'zoho-sign-vs-doctransfer',
    category: 'comparisons',
    title: 'Zoho Sign vs DocTransfer: Best for Small Business',
    metaTitle: 'Zoho Sign vs DocTransfer: Features, Pricing & Small Business Value | DocTransfer',
    description: 'Zoho Sign vs DocTransfer. Find out why DocTransfer is the best free alternative for small businesses looking for E2EE and view tracking analytics.',
    keywords: 'Zoho Sign vs DocTransfer, small business e-sign, free Zoho Sign alternative, secure document tracking',
    relatedSlugs: ['docusign-alternative', 'pandadoc-alternative', 'real-estate-contracts'],
    competitorName: 'Zoho Sign',
    overview: 'Zoho Sign is an affordable signing tool within the Zoho ecosystem, but lacks advanced E2E encryption and detailed recipient page analytics. DocTransfer provides robust security features and page tracking for free.',
    sideBySideTable: [
      { capability: 'Pricing', docTransferVal: 'Free Core tier, Premium at $15/user/month', competitorVal: 'Starts at $10/user/month, scaling to $20/user/month' },
      { capability: 'Core Features', docTransferVal: 'E-signatures, E2EE, watermarking, sitemaps', competitorVal: 'Zoho ecosystem e-signatures, custom templates, audit trail' },
      { capability: 'Integrations', docTransferVal: 'Google Drive, Supabase, Clerk, PDF-lib', competitorVal: 'Zoho suite (CRM, Books, Creator), Microsoft Teams' }
    ],
    prosCons: {
      docTransferPros: ['E2EE support', 'Recipient page-level viewing analytics', 'Completely free tier'],
      docTransferCons: ['Fewer integrations with business ecosystems like Zoho', 'No built-in tax calculation utilities'],
      competitorPros: ['Excellent native integrations for Zoho suite users', 'Affordable entry-level pricing for Zoho teams'],
      competitorCons: ['No zero-knowledge client-side encryption options', 'Fewer options for recipient analytics']
    },
    verdict: 'Best for Small Businesses who want zero-cost e-signatures, document watermarking, and tracking without lock-in to Zoho\'s suite.',
    matrix: [
      { feature: 'eIDAS & ESIGN Compliance', docTransfer: true, competitor: true, notes: 'Both provide globally recognized digital signatures.' },
      { feature: 'Page View Analytics', docTransfer: true, competitor: false, notes: 'DocTransfer tracks exact page views; Zoho Sign only tracks signature completion.' },
      { feature: 'Zero-Knowledge E2EE', docTransfer: true, competitor: false, notes: 'DocTransfer offers end-to-end client encrypted vaults.' }
    ],
    faqs: [
      { question: 'Is Zoho Sign cheaper than other competitors?', answer: 'Yes, Zoho Sign is relatively cheap compared to DocuSign, but DocTransfer is even more cost-effective as it is completely free for core e-signing.' },
      { question: 'Can I import documents from Google Drive?', answer: 'Yes. Both Zoho Sign and DocTransfer support importing files directly from Google Drive.' }
    ]
  },

  // HOW-TO
  {
    slug: 'sign-contract-online',
    category: 'how-to',
    title: 'How to Sign a Contract Online: Step-by-Step Security Guide',
    metaTitle: 'How to Sign a Contract Online - Secure & Legal Steps | DocTransfer',
    description: 'Learn the easiest and most secure way to sign contracts online. This step-by-step guide explains legal compliance, E2E encryption, and audit tracking.',
    keywords: 'sign contract online, how to e-sign document, digital contract signature, secure online contract signing',
    relatedSlugs: ['docusign-alternative', 'pandadoc-alternative', 'legal-document-transfer'],
    howToTitle: 'Signing Contracts Online Securely',
    steps: [
      { stepNumber: 1, title: 'Upload Your Contract Document', description: 'Log in to DocTransfer and upload your contract in PDF or Word format. The document is encrypted immediately.' },
      { stepNumber: 2, title: 'Identify and Add Signing Parties', description: 'Input the names and email addresses of the signatories. Choose their specific actions (sign, review, or copy).' },
      { stepNumber: 3, title: 'Place Signature & Text Fields', description: 'Drag signature boxes, date stamps, and initial fields to the exact positions required in the document.' },
      { stepNumber: 4, title: 'Configure Security & Send', description: 'Toggle client-side encryption keys, set expiration times, and send the secure link to the recipients.' },
      { stepNumber: 5, title: 'Track and Execute', description: 'Receive notifications when the recipient opens, reads, and signs. Both parties receive a secure, tamper-proof finalized PDF with audit signatures.' }
    ],
    benefits: [
      'Saves hours of printing, scanning, and mailing physical contracts.',
      'Complete audit trail containing timestamps, IPs, and email verification stamps.',
      'Enhanced security with AES-256-GCM encryption safeguarding sensitive terms.',
      'Zero-cost options for standard business agreements.'
    ],
    faqs: [
      { question: 'Is it safe to sign a contract online?', answer: 'Yes, provided you use an ESIGN compliant platform. DocTransfer uses cryptographic hashing to secure document signatures, ensuring that once signed, the contract cannot be altered without breaking the seal.' },
      { question: 'Can I sign documents on my mobile phone?', answer: 'Absolutely. DocTransfer is built for responsiveness, allowing you to draw or type your signature directly on your touchscreen device without downloading any app.' }
    ]
  },

  // INDUSTRY
  {
    slug: 'real-estate-contracts',
    category: 'industry',
    title: 'Real Estate Document Share & E-Signing - Speed Up Closings',
    metaTitle: 'Real Estate Document Share & e-Sign Solutions | DocTransfer',
    description: 'Accelerate real estate deal closings. Share lease agreements, purchase contracts, and disclosures securely with high-speed page-by-page tracking.',
    keywords: 'real estate contracts, sign leases online, close property deals, real estate document share, secure disclosures tracking',
    relatedSlugs: ['lease-agreement-template', 'rofr-template', 'legal-document-transfer'],
    industryName: 'Real Estate',
    painPoints: [
      'Slow response times on lease sign-offs causing vacant property losses.',
      'Lack of insight into whether buyers have actually read property disclosure packets.',
      'High transaction risks from unsecured document sharing and data leaks.'
    ],
    features: [
      { title: 'Instant Mobile e-Signatures', description: 'Tenants can sign leases in seconds on any mobile device immediately after touring a property.' },
      { title: 'Page-level Read Tracking', description: 'Verify exactly when buyers open disclosures and check which pages they inspected prior to final closing.' },
      { title: 'Secure Virtual Data Rooms', description: 'Store property deeds, financing proofs, and titles in encrypted, access-restricted data rooms.' }
    ],
    complianceNotes: 'Our platform meets local real estate commission guidelines and national ESIGN requirements, backing every transaction with a complete audit record.',
    stats: [
      { value: '48hr', label: 'Average time saved on lease signoffs' },
      { value: '100%', label: 'Compliance with state disclosure guidelines' },
      { value: '5x', label: 'Faster document returns vs paper signing' }
    ]
  },
  {
    slug: 'legal-document-transfer',
    category: 'industry',
    title: 'Secure Legal Document Transfer & Client Intake Workflows',
    metaTitle: 'Secure Legal Document Transfer & Case Management | DocTransfer',
    description: 'Ensure attorney-client privilege. Transfer legal files, intake sheets, and retainers under client-side E2E encryption and strict DRM access controls.',
    keywords: 'legal document transfer, secure attorney files, sign retainer online, legal E2EE sharing, compliance file transfer',
    relatedSlugs: ['sign-contract-online', 'real-estate-contracts', 'rofr-template'],
    industryName: 'Legal & Compliance',
    painPoints: [
      'Standard emails fail the strict encryption requirements for privileged attorney-client correspondence.',
      'Clients struggle with complex portal sign-ins, leading to delayed evidence submission.',
      'No control over documents after hitting "Send"—making retraction of accidental attachments impossible.'
    ],
    features: [
      { title: 'Zero-Knowledge E2EE Support', description: 'Encrypt sensitive depositions and cases client-side before they reach the cloud.' },
      { title: 'Self-Destructing Share Links', description: 'Set timers or download limits so files automatically wipe after a designated period.' },
      { title: 'Watermark Overlays & DRM', description: 'Apply dynamic client emails as background watermarks to prevent screenshot leaks of sensitive drafts.' }
    ],
    complianceNotes: 'DocTransfer assists law firms in remaining compliant with ABA Model Rule 1.6(c) regarding confidentiality of information, using industry-leading cryptographic implementations.',
    stats: [
      { value: '256-bit', label: 'AES Encryption strength on all transfers' },
      { value: 'Zero', label: 'Server access to end-to-end encrypted cases' },
      { value: '100%', label: 'Admissibility rate for audit trail logs' }
    ]
  },

  // GEN-Z
  {
    slug: 'document-transfer-startups',
    category: 'gen-z',
    title: 'The Modern Way Startups Move Pitch Decks & Get Paid',
    metaTitle: 'Startups, Ditch the PDF Bloat. Track Pitch Decks | DocTransfer',
    description: 'Stop sending blind email attachments. Track VC deck views, close seed rounds, sign founder agreements, and secure your IP with pure speed.',
    keywords: 'startups pitch deck tracking, secure file transfer founders, raise capital e-sign, mobile first document share',
    relatedSlugs: ['sign-contract-online', 'docusign-alternative', 'pandadoc-alternative'],
    tagline: 'Built for founders who move fast.',
    headline: 'No print-and-scan boomer energy. Just clean sharing.',
    cards: [
      { emoji: '⚡', title: 'VC Deck Tracking', description: 'Know exactly when partners open your pitch deck, which slides they shared, and how long they stayed on the financials page.' },
      { emoji: '🔒', title: 'AES-256 Lockbox', description: 'Keep founder vesting terms, cap tables, and legal agreements airtight. Nobody reads it but your circle.' },
      { emoji: '📱', title: 'Tap to Sign', description: 'Perfect UX designed for phones. Draw your signature or import keychains seamlessly. Zero app installs required.' },
      { emoji: '💸', title: 'Free Tier That Actually Works', description: 'Send contracts, collect signatures, and analyze metrics without credit cards or trial limitations.' }
    ],
    socialProof: 'Trusted by founders from Y Combinator, Techstars, and top startup hubs globally.'
  },

  // NEW ALTERNATIVES (PHASE 5)
  {
    slug: 'docusign-alternatives-legal',
    category: 'alternatives',
    title: '10 Best DocuSign Alternatives for Legal (2026)',
    metaTitle: '10 Best DocuSign Alternatives for Legal (2026) | DocTransfer',
    description: 'Compare the best legal-focused alternatives to DocuSign. Discover why E2EE encryption, dynamic watermarks, and zero-knowledge storage make DocTransfer #1.',
    keywords: 'docusign alternatives legal, law firm e-sign, legal document signing, attorney client privilege e-signature',
    relatedSlugs: ['docusign-alternative', 'legal-document-transfer', 'sign-contract-online'],
    competitorName: 'DocuSign',
    valueProp: 'Enterprise security, zero-knowledge client-side encryption, and strict legal compliance without high monthly licensing fees.',
    verdict: 'Best for Law Firms & In-house Legal counsel requiring absolute confidentiality and client-side encryption.',
    comparisonFeatures: [
      { feature: 'Client-Side E2EE', docTransfer: 'Included (Zero-Knowledge)', competitor: 'No (Server-side only)' },
      { feature: 'Audit Trail Authenticity', docTransfer: 'Cryptographically Seal-Locked', competitor: 'Standard digital seal' },
      { feature: 'Page-level Engagement Logs', docTransfer: 'Yes (Tracks reading seconds)', competitor: 'No' },
      { feature: 'E-Sign Legal Compliance', docTransfer: 'ESIGN, eIDAS, UETA', competitor: 'ESIGN, eIDAS, UETA' }
    ],
    alternativesList: [
      { name: 'DocTransfer', pricing: 'Free Forever / Enterprise VDR custom tier', highlightBenefit: 'Zero-knowledge E2E encryption and page-level read tracking', isFirst: true, description: 'Built from the ground up for absolute document security and privacy. Zero-knowledge vaults ensure that privileged legal agreements, evidence packets, and contracts remain unreadable to everyone but authorized parties.' },
      { name: 'DocuSign', pricing: 'Starts at $10/user/month (limited to 5 monthly sends)', isFirst: false, description: 'The legacy standard in e-signatures. Known for high pricing, heavy sales upsells, and lack of page-level viewing metrics or client-side encryption keys.' },
      { name: 'Adobe Sign', pricing: 'Starts at $13/user/month', isFirst: false, description: 'A robust enterprise contender with deep integrations into Adobe Acrobat Reader. Interface can feel bloated for simple client sign-offs.' },
      { name: 'PandaDoc', pricing: 'Starts at $19/user/month', isFirst: false, description: 'Useful for sales proposal builder layouts, but restricts custom client branding and templates to higher priced tiers.' },
      { name: 'Dropbox Sign (HelloSign)', pricing: 'Starts at $15/user/month', isFirst: false, description: 'A user-friendly, cloud-centric option integrated with Dropbox storage. Lacks legal-grade watermarks and zero-knowledge security.' },
      { name: 'SignNow', pricing: 'Starts at $8/user/month', isFirst: false, description: 'Affordable basic signing platform, but lacks advanced document sharing security and recipient interaction logs.' },
      { name: 'Zoho Sign', pricing: 'Starts at $10/user/month', isFirst: false, description: 'Affordable for users locked into Zoho’s CRM ecosystem. Poor features for zero-knowledge data room control.' },
      { name: 'airSlate', pricing: 'Starts at $36/user/month', isFirst: false, description: 'A massive workflow automation system. Heavily bloated and expensive for teams that just need simple, secure signing.' },
      { name: 'OneSpan Sign', pricing: 'Enterprise custom quote only', isFirst: false, description: 'Highly secure signature service used by banks, but comes with a complex enterprise onboarding and high licensing barriers.' },
      { name: 'Nitro Sign', pricing: 'Starts at $9.99/user/month', isFirst: false, description: 'A lightweight alternative focused on general corporate office environments, but lacks specific legal compliance wrappers.' }
    ]
  },
  {
    slug: 'pandadoc-alternatives-startups',
    category: 'alternatives',
    title: 'Top 15 PandaDoc Alternatives for Startups',
    metaTitle: 'Top 15 PandaDoc Alternatives for Startups (2026) | DocTransfer',
    description: 'Find the best startup-friendly PandaDoc alternatives. Learn how to track pitch decks, share cap tables, and collect e-signatures securely.',
    keywords: 'pandadoc alternatives startups, pitch deck tracking free, startup founder agreement, seed round sign online',
    relatedSlugs: ['pandadoc-alternative', 'docusign-alternative', 'document-transfer-startups'],
    competitorName: 'PandaDoc',
    valueProp: 'Dynamic VC pitch deck tracking, page-by-page viewing metrics, and free templates designed for startup founders.',
    verdict: 'Best for Founders raising seed/series rounds who want page-level VC read analytics and zero cost.',
    comparisonFeatures: [
      { feature: 'VC Deck Tracking', docTransfer: 'Included Free (Page-by-Page)', competitor: 'Basic open analytics only' },
      { feature: 'Cost per Seat', docTransfer: '$0 (Free core features)', competitor: 'Starts at $19/user/month' },
      { feature: 'Template Customization', docTransfer: 'Included Free', competitor: 'Restricted on cheaper tiers' }
    ],
    alternativesList: [
      { name: 'DocTransfer', pricing: 'Free Forever', highlightBenefit: 'VC deck tracking, page analytics, founder templates', isFirst: true, description: 'The absolute choice for startups. Track pitch decks with page-level read-time stats, secure vest agreements, and sign contracts completely for free.' },
      { name: 'PandaDoc', pricing: 'Starts at $19/user/month', isFirst: false, description: 'Excellent proposal editor but too expensive for pre-seed teams who need simple document tracking and custom branding.' },
      { name: 'DocSend', pricing: 'Starts at $10/user/month', isFirst: false, description: 'The standard for VC deck tracking, but lacks robust built-in e-signature options and cost-free options.' },
      { name: 'Better Proposals', pricing: 'Starts at $19/user/month', isFirst: false, description: 'Geared towards agencies creating custom client proposals; lacks startup founder template agreements.' },
      { name: 'Proposify', pricing: 'Starts at $35/user/month', isFirst: false, description: 'A highly customized proposal software, but too complex and expensive for early-stage teams.' },
      { name: 'GetAccept', pricing: 'Starts at $15/user/month', isFirst: false, description: 'Sales enablement platform with basic tracking, but requires high commitments and complex setup.' },
      { name: 'Qwilr', pricing: 'Starts at $35/user/month', isFirst: false, description: 'Turns documents into interactive webpages, but lacks direct PDF signing and standard contract features.' },
      { name: 'DocuSign', pricing: 'Starts at $10/user/month', isFirst: false, description: 'Pioneer brand but lacks pitch deck view metrics and is costly for bootstrapping startups.' },
      { name: 'Concord', pricing: 'Starts at $17/user/month', isFirst: false, description: 'Contract management software with basic collaboration, but restricts workflows on cheaper tiers.' },
      { name: 'Juro', pricing: 'Enterprise custom quote only', isFirst: false, description: 'AI-driven contract automation suited for scale-ups; cost-prohibitive for early founders.' },
      { name: 'Signwell', pricing: 'Starts at $8/user/month', isFirst: false, description: 'Simple, cheap signing utility, but lacks page-level view times and document sharing tracking.' },
      { name: 'Dropbox Sign', pricing: 'Starts at $15/user/month', isFirst: false, description: 'Standard digital signing utility integrated with Dropbox, but lacks engagement analytics.' },
      { name: 'Zoho Sign', pricing: 'Starts at $10/user/month', isFirst: false, description: 'Designed for teams already committed to the Zoho bundle; not optimized for venture pitches.' },
      { name: 'SignNow', pricing: 'Starts at $8/user/month', isFirst: false, description: 'Affordable signing app, but lacks presentation/deck analytics tools.' },
      { name: 'Adobe Sign', pricing: 'Starts at $13/user/month', isFirst: false, description: 'Legacy enterprise tool with strict seat limits and no startup analytics.' }
    ]
  },
  {
    slug: 'free-docusign-alternatives',
    category: 'alternatives',
    title: 'Best Free DocuSign Alternatives (No Credit Card)',
    metaTitle: 'Best Free DocuSign Alternatives (No Credit Card Required) | DocTransfer',
    description: 'Stop paying for DocuSign. Here are the top free alternatives with no credit card required, including unlimited signing and E2E encryption.',
    keywords: 'free docusign alternatives, e-sign free no credit card, unlimited free signatures, sign pdf free online',
    relatedSlugs: ['docusign-alternative', 'pandadoc-alternative', 'sign-contract-online'],
    competitorName: 'DocuSign',
    valueProp: 'Legally-binding e-signatures, audit logs, and secure sharing completely free, without any credit card commitments.',
    verdict: 'Best for Individuals & Bootstrapping Businesses seeking zero-cost, legally-compliant digital signatures.',
    comparisonFeatures: [
      { feature: 'Free Tier Limit', docTransfer: 'Unlimited Free Core Features', competitor: 'None (Paid only)' },
      { feature: 'Credit Card Needed', docTransfer: 'No', competitor: 'Yes (For trials)' },
      { feature: 'Template Library', docTransfer: 'Included Free', competitor: 'Locked behind business tiers' }
    ],
    alternativesList: [
      { name: 'DocTransfer', pricing: 'Free Forever', highlightBenefit: 'No credit card needed, unlimited signing, zero cost', isFirst: true, description: 'Stands out as the only platform offering unlimited legally-binding signatures, zero-knowledge encryption, and page-level analytics on a free-forever tier.' },
      { name: 'Signwell', pricing: 'Free plan (Limit 3 docs per month)', isFirst: false, description: 'A clean, simple alternative for casual signers, but the 3-document monthly limit is restrictive for active businesses.' },
      { name: 'SignRequest', pricing: 'Free trial only', isFirst: false, description: 'No longer offers a viable free plan; relies on short trial periods requiring cancellation.' },
      { name: 'HelloSign Free', pricing: 'Limited to 3 signatures/month', isFirst: false, description: 'Easy to use, but the monthly limit forces users to upgrade to their expensive plans quickly.' },
      { name: 'DocuSign Free Edition', pricing: 'Sign-only (cannot send documents)', isFirst: false, description: 'Allows you to sign documents sent to you by others, but you cannot upload and send your own files without paying.' },
      { name: 'PandaDoc Free', pricing: 'Signatures only (no custom templates)', isFirst: false, description: 'Allows simple uploads and signatures, but advanced variables, templates, and branding are locked.' },
      { name: 'Zoho Sign Free', pricing: 'Limited to 5 docs/month', isFirst: false, description: 'Basic e-signing for single users, but features like templates are restricted.' },
      { name: 'DigiSigner', pricing: '3 free documents/month', isFirst: false, description: 'A lightweight web signature tool; the low document count makes it unsuitable for growing teams.' },
      { name: 'SignNow Free Trial', pricing: '7-day trial only', isFirst: false, description: 'A powerful tool, but does not provide any persistent free tier.' },
      { name: 'PDF2Go E-Sign', pricing: 'Basic web tool (free with ads)', isFirst: false, description: 'A public web utility to add signatures to PDFs. Lacks compliance audit trails, security E2EE, and tracking.' }
    ]
  },
  {
    slug: 'enterprise-docusign-alternatives',
    category: 'alternatives',
    title: 'Enterprise DocuSign Alternatives (Fortune 500)',
    metaTitle: 'Enterprise DocuSign Alternatives (Fortune 500 Compliance) | DocTransfer',
    description: 'Compare top enterprise-grade alternatives to DocuSign. Discover how E2EE encryption, compliance logs, and virtual data rooms protect Fortune 500 files.',
    keywords: 'enterprise docusign alternatives, fortune 500 e-sign, secure virtual data room, enterprise document analytics',
    relatedSlugs: ['docusign-alternative', 'legal-document-transfer', 'real-estate-contracts'],
    competitorName: 'DocuSign',
    valueProp: 'Bank-grade zero-knowledge client-side encryption, custom DRM, and dedicated secure data rooms for large organizations.',
    verdict: 'Best for Corporations & Financial Institutions requiring rigorous compliance and client-controlled security keys.',
    comparisonFeatures: [
      { feature: 'Zero-Knowledge E2EE', docTransfer: 'Yes (Vault Mode)', competitor: 'No' },
      { feature: 'Dedicated Virtual Data Rooms', docTransfer: 'Included', competitor: 'Only via custom high-cost add-on' },
      { feature: 'Compliance Logs', docTransfer: 'Cryptographic Audit Trail', competitor: 'Standard System Logs' }
    ],
    alternativesList: [
      { name: 'DocTransfer', pricing: 'Free Core / Enterprise DRM Custom Tiers', highlightBenefit: 'Dedicated virtual data rooms, E2E client encryption, and audit logs', isFirst: true, description: 'The ultimate enterprise security choice. By offering Zero-Knowledge Vaults, DocTransfer ensures that sensitive corporate agreements, merger documentation, and IP remain secure.' },
      { name: 'OneSpan Sign', pricing: 'Custom enterprise quotes', isFirst: false, description: 'Widely used in regulated banking environments. High security, but requires complex custom deployment and has high licensing barriers.' },
      { name: 'Adobe Sign Enterprise', pricing: 'Starts at $24/user/month', isFirst: false, description: 'Integrates deeply with Microsoft enterprise applications and Adobe Acrobat. Lacks client-side encryption keys.' },
      { name: 'DocuSign Enterprise', pricing: 'Custom quotes', isFirst: false, description: 'The market leader, but pricing increases dramatically with advanced API calls, SSO integration, and bulk sends.' },
      { name: 'airSlate Enterprise', pricing: 'Starts at $50/user/month', isFirst: false, description: 'Excellent for complex corporate workflow automation, but has a steep learning curve.' },
      { name: 'Box Sign', pricing: 'Included in Box Business Suites', isFirst: false, description: 'A convenient add-on for existing Box cloud storage customers, but lacks specialized page-level tracking.' },
      { name: 'OpenText Core Signature', pricing: 'Enterprise quotes', isFirst: false, description: 'Suited for corporations already running OpenText content systems; lacks lightweight mobility.' },
      { name: 'Sertifi', pricing: 'Specialized corporate pricing', isFirst: false, description: 'Highly used in hospitality and travel ecosystems for deposit collection; not optimized for data rooms.' },
      { name: 'AssureSign', pricing: 'Custom enterprise tiers', isFirst: false, description: 'Acquired by Nintex, specialized in enterprise sales integrations, but lacks client-controlled keys.' },
      { name: 'Nitro Sign Enterprise', pricing: 'Custom quotes', isFirst: false, description: 'A corporate PDF and e-sign suite; useful for office licensing but lacks deep page-level analytics.' }
    ]
  },
  {
    slug: 'docusign-alternatives-gen-z',
    category: 'alternatives',
    title: 'DocuSign Alternatives for Gen Z (Easy & Cheap)',
    metaTitle: 'DocuSign Alternatives for Gen Z (Easy, Cheap & Mobile First) | DocTransfer',
    description: 'Ditch the print-and-scan boomer energy. Here are the easiest and cheapest DocuSign alternatives for Gen Z founders, creators, and freelancers.',
    keywords: 'docusign alternatives gen z, easy cheap e-sign, creator contract sign online, mobile first file transfer',
    relatedSlugs: ['docusign-alternative', 'pandadoc-alternative', 'document-transfer-startups'],
    competitorName: 'DocuSign',
    valueProp: 'A mobile-first, zero-setup, completely free e-signature tool designed for the modern creator economy.',
    verdict: 'Best for Freelancers, Creators, and Gen Z founders who move fast and want zero-setup mobile signing.',
    comparisonFeatures: [
      { feature: 'Mobile Usability', docTransfer: 'Mobile-optimized (Draw/Type Sign)', competitor: 'Complex desktop-first portal' },
      { feature: 'Setup Time', docTransfer: 'Instant (No install required)', competitor: 'Requires account creation to sign' },
      { feature: 'Cost', docTransfer: '$0 (Free forever core)', competitor: 'Starts at $10/month' }
    ],
    alternativesList: [
      { name: 'DocTransfer', pricing: 'Free Forever', highlightBenefit: 'Mobile-first design, instant tap-to-sign, zero cost', isFirst: true, description: 'Ditches the legacy corporate bloat. With instant mobile signing, zero-knowledge encryption, and a free-forever tier, it is built for creators.' },
      { name: 'Signwell', pricing: 'Starts at $8/month', isFirst: false, description: 'A lightweight and clean utility, but the free limits make it annoying for active gig workers.' },
      { name: 'SignNow', pricing: 'Starts at $8/month', isFirst: false, description: 'Cheap and functional, but the interface feels outdated and boring.' },
      { name: 'HelloSign', pricing: 'Starts at $15/month', isFirst: false, description: 'Now Dropbox Sign. Simple UI, but too expensive for freelancers starting out.' },
      { name: 'PandaDoc', pricing: 'Starts at $19/month', isFirst: false, description: 'Too many enterprise features and sales calls; too heavy for quick agreements.' },
      { name: 'Zoho Sign', pricing: 'Starts at $10/month', isFirst: false, description: 'A corporate layout that feels like old office software.' },
      { name: 'DocuSign', pricing: 'Starts at $10/month', isFirst: false, description: 'The absolute definition of print-and-scan boomer energy. Too expensive and slow.' },
      { name: 'Dropbox Sign', pricing: 'Starts at $15/month', isFirst: false, description: 'Standard signing app, but too plain and lacks modern mobile integrations.' },
      { name: 'Adobe Sign', pricing: 'Starts at $13/month', isFirst: false, description: 'Heavy desktop software heritage; feels like school assignment portals.' },
      { name: 'PDFfiller', pricing: 'Starts at $8/month', isFirst: false, description: 'Good for filling out old scan forms, but too cluttered and slow for modern mobile users.' }
    ]
  }
];

import { seoExpandedContent } from './seoExpandedContent';
import { alternativesGroup } from './seo-pages/alternativesGroup';
import { comparisonsGroup } from './seo-pages/comparisonsGroup';
import { industryGroup } from './seo-pages/industryGroup';
import { howtoGroup } from './seo-pages/howtoGroup';
import { genzGroup } from './seo-pages/genzGroup';

export const allSEOPages: SEOPageData[] = [
  ...baseSEOPages.map(page => {
    const expanded = seoExpandedContent[page.slug];
    if (expanded) {
      return {
        ...page,
        imageUrl: expanded.imageUrl,
        imageAlt: expanded.imageAlt,
        externalLinks: expanded.externalLinks,
        bodySections: expanded.bodySections,
        faqs: expanded.faqs
      } as SEOPageData;
    }
    return page;
  }),
  ...alternativesGroup,
  ...comparisonsGroup,
  ...industryGroup,
  ...howtoGroup,
  ...genzGroup
];

export function getPageBySlug(category: SEOCategory, slug: string): SEOPageData | undefined {
  return allSEOPages.find(p => p.category === category && p.slug === slug);
}

export function getPagesByCategory(category: SEOCategory): SEOPageData[] {
  return allSEOPages.filter(p => p.category === category);
}

