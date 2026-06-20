export interface TemplateFAQ {
  question: string;
  answer: string;
}

export interface TemplateSEOContent {
  slug: string;
  templateId: string;
  templateName: string;
  pageTitle: string;
  metaDescription: string;
  benefits: string;
  introduction: string;
  instructions: string;
  faqs: TemplateFAQ[];
  boilerplateTitle: string;
  boilerplateSections: { title: string; text: string }[];
  imageUrl?: string;
  imageAlt?: string;
  externalLinks?: { label: string; url: string }[];
  relatedTemplates?: { name: string; slug: string }[];
}

const baseTemplateSeoData: Record<string, TemplateSEOContent> = {
  'rofr-template': {
    slug: 'rofr-template',
    templateId: 'rofr-template',
    templateName: 'Right of First Refusal (ROFR)',
    pageTitle: 'Free Right of First Refusal (ROFR) Template - Download & Edit Online',
    metaDescription: 'Download free Right of First Refusal (ROFR) template with professional clauses. Sign online instantly.',
    benefits: 'professional clauses',
    introduction: 'A Right of First Refusal (ROFR) is a powerful contractual agreement that grants a specific party (the holder or grantee) the legal right to purchase an asset, property, or business interest before the owner (the grantor) can sell it to a third party. This arrangement is widely used in real estate transactions, corporate shareholding agreements, and general business ventures to protect existing investments and maintain control over asset transfers. By establishing a ROFR, the grantee is assured that if the owner receives a bona fide offer from an outside buyer, the owner must first offer the same terms to the grantee. This ensures that stakeholders have the opportunity to acquire critical assets or prevent competitors from acquiring them, aligning interests and providing long-term security in commercial relationships.',
    instructions: 'To effectively customize and execute this Right of First Refusal agreement, follow these instructions. First, clearly identify the parties: the Grantor (the asset owner) and the Grantee (the holder of the refusal right). Second, define the asset or property with maximum specificity, including parcel numbers, addresses, or share classes. Third, establish the exact notice period, typically 30 days, which dictates how long the Grantee has to match a third-party offer. Fourth, outline any exceptions, such as transfers to family members or corporate affiliates. Finally, share the document securely via DocTransfer to collect verified, legally binding e-signatures from all participating parties.',
    boilerplateTitle: 'RIGHT OF FIRST REFUSAL AGREEMENT',
    boilerplateSections: [
      {
        title: '1. Grant of Right of First Refusal',
        text: 'The Grantor hereby grants to the Grantee the exclusive Right of First Refusal to purchase the Property/Asset described in Exhibit A of this Agreement. This right applies to any proposed sale, transfer, lease, assignment, or other disposition of the Property/Asset by the Grantor, whether voluntary or involuntary, during the term of this Agreement.'
      },
      {
        title: '2. Notice of Bona Fide Offer',
        text: 'In the event that the Grantor receives a bona fide, written offer from a third party to purchase the Property/Asset, and the Grantor desires to accept said offer, the Grantor shall immediately deliver to the Grantee a written notice ("Notice of Offer"). The Notice of Offer must include a complete and accurate copy of the third-party offer, outlining the purchase price, payment terms, closing date, and all other material conditions.'
      },
      {
        title: '3. Exercise of Right of Refusal',
        text: 'The Grantee shall have a period of thirty (30) calendar days from the date of receipt of the Notice of Offer to elect to purchase the Property/Asset. To exercise this right, the Grantee must deliver a written notice of acceptance to the Grantor, agreeing to purchase the Property/Asset under the identical terms and conditions set forth in the Notice of Offer.'
      },
      {
        title: '4. Failure to Exercise and Sale to Third Party',
        text: 'If the Grantee fails to deliver a written notice of acceptance within the thirty (30) day exercise period, or explicitly declines the offer in writing, the Grantee\'s Right of First Refusal for that specific offer shall be deemed waived. The Grantor may then proceed to sell the Property/Asset to the third party under terms no more favorable to the third party than those offered to the Grantee. If such sale does not close within ninety (90) days, the Right of First Refusal shall automatically reinstate.'
      },
      {
        title: '5. Permitted Transfers and Exclusions',
        text: 'Notwithstanding the foregoing, the Right of First Refusal shall not apply to transfers made: (a) to the Grantor\'s spouse, children, or immediate family members; (b) to a trust created for the sole benefit of the Grantor or immediate family; or (c) to a business entity in which the Grantor holds a controlling interest. Any transferee under these exclusions must agree in writing to be bound by the terms of this Agreement.'
      },
      {
        title: '6. Term, Governing Law, and Dispute Resolution',
        text: 'This Agreement shall commence on the Effective Date and remain in full force and effect for a period of ten (10) years, unless terminated earlier by mutual written consent. This Agreement shall be governed by, and construed in accordance with, the laws of the State of the asset\'s location. Any disputes arising under or in connection with this Agreement shall be resolved through binding arbitration in accordance with local commercial arbitration rules.'
      }
    ],
    faqs: [
      {
        question: 'What is the main difference between a Right of First Refusal (ROFR) and a Right of First Offer (ROFO)?',
        answer: 'A Right of First Refusal (ROFR) gives the holder the right to match a completed, bona fide offer received by the owner from a third party before the sale can proceed. In contrast, a Right of First Offer (ROFO) requires the owner to offer the asset to the holder first at a proposed price before marketing the asset to third parties. Under a ROFO, if the holder declines, the owner can sell to anyone, usually as long as the price is not lower than the offer made to the holder.'
      },
      {
        question: 'Does having a Right of First Refusal on a property devalue it or affect its marketability?',
        answer: 'Yes, a ROFR can sometimes reduce the market value or marketability of an asset. Outside buyers may be reluctant to invest time and money negotiating a purchase agreement if they know a ROFR holder can step in at the last minute and take the deal. For this reason, landowners often request high fees or specific conditions before granting a ROFR.'
      },
      {
        question: 'How long does a Right of First Refusal holder typically have to respond to a notice?',
        answer: 'The response period is entirely negotiable and defined in the contract. However, standard agreements typically set a window of 15 to 30 calendar days for the holder to review the third-party terms, arrange financing, and deliver a formal written acceptance. Longer periods can make the asset harder to sell, while shorter periods may be impractical for the holder.'
      },
      {
        question: 'What happens if the grantor sells the asset without notifying the ROFR holder?',
        answer: 'If the grantor sells the asset to a third party without offering it to the ROFR holder first, it constitutes a material breach of contract. The holder can sue the grantor for damages, including lost profits. In some jurisdictions, the court may even void the third-party sale and force the transfer of the asset to the ROFR holder under the negotiated terms, especially if the third-party buyer had notice of the ROFR.'
      }
    ]
  },
  'nda-template': {
    slug: 'nda-template',
    templateId: 'nda-template',
    templateName: 'Non-Disclosure Agreement (NDA)',
    pageTitle: 'Free Non-Disclosure Agreement (NDA) Template - Download & Edit Online',
    metaDescription: 'Download free Non-Disclosure Agreement (NDA) template with protective confidentiality clauses. Sign online instantly.',
    benefits: 'protective confidentiality clauses',
    introduction: 'A Non-Disclosure Agreement (NDA), also referred to as a confidentiality agreement, is a vital legal contract designed to protect sensitive, proprietary, or non-public information from unauthorized disclosure. In modern business, NDAs are essential for fostering trust during initial merger discussions, partnership evaluations, hiring processes, or product development collaborations. By executing an NDA, the signing parties commit to keeping shared information strictly confidential, establishing a legal framework that outlines what constitutes confidential info, how it can be used, and the consequences of a breach. Whether you are a startup sharing a pitch deck or an enterprise licensing technology, a robust NDA safeguards your intellectual property and competitive edge.',
    instructions: 'Drafting and signing a Non-Disclosure Agreement requires careful attention to key details. Begin by identifying whether the agreement is Mutual (both parties share and protect information) or Unilateral (only one party discloses). Next, specify the exact Scope of Confidential Information, listing items like source code, customer databases, or financial models. Define the Term of Protection, which typically ranges from 2 to 5 years after the agreement terminates. Specify the Governing Law to determine which state courts will resolve disputes. Finally, send the draft to participants via DocTransfer to collect secure, compliant e-signatures and establish a digital audit trail.',
    boilerplateTitle: 'NON-DISCLOSURE AND CONFIDENTIALITY AGREEMENT',
    boilerplateSections: [
      {
        title: '1. Definition of Confidential Information',
        text: '"Confidential Information" refers to any proprietary, non-public, or sensitive information disclosed by one Party ("Disclosing Party") to the other Party ("Receiving Party"), whether orally, visually, or in writing. This includes technical data, trade secrets, software designs, product roadmaps, financial projections, client list details, and marketing plans. Information does not need to be marked as "confidential" if it should reasonably be understood as confidential given the circumstances of disclosure.'
      },
      {
        title: '2. Obligations of Confidentiality and Non-Use',
        text: 'The Receiving Party agrees to: (a) maintain all Confidential Information in strict confidence; (b) use the Confidential Information solely for evaluating and executing the business relationship between the parties; and (c) restrict disclosure of the Confidential Information to employees, contractors, and legal advisors who have a clear need-to-know and are bound by written confidentiality terms no less restrictive than this Agreement.'
      },
      {
        title: '3. Exclusions from Confidentiality',
        text: 'Confidential Information does not include information that: (a) was already in the Receiving Party\'s lawful possession prior to disclosure; (b) is or becomes publicly available through no breach or fault of the Receiving Party; (c) is independently developed by the Receiving Party without reference to or reliance on the Disclosing Party\'s Confidential Information; or (d) is rightfully received from a third party without confidentiality restrictions.'
      },
      {
        title: '4. Compelled Legal Disclosure',
        text: 'If the Receiving Party is legally compelled by court order, subpoena, or government regulation to disclose any Confidential Information, the Receiving Party shall provide the Disclosing Party with prompt written notice. This allows the Disclosing Party to seek a protective order or other appropriate remedy. The Receiving Party shall only disclose the minimum portion of Confidential Information legally required.'
      },
      {
        title: '5. Term and Return of Materials',
        text: 'This Agreement shall govern disclosures made within three (3) years from the Effective Date. The Receiving Party\'s obligation to protect Confidential Information shall survive for a period of five (5) years following the termination of this Agreement. Upon written request by the Disclosing Party, the Receiving Party shall immediately return or destroy all physical documents, electronic files, and copies containing Confidential Information.'
      },
      {
        title: '6. Remedies, Governing Law, and Jurisdiction',
        text: 'The Receiving Party acknowledges that any breach of this Agreement may cause irreparable harm for which monetary damages alone would be inadequate. Accordingly, the Disclosing Party shall be entitled to seek injunctive relief to prevent breaches. This Agreement shall be governed by and construed under the laws of the State of Delaware, and any legal actions must be brought in the competent courts of that jurisdiction.'
      }
    ],
    faqs: [
      {
        question: 'What is the difference between a mutual NDA and a unilateral NDA?',
        answer: 'A unilateral NDA is used when only one party is disclosing confidential information to another party (e.g., an employer hiring a freelancer or a startup pitching to a VC). A mutual NDA is used when both parties will be sharing confidential information with each other (e.g., two companies exploring a strategic joint venture or technology integration).'
      },
      {
        question: 'How long does a Non-Disclosure Agreement typically remain in effect?',
        answer: 'The duration depends on the nature of the information. Most commercial NDAs protect information for a period of 2 to 5 years from the date of disclosure. However, trade secrets (like search algorithms or proprietary formulas) are often protected indefinitely, or for as long as the information remains secret.'
      },
      {
        question: 'Can an NDA prevent someone from working for a competitor?',
        answer: 'No. An NDA only prevents the unauthorized disclosure and use of confidential information. To restrict someone from working for a competitor, you must include a separate Non-Compete Clause. Non-compete clauses are subject to strict legal scrutiny and are banned or heavily restricted in many jurisdictions (such as California).'
      },
      {
        question: 'What happens if someone breaches a Non-Disclosure Agreement?',
        answer: 'If a party breaches the NDA by disclosing or using confidential info without permission, the discloser can file a lawsuit. Remedies include obtaining an injunction to stop further disclosures, suing for damages (lost profits, corrective marketing costs), and in some cases, reclaiming profits made by the breaching party using the stolen information.'
      }
    ]
  },
  'lease-agreement-template': {
    slug: 'lease-agreement-template',
    templateId: 'lease-agreement-template',
    templateName: 'Lease Agreement',
    pageTitle: 'Free Lease Agreement Template - Download & Edit Online',
    metaDescription: 'Download free Lease Agreement template with comprehensive landlord & tenant terms. Sign online instantly.',
    benefits: 'comprehensive landlord & tenant terms',
    introduction: 'A Lease Agreement is a foundational contract in real estate that outlines the terms and conditions under which a landlord rents a residential or commercial property to a tenant. Establishing a clear, written lease is vital for protecting the interests of both parties, ensuring compliance with local housing codes, and preventing disputes over rent payments, property maintenance, and occupancy rules. A standard lease agreement covers key details such as the monthly rent rate, payment due dates, security deposit requirements, pet policies, utilities responsibility, and lease duration. By clearly documenting these expectations, both landlords and tenants can operate with confidence, backed by a legally binding framework.',
    instructions: 'Creating a comprehensive Lease Agreement requires specifying several key elements. Start by inputting the full names of the Landlord and all adult Tenants who will occupy the property. Describe the premises in detail, including the full address and any included parking spots or storage areas. Define the financial terms, including the exact monthly rent, security deposit amount, late payment fees, and accepted payment methods. Outline key rules, such as pet policies, quiet hours, and maintenance procedures. Finally, use DocTransfer to route the completed agreement for digital signatures, ensuring a secure, tamper-proof lease execution.',
    boilerplateTitle: 'RESIDENTIAL LEASE AGREEMENT',
    boilerplateSections: [
      {
        title: '1. Agreement to Lease and Description of Premises',
        text: 'The Landlord hereby agrees to lease to the Tenant, and the Tenant hereby agrees to lease from the Landlord, the real property located at the full street address detailed in the schedule of this Agreement, including all fixtures, appliances, and common areas associated with the premises.'
      },
      {
        title: '2. Term of the Lease',
        text: 'This Lease shall be for a fixed term of twelve (12) months, commencing on the Start Date specified in the schedule and terminating on the End Date. If either party intends to vacate or modify the lease upon expiration, they must deliver a written notice of intent at least sixty (60) days prior to the expiration date.'
      },
      {
        title: '3. Rent, Late Fees, and Financial Obligations',
        text: 'The Tenant agrees to pay the Landlord a Monthly Rent of the agreed-upon amount, payable in advance on or before the first (1st) day of each calendar month. If rent is not paid by the fifth (5th) day, a late fee of $75.00 shall be assessed. Rent must be paid via electronic bank transfer, check, or the designated online tenant portal.'
      },
      {
        title: '4. Security Deposit and Return Conditions',
        text: 'Upon execution of this Lease, the Tenant shall deposit with the Landlord a Security Deposit equal to one month\'s rent. The deposit shall be held as security for any damages caused to the premises during occupancy, beyond normal wear and tear. The Landlord shall return the security deposit within thirty (30) days of lease termination, accompanied by an itemized list of deductions if applicable.'
      },
      {
        title: '5. Maintenance, Repairs, and Access to Property',
        text: 'The Landlord shall maintain the structural integrity, plumbing, electrical, and heating systems of the premises. The Tenant shall keep the interior clean, sanitary, and in good repair. The Tenant must notify the Landlord promptly of any defects. The Landlord reserves the right to enter the premises for inspections or repairs, provided a minimum of twenty-four (24) hours\' advance notice is given, except in emergencies.'
      },
      {
        title: '6. Rules, Restrictions, and Governing Law',
        text: 'The Tenant shall comply with all local, state, and federal laws, as well as building association rules. Subleasing the premises is strictly prohibited without the prior written consent of the Landlord. This Lease shall be governed by, and construed in accordance with, the landlord-tenant laws of the state where the property is located.'
      }
    ],
    faqs: [
      {
        question: 'Can a landlord increase the rent during the term of the lease agreement?',
        answer: 'No. Under a fixed-term lease (such as a 1-year lease), the landlord cannot increase the rent until the lease term expires, unless the contract specifically includes a clause allowing for adjustments. For month-to-month tenancies, landlords can increase the rent by providing proper notice, usually 30 to 60 days, subject to local rent control limits.'
      },
      {
        question: 'What is the standard amount for a security deposit?',
        answer: 'The security deposit is typically equal to one or two months\' rent. Many states set legal limits on the maximum amount a landlord can charge for a security deposit (e.g., California limits residential deposits to a maximum of two months\' rent for unfurnished apartments).'
      },
      {
        question: 'Who is responsible for repairs and maintenance in a rental property?',
        answer: 'The landlord is legally responsible for maintaining the property in a habitable condition, which includes structural repairs, plumbing, heating, and electrical systems. The tenant is responsible for keeping the premises clean, using fixtures properly, repairing damages caused by their own negligence, and replacing minor items like lightbulbs.'
      },
      {
        question: 'What happens if a tenant needs to break the lease early?',
        answer: 'Breaking a lease early can result in financial liabilities. The tenant may be responsible for paying rent until the landlord finds a replacement tenant, or paying an early termination fee if specified in the lease. Landlords are generally required by law to make reasonable efforts to mitigate damages by finding a new tenant as quickly as possible.'
      }
    ]
  },
  'service-agreement-template': {
    slug: 'service-agreement-template',
    templateId: 'service-agreement-template',
    templateName: 'Service Agreement',
    pageTitle: 'Free Service Agreement Template - Download & Edit Online',
    metaDescription: 'Download free Service Agreement template with clear deliverables and payment terms. Sign online instantly.',
    benefits: 'clear deliverables and payment terms',
    introduction: 'A Service Agreement is a formal commercial contract between a service provider and a client that defines the terms under which professional services will be rendered. Used across industries ranging from software development and digital marketing to general contracting and consulting, this agreement is crucial for aligning expectations, establishing payment structures, and mitigating liability. A well-constructed service agreement details the scope of work, project milestones, compensation rates, intellectual property rights, confidentiality clauses, and termination procedures. Having a clear agreement ensures that both parties understand their roles, helping to build productive, dispute-free business relationships.',
    instructions: 'To prepare a professional Service Agreement, begin by entering the business names and contact information for the Provider and the Client. In the Scope of Work section, describe the specific deliverables, deadlines, and standards of quality expected. Detail the financial arrangements, including fixed fees, hourly rates, retainer amounts, and payment terms (e.g., Net 30 days). Clearly define intellectual property ownership, specifying whether the work product belongs to the Client or if the Provider retains ownership with a license. Finally, route the document through DocTransfer to obtain legally binding digital signatures and ensure secure document storage.',
    boilerplateTitle: 'MASTER SERVICES AGREEMENT',
    boilerplateSections: [
      {
        title: '1. Engagement and Scope of Services',
        text: 'The Client hereby engages the Service Provider to perform the professional services detailed in Exhibit A (Scope of Work). The Service Provider agrees to perform the services in a professional manner, utilizing reasonable skill and care consistent with standard industry practices, and in compliance with all applicable regulations.'
      },
      {
        title: '2. Compensation, Invoicing, and Payment Terms',
        text: 'The Client shall pay the Service Provider the fees specified in the payment schedule. The Service Provider shall submit invoices upon completing milestones or on a monthly basis. All invoices are due and payable within thirty (30) days from the date of invoice. Late payments shall accrue interest at a rate of 1.5% per month on any outstanding balances.'
      },
      {
        title: '3. Term and Termination of Agreement',
        text: 'This Agreement shall commence on the Effective Date and remain in effect until the services are completed, unless terminated earlier. Either party may terminate this Agreement for convenience by providing thirty (30) days\' written notice. Either party may terminate immediately for cause if the other party commits a material breach and fails to cure such breach within ten (10) days of receiving written notice.'
      },
      {
        title: '4. Intellectual Property Rights and Ownership',
        text: 'Except as otherwise agreed in writing, all work product, source code, designs, and deliverables created by the Service Provider specifically for the Client under this Agreement shall become the sole and exclusive property of the Client upon receipt of full payment. The Service Provider retains ownership of its pre-existing materials, tools, and methodologies used to perform the services.'
      },
      {
        title: '5. Limitation of Liability and Indemnification',
        text: 'To the maximum extent permitted by law, neither party shall be liable for indirect, incidental, special, or consequential damages. The Service Provider\'s total liability under this Agreement shall not exceed the total fees paid by the Client to the Service Provider during the six (6) months prior to the event giving rise to the claim.'
      },
      {
        title: '6. Governing Law, Dispute Resolution, and Amendments',
        text: 'This Agreement shall be governed by and construed in accordance with the laws of the State of Florida. Any dispute arising out of this Agreement shall first be submitted to mediation, and if unresolved, to binding arbitration in accordance with local rules. This Agreement may only be amended by a written document signed by authorized representatives of both parties.'
      }
    ],
    faqs: [
      {
        question: 'What is the purpose of a Scope of Work (SOW) in a service agreement?',
        answer: 'The Scope of Work (SOW) is the most critical part of a service agreement. It defines exactly what services will be provided, the deliverables, project deadlines, quality standards, and acceptance criteria. A detailed SOW prevents "scope creep," where a client expects extra work without additional pay, or a provider delivers incomplete work.'
      },
      {
        question: 'How do payment terms like "Net 30" work in professional agreements?',
        answer: '"Net 30" means that the client has 30 calendar days from the date they receive the invoice to pay the outstanding balance. Similarly, Net 15 means payment is due within 15 days. Agreements should specify late payment fees or interest rates to encourage timely payments.'
      },
      {
        question: 'Who owns the intellectual property (IP) created under a service agreement?',
        answer: 'By default, the creator of the work owns the IP. However, most service agreements include a clause stating that all rights, title, and interest in the deliverables transfer to the client once the provider receives full payment. Providers usually retain rights to their pre-existing templates, code libraries, or tools.'
      },
      {
        question: 'How can a service agreement be terminated if the project goes poorly?',
        answer: 'Service agreements typically include two termination clauses: "Termination for Convenience" (allowing either party to end the contract with notice, usually 30 days, without penalty) and "Termination for Cause" (allowing immediate termination if one party breaches a material term, such as non-payment or failure to deliver work, and fails to fix it within a set cure period).'
      }
    ]
  },
  'employment-contract-template': {
    slug: 'employment-contract-template',
    templateId: 'employment-contract-template',
    templateName: 'Employment Contract',
    pageTitle: 'Free Employment Contract Template - Download & Edit Online',
    metaDescription: 'Download free Employment Contract template with full-time benefits & protections. Sign online instantly.',
    benefits: 'full-time benefits & protections',
    introduction: 'An Employment Contract is a formal legally binding agreement between an employer and an employee that establishes the terms, conditions, rights, and duties of the employment relationship. Crucial for both full-time and part-time positions, a detailed employment contract provides clarity on job titles, responsibilities, compensation, working hours, benefit packages, and company policies. Additionally, it protects company assets by incorporating non-compete, confidentiality, and intellectual property ownership clauses. Having a written contract in place minimizes misunderstandings and provides legal protection for both employers and employees in case disputes arise over job expectations or termination terms.',
    instructions: 'When drafting an Employment Contract, ensure you cover all vital parameters. Identify the employer and employee, and state the position title, department, and direct supervisor. Specify the compensation structure, including base salary, pay frequency, bonus eligibility, and overtime terms. Outline standard working hours, remote work policies, and paid time off (PTO) allocations. Address termination procedures, notice periods, and post-employment covenants like non-solicitation. Finally, execute the contract using DocTransfer to secure verified electronic signatures and maintain a complete audit record.',
    boilerplateTitle: 'EMPLOYMENT AGREEMENT',
    boilerplateSections: [
      {
        title: '1. Position, Duties, and Performance Standards',
        text: 'The Employer hereby employs the Employee, and the Employee accepts employment, in the position of job title. The Employee shall perform all duties customary for this role and as assigned by the Employer. The Employee agrees to perform all duties faithfully, diligently, and in accordance with the highest standards of professional conduct.'
      },
      {
        title: '2. Compensation, Base Salary, and Benefits',
        text: 'The Employee shall receive a base salary of the agreed annual amount, paid semi-monthly. The Employee shall be eligible to participate in the Employer\'s standard benefit programs, including health insurance, retirement plans, and paid time off (PTO), subject to the terms of each respective plan and company policy.'
      },
      {
        title: '3. Hours of Work, Location, and Policies',
        text: 'The Employee\'s standard working hours shall be forty (40) hours per week. The Employee shall perform duties primarily at the Employer\'s offices or from a remote location as authorized by the Employer. The Employee agrees to adhere to all employee handbook policies, safety guidelines, and code of conduct regulations established by the Employer.'
      },
      {
        title: '4. Confidentiality and Intellectual Property Ownership',
        text: 'The Employee shall maintain strict confidentiality regarding all trade secrets, customer lists, financial data, and proprietary business information of the Employer during and after employment. All inventions, works of authorship, software, and intellectual property developed by the Employee in the course of employment shall be the sole and exclusive property of the Employer.'
      },
      {
        title: '5. Termination of Employment and Notice Period',
        text: 'Employment is at-will, meaning either party may terminate the relationship at any time, with or without cause, by providing thirty (30) days\' written notice. The Employer reserves the right to terminate employment immediately and without notice for Cause, including gross misconduct, theft, fraud, neglect of duty, or breach of this Agreement.'
      },
      {
        title: '6. Post-Employment Restrictive Covenants and Governing Law',
        text: 'For twelve (12) months following termination of employment, the Employee shall not solicit any clients or recruit any employees of the Employer. This Agreement shall be governed by, and construed in accordance with, the laws of the State of New York. Any disputes shall be resolved through binding arbitration in the county of the Employer\'s headquarters.'
      }
    ],
    faqs: [
      {
        question: 'What does "at-will employment" mean in an employment contract?',
        answer: '"At-will employment" is a legal doctrine stating that either the employer or the employee can terminate the employment relationship at any time, for any lawful reason, or for no reason at all, with or without notice. Most standard employment contracts in the United States establish an at-will relationship.'
      },
      {
        question: 'Are non-compete clauses legally enforceable in all states?',
        answer: 'No. The enforceability of non-compete clauses varies significantly by state. Some states, like California, North Dakota, and Minnesota, ban non-compete agreements entirely for most employees. Other states allow them but require them to be reasonable in duration (usually under 1 year) and geographic scope.'
      },
      {
        question: 'Can an employer change the terms of an employment contract after it is signed?',
        answer: 'Generally, an employment contract cannot be changed without the written consent of both parties. However, in at-will employment, employers may alter policies, job duties, or benefits unilaterally, provided they give notice and the changes do not violate existing contract terms or labor laws.'
      },
      {
        question: 'What is the difference between an employee and an independent contractor?',
        answer: 'The primary difference is the degree of control the business has over how the work is performed. Employees have taxes withheld, use company equipment, have set working hours, and receive benefits. Contractors operate independently, use their own tools, invoice for their services, and are responsible for their own taxes.'
      }
    ]
  },
  'freelance-agreement-template': {
    slug: 'freelance-agreement-template',
    templateId: 'freelance-agreement-template',
    templateName: 'Freelance Agreement',
    pageTitle: 'Free Freelance Agreement Template - Download & Edit Online',
    metaDescription: 'Download free Freelance Agreement template with flexible contractor clauses. Sign online instantly.',
    benefits: 'flexible contractor clauses',
    introduction: 'A Freelance Agreement, also known as an independent contractor agreement, is a vital contract that defines the working relationship between a freelance professional and a client. As the gig economy expands, having a clear freelance agreement is essential for protecting both parties, outlining the specific project scope, establishing payment rates, and clarifying that the freelancer is an independent contractor rather than an employee. A strong agreement covers critical details such as project deadlines, invoice schedules, expense reimbursements, intellectual property ownership, and liability limitations. Implementing a written agreement ensures that creative and technical professionals receive timely payment and clients receive quality deliverables on schedule.',
    instructions: 'Creating a freelance contract involves documenting a few essential terms. Identify the Freelancer and the Client, and provide contact details for both. In the Project Scope, describe the exact deliverables, revision limits, and deadlines. Specify the payment structure, whether it is an hourly rate, a flat project fee, or milestone-based payments, and detail the invoice schedule. Clarify that the Freelancer is responsible for their own taxes and insurance. Finally, send the contract via DocTransfer to collect secure, legally binding signatures from both parties.',
    boilerplateTitle: 'FREELANCE CONTRACTOR AGREEMENT',
    boilerplateSections: [
      {
        title: '1. Services and Project Deliverables',
        text: 'The Client hereby engages the Freelancer to perform the creative or technical services described in the Project Scope. The Freelancer shall perform all services independently, using their own tools, methodologies, and equipment, and shall deliver work meeting the agreed quality standards and deadlines.'
      },
      {
        title: '2. Payment, Hourly Rates, and Invoicing',
        text: 'The Client agrees to pay the Freelancer the agreed-upon rate. The Freelancer shall submit invoices upon completing milestones or upon project completion. The Client shall pay all undisputed invoices within fifteen (15) days of receipt. Late payments shall incur a flat fee of $50.00 plus interest of 1% per month.'
      },
      {
        title: '3. Revisions and Scope Adjustments',
        text: 'The freelance fee includes up to two (2) rounds of minor revisions to the deliverables. Any additional revisions, modifications, or scope expansions requested by the Client shall be billed at the Freelancer\'s standard hourly rate of $75.00 per hour, requiring prior written approval from the Client.'
      },
      {
        title: '4. Independent Contractor Status and Taxes',
        text: 'The Freelancer operates as an independent contractor. Nothing in this Agreement shall create an employer-employee relationship. The Freelancer is solely responsible for all tax returns, self-employment taxes, income tax withholdings, and business insurances required under federal, state, and local laws.'
      },
      {
        title: '5. Intellectual Property Ownership and Transfer',
        text: 'All intellectual property rights in the final deliverables shall remain the property of the Freelancer until the Client has paid all outstanding fees in full. Upon receipt of full payment, all rights, title, and interest in the final deliverables shall transfer to the Client. The Freelancer retains rights to display the work in portfolios.'
      },
      {
        title: '6. Confidentiality, Termination, and Governing Law',
        text: 'Both parties agree to protect any confidential business information shared during the project. Either party may terminate this Agreement by providing seven (7) days\' written notice. Upon termination, the Freelancer shall be compensated for all work completed up to the termination date. This Agreement is governed by the laws of Washington state.'
      }
    ],
    faqs: [
      {
        question: 'Why do freelancers need a written contract before starting work?',
        answer: 'A written contract protects freelancers from non-payment, scope creep, and liability. It clearly defines the scope of work (so the client doesn\'t add extra tasks for free), outlines payment terms (when and how the freelancer gets paid), and establishes who owns the final creative designs or code.'
      },
      {
        question: 'Who owns the intellectual property of freelance work?',
        answer: 'By default, the freelance creator owns the copyright to any work they produce. However, standard contracts transfer ownership of the final deliverables to the client once the client pays the invoice in full. Freelancers should ensure they keep a license to display the work in their portfolios.'
      },
      {
        question: 'How should freelancers handle client requests for unlimited revisions?',
        answer: 'Contracts should specify a limit on revisions (usually 2 or 3 rounds of edits). This prevents clients from requesting endless changes that delay the project. Any revisions beyond the limit should be billed at an additional hourly rate, agreed upon in writing.'
      },
      {
        question: 'What tax forms do clients send to freelancers in the U.S.?',
        answer: 'Clients in the United States must send a Form 1099-NEC to any freelancer whom they paid $600 or more during the tax year. Freelancers do not have taxes withheld by clients, so they must make quarterly estimated tax payments to the IRS and state tax agencies.'
      }
    ]
  },
  'consulting-agreement-template': {
    slug: 'consulting-agreement-template',
    templateId: 'consulting-agreement-template',
    templateName: 'Consulting Agreement',
    pageTitle: 'Free Consulting Agreement Template - Download & Edit Online',
    metaDescription: 'Download free Consulting Agreement template with professional retainer & scope terms. Sign online instantly.',
    benefits: 'professional retainer & scope terms',
    introduction: 'A Consulting Agreement is a premium business contract between an independent consultant or agency and a client that outlines the terms of a professional advisory engagement. Unlike standard service contracts, consulting agreements often involve high-level strategic advisory work, market analysis, or specialized technical expertise. A well-designed agreement is essential for defining the consultant\'s scope of work, retainer fees, project durations, intellectual property rights, non-disclosure terms, and liability limits. This contract ensures that the consultant is compensated appropriately for their expertise and the client receives actionable insights and deliverables to drive business growth.',
    instructions: 'Drafting a Consulting Agreement requires documenting key parameters. Identify the Consultant and Client corporations, and set the agreement start date. Clearly specify the advisory services to be provided, such as market research, system audits, or strategic planning. Detail the fee structure, specifying if it is a monthly retainer, a fixed fee, or an hourly rate, and list accepted payment methods. Outline intellectual property clauses, determining if the client owns the resulting reports or if the consultant retains proprietary methodologies. Finally, route the agreement via DocTransfer to collect secure digital signatures.',
    boilerplateTitle: 'CONSULTING SERVICES AGREEMENT',
    boilerplateSections: [
      {
        title: '1. Engagement and Advisory Services',
        text: 'The Client hereby retains the Consultant, and the Consultant agrees to perform the high-level strategic and advisory services described in the Consulting Schedule. The Consultant shall perform all services with the highest degree of professional integrity, utilizing specialized knowledge and industry expertise.'
      },
      {
        title: '2. Retainer, Fees, and Payment Schedule',
        text: 'The Client shall pay the Consultant a monthly retainer fee of the agreed amount, payable in advance on the first (1st) day of each month. The Client shall reimburse the Consultant for all reasonable, pre-approved travel and administrative expenses upon receiving itemized receipts. Payment is due within thirty (30) days of invoicing.'
      },
      {
        title: '3. Term, Duration, and Termination',
        text: 'This Agreement shall begin on the Effective Date and continue for a term of twelve (12) months. Either party may terminate this Agreement without cause by providing thirty (30) days\' prior written notice. In the event of termination, the Client shall pay for all services rendered and expenses incurred up to the termination date.'
      },
      {
        title: '4. Proprietary Information and Confidentiality',
        text: 'The Consultant shall not disclose, utilize, or publish any confidential business data, financial records, or operational secrets of the Client acquired during the engagement. This confidentiality obligation shall remain in effect indefinitely after the termination of this Agreement, protecting the Client\'s proprietary interests.'
      },
      {
        title: '5. Pre-Existing Methodologies and IP Ownership',
        text: 'The Consultant retains sole ownership of all pre-existing methodologies, templates, analytical models, and software tools utilized during the engagement. The Client shall own all final customized reports, presentation slides, and strategic recommendations created specifically for the Client under this Agreement.'
      },
      {
        title: '6. Limitation of Liability and Governing Law',
        text: 'The Consultant\'s total aggregate liability for any claims arising out of this Agreement shall be limited to the total fees paid by the Client to the Consultant under this contract. This Agreement shall be governed by, and construed in accordance with, the laws of the State of Delaware, without regard to conflict of laws principles.'
      }
    ],
    faqs: [
      {
        question: 'What is a consulting retainer and how does it work?',
        answer: 'A retainer is a pre-arranged fee paid by a client to secure a consultant\'s availability for a set period (usually monthly). Retainers can be "hours-based" (where the client pays for a block of hours each month) or "value-based" (where the client pays for ongoing strategic advisory access, regardless of the exact hours spent).'
      },
      {
        question: 'Who owns the strategic models and templates used by a consultant?',
        answer: 'The consultant retains ownership of their pre-existing methodologies, models, templates, and frameworks. The client receives a license to use these tools internally, but they do not own them. The client does, however, own the final customized deliverables, such as reports, maps, and plans.'
      },
      {
        question: 'What is a limitation of liability clause in a consulting agreement?',
        answer: 'A limitation of liability clause caps the maximum amount of money a consultant would have to pay the client in damages if something goes wrong. Typically, liability is capped at the total amount of fees the client paid to the consultant under the agreement, protecting the consultant\'s business.'
      },
      {
        question: 'How do consultants handle expense reimbursements?',
        answer: 'Consultants should include an expense clause stating that the client will reimburse them for reasonable travel, lodging, meals, and administrative costs. To prevent disputes, contracts usually require expenses over a certain amount to be pre-approved by the client in writing.'
      }
    ]
  },
  'partnership-agreement-template': {
    slug: 'partnership-agreement-template',
    templateId: 'partnership-agreement-template',
    templateName: 'Partnership Agreement',
    pageTitle: 'Free Partnership Agreement Template - Download & Edit Online',
    metaDescription: 'Download free Partnership Agreement template with capital contribution & distribution clauses. Sign online instantly.',
    benefits: 'capital contribution & distribution clauses',
    introduction: 'A Partnership Agreement is a foundational legal document that establishes the governing rules, ownership percentages, financial responsibilities, and operational procedures for a business partnership. Crucial for general partnerships, limited partnerships, and joint ventures, a comprehensive agreement ensures that all partners are aligned on capital contributions, profit-sharing ratios, decision-making powers, and dispute resolution methods. By documenting these terms, partners can avoid costly legal conflicts, protect their personal assets, and establish a clear framework for managing, growing, or dissolving the business cooperatively.',
    instructions: 'To establish a solid Partnership Agreement, begin by identifying the partners and the official business name. Specify the initial capital contribution (cash, property, or services) each partner will provide. Define the profit and loss allocation percentages, which are often proportional to capital contributions. Outline the management structure, specifying who handles daily operations and which decisions require unanimous agreement. Define the process for adding new partners or handling a partner\'s exit. Finally, use DocTransfer to route the contract for secure, legal e-signatures.',
    boilerplateTitle: 'GENERAL PARTNERSHIP AGREEMENT',
    boilerplateSections: [
      {
        title: '1. Partnership Name, Purpose, and Office Location',
        text: 'The Partners hereby form a general partnership under the laws of the State of California. The official name of the partnership shall be specified in the schedule. The primary business purpose of the partnership is to engage in commercial activities as agreed by the Partners, operating from the principal office address.'
      },
      {
        title: '2. Capital Contributions and Individual Partner Accounts',
        text: 'Each Partner shall contribute the initial capital specified in the schedule. Capital contributions may be in the form of cash, property, or professional services. An individual capital account shall be maintained for each Partner, reflecting their contributions, share of profits, and any withdrawals or distributions.'
      },
      {
        title: '3. Allocation of Profits, Losses, and Distributions',
        text: 'Net profits and losses of the partnership shall be allocated among the Partners in proportion to their respective capital contributions, unless otherwise agreed in writing. Distributions of profits shall be made at such times and in such amounts as determined by a majority vote of the Partners, ensuring business cash flow remains stable.'
      },
      {
        title: '4. Management, Voting Rights, and Decision-Making',
        text: 'All Partners shall have equal rights in the management and conduct of the partnership business. Decisions regarding daily operations shall be made by a majority vote of the Partners. Major decisions, including admitting new partners, borrowing substantial funds, or selling key assets, require the unanimous consent of all Partners.'
      },
      {
        title: '5. Admission of Partners, Transfers, and Voluntary Exit',
        text: 'No person shall be admitted as a new partner without the unanimous written consent of all existing Partners. A Partner may not sell, assign, or pledge their partnership interest to a third party without the prior written consent of the other Partners. A Partner may voluntarily withdraw from the partnership by giving ninety (90) days\' written notice.'
      },
      {
        title: '6. Dissolution, Winding Up, and Governing Law',
        text: 'The partnership shall dissolve upon the unanimous agreement of the Partners, the death or withdrawal of a Partner, or by operation of law. Upon dissolution, the partnership assets shall be liquidated, debts paid, and remaining funds distributed to Partners. This Agreement is governed by the laws of the State of California.'
      }
    ],
    faqs: [
      {
        question: 'Why is a written Partnership Agreement necessary for partners?',
        answer: 'A written agreement is crucial because it overrides the default state partnership laws, which may not align with the partners\' intentions. It clearly defines who contributes what, how profits are shared, who makes business decisions, and how to handle disagreements, preventing costly court battles.'
      },
      {
        question: 'How are profits and losses shared in a business partnership?',
        answer: 'By default, partners share profits and losses equally. However, partners can negotiate any profit-sharing ratio they want and write it into the agreement. Often, profits are shared proportionally based on the percentage of initial capital each partner contributed to the business.'
      },
      {
        question: 'Do all partners have to agree on every business decision?',
        answer: 'No. The agreement usually specifies that day-to-day decisions can be made by a majority vote or delegated to a managing partner. However, significant decisions (such as changing the business direction, borrowing money, or adding a new partner) typically require unanimous agreement.'
      },
      {
        question: 'What happens if a partner wants to leave the partnership?',
        answer: 'The agreement should outline an exit strategy or buyout procedure. Typically, the remaining partners are given the right of first refusal to buy out the departing partner\'s interest based on a pre-determined valuation method, preventing outside third parties from taking control of the business.'
      }
    ]
  }
};

