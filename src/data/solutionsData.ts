export interface SolutionPage {
  slug: string;
  title: string;
  headline: string;
  subheadline: string;
  category: 'deals-capital' | 'industry' | 'workflow';
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  heroGradient: string;
  icon: string;
  painPoints: { title: string; description: string }[];
  features: { title: string; description: string; icon: string }[];
  stats: { value: string; label: string }[];
  howItWorks: { step: number; title: string; description: string }[];
  relatedTemplates: { name: string; slug: string }[];
  relatedTools: { name: string; slug: string }[];
  relatedGlossary: { name: string; slug: string }[];
  relatedIntegrations: { name: string; slug: string }[];
  faqs: { question: string; answer: string }[];
}

export const solutionsData: SolutionPage[] = [
  {
    slug: 'fundraising',
    title: 'Document Tracking for Startup Fundraising',
    headline: 'Pitch Like a Pro. Close Capital 3x Faster.',
    subheadline: 'Share pitch decks and financial models with page-level investor analytics, instant view alerts, and zero leak risk.',
    category: 'deals-capital',
    metaTitle: 'Pitch Deck Tracking & Data Rooms for Startup Fundraising | DocTransfer',
    metaDescription: 'Track investor engagement slide-by-slide. Secure pitch decks with dynamic watermarks, page analytics, and instant open alerts.',
    keywords: 'pitch deck tracking, investor tracking software, startup fundraising data room, track pitch deck opens, investor deck analytics',
    heroGradient: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    icon: 'TrendingUp',
    painPoints: [
      { title: 'Ghosting Without Insights', description: 'Sending pitch deck attachments into the void with zero visibility on whether VCs opened them or forwarded them.' },
      { title: 'Leaked Financial Models', description: 'Cap tables and sensitive projections forwarded to competitors or unauthorized third parties.' },
      { title: 'Version Chaos', description: 'Updating metrics or slides requires resending new attachments across dozens of active investor threads.' }
    ],
    features: [
      { title: 'Page-Level Dwell Time', description: 'See exactly how many seconds investors spend on your financial model, traction slide, and team overview.', icon: 'BarChart2' },
      { title: 'Dynamic Recipient Watermarking', description: 'Overlay viewer email and timestamp to prevent unauthorized slide distribution and screenshots.', icon: 'ShieldCheck' },
      { title: 'One-Click Live Deck Updates', description: 'Replace deck files instantaneously across all shared links without breaking recipient links.', icon: 'RefreshCw' },
      { title: 'Instant Open Alerts', description: 'Get real-time Slack, email, or webhook notifications the exact second a target investor opens your deck.', icon: 'Bell' },
      { title: 'Access Revocation', description: 'Instantly revoke link access or set auto-expiration timers once a partner meeting pass is issued.', icon: 'Lock' },
      { title: 'Integrated E-Signatures', description: 'Execute SAFE notes, term sheets, and NDAs directly within the same investor portal.', icon: 'FileSignature' }
    ],
    stats: [
      { value: '34%', label: 'Higher Deck Completion Rate' },
      { value: '3x', label: 'Faster Follow-Up Execution' },
      { value: '$0', label: 'Free Tier to Get Started' }
    ],
    howItWorks: [
      { step: 1, title: 'Upload Pitch Deck & Financials', description: 'Drag and drop your deck PDF or financial model into DocTransfer in seconds.' },
      { step: 2, title: 'Generate Custom Tracked Links', description: 'Create individual tracked links for each investor or VC partner.' },
      { step: 3, title: 'Analyze Engagement & Follow Up', description: 'Review per-slide analytics and reach out right when partner interest peaks.' }
    ],
    relatedTemplates: [{ name: 'NDA Template', slug: 'nda-template' }, { name: 'Board Resolution', slug: 'board-resolution-template' }],
    relatedTools: [{ name: 'Pitch Deck Analyzer', slug: 'pitch-deck-analyzer' }, { name: 'VDR Cost Calculator', slug: 'vdr-cost-calculator' }],
    relatedGlossary: [{ name: 'Pitch Deck', slug: 'pitch-deck' }, { name: 'SAFE Note', slug: 'safe-note' }, { name: 'Series A Funding', slug: 'series-a-funding' }],
    relatedIntegrations: [{ name: 'Google Drive', slug: 'google-drive' }, { name: 'Gmail', slug: 'gmail' }],
    faqs: [
      { question: 'Can investors download my pitch deck?', answer: 'You control permissions. You can disable downloads, enforce view-only mode, or enable dynamic watermarking.' },
      { question: 'Is DocTransfer free for founders?', answer: 'Yes! DocTransfer offers a 100% free plan with unlimited document uploads and real-time tracking.' }
    ]
  },
  {
    slug: 'mergers-acquisitions',
    title: 'Secure Document Sharing for M&A Deals',
    headline: 'Accelerate M&A Due Diligence. Bank-Grade Data Rooms.',
    subheadline: 'Manage confidential buy-side and sell-side transactions with granular permissions, dynamic watermarking, and full audit logs.',
    category: 'deals-capital',
    metaTitle: 'M&A Virtual Data Room & Document Tracking | DocTransfer',
    metaDescription: 'Streamline mergers and acquisitions due diligence. Bank-grade VDR features with granular permissions, audit trails, and dynamic watermarks.',
    keywords: 'M&A data room, mergers and acquisitions due diligence, secure document sharing M&A, virtual data room M&A, deal room software',
    heroGradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
    icon: 'Briefcase',
    painPoints: [
      { title: 'Extremely High VDR Costs', description: 'Legacy VDR providers charging $1,000+ per month or per-page fees for standard data room features.' },
      { title: 'Data Leak Vulnerabilities', description: 'Confidential strategic plans and IP disclosed during multi-buyer bidding processes.' },
      { title: 'Clunky Deal Management', description: 'Outdated interfaces that slow down buyer teams and delay transaction closing dates.' }
    ],
    features: [
      { title: 'Granular Role-Based Access', description: 'Assign viewing, downloading, and managing rights per user or buyer team.', icon: 'Shield' },
      { title: 'Tamper-Proof Audit Trail', description: 'Maintain immutable logs of every view, download, print, and signature for compliance.', icon: 'FileText' },
      { title: 'Anti-Leak Watermarking', description: 'Automatically stamp recipient email, IP address, and date across every page.', icon: 'Eye' },
      { title: 'Bulk Document Upload', description: 'Upload entire folder hierarchies seamlessly while maintaining structure.', icon: 'Upload' },
      { title: 'Document Revocation', description: 'Kill access instantly for buyers who drop out of the bidding process.', icon: 'UserMinus' },
      { title: 'Integrated NDA Signings', description: 'Enforce signed NDAs before granting buyer access to sensitive data folders.', icon: 'CheckCircle2' }
    ],
    stats: [
      { value: '80%', label: 'Savings vs Legacy VDRs' },
      { value: '100%', label: 'SOC 2 & GDPR Aligned' },
      { value: '12 Days', label: 'Average Time Saved' }
    ],
    howItWorks: [
      { step: 1, title: 'Set Up Data Room Structure', description: 'Organize financial, legal, IP, and HR folders in DocTransfer.' },
      { step: 2, title: 'Enforce Gated NDA Access', description: 'Require buyer sign-off on NDA before viewing deal documents.' },
      { step: 3, title: 'Monitor Buyer Interest', description: 'Track buyer diligence activity through detailed page-by-page analytics.' }
    ],
    relatedTemplates: [{ name: 'NDA Template', slug: 'nda-template' }, { name: 'Service Agreement', slug: 'service-agreement-template' }],
    relatedTools: [{ name: 'VDR Cost Calculator', slug: 'vdr-cost-calculator' }, { name: 'PDF Watermark Tool', slug: 'pdf-watermarking-tool' }],
    relatedGlossary: [{ name: 'Virtual Data Room (VDR)', slug: 'virtual-data-room' }, { name: 'Due Diligence', slug: 'due-diligence' }, { name: 'Merger & Acquisition (M&A)', slug: 'merger-and-acquisition' }],
    relatedIntegrations: [{ name: 'Box', slug: 'box' }, { name: 'Salesforce', slug: 'salesforce' }],
    faqs: [
      { question: 'How does DocTransfer compare to Datasite or Intralinks for M&A?', answer: 'DocTransfer offers modern UX, page tracking, and e-signatures at a fraction of the cost, saving deal teams thousands of dollars.' }
    ]
  },
  {
    slug: 'real-estate',
    title: 'Document Management for Real Estate Closings',
    headline: 'Close Properties Faster with Secure Digital Transactions.',
    subheadline: 'Share disclosures, purchase agreements, and lease contracts with real-time signature tracking and automated client reminders.',
    category: 'industry',
    metaTitle: 'Real Estate Document Sharing & Digital Closing Platform | DocTransfer',
    metaDescription: 'Accelerate real estate closings. Share disclosures, title documents, and lease agreements with secure e-signatures and tracking.',
    keywords: 'real estate document sharing, digital closing platform real estate, lease agreement e-signature, track buyer disclosures, real estate VDR',
    heroGradient: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
    icon: 'Home',
    painPoints: [
      { title: 'Delayed Signatures', description: 'Waiting days for buyers, sellers, or tenants to print, sign, scan, and email back property contracts.' },
      { title: 'Unverified Disclosures', description: 'No proof that buyers actually opened and reviewed critical HOA or seller disclosure documents.' },
      { title: 'Lost Deal Documents', description: 'Scattered paperwork across email threads causing compliance bottlenecks during closing.' }
    ],
    features: [
      { title: 'Mobile-Friendly E-Signatures', description: 'Clients can sign purchase contracts and lease agreements seamlessly from any smartphone.', icon: 'Smartphone' },
      { title: 'Disclosure View Verification', description: 'Verify exactly when buyers opened and read seller disclosure packets.', icon: 'CheckSquare' },
      { title: 'Client Access Portals', description: 'Create branded document vaults for buyers, sellers, and title agents.', icon: 'FolderPlus' },
      { title: 'Auto Expiration Reminders', description: 'Automate gentle email reminders before offer or lease expiration dates.', icon: 'Clock' },
      { title: 'Audit Trail Certificates', description: 'Generate legal audit logs with IP addresses, timestamps, and geolocation for court validity.', icon: 'Award' },
      { title: 'Cloud Sync', description: 'Automatically archive executed contracts to Google Drive, Dropbox, or OneDrive.', icon: 'Cloud' }
    ],
    stats: [
      { value: '4x', label: 'Faster Contract Sign-Off' },
      { value: '100%', label: 'ESIGN & UETA Compliant' },
      { value: '0', label: 'Lost Paperwork Incidents' }
    ],
    howItWorks: [
      { step: 1, title: 'Upload Agreement or Disclosure', description: 'Import purchase agreements, disclosures, or leases.' },
      { step: 2, title: 'Add Signature & Date Fields', description: 'Drag-and-drop fields for buyer, seller, and agent signatures.' },
      { step: 3, title: 'Track Signings Live', description: 'Receive instant alerts as parties view and complete signing.' }
    ],
    relatedTemplates: [{ name: 'Lease Agreement', slug: 'lease-agreement-template' }, { name: 'Sublease Agreement', slug: 'sublease' }],
    relatedTools: [{ name: 'PDF Watermark Tool', slug: 'pdf-watermarking-tool' }],
    relatedGlossary: [{ name: 'Electronic Signature (E-Signature)', slug: 'electronic-signature' }, { name: 'ESIGN Act', slug: 'esign-act' }],
    relatedIntegrations: [{ name: 'Google Drive', slug: 'google-drive' }, { name: 'Dropbox', slug: 'dropbox' }],
    faqs: [
      { question: 'Are DocTransfer real estate e-signatures legally binding?', answer: 'Yes, DocTransfer signatures strictly adhere to the ESIGN Act and UETA in the US as well as eIDAS internationally.' }
    ]
  },
  {
    slug: 'legal',
    title: 'Secure Document Platform for Legal Teams & Law Firms',
    headline: 'Enterprise Security Meets Frictionless Legal Sharing.',
    subheadline: 'Protect attorney-client privilege, manage contracts, and track document discovery with end-to-end encryption and audit trails.',
    category: 'industry',
    metaTitle: 'Secure Legal Document Sharing & E-Signatures | DocTransfer',
    metaDescription: 'Secure law firm document sharing platform. Maintain attorney-client privilege, track document views, and capture legally valid e-signatures.',
    keywords: 'legal document management, law firm file sharing, secure legal document portal, attorney document tracking, legal e-signature',
    heroGradient: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    icon: 'Scale',
    painPoints: [
      { title: 'Privilege Breach Risk', description: 'Sending confidential client discovery or litigation files via unencrypted email attachments.' },
      { title: 'Lack of Audit Evidence', description: 'Difficulty proving in court exactly when opposing counsel or clients received specific documents.' },
      { title: 'Inflexible Signing Tools', description: 'Overpaying for DocuSign or Adobe Sign with rigid user seats and limited customization.' }
    ],
    features: [
      { title: 'End-to-End Encryption', description: 'Protect sensitive case files with AES-256 encryption in transit and at rest.', icon: 'Lock' },
      { title: 'Legal-Grade Audit Logging', description: 'Generate court-admissible audit reports tracking every view, click, signature, and timestamp.', icon: 'FileText' },
      { title: 'Dynamic Recipient Stamping', description: 'Prevent leak of proprietary legal work product using dynamic watermarks.', icon: 'ShieldAlert' },
      { title: 'Secure Client Intake Portals', description: 'Allow clients to upload confidential documents directly into secure encrypted folders.', icon: 'Inbox' },
      { title: 'Contract Version Control', description: 'Track edits and revisions across complex multi-party agreement negotiations.', icon: 'GitBranch' },
      { title: 'Role Permissions', description: 'Restrict access to senior partners, associates, paralegals, or external counsel.', icon: 'Users' }
    ],
    stats: [
      { value: '100%', label: 'Attorney-Client Privilege Aligned' },
      { value: '256-Bit', label: 'AES Encryption Standard' },
      { value: '60%', label: 'Lower Cost Than DocuSign' }
    ],
    howItWorks: [
      { step: 1, title: 'Upload Case Files or Contracts', description: 'Add agreements, pleadings, or discovery materials securely.' },
      { step: 2, title: 'Configure Access Restrictions', description: 'Set password protection, expiration dates, or watermarks.' },
      { step: 3, title: 'Send & Receive Signed Audits', description: 'Collect e-signatures with complete cryptographic verification certificates.' }
    ],
    relatedTemplates: [{ name: 'NDA Template', slug: 'nda-template' }, { name: 'Service Agreement', slug: 'service-agreement-template' }],
    relatedTools: [{ name: 'NDA Generator', slug: 'nda-generator' }],
    relatedGlossary: [{ name: 'Non-Disclosure Agreement (NDA)', slug: 'non-disclosure-agreement' }, { name: 'Audit Trail', slug: 'audit-trail' }, { name: 'Contract Lifecycle Management (CLM)', slug: 'contract-lifecycle-management' }],
    relatedIntegrations: [{ name: 'Microsoft 365', slug: 'microsoft-365' }, { name: 'Zapier', slug: 'zapier' }],
    faqs: [
      { question: 'Can DocTransfer audit trails be used in legal disputes?', answer: 'Yes. DocTransfer produces full cryptographic proof logs including IP addresses, timestamps, and email verification acceptable under state and federal rules.' }
    ]
  },
  {
    slug: 'healthcare',
    title: 'HIPAA-Compliant Document Sharing & Patient Forms',
    headline: 'Bank-Grade Security for Sensitive Medical Records.',
    subheadline: 'Share patient records, research files, and medical consents securely while satisfying HIPAA and HITECH technical safeguards.',
    category: 'industry',
    metaTitle: 'HIPAA-Compliant Document Sharing & E-Signatures | DocTransfer',
    metaDescription: 'HIPAA-ready document sharing and e-signatures for healthcare providers, medical practices, and healthtech startups with full audit logs.',
    keywords: 'HIPAA compliant file sharing, secure medical document transfer, HIPAA e-signature, patient record sharing, healthtech data room',
    heroGradient: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
    icon: 'Activity',
    painPoints: [
      { title: 'Costly HIPAA Violations', description: 'Accidental disclosure of Protected Health Information (PHI) resulting in massive regulatory fines.' },
      { title: 'Paper Patient Onboarding', description: 'Inefficient paper intake forms that require manual data entry and physically stored files.' },
      { title: 'Unsecured External Transfers', description: 'Sharing medical research or patient charts with external specialists using unsecured links.' }
    ],
    features: [
      { title: 'HIPAA Security Safeguards', description: 'Technical controls designed to safeguard electronic Protected Health Information (ePHI).', icon: 'ShieldCheck' },
      { title: 'Business Associate Support', description: 'Infrastructure built to support healthcare provider compliance requirements.', icon: 'CheckCircle' },
      { title: 'Patient Consent Signatures', description: 'Collect legally binding patient consent forms, HIPAA releases, and intake waivers online.', icon: 'FileSignature' },
      { title: 'Automatic Expiration Timers', description: 'Set medical records links to self-destruct after specified hours or views.', icon: 'Timer' },
      { title: 'Access Control Logs', description: 'Track every individual access attempt to patient records for mandatory compliance auditing.', icon: 'List' },
      { title: 'Encrypted Cloud Archiving', description: 'Store patient records in AES-256 encrypted storage vaults.', icon: 'Database' }
    ],
    stats: [
      { value: '100%', label: 'HIPAA Technical Compliance' },
      { value: '0', label: 'Data Leak Tolerated' },
      { value: '5 Min', label: 'Average Onboarding Time' }
    ],
    howItWorks: [
      { step: 1, title: 'Upload Patient Records or Forms', description: 'Add medical intake packets, treatment plans, or billing records.' },
      { step: 2, title: 'Send Encrypted Portal Links', description: 'Deliver password-protected links directly to patients or specialists.' },
      { step: 3, title: 'Archive Signed Consents Automatically', description: 'Executed forms sync directly to your HIPAA compliance archive.' }
    ],
    relatedTemplates: [{ name: 'Service Agreement', slug: 'service-agreement-template' }],
    relatedTools: [{ name: 'PDF Watermark Tool', slug: 'pdf-watermarking-tool' }],
    relatedGlossary: [{ name: 'HIPAA Compliance', slug: 'hipaa-compliance' }, { name: 'GDPR', slug: 'gdpr' }, { name: 'Zero-Knowledge Encryption', slug: 'zero-knowledge-encryption' }],
    relatedIntegrations: [{ name: 'Google Drive', slug: 'google-drive' }],
    faqs: [
      { question: 'Does DocTransfer encrypt medical records?', answer: 'Yes. All data transferred and stored through DocTransfer is encrypted using AES-256 and TLS 1.3 standards.' }
    ]
  },
  {
    slug: 'venture-capital',
    title: 'Portfolio & LP Document Management for Venture Capital',
    headline: 'Streamline Capital Calls, LP Updates & Due Diligence.',
    subheadline: 'Manage portfolio reporting, capital call notices, and data rooms for limited partners in one secure, tracked platform.',
    category: 'deals-capital',
    metaTitle: 'Venture Capital LP Reporting & Data Rooms | DocTransfer',
    metaDescription: 'Venture capital software for LP reporting, capital calls, and portfolio due diligence. Track LP engagement with page-level analytics.',
    keywords: 'venture capital LP portal, VC portfolio management software, capital call notice tracking, VC data room, LP reporting platform',
    heroGradient: 'linear-gradient(135deg, #312e81 0%, #4338ca 100%)',
    icon: 'Layers',
    painPoints: [
      { title: 'Unopened LP Reports', description: 'No visibility into whether Limited Partners are actually reading quarterly performance updates.' },
      { title: 'Leaked Portfolio Metrics', description: 'Sensitive portfolio company financials leaked to public media or competing funds.' },
      { title: 'Manual Capital Call Signatures', description: 'Tracking down LP sign-offs on subscription agreements across dozens of entities.' }
    ],
    features: [
      { title: 'LP Engagement Dashboards', description: 'See which LPs open your quarterly reports and which slides they spend the most time reviewing.', icon: 'BarChart' },
      { title: 'Custom Branded Portals', description: 'Host fund documents in branded portals matching your venture firm branding.', icon: 'Layout' },
      { title: 'Dynamic Watermarks for LPs', description: 'Watermark quarterly reports with the LP email address to prevent public leaks.', icon: 'Lock' },
      { title: 'Capital Call Notice Automation', description: 'Send tracked capital call notices with built-in acknowledgment receipts.', icon: 'Send' },
      { title: 'Portfolio Due Diligence Data Rooms', description: 'Provide prospective co-investors access to portfolio company diligence folders.', icon: 'Folder' },
      { title: 'Multi-Fund Permissions', description: 'Organize permissions cleanly across Fund I, Fund II, and SPVs.', icon: 'Grid' }
    ],
    stats: [
      { value: '92%', label: 'LP Open Rate Tracking' },
      { value: '50%', label: 'Faster Capital Call Response' },
      { value: '100%', label: 'Branded Experience' }
    ],
    howItWorks: [
      { step: 1, title: 'Upload LP Updates & Financials', description: 'Add quarterly letters, financial statements, or capital call letters.' },
      { step: 2, title: 'Distribute Dedicated LP Links', description: 'Send individual tracked links to your fund LPs.' },
      { step: 3, title: 'Review Partner Engagement', description: 'Identify highly engaged LPs for upcoming fund raises.' }
    ],
    relatedTemplates: [{ name: 'Board Resolution', slug: 'board-resolution-template' }],
    relatedTools: [{ name: 'Pitch Deck Analyzer', slug: 'pitch-deck-analyzer' }, { name: 'VDR Cost Calculator', slug: 'vdr-cost-calculator' }],
    relatedGlossary: [{ name: 'Venture Capital', slug: 'venture-capital' }, { name: 'Cap Table', slug: 'cap-table' }, { name: 'Series A Funding', slug: 'series-a-funding' }],
    relatedIntegrations: [{ name: 'Salesforce', slug: 'salesforce' }, { name: 'HubSpot', slug: 'hubspot' }],
    faqs: [
      { question: 'Can I track individual LP reading activity?', answer: 'Yes! DocTransfer shows exact dwell time per slide for every individual LP viewing your updates.' }
    ]
  },
  {
    slug: 'sales',
    title: 'Proposal & Pitch Deck Tracking for Sales Teams',
    headline: 'Know Exactly When Prospects Are Ready to Buy.',
    subheadline: 'Track sales decks, proposals, and enterprise contracts. Get notified the exact second a decision-maker opens your document.',
    category: 'workflow',
    metaTitle: 'Sales Deck & Proposal Tracking Software | DocTransfer',
    metaDescription: 'Track sales proposals and decks in real time. Get page-by-page viewing analytics, instant open alerts, and embedded e-signatures.',
    keywords: 'sales proposal tracking, track sales deck, proposal analytics software, sales document tracking, contract close tracking',
    heroGradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
    icon: 'Target',
    painPoints: [
      { title: 'Blind Follow-Up Timing', description: 'Calling prospects too early or too late because you do not know when they reviewed the proposal.' },
      { title: 'Unknown Internal Forwarding', description: 'Not knowing if your champion forwarded the proposal to CFO or procurement leads.' },
      { title: 'Stalled Deals', description: 'Proposals sitting unread in prospect inboxes without any automated engagement alerts.' }
    ],
    features: [
      { title: 'Real-Time Open Notifications', description: 'Receive instant Slack, email, or CRM notifications the instant a buyer opens your proposal.', icon: 'Bell' },
      { title: 'Pricing Slide Heatmaps', description: 'See if prospects skipped straight to your pricing table and how long they deliberated.', icon: 'Eye' },
      { title: 'Forwarding Tracking', description: 'Discover when your pitch is shared internally with hidden key decision makers.', icon: 'Share2' },
      { title: 'One-Click Live Edits', description: 'Update pricing tiers or scope in real time without resending email attachments.', icon: 'Edit3' },
      { title: 'Built-In Contract Signing', description: 'Allow buyers to sign closing contracts directly from the proposal view.', icon: 'CheckCircle' },
      { title: 'CRM Integration', description: 'Sync document engagement metrics directly to Salesforce or HubSpot deals.', icon: 'Zap' }
    ],
    stats: [
      { value: '28%', label: 'Faster Sales Cycle' },
      { value: '2.5x', label: 'Higher Proposal Close Rate' },
      { value: '100%', label: 'Visibility on Pricing Views' }
    ],
    howItWorks: [
      { step: 1, title: 'Upload Sales Pitch or Proposal', description: 'Add your custom sales proposal or pricing deck.' },
      { step: 2, title: 'Send Personalized Link', description: 'Deliver a tracked link via email, LinkedIn, or CRM.' },
      { step: 3, title: 'Time Your Follow-Up', description: 'Call the prospect immediately when they finish reading the proposal.' }
    ],
    relatedTemplates: [{ name: 'Service Agreement', slug: 'service-agreement-template' }, { name: 'SOW Contract', slug: 'sow' }],
    relatedTools: [{ name: 'Pitch Deck Analyzer', slug: 'pitch-deck-analyzer' }],
    relatedGlossary: [{ name: 'Document Tracking', slug: 'document-tracking' }, { name: 'Document Analytics', slug: 'document-analytics' }],
    relatedIntegrations: [{ name: 'Salesforce', slug: 'salesforce' }, { name: 'HubSpot', slug: 'hubspot' }, { name: 'Slack', slug: 'slack' }],
    faqs: [
      { question: 'Does DocTransfer integrate with Salesforce and HubSpot?', answer: 'Yes! DocTransfer seamlessly syncs viewing events and signed contracts into major CRM platforms.' }
    ]
  },
  {
    slug: 'human-resources',
    title: 'Secure HR Document Management & Employee Onboarding',
    headline: 'Frictionless Paperless Employee Onboarding.',
    subheadline: 'Send offer letters, employee handbooks, W-4s, and NDAs with automated signing workflows and compliance tracking.',
    category: 'workflow',
    metaTitle: 'HR Document Management & E-Sign Onboarding | DocTransfer',
    metaDescription: 'Streamline HR workflows. Send offer letters, onboarding documents, and handbooks with mobile e-signatures and tracking.',
    keywords: 'HR document management, paperless employee onboarding, offer letter e-signature, track employee handbook signoffs, HR electronic signature',
    heroGradient: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
    icon: 'Users',
    painPoints: [
      { title: 'Slow Offer Letter Acceptance', description: 'Candidates taking days to print and scan offer letters, risking candidate drop-off.' },
      { title: 'Unconfirmed Handbook Reviews', description: 'No legal record proving employees actually read compliance handbooks.' },
      { title: 'Scattered Personnel Files', description: 'Inconsistent document storage across email threads and paper filing cabinets.' }
    ],
    features: [
      { title: 'One-Click Mobile Signatures', description: 'Candidates can sign offer letters and contracts in seconds on mobile devices.', icon: 'CheckSquare' },
      { title: 'Read-Receipt Audit Logging', description: 'Prove compliance with verifiable timestamp logs for employee handbook sign-offs.', icon: 'FileText' },
      { title: 'Bulk Onboarding Packets', description: 'Send combined offer, NDA, and tax forms in a single guided signing flow.', icon: 'Package' },
      { title: 'Auto Expiration & Reminders', description: 'Set offer letter expiration dates with automated follow-up reminders.', icon: 'Clock' },
      { title: 'Secure Employee Folders', description: 'Maintain encrypted personnel vaults with strict access permissions.', icon: 'FolderCheck' },
      { title: 'Cloud Storage Backup', description: 'Automatically archive signed personnel files to Google Drive or OneDrive.', icon: 'Cloud' }
    ],
    stats: [
      { value: '75%', label: 'Faster Offer Acceptance' },
      { value: '100%', label: 'Paperless Compliance' },
      { value: '0', label: 'Filing Errors' }
    ],
    howItWorks: [
      { step: 1, title: 'Prepare Onboarding Packet', description: 'Combine offer letters, NDAs, and company policy documents.' },
      { step: 2, title: 'Send to Candidate', description: 'Deliver a tracked, mobile-ready link directly to the candidate.' },
      { step: 3, title: 'Auto-Archive Executed Documents', description: 'Signed files automatically sync to your secure HR storage folder.' }
    ],
    relatedTemplates: [{ name: 'Offer Letter', slug: 'offer-letter' }, { name: 'W-4 Form', slug: 'w4-form' }, { name: 'I-9 Form', slug: 'i9-form' }],
    relatedTools: [{ name: 'NDA Generator', slug: 'nda-generator' }],
    relatedGlossary: [{ name: 'Electronic Signature (E-Signature)', slug: 'electronic-signature' }, { name: 'ESIGN Act', slug: 'esign-act' }],
    relatedIntegrations: [{ name: 'Google Drive', slug: 'google-drive' }, { name: 'Zapier', slug: 'zapier' }],
    faqs: [
      { question: 'Can candidates sign offer letters on mobile phones?', answer: 'Yes! DocTransfer e-signature workflows are optimized for all smartphones and tablets.' }
    ]
  },
  {
    slug: 'board-management',
    title: 'Secure Board Document Portal & Meeting Management',
    headline: 'Flawless Board Meetings. Bank-Grade Director Access.',
    subheadline: 'Distribute board decks, meeting minutes, and consent resolutions securely to directors with full view analytics.',
    category: 'workflow',
    metaTitle: 'Board Document Management & Portal | DocTransfer',
    metaDescription: 'Secure board portal software. Share board decks, resolutions, and meeting minutes with encrypted access and electronic signing.',
    keywords: 'board portal software, board meeting document sharing, board resolution e-signature, secure director portal, board deck tracking',
    heroGradient: 'linear-gradient(135deg, #4338ca 0%, #3730a3 100%)',
    icon: 'Shield',
    painPoints: [
      { title: 'Unsecured Board Deck Distribution', description: 'Emailing PDF board decks to directors\' personal email accounts.' },
      { title: 'Unprepared Board Meetings', description: 'Not knowing whether directors reviewed materials prior to board calls.' },
      { title: 'Delayed Written Consent', description: 'Chasing down physical signatures for formal board resolutions.' }
    ],
    features: [
      { title: 'Director Engagement Tracking', description: 'Know if board members reviewed financial reports prior to meetings.', icon: 'BarChart2' },
      { title: 'Encrypted Director Vaults', description: 'Host historical board minutes and committee materials in encrypted folders.', icon: 'Lock' },
      { title: 'Dynamic Anti-Leak Watermarking', description: 'Prevent accidental disclosure of sensitive strategic board plans.', icon: 'ShieldAlert' },
      { title: 'Instant Board Resolution Signatures', description: 'Collect formal director signatures on written resolutions in minutes.', icon: 'CheckCircle2' },
      { title: 'One-Click Board Deck Swaps', description: 'Update financial slides in board decks live right before board meetings.', icon: 'RefreshCw' },
      { title: 'Multi-Board Support', description: 'Allow investors to switch seamlessly between different portfolio board portals.', icon: 'Grid' }
    ],
    stats: [
      { value: '100%', label: 'Director Material Verification' },
      { value: '5 Min', label: 'Average Resolution Sign Time' },
      { value: 'Zero', label: 'Unauthorized Leaks' }
    ],
    howItWorks: [
      { step: 1, title: 'Upload Board Decks & Minutes', description: 'Import meeting agendas, financial slides, and draft resolutions.' },
      { step: 2, title: 'Grant Director Access', description: 'Send secure encrypted links directly to board members.' },
      { step: 3, title: 'Execute Resolutions Online', description: 'Collect legal electronic signatures on formal board consents.' }
    ],
    relatedTemplates: [{ name: 'Board Resolution', slug: 'board-resolution-template' }],
    relatedTools: [{ name: 'PDF Watermark Tool', slug: 'pdf-watermarking-tool' }],
    relatedGlossary: [{ name: 'Board Resolution', slug: 'board-resolution' }, { name: 'Shareholder Agreement', slug: 'shareholder-agreement' }],
    relatedIntegrations: [{ name: 'Google Drive', slug: 'google-drive' }, { name: 'Microsoft 365', slug: 'microsoft-365' }],
    faqs: [
      { question: 'Is DocTransfer easier for board members than legacy board portals?', answer: 'Yes! Directors access board documents with one click without downloading heavy portal software or remembering complex logins.' }
    ]
  },
  {
    slug: 'investor-relations',
    title: 'Investor Relations Document Platform & LP Communication',
    headline: 'Build Investor Trust with Transparent Data Rooms.',
    subheadline: 'Distribute investor updates, annual reports, and financial statements with page-level engagement tracking.',
    category: 'deals-capital',
    metaTitle: 'Investor Relations Document Platform & Reporting | DocTransfer',
    metaDescription: 'Investor relations software for private and public companies. Share investor updates, financial statements, and reports securely.',
    keywords: 'investor relations software, IR document sharing, investor update tracking, private company IR portal, shareholder reporting platform',
    heroGradient: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
    icon: 'PieChart',
    painPoints: [
      { title: 'Zero Visibility on Investor Interest', description: 'Sending quarterly updates without knowing if investors read them.' },
      { title: 'Leaked Strategic Projections', description: 'Forwarded financial updates leaking to competing companies or press.' },
      { title: 'Disorganized Shareholder Records', description: 'Managing shareholder disclosures across messy email threads.' }
    ],
    features: [
      { title: 'Per-Investor Dwell Analytics', description: 'Track slide-by-slide reading time for each shareholder or investor.', icon: 'Eye' },
      { title: 'Anti-Forwarding Restrictions', description: 'Block link forwarding so updates remain exclusively with authorized investors.', icon: 'UserX' },
      { title: 'Dynamic Recipient Watermarks', description: 'Overlay recipient names and emails to prevent unauthorized distribution.', icon: 'Lock' },
      { title: 'Historical IR Repositories', description: 'Provide investors access to archived quarterly updates and financial reports.', icon: 'Archive' },
      { title: 'Real-Time Document Revocation', description: 'Revoke access instantly if a shareholder transfers their position.', icon: 'Slash' },
      { title: 'Automated Update Notifications', description: 'Alert investors automatically when new quarterly reports are published.', icon: 'Bell' }
    ],
    stats: [
      { value: '88%', label: 'Investor Engagement Rate' },
      { value: '100%', label: 'Forward Protection' },
      { value: '0', label: 'Leaked Reports' }
    ],
    howItWorks: [
      { step: 1, title: 'Upload Quarterly Investor Report', description: 'Add your quarterly update PDF and financial metrics.' },
      { step: 2, title: 'Send Tracked Links to Shareholders', description: 'Deliver personalized links to each investor.' },
      { step: 3, title: 'Measure Shareholder Engagement', description: 'Identify top engaged investors for future funding rounds.' }
    ],
    relatedTemplates: [{ name: 'Board Resolution', slug: 'board-resolution-template' }],
    relatedTools: [{ name: 'Pitch Deck Analyzer', slug: 'pitch-deck-analyzer' }],
    relatedGlossary: [{ name: 'Investor Deck', slug: 'investor-deck' }, { name: 'Cap Table', slug: 'cap-table' }, { name: 'Shareholder Agreement', slug: 'shareholder-agreement' }],
    relatedIntegrations: [{ name: 'Mailchimp', slug: 'mailchimp' }, { name: 'HubSpot', slug: 'hubspot' }],
    faqs: [
      { question: 'Can I prevent investors from forwarding quarterly updates?', answer: 'Yes! DocTransfer allows you to restrict access strictly to authorized email addresses.' }
    ]
  },
  {
    slug: 'startups',
    title: 'Document Security & Pitch Deck Sharing for Startups',
    headline: 'Protect Your IP while Moving at Lightning Speed.',
    subheadline: 'The essential document sharing, e-signature, and data room platform built specifically for fast-growing startup teams.',
    category: 'workflow',
    metaTitle: 'Startup Document Security & Free Pitch Deck Sharing | DocTransfer',
    metaDescription: 'Free document sharing for startups. Secure pitch decks, NDAs, offer letters, and cap tables with page-level analytics and zero cost.',
    keywords: 'startup document management, free pitch deck tracking startup, startup data room, founder document security, free docsend alternative startup',
    heroGradient: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
    icon: 'Rocket',
    painPoints: [
      { title: 'Overpriced Enterprise Software', description: 'Spending $100+/mo on DocSend and DocuSign when early-stage runway is precious.' },
      { title: 'IP Leak Risks', description: 'Sharing proprietary technical architecture and product roadmaps without watermarking.' },
      { title: 'Scattered Founder Documents', description: 'Losing track of signed advisor agreements, founder vesting contracts, and NDAs.' }
    ],
    features: [
      { title: '100% Free Core Plan', description: 'Upload unlimited documents and track viewer analytics without spending runway.', icon: 'Gift' },
      { title: 'Investor Pitch Deck Analytics', description: 'Know exactly which VCs spent time reading your deck and which slides they liked.', icon: 'TrendingUp' },
      { title: 'Instant Free NDA Generator', description: 'Generate and send customized mutual NDAs in under 60 seconds.', icon: 'FileText' },
      { title: 'Data Room for Seed Diligence', description: 'Organize cap tables, incorporation documents, and financial models for VCs.', icon: 'FolderPlus' },
      { title: 'Dynamic Recipient Watermarks', description: 'Prevent leaks of sensitive unreleased product roadmaps.', icon: 'Shield' },
      { title: 'Mobile E-Signatures', description: 'Collect signatures on contractor and advisor agreements from anywhere.', icon: 'Smartphone' }
    ],
    stats: [
      { value: '$0', label: 'Cost for Core Platform' },
      { value: '10,000+', label: 'Startups Supported' },
      { value: '3x', label: 'Faster Deal Execution' }
    ],
    howItWorks: [
      { step: 1, title: 'Upload Startup Documents', description: 'Import your pitch deck, cap table, or advisor agreements.' },
      { step: 2, title: 'Share Tracked Links Free', description: 'Send secure links with view tracking enabled.' },
      { step: 3, title: 'Close Investors & Hires Faster', description: 'Act immediately on real-time viewer analytics.' }
    ],
    relatedTemplates: [{ name: 'NDA Template', slug: 'nda-template' }, { name: 'Offer Letter', slug: 'offer-letter' }, { name: 'Contractor Agreement', slug: 'contractor-agreement' }],
    relatedTools: [{ name: 'Pitch Deck Analyzer', slug: 'pitch-deck-analyzer' }, { name: 'NDA Generator', slug: 'nda-generator' }, { name: 'VDR Cost Calculator', slug: 'vdr-cost-calculator' }],
    relatedGlossary: [{ name: 'Seed Funding', slug: 'seed-funding' }, { name: 'SAFE Note', slug: 'safe-note' }, { name: 'Pitch Deck', slug: 'pitch-deck' }],
    relatedIntegrations: [{ name: 'Google Drive', slug: 'google-drive' }, { name: 'Slack', slug: 'slack' }],
    faqs: [
      { question: 'Why is DocTransfer free for startups?', answer: 'We believe early-stage founders should not be penalized by high document software costs. Our core features are 100% free forever.' }
    ]
  },
  {
    slug: 'finance',
    title: 'Secure Document Sharing for Financial Services & Banking',
    headline: 'Fort Knox Security for Sensitive Financial Data.',
    subheadline: 'Share audit reports, tax filings, asset management summaries, and loan applications with bank-grade encryption.',
    category: 'industry',
    metaTitle: 'Secure Financial Document Sharing & Audit Logs | DocTransfer',
    metaDescription: 'Bank-grade document sharing for financial institutions, accounting firms, and CFOs. Protect sensitive financial data with AES-256 encryption.',
    keywords: 'financial document management, secure financial file sharing, banking document portal, CPA document transfer, financial audit trail',
    heroGradient: 'linear-gradient(135deg, #0f766e 0%, #115e59 100%)',
    icon: 'DollarSign',
    painPoints: [
      { title: 'Severe Compliance Fines', description: 'Unsafe sharing of sensitive tax or financial statements violating financial privacy laws.' },
      { title: 'Client Identity Fraud', description: 'Unverified digital signatures on loan agreements or financial disclosures.' },
      { title: 'Inefficient Client File Collection', description: 'Chasing clients for missing tax documents across chaotic email chains.' }
    ],
    features: [
      { title: 'Bank-Grade AES-256 Encryption', description: 'Keep financial statements protected with enterprise cryptographic standards.', icon: 'Lock' },
      { title: 'Secure Client Document Uploads', description: 'Provide clients a secure link to upload tax returns and bank statements.', icon: 'UploadCloud' },
      { title: 'Legal Signature Certificates', description: 'Collect verified electronic signatures complete with IP and timestamp logs.', icon: 'FileCheck' },
      { title: 'Dynamic Recipient Stamping', description: 'Stamp client email and IP on financial summaries to prevent distribution.', icon: 'Eye' },
      { title: 'Automatic Retention Policies', description: 'Enforce automatic deletion of financial files after mandatory retention windows.', icon: 'Trash2' },
      { title: 'Immutable Compliance Logging', description: 'Maintain audit records ready for regulatory financial audits.', icon: 'Shield' }
    ],
    stats: [
      { value: '256-Bit', label: 'Encryption Protocol' },
      { value: '100%', label: 'Financial Audit Ready' },
      { value: '5x', label: 'Faster Client Intake' }
    ],
    howItWorks: [
      { step: 1, title: 'Upload Financial Files', description: 'Import tax returns, financial statements, or loan applications.' },
      { step: 2, title: 'Send Password-Protected Link', description: 'Deliver secure access links directly to clients or auditors.' },
      { step: 3, title: 'Track Views & Collect Signatures', description: 'Monitor client views and execute signed financial disclosures.' }
    ],
    relatedTemplates: [{ name: 'Service Agreement', slug: 'service-agreement-template' }, { name: 'Purchase Order', slug: 'purchase-order' }],
    relatedTools: [{ name: 'VDR Cost Calculator', slug: 'vdr-cost-calculator' }, { name: 'PDF Watermark Tool', slug: 'pdf-watermarking-tool' }],
    relatedGlossary: [{ name: 'SOC 2 Compliance', slug: 'soc-2' }, { name: 'AES-256 Encryption', slug: 'aes-256-encryption' }, { name: 'Audit Trail', slug: 'audit-trail' }],
    relatedIntegrations: [{ name: 'Microsoft 365', slug: 'microsoft-365' }, { name: 'Box', slug: 'box' }],
    faqs: [
      { question: 'Is DocTransfer safe for sharing tax returns and bank statements?', answer: 'Yes! DocTransfer utilizes bank-grade AES-256 encryption, password protection, and automated link expiration.' }
    ]
  }
];

export function getSolutionBySlug(slug: string): SolutionPage | undefined {
  return solutionsData.find(s => s.slug === slug);
}

export function getSolutionsByCategory(category: SolutionPage['category']): SolutionPage[] {
  return solutionsData.filter(s => s.category === category);
}
