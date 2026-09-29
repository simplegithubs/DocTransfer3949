import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export interface BankAPFInfo {
    bankId: string;
    bankName: string;
    shortName: string;
    apfProjectCode: string;
    branchName: string;
    contactManager: string;
    managerPhone: string;
    maxLtvPercent: number; // E.g. 80% or 85%
    roiRange: string; // E.g. "8.35% - 8.75%"
    escrowAccountDesignated: string;
}

export const PRECONFIGURED_BANK_APFS: BankAPFInfo[] = [
    {
        bankId: 'sbi',
        bankName: 'State Bank of India (RACPC)',
        shortName: 'SBI',
        apfProjectCode: 'SBI-BLR-RES-2024-88912',
        branchName: 'RACPC Koramangala / MG Road',
        contactManager: 'Sunil Kumar (Chief Manager - Home Loans)',
        managerPhone: '+91 94480 12345',
        maxLtvPercent: 80,
        roiRange: '8.35% - 8.65% p.a.',
        escrowAccountDesignated: 'SBI RERA Escrow A/C #39882100912 (IFSC: SBIN0004132)'
    },
    {
        bankId: 'hdfc',
        bankName: 'HDFC Bank Ltd (Retail Lending Hub)',
        shortName: 'HDFC',
        apfProjectCode: 'HDFC-APF-MUM-440192',
        branchName: 'HDFC Sales Hub, Bandra Kurla Complex',
        contactManager: 'Pooja Deshmukh (Branch Lending Head)',
        managerPhone: '+91 98200 66778',
        maxLtvPercent: 85,
        roiRange: '8.40% - 8.75% p.a.',
        escrowAccountDesignated: 'HDFC Bank RERA Project A/C #502000881923 (IFSC: HDFC0000122)'
    },
    {
        bankId: 'icici',
        bankName: 'ICICI Bank Home Finance',
        shortName: 'ICICI',
        apfProjectCode: 'ICICI-BLR-APF-00982',
        branchName: 'ICICI CPC, Indiranagar',
        contactManager: 'Rajesh Nair (Mortgage Specialist)',
        managerPhone: '+91 98450 99881',
        maxLtvPercent: 80,
        roiRange: '8.45% - 8.80% p.a.',
        escrowAccountDesignated: 'ICICI RERA Master Escrow #000205018921 (IFSC: ICIC0000002)'
    },
    {
        bankId: 'axis',
        bankName: 'Axis Bank Retail Asset Centre',
        shortName: 'Axis',
        apfProjectCode: 'AXIS-NCR-RES-77610',
        branchName: 'Axis RAC, Sector 29 Gurugram',
        contactManager: 'Amit Verma (AVP - Home Loans)',
        managerPhone: '+91 98100 44321',
        maxLtvPercent: 80,
        roiRange: '8.50% - 8.90% p.a.',
        escrowAccountDesignated: 'Axis Project Collection A/C #921020088716 (IFSC: UTIB0000245)'
    },
    {
        bankId: 'bob',
        bankName: 'Bank of Baroda (Baroda Mortgage Hub)',
        shortName: 'BOB',
        apfProjectCode: 'BOB-PUN-APF-33819',
        branchName: 'BOB Zonal Office, Shivajinagar Pune',
        contactManager: 'Suresh Patil (Senior Manager)',
        managerPhone: '+91 98900 11442',
        maxLtvPercent: 85,
        roiRange: '8.30% - 8.60% p.a.',
        escrowAccountDesignated: 'Bank of Baroda RERA Escrow #0441020000918 (IFSC: BARB0PUNEXX)'
    }
];

export interface TripartiteParams {
    projectName: string;
    unitNumber: string;
    reraNumber: string;
    developerName: string;
    allotteeName: string;
    bankName: string;
    apfCode: string;
    totalConsideration: number;
    sanctionedLoanAmount: number;
    escrowAccount: string;
    referenceNo?: string;
}

/**
 * Generates an official Builder Permission To Mortgage (PTM) / Bank NOC.
 */
