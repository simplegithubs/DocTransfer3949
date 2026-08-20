export interface IntegrationPageData {
  slug: string;
  name: string;
  category: 'cloud-storage' | 'crm' | 'productivity' | 'automation';
  icon: string; // Lucide icon name or visual key
  tagline: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  overview: string;
  howItWorks: { step: number; title: string; description: string }[];
  benefits: string[];
  faqs: { question: string; answer: string }[];
  relatedIntegrations: string[];
  relatedTemplates: { name: string; slug: string }[];
}

export const integrationsList: IntegrationPageData[] = [
  {
    slug: 'google-drive',
    name: 'Google Drive',
    category: 'cloud-storage',
    icon: 'HardDrive',
    tagline: 'Layer page-by-page view tracking, watermarking, and DRM controls onto your Google Drive files.',
    metaTitle: 'Google Drive Integration — Secure Document Tracking & E-Sign | DocTransfer',
    metaDescription: 'Track who opens your Google Drive PDFs page-by-page. Add dynamic watermarking, viewer email gating, and self-destruct security controls to Google Drive files.',
    keywords: 'secure Google Drive sharing, Google Drive document tracking, track Google Drive PDF, DocSend Google Drive integration, secure file transfer google drive',
    overview: 'Google Drive is excellent for file storage and internal collaboration, but lacks granular security controls when sharing files externally. Once a Google Drive link is shared, you have no visibility into how long recipients read each page, whether they forward the link, or who downloads the file. DocTransfer connects with Google Drive to layer real-time page analytics, dynamic watermarking, and zero-knowledge encryption onto your cloud files.',
    howItWorks: [
      { step: 1, title: 'Import files from Google Drive', description: 'Select any PDF, presentation, or contract directly from your Google Drive workspace into DocTransfer.' },
      { step: 2, title: 'Set security & tracking rules', description: 'Enable email gating, dynamic watermarking, expiration dates, or disable PDF downloads.' },
      { step: 3, title: 'Share trackable link', description: 'Send a secure DocTransfer link instead of a standard Google Drive file attachment.' },
      { step: 4, title: 'Monitor page-level analytics', description: 'Get notified the moment a recipient opens your file and view exact time spent per slide or page.' }
    ],
    benefits: [
      'Page-by-page view duration analytics for all Google Drive PDFs',
      'Dynamic watermarks with recipient email overlay',
      'One-click access revocation even after sending',
      'Zero-knowledge client-side encryption support'
    ],
    faqs: [
      {
        question: 'Can I track who opens my Google Drive files with DocTransfer?',
        answer: 'Yes. By importing your Google Drive file into DocTransfer and sharing a DocTransfer link, you receive real-time notifications and page-by-page dwell time analytics whenever a recipient views your file.'
      },
      {
        question: 'Do my Google Drive files get modified?',
        answer: 'No. Your original Google Drive file remains untouched in your cloud storage. DocTransfer creates a secure, trackable streaming version for external viewers.'
      }
    ],
    relatedIntegrations: ['dropbox', 'onedrive', 'box', 'gmail'],
    relatedTemplates: [
      { name: 'Non-Disclosure Agreement (NDA)', slug: 'nda-template' },
      { name: 'Service Agreement', slug: 'service-agreement-template' }
    ]
  },
  {
    slug: 'dropbox',
    name: 'Dropbox',
    category: 'cloud-storage',
    icon: 'Box',
    tagline: 'Upgrade your Dropbox shared links with page-level reader analytics and self-destruct security.',
    metaTitle: 'Dropbox Integration — Secure File Analytics & Tracking | DocTransfer',
    metaDescription: 'Track who views your Dropbox files page-by-page. Add password protection, screenshot protection, and e-signatures to Dropbox document links.',
    keywords: 'Dropbox secure sharing alternative, track Dropbox files, Dropbox pitch deck tracking, DocSend Dropbox alternative, Dropbox document analytics',
    overview: 'Dropbox provides simple file sharing, but Standard shared links offer no viewer analytics or dynamic watermarking. DocTransfer integrates with Dropbox to give founders, legal teams, and sales reps full visibility into how recipients interact with shared files.',
    howItWorks: [
      { step: 1, title: 'Connect your Dropbox account', description: 'Import documents and pitch decks seamlessly from your Dropbox folders.' },
      { step: 2, title: 'Configure viewer permissions', description: 'Restrict printing/downloading, add dynamic watermarks, and require email verification.' },
      { step: 3, title: 'Distribute secure link', description: 'Send the DocTransfer link to prospects, investors, or clients.' },
      { step: 4, title: 'Track reader engagement', description: 'View heatmaps of time spent per page and get instant alerts on return visits.' }
    ],
    benefits: [
      'Detailed slide-by-slide dwell time for pitch decks',
      'Instant revocation of Dropbox shared link access',
      'Prevent unauthorized file downloads and print attempts',
      'Seamless e-signature integration for contracts'
    ],
    faqs: [
      {
        question: 'How is DocTransfer + Dropbox better than standard Dropbox links?',
        answer: 'Standard Dropbox links only tell you if a file was downloaded. DocTransfer provides real-time page-by-page engagement tracking, email gating, watermarking, and e-signature collection.'
      }
    ],
    relatedIntegrations: ['google-drive', 'onedrive', 'box'],
    relatedTemplates: [
      { name: 'Consulting Agreement', slug: 'consulting-agreement-template' }
    ]
  },
  {
    slug: 'onedrive',
    name: 'Microsoft OneDrive',
    category: 'cloud-storage',
    icon: 'Cloud',
    tagline: 'Enhance Microsoft OneDrive document sharing with page analytics, NDA gating, and audit trails.',
    metaTitle: 'Microsoft OneDrive Integration — Document Tracking | DocTransfer',
    metaDescription: 'Add document analytics and e-signatures to Microsoft OneDrive files. Track recipient reading time and secure confidential business proposals.',
    keywords: 'OneDrive document tracking, secure OneDrive file sharing, track Office 365 PDF, DocSend OneDrive integration',
    overview: 'Microsoft OneDrive is ideal for Office 365 users, but external sharing lacks deep document analytics. DocTransfer bridges the gap by providing granular page-level insights and security controls for all OneDrive documents.',
    howItWorks: [
      { step: 1, title: 'Select OneDrive documents', description: 'Pick Word, PowerPoint, or PDF files from your OneDrive library.' },
      { step: 2, title: 'Apply security layers', description: 'Add dynamic watermark overlays and set link expiration timers.' },
      { step: 3, title: 'Share and track', description: 'Receive instant notifications when clients or partners view your OneDrive files.' }
    ],
    benefits: [
      'Full compliance audit trail for external OneDrive file shares',
      'Track page reading time for sales proposals and financial reports',
      'Client-side E2EE encryption for zero-trust document security'
    ],
    faqs: [
      {
        question: 'Can I collect e-signatures on OneDrive files?',
        answer: 'Yes. DocTransfer allows you to import any contract or proposal from OneDrive and collect legally binding e-signatures with cryptographic audit trails.'
      }
    ],
    relatedIntegrations: ['google-drive', 'dropbox', 'microsoft-365', 'outlook'],
    relatedTemplates: [
      { name: 'Employment Contract', slug: 'employment-contract-template' }
    ]
  },
  {
    slug: 'box',
    name: 'Box',
    category: 'cloud-storage',
    icon: 'Archive',
    tagline: 'Enterprise-grade page tracking and e-signatures for Box cloud files.',
    metaTitle: 'Box Integration — Secure Document Analytics & Tracking | DocTransfer',
    metaDescription: 'Track Box file opens page-by-page. Free alternative to expensive enterprise data rooms for Box users.',
    keywords: 'Box alternative secure file transfer, Box pitch deck tracking, track Box documents, enterprise file tracking',
    overview: 'Box is popular among enterprise teams for governance, but adding simple page analytics or e-signatures often requires expensive add-ons. DocTransfer offers an affordable, lightweight solution for Box users to track and secure shared files.',
    howItWorks: [
      { step: 1, title: 'Import from Box', description: 'Connect your Box repository to import files into DocTransfer data rooms.' },
      { step: 2, title: 'Distribute securely', description: 'Share tracked links with customizable access permissions.' }
    ],
    benefits: [
      'Affordable alternative to expensive Box enterprise add-ons',
      'Detailed viewer drop-off metrics per page'
    ],
    faqs: [
      {
        question: 'Is DocTransfer compatible with Box security policies?',
        answer: 'Yes. DocTransfer provides AES-256 encrypted storage and client-side zero-knowledge security options.'
      }
    ],
    relatedIntegrations: ['google-drive', 'dropbox', 'onedrive'],
    relatedTemplates: [
      { name: 'Partnership Agreement', slug: 'partnership-agreement-template' }
    ]
  },
  {
    slug: 'gmail',
    name: 'Gmail',
    category: 'productivity',
    icon: 'Mail',
    tagline: 'Stop attaching raw PDFs in Gmail. Send trackable document links with page analytics directly from your inbox.',
    metaTitle: 'Gmail Integration — Track PDF Email Attachments | DocTransfer',
    metaDescription: 'Track PDF attachments sent in Gmail. See exact reading time per page, get instant open notifications, and revoke attachment access anytime.',
    keywords: 'track email attachments Gmail, secure Gmail pitch deck link, Gmail PDF tracking extension, DocSend Gmail integration',
    overview: 'Sending raw PDF attachments via Gmail creates serious security risks: once sent, you cannot prevent forwarding, revoke access, or know if the recipient actually read your document. DocTransfer replaces raw attachments with secure, trackable links that give you complete control.',
    howItWorks: [
      { step: 1, title: 'Upload document to DocTransfer', description: 'Drop your contract, deck, or proposal into DocTransfer.' },
      { step: 2, title: 'Paste link in Gmail', description: 'Insert the trackable link into your Gmail message.' },
      { step: 3, title: 'Get open & view alerts', description: 'Receive real-time notifications when your Gmail recipient opens the document.' }
    ],
    benefits: [
      'Prevent attachment forwarding and unauthorized downloads',
      'Know the exact moment a prospect opens your proposal in Gmail',
      'Revoke access to an attachment even after sending the email'
    ],
    faqs: [
      {
        question: 'Why should I use a DocTransfer link instead of a Gmail attachment?',
        answer: 'Gmail attachments can be forwarded endlessly and provide zero viewing feedback. DocTransfer links let you track reading time, restrict downloading, and revoke access at any point.'
      }
    ],
    relatedIntegrations: ['outlook', 'google-drive', 'google-workspace'],
    relatedTemplates: [
      { name: 'Non-Disclosure Agreement (NDA)', slug: 'nda-template' }
    ]
  },
  {
    slug: 'outlook',
    name: 'Microsoft Outlook',
    category: 'productivity',
    icon: 'MailCheck',
    tagline: 'Track Outlook document attachments with real-time page view notifications and access revocation.',
    metaTitle: 'Microsoft Outlook Integration — Track Attachment Reading Time | DocTransfer',
    metaDescription: 'Track document attachments sent in Outlook. Receive notifications when prospects read your proposals and contracts page-by-page.',
    keywords: 'track email attachments Outlook, secure Outlook file sharing, Outlook PDF tracking, Office 365 attachment security',
    overview: 'Outlook users frequently share confidential proposals, contracts, and financial statements. DocTransfer turns static Outlook attachments into dynamic, trackable links with cryptographic audit trails.',
    howItWorks: [
      { step: 1, title: 'Generate DocTransfer link', description: 'Upload your file to DocTransfer and configure access settings.' },
      { step: 2, title: 'Send via Outlook', description: 'Include the secure link in your Outlook email body.' },
      { step: 3, title: 'Monitor engagement', description: 'View detailed analytics on who opened the file and which pages were read.' }
    ],
    benefits: [
      'Eliminate file size attachment limits in Outlook',
      'Full compliance logging for corporate communications'
    ],
    faqs: [
      {
        question: 'Does DocTransfer work with Outlook web and desktop?',
        answer: 'Yes. DocTransfer links work seamlessly across all email clients including Outlook Desktop, Outlook Web, and mobile apps.'
      }
    ],
    relatedIntegrations: ['gmail', 'onedrive', 'microsoft-365'],
    relatedTemplates: [
      { name: 'Service Agreement', slug: 'service-agreement-template' }
    ]
  },
  {
    slug: 'salesforce',
    name: 'Salesforce',
    category: 'crm',
    icon: 'Briefcase',
    tagline: 'Sync document engagement metrics, proposal views, and e-signatures directly to Salesforce CRM records.',
    metaTitle: 'Salesforce Integration — Proposal Analytics & Document Tracking | DocTransfer',
    metaDescription: 'Sync proposal page views and contract e-signatures directly into Salesforce opportunities. Accelerate deal cycles with real-time engagement data.',
    keywords: 'Salesforce document tracking, CRM pitch deck analytics, Salesforce proposal tracking, DocSend Salesforce integration',
    overview: 'Sales teams need visibility into prospect engagement to close deals faster. DocTransfer connects document analytics with Salesforce opportunity records, letting sales reps know exactly when a buyer reviews a proposal or shares it with key stakeholders.',
    howItWorks: [
      { step: 1, title: 'Send proposal from DocTransfer', description: 'Share a tracked sales proposal or pitch deck link with your prospect.' },
      { step: 2, title: 'Track buyer behavior', description: 'Buyer views pages and shares the document internally.' },
      { step: 3, title: 'Sync to Salesforce', description: 'Document open events and view durations are logged directly to the relevant Salesforce Opportunity.' }
    ],
    benefits: [
      'Prioritize sales follow-ups based on real buyer dwell time',
      'Alert reps when prospects review pricing or terms slides',
      'Automate pipeline updates upon e-signature completion'
    ],
    faqs: [
      {
        question: 'How does document tracking help sales reps in Salesforce?',
        answer: 'Reps can see when a prospect spends 3+ minutes on the pricing slide, indicating strong buying intent and signaling the optimal time for a follow-up call.'
      }
    ],
    relatedIntegrations: ['hubspot', 'zapier', 'gmail'],
    relatedTemplates: [
      { name: 'Sales Contract', slug: 'service-agreement-template' }
    ]
  },
  {
    slug: 'hubspot',
    name: 'HubSpot',
    category: 'crm',
    icon: 'Layers',
    tagline: 'Log proposal opens, deck views, and deal contract signatures automatically in HubSpot CRM.',
    metaTitle: 'HubSpot Integration — Sales Document Tracking & Analytics | DocTransfer',
    metaDescription: 'Track sales proposals and pitch decks inside HubSpot CRM. Get instant deal notifications when prospects review your contracts.',
    keywords: 'HubSpot proposal tracking, track sales deck HubSpot, HubSpot document e-sign, DocSend HubSpot integration',
    overview: 'HubSpot CRM users can supercharge their sales pipeline by pairing deal records with page-level document tracking from DocTransfer. Turn static PDF quotes into interactive sales engagement assets.',
    howItWorks: [
      { step: 1, title: 'Create tracked proposal link', description: 'Generate a secure link in DocTransfer for your sales quote.' },
      { step: 2, title: 'Send to lead', description: 'Distribute via HubSpot email templates or deal tasks.' },
      { step: 3, title: 'Track inside CRM', description: 'View recipient dwell time and signature status on the deal timeline.' }
    ],
    benefits: [
      'Shorter sales cycles with timely buyer follow-up',
      'Automatic deal status updates upon contract signature'
    ],
    faqs: [
      {
        question: 'Can I use DocTransfer for free with HubSpot CRM?',
        answer: 'Yes! DocTransfer offers a generous free plan that includes page-by-page analytics for all your sales proposals.'
      }
    ],
    relatedIntegrations: ['salesforce', 'zapier', 'gmail'],
    relatedTemplates: [
      { name: 'Consulting Agreement', slug: 'consulting-agreement-template' }
    ]
  },
  {
    slug: 'zapier',
    name: 'Zapier',
    category: 'automation',
    icon: 'Zap',
    tagline: 'Connect DocTransfer to 5,000+ apps to automate document workflows, alerts, and notifications.',
    metaTitle: 'Zapier Integration — Automate Document Workflows & Alerts | DocTransfer',
    metaDescription: 'Automate document sharing, e-signature triggers, and instant Slack/Email alerts with DocTransfer + Zapier. Connect to 5,000+ business tools.',
    keywords: 'automate document sharing Zapier, Zapier e-signature workflow, DocSend Zapier integration, document automation',
    overview: 'Zapier allows you to connect DocTransfer with thousands of web applications without writing code. Automatically trigger Slack notifications when a pitch deck is opened, create CRM contacts upon NDA signature, or archive signed contracts in cloud storage.',
    howItWorks: [
      { step: 1, title: 'Create a Zapier trigger', description: 'Choose events like "Document Viewed", "Page Read > 2 mins", or "Signature Completed".' },
      { step: 2, title: 'Select target app', description: 'Connect to Slack, Google Sheets, Airtable, HubSpot, or Trello.' },
      { step: 3, title: 'Automate workflow', description: 'Let Zapier handle background updates automatically.' }
    ],
    benefits: [
      'Real-time Slack/Teams alerts when investors view pitch decks',
      'Automated contact creation upon NDA submission',
      'Seamless multi-app document archiving'
    ],
    faqs: [
      {
        question: 'What triggers are supported in DocTransfer + Zapier?',
        answer: 'Supported triggers include Document Opened, High Engagement View, Document Signed, and Access Revoked.'
      }
    ],
    relatedIntegrations: ['make', 'slack', 'google-drive', 'hubspot'],
    relatedTemplates: [
      { name: 'Non-Disclosure Agreement (NDA)', slug: 'nda-template' }
    ]
  },
  {
    slug: 'make',
    name: 'Make (Integromat)',
    category: 'automation',
    icon: 'Cpu',
    tagline: 'Build complex multi-step document automation scenarios with Make and DocTransfer.',
    metaTitle: 'Make Integration — Advanced Document Workflow Automation | DocTransfer',
    metaDescription: 'Build visual document workflows using Make (Integromat) + DocTransfer. Automate data room access, e-signatures, and webhooks.',
    keywords: 'document workflow automation Make, Make file tracking, Integromat document e-sign, visual document automation',
    overview: 'Make provides advanced visual workflow automation for power users. Pair DocTransfer\'s webhooks and API with Make to construct complex document approval chains, data room provisioning, and automated reporting.',
    howItWorks: [
      { step: 1, title: 'Set up Make scenario', description: 'Add DocTransfer module triggers for file view or sign events.' },
      { step: 2, title: 'Map data fields', description: 'Route signer details, IP addresses, and timestamps to downstream systems.' }
    ],
    benefits: [
      'Visual drag-and-drop scenario builder',
      'Multi-branch logic for complex legal and financial approvals'
    ],
    faqs: [
      {
        question: 'Does DocTransfer support webhooks for Make?',
        answer: 'Yes. DocTransfer exposes real-time webhook endpoints for instant event processing.'
      }
    ],
    relatedIntegrations: ['zapier', 'slack', 'google-drive'],
    relatedTemplates: [
      { name: 'Service Agreement', slug: 'service-agreement-template' }
    ]
  },
  {
    slug: 'notion',
    name: 'Notion',
    category: 'productivity',
    icon: 'FileText',
    tagline: 'Embed trackable DocTransfer documents and e-signature forms directly into Notion workspaces.',
    metaTitle: 'Notion Integration — Embed Trackable Documents & E-Sign | DocTransfer',
    metaDescription: 'Embed trackable PDFs and e-signature contracts inside Notion pages. Share Notion pitch decks and proposals with page-level analytics.',
    keywords: 'Notion document signing, export Notion to secure PDF, embed trackable PDF Notion, Notion proposal e-sign',
    overview: 'Notion is popular for creating company wikis, pitch decks, and client portals. By embedding DocTransfer links inside Notion or exporting Notion pages to trackable PDFs, teams gain full visibility into external reader engagement.',
    howItWorks: [
      { step: 1, title: 'Export Notion page to PDF', description: 'Export your Notion proposal or pitch deck as a PDF file.' },
      { step: 2, title: 'Upload to DocTransfer', description: 'Generate a secure, trackable link with page analytics.' },
      { step: 3, title: 'Embed or share', description: 'Embed the live viewer back into Notion or share directly with clients.' }
    ],
    benefits: [
      'Turn static Notion exports into trackable sales assets',
      'Collect binding e-signatures on Notion-created contracts'
    ],
    faqs: [
      {
        question: 'Can I track who reads PDFs exported from Notion?',
        answer: 'Yes! Upload the exported PDF to DocTransfer, and you will get exact page-by-page viewing metrics for every reader.'
      }
    ],
    relatedIntegrations: ['slack', 'google-drive', 'zapier'],
    relatedTemplates: [
      { name: 'Freelance Agreement', slug: 'freelance-agreement-template' }
    ]
  },
  {
    slug: 'slack',
    name: 'Slack',
    category: 'productivity',
    icon: 'MessageSquare',
    tagline: 'Get instant Slack notifications the second an investor or client opens your shared document.',
    metaTitle: 'Slack Integration — Instant Document Open & View Alerts | DocTransfer',
    metaDescription: 'Receive real-time Slack alerts when prospects view your pitch deck or sign contracts. Never miss a buyer engagement signal.',
    keywords: 'share documents securely Slack, Slack document tracking notification, Slack pitch deck alert, DocSend Slack integration',
    overview: 'Timing is everything in sales and fundraising. The DocTransfer + Slack integration sends instant channel alerts whenever a recipient opens your file, spends over 2 minutes reading, or completes an e-signature.',
    howItWorks: [
      { step: 1, title: 'Connect Slack channel', description: 'Choose a dedicated Slack channel (e.g. #deal-alerts or #investor-updates).' },
      { step: 2, title: 'Share DocTransfer links', description: 'Send tracked links to your external contacts.' },
      { step: 3, title: 'Receive live alerts', description: 'Get notified in Slack the moment your file is viewed.' }
    ],
    benefits: [
      'Instant channel alerts when investors open pitch decks',
      'Team-wide visibility into deal contract signing events'
    ],
    faqs: [
      {
        question: 'Can I customize which Slack channel receives alerts?',
        answer: 'Yes. You can route alerts to private channels, team channels, or direct messages based on document type.'
      }
    ],
    relatedIntegrations: ['zapier', 'gmail', 'notion'],
    relatedTemplates: [
      { name: 'Non-Disclosure Agreement (NDA)', slug: 'nda-template' }
    ]
  },
  {
    slug: 'docusign',
    name: 'DocuSign Migration',
    category: 'productivity',
    icon: 'FileCheck',
    tagline: 'Migrate active PDF templates from DocuSign to DocTransfer and save up to 80% on annual e-signature costs.',
    metaTitle: 'DocuSign Integration & Migration — Free E-Signature Switch | DocTransfer',
    metaDescription: 'Switch from DocuSign to DocTransfer in 5 minutes. Import PDF templates, set up drag-and-drop signing fields, and access page tracking for free.',
    keywords: 'DocuSign to DocTransfer migration, import DocuSign templates, DocuSign alternative switch, free e-signature tool',
    overview: 'DocuSign charges expensive per-envelope fees and locks document analytics behind enterprise plans. DocTransfer makes it simple to migrate your existing contract templates and enjoy unlimited signatures with page tracking included.',
    howItWorks: [
      { step: 1, title: 'Export DocuSign PDFs', description: 'Download your active contract and template PDFs from DocuSign.' },
      { step: 2, title: 'Import to DocTransfer', description: 'Upload files to your DocTransfer template library.' },
      { step: 3, title: 'Add signature fields', description: 'Use our drag-and-drop builder to place signature, date, and text fields.' }
    ],
    benefits: [
      'Save up to 80% compared to DocuSign per-user pricing',
      'Gain page-level reader analytics included free'
    ],
    faqs: [
      {
        question: 'Are signatures collected on DocTransfer as legally valid as DocuSign?',
        answer: 'Yes. DocTransfer e-signatures comply fully with the ESIGN Act, UETA, and eIDAS regulations, featuring complete audit logs and cryptographic verification.'
      }
    ],
    relatedIntegrations: ['gmail', 'google-drive', 'outlook'],
    relatedTemplates: [
      { name: 'Subcontractor Agreement', slug: 'subcontractor-agreement-template' }
    ]
  },
  {
    slug: 'google-workspace',
    name: 'Google Workspace',
    category: 'productivity',
    icon: 'Folder',
    tagline: 'Enterprise document security, page tracking, and e-signatures tailored for Google Workspace domains.',
    metaTitle: 'Google Workspace Integration — Secure File Analytics | DocTransfer',
    metaDescription: 'Secure Google Workspace document sharing. Add page analytics, dynamic watermarks, and DRM controls across your organization.',
    keywords: 'Google Workspace secure file transfer, Google Workspace e-sign, Google Docs tracking, Google Slides pitch deck',
    overview: 'Google Workspace teams can combine Google Docs, Sheets, and Slides with DocTransfer to deploy domain-wide document tracking, external viewer gating, and legal e-signatures.',
    howItWorks: [
      { step: 1, title: 'Export Workspace files', description: 'Export Google Slides decks or Google Docs proposals as PDFs.' },
      { step: 2, title: 'Share with DocTransfer security', description: 'Distribute secure links with viewer verification enabled.' }
    ],
    benefits: [
      'Domain-wide document tracking policies',
      'Centralized compliance audit logs for external file shares'
    ],
    faqs: [
      {
        question: 'Does DocTransfer support Google Workspace single sign-on (SSO)?',
        answer: 'Yes! Users can sign in seamlessly using their Google Workspace accounts.'
      }
    ],
    relatedIntegrations: ['google-drive', 'gmail', 'slack'],
    relatedTemplates: [
      { name: 'Service Agreement', slug: 'service-agreement-template' }
    ]
  },
  {
    slug: 'microsoft-365',
    name: 'Microsoft 365',
    category: 'productivity',
    icon: 'Shield',
    tagline: 'Empower Microsoft 365 enterprise users with advanced document engagement heatmaps and secure data rooms.',
    metaTitle: 'Microsoft 365 Integration — Document Security & Analytics | DocTransfer',
    metaDescription: 'Add page-level analytics and zero-knowledge encryption to Microsoft 365 files. Secure PowerPoint pitch decks and Word proposals.',
    keywords: 'Microsoft 365 document tracking, Office 365 secure sharing, PowerPoint pitch deck tracking, Word document e-sign',
    overview: 'Microsoft 365 enterprise environments benefit from pairing Word and PowerPoint workflows with DocTransfer\'s advanced reader heatmaps, DRM download prevention, and client-side encryption.',
    howItWorks: [
      { step: 1, title: 'Convert Word/PowerPoint to PDF', description: 'Save your Office 365 presentation or proposal as a PDF file.' },
      { step: 2, title: 'Share via DocTransfer data room', description: 'Distribute with full page analytics and watermark protection.' }
    ],
    benefits: [
      'Granular slide-by-slide dwell time for PowerPoint pitch decks',
      'E-signature collection for Word-based contracts'
    ],
    faqs: [
      {
        question: 'Can I prevent recipients from printing or downloading Microsoft 365 files?',
        answer: 'Yes! DocTransfer allows you to lock downloads and present files in a secure browser-only viewer.'
      }
    ],
    relatedIntegrations: ['onedrive', 'outlook', 'box'],
    relatedTemplates: [
      { name: 'Employment Contract', slug: 'employment-contract-template' }
    ]
  }
];

export function getIntegrationBySlug(slug: string): IntegrationPageData | undefined {
  return integrationsList.find(i => i.slug === slug);
}
