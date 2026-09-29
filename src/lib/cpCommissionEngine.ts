import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export interface CPCommissionInput {
    brokerName: string;
    brokerFirmName?: string;
    reraBrokerRegNo: string;
    brokerPan: string;
    brokerGstin?: string;
    brokerPhone: string;
    projectName: string;
    unitNumber: string;
    allotteeName: string;
    agreementValue: number;
    commissionPercent: number; // e.g. 2.0 for 2%
    isGstRegistered: boolean;
    isTdsApplicable?: boolean; // Default true (5% Sec 194H)
    kickerBonusAmount?: number;
}

export interface CPCommissionResult {
    baseBrokerageAmount: number;
    kickerBonus: number;
    totalBrokerageBeforeTax: number;
    gstRatePercent: number;
    gstAmount: number; // 18% if GST registered
    tdsRatePercent: number;
    tdsDeductionAmount: number; // 5% under Section 194H
    netPayableAmount: number;
    statutoryTaxSummary: string;
}

/**
 * Calculates Channel Partner Broker Commission, 18% GST and 5% Section 194H TDS.
 */
export function calculateCPCommission(input: CPCommissionInput): CPCommissionResult {
    const baseBrokerage = Math.round((input.agreementValue * input.commissionPercent) / 100);
    const kickerBonus = input.kickerBonusAmount || 0;
    const totalBrokerage = baseBrokerage + kickerBonus;

    const gstRatePercent = input.isGstRegistered ? 18.0 : 0.0;
    const gstAmount = Math.round((totalBrokerage * gstRatePercent) / 100);

    const tdsRatePercent = input.isTdsApplicable !== false ? 5.0 : 0.0;
    const tdsDeductionAmount = Math.round((totalBrokerage * tdsRatePercent) / 100);

    const netPayableAmount = (totalBrokerage + gstAmount) - tdsDeductionAmount;

    const statutoryTaxSummary = input.isGstRegistered
        ? `Brokerage ${input.commissionPercent}% + 18% GST (CGST 9% + SGST 9%) - 5% TDS u/s 194H Income Tax Act 1961.`
        : `Brokerage ${input.commissionPercent}% (Unregistered CP) - 5% TDS u/s 194H Income Tax Act 1961.`;

    return {
        baseBrokerageAmount: baseBrokerage,
        kickerBonus,
        totalBrokerageBeforeTax: totalBrokerage,
        gstRatePercent,
        gstAmount,
        tdsRatePercent,
        tdsDeductionAmount,
        netPayableAmount,
        statutoryTaxSummary
    };
}

/**
 * Generates an institutional RERA Channel Partner Commission Voucher PDF.
 */
