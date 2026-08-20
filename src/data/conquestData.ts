export interface ConquestPage {
  slug: string;
  title: string;
  headline: string;
  subheadline: string;
  category: 'pricing' | 'features' | 'audiences' | 'migration' | 'triangulation';
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  heroGradient: string;
  icon: string;
  docsendLimitations: { title: string; description: string }[];
  comparisonMatrix: { feature: string; docsend?: string; doctransfer: string; pandadoc?: string; notion?: string; googleDrive?: string; [key: string]: any }[];
  keyBenefits: { title: string; description: string; icon: string }[];
  relatedSolutions: { name: string; slug: string }[];
  relatedTools: { name: string; slug: string }[];
  relatedGlossary: { name: string; slug: string }[];
  relatedIntegrations: { name: string; slug: string }[];
  faqs: { question: string; answer: string }[];
}

export const conquestData: ConquestPage[] = [
  {
    slug: 'pricing',
    title: 'DocSend Pricing Breakdown & Free Alternative (2026)',
    headline: 'Tired of Unexpected DocSend Price Hikes?',
    subheadline: 'Compare DocSend pricing tiers against DocTransfer. Get unlimited document tracking, page-level analytics, and e-signatures for $0.',
    category: 'pricing',
    metaTitle: 'DocSend Pricing 2026: Plans, Price Increases & Free Alternative',
    metaDescription: 'Complete breakdown of DocSend pricing plans ($15 to $150+/mo). Learn why teams are switching to DocTransfer for free unlimited tracking.',
    keywords: 'docsend pricing 2026, docsend cost per user, docsend price increase, free docsend alternative, cheap docsend competitor',
    heroGradient: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)',
    icon: 'DollarSign',
    docsendLimitations: [
      { title: 'Strict Per-User Seat Limits', description: 'DocSend charges $15 to $150+ per user per month with strict seat caps and expensive add-ons.' },
      { title: 'Gated Essential Security Features', description: 'Advanced features like watermarking and domain restrictions require upgrading to top-tier enterprise plans.' },
      { title: 'No Free Plan', description: 'DocSend offers only a brief trial before forcing users onto expensive monthly subscriptions.' }
    ],
    comparisonMatrix: [
      { feature: 'Core Plan Price', docsend: '$15 - $150 / user / mo', doctransfer: '$0 (100% Free Tier)' },
      { feature: 'Tracked Document Limit', docsend: 'Restricted by plan', doctransfer: 'Unlimited' },
      { feature: 'Page Dwell Time Analytics', docsend: 'Included', doctransfer: 'Included' },
      { feature: 'Dynamic Watermarking', docsend: 'Advanced/Enterprise only', doctransfer: 'Included on all plans' },
      { feature: 'E-Signatures', docsend: 'Add-on fees apply', doctransfer: 'Built-in' }
    ],
    keyBenefits: [
      { title: '$0 Core Plan', description: 'Upload and track unlimited pitch decks and documents without spending a dime.', icon: 'Gift' },
      { title: 'No Hidden Seat Fees', description: 'Share documents across your entire team without paying per-user penalties.', icon: 'Users' },
      { title: 'Instant Migration', description: 'Switch from DocSend in under 2 minutes with simple drag-and-drop import.', icon: 'Zap' }
    ],
    relatedSolutions: [{ name: 'Fundraising', slug: 'fundraising' }, { name: 'Startups', slug: 'startups' }],
    relatedTools: [{ name: 'VDR Cost Calculator', slug: 'vdr-cost-calculator' }],
    relatedGlossary: [{ name: 'Virtual Data Room (VDR)', slug: 'virtual-data-room' }],
    relatedIntegrations: [{ name: 'Google Drive', slug: 'google-drive' }],
    faqs: [
      { question: 'Why is DocTransfer cheaper than DocSend?', answer: 'We engineered a cloud-native architecture that drastically reduces infrastructure costs, allowing us to offer unlimited document tracking for free.' },
      { question: 'Does DocTransfer have a free trial or a true free plan?', answer: 'DocTransfer offers a 100% free plan forever — not just a temporary trial.' }
    ]
  },
  {
    slug: 'free',
    title: 'The Best Free DocSend Alternative — $0 Forever',
    headline: 'Stop Paying for Basic Document Analytics.',
    subheadline: 'DocTransfer offers a 100% free alternative to DocSend with slide-by-slide view analytics, dynamic watermarks, and e-signatures.',
    category: 'pricing',
    metaTitle: 'Best Free DocSend Alternative (2026) — Unlimited Tracking',
    metaDescription: 'Looking for a free alternative to DocSend? DocTransfer gives early-stage founders and sales teams free document tracking with zero catch.',
    keywords: 'free docsend alternative, is docsend free, docsend free tier, free pitch deck tracking, free document analytics',
    heroGradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
    icon: 'Gift',
    docsendLimitations: [
      { title: '14-Day Expiration', description: 'DocSend forces trial users to enter credit card details after 14 days or locks access.' },
      { title: 'Feature Gating', description: 'Free trials severely restrict slide analytics and watermark customizations.' },
      { title: 'Overcharging Early Startups', description: 'Early-stage founders burn precious runway paying for routine file links.' }
    ],
    comparisonMatrix: [
      { feature: 'Forever Free Plan', docsend: '❌ None (Trial only)', doctransfer: '✅ Yes ($0/mo forever)' },
      { feature: 'Page-Level Analytics', docsend: 'Limited in trial', doctransfer: '✅ Full per-page tracking' },
      { feature: 'Dynamic Watermarks', docsend: '❌ Paid Tier Only', doctransfer: '✅ Included Free' },
      { feature: 'Custom Access Expiration', docsend: 'Paid Tier Only', doctransfer: '✅ Included Free' }
    ],
    keyBenefits: [
      { title: 'Zero Credit Card Required', description: 'Start sharing tracked document links immediately without inputting credit card details.', icon: 'CheckCircle' },
      { title: 'Full Feature Access', description: 'Enjoy slide analytics, watermarks, and access controls completely free.', icon: 'Unlock' },
      { title: 'Preserve Startup Runway', description: 'Save $500 to $1,800 annually per user by switching to DocTransfer.', icon: 'TrendingUp' }
    ],
    relatedSolutions: [{ name: 'Startups', slug: 'startups' }, { name: 'Fundraising', slug: 'fundraising' }],
    relatedTools: [{ name: 'Pitch Deck Analyzer', slug: 'pitch-deck-analyzer' }],
    relatedGlossary: [{ name: 'Pitch Deck', slug: 'pitch-deck' }],
    relatedIntegrations: [{ name: 'Gmail', slug: 'gmail' }],
    faqs: [
      { question: 'Is DocTransfer really 100% free?', answer: 'Yes. Our core plan includes unlimited document uploads, page-level tracking, watermarking, and link expiration at $0.' }
    ]
  },
  {
    slug: 'page-analytics',
    title: 'DocSend Alternative with Advanced Page Analytics',
    headline: 'Deeper Viewer Insights Than DocSend.',
    subheadline: 'Understand exact reader behavior with page-level dwell time heatmaps, instant open alerts, and completion tracking.',
    category: 'features',
    metaTitle: 'DocSend Alternative for Page Analytics & Dwell Time | DocTransfer',
    metaDescription: 'Get deeper document analytics than DocSend. Track per-page viewing duration, slide completion rates, and viewer drop-offs.',
    keywords: 'docsend page analytics alternative, track slide viewing time, PDF dwell time analytics, pitch deck heatmaps',
    heroGradient: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    icon: 'BarChart2',
    docsendLimitations: [
      { title: 'Basic Dwell Charts', description: 'DocSend provides minimal visual breakdown of reader attention per slide.' },
      { title: 'Delayed Notification Alerts', description: 'Subtle delays in email alerts cause missed opportunities for timely prospect follow-ups.' },
      { title: 'Clunky Drop-Off Reports', description: 'Difficult to see where readers abandon your pitch deck or contract.' }
    ],
    comparisonMatrix: [
      { feature: 'Per-Slide Dwell Time', docsend: 'Basic', doctransfer: 'Granular Heatmap' },
      { feature: 'Real-Time Open Alerts', docsend: 'Email only', doctransfer: 'Slack, Email & Webhooks' },
      { feature: 'Slide Completion Rate', docsend: 'Basic', doctransfer: 'Comprehensive Percentage' },
      { feature: 'Forward Detection', docsend: 'Standard', doctransfer: 'Advanced IP & Device Fingerprinting' }
    ],
    keyBenefits: [
      { title: 'Instant Open Alerts', description: 'Get notified in Slack or email the exact second a decision-maker opens your file.', icon: 'Bell' },
      { title: 'Pinpoint Reader Drop-off', description: 'Discover which slides hold investor attention and which cause drop-offs.', icon: 'Eye' },
      { title: 'Actionable Sales Insights', description: 'Focus outreach on prospects who spent the most time reviewing your pricing page.', icon: 'Target' }
    ],
    relatedSolutions: [{ name: 'Sales', slug: 'sales' }, { name: 'Fundraising', slug: 'fundraising' }],
    relatedTools: [{ name: 'Pitch Deck Analyzer', slug: 'pitch-deck-analyzer' }],
    relatedGlossary: [{ name: 'Document Analytics', slug: 'document-analytics' }],
    relatedIntegrations: [{ name: 'Slack', slug: 'slack' }, { name: 'HubSpot', slug: 'hubspot' }],
    faqs: [
      { question: 'How accurate is DocTransfer page tracking?', answer: 'DocTransfer captures exact per-second viewing intervals per page rendered in the recipient web browser.' }
    ]
  },
  {
    slug: 'watermarking',
    title: 'DocSend Alternative with Dynamic Watermarking',
    headline: 'Stop Leaks Before They Happen.',
    subheadline: 'Protect confidential decks and files with viewer-specific dynamic watermarking (email, IP, date) rendered on every page.',
    category: 'features',
    metaTitle: 'DocSend Alternative with Dynamic Watermarking | DocTransfer',
    metaDescription: 'Looking for dynamic watermarking like DocSend without high tier prices? DocTransfer automatically overlays recipient email and IP.',
    keywords: 'docsend watermark alternative, dynamic watermarking PDF, anti-leak document watermark, protect pitch deck screenshots',
    heroGradient: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
    icon: 'ShieldAlert',
    docsendLimitations: [
      { title: 'Gated to Expensive Tiers', description: 'DocSend locks dynamic watermarking behind high-tier monthly packages.' },
      { title: 'Static Text Overlay', description: 'Limited customization options for viewer-specific security stamps.' },
      { title: 'No Free Watermarking', description: 'Early founders cannot watermark decks without upgrading.' }
    ],
    comparisonMatrix: [
      { feature: 'Dynamic Recipient Stamping', docsend: 'Advanced Plan Only ($150/mo)', doctransfer: '✅ Included Free ($0/mo)' },
      { feature: 'Custom Text & IP Stamp', docsend: 'Limited', doctransfer: '✅ Fully Customizable' },
      { feature: 'Screenshot Deterrence', docsend: 'Basic', doctransfer: '✅ High Contrast Stamping' }
    ],
    keyBenefits: [
      { title: 'Anti-Leak Guarantee', description: 'Discourage unauthorized sharing by stamping the viewer email on every slide.', icon: 'Shield' },
      { title: 'No Upgrade Penalty', description: 'Get enterprise-grade dynamic watermarks on the free tier.', icon: 'CheckCircle' },
      { title: 'One-Click Activation', description: 'Toggle watermarks on or off per shared link with a single click.', icon: 'Lock' }
    ],
    relatedSolutions: [{ name: 'M&A Deals', slug: 'mergers-acquisitions' }, { name: 'Legal Teams', slug: 'legal' }],
    relatedTools: [{ name: 'PDF Watermark Tool', slug: 'pdf-watermarking-tool' }],
    relatedGlossary: [{ name: 'Dynamic Watermarking', slug: 'dynamic-watermarking' }, { name: 'DRM', slug: 'drm' }],
    relatedIntegrations: [{ name: 'Google Drive', slug: 'google-drive' }],
    faqs: [
      { question: 'Can viewers remove DocTransfer dynamic watermarks?', answer: 'No. Watermarks are embedded directly into the document stream in real time.' }
    ]
  },
  {
    slug: 'e-signatures',
    title: 'DocSend Alternative with Built-In E-Signatures',
    headline: 'Track, View & Sign in One Unified Portal.',
    subheadline: 'Eliminate separate DocuSign subscriptions. Send contracts, NDAs, and proposals with legally binding e-signatures built in.',
    category: 'features',
    metaTitle: 'DocSend Alternative with E-Signatures | DocTransfer',
    metaDescription: 'Replace DocSend and DocuSign with one platform. Track viewer engagement and collect legally binding electronic signatures seamlessly.',
    keywords: 'docsend e-signature alternative, docsend replace docusign, built-in e-signature document tracking, legal digital signature',
    heroGradient: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
    icon: 'FileSignature',
    docsendLimitations: [
      { title: 'Fragmented One-Off Signature Tools', description: 'DocSend charges extra for signature add-ons or requires a separate DocuSign license.' },
      { title: 'Clunky Mobile Signing', description: 'Recipients struggle to complete document sign-offs on smartphone screens.' },
      { title: 'Separate Software Stacks', description: 'Managing document view links in DocSend and signature execution elsewhere.' }
    ],
    comparisonMatrix: [
      { feature: 'Built-in E-Signatures', docsend: 'Add-on / Extra Cost', doctransfer: '✅ Native Feature' },
      { feature: 'Audit Trail Certificate', docsend: 'Basic', doctransfer: '✅ Cryptographic PDF Certificate' },
      { feature: 'Mobile-Optimized Signing', docsend: 'Average', doctransfer: '✅ 100% Mobile Ready' },
      { feature: 'Combined View + Sign Flow', docsend: 'Separate steps', doctransfer: '✅ Single Seamless Link' }
    ],
    keyBenefits: [
      { title: 'Consolidate Tech Stack', description: 'Replace both DocSend and DocuSign with a single intuitive platform.', icon: 'Layers' },
      { title: 'Legal Compliance', description: 'Signatures comply with ESIGN Act, UETA, and eIDAS standards.', icon: 'Award' },
      { title: 'Automated Archiving', description: 'Signed contracts sync automatically to your cloud storage folders.', icon: 'Cloud' }
    ],
    relatedSolutions: [{ name: 'Real Estate', slug: 'real-estate' }, { name: 'Human Resources', slug: 'human-resources' }],
    relatedTools: [{ name: 'NDA Generator', slug: 'nda-generator' }],
    relatedGlossary: [{ name: 'Electronic Signature (E-Signature)', slug: 'electronic-signature' }, { name: 'Audit Trail', slug: 'audit-trail' }],
    relatedIntegrations: [{ name: 'Zapier', slug: 'zapier' }],
    faqs: [
      { question: 'Are e-signatures included on DocTransfer free plan?', answer: 'Yes! You can collect legally binding signatures without paying extra software fees.' }
    ]
  },
  {
    slug: 'data-rooms',
    title: 'DocSend Alternative with Free Virtual Data Rooms',
    headline: 'Build Deal Data Rooms Without Enterprise Pricing.',
    subheadline: 'Organize multi-folder due diligence vaults for M&A and fundraising with granular permissions and zero per-page fees.',
    category: 'features',
    metaTitle: 'DocSend Alternative for Virtual Data Rooms (VDR) | DocTransfer',
    metaDescription: 'Need a data room like DocSend without steep monthly fees? Build secure multi-folder data rooms with page analytics on DocTransfer.',
    keywords: 'docsend data room alternative, free virtual data room, docsend VDR alternative, M&A data room free, startup due diligence data room',
    heroGradient: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    icon: 'FolderPlus',
    docsendLimitations: [
      { title: 'Expensive Data Room Add-ons', description: 'DocSend charges steep monthly upgrades for multi-document data room spaces.' },
      { title: 'Rigid Folder Permissions', description: 'Difficult to manage different permission levels across multiple buyer or investor groups.' },
      { title: 'Complex Setup UI', description: 'Outdated, complicated admin dashboards that slow down deal prep.' }
    ],
    comparisonMatrix: [
      { feature: 'Multi-Folder Data Rooms', docsend: 'Paid Upgrade', doctransfer: '✅ Built-in Free' },
      { feature: 'Per-Page Charges', docsend: 'None', doctransfer: '✅ None ($0 Unlimited)' },
      { feature: 'Bulk File Upload', docsend: 'Standard', doctransfer: '✅ Fast Drag-and-Drop' },
      { feature: 'Access Revocation', docsend: 'Standard', doctransfer: '✅ Instant One-Click' }
    ],
    keyBenefits: [
      { title: 'Instant VDR Setup', description: 'Create a structured diligence data room for your startup in under 5 minutes.', icon: 'Clock' },
      { title: 'Granular Group Security', description: 'Assign custom access rights for lead investors, legal teams, and auditors.', icon: 'Shield' },
      { title: 'Save Thousands on Diligence', description: 'Avoid paying $1,000+/mo to legacy data room providers.', icon: 'DollarSign' }
    ],
    relatedSolutions: [{ name: 'M&A Deals', slug: 'mergers-acquisitions' }, { name: 'Venture Capital', slug: 'venture-capital' }],
    relatedTools: [{ name: 'VDR Cost Calculator', slug: 'vdr-cost-calculator' }],
    relatedGlossary: [{ name: 'Virtual Data Room (VDR)', slug: 'virtual-data-room' }, { name: 'Due Diligence', slug: 'due-diligence' }],
    relatedIntegrations: [{ name: 'Box', slug: 'box' }, { name: 'Dropbox', slug: 'dropbox' }],
    faqs: [
      { question: 'Can I set up a free virtual data room on DocTransfer?', answer: 'Yes! DocTransfer allows founders and dealmakers to build secure multi-document data rooms for free.' }
    ]
  },
  {
    slug: 'founders',
    title: 'DocSend Alternative Built for Startup Founders',
    headline: 'Track Pitch Decks. Protect IP. Save Capital.',
    subheadline: 'Designed for early-stage founders raising Seed and Series A rounds. Track VC engagement slide-by-slide for free.',
    category: 'audiences',
    metaTitle: 'DocSend Alternative for Founders & Startups | DocTransfer',
    metaDescription: 'Why founders are replacing DocSend with DocTransfer. Get free pitch deck tracking, investor dwell analytics, and dynamic watermarks.',
    keywords: 'docsend alternative founders, docsend for startups, pitch deck analytics for founders, investor deck tracking free',
    heroGradient: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
    icon: 'Rocket',
    docsendLimitations: [
      { title: 'Drains Early Runway', description: 'Monthly subscriptions take funds away from product development and hiring.' },
      { title: 'Lack of Founder Support', description: 'Generic corporate support unresponsive to urgent fundraising needs.' },
      { title: 'No Built-In NDA Tool', description: 'Requires founders to draft and sign NDAs elsewhere before sharing decks.' }
    ],
    comparisonMatrix: [
      { feature: 'Free Tier for Founders', docsend: '❌ Trial Only', doctransfer: '✅ $0 Forever' },
      { feature: 'Pitch Deck Analytics', docsend: 'Standard', doctransfer: '✅ Slide Dwell Heatmaps' },
      { feature: 'Instant Investor Alerts', docsend: 'Basic', doctransfer: '✅ Real-Time Slack & Email' },
      { feature: 'Built-in NDA Generator', docsend: '❌ None', doctransfer: '✅ Included Free' }
    ],
    keyBenefits: [
      { title: 'Fundraising Speed', description: 'Know which VCs spend time on your traction slides and follow up immediately.', icon: 'Zap' },
      { title: 'IP Protection', description: 'Dynamic watermarks discourage unauthorized slide sharing among competitors.', icon: 'Shield' },
      { title: '100% Free Forever', description: 'Keep 100% of your capital for building your startup.', icon: 'Gift' }
    ],
    relatedSolutions: [{ name: 'Fundraising', slug: 'fundraising' }, { name: 'Startups', slug: 'startups' }],
    relatedTools: [{ name: 'Pitch Deck Analyzer', slug: 'pitch-deck-analyzer' }, { name: 'NDA Generator', slug: 'nda-generator' }],
    relatedGlossary: [{ name: 'Series A Funding', slug: 'series-a-funding' }, { name: 'SAFE Note', slug: 'safe-note' }],
    relatedIntegrations: [{ name: 'Google Drive', slug: 'google-drive' }, { name: 'Slack', slug: 'slack' }],
    faqs: [
      { question: 'Do VCs prefer DocSend or DocTransfer?', answer: 'Investors care about smooth viewing experience. DocTransfer renders pitch decks instantly in any mobile or desktop browser without requiring VC logins.' }
    ]
  },
  {
    slug: 'sales-teams',
    title: 'DocSend Alternative for B2B Sales & Account Executives',
    headline: 'Close Deals Faster with Real-Time Buyer Insights.',
    subheadline: 'Track sales proposals, pitch decks, and enterprise contracts. Sync viewer analytics straight into Salesforce or HubSpot.',
    category: 'audiences',
    metaTitle: 'DocSend Alternative for Sales Teams & Proposal Tracking',
    metaDescription: 'Supercharge your B2B sales workflow. Track proposal reads, discover internal forwarding, and sign contracts on DocTransfer.',
    keywords: 'docsend for sales teams, sales proposal tracking alternative, track sales pitch deck opens, B2B deal tracking',
    heroGradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    icon: 'Target',
    docsendLimitations: [
      { title: 'Expensive Per-Rep Pricing', description: 'Adding whole sales organizations to DocSend creates ballooning software bills.' },
      { title: 'Limited CRM Automation', description: 'Requires manual effort to map engagement metrics into sales opportunity stages.' },
      { title: 'Separate E-Signature Flow', description: 'Rependers must switch tools when buyers are ready to execute contracts.' }
    ],
    comparisonMatrix: [
      { feature: 'Cost Per Sales Rep', docsend: '$45 - $150 / mo', doctransfer: '$0 Free / Low Flat Tier' },
      { feature: 'Pricing Slide Analytics', docsend: 'Basic', doctransfer: '✅ Heatmap Dwell Time' },
      { feature: 'Native Contract Signings', docsend: 'Add-on', doctransfer: '✅ Built-in Native' },
      { feature: 'CRM Integration', docsend: 'High Tiers Only', doctransfer: '✅ Salesforce & HubSpot' }
    ],
    keyBenefits: [
      { title: 'Perfect Outreach Timing', description: 'Reach out right when your prospect is looking at the pricing slide.', icon: 'Clock' },
      { title: 'Uncover Hidden Stakeholders', description: 'See when proposals are forwarded internally to CFOs or legal counsel.', icon: 'Users' },
      { title: 'One-Click Sign-Off', description: 'Let prospects review and e-sign closing contracts in the same document window.', icon: 'CheckCircle' }
    ],
    relatedSolutions: [{ name: 'Sales Teams', slug: 'sales' }],
    relatedTools: [{ name: 'Pitch Deck Analyzer', slug: 'pitch-deck-analyzer' }],
    relatedGlossary: [{ name: 'Document Tracking', slug: 'document-tracking' }],
    relatedIntegrations: [{ name: 'Salesforce', slug: 'salesforce' }, { name: 'HubSpot', slug: 'hubspot' }],
    faqs: [
      { question: 'Can reps track individual prospect views?', answer: 'Yes! Reps generate unique tracked links for each opportunity to see per-prospect activity.' }
    ]
  },
  {
    slug: 'legal-teams',
    title: 'DocSend Alternative for Law Firms & In-House Legal',
    headline: 'Bank-Grade Legal Security & Audit Trail Verification.',
    subheadline: 'Share confidential legal work product, litigation discovery, and contracts with AES-256 encryption and court-ready audit logs.',
    category: 'audiences',
    metaTitle: 'DocSend Alternative for Legal Teams & Law Firms | DocTransfer',
    metaDescription: 'Secure document sharing platform for attorneys and legal departments. Maintain privilege, track views, and collect e-signatures.',
    keywords: 'docsend for legal teams, law firm secure document sharing, attorney document tracking, legal file transfer portal',
    heroGradient: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    icon: 'Scale',
    docsendLimitations: [
      { title: 'Unclear Encryption Controls', description: 'DocSend lacks transparent zero-knowledge client-side encryption options.' },
      { title: 'Basic Audit Certificates', description: 'Logs lack granular forensic detail needed for court disputes.' },
      { title: 'High Enterprise License Costs', description: 'Overpaying for seat licenses across large legal associate teams.' }
    ],
    comparisonMatrix: [
      { feature: 'Court-Ready Audit Trails', docsend: 'Basic Log', doctransfer: '✅ Cryptographic Certificate' },
      { feature: 'End-to-End Encryption', docsend: 'Standard TLS', doctransfer: '✅ AES-256 & Client-Side' },
      { feature: 'Attorney-Client Watermarking', docsend: 'Paid Tier', doctransfer: '✅ Included Free' },
      { feature: 'Legal E-Signatures', docsend: 'Extra Fee', doctransfer: '✅ Built-in Native' }
    ],
    keyBenefits: [
      { title: 'Maintain Privilege', description: 'Share discovery and work product securely with end-to-end encryption.', icon: 'Lock' },
      { title: 'Tamper-Proof Verification', description: 'Generate audit certificates detailing recipient IP, timestamp, and signature hashes.', icon: 'Award' },
      { title: 'Client Upload Portals', description: 'Allow clients to upload confidential case files directly into secure vaults.', icon: 'Inbox' }
    ],
    relatedSolutions: [{ name: 'Legal Teams', slug: 'legal' }],
    relatedTools: [{ name: 'NDA Generator', slug: 'nda-generator' }],
    relatedGlossary: [{ name: 'Audit Trail', slug: 'audit-trail' }, { name: 'Non-Disclosure Agreement (NDA)', slug: 'non-disclosure-agreement' }],
    relatedIntegrations: [{ name: 'Microsoft 365', slug: 'microsoft-365' }],
    faqs: [
      { question: 'Are DocTransfer signatures compliant with legal standards?', answer: 'Yes. All e-signatures strictly adhere to the US ESIGN Act, UETA, and EU eIDAS regulations.' }
    ]
  },
  {
    slug: 'real-estate',
    title: 'DocSend Alternative for Real Estate Agents & Brokers',
    headline: 'Accelerate Property Closings with Secure Sharing.',
    subheadline: 'Share property disclosures, purchase contracts, and lease agreements with real-time signature tracking on mobile devices.',
    category: 'audiences',
    metaTitle: 'DocSend Alternative for Real Estate Agents & Brokers | DocTransfer',
    metaDescription: 'Replace DocSend for real estate. Share disclosure packets, track buyer interest, and collect digital signatures seamlessly.',
    keywords: 'docsend for real estate, real estate document tracking alternative, digital closing platform realtor, lease e-signature',
    heroGradient: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
    icon: 'Home',
    docsendLimitations: [
      { title: 'Poor Mobile UI', description: 'Real estate clients struggle to view and sign disclosures on phone screens.' },
      { title: 'No Disclosure Receipt Proof', description: 'Hard to prove buyers actually reviewed property condition disclosures.' },
      { title: 'Expensive Monthly Fees', description: 'Realtors paying high recurring subscription costs during slow seasons.' }
    ],
    comparisonMatrix: [
      { feature: 'Mobile-Optimized Viewer', docsend: 'Average', doctransfer: '✅ 100% Mobile Ready' },
      { feature: 'Disclosure Open Tracking', docsend: 'Basic', doctransfer: '✅ Per-Page Dwell Verification' },
      { feature: 'Built-in Contract Signing', docsend: 'Extra Fee', doctransfer: '✅ Built-in Native' },
      { feature: 'Cost per Agent', docsend: '$15 - $150 / mo', doctransfer: '$0 Free Tier' }
    ],
    keyBenefits: [
      { title: 'Close Deals Faster', description: 'Buyers can sign purchase contracts immediately from their mobile phones.', icon: 'Smartphone' },
      { title: 'Verify Disclosure Views', description: 'Keep digital proof that buyers reviewed mandatory HOA and seller disclosures.', icon: 'CheckSquare' },
      { title: 'Automated Reminders', description: 'Send automatic reminders before lease or offer expiration deadlines.', icon: 'Clock' }
    ],
    relatedSolutions: [{ name: 'Real Estate', slug: 'real-estate' }],
    relatedTools: [{ name: 'PDF Watermark Tool', slug: 'pdf-watermarking-tool' }],
    relatedGlossary: [{ name: 'Electronic Signature (E-Signature)', slug: 'electronic-signature' }],
    relatedIntegrations: [{ name: 'Google Drive', slug: 'google-drive' }, { name: 'Dropbox', slug: 'dropbox' }],
    faqs: [
      { question: 'Can home buyers sign real estate documents on their phones?', answer: 'Yes! DocTransfer signing flows are completely mobile-optimized for easy touchscreen signing.' }
    ]
  },
  {
    slug: 'migration-guide',
    title: 'How to Migrate from DocSend to DocTransfer in 2 Minutes',
    headline: 'Seamless Migration from DocSend. Zero Downtime.',
    subheadline: 'Step-by-step guide to switching your pitch decks, data rooms, and document links from DocSend to DocTransfer smoothly.',
    category: 'migration',
    metaTitle: 'How to Switch from DocSend to DocTransfer (2-Minute Migration)',
    metaDescription: 'Step-by-step migration guide for switching from DocSend to DocTransfer. Import files, preserve folder structures, and save capital.',
    keywords: 'switch from docsend, docsend migration guide, replace docsend, export docsend files, move from docsend to doctransfer',
    heroGradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
    icon: 'RefreshCw',
    docsendLimitations: [
      { title: 'Vendor Lock-in Attempts', description: 'Legacy platforms make exporting historical document links difficult.' },
      { title: 'Sunk Cost Anxiety', description: 'Teams fear losing existing pitch deck setups when cancelling subscriptions.' },
      { title: 'Workflow Disruption', description: 'Worry about breaking active investor or client sharing threads during a switch.' }
    ],
    comparisonMatrix: [
      { feature: 'Migration Setup Time', docsend: 'N/A', doctransfer: '⚡ Under 2 Minutes' },
      { feature: 'Bulk File Upload', docsend: 'Limited', doctransfer: '✅ One-Click Drag-and-Drop' },
      { feature: 'Folder Structure Import', docsend: 'Manual', doctransfer: '✅ Automatic Preservation' },
      { feature: 'Transition Cost', docsend: 'N/A', doctransfer: '✅ $0 Free Switch' }
    ],
    keyBenefits: [
      { title: 'Zero Interruption', description: 'Set up new DocTransfer links in parallel before cancelling your DocSend account.', icon: 'CheckCircle' },
      { title: 'Immediate Capital Savings', description: 'Stop paying monthly software bills starting today.', icon: 'DollarSign' },
      { title: 'Dedicated Support', description: 'Our team assists high-volume users with seamless bulk document migration.', icon: 'Users' }
    ],
    relatedSolutions: [{ name: 'Fundraising', slug: 'fundraising' }, { name: 'Startups', slug: 'startups' }],
    relatedTools: [{ name: 'VDR Cost Calculator', slug: 'vdr-cost-calculator' }],
    relatedGlossary: [{ name: 'Document Management System (DMS)', slug: 'document-management-system' }],
    relatedIntegrations: [{ name: 'Google Drive', slug: 'google-drive' }, { name: 'Dropbox', slug: 'dropbox' }],
    faqs: [
      { question: 'Will cancelling DocSend break my active pitch deck links?', answer: 'We recommend creating DocTransfer tracked links and updating your active outreach emails prior to cancelling your DocSend subscription.' }
    ]
  },
  {
    slug: 'docsend-vs-pandadoc',
    title: 'DocSend vs PandaDoc vs DocTransfer (2026 Comparison)',
    headline: 'DocSend vs PandaDoc: Which Document Tool Is Best?',
    subheadline: 'In-depth comparison of feature sets, proposal analytics, e-signatures, and pricing between DocSend, PandaDoc, and DocTransfer.',
    category: 'triangulation',
    metaTitle: 'DocSend vs PandaDoc vs DocTransfer Comparison (2026)',
    metaDescription: 'Detailed 3-way comparison: DocSend vs PandaDoc vs DocTransfer. Compare proposal tracking, e-signatures, VDR features, and pricing.',
    keywords: 'docsend vs pandadoc, pandadoc alternative, docsend comparison, proposal tracking vs e-signature, best document tracking tool',
    heroGradient: 'linear-gradient(135deg, #312e81 0%, #4f46e5 100%)',
    icon: 'GitBranch',
    docsendLimitations: [
      { title: 'DocSend Lacks Native E-Sign', description: 'Great for viewing decks, but weak for binding contract creation and sign-offs.' },
      { title: 'PandaDoc Is Overly Complex', description: 'PandaDoc focuses on heavy CPQ proposals rather than fast deck tracking.' },
      { title: 'Both Are Expensive', description: 'Both platforms require costly monthly per-user subscriptions for sales teams.' }
    ],
    comparisonMatrix: [
      { feature: 'Core Focus', docsend: 'Deck Analytics', pandadoc: 'Proposal Drafting', doctransfer: 'Unified Track & Sign' },
      { feature: 'Free Tier', docsend: '❌ None', pandadoc: 'Limited', doctransfer: '✅ 100% Free Plan' },
      { feature: 'Page Dwell Time', docsend: '✅ Yes', pandadoc: 'Basic', doctransfer: '✅ Granular Heatmap' },
      { feature: 'Built-in E-Signatures', docsend: 'Extra Fee', pandadoc: '✅ Yes', doctransfer: '✅ Native Included' }
    ],
    keyBenefits: [
      { title: 'Best of Both Worlds', description: 'Combine DocSend page analytics with PandaDoc e-signatures in one platform.', icon: 'Sparkles' },
      { title: 'Lower Total Cost', description: 'Eliminate dual subscriptions to save thousands annually.', icon: 'TrendingUp' },
      { title: 'Faster Setup', description: 'No steep learning curve or heavy template builders required.', icon: 'Zap' }
    ],
    relatedSolutions: [{ name: 'Sales Teams', slug: 'sales' }, { name: 'Fundraising', slug: 'fundraising' }],
    relatedTools: [{ name: 'Pitch Deck Analyzer', slug: 'pitch-deck-analyzer' }],
    relatedGlossary: [{ name: 'Contract Lifecycle Management (CLM)', slug: 'contract-lifecycle-management' }],
    relatedIntegrations: [{ name: 'Salesforce', slug: 'salesforce' }, { name: 'HubSpot', slug: 'hubspot' }],
    faqs: [
      { question: 'Should I choose DocSend or PandaDoc?', answer: 'If you want both pitch deck analytics AND legally binding e-signatures without paying double, DocTransfer is the ideal alternative.' }
    ]
  },
  {
    slug: 'docsend-vs-notion',
    title: 'DocSend vs Notion for Document & Pitch Deck Sharing',
    headline: 'Why Notion Pages Fail for Confidential Document Analytics.',
    subheadline: 'Compare Notion web pages against dedicated secure document tracking on DocTransfer for fundraising and client proposals.',
    category: 'triangulation',
    metaTitle: 'DocSend vs Notion for Pitch Decks & Document Sharing',
    metaDescription: 'Comparing Notion vs DocSend for pitch deck sharing? Learn why public Notion pages lack page analytics, watermarks, and DRM controls.',
    keywords: 'docsend vs notion, share pitch deck on notion, notion document tracking alternative, secure notion alternative',
    heroGradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    icon: 'FileText',
    docsendLimitations: [
      { title: 'Notion Lacks View Analytics', description: 'Notion public pages offer zero visibility into who viewed your deck or for how long.' },
      { title: 'No Watermarks or DRM', description: 'Notion pages can be easily copied, screenshotted, or exported without authorization.' },
      { title: 'Unprofessional PDF Exports', description: 'Notion PDF exports frequently suffer from awkward page breaks and layout bugs.' }
    ],
    comparisonMatrix: [
      { feature: 'Page Dwell Analytics', docsend: '✅ Yes', notion: '❌ None', doctransfer: '✅ Full Heatmaps' },
      { feature: 'Dynamic Watermarks', docsend: 'Paid Tier', notion: '❌ None', doctransfer: '✅ Included Free' },
      { feature: 'Download Prevention', docsend: '✅ Yes', notion: '❌ None', doctransfer: '✅ Included Free' },
      { feature: 'E-Signatures', docsend: 'Add-on', notion: '❌ None', doctransfer: '✅ Native Included' }
    ],
    keyBenefits: [
      { title: 'Investor Analytics', description: 'Get slide-by-slide dwell metrics that Notion web pages cannot provide.', icon: 'Eye' },
      { title: 'Leak Protection', description: 'Keep confidential financial models safe from unauthorized copying.', icon: 'Shield' },
      { title: 'Professional Formatting', description: 'Deliver crisp, pixel-perfect document rendering on all devices.', icon: 'Award' }
    ],
    relatedSolutions: [{ name: 'Startups', slug: 'startups' }, { name: 'Fundraising', slug: 'fundraising' }],
    relatedTools: [{ name: 'Pitch Deck Analyzer', slug: 'pitch-deck-analyzer' }],
    relatedGlossary: [{ name: 'Pitch Deck', slug: 'pitch-deck' }, { name: 'DRM', slug: 'drm' }],
    relatedIntegrations: [{ name: 'Google Drive', slug: 'google-drive' }],
    faqs: [
      { question: 'Is Notion safe for sending pitch decks to investors?', answer: 'Notion is great for internal wikis, but public Notion links lack page analytics, screenshot deterrence, and access revocation needed for fundraising.' }
    ]
  },
  {
    slug: 'docsend-vs-google-drive',
    title: 'DocSend vs Google Drive for Secure Document Sharing',
    headline: 'Why Google Drive Links Leak Confidential Business Data.',
    subheadline: 'Compare Google Drive shared links against dedicated document analytics and security controls on DocTransfer.',
    category: 'triangulation',
    metaTitle: 'DocSend vs Google Drive for Pitch Decks & Document Tracking',
    metaDescription: 'Google Drive vs DocSend vs DocTransfer. Learn why standard Google Drive share links lack page analytics, watermarking, and sign-offs.',
    keywords: 'docsend vs google drive, track google drive PDF opens, secure google drive alternative, pitch deck google drive vs docsend',
    heroGradient: 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)',
    icon: 'Cloud',
    docsendLimitations: [
      { title: 'No Per-Page Reading Time', description: 'Google Drive shows if a user opened a file, but gives zero insight into slide dwell time.' },
      { title: 'Uncontrolled Forwarding', description: 'Anyone with a Google Drive view link can forward or share it without your knowledge.' },
      { title: 'No Dynamic Watermarking', description: 'Drive links cannot stamp viewer email or IP address on pages to prevent leaks.' }
    ],
    comparisonMatrix: [
      { feature: 'Page Dwell Time', docsend: '✅ Yes', googleDrive: '❌ None', doctransfer: '✅ Full Heatmaps' },
      { feature: 'Dynamic Watermarks', docsend: 'Paid Tier', googleDrive: '❌ None', doctransfer: '✅ Included Free' },
      { feature: 'Native E-Signatures', docsend: 'Add-on', googleDrive: '❌ None', doctransfer: '✅ Built-in' },
      { feature: 'Cost', docsend: '$15 - $150/mo', googleDrive: 'Included with Workspace', doctransfer: '✅ $0 Free Tier' }
    ],
    keyBenefits: [
      { title: 'Seamless Drive Integration', description: 'Import files directly from Google Drive into DocTransfer with one click.', icon: 'RefreshCw' },
      { title: 'Total Document Control', description: 'Revoke access or disable downloads even after sending shared links.', icon: 'Lock' },
      { title: 'Real-Time Engagement', description: 'Know the exact moment a prospect opens your shared Drive PDF.', icon: 'Bell' }
    ],
    relatedSolutions: [{ name: 'Fundraising', slug: 'fundraising' }, { name: 'Sales Teams', slug: 'sales' }],
    relatedTools: [{ name: 'PDF Watermark Tool', slug: 'pdf-watermarking-tool' }],
    relatedGlossary: [{ name: 'Cloud Document Storage', slug: 'cloud-document-storage' }, { name: 'Document Tracking', slug: 'document-tracking' }],
    relatedIntegrations: [{ name: 'Google Drive', slug: 'google-drive' }],
    faqs: [
      { question: 'Can I connect DocTransfer to my Google Drive?', answer: 'Yes! DocTransfer integrates natively with Google Drive so you can select and track files in seconds.' }
    ]
  }
];

export function getConquestBySlug(slug: string): ConquestPage | undefined {
  return conquestData.find(c => c.slug === slug);
}

export function getConquestByCategory(category: ConquestPage['category']): ConquestPage[] {
  return conquestData.filter(c => c.category === category);
}
