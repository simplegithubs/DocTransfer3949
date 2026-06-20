export interface TemplateField {
    id: string;
    label: string;
    type: 'text' | 'date' | 'number' | 'email' | 'select' | 'checkbox';
    placeholder?: string;
    required: boolean;
    defaultValue: string | boolean;
    options?: string[];
    step: number;
    helpText?: string;
}

export interface DocumentSection {
    type: 'title' | 'subtitle' | 'header' | 'paragraph' | 'bullet' | 'table' | 'signature-block';
    text?: string;
    items?: string[];
    headers?: string[];
    rows?: string[][];
}

export interface Template {
    id: string;
    name: string;
    category: 'hr' | 'legal' | 'sales';
    categoryLabel: string;
    description: string;
    estimatedTime: string;
    pagesCount: number;
    popularity: number; // 1 to 5 stars or scale
    fields: TemplateField[];
    generateContent: (values: Record<string, any>) => DocumentSection[];
}

export const TEMPLATE_CATEGORIES = [
    { id: 'all', label: 'All Templates', color: '#6366f1' },
    { id: 'hr', label: 'Employment & HR', color: '#ec4899' },
    { id: 'legal', label: 'Legal & Liability', color: '#ef4444' },
    { id: 'sales', label: 'Sales & Finance', color: '#10b981' }
];