export async function generateCPCommissionDisbursementPdf(
    input: CPCommissionInput,
    result: CPCommissionResult,
    developerName: string = 'Godrej Properties Ltd / Apex Realty'
): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]);
    const { width, height } = page.getSize();

    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontMono = await pdfDoc.embedFont(StandardFonts.Courier);

    // Outer Border
    page.drawRectangle({
        x: 25,
        y: 25,
        width: width - 50,
        height: height - 50,
        borderColor: rgb(0.12, 0.25, 0.45),
        borderWidth: 1.5,
        color: rgb(0.99, 1.0, 0.99)
    });

    let y = height - 60;

    // Header
    page.drawText(developerName.toUpperCase(), {
        x: 45,
        y,
        size: 12.5,
        font: fontBold,
        color: rgb(0.12, 0.25, 0.45)
    });

    y -= 14;
    page.drawText('CHANNEL PARTNER RERA COMMISSION & TAX DISBURSEMENT SLIP', {
        x: 45,
        y,
        size: 8.5,
        font: fontBold,
        color: rgb(0.3, 0.35, 0.4)
    });

    y -= 15;
    page.drawLine({
        start: { x: 45, y },
        end: { x: width - 45, y },
        color: rgb(0.12, 0.25, 0.45),
        thickness: 1
    });

    y -= 25;

    const voucherNo = `VOUCHER-CP-${Date.now().toString().slice(-8)}`;
    page.drawText(`Voucher Ref: ${voucherNo}`, { x: 45, y, size: 8, font: fontBold, color: rgb(0.2, 0.2, 0.2) });
    page.drawText(`Date: ${new Date().toLocaleDateString('en-IN')}`, { x: width - 150, y, size: 8, font: fontRegular, color: rgb(0.3, 0.3, 0.3) });

    y -= 25;

    // CP Profile & Deal Meta Grid
    page.drawRectangle({
        x: 45,
        y: y - 95,
        width: width - 90,
        height: 95,
        borderColor: rgb(0.85, 0.88, 0.92),
        borderWidth: 1,
        color: rgb(0.97, 0.98, 1.0)
    });

    const cpY = y - 16;
    page.drawText('CHANNEL PARTNER (CP):', { x: 55, y: cpY, size: 8, font: fontBold, color: rgb(0.1, 0.2, 0.4) });
    page.drawText(`${input.brokerName} ${input.brokerFirmName ? `(${input.brokerFirmName})` : ''}`, { x: 190, y: cpY, size: 8, font: fontBold, color: rgb(0.1, 0.1, 0.1) });

    page.drawText('RERA BROKER REG NO:', { x: 55, y: cpY - 18, size: 8, font: fontBold, color: rgb(0.1, 0.2, 0.4) });
    page.drawText(input.reraBrokerRegNo, { x: 190, y: cpY - 18, size: 8, font: fontMono, color: rgb(0.05, 0.45, 0.2) });

    page.drawText('PAN & GSTIN:', { x: 55, y: cpY - 36, size: 8, font: fontBold, color: rgb(0.1, 0.2, 0.4) });
    page.drawText(`PAN: ${input.brokerPan} | GSTIN: ${input.brokerGstin || 'Unregistered CP'}`, { x: 190, y: cpY - 36, size: 8, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });

    page.drawText('PROJECT & ALLOTTEE:', { x: 55, y: cpY - 54, size: 8, font: fontBold, color: rgb(0.1, 0.2, 0.4) });
    page.drawText(`${input.projectName} (Unit ${input.unitNumber}) • Buyer: ${input.allotteeName}`, { x: 190, y: cpY - 54, size: 8, font: fontRegular, color: rgb(0.1, 0.1, 0.1) });

    page.drawText('AGREEMENT VALUE:', { x: 55, y: cpY - 72, size: 8, font: fontBold, color: rgb(0.1, 0.2, 0.4) });
    page.drawText(`Rs. ${input.agreementValue.toLocaleString('en-IN')}/- (Commission Rate: ${input.commissionPercent}%)`, { x: 190, y: cpY - 72, size: 8, font: fontBold, color: rgb(0.05, 0.45, 0.2) });

    y -= 115;

    // Brokerage & Tax Breakdown
    page.drawText('COMMISSION COMPUTATION & STATUTORY TAX BREAKDOWN', { x: 45, y, size: 9, font: fontBold, color: rgb(0.1, 0.2, 0.3) });
    y -= 18;

    const rows = [
        ['Base Channel Partner Brokerage', `${input.commissionPercent}% of Agreement Value`, `Rs. ${result.baseBrokerageAmount.toLocaleString('en-IN')}/-`],
        ['Kicker / Target Achievement Bonus', 'Direct Builder Incentive', result.kickerBonus > 0 ? `Rs. ${result.kickerBonus.toLocaleString('en-IN')}/-` : 'N/A'],
        ['Gross Brokerage Before Tax', 'Taxable Commission Value', `Rs. ${result.totalBrokerageBeforeTax.toLocaleString('en-IN')}/-`],
        ['Goods & Services Tax (GST)', input.isGstRegistered ? `+ 18% (CGST 9% + SGST 9%)` : 'Not Applicable (0%)', `+ Rs. ${result.gstAmount.toLocaleString('en-IN')}/-`],
        ['Statutory TDS Deduction (Sec 194H)', `- 5% Income Tax Deduction`, `- Rs. ${result.tdsDeductionAmount.toLocaleString('en-IN')}/-`],
    ];

    for (const [r1, r2, r3] of rows) {
        page.drawText(r1, { x: 50, y, size: 8.5, font: fontBold, color: rgb(0.2, 0.25, 0.3) });
        page.drawText(r2, { x: 260, y, size: 8, font: fontRegular, color: rgb(0.4, 0.4, 0.4) });
        page.drawText(r3, { x: 430, y, size: 8.5, font: fontBold, color: r3.startsWith('-') ? rgb(0.8, 0.2, 0.1) : r3.startsWith('+') ? rgb(0.1, 0.4, 0.7) : rgb(0.1, 0.1, 0.1) });

        page.drawLine({ start: { x: 45, y: y - 5 }, end: { x: width - 45, y: y - 5 }, color: rgb(0.9, 0.9, 0.9), thickness: 0.5 });
        y -= 25;
    }

    // Grand Total Banner
    page.drawRectangle({
        x: 45,
        y: y - 35,
        width: width - 90,
        height: 38,
        color: rgb(0.93, 0.97, 0.94),
        borderColor: rgb(0.05, 0.55, 0.25),
        borderWidth: 1.5
    });

    page.drawText('NET PAYABLE TO BROKER (NEFT / RTGS):', { x: 55, y: y - 18, size: 9, font: fontBold, color: rgb(0.1, 0.4, 0.2) });
    page.drawText(`Rs. ${result.netPayableAmount.toLocaleString('en-IN')}/-`, { x: width - 210, y: y - 18, size: 13, font: fontBold, color: rgb(0.05, 0.55, 0.25) });

    y -= 55;

    // Statutory Note
    page.drawText(`Statutory Tax Rule: ${result.statutoryTaxSummary}`, {
        x: 45,
        y,
        size: 7.8,
        font: fontRegular,
        color: rgb(0.4, 0.45, 0.5),
        maxWidth: width - 90
    });

    y -= 25;

    // Signatures
    page.drawRectangle({
        x: 45,
        y: y - 45,
        width: width - 90,
        height: 50,
        borderColor: rgb(0.85, 0.88, 0.9),
        borderWidth: 1,
        color: rgb(0.97, 0.98, 0.99)
    });

    page.drawText('ACCOUNTS & FINANCE DESK', { x: 55, y: y - 12, size: 7.5, font: fontBold, color: rgb(0.1, 0.2, 0.4) });
    page.drawText('[TDS SEC 194H AUDITED]', { x: 55, y: y - 28, size: 7, font: fontRegular, color: rgb(0.05, 0.5, 0.2) });

    page.drawText('CHANNEL PARTNER ACKNOWLEDGEMENT', { x: width - 230, y: y - 12, size: 7.5, font: fontBold, color: rgb(0.1, 0.2, 0.4) });
    page.drawText(`${input.brokerName} (RERA Validated)`, { x: width - 230, y: y - 28, size: 7, font: fontRegular, color: rgb(0.3, 0.3, 0.3) });

    return await pdfDoc.save();
}