export async function generatePermissionToMortgageNoc(params: TripartiteParams): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4
    const { width, height } = page.getSize();

    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Decorative Border
    page.drawRectangle({
        x: 25,
        y: 25,
        width: width - 50,
        height: height - 50,
        borderColor: rgb(0.1, 0.35, 0.2),
        borderWidth: 1.5,
        color: rgb(0.99, 1.0, 0.99)
    });

    let y = height - 60;

    // Header
    page.drawText(params.developerName.toUpperCase(), {
        x: 45,
        y,
        size: 13,
        font: fontBold,
        color: rgb(0.1, 0.35, 0.2)
    });

    y -= 14;
    page.drawText(`RERA Registered Real Estate Project • Reg No: ${params.reraNumber}`, {
        x: 45,
        y,
        size: 8,
        font: fontRegular,
        color: rgb(0.4, 0.45, 0.5)
    });

    y -= 15;
    page.drawLine({
        start: { x: 45, y },
        end: { x: width - 45, y },
        color: rgb(0.1, 0.35, 0.2),
        thickness: 1
    });

    y -= 25;

    page.drawText('PERMISSION TO MORTGAGE (PTM) & NO OBJECTION CERTIFICATE (NOC)', {
        x: width / 2 - 195,
        y,
        size: 10.5,
        font: fontBold,
        color: rgb(0.08, 0.25, 0.15)
    });

    y -= 20;

    const refNo = params.referenceNo || `DT-PTM-${Date.now().toString().slice(-8)}`;
    page.drawText(`Ref No: ${refNo}`, { x: 45, y, size: 8, font: fontBold, color: rgb(0.3, 0.3, 0.3) });
    page.drawText(`Date: ${new Date().toLocaleDateString('en-IN')}`, { x: width - 150, y, size: 8, font: fontRegular, color: rgb(0.3, 0.3, 0.3) });

    y -= 25;

    // Address to Bank
    page.drawText('To,', { x: 45, y, size: 8.5, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });
    y -= 12;
    page.drawText(`The Branch Manager / Retail Lending Head,`, { x: 45, y, size: 8.5, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
    y -= 12;
    page.drawText(`${params.bankName}`, { x: 45, y, size: 8.5, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });

    y -= 25;

    // Subject
    page.drawText(`SUB: NOC / Permission to Mortgage for Unit ${params.unitNumber} in Project "${params.projectName}"`, {
        x: 45,
        y,
        size: 8.5,
        font: fontBold,
        color: rgb(0.1, 0.2, 0.3)
    });

    y -= 14;
    page.drawText(`APF Project Approval Code: ${params.apfCode} | Borrower: ${params.allotteeName}`, {
        x: 45,
        y,
        size: 8,
        font: fontBold,
        color: rgb(0.05, 0.45, 0.2)
    });

    y -= 25;

    // Body Paragraphs
    const paragraphs = [
        `1. This is to confirm that Allottee ${params.allotteeName} has been provisionally allotted Unit ${params.unitNumber} in "${params.projectName}" for a total sale consideration of Rs. ${params.totalConsideration.toLocaleString('en-IN')}/-.`,
        `2. We confirm that we have NO OBJECTION to the Allottee mortgaging the aforesaid unit in favor of ${params.bankName} to secure a home loan facility up to Rs. ${params.sanctionedLoanAmount.toLocaleString('en-IN')}/-.`,
        `3. We undertake that we have not created any prior third-party charge, lien, or encumbrance on the said unit.`,
        `4. All disbursements from ${params.bankName} shall be credited strictly to the designated RERA Master Escrow Account:`,
        `   >> ${params.escrowAccount}`,
        `5. In the event of cancellation of allotment, all refund amounts shall be directly remitted to ${params.bankName} towards the outstanding loan balance before any surplus to the allottee.`
    ];

    for (const para of paragraphs) {
        page.drawText(para, {
            x: 45,
            y,
            size: 8.2,
            font: para.includes('>>') ? fontBold : fontRegular,
            color: para.includes('>>') ? rgb(0.05, 0.4, 0.2) : rgb(0.15, 0.15, 0.15),
            maxWidth: width - 90,
            lineHeight: 12
        });
        y -= 28;
    }

    y -= 20;

    // Signatures Box
    page.drawRectangle({
        x: 45,
        y: y - 50,
        width: width - 90,
        height: 60,
        borderColor: rgb(0.8, 0.85, 0.88),
        borderWidth: 1,
        color: rgb(0.96, 0.98, 0.97)
    });

    page.drawText('FOR DEVELOPER / AUTHORIZED SIGNATORY', { x: 55, y: y - 10, size: 8, font: fontBold, color: rgb(0.1, 0.35, 0.2) });
    page.drawText('Authorized Corporate & RERA Seal', { x: 55, y: y - 25, size: 7.5, font: fontRegular, color: rgb(0.4, 0.4, 0.4) });
    page.drawText('[SEALED & DIGITALLY EXECUTED]', { x: 55, y: y - 40, size: 7.5, font: fontBold, color: rgb(0.05, 0.5, 0.2) });

    page.drawText('ACCEPTED BY ALLOTTEE(S)', { x: width - 200, y: y - 10, size: 8, font: fontBold, color: rgb(0.1, 0.35, 0.2) });
    page.drawText(`${params.allotteeName}`, { x: width - 200, y: y - 25, size: 8, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });
    page.drawText('Digitally Consented via Aadhaar eSign', { x: width - 200, y: y - 40, size: 7.5, font: fontRegular, color: rgb(0.4, 0.4, 0.4) });

    return await pdfDoc.save();
}

/**
 * Generates an institutional 3-Party Tripartite Home Loan Agreement PDF.
 */
export async function generateTripartiteLoanAgreementPdf(params: TripartiteParams): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]);
    const { width, height } = page.getSize();

    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Border
    page.drawRectangle({
        x: 25,
        y: 25,
        width: width - 50,
        height: height - 50,
        borderColor: rgb(0.1, 0.25, 0.45),
        borderWidth: 1.5
    });

    let y = height - 55;

    page.drawText('TRIPARTITE HOME LOAN AGREEMENT', {
        x: width / 2 - 130,
        y,
        size: 13,
        font: fontBold,
        color: rgb(0.1, 0.25, 0.5)
    });

    y -= 15;
    page.drawText('(Execution under Section 11(4) & Section 4 RERA Act 2016)', {
        x: width / 2 - 145,
        y,
        size: 8,
        font: fontRegular,
        color: rgb(0.4, 0.45, 0.5)
    });

    y -= 15;
    page.drawLine({
        start: { x: 45, y },
        end: { x: width - 45, y },
        color: rgb(0.1, 0.25, 0.5),
        thickness: 1
    });

    y -= 25;

    // Parties Summary Box
    page.drawRectangle({
        x: 45,
        y: y - 110,
        width: width - 90,
        height: 110,
        borderColor: rgb(0.85, 0.88, 0.92),
        borderWidth: 1,
        color: rgb(0.97, 0.98, 1.0)
    });

    const partyY = y - 15;
    page.drawText('1. DEVELOPER:', { x: 55, y: partyY, size: 8, font: fontBold, color: rgb(0.1, 0.2, 0.4) });
    page.drawText(`${params.developerName} (RERA Reg: ${params.reraNumber})`, { x: 140, y: partyY, size: 8, font: fontRegular, color: rgb(0.1, 0.1, 0.1) });

    page.drawText('2. BORROWER:', { x: 55, y: partyY - 24, size: 8, font: fontBold, color: rgb(0.1, 0.2, 0.4) });
    page.drawText(`${params.allotteeName} (Allottee of Unit: ${params.unitNumber})`, { x: 140, y: partyY - 24, size: 8, font: fontRegular, color: rgb(0.1, 0.1, 0.1) });

    page.drawText('3. LENDER:', { x: 55, y: partyY - 48, size: 8, font: fontBold, color: rgb(0.1, 0.2, 0.4) });
    page.drawText(`${params.bankName} (APF Project Code: ${params.apfCode})`, { x: 140, y: partyY - 48, size: 8, font: fontRegular, color: rgb(0.1, 0.1, 0.1) });

    page.drawText('LOAN SANCTION:', { x: 55, y: partyY - 72, size: 8, font: fontBold, color: rgb(0.05, 0.45, 0.2) });
    page.drawText(`Rs. ${params.sanctionedLoanAmount.toLocaleString('en-IN')}/- of Total Rs. ${params.totalConsideration.toLocaleString('en-IN')}/-`, { x: 140, y: partyY - 72, size: 8, font: fontBold, color: rgb(0.05, 0.45, 0.2) });

    y -= 135;

    // Statutory Undertakings
    const clauses = [
        'A. The Lender agrees to disburse the housing loan amount directly to the Developer in stages linked to construction milestones.',
        'B. The Developer undertakes to construct the project in strict accordance with the plans approved by the competent municipal corporation and RERA authority.',
        'C. The Borrower and Developer agree that the original Sale Deed / Sub-Registrar Registered Conveyance shall be handed over directly to the Lender to create an equitable mortgage.',
        'D. The Developer acknowledges the primary lien of the Lender over the property until complete liquidation of the loan amount.',
        'E. This agreement constitutes a binding digital record under the IT Act 2000 & Section 65B of Indian Evidence Act 1872.'
    ];

    for (const cl of clauses) {
        page.drawText(cl, {
            x: 45,
            y,
            size: 8,
            font: fontRegular,
            color: rgb(0.2, 0.2, 0.2),
            maxWidth: width - 90,
            lineHeight: 12
        });
        y -= 28;
    }

    y -= 15;

    // 3-Party Execution Grid
    page.drawRectangle({
        x: 45,
        y: y - 55,
        width: width - 90,
        height: 60,
        color: rgb(0.96, 0.97, 0.98),
        borderColor: rgb(0.8, 0.85, 0.9),
        borderWidth: 1
    });

    const colW = (width - 90) / 3;
    page.drawText('DEVELOPER SEAL', { x: 55, y: y - 10, size: 7.5, font: fontBold, color: rgb(0.1, 0.2, 0.4) });
    page.drawText('[RERA SEAL ATTESTED]', { x: 55, y: y - 28, size: 7, font: fontRegular, color: rgb(0.05, 0.5, 0.2) });

    page.drawText('BORROWER (ALLOTTEE)', { x: 55 + colW, y: y - 10, size: 7.5, font: fontBold, color: rgb(0.1, 0.2, 0.4) });
    page.drawText('[AADHAAR OTP SIGNED]', { x: 55 + colW, y: y - 28, size: 7, font: fontRegular, color: rgb(0.05, 0.5, 0.2) });

    page.drawText('BANK BRANCH HEAD', { x: 55 + colW * 2, y: y - 10, size: 7.5, font: fontBold, color: rgb(0.1, 0.2, 0.4) });
    page.drawText('[APF SANCTION CLEARED]', { x: 55 + colW * 2, y: y - 28, size: 7, font: fontRegular, color: rgb(0.05, 0.5, 0.2) });

    return await pdfDoc.save();
}