const extraTemplateSeoData: Record<string, Partial<TemplateSEOContent>> = {
  'rofr-template': {
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Right of First Refusal contract template visual overview',
    externalLinks: [
      { label: 'Uniform Law Commission - Uniform Electronic Transactions Act', url: 'https://www.uniformlaws.org/committees/community-home?CommunityKey=a0a7b97c-54a7-472e-8c4d-a99182db6177' },
      { label: 'Cornell Law School Legal Information Institute - Right of First Refusal', url: 'https://www.law.cornell.edu/wex/right_of_first_refusal' }
    ],
    relatedTemplates: [
      { name: 'Lease Agreement Template', slug: 'lease-agreement-template' },
      { name: 'NDA Template', slug: 'nda-template' },
      { name: 'Partnership Agreement Template', slug: 'partnership-agreement-template' }
    ],
    faqs: [
      {
        question: 'Can a Right of First Refusal be transferred to someone else?',
        answer: 'Generally, no. A ROFR is personal to the grantee and cannot be assigned or transferred to a third party unless the contract explicitly permits assignment. Most agreements contain a strict non-assignment clause to protect the grantor\'s right to choose who they do business with.'
      },
      {
        question: 'Is a Right of First Refusal legally enforceable in all US states?',
        answer: 'Yes. As long as it satisfies the basic elements of a contract (offer, acceptance, and consideration, such as a cash payment or mutual promises) and does not violate the rule against perpetuities, it is fully enforceable across all US jurisdictions.'
      }
    ]
  },
  'nda-template': {
    imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Non-Disclosure Agreement NDA contract template preview',
    externalLinks: [
      { label: 'Congress.gov - Defend Trade Secrets Act', url: 'https://www.congress.gov/bill/114th-congress/senate-bill/1890' },
      { label: 'Cornell Law School LII - Confidentiality Agreements', url: 'https://www.law.cornell.edu/wex/confidentiality_agreement' }
    ],
    relatedTemplates: [
      { name: 'Service Agreement Template', slug: 'service-agreement-template' },
      { name: 'Consulting Agreement Template', slug: 'consulting-agreement-template' },
      { name: 'Employment Contract Template', slug: 'employment-contract-template' }
    ],
    faqs: [
      {
        question: 'Do confidentiality obligations expire?',
        answer: 'In standard commercial agreements, NDA confidentiality obligations last for a set period, typically 2 to 5 years. However, trade secrets (like source code, chemical formulas, or proprietary processes) are usually protected indefinitely, or until they enter the public domain through no fault of the recipient.'
      },
      {
        question: 'Can you sign a Non-Disclosure Agreement electronically?',
        answer: 'Absolutely. Under the ESIGN Act and eIDAS, electronic signatures on NDAs are 100% legally binding and carry the same weight as handwritten signatures.'
      }
    ]
  },
  'lease-agreement-template': {
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Residential lease agreement contract template details',
    externalLinks: [
      { label: 'U.S. Dept of Housing & Urban Development (HUD)', url: 'https://www.hud.gov/' },
      { label: 'Cornell Law School LII - Landlord-Tenant Law', url: 'https://www.law.cornell.edu/wex/landlord-tenant_law' }
    ],
    relatedTemplates: [
      { name: 'Right of First Refusal Template', slug: 'rofr-template' },
      { name: 'NDA Template', slug: 'nda-template' },
      { name: 'Partnership Agreement Template', slug: 'partnership-agreement-template' }
    ],
    faqs: [
      {
        question: 'What is the difference between a lease and a rental agreement?',
        answer: 'A lease agreement is a fixed-term contract (typically 12 months) that commits the landlord and tenant to the terms and rent rate for the entire duration. A rental agreement is typically month-to-month, meaning the terms and rent can be changed by either party with proper notice (usually 30 days).'
      },
      {
        question: 'Can a landlord enter the property without notice?',
        answer: 'Except in emergency situations (like a fire or water leak), landlords must provide advance written notice—typically 24 to 48 hours—before entering a tenant\'s rented premises for inspections or repairs.'
      }
    ]
  },
  'service-agreement-template': {
    imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Professional Master Service Agreement MSA contract template',
    externalLinks: [
      { label: 'Uniform Commercial Code - Article 2 (Services vs Goods)', url: 'https://www.law.cornell.edu/ucc/2' },
      { label: 'U.S. FTC - Business Guidance on Service Contracts', url: 'https://www.ftc.gov/' }
    ],
    relatedTemplates: [
      { name: 'Consulting Agreement Template', slug: 'consulting-agreement-template' },
      { name: 'Freelance Agreement Template', slug: 'freelance-agreement-template' },
      { name: 'NDA Template', slug: 'nda-template' }
    ],
    faqs: [
      {
        question: 'What happens if there is a dispute over deliverables?',
        answer: 'The agreement should outline a clear dispute resolution path. Typically, this begins with informal negotiation between executives, followed by mediation, and finally binding arbitration if the parties cannot reach a mutual resolution.'
      },
      {
        question: 'Can service contracts be modified mid-project?',
        answer: 'Yes, but modifications must be documented in writing and signed by both parties, usually in the form of a \'Change Order\' or amendment, to be legally enforceable.'
      }
    ]
  },
  'employment-contract-template': {
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Employment contract agreement employee template',
    externalLinks: [
      { label: 'U.S. Dept of Labor - Fair Labor Standards Act', url: 'https://www.dol.gov/agencies/whd/flsa' },
      { label: 'Cornell Law School LII - Labor Law', url: 'https://www.law.cornell.edu/wex/labor' }
    ],
    relatedTemplates: [
      { name: 'Consulting Agreement Template', slug: 'consulting-agreement-template' },
      { name: 'Freelance Agreement Template', slug: 'freelance-agreement-template' },
      { name: 'NDA Template', slug: 'nda-template' }
    ],
    faqs: [
      {
        question: 'What is the difference between a salary employee and hourly wage?',
        answer: 'Salaried employees receive a fixed amount of pay per pay period, regardless of hours worked, and are often exempt from overtime pay if they meet job duties criteria. Hourly employees are paid for every hour worked and must receive overtime (1.5x) for hours over 40 in a workweek under the FLSA.'
      },
      {
        question: 'Can post-employment restrictions like non-solicits be enforced?',
        answer: 'Yes, but they must be reasonable in geographic scope and time limit (usually 6 to 12 months) and protect a legitimate business interest (like customer relationships or proprietary trade info) to be enforced.'
      }
    ]
  },
  'freelance-agreement-template': {
    imageUrl: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Freelancer client independent contractor agreement template',
    externalLinks: [
      { label: 'U.S. IRS - Independent Contractor Self-Employed Guide', url: 'https://www.irs.gov/businesses/small-businesses-self-employed/independent-contractor-self-employed-or-employee' },
      { label: 'Freelancers Union - Legal Guide', url: 'https://www.freelancersunion.org/' }
    ],
    relatedTemplates: [
      { name: 'Service Agreement Template', slug: 'service-agreement-template' },
      { name: 'Consulting Agreement Template', slug: 'consulting-agreement-template' },
      { name: 'NDA Template', slug: 'nda-template' }
    ],
    faqs: [
      {
        question: 'What happens if a client doesn\'t pay a freelancer on time?',
        answer: 'The Freelance Agreement should include late payment penalties (like a flat fee or interest on the outstanding balance). Under laws like New York\'s \'Freelance Isn\'t Free\' Act, clients who fail to pay can be held liable for double damages and attorney\'s fees.'
      },
      {
        question: 'Do freelancers need a contract for small projects?',
        answer: 'Yes. Even for small projects, a contract is essential to establish scope, deadline, and payment terms, preventing scope creep and ensuring you get paid for your work.'
      }
    ]
  },
  'consulting-agreement-template': {
    imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Professional business consulting agreement template',
    externalLinks: [
      { label: 'IRS Guidance on 1099 Consulting Fees', url: 'https://www.irs.gov/' },
      { label: 'Cornell Law School LII - Contract Consideration', url: 'https://www.law.cornell.edu/wex/consideration' }
    ],
    relatedTemplates: [
      { name: 'Service Agreement Template', slug: 'service-agreement-template' },
      { name: 'Freelance Agreement Template', slug: 'freelance-agreement-template' },
      { name: 'NDA Template', slug: 'nda-template' }
    ],
    faqs: [
      {
        question: 'What is a consulting retainer and how does it work?',
        answer: 'A retainer is a pre-arranged fee paid by a client to secure a consultant\'s availability for a set period. Retainers can be hours-based (for a set block of hours) or value-based (for ongoing advisory access), and are usually paid monthly.'
      },
      {
        question: 'Can consultants work for other clients during the project?',
        answer: 'Yes. As independent contractors, consultants are free to work for other clients, provided they do not share confidential information or violate any specific non-compete clauses.'
      }
    ]
  },
  'partnership-agreement-template': {
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Business partnership agreement template draft',
    externalLinks: [
      { label: 'California Corporations Code - Partnerships', url: 'https://leginfo.legislature.ca.gov/' },
      { label: 'Cornell Law School LII - Partnership General Principles', url: 'https://www.law.cornell.edu/wex/partnership' }
    ],
    relatedTemplates: [
      { name: 'NDA Template', slug: 'nda-template' },
      { name: 'Service Agreement Template', slug: 'service-agreement-template' },
      { name: 'Lease Agreement Template', slug: 'lease-agreement-template' }
    ],
    faqs: [
      {
        question: 'What is the difference between a general partnership and an LLP?',
        answer: 'In a general partnership, all partners are personally liable for the business\'s debts and actions. In a Limited Liability Partnership (LLP), partners have limited personal liability, protecting their personal assets from business obligations.'
      },
      {
        question: 'How are disputes resolved in a partnership?',
        answer: 'The agreement should define a dispute resolution process, typically starting with mediation and moving to binding arbitration if partners cannot reach a unanimous or majority agreement.'
      }
    ]
  }
};

import { templatesGroup } from './seo-pages/templatesGroup';

export const templateSeoData: Record<string, TemplateSEOContent> = {
  ...templatesGroup
};

for (const slug in baseTemplateSeoData) {
  const base = baseTemplateSeoData[slug];
  const extra = extraTemplateSeoData[slug] || {};
  templateSeoData[slug] = {
    ...base,
    imageUrl: extra.imageUrl,
    imageAlt: extra.imageAlt,
    externalLinks: extra.externalLinks,
    relatedTemplates: extra.relatedTemplates,
    faqs: [...base.faqs, ...(extra.faqs || [])]
  };
}

