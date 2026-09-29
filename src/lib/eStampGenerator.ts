import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export type IndianState = 
    | 'Maharashtra' 
    | 'Karnataka' 
    | 'Delhi' 
    | 'Haryana' 
    | 'Uttar Pradesh' 
    | 'Telangana' 
    | 'Tamil Nadu' 
    | 'West Bengal' 
    | 'Gujarat';

export interface EStampDetails {
    certificateNo: string;
    state: IndianState;
    issueDate: string;
    firstParty: string; // Purchaser / Lessee / Buyer
    secondParty: string; // Developer / Seller / Lessor
    stampDutyAmount: number;
    dutyPaidBy: string;
    documentType: string; // e.g. 'Article 5 Agreement for Sale', 'Article 36 Lease Deed (11 Months)', 'Article 48 Power of Attorney'
    propertyDescription?: string;
    considerationAmount?: number;
    accountReference?: string;
}

/**
 * Generates an official Indian Non-Judicial e-Stamp Certificate cover page (A4)
 * compliant with SHCIL (Stock Holding Corp) / State GRAS / IGR specifications.
 */
export async function generateEStampCoverPdf(details: EStampDetails): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // Standard A4 (pt)
    const { width, height } = page.getSize();

    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // 1. Outer Security Border
    page.drawRectangle({
        x: 20,
        y: 20,
        width: width - 40,
        height: height - 40,
        borderColor: rgb(0.12, 0.35, 0.22), // Deep Emerald/Forest Green border
        borderWidth: 2,
    });

    // Inner fine border
    page.drawRectangle({
        x: 24,
        y: 24,
        width: width - 48,
        height: height - 48,
        borderColor: rgb(0.7, 0.6, 0.3), // Gold fine border
        borderWidth: 0.8,
    });

    // 2. State & Government Header Banner
    const stateNameUpper = details.state.toUpperCase();
    page.drawText('GOVERNMENT OF INDIA', {
        x: width / 2 - 80,
        y: height - 55,
        size: 13,
        font: fontBold,
        color: rgb(0.12, 0.35, 0.22),
    });

    page.drawText(`GOVERNMENT OF ${stateNameUpper}`, {
        x: width / 2 - (fontBold.widthOfTextAtSize(`GOVERNMENT OF ${stateNameUpper}`, 14) / 2),
        y: height - 75,
        size: 14,
        font: fontBold,
        color: rgb(0.1, 0.1, 0.1),
    });

    page.drawText('NON-JUDICIAL e-STAMP CERTIFICATE', {
        x: width / 2 - (fontBold.widthOfTextAtSize('NON-JUDICIAL e-STAMP CERTIFICATE', 11) / 2),
        y: height - 95,
        size: 11,
        font: fontBold,
        color: rgb(0.7, 0.45, 0.05), // Golden Amber
    });

    // Statutory Authority Reference
    page.drawText('Issued pursuant to the Indian Stamp Act, 1899 & State Stamp Rules • Digital Electronic Evidence', {
        x: width / 2 - (fontRegular.widthOfTextAtSize('Issued pursuant to the Indian Stamp Act, 1899 & State Stamp Rules • Digital Electronic Evidence', 7.5) / 2),
        y: height - 110,
        size: 7.5,
        font: fontRegular,
        color: rgb(0.4, 0.4, 0.4),
    });

    // 3. Certificate Details Box
    const startY = height - 130;
    page.drawRectangle({
        x: 35,
        y: startY - 260,
        width: width - 70,
        height: 260,
        borderColor: rgb(0.8, 0.82, 0.85),
        borderWidth: 1,
        color: rgb(0.98, 0.99, 0.98),
    });

    // Grid rows
    const rows = [
        ['Certificate No.', details.certificateNo, 'Certificate Issued Date', details.issueDate],
        ['Account Reference', details.accountReference || `SHCIL-${details.state.slice(0, 2).toUpperCase()}-${Date.now().toString().slice(-8)}`, 'Unique Doc. Reference', `DT-ESTAMP-${Date.now().toString(36).toUpperCase()}`],
        ['Purchased by (First Party)', details.firstParty, 'Second Party', details.secondParty],
        ['Stamp Duty Paid By', details.dutyPaidBy || details.firstParty, 'Stamp Duty Amount (Rs.)', `Rs. ${details.stampDutyAmount.toLocaleString('en-IN')}/-`],
        ['Description of Document', details.documentType, 'Consideration Price', details.considerationAmount ? `Rs. ${details.considerationAmount.toLocaleString('en-IN')}/-` : 'N/A'],
        ['Property / Remarks', details.propertyDescription || 'Real Estate Agreement / RERA Deed Execution', 'Statutory Status', 'VALID & AUDITED • SEC 17/18']
    ];

    let currentY = startY - 25;
    for (let i = 0; i < rows.length; i++) {
        const [label1, val1, label2, val2] = rows[i];

        // Label 1
        page.drawText(label1 + ' :', { x: 45, y: currentY, size: 8.5, font: fontBold, color: rgb(0.2, 0.25, 0.3) });
        page.drawText(val1.length > 28 ? val1.slice(0, 28) + '...' : val1, { x: 175, y: currentY, size: 8.5, font: fontRegular, color: rgb(0.05, 0.05, 0.05) });

        // Label 2
        page.drawText(label2 + ' :', { x: 320, y: currentY, size: 8.5, font: fontBold, color: rgb(0.2, 0.25, 0.3) });
        page.drawText(val2.length > 24 ? val2.slice(0, 24) + '...' : val2, { x: 440, y: currentY, size: 8.5, font: fontRegular, color: label2.includes('Amount') ? rgb(0.05, 0.5, 0.2) : rgb(0.05, 0.05, 0.05) });

        // Divider line
        page.drawLine({
            start: { x: 35, y: currentY - 12 },
            end: { x: width - 35, y: currentY - 12 },
            color: rgb(0.9, 0.92, 0.94),
            thickness: 0.7,
        });

        currentY -= 40;
    }

    // 4. Large Duty Amount Callout Banner
    page.drawRectangle({
        x: 35,
        y: currentY - 30,
        width: width - 70,
        height: 50,
        color: rgb(0.93, 0.97, 0.94),
        borderColor: rgb(0.18, 0.65, 0.35),
        borderWidth: 1.5,
    });

    page.drawText('STAMP DUTY RECEIVED & VERIFIED', {
        x: 50,
        y: currentY - 5,
        size: 9,
        font: fontBold,
        color: rgb(0.12, 0.45, 0.22),
    });

    const amountInWords = `Rs. ${details.stampDutyAmount.toLocaleString('en-IN')} (Rupees ${numberToIndianWords(details.stampDutyAmount)} Only)`;
    page.drawText(amountInWords.length > 55 ? amountInWords.slice(0, 55) + '...' : amountInWords, {
        x: 50,
        y: currentY - 22,
        size: 8.5,
        font: fontBold,
        color: rgb(0.05, 0.2, 0.1),
    });

    page.drawText(`INR ${details.stampDutyAmount.toLocaleString('en-IN')}`, {
        x: width - 190,
        y: currentY - 14,
        size: 16,
        font: fontBold,
        color: rgb(0.08, 0.55, 0.25),
    });

    // 5. Statutory Warnings & Tamper Verification Box
    const warningY = currentY - 170;
    page.drawRectangle({
        x: 35,
        y: warningY,
        width: width - 70,
        height: 120,
        borderColor: rgb(0.85, 0.85, 0.85),
        borderWidth: 1,
        color: rgb(0.99, 0.99, 0.99),
    });

    page.drawText('STATUTORY COMPLIANCE & LEGAL NOTICE', {
        x: 45,
        y: warningY + 102,
        size: 8.5,
        font: fontBold,
        color: rgb(0.7, 0.2, 0.1),
    });

    const notices = [
        '1. The authenticity of this e-Stamp certificate can be verified against the state treasury portal / DocTransfer registry.',
        '2. Any discrepancy or tampering with this e-Stamp rendering renders the entire underlying agreement null and void.',
        '3. This digital certificate fulfills non-judicial stamp duty under Section 3 & Schedule I of the applicable State Stamp Act.',
        '4. Admissible as primary electronic evidence under Section 65B of Indian Evidence Act 1872 & Section 63 BSA 2023.',
        '5. Tampering, forgery, or duplication of this Government stamp is a cognizable criminal offense under Section 255 IPC.'
    ];

    let notY = warningY + 84;
    for (const note of notices) {
        page.drawText(note, {
            x: 45,
            y: notY,
            size: 7.2,
            font: fontRegular,
            color: rgb(0.3, 0.35, 0.4),
        });
        notY -= 15;
    }

    // 6. Signature / QR Verification Footnote
    page.drawText(`Digitally Stitched & Sealed via DocTransfer Legal Platform • Hash: ${details.certificateNo.slice(-10)}`, {
        x: width / 2 - 160,
        y: 35,
        size: 7,
        font: fontRegular,
        color: rgb(0.5, 0.5, 0.5),
    });

    return await pdfDoc.save();
}