export const TEMPLATES: Template[] = [
    // =====================================================
    // EMPLOYMENT & HR
    // =====================================================
    {
        id: 'offer-letter',
        name: 'Job Offer Letter',
        category: 'hr',
        categoryLabel: 'Employment & HR',
        description: 'Professional employment offer letter outlining candidate role, start date, compensation, and reporting manager.',
        estimatedTime: '2 mins',
        pagesCount: 1,
        popularity: 5,
        fields: [
            { id: 'companyName', label: 'Company Name', type: 'text', placeholder: 'Acme Corp', required: true, defaultValue: '', step: 1 },
            { id: 'candidateName', label: 'Candidate Full Name', type: 'text', placeholder: 'John Doe', required: true, defaultValue: '', step: 1 },
            { id: 'jobTitle', label: 'Job Title', type: 'text', placeholder: 'Senior Software Engineer', required: true, defaultValue: '', step: 1 },
            { id: 'annualSalary', label: 'Annual Salary ($)', type: 'number', placeholder: '120000', required: true, defaultValue: '', step: 2, helpText: 'Base annual salary in USD' },
            { id: 'startDate', label: 'Start Date', type: 'date', required: true, defaultValue: '', step: 2 },
            { id: 'managerName', label: 'Reporting Manager', type: 'text', placeholder: 'Jane Smith', required: true, defaultValue: '', step: 2 },
            { id: 'managerTitle', label: 'Manager Job Title', type: 'text', placeholder: 'VP of Engineering', required: true, defaultValue: '', step: 2 },
            { id: 'expirationDate', label: 'Offer Expiration Date', type: 'date', required: true, defaultValue: '', step: 3 }
        ],
        generateContent: (val) => [
            { type: 'title', text: `${val.companyName || '[Company Name]'}` },
            { type: 'subtitle', text: 'CONFIDENTIAL EMPLOYMENT OFFER' },
            { type: 'paragraph', text: `Date: ${new Date().toLocaleDateString()}` },
            { type: 'paragraph', text: `Dear ${val.candidateName || '[Candidate Name]'},` },
            { type: 'paragraph', text: `On behalf of ${val.companyName || '[Company Name]'}, I am absolutely thrilled to offer you the position of ${val.jobTitle || '[Job Title]'}. We were incredibly impressed by your experience and are confident you will make a significant impact on our team.` },
            { type: 'header', text: '1. Position & Duties' },
            { type: 'paragraph', text: `In this capacity, you will report directly to ${val.managerName || '[Manager Name]'}, ${val.managerTitle || '[Manager Title]'}. Your duties will include the standard responsibilities associated with the role, as well as additional projects that align with company priorities.` },
            { type: 'header', text: '2. Compensation & Benefits' },
            { type: 'paragraph', text: `For this position, your starting annual base salary will be $${Number(val.annualSalary || 0).toLocaleString()} USD, subject to standard withholdings and deductions, paid semi-monthly. Additionally, you will be eligible to participate in our comprehensive benefits package, including health insurance, 401(k) matching, and our unlimited Paid Time Off (PTO) policy.` },
            { type: 'header', text: '3. Terms of Employment' },
            { type: 'paragraph', text: `Your anticipated start date will be ${val.startDate ? new Date(val.startDate).toLocaleDateString() : '[Start Date]'}. Please note that employment with the Company is "at-will," meaning that either you or the Company may terminate the employment relationship at any time, with or without cause.` },
            { type: 'header', text: '4. Acceptance' },
            { type: 'paragraph', text: `This offer is contingent upon the successful completion of standard reference checks and background screening. To accept this offer, please sign and return this letter by ${val.expirationDate ? new Date(val.expirationDate).toLocaleDateString() : '[Expiration Date]'}, after which this offer will expire.` },
            { type: 'paragraph', text: 'Sincerely,' },
            { type: 'paragraph', text: `${val.managerName || '[Manager Name]'}\n${val.managerTitle || '[Manager Title]'}\n${val.companyName || '[Company Name]'}` },
            { type: 'signature-block', text: 'SIGNATURES' }
        ]
    },
    {
        id: 'nda',
        name: 'Mutual NDA',
        category: 'hr',
        categoryLabel: 'Employment & HR',
        description: 'Standard two-party mutual non-disclosure agreement to protect confidential info shared during business discussions.',
        estimatedTime: '3 mins',
        pagesCount: 2,
        popularity: 5,
        fields: [
            { id: 'partyAName', label: 'Company A Name (Discloser)', type: 'text', placeholder: 'DocTransfer Inc.', required: true, defaultValue: '', step: 1 },
            { id: 'partyBName', label: 'Company B Name (Recipient)', type: 'text', placeholder: 'Client Corp', required: true, defaultValue: '', step: 1 },
            { id: 'effectiveDate', label: 'Effective Date', type: 'date', required: true, defaultValue: '', step: 1 },
            { id: 'purpose', label: 'Purpose of Discussion', type: 'text', placeholder: 'evaluating a potential business partnership', required: true, defaultValue: '', step: 2, helpText: 'What discussions is this NDA protecting?' },
            { id: 'termYears', label: 'Duration of Protection (Years)', type: 'number', placeholder: '3', required: true, defaultValue: '3', step: 2 },
            { id: 'governingState', label: 'Governing State/Jurisdiction', type: 'text', placeholder: 'Delaware', required: true, defaultValue: '', step: 3 }
        ],
        generateContent: (val) => [
            { type: 'title', text: 'MUTUAL NON-DISCLOSURE AGREEMENT' },
            { type: 'subtitle', text: `Effective Date: ${val.effectiveDate ? new Date(val.effectiveDate).toLocaleDateString() : '[Effective Date]'}` },
            { type: 'paragraph', text: `This Mutual Non-Disclosure Agreement ("Agreement") is entered into by and between ${val.partyAName || '[Company A]'} and ${val.partyBName || '[Company B]'} (each a "Party", and collectively the "Parties").` },
            { type: 'header', text: '1. Purpose' },
            { type: 'paragraph', text: `The Parties wish to explore a potential business relationship in connection with ${val.purpose || '[Purpose of Discussion]'}. In connection with this, the Parties may share proprietary technical and business information.` },
            { type: 'header', text: '2. Confidential Information' },
            { type: 'paragraph', text: `"Confidential Information" means any information disclosed by one Party to the other Party that is marked as confidential or that should reasonably be understood to be confidential given the nature of the information. This includes, without limitation, source code, designs, product roadmaps, financial data, and customer lists.` },
            { type: 'header', text: '3. Obligations' },
            { type: 'paragraph', text: 'The receiving Party agrees to: (a) hold the disclosing Party\'s Confidential Information in strict confidence; (b) restrict disclosure of the Confidential Information to employees and contractors who have a strict need-to-know; and (c) protect the Confidential Information with the same degree of care it uses for its own confidential info (but no less than reasonable care).' },
            { type: 'header', text: '4. Term and Termination' },
            { type: 'paragraph', text: `This Agreement and the duty to protect Confidential Information shall continue in effect for a period of ${val.termYears || '3'} years from the Effective Date, or until such time as the Confidential Information enters the public domain through no fault of the receiving Party.` },
            { type: 'header', text: '5. Governing Law' },
            { type: 'paragraph', text: `This Agreement shall be governed by, and construed in accordance with, the laws of the State of ${val.governingState || '[Governing State]'}, without reference to its conflict of laws principles.` },
            { type: 'signature-block', text: 'SIGNATURES' }
        ]
    },
    {
        id: 'w4-form',
        name: 'W-4 Certificate',
        category: 'hr',
        categoryLabel: 'Employment & HR',
        description: 'Formatted Employee\'s Withholding Certificate containing filing status, dependents, and extra withholding adjustments.',
        estimatedTime: '3 mins',
        pagesCount: 1,
        popularity: 4,
        fields: [
            { id: 'firstName', label: 'First Name & Initial', type: 'text', placeholder: 'Jane A.', required: true, defaultValue: '', step: 1 },
            { id: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Smith', required: true, defaultValue: '', step: 1 },
            { id: 'ssn', label: 'Social Security Number (SSN)', type: 'text', placeholder: '000-00-0000', required: true, defaultValue: '', step: 1 },
            { id: 'address', label: 'Home Address', type: 'text', placeholder: '123 Main St, New York, NY 10001', required: true, defaultValue: '', step: 1 },
            { id: 'filingStatus', label: 'Filing Status', type: 'select', options: ['Single or Married filing separately', 'Married filing jointly', 'Head of household'], required: true, defaultValue: 'Single or Married filing separately', step: 2 },
            { id: 'multipleJobs', label: 'Multiple Jobs / Spouse Works', type: 'checkbox', required: false, defaultValue: false, step: 2, helpText: 'Check if you hold more than one job or are married filing jointly and spouse works.' },
            { id: 'dependentsAmount', label: 'Claim Dependents ($)', type: 'number', placeholder: '2000', required: false, defaultValue: '0', step: 3, helpText: 'Multiply dependents under 17 by $2,000 and other dependents by $500' },
            { id: 'extraWithholding', label: 'Extra Withholding ($)', type: 'number', placeholder: '100', required: false, defaultValue: '0', step: 3, helpText: 'Any additional tax withholding per pay period' }
        ],
        generateContent: (val) => [
            { type: 'title', text: 'Form W-4 - Employee\'s Withholding Certificate' },
            { type: 'subtitle', text: 'Department of the Treasury - Internal Revenue Service' },
            { type: 'paragraph', text: 'Complete Form W-4 so that your employer can withhold the correct federal income tax from your pay. Your withholding is subject to review by the IRS.' },
            { type: 'header', text: 'Step 1: Personal Information' },
            { type: 'table', headers: ['Field', 'Employee Details'], rows: [
                ['Full Name', `${val.firstName || ''} ${val.lastName || ''}`.trim() || '[Name]'],
                ['SSN', val.ssn || '[SSN]'],
                ['Address', val.address || '[Address]'],
                ['Filing Status', val.filingStatus || '[Filing Status]']
            ]},
            { type: 'header', text: 'Step 2: Multiple Jobs or Spouse Works' },
            { type: 'paragraph', text: val.multipleJobs ? '☑ Yes, I hold multiple jobs or my spouse works and we select the standard withholding adjustment.' : '☐ No, this step is not applicable to my circumstances.' },
            { type: 'header', text: 'Step 3: Claim Dependent Allowances' },
            { type: 'paragraph', text: `Total credit amount claimed for qualifying children and dependents: $${Number(val.dependentsAmount || 0).toLocaleString()}` },
            { type: 'header', text: 'Step 4: Other Adjustments' },
            { type: 'paragraph', text: `Any extra tax withholding requested per pay period: $${Number(val.extraWithholding || 0).toLocaleString()}` },
            { type: 'paragraph', text: 'Under penalties of perjury, I declare that this certificate, to the best of my knowledge and belief, is true, correct, and complete.' },
            { type: 'signature-block', text: 'SIGNATURES' }
        ]
    },
    {
        id: 'i9-form',
        name: 'I-9 Eligibility Verification',
        category: 'hr',
        categoryLabel: 'Employment & HR',
        description: 'Employment Eligibility Verification form covering citizenship verification and document credentials.',
        estimatedTime: '4 mins',
        pagesCount: 1,
        popularity: 4,
        fields: [
            { id: 'lastName', label: 'Last Name (Family Name)', type: 'text', placeholder: 'Doe', required: true, defaultValue: '', step: 1 },
            { id: 'firstName', label: 'First Name (Given Name)', type: 'text', placeholder: 'John', required: true, defaultValue: '', step: 1 },
            { id: 'address', label: 'Address', type: 'text', placeholder: '456 Oak Ave, Austin, TX 78701', required: true, defaultValue: '', step: 1 },
            { id: 'dob', label: 'Date of Birth', type: 'date', required: true, defaultValue: '', step: 1 },
            { id: 'ssn', label: 'Social Security Number', type: 'text', placeholder: '000-00-0000', required: true, defaultValue: '', step: 1 },
            { id: 'citizenship', label: 'Citizenship Status', type: 'select', options: ['A citizen of the United States', 'A noncitizen national of the United States', 'A lawful permanent resident', 'An alien authorized to work'], required: true, defaultValue: 'A citizen of the United States', step: 2 },
            { id: 'docTitle', label: 'Verification Document Title', type: 'text', placeholder: 'U.S. Passport', required: true, defaultValue: '', step: 3, helpText: 'e.g. Passport, Permanent Resident Card, Driver License & SSN card' },
            { id: 'docNumber', label: 'Document Number', type: 'text', placeholder: 'PH1234567', required: true, defaultValue: '', step: 3 },
            { id: 'docExpiration', label: 'Document Expiration Date', type: 'date', required: false, defaultValue: '', step: 3 }
        ],
        generateContent: (val) => [
            { type: 'title', text: 'Form I-9 - Employment Eligibility Verification' },
            { type: 'subtitle', text: 'U.S. Citizenship and Immigration Services (USCIS)' },
            { type: 'paragraph', text: 'Use Form I-9 to verify the identity and employment authorization of individuals hired for employment in the United States.' },
            { type: 'header', text: 'Section 1: Employee Information and Attestation' },
            { type: 'table', headers: ['Item', 'Details'], rows: [
                ['Last Name', val.lastName || '[Last Name]'],
                ['First Name', val.firstName || '[First Name]'],
                ['Date of Birth', val.dob ? new Date(val.dob).toLocaleDateString() : '[DOB]'],
                ['SSN', val.ssn || '[SSN]'],
                ['Address', val.address || '[Address]']
            ]},
            { type: 'paragraph', text: `I attest, under penalty of perjury, that I am: **${val.citizenship || '[Citizenship Status]'}**.` },
            { type: 'header', text: 'Section 2: Employer Review and Verification' },
            { type: 'paragraph', text: 'The employer must examine credentials to verify the identity and employment eligibility of the employee.' },
            { type: 'table', headers: ['Document Detail', 'Credential Value'], rows: [
                ['Document Title', val.docTitle || '[Document Title]'],
                ['Document Number', val.docNumber || '[Document Number]'],
                ['Expiration Date', val.docExpiration ? new Date(val.docExpiration).toLocaleDateString() : 'N/A']
            ]},
            { type: 'paragraph', text: 'I attest that I have examined the document(s) listed above, that they appear to be genuine, and that the employee is authorized to work in the United States.' },
            { type: 'signature-block', text: 'SIGNATURES' }
        ]
    },

    // =====================================================
    // LEGAL & LIABILITY
    // =====================================================
    {
        id: 'llc-operating',
        name: 'LLC Operating Agreement',
        category: 'legal',
        categoryLabel: 'Legal & Liability',
        description: 'Governing document detailing Limited Liability Company structure, member interests, and capital contributions.',
        estimatedTime: '4 mins',
        pagesCount: 2,
        popularity: 5,
        fields: [
            { id: 'llcName', label: 'LLC Name', type: 'text', placeholder: 'Alpha Tech LLC', required: true, defaultValue: '', step: 1 },
            { id: 'state', label: 'State of Organization', type: 'text', placeholder: 'Delaware', required: true, defaultValue: '', step: 1 },
            { id: 'effectiveDate', label: 'Effective Date', type: 'date', required: true, defaultValue: '', step: 1 },
            { id: 'member1Name', label: 'Member 1 Full Name', type: 'text', placeholder: 'Alice Cooper', required: true, defaultValue: '', step: 2 },
            { id: 'member1Pct', label: 'Member 1 Interest (%)', type: 'number', placeholder: '60', required: true, defaultValue: '60', step: 2 },
            { id: 'member2Name', label: 'Member 2 Full Name', type: 'text', placeholder: 'Bob Dylan', required: true, defaultValue: '', step: 2 },
            { id: 'member2Pct', label: 'Member 2 Interest (%)', type: 'number', placeholder: '40', required: true, defaultValue: '40', step: 2 },
            { id: 'agentName', label: 'Registered Agent Name', type: 'text', placeholder: 'Delaware Agent Services', required: true, defaultValue: '', step: 3 },
            { id: 'agentAddress', label: 'Registered Agent Address', type: 'text', placeholder: '1209 Orange St, Wilmington, DE 19801', required: true, defaultValue: '', step: 3 }
        ],
        generateContent: (val) => [
            { type: 'title', text: `OPERATING AGREEMENT OF ${val.llcName ? val.llcName.toUpperCase() : '[LLC NAME]'}` },
            { type: 'subtitle', text: `A Limited Liability Company organized under the laws of ${val.state || '[State]'}` },
            { type: 'paragraph', text: `This Operating Agreement ("Agreement") is made effective as of ${val.effectiveDate ? new Date(val.effectiveDate).toLocaleDateString() : '[Effective Date]'}, by the members listed herein.` },
            { type: 'header', text: '1. Formation' },
            { type: 'paragraph', text: `The Members have formed a Limited Liability Company named ${val.llcName || '[LLC Name]'} pursuant to the Limited Liability Company Act of the State of ${val.state || '[State]'}.` },
            { type: 'header', text: '2. Registered Office & Agent' },
            { type: 'paragraph', text: `The Registered Agent for service of process shall be ${val.agentName || '[Agent Name]'}, located at the registered office address: ${val.agentAddress || '[Agent Address]'}.` },
            { type: 'header', text: '3. Member Ownership Interests' },
            { type: 'paragraph', text: 'The capital contributions and ownership percentages of the Members are established as follows:' },
            { type: 'table', headers: ['Member Name', 'Capital Contribution', 'Ownership Interest (%)'], rows: [
                [val.member1Name || '[Member 1]', 'To be determined', `${val.member1Pct || 50}%`],
                [val.member2Name || '[Member 2]', 'To be determined', `${val.member2Pct || 50}%`]
            ]},
            { type: 'header', text: '4. Management' },
            { type: 'paragraph', text: 'The Company shall be managed by its Members. Actions requiring a vote shall require the affirmative vote of Members holding a majority of the ownership interests.' },
            { type: 'header', text: '5. Distributions & Tax' },
            { type: 'paragraph', text: 'Profits and losses shall be allocated and distributed to the Members in proportion to their ownership interests, at such times as decided by the Members.' },
            { type: 'signature-block', text: 'SIGNATURES' }
        ]
    },
    {
        id: 'sublease',
        name: 'Sublease Agreement',
        category: 'legal',
        categoryLabel: 'Legal & Liability',
        description: 'Agreement enabling a primary tenant to rent property to a subtenant, with landlord consent terms.',
        estimatedTime: '3 mins',
        pagesCount: 2,
        popularity: 4,
        fields: [
            { id: 'tenantName', label: 'Primary Tenant Name', type: 'text', placeholder: 'Sarah Connor', required: true, defaultValue: '', step: 1 },
            { id: 'subtenantName', label: 'Subtenant Name', type: 'text', placeholder: 'John Connor', required: true, defaultValue: '', step: 1 },
            { id: 'propertyAddress', label: 'Property Address', type: 'text', placeholder: '742 Evergreen Terrace, Springfield', required: true, defaultValue: '', step: 1 },
            { id: 'startDate', label: 'Sublease Start Date', type: 'date', required: true, defaultValue: '', step: 2 },
            { id: 'endDate', label: 'Sublease End Date', type: 'date', required: true, defaultValue: '', step: 2 },
            { id: 'rent', label: 'Monthly Rent ($)', type: 'number', placeholder: '1500', required: true, defaultValue: '', step: 3 },
            { id: 'deposit', label: 'Security Deposit ($)', type: 'number', placeholder: '1000', required: true, defaultValue: '', step: 3 }
        ],
        generateContent: (val) => [
            { type: 'title', text: 'SUBLEASE AGREEMENT' },
            { type: 'subtitle', text: 'RESIDENTIAL LEASE SUBLET CONTRACT' },
            { type: 'paragraph', text: `This Sublease Agreement is entered into by and between ${val.tenantName || '[Primary Tenant]'} ("Tenant") and ${val.subtenantName || '[Subtenant]'} ("Subtenant") for the property located at ${val.propertyAddress || '[Property Address]'}.` },
            { type: 'header', text: '1. Term of Sublease' },
            { type: 'paragraph', text: `The sublease term shall begin on ${val.startDate ? new Date(val.startDate).toLocaleDateString() : '[Start Date]'} and shall expire on ${val.endDate ? new Date(val.endDate).toLocaleDateString() : '[End Date]'}, unless terminated earlier in accordance with the terms of the Master Lease.` },
            { type: 'header', text: '2. Rent Payment' },
            { type: 'paragraph', text: `Subtenant agrees to pay Monthly Rent of $${Number(val.rent || 0).toLocaleString()} USD, payable in advance on the 1st day of each calendar month. Payments shall be made directly to the Tenant.` },
            { type: 'header', text: '3. Security Deposit' },
            { type: 'paragraph', text: `Upon execution of this sublease, Subtenant shall deposit with Tenant the sum of $${Number(val.deposit || 0).toLocaleString()} USD as security for any damage caused to the premises. The deposit will be returned within 30 days of sublease expiration, minus any lawful deductions.` },
            { type: 'header', text: '4. Master Lease & Landlord Consent' },
            { type: 'paragraph', text: 'This sublease is subject to and governed by the Master Lease between Tenant and Landlord. Tenant represents that landlord\'s consent to sublet has been obtained or is not required under the terms of the Master Lease.' },
            { type: 'signature-block', text: 'SIGNATURES' }
        ]
    },
    {
        id: 'liability-release',
        name: 'Release of Liability',
        category: 'legal',
        categoryLabel: 'Legal & Liability',
        description: 'General release of liability waiver protecting individuals/businesses from legal claims during events or activities.',
        estimatedTime: '2 mins',
        pagesCount: 1,
        popularity: 4,
        fields: [
            { id: 'releasorName', label: 'Releasor Full Name (Customer)', type: 'text', placeholder: 'Will Smith', required: true, defaultValue: '', step: 1 },
            { id: 'releaseeName', label: 'Releasee Name (Company)', type: 'text', placeholder: 'Skyline Skydiving LLC', required: true, defaultValue: '', step: 1 },
            { id: 'activityName', label: 'Waiver Activity/Event', type: 'text', placeholder: 'Tandem Skydiving Activity', required: true, defaultValue: '', step: 1 },
            { id: 'activityDate', label: 'Activity Date', type: 'date', required: true, defaultValue: '', step: 2 },
            { id: 'governingState', label: 'Governing Law State', type: 'text', placeholder: 'Texas', required: true, defaultValue: '', step: 2 }
        ],
        generateContent: (val) => [
            { type: 'title', text: 'RELEASE OF LIABILITY AND WAIVER' },
            { type: 'subtitle', text: 'READ CAREFULLY BEFORE SIGNING' },
            { type: 'paragraph', text: `This Release of Liability is executed on ${val.activityDate ? new Date(val.activityDate).toLocaleDateString() : '[Activity Date]'} by the undersigned, ${val.releasorName || '[Releasor]'} ("Releasor"), in favor of ${val.releaseeName || '[Releasee]'} ("Releasee"), its officers, employees, and agents.` },
            { type: 'header', text: '1. Assumption of Risk' },
            { type: 'paragraph', text: `Releasor understands and acknowledges that participating in **${val.activityName || '[Activity/Event]'}** involves inherent risks, including the risk of personal injury, illness, permanent disability, and death. Releasor voluntarily assumes all risks associated with participation.` },
            { type: 'header', text: '2. Waiver and Release' },
            { type: 'paragraph', text: 'Releasor hereby releases, waives, and covenants not to sue Releasee from any and all claims, demands, or causes of action arising out of or related to Releasor\'s participation in the activity, whether caused by the negligence of Releasee or otherwise.' },
            { type: 'header', text: '3. Indemnification' },
            { type: 'paragraph', text: 'Releasor agrees to defend, indemnify, and hold Releasee harmless from any losses, liabilities, damages, or costs (including attorney fees) that Releasee may incur due to Releasor\'s participation in the activity.' },
            { type: 'header', text: '4. Miscellaneous' },
            { type: 'paragraph', text: `This Waiver shall be construed broadly to provide a release to the maximum extent permissible under the laws of the State of ${val.governingState || '[Governing State]'}. If any portion of this agreement is held invalid, the remainder shall continue in full legal force.` },
            { type: 'signature-block', text: 'SIGNATURES' }
        ]
    },

    // =====================================================
    // SALES & FINANCE
    // =====================================================
    {
        id: 'sow',
        name: 'Statement of Work (SOW)',
        category: 'sales',
        categoryLabel: 'Sales & Finance',
        description: 'Comprehensive agreement detailing consulting deliverables, milestones, timeline, and total fee schedules.',
        estimatedTime: '3 mins',
        pagesCount: 2,
        popularity: 5,
        fields: [
            { id: 'clientName', label: 'Client Company Name', type: 'text', placeholder: 'MegaCorp Inc', required: true, defaultValue: '', step: 1 },
            { id: 'providerName', label: 'Service Provider Name', type: 'text', placeholder: 'DevSolutions LLC', required: true, defaultValue: '', step: 1 },
            { id: 'projectTitle', label: 'Project Name/Title', type: 'text', placeholder: 'E-commerce API Integration', required: true, defaultValue: '', step: 1 },
            { id: 'sowDate', label: 'SOW Effective Date', type: 'date', required: true, defaultValue: '', step: 1 },
            { id: 'scope', label: 'Scope of Work Description', type: 'text', placeholder: 'Designing, developing, and deploying a secure API wrapper...', required: true, defaultValue: '', step: 2 },
            { id: 'milestone1', label: 'Milestone 1 Deliverable', type: 'text', placeholder: 'UI Wireframes & Database Design Document', required: true, defaultValue: '', step: 2 },
            { id: 'milestone1Fee', label: 'Milestone 1 Payment ($)', type: 'number', placeholder: '5000', required: true, defaultValue: '', step: 2 },
            { id: 'milestone2', label: 'Milestone 2 Deliverable', type: 'text', placeholder: 'Production Launch & Handover Documentation', required: true, defaultValue: '', step: 2 },
            { id: 'milestone2Fee', label: 'Milestone 2 Payment ($)', type: 'number', placeholder: '7500', required: true, defaultValue: '', step: 2 }
        ],
        generateContent: (val) => [
            { type: 'title', text: 'STATEMENT OF WORK' },
            { type: 'subtitle', text: `Project: ${val.projectTitle || '[Project Name]'} • Effective Date: ${val.sowDate ? new Date(val.sowDate).toLocaleDateString() : '[Date]'}` },
            { type: 'paragraph', text: `This Statement of Work ("SOW") defines the deliverables, timelines, and payment terms for services provided by ${val.providerName || '[Provider Name]'} to ${val.clientName || '[Client Name]'}.` },
            { type: 'header', text: '1. Project Scope' },
            { type: 'paragraph', text: val.scope || 'No scope described yet. The provider will perform professional consulting services as agreed between parties.' },
            { type: 'header', text: '2. Deliverables & Payment Milestones' },
            { type: 'paragraph', text: 'Payments shall be tied directly to successful completion and acceptance of the following milestones:' },
            { type: 'table', headers: ['Milestone Phase', 'Deliverable Description', 'Milestone Fee (USD)'], rows: [
                ['Phase 1', val.milestone1 || '[Milestone 1]', `$${Number(val.milestone1Fee || 0).toLocaleString()}`],
                ['Phase 2', val.milestone2 || '[Milestone 2]', `$${Number(val.milestone2Fee || 0).toLocaleString()}`],
                ['Total Project Cost', 'All Completed deliverables', `$${Number(Number(val.milestone1Fee || 0) + Number(val.milestone2Fee || 0)).toLocaleString()}`]
            ]},
            { type: 'header', text: '3. Terms & Conditions' },
            { type: 'paragraph', text: 'Unless specified otherwise, Client shall review and accept or provide revisions on deliverables within five business days of delivery. Payment terms are net 15 days upon receipt of invoice.' },
            { type: 'signature-block', text: 'SIGNATURES' }
        ]
    },
    {
        id: 'purchase-order',
        name: 'Purchase Order',
        category: 'sales',
        categoryLabel: 'Sales & Finance',
        description: 'Standard PO indicating transaction details, shipping addresses, vendor, and itemized purchase tables.',
        estimatedTime: '3 mins',
        pagesCount: 1,
        popularity: 5,
        fields: [
            { id: 'poNumber', label: 'Purchase Order #', type: 'text', placeholder: 'PO-2026-0001', required: true, defaultValue: '', step: 1 },
            { id: 'poDate', label: 'Order Date', type: 'date', required: true, defaultValue: '', step: 1 },
            { id: 'vendorName', label: 'Vendor Company Name', type: 'text', placeholder: 'Office Depot Supply Inc', required: true, defaultValue: '', step: 1 },
            { id: 'billTo', label: 'Billing Address (Bill To)', type: 'text', placeholder: '100 Broadway, NY, NY 10005', required: true, defaultValue: '', step: 2 },
            { id: 'shipTo', label: 'Shipping Address (Ship To)', type: 'text', placeholder: 'Suite 4B, 100 Broadway, NY, NY 10005', required: true, defaultValue: '', step: 2 },
            { id: 'item1Desc', label: 'Item 1 Description', type: 'text', placeholder: 'MacBook Pro 16" M4 Max', required: true, defaultValue: '', step: 3 },
            { id: 'item1Qty', label: 'Item 1 Quantity', type: 'number', placeholder: '5', required: true, defaultValue: '', step: 3 },
            { id: 'item1Price', label: 'Item 1 Unit Price ($)', type: 'number', placeholder: '3200', required: true, defaultValue: '', step: 3 },
            { id: 'item2Desc', label: 'Item 2 Description', type: 'text', placeholder: 'USB-C Charging Docks', required: false, defaultValue: '', step: 3 },
            { id: 'item2Qty', label: 'Item 2 Quantity', type: 'number', placeholder: '5', required: false, defaultValue: '', step: 3 },
            { id: 'item2Price', label: 'Item 2 Unit Price ($)', type: 'number', placeholder: '150', required: false, defaultValue: '', step: 3 }
        ],
        generateContent: (val) => {
            const item1Total = Number(val.item1Qty || 0) * Number(val.item1Price || 0);
            const item2Total = Number(val.item2Qty || 0) * Number(val.item2Price || 0);
            const poTotal = item1Total + item2Total;

            const rows = [
                [val.item1Desc || '[Item 1]', String(val.item1Qty || 0), `$${Number(val.item1Price || 0).toLocaleString()}`, `$${item1Total.toLocaleString()}`]
            ];
            if (val.item2Desc) {
                rows.push([val.item2Desc, String(val.item2Qty || 0), `$${Number(val.item2Price || 0).toLocaleString()}`, `$${item2Total.toLocaleString()}`]);
            }
            rows.push(['Total Balance', '', '', `$${poTotal.toLocaleString()}`]);

            return [
                { type: 'title', text: 'PURCHASE ORDER' },
                { type: 'subtitle', text: `PO Number: ${val.poNumber || '[PO Number]'} • Date: ${val.poDate ? new Date(val.poDate).toLocaleDateString() : '[Date]'}` },
                { type: 'table', headers: ['Billing Address (Bill To)', 'Shipping Address (Ship To)'], rows: [
                    [val.billTo || '[Billing Address]', val.shipTo || '[Shipping Address]']
                ]},
                { type: 'header', text: `Vendor Details: ${val.vendorName || '[Vendor Name]'}` },
                { type: 'header', text: 'Itemized Order' },
                { type: 'table', headers: ['Item Description', 'Qty', 'Unit Price', 'Total'], rows },
                { type: 'paragraph', text: 'Please send all shipments along with a packaging slip referencing the PO Number above. Invoices should be directed to the billing address.' },
                { type: 'signature-block', text: 'SIGNATURES' }
            ];
        }
    },
    {
        id: 'sales-contract',
        name: 'Sales Contract',
        category: 'sales',
        categoryLabel: 'Sales & Finance',
        description: 'Standard sales agreement outlining product description, purchase price, payment terms, and delivery schedules.',
        estimatedTime: '3 mins',
        pagesCount: 1,
        popularity: 5,
        fields: [
            { id: 'sellerName', label: 'Seller Name/Company', type: 'text', placeholder: 'Sellers R Us Inc', required: true, defaultValue: '', step: 1 },
            { id: 'buyerName', label: 'Buyer Name/Company', type: 'text', placeholder: 'Buyers Depot LLC', required: true, defaultValue: '', step: 1 },
            { id: 'productDescription', label: 'Product/Goods Description', type: 'text', placeholder: '100 units of custom industrial grade steel brackets', required: true, defaultValue: '', step: 2 },
            { id: 'price', label: 'Purchase Price ($)', type: 'number', placeholder: '25000', required: true, defaultValue: '', step: 2 },
            { id: 'deliveryDate', label: 'Delivery Date', type: 'date', required: true, defaultValue: '', step: 3 },
            { id: 'paymentTerms', label: 'Payment Terms', type: 'select', options: ['Net 15 days upon delivery', 'Net 30 days upon delivery', '50% upfront, 50% upon delivery', '100% upfront payment'], required: true, defaultValue: 'Net 30 days upon delivery', step: 3 }
        ],
        generateContent: (val) => [
            { type: 'title', text: 'CONTRACT FOR THE SALE OF GOODS' },
            { type: 'subtitle', text: `Agreement Date: ${new Date().toLocaleDateString()}` },
            { type: 'paragraph', text: `This Sales Contract ("Contract") is entered into by and between ${val.sellerName || '[Seller]'} ("Seller") and ${val.buyerName || '[Buyer]'} ("Buyer").` },
            { type: 'header', text: '1. Sale of Goods' },
            { type: 'paragraph', text: `Seller agrees to sell, and Buyer agrees to purchase, the following goods: **${val.productDescription || '[Description of Goods]'}**.` },
            { type: 'header', text: '2. Purchase Price' },
            { type: 'paragraph', text: `Buyer agrees to pay Seller the total Purchase Price of $${Number(val.price || 0).toLocaleString()} USD for the Goods. Payments shall be made according to the payment terms selected: **${val.paymentTerms || '[Payment Terms]'}**.` },
            { type: 'header', text: '3. Delivery' },
            { type: 'paragraph', text: `Seller shall deliver the Goods to Buyer\'s primary address no later than ${val.deliveryDate ? new Date(val.deliveryDate).toLocaleDateString() : '[Delivery Date]'}. Risk of loss passes to the Buyer upon delivery of the Goods.` },
            { type: 'header', text: '4. Warranty & Disclaimer' },
            { type: 'paragraph', text: 'Seller warrants that the Goods are free of any security interest or lien. SELLER DISCLAIMS ALL OTHER WARRANTIES, EXPRESS OR IMPLIED, INCLUDING THE WARRANTY OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.' },
            { type: 'signature-block', text: 'SIGNATURES' }
        ]
    },

    // =====================================================
    // TIER 1 — HIGH-DEMAND TEMPLATES (2026 Addition)
    // =====================================================

    // ─── INDEPENDENT CONTRACTOR AGREEMENT ────────────────
    {
        id: 'contractor-agreement',
        name: 'Independent Contractor Agreement',
        category: 'hr',
        categoryLabel: 'Employment & HR',
        description: 'Comprehensive agreement for hiring independent contractors covering scope of work, compensation, IP ownership, and classification terms.',
        estimatedTime: '4 mins',
        pagesCount: 2,
        popularity: 5,
        fields: [
            { id: 'companyName', label: 'Company / Client Name', type: 'text', placeholder: 'Acme Technologies Inc.', required: true, defaultValue: '', step: 1 },
            { id: 'contractorName', label: 'Contractor Full Name', type: 'text', placeholder: 'Alex Johnson', required: true, defaultValue: '', step: 1 },
            { id: 'contractorEmail', label: 'Contractor Email', type: 'email', placeholder: 'alex@contractor.com', required: true, defaultValue: '', step: 1 },
            { id: 'serviceDescription', label: 'Description of Services', type: 'text', placeholder: 'Full-stack web development, API integration, and database architecture', required: true, defaultValue: '', step: 2, helpText: 'Detailed description of the work the contractor will perform' },
            { id: 'compensationRate', label: 'Compensation Rate ($)', type: 'number', placeholder: '95', required: true, defaultValue: '', step: 2, helpText: 'Hourly or project-based rate in USD' },
            { id: 'rateType', label: 'Rate Type', type: 'select', options: ['Hourly Rate', 'Fixed Project Fee', 'Monthly Retainer', 'Per Deliverable'], required: true, defaultValue: 'Hourly Rate', step: 2 },
            { id: 'startDate', label: 'Contract Start Date', type: 'date', required: true, defaultValue: '', step: 3 },
            { id: 'endDate', label: 'Contract End Date', type: 'date', required: false, defaultValue: '', step: 3, helpText: 'Leave blank for an ongoing/at-will engagement' },
            { id: 'ipOwnership', label: 'IP Ownership', type: 'select', options: ['All IP assigned to Company', 'Contractor retains IP, Company gets license', 'Joint ownership'], required: true, defaultValue: 'All IP assigned to Company', step: 3 },
            { id: 'governingState', label: 'Governing State / Jurisdiction', type: 'text', placeholder: 'California', required: true, defaultValue: '', step: 3 }
        ],
        generateContent: (val) => [
            { type: 'title', text: 'INDEPENDENT CONTRACTOR AGREEMENT' },
            { type: 'subtitle', text: `Effective Date: ${val.startDate ? new Date(val.startDate).toLocaleDateString() : '[Start Date]'}` },
            { type: 'paragraph', text: `This Independent Contractor Agreement (\"Agreement\") is entered into by and between ${val.companyName || '[Company Name]'} (\"Company\") and ${val.contractorName || '[Contractor Name]'} (\"Contractor\"), collectively referred to as the \"Parties.\"` },
            { type: 'header', text: '1. Scope of Services' },
            { type: 'paragraph', text: `The Company hereby engages the Contractor to perform the following services: ${val.serviceDescription || '[Description of Services]'}. The Contractor shall perform all services in a professional and workmanlike manner, consistent with industry standards. The Contractor may determine the method, details, and means of performing the services.` },
            { type: 'header', text: '2. Compensation' },
            { type: 'paragraph', text: 'The Company agrees to compensate the Contractor according to the following schedule:' },
            { type: 'table', headers: ['Compensation Detail', 'Value'], rows: [
                ['Rate', `$${Number(val.compensationRate || 0).toLocaleString()} USD`],
                ['Rate Type', val.rateType || 'Hourly Rate'],
                ['Payment Terms', 'Net 15 days upon receipt of invoice'],
                ['Payment Method', 'Bank transfer or mutually agreed method']
            ]},
            { type: 'paragraph', text: 'The Contractor shall submit detailed invoices on a bi-weekly or monthly basis. The Company shall pay undisputed invoices within fifteen (15) business days of receipt.' },
            { type: 'header', text: '3. Intellectual Property Rights' },
            { type: 'paragraph', text: `Intellectual Property Arrangement: **${val.ipOwnership || 'All IP assigned to Company'}**. All work product, inventions, discoveries, and materials created by the Contractor in the course of performing services under this Agreement shall be governed by the selected IP arrangement. The Contractor represents that all work will be original and will not infringe upon the intellectual property rights of any third party.` },
            { type: 'header', text: '4. Confidentiality' },
            { type: 'paragraph', text: 'The Contractor agrees to hold in strict confidence all proprietary information, trade secrets, and confidential business data of the Company. This obligation shall survive the termination of this Agreement for a period of two (2) years. The Contractor shall not disclose any confidential information to any third party without the prior written consent of the Company.' },
            { type: 'header', text: '5. Term & Termination' },
            { type: 'paragraph', text: `This Agreement shall commence on ${val.startDate ? new Date(val.startDate).toLocaleDateString() : '[Start Date]'}${val.endDate ? ` and shall continue through ${new Date(val.endDate).toLocaleDateString()}` : ' and shall continue until terminated by either Party'}. Either Party may terminate this Agreement with fourteen (14) days\' written notice. Upon termination, the Contractor shall be compensated for all services satisfactorily performed up to the date of termination.` },
            { type: 'header', text: '6. Independent Contractor Relationship' },
            { type: 'paragraph', text: 'The Contractor is an independent contractor and not an employee, agent, or partner of the Company. The Contractor shall be solely responsible for all tax returns, payments, and obligations, including self-employment tax, income tax, and Social Security contributions. The Company will not withhold taxes or provide employee benefits (including health insurance, retirement plans, or workers\' compensation) to the Contractor.' },
            { type: 'header', text: '7. Governing Law' },
            { type: 'paragraph', text: `This Agreement shall be governed by and construed in accordance with the laws of the State of ${val.governingState || '[Governing State]'}, without regard to its conflict of laws principles. Any disputes arising under or in connection with this Agreement shall be resolved through binding arbitration in the State of ${val.governingState || '[Governing State]'}.` },
            { type: 'signature-block', text: 'SIGNATURES' }
        ]
    },

    // ─── CONSULTING / SERVICE AGREEMENT ──────────────────
    {
        id: 'consulting-agreement',
        name: 'Consulting / Service Agreement',
        category: 'sales',
        categoryLabel: 'Sales & Finance',
        description: 'Professional services agreement for consultants and agencies defining engagement scope, fee structure, liability, and deliverables.',
        estimatedTime: '4 mins',
        pagesCount: 2,
        popularity: 5,
        fields: [
            { id: 'consultantName', label: 'Consultant / Agency Name', type: 'text', placeholder: 'Strategic Solutions LLC', required: true, defaultValue: '', step: 1 },
            { id: 'clientName', label: 'Client Company Name', type: 'text', placeholder: 'GlobalTech Enterprises', required: true, defaultValue: '', step: 1 },
            { id: 'effectiveDate', label: 'Agreement Effective Date', type: 'date', required: true, defaultValue: '', step: 1 },
            { id: 'scopeOfServices', label: 'Scope of Consulting Services', type: 'text', placeholder: 'Market research analysis, go-to-market strategy development, and competitive benchmarking', required: true, defaultValue: '', step: 2, helpText: 'Describe the consulting services to be provided' },
            { id: 'feeAmount', label: 'Consulting Fee ($)', type: 'number', placeholder: '15000', required: true, defaultValue: '', step: 2 },
            { id: 'feeStructure', label: 'Fee Structure', type: 'select', options: ['Fixed Project Fee', 'Monthly Retainer', 'Hourly Rate', 'Milestone-Based Payments'], required: true, defaultValue: 'Fixed Project Fee', step: 2 },
            { id: 'paymentTerms', label: 'Payment Terms', type: 'select', options: ['Net 15 days', 'Net 30 days', '50% upfront, 50% upon completion', 'Monthly in arrears'], required: true, defaultValue: 'Net 30 days', step: 2 },
            { id: 'termMonths', label: 'Agreement Duration (Months)', type: 'number', placeholder: '6', required: true, defaultValue: '6', step: 3 },
            { id: 'liabilityCap', label: 'Liability Cap ($)', type: 'number', placeholder: '50000', required: false, defaultValue: '', step: 3, helpText: 'Maximum aggregate liability under this agreement' },
            { id: 'governingState', label: 'Governing State', type: 'text', placeholder: 'New York', required: true, defaultValue: '', step: 3 }
        ],
        generateContent: (val) => [
            { type: 'title', text: 'CONSULTING / SERVICE AGREEMENT' },
            { type: 'subtitle', text: `Effective Date: ${val.effectiveDate ? new Date(val.effectiveDate).toLocaleDateString() : '[Effective Date]'}` },
            { type: 'paragraph', text: `This Consulting Agreement (\"Agreement\") is entered into by and between ${val.consultantName || '[Consultant Name]'} (\"Consultant\") and ${val.clientName || '[Client Name]'} (\"Client\"), collectively referred to as the \"Parties.\"` },
            { type: 'header', text: '1. Engagement' },
            { type: 'paragraph', text: `The Client hereby engages the Consultant to provide professional consulting services as described herein. The Consultant accepts such engagement and agrees to perform the services diligently and in accordance with the highest professional standards of the industry.` },
            { type: 'header', text: '2. Scope of Services' },
            { type: 'paragraph', text: `The Consultant shall provide the following services: ${val.scopeOfServices || '[Scope of Services]'}. Any services beyond the scope outlined herein shall require a separate written amendment or Statement of Work (SOW) signed by both Parties.` },
            { type: 'header', text: '3. Compensation & Payment' },
            { type: 'paragraph', text: 'The Client shall compensate the Consultant according to the following terms:' },
            { type: 'table', headers: ['Term', 'Details'], rows: [
                ['Consulting Fee', `$${Number(val.feeAmount || 0).toLocaleString()} USD`],
                ['Fee Structure', val.feeStructure || 'Fixed Project Fee'],
                ['Payment Terms', val.paymentTerms || 'Net 30 days'],
                ['Agreement Duration', `${val.termMonths || 6} months`]
            ]},
            { type: 'paragraph', text: 'Late payments shall accrue interest at a rate of 1.5% per month or the maximum rate permitted by law, whichever is lower. The Consultant reserves the right to suspend services if payment is overdue by more than thirty (30) days.' },
            { type: 'header', text: '4. Expenses' },
            { type: 'paragraph', text: 'The Client shall reimburse the Consultant for all reasonable, pre-approved expenses incurred in connection with the performance of services, including travel, accommodation, and materials. The Consultant shall provide itemized receipts for all expense claims.' },
            { type: 'header', text: '5. Confidentiality' },
            { type: 'paragraph', text: 'Each Party agrees to maintain in strict confidence all proprietary and confidential information received from the other Party during the term of this Agreement. This obligation shall survive the termination of this Agreement for a period of three (3) years. Confidential information does not include information that is publicly available or independently developed.' },
            { type: 'header', text: '6. Limitation of Liability' },
            { type: 'paragraph', text: `TO THE MAXIMUM EXTENT PERMITTED BY LAW, NEITHER PARTY SHALL BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF THIS AGREEMENT. ${val.liabilityCap ? `The Consultant's total aggregate liability under this Agreement shall not exceed $${Number(val.liabilityCap).toLocaleString()} USD.` : 'The Consultant\'s total aggregate liability shall not exceed the total fees paid under this Agreement.'}` },
            { type: 'header', text: '7. Termination' },
            { type: 'paragraph', text: `This Agreement shall remain in effect for ${val.termMonths || 6} months from the Effective Date unless terminated earlier. Either Party may terminate this Agreement with thirty (30) days\' written notice. In the event of a material breach, the non-breaching Party may terminate immediately upon written notice. Upon termination, the Client shall pay for all services rendered through the date of termination.` },
            { type: 'header', text: '8. Governing Law' },
            { type: 'paragraph', text: `This Agreement shall be governed by and construed in accordance with the laws of the State of ${val.governingState || '[Governing State]'}. Any disputes shall be resolved through mediation, and if unsuccessful, through binding arbitration.` },
            { type: 'signature-block', text: 'SIGNATURES' }
        ]
    },

    // ─── RESIDENTIAL LEASE AGREEMENT ─────────────────────
    {
        id: 'residential-lease',
        name: 'Residential Lease Agreement',
        category: 'legal',
        categoryLabel: 'Legal & Liability',
        description: 'Standard residential rental agreement covering property terms, rent, security deposit, maintenance responsibilities, and house rules.',
        estimatedTime: '5 mins',
        pagesCount: 2,
        popularity: 5,
        fields: [
            { id: 'landlordName', label: 'Landlord / Property Owner Name', type: 'text', placeholder: 'Greenfield Properties LLC', required: true, defaultValue: '', step: 1 },
            { id: 'tenantName', label: 'Tenant Full Name', type: 'text', placeholder: 'Michael Rivera', required: true, defaultValue: '', step: 1 },
            { id: 'propertyAddress', label: 'Property Address', type: 'text', placeholder: '450 Oak Street, Apt 2B, San Francisco, CA 94102', required: true, defaultValue: '', step: 1 },
            { id: 'leaseStart', label: 'Lease Start Date', type: 'date', required: true, defaultValue: '', step: 2 },
            { id: 'leaseEnd', label: 'Lease End Date', type: 'date', required: true, defaultValue: '', step: 2 },
            { id: 'monthlyRent', label: 'Monthly Rent ($)', type: 'number', placeholder: '2500', required: true, defaultValue: '', step: 2 },
            { id: 'securityDeposit', label: 'Security Deposit ($)', type: 'number', placeholder: '2500', required: true, defaultValue: '', step: 2, helpText: 'Typically equal to one month\'s rent' },
            { id: 'lateFee', label: 'Late Payment Fee ($)', type: 'number', placeholder: '75', required: false, defaultValue: '75', step: 3 },
            { id: 'petsAllowed', label: 'Pet Policy', type: 'select', options: ['No pets allowed', 'Pets allowed with deposit', 'Pets allowed — no restrictions', 'Small pets only (under 25 lbs)'], required: true, defaultValue: 'No pets allowed', step: 3 },
            { id: 'governingState', label: 'Governing State', type: 'text', placeholder: 'California', required: true, defaultValue: '', step: 3 }
        ],
        generateContent: (val) => [
            { type: 'title', text: 'RESIDENTIAL LEASE AGREEMENT' },
            { type: 'subtitle', text: `Property: ${val.propertyAddress || '[Property Address]'}` },
            { type: 'paragraph', text: `This Residential Lease Agreement (\"Lease\") is entered into on ${new Date().toLocaleDateString()} by and between ${val.landlordName || '[Landlord Name]'} (\"Landlord\") and ${val.tenantName || '[Tenant Name]'} (\"Tenant\"), collectively referred to as the \"Parties.\"` },
            { type: 'header', text: '1. Premises' },
            { type: 'paragraph', text: `The Landlord agrees to lease to the Tenant the residential property located at: ${val.propertyAddress || '[Property Address]'} (the \"Premises\"). The Premises shall be used exclusively as a private residential dwelling and for no other purpose without the prior written consent of the Landlord.` },
            { type: 'header', text: '2. Lease Term' },
            { type: 'paragraph', text: `The lease term shall commence on ${val.leaseStart ? new Date(val.leaseStart).toLocaleDateString() : '[Start Date]'} and shall expire on ${val.leaseEnd ? new Date(val.leaseEnd).toLocaleDateString() : '[End Date]'}, unless renewed or terminated in accordance with this Lease. The Tenant must provide at least sixty (60) days\' written notice prior to the expiration date if they intend to vacate the Premises.` },
            { type: 'header', text: '3. Rent & Financial Terms' },
            { type: 'paragraph', text: 'The financial obligations of the Tenant are outlined below:' },
            { type: 'table', headers: ['Financial Term', 'Amount'], rows: [
                ['Monthly Rent', `$${Number(val.monthlyRent || 0).toLocaleString()} USD`],
                ['Security Deposit', `$${Number(val.securityDeposit || 0).toLocaleString()} USD`],
                ['Late Payment Fee', `$${Number(val.lateFee || 75).toLocaleString()} USD (after 5-day grace period)`],
                ['Rent Due Date', '1st of each calendar month'],
                ['Payment Method', 'Bank transfer, check, or online portal']
            ]},
            { type: 'paragraph', text: 'Rent is due on the 1st day of each calendar month. A grace period of five (5) days shall apply before the late fee is assessed. Failure to pay rent within ten (10) days of the due date shall constitute a material breach of this Lease.' },
            { type: 'header', text: '4. Security Deposit' },
            { type: 'paragraph', text: `Upon signing this Lease, the Tenant shall pay a security deposit of $${Number(val.securityDeposit || 0).toLocaleString()} USD. The deposit shall be held by the Landlord and returned within thirty (30) days of lease termination, less any lawful deductions for unpaid rent, damages beyond normal wear and tear, or cleaning costs. An itemized statement of deductions will be provided.` },
            { type: 'header', text: '5. Maintenance & Repairs' },
            { type: 'paragraph', text: 'The Landlord shall maintain the structural integrity of the Premises, including the roof, exterior walls, plumbing, electrical, and HVAC systems. The Tenant shall maintain the interior of the Premises in a clean and habitable condition and shall promptly notify the Landlord of any needed repairs. The Tenant shall be responsible for any damages caused by the Tenant, their guests, or their pets.' },
            { type: 'header', text: '6. House Rules & Restrictions' },
            { type: 'bullet', items: [
                'Quiet hours shall be observed between 10:00 PM and 8:00 AM',
                'No illegal activities shall be conducted on the Premises',
                'No alterations, painting, or structural changes without prior written consent',
                'Maximum occupancy: persons listed on this Lease only',
                'Smoking is prohibited inside the Premises'
            ]},
            { type: 'header', text: '7. Pet Policy' },
            { type: 'paragraph', text: `Pet Policy: **${val.petsAllowed || 'No pets allowed'}**. ${val.petsAllowed === 'Pets allowed with deposit' ? 'An additional pet deposit may be required. Tenant is responsible for all pet-related damages and noise complaints.' : val.petsAllowed === 'No pets allowed' ? 'No animals of any kind are permitted on the Premises without prior written approval from the Landlord. Service animals required under applicable disability laws are exempt from this restriction.' : 'Tenant is responsible for all pet-related damages, noise complaints, and ensuring compliance with local animal control regulations.'}` },
            { type: 'header', text: '8. Governing Law' },
            { type: 'paragraph', text: `This Lease shall be governed by and construed in accordance with the landlord-tenant laws of the State of ${val.governingState || '[Governing State]'}. In the event of any dispute, the Parties agree to first attempt resolution through mediation before pursuing legal remedies.` },
            { type: 'signature-block', text: 'SIGNATURES' }
        ]
    },

    // ─── INVOICE TEMPLATE ────────────────────────────────
    {
        id: 'invoice',
        name: 'Professional Invoice',
        category: 'sales',
        categoryLabel: 'Sales & Finance',
        description: 'Clean, professional invoice template with itemized line items, tax calculation, payment terms, and sign-off approval capability.',
        estimatedTime: '3 mins',
        pagesCount: 1,
        popularity: 5,
        fields: [
            { id: 'senderName', label: 'Sender / Business Name', type: 'text', placeholder: 'Creative Solutions Studio', required: true, defaultValue: '', step: 1 },
            { id: 'senderAddress', label: 'Sender Address', type: 'text', placeholder: '100 Market Street, Suite 300, San Francisco, CA 94105', required: true, defaultValue: '', step: 1 },
            { id: 'senderEmail', label: 'Sender Email', type: 'email', placeholder: 'billing@creativesolutions.com', required: true, defaultValue: '', step: 1 },
            { id: 'clientName', label: 'Bill To — Client Name', type: 'text', placeholder: 'TechVentures Corp', required: true, defaultValue: '', step: 1 },
            { id: 'clientAddress', label: 'Client Billing Address', type: 'text', placeholder: '200 Broadway, New York, NY 10001', required: true, defaultValue: '', step: 1 },
            { id: 'invoiceNumber', label: 'Invoice Number', type: 'text', placeholder: 'INV-2026-0042', required: true, defaultValue: '', step: 2 },
            { id: 'invoiceDate', label: 'Invoice Date', type: 'date', required: true, defaultValue: '', step: 2 },
            { id: 'dueDate', label: 'Payment Due Date', type: 'date', required: true, defaultValue: '', step: 2 },
            { id: 'item1Desc', label: 'Line Item 1 — Description', type: 'text', placeholder: 'Website Redesign — Phase 1', required: true, defaultValue: '', step: 3 },
            { id: 'item1Qty', label: 'Item 1 — Quantity / Hours', type: 'number', placeholder: '40', required: true, defaultValue: '', step: 3 },
            { id: 'item1Rate', label: 'Item 1 — Rate ($)', type: 'number', placeholder: '150', required: true, defaultValue: '', step: 3 },
            { id: 'item2Desc', label: 'Line Item 2 — Description (Optional)', type: 'text', placeholder: 'Brand Identity Package', required: false, defaultValue: '', step: 3 },
            { id: 'item2Qty', label: 'Item 2 — Quantity / Hours', type: 'number', placeholder: '1', required: false, defaultValue: '', step: 3 },
            { id: 'item2Rate', label: 'Item 2 — Rate ($)', type: 'number', placeholder: '2500', required: false, defaultValue: '', step: 3 },
            { id: 'taxRate', label: 'Tax Rate (%)', type: 'number', placeholder: '8.5', required: false, defaultValue: '0', step: 3, helpText: 'Enter 0 for no tax' }
        ],
        generateContent: (val) => {
            const item1Total = Number(val.item1Qty || 0) * Number(val.item1Rate || 0);
            const item2Total = Number(val.item2Qty || 0) * Number(val.item2Rate || 0);
            const subtotal = item1Total + item2Total;
            const taxRate = Number(val.taxRate || 0);
            const taxAmount = subtotal * (taxRate / 100);
            const grandTotal = subtotal + taxAmount;

            const rows: string[][] = [
                [val.item1Desc || '[Item 1]', String(val.item1Qty || 0), `$${Number(val.item1Rate || 0).toLocaleString()}`, `$${item1Total.toLocaleString()}`]
            ];
            if (val.item2Desc) {
                rows.push([val.item2Desc, String(val.item2Qty || 0), `$${Number(val.item2Rate || 0).toLocaleString()}`, `$${item2Total.toLocaleString()}`]);
            }

            return [
                { type: 'title', text: 'INVOICE' },
                { type: 'subtitle', text: `Invoice #${val.invoiceNumber || '[INV-NUMBER]'} • Date: ${val.invoiceDate ? new Date(val.invoiceDate).toLocaleDateString() : '[Invoice Date]'}` },
                { type: 'table', headers: ['From (Sender)', 'Bill To (Client)'], rows: [
                    [val.senderName || '[Sender Name]', val.clientName || '[Client Name]'],
                    [val.senderAddress || '[Sender Address]', val.clientAddress || '[Client Address]'],
                    [val.senderEmail || '[Email]', '']
                ]},
                { type: 'header', text: 'Itemized Services' },
                { type: 'table', headers: ['Description', 'Qty / Hours', 'Rate', 'Amount'], rows },
                { type: 'header', text: 'Summary' },
                { type: 'table', headers: ['', 'Amount'], rows: [
                    ['Subtotal', `$${subtotal.toLocaleString()}`],
                    [`Tax (${taxRate}%)`, `$${taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
                    ['Total Due', `$${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`]
                ]},
                { type: 'header', text: 'Payment Information' },
                { type: 'paragraph', text: `Payment Due Date: **${val.dueDate ? new Date(val.dueDate).toLocaleDateString() : '[Due Date]'}**` },
                { type: 'paragraph', text: 'Please remit payment via bank transfer to the account details provided separately, or through the payment link included with this invoice. A late fee of 1.5% per month will be applied to overdue balances.' },
                { type: 'paragraph', text: `Thank you for your business. If you have any questions regarding this invoice, please contact ${val.senderEmail || '[sender email]'}.` },
                { type: 'signature-block', text: 'APPROVAL & SIGNATURES' }
            ];
        }
    },

    // ─── EMPLOYMENT CONTRACT (FULL-TIME) ─────────────────
    {
        id: 'employment-contract',
        name: 'Employment Contract (Full-Time)',
        category: 'hr',
        categoryLabel: 'Employment & HR',
        description: 'Comprehensive full-time employment contract with detailed compensation, benefits, non-compete, confidentiality, and termination clauses.',
        estimatedTime: '5 mins',
        pagesCount: 2,
        popularity: 5,
        fields: [
            { id: 'companyName', label: 'Company Name', type: 'text', placeholder: 'Horizon Technologies Inc.', required: true, defaultValue: '', step: 1 },
            { id: 'employeeName', label: 'Employee Full Name', type: 'text', placeholder: 'Sarah Mitchell', required: true, defaultValue: '', step: 1 },
            { id: 'jobTitle', label: 'Job Title / Position', type: 'text', placeholder: 'Senior Product Manager', required: true, defaultValue: '', step: 1 },
            { id: 'department', label: 'Department', type: 'text', placeholder: 'Product & Engineering', required: true, defaultValue: '', step: 1 },
            { id: 'startDate', label: 'Employment Start Date', type: 'date', required: true, defaultValue: '', step: 2 },
            { id: 'annualSalary', label: 'Annual Base Salary ($)', type: 'number', placeholder: '145000', required: true, defaultValue: '', step: 2 },
            { id: 'bonusEligible', label: 'Annual Bonus Eligibility', type: 'select', options: ['Not eligible', 'Up to 10% of base salary', 'Up to 15% of base salary', 'Up to 20% of base salary', 'Up to 25% of base salary'], required: true, defaultValue: 'Up to 15% of base salary', step: 2 },
            { id: 'ptoDays', label: 'Paid Time Off (Days/Year)', type: 'number', placeholder: '20', required: true, defaultValue: '20', step: 2, helpText: 'Annual PTO days excluding public holidays' },
            { id: 'nonCompeteMonths', label: 'Non-Compete Period (Months)', type: 'number', placeholder: '12', required: false, defaultValue: '12', step: 3, helpText: 'Duration of non-compete clause after employment ends' },
            { id: 'noticePeriod', label: 'Termination Notice Period', type: 'select', options: ['2 weeks', '30 days', '60 days', '90 days'], required: true, defaultValue: '30 days', step: 3 },
            { id: 'governingState', label: 'Governing State', type: 'text', placeholder: 'New York', required: true, defaultValue: '', step: 3 }
        ],
        generateContent: (val) => [
            { type: 'title', text: 'EMPLOYMENT CONTRACT' },
            { type: 'subtitle', text: `${val.companyName || '[Company Name]'} — Full-Time Employment Agreement` },
            { type: 'paragraph', text: `This Employment Contract (\"Contract\") is entered into on ${new Date().toLocaleDateString()} by and between ${val.companyName || '[Company Name]'} (\"Employer\") and ${val.employeeName || '[Employee Name]'} (\"Employee\"), collectively the \"Parties.\"` },
            { type: 'header', text: '1. Position & Duties' },
            { type: 'paragraph', text: `The Employer hereby employs the Employee in the position of **${val.jobTitle || '[Job Title]'}** within the **${val.department || '[Department]'}** department, commencing on ${val.startDate ? new Date(val.startDate).toLocaleDateString() : '[Start Date]'}. The Employee shall perform all duties and responsibilities customarily associated with this position, as well as additional duties reasonably assigned by the Employer. The Employee agrees to devote their full professional time and attention to the business of the Employer.` },
            { type: 'header', text: '2. Compensation' },
            { type: 'paragraph', text: 'The Employee shall receive the following compensation package:' },
            { type: 'table', headers: ['Compensation Component', 'Details'], rows: [
                ['Annual Base Salary', `$${Number(val.annualSalary || 0).toLocaleString()} USD (paid semi-monthly)`],
                ['Annual Bonus', val.bonusEligible || 'Not eligible'],
                ['Pay Frequency', 'Semi-monthly (1st and 15th of each month)'],
                ['Effective Date', val.startDate ? new Date(val.startDate).toLocaleDateString() : '[Start Date]']
            ]},
            { type: 'paragraph', text: 'Compensation is subject to standard payroll withholdings and deductions as required by applicable federal, state, and local tax laws. Annual salary reviews will be conducted, though adjustments are at the sole discretion of the Employer.' },
            { type: 'header', text: '3. Benefits' },
            { type: 'paragraph', text: 'The Employee shall be eligible for the following benefits, subject to the terms and conditions of each respective plan:' },
            { type: 'bullet', items: [
                'Health, dental, and vision insurance (eligible after 30-day waiting period)',
                '401(k) retirement plan with employer matching (up to 4% of salary)',
                `${val.ptoDays || 20} days of Paid Time Off (PTO) per calendar year, accrued monthly`,
                'Paid public holidays as observed by the company (typically 10-12 per year)',
                'Life insurance and short-term / long-term disability coverage',
                'Professional development and continuing education allowance'
            ]},
            { type: 'header', text: '4. Working Hours' },
            { type: 'paragraph', text: 'The Employee is expected to work a standard schedule of forty (40) hours per week, Monday through Friday. The Employer may offer flexible working arrangements, including remote work options, at its discretion and subject to business needs.' },
            { type: 'header', text: '5. Confidentiality & Intellectual Property' },
            { type: 'paragraph', text: 'The Employee agrees to maintain the strict confidentiality of all proprietary information, trade secrets, client data, and business strategies of the Employer during and after the term of employment. All inventions, works, designs, and intellectual property created by the Employee within the scope of their employment shall be the sole and exclusive property of the Employer. This obligation survives the termination of this Contract indefinitely.' },
            { type: 'header', text: '6. Non-Compete & Non-Solicitation' },
            { type: 'paragraph', text: `For a period of ${val.nonCompeteMonths || 12} months following the termination of employment, the Employee agrees not to: (a) engage in or contribute to any business that directly competes with the Employer within the same geographic market; (b) solicit, recruit, or hire any current employees or contractors of the Employer; (c) solicit or attempt to divert any clients, customers, or business relationships of the Employer. The Employee acknowledges that this restriction is reasonable and necessary to protect the Employer's legitimate business interests.` },
            { type: 'header', text: '7. Termination' },
            { type: 'paragraph', text: `Either Party may terminate this Contract with **${val.noticePeriod || '30 days'}** written notice. The Employer may terminate immediately for cause, including but not limited to gross misconduct, material breach of this Contract, fraud, or conviction of a felony. Upon termination, the Employee shall return all company property, documents, and materials within five (5) business days.` },
            { type: 'header', text: '8. Governing Law' },
            { type: 'paragraph', text: `This Contract shall be governed by and construed in accordance with the employment laws of the State of ${val.governingState || '[Governing State]'}. Any disputes arising under this Contract shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.` },
            { type: 'signature-block', text: 'SIGNATURES' }
        ]
    },

    // ─── RIGHT OF FIRST REFUSAL (ROFR) ────────────────────
    {
        id: 'rofr-template',
        name: 'Right of First Refusal (ROFR)',
        category: 'legal',
        categoryLabel: 'Legal & Liability',
        description: 'Right of First Refusal agreement giving a party the first opportunity to purchase an asset before third-party sales.',
        estimatedTime: '4 mins',
        pagesCount: 2,
        popularity: 5,
        fields: [
            { id: 'grantorName', label: 'Grantor Full Name', type: 'text', placeholder: 'John Doe', required: true, defaultValue: '', step: 1 },
            { id: 'granteeName', label: 'Grantee Full Name', type: 'text', placeholder: 'Jane Smith', required: true, defaultValue: '', step: 1 },
            { id: 'propertyName', label: 'Property / Asset Description', type: 'text', placeholder: '123 Main Street, Unit 4', required: true, defaultValue: '', step: 1 },
            { id: 'noticeDays', label: 'Notice Period (Days)', type: 'number', placeholder: '30', required: true, defaultValue: '30', step: 2 },
            { id: 'effectiveDate', label: 'Effective Date', type: 'date', required: true, defaultValue: '', step: 2 },
            { id: 'governingState', label: 'Governing State', type: 'text', placeholder: 'New York', required: true, defaultValue: '', step: 3 }
        ],
        generateContent: (val) => [
            { type: 'title', text: 'RIGHT OF FIRST REFUSAL AGREEMENT' },
            { type: 'subtitle', text: `Effective Date: ${val.effectiveDate ? new Date(val.effectiveDate).toLocaleDateString() : '[Effective Date]'}` },
            { type: 'paragraph', text: `This Right of First Refusal Agreement is entered into by and between ${val.grantorName || '[Grantor Name]'} ("Grantor") and ${val.granteeName || '[Grantee Name]'} ("Grantee").` },
            { type: 'header', text: '1. Grant of Right of First Refusal' },
            { type: 'paragraph', text: `The Grantor hereby grants to the Grantee the exclusive Right of First Refusal to purchase the Property/Asset described as: ${val.propertyName || '[Property/Asset Description]'}. This right applies to any proposed sale, transfer, lease, assignment, or other disposition of the Property/Asset by the Grantor, whether voluntary or involuntary, during the term of this Agreement.` },
            { type: 'header', text: '2. Notice of Bona Fide Offer' },
            { type: 'paragraph', text: `In the event that the Grantor receives a bona fide, written offer from a third party to purchase the Property/Asset, and the Grantor desires to accept said offer, the Grantor shall immediately deliver to the Grantee a written notice ("Notice of Offer"). The Notice of Offer must include a complete and accurate copy of the third-party offer, outlining the purchase price, payment terms, closing date, and all other material conditions.` },
            { type: 'header', text: '3. Exercise of Right of Refusal' },
            { type: 'paragraph', text: `The Grantee shall have a period of ${val.noticeDays || '30'} calendar days from the date of receipt of the Notice of Offer to elect to purchase the Property/Asset. To exercise this right, the Grantee must deliver a written notice of acceptance to the Grantor, agreeing to purchase the Property/Asset under the identical terms and conditions set forth in the Notice of Offer.` },
            { type: 'header', text: '4. Failure to Exercise and Sale to Third Party' },
            { type: 'paragraph', text: `If the Grantee fails to deliver a written notice of acceptance within the ${val.noticeDays || '30'} day exercise period, or explicitly declines the offer in writing, the Grantee's Right of First Refusal for that specific offer shall be deemed waived. The Grantor may then proceed to sell the Property/Asset to the third party under terms no more favorable to the third party than those offered to the Grantee.` },
            { type: 'header', text: '5. Governing Law' },
            { type: 'paragraph', text: `This Agreement shall be governed by and construed in accordance with the laws of the State of ${val.governingState || '[Governing State]'}, without regard to conflict of laws principles.` },
            { type: 'signature-block', text: 'SIGNATURES' }
        ]
    },

    // ─── NON-DISCLOSURE AGREEMENT (NDA) ───────────────────
    {
        id: 'nda-template',
        name: 'Non-Disclosure Agreement (NDA)',
        category: 'legal',
        categoryLabel: 'Legal & Liability',
        description: 'Standard non-disclosure agreement to protect confidential and proprietary information from unauthorized disclosure.',
        estimatedTime: '3 mins',
        pagesCount: 2,
        popularity: 5,
        fields: [
            { id: 'disclosingParty', label: 'Disclosing Party Name', type: 'text', placeholder: 'Acme Corp', required: true, defaultValue: '', step: 1 },
            { id: 'receivingParty', label: 'Receiving Party Name', type: 'text', placeholder: 'Beta LLC', required: true, defaultValue: '', step: 1 },
            { id: 'effectiveDate', label: 'Effective Date', type: 'date', required: true, defaultValue: '', step: 1 },
            { id: 'purpose', label: 'Purpose of Disclosure', type: 'text', placeholder: 'business partnership evaluation', required: true, defaultValue: '', step: 2 },
            { id: 'termYears', label: 'Confidentiality Term (Years)', type: 'number', placeholder: '5', required: true, defaultValue: '5', step: 2 },
            { id: 'governingState', label: 'Governing State', type: 'text', placeholder: 'Delaware', required: true, defaultValue: '', step: 3 }
        ],
        generateContent: (val) => [
            { type: 'title', text: 'NON-DISCLOSURE AGREEMENT' },
            { type: 'subtitle', text: `Effective Date: ${val.effectiveDate ? new Date(val.effectiveDate).toLocaleDateString() : '[Effective Date]'}` },
            { type: 'paragraph', text: `This Confidentiality Agreement is entered into by and between ${val.disclosingParty || '[Disclosing Party]'} ("Disclosing Party") and ${val.receivingParty || '[Receiving Party]'} ("Receiving Party").` },
            { type: 'header', text: '1. Purpose' },
            { type: 'paragraph', text: `The parties wish to explore a potential business relationship in connection with ${val.purpose || '[Purpose of Disclosure]'}. In connection with this, the parties may share proprietary technical and business information.` },
            { type: 'header', text: '2. Definition of Confidential Information' },
            { type: 'paragraph', text: `"Confidential Information" refers to any proprietary, non-public, or sensitive information disclosed by the Disclosing Party to the Receiving Party, whether orally, visually, or in writing. This includes technical data, trade secrets, software designs, product roadmaps, financial projections, client list details, and marketing plans.` },
            { type: 'header', text: '3. Obligations of Confidentiality' },
            { type: 'paragraph', text: `The Receiving Party agrees to maintain all Confidential Information in strict confidence, and use it solely for evaluating the business relationship. The obligation to protect Confidential Information shall survive for a period of ${val.termYears || '5'} years.` },
            { type: 'header', text: '4. Governing Law' },
            { type: 'paragraph', text: `This Agreement shall be governed by and construed in accordance with the laws of the State of ${val.governingState || '[Governing State]'}, without regard to conflict of laws principles.` },
            { type: 'signature-block', text: 'SIGNATURES' }
        ]
    },

    // ─── LEASE AGREEMENT ──────────────────────────────────
    {
        id: 'lease-agreement-template',
        name: 'Lease Agreement',
        category: 'legal',
        categoryLabel: 'Legal & Liability',
        description: 'Residential lease agreement outlining occupancy rules, monthly rent, deposits, and landlord-tenant covenants.',
        estimatedTime: '5 mins',
        pagesCount: 2,
        popularity: 5,
        fields: [
            { id: 'landlordName', label: 'Landlord Name', type: 'text', placeholder: 'Alpha Property Management', required: true, defaultValue: '', step: 1 },
            { id: 'tenantName', label: 'Tenant Name', type: 'text', placeholder: 'Charlie Brown', required: true, defaultValue: '', step: 1 },
            { id: 'propertyAddress', label: 'Property Address', type: 'text', placeholder: '789 Pine Road', required: true, defaultValue: '', step: 1 },
            { id: 'monthlyRent', label: 'Monthly Rent ($)', type: 'number', placeholder: '2000', required: true, defaultValue: '', step: 2 },
            { id: 'securityDeposit', label: 'Security Deposit ($)', type: 'number', placeholder: '2000', required: true, defaultValue: '', step: 2 },
            { id: 'leaseStart', label: 'Lease Start Date', type: 'date', required: true, defaultValue: '', step: 2 },
            { id: 'leaseEnd', label: 'Lease End Date', type: 'date', required: true, defaultValue: '', step: 2 },
            { id: 'governingState', label: 'Governing State', type: 'text', placeholder: 'Texas', required: true, defaultValue: '', step: 3 }
        ],
        generateContent: (val) => [
            { type: 'title', text: 'RESIDENTIAL LEASE AGREEMENT' },
            { type: 'subtitle', text: `Property: ${val.propertyAddress || '[Property Address]'}` },
            { type: 'paragraph', text: `This Residential Lease Agreement is entered into by and between ${val.landlordName || '[Landlord Name]'} ("Landlord") and ${val.tenantName || '[Tenant Name]'} ("Tenant").` },
            { type: 'header', text: '1. Premises and Lease Term' },
            { type: 'paragraph', text: `The Landlord agrees to lease to the Tenant the property located at: ${val.propertyAddress || '[Property Address]'}. The lease shall commence on ${val.leaseStart ? new Date(val.leaseStart).toLocaleDateString() : '[Start Date]'} and end on ${val.leaseEnd ? new Date(val.leaseEnd).toLocaleDateString() : '[End Date]'}, unless terminated earlier in accordance with the terms of this Lease.` },
            { type: 'header', text: '2. Rent and Security Deposit' },
            { type: 'paragraph', text: `The Monthly Rent shall be $${Number(val.monthlyRent || 0).toLocaleString()} USD, payable on the first day of each calendar month. The Tenant shall also pay a Security Deposit of $${Number(val.securityDeposit || 0).toLocaleString()} USD. The deposit will be returned within thirty (30) days of lease expiration, minus any lawful deductions.` },
            { type: 'header', text: '3. Governing Law' },
            { type: 'paragraph', text: `This Lease shall be governed by and construed in accordance with the laws of the State of ${val.governingState || '[Governing State]'}.` },
            { type: 'signature-block', text: 'SIGNATURES' }
        ]
    },

    // ─── SERVICE AGREEMENT ────────────────────────────────
    {
        id: 'service-agreement-template',
        name: 'Service Agreement',
        category: 'sales',
        categoryLabel: 'Sales & Finance',
        description: 'Professional service contract defining scope, payment terms, and intellectual property ownership between parties.',
        estimatedTime: '4 mins',
        pagesCount: 2,
        popularity: 5,
        fields: [
            { id: 'providerName', label: 'Service Provider Name', type: 'text', placeholder: 'Zenith Consulting', required: true, defaultValue: '', step: 1 },
            { id: 'clientName', label: 'Client Name', type: 'text', placeholder: 'Apex Systems', required: true, defaultValue: '', step: 1 },
            { id: 'serviceDescription', label: 'Services Description', type: 'text', placeholder: 'IT consulting and infrastructure setup', required: true, defaultValue: '', step: 2 },
            { id: 'paymentAmount', label: 'Payment Amount ($)', type: 'number', placeholder: '10000', required: true, defaultValue: '', step: 2 },
            { id: 'paymentTerms', label: 'Payment Terms', type: 'select', options: ['Net 15 days', 'Net 30 days', 'Net 60 days'], required: true, defaultValue: 'Net 30 days', step: 2 },
            { id: 'effectiveDate', label: 'Effective Date', type: 'date', required: true, defaultValue: '', step: 3 },
            { id: 'governingState', label: 'Governing State', type: 'text', placeholder: 'Florida', required: true, defaultValue: '', step: 3 }
        ],
        generateContent: (val) => [
            { type: 'title', text: 'MASTER SERVICES AGREEMENT' },
            { type: 'subtitle', text: `Effective Date: ${val.effectiveDate ? new Date(val.effectiveDate).toLocaleDateString() : '[Effective Date]'}` },
            { type: 'paragraph', text: `This Master Services Agreement is entered into by and between ${val.providerName || '[Service Provider]'} ("Provider") and ${val.clientName || '[Client]'} ("Client").` },
            { type: 'header', text: '1. Services' },
            { type: 'paragraph', text: `The Provider shall perform the following services: ${val.serviceDescription || '[Services Description]'}. The Provider shall perform the services in a professional manner, utilizing reasonable skill and care consistent with standard industry practices.` },
            { type: 'header', text: '2. Compensation and Payment' },
            { type: 'paragraph', text: `The Client shall pay the Provider the fee of $${Number(val.paymentAmount || 0).toLocaleString()} USD, payable in accordance with the payment terms: ${val.paymentTerms || 'Net 30 days'}.` },
            { type: 'header', text: '3. Governing Law' },
            { type: 'paragraph', text: `This Agreement shall be governed by and construed in accordance with the laws of the State of ${val.governingState || '[Governing State]'}.` },
            { type: 'signature-block', text: 'SIGNATURES' }
        ]
    },

    // ─── EMPLOYMENT CONTRACT ──────────────────────────────
    {
        id: 'employment-contract-template',
        name: 'Employment Contract',
        category: 'hr',
        categoryLabel: 'Employment & HR',
        description: 'Standard employment contract specifying salary, role, benefits, and restrictive covenants.',
        estimatedTime: '5 mins',
        pagesCount: 2,
        popularity: 5,
        fields: [
            { id: 'companyName', label: 'Company Name', type: 'text', placeholder: 'Summit Industries', required: true, defaultValue: '', step: 1 },
            { id: 'employeeName', label: 'Employee Full Name', type: 'text', placeholder: 'Alice Johnson', required: true, defaultValue: '', step: 1 },
            { id: 'jobTitle', label: 'Job Title', type: 'text', placeholder: 'Product Designer', required: true, defaultValue: '', step: 1 },
            { id: 'annualSalary', label: 'Annual Salary ($)', type: 'number', placeholder: '90000', required: true, defaultValue: '', step: 2 },
            { id: 'startDate', label: 'Start Date', type: 'date', required: true, defaultValue: '', step: 2 },
            { id: 'noticePeriod', label: 'Notice Period', type: 'select', options: ['2 weeks', '30 days', '60 days'], required: true, defaultValue: '30 days', step: 3 },
            { id: 'governingState', label: 'Governing State', type: 'text', placeholder: 'New York', required: true, defaultValue: '', step: 3 }
        ],
        generateContent: (val) => [
            { type: 'title', text: 'EMPLOYMENT AGREEMENT' },
            { type: 'subtitle', text: `Effective Date: ${val.startDate ? new Date(val.startDate).toLocaleDateString() : '[Start Date]'}` },
            { type: 'paragraph', text: `This Employment Agreement is entered into by and between ${val.companyName || '[Company Name]'} ("Employer") and ${val.employeeName || '[Employee Name]'} ("Employee").` },
            { type: 'header', text: '1. Position and Duties' },
            { type: 'paragraph', text: `The Employer hereby employs the Employee in the position of: ${val.jobTitle || '[Job Title]'}. The Employee shall perform all duties customary for this role and as assigned by the Employer.` },
            { type: 'header', text: '2. Compensation and Benefits' },
            { type: 'paragraph', text: `The Employee shall receive an annual base salary of $${Number(val.annualSalary || 0).toLocaleString()} USD, paid in accordance with the Employer's standard payroll practices. The Employee is also eligible for standard health and retirement benefits.` },
            { type: 'header', text: '3. Termination' },
            { type: 'paragraph', text: `Employment is at-will, and either party may terminate the relationship by providing ${val.noticePeriod || '30 days'} written notice.` },
            { type: 'header', text: '4. Governing Law' },
            { type: 'paragraph', text: `This Agreement shall be governed by and construed in accordance with the laws of the State of ${val.governingState || '[Governing State]'}.` },
            { type: 'signature-block', text: 'SIGNATURES' }
        ]
    },

    // ─── FREELANCE AGREEMENT ──────────────────────────────
    {
        id: 'freelance-agreement-template',
        name: 'Freelance Agreement',
        category: 'hr',
        categoryLabel: 'Employment & HR',
        description: 'Freelance agreement setting project scopes, revision limits, and payment schedules for independent contractors.',
        estimatedTime: '4 mins',
        pagesCount: 2,
        popularity: 5,
        fields: [
            { id: 'clientName', label: 'Client Name', type: 'text', placeholder: 'Omega Startups', required: true, defaultValue: '', step: 1 },
            { id: 'freelancerName', label: 'Freelancer Name', type: 'text', placeholder: 'David Miller', required: true, defaultValue: '', step: 1 },
            { id: 'projectScope', label: 'Project Scope & Deliverables', type: 'text', placeholder: 'UI/UX design for mobile application', required: true, defaultValue: '', step: 2 },
            { id: 'projectRate', label: 'Project Rate ($ / hour)', type: 'number', placeholder: '75', required: true, defaultValue: '', step: 2 },
            { id: 'startDate', label: 'Start Date', type: 'date', required: true, defaultValue: '', step: 2 },
            { id: 'paymentSchedule', label: 'Payment Schedule', type: 'select', options: ['Weekly', 'Bi-weekly', 'Milestone-based', 'Upon Completion'], required: true, defaultValue: 'Milestone-based', step: 3 },
            { id: 'governingState', label: 'Governing State', type: 'text', placeholder: 'Washington', required: true, defaultValue: '', step: 3 }
        ],
        generateContent: (val) => [
            { type: 'title', text: 'FREELANCE AGREEMENT' },
            { type: 'subtitle', text: `Effective Date: ${val.startDate ? new Date(val.startDate).toLocaleDateString() : '[Start Date]'}` },
            { type: 'paragraph', text: `This Freelance Contractor Agreement is entered into by and between ${val.clientName || '[Client Name]'} ("Client") and ${val.freelancerName || '[Freelancer Name]'} ("Freelancer").` },
            { type: 'header', text: '1. Services and Project Scope' },
            { type: 'paragraph', text: `The Freelancer shall perform the creative or technical services described as: ${val.projectScope || '[Project Scope]'}. The Freelancer shall perform all services independently, using their own tools and equipment.` },
            { type: 'header', text: '2. Payment and Invoicing' },
            { type: 'paragraph', text: `The Client agrees to pay the Freelancer at the rate of $${Number(val.projectRate || 0).toLocaleString()} USD per hour. Invoices shall be submitted and paid in accordance with the schedule: ${val.paymentSchedule || 'Milestone-based'}.` },
            { type: 'header', text: '3. Governing Law' },
            { type: 'paragraph', text: `This Agreement shall be governed by and construed in accordance with the laws of the State of ${val.governingState || '[Governing State]'}.` },
            { type: 'signature-block', text: 'SIGNATURES' }
        ]
    },

    // ─── CONSULTING AGREEMENT ─────────────────────────────
    {
        id: 'consulting-agreement-template',
        name: 'Consulting Agreement',
        category: 'sales',
        categoryLabel: 'Sales & Finance',
        description: 'Strategic consulting agreement defining scope of advisory services and monthly retainer terms.',
        estimatedTime: '4 mins',
        pagesCount: 2,
        popularity: 5,
        fields: [
            { id: 'consultantName', label: 'Consultant Name', type: 'text', placeholder: 'Sigma Advisory Group', required: true, defaultValue: '', step: 1 },
            { id: 'clientName', label: 'Client Name', type: 'text', placeholder: 'Beta Corp', required: true, defaultValue: '', step: 1 },
            { id: 'consultingServices', label: 'Consulting Services Description', type: 'text', placeholder: 'Strategic business planning and market analysis', required: true, defaultValue: '', step: 2 },
            { id: 'retainerFee', label: 'Monthly Retainer Fee ($)', type: 'number', placeholder: '5000', required: true, defaultValue: '', step: 2 },
            { id: 'effectiveDate', label: 'Effective Date', type: 'date', required: true, defaultValue: '', step: 2 },
            { id: 'termMonths', label: 'Term Duration (Months)', type: 'number', placeholder: '12', required: true, defaultValue: '12', step: 3 },
            { id: 'governingState', label: 'Governing State', type: 'text', placeholder: 'Delaware', required: true, defaultValue: '', step: 3 }
        ],
        generateContent: (val) => [
            { type: 'title', text: 'CONSULTING SERVICES AGREEMENT' },
            { type: 'subtitle', text: `Effective Date: ${val.effectiveDate ? new Date(val.effectiveDate).toLocaleDateString() : '[Effective Date]'}` },
            { type: 'paragraph', text: `This Consulting Services Agreement is entered into by and between ${val.consultantName || '[Consultant Name]'} ("Consultant") and ${val.clientName || '[Client Name]'} ("Client").` },
            { type: 'header', text: '1. Advisory Services' },
            { type: 'paragraph', text: `The Consultant shall perform the strategic advisory services described as: ${val.consultingServices || '[Consulting Services]'}. The Consultant shall perform services with the highest degree of professional integrity.` },
            { type: 'header', text: '2. Retainer and Invoicing' },
            { type: 'paragraph', text: `The Client shall pay the Consultant a monthly retainer fee of $${Number(val.retainerFee || 0).toLocaleString()} USD. This retainer shall cover services for a term of ${val.termMonths || '12'} months.` },
            { type: 'header', text: '3. Governing Law' },
            { type: 'paragraph', text: `This Agreement shall be governed by and construed in accordance with the laws of the State of ${val.governingState || '[Governing State]'}.` },
            { type: 'signature-block', text: 'SIGNATURES' }
        ]
    },

    // ─── PARTNERSHIP AGREEMENT ────────────────────────────
    {
        id: 'partnership-agreement-template',
        name: 'Partnership Agreement',
        category: 'legal',
        categoryLabel: 'Legal & Liability',
        description: 'General partnership agreement defining business purpose, capital contributions, and voting guidelines.',
        estimatedTime: '5 mins',
        pagesCount: 2,
        popularity: 5,
        fields: [
            { id: 'partner1Name', label: 'Partner 1 Name', type: 'text', placeholder: 'Ethan Hunt', required: true, defaultValue: '', step: 1 },
            { id: 'partner1Contribution', label: 'Partner 1 Capital Contribution ($)', type: 'number', placeholder: '50000', required: true, defaultValue: '', step: 1 },
            { id: 'partner2Name', label: 'Partner 2 Name', type: 'text', placeholder: 'Ilsa Faust', required: true, defaultValue: '', step: 1 },
            { id: 'partner2Contribution', label: 'Partner 2 Capital Contribution ($)', type: 'number', placeholder: '50000', required: true, defaultValue: '', step: 1 },
            { id: 'businessPurpose', label: 'Partnership Business Purpose', type: 'text', placeholder: 'Managing and operating a retail store chain', required: true, defaultValue: '', step: 2 },
            { id: 'effectiveDate', label: 'Effective Date', type: 'date', required: true, defaultValue: '', step: 2 },
            { id: 'governingState', label: 'Governing State', type: 'text', placeholder: 'California', required: true, defaultValue: '', step: 3 }
        ],
        generateContent: (val) => [
            { type: 'title', text: 'PARTNERSHIP AGREEMENT' },
            { type: 'subtitle', text: `Effective Date: ${val.effectiveDate ? new Date(val.effectiveDate).toLocaleDateString() : '[Effective Date]'}` },
            { type: 'paragraph', text: `This General Partnership Agreement is entered into by and between ${val.partner1Name || '[Partner 1 Name]'} and ${val.partner2Name || '[Partner 2 Name]'}.` },
            { type: 'header', text: '1. Formation and Purpose' },
            { type: 'paragraph', text: `The Partners hereby form a general partnership. The business purpose of the partnership shall be: ${val.businessPurpose || '[Business Purpose]'}.` },
            { type: 'header', text: '2. Capital Contributions' },
            { type: 'paragraph', text: `The Partners shall make the following initial capital contributions: Partner 1: $${Number(val.partner1Contribution || 0).toLocaleString()} USD; Partner 2: $${Number(val.partner2Contribution || 0).toLocaleString()} USD.` },
            { type: 'header', text: '3. Governing Law' },
            { type: 'paragraph', text: `This Agreement shall be governed by and construed in accordance with the laws of the State of ${val.governingState || '[Governing State]'}.` },
            { type: 'signature-block', text: 'SIGNATURES' }
        ]
    }
];