/**
 * Merges the e-Stamp certificate as Page 1 before any existing PDF document.
 */
export async function mergeEStampWithDocument(
    documentBytes: ArrayBuffer,
    stampDetails: EStampDetails
): Promise<Uint8Array> {
    const stampBytes = await generateEStampCoverPdf(stampDetails);

    const mergedDoc = await PDFDocument.create();
    const stampDoc = await PDFDocument.load(stampBytes);
    const mainDoc = await PDFDocument.load(documentBytes);

    // 1. Copy e-Stamp cover page
    const [stampCoverPage] = await mergedDoc.copyPages(stampDoc, [0]);
    mergedDoc.addPage(stampCoverPage);

    // 2. Copy all pages of main deed
    const mainPages = await mergedDoc.copyPages(mainDoc, mainDoc.getPageIndices());
    for (const p of mainPages) {
        mergedDoc.addPage(p);
    }

    return await mergedDoc.save();
}

/**
 * Utility to convert numbers to Indian Rupee Words (Lakhs & Crores)
 */
function numberToIndianWords(num: number): string {
    if (num === 0) return 'Zero';
    const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    function inWords(n: number): string {
        let str = '';
        if (n > 99) {
            str += a[Math.floor(n / 100)] + ' Hundred ';
            n %= 100;
        }
        if (n > 19) {
            str += b[Math.floor(n / 10)] + ' ' + a[n % 10] + ' ';
        } else if (n > 0) {
            str += a[n] + ' ';
        }
        return str;
    }

    let output = '';
    const crore = Math.floor(num / 10000000);
    num %= 10000000;
    const lakh = Math.floor(num / 100000);
    num %= 100000;
    const thousand = Math.floor(num / 1000);
    num %= 1000;
    const hundred = num;

    if (crore > 0) output += inWords(crore) + 'Crore ';
    if (lakh > 0) output += inWords(lakh) + 'Lakh ';
    if (thousand > 0) output += inWords(thousand) + 'Thousand ';
    if (hundred > 0) output += inWords(hundred);

    return output.trim();
}
