import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export interface MilestoneDemandConfig {
    milestoneId: string;
    milestoneName: string;
    milestoneHindiName?: string;
    percentageOfCost: number; // e.g. 15 for 15%
    architectCertRef: string; // E.g. "RERA Form 1 - Arch Cert #ARC-2026-981"
    engineerCertRef: string;  // E.g. "RERA Form 2 - Struct Eng #STR-2026-441"
    estimatedCompletionDate: string;
}

export const STANDARD_RERA_MILESTONES: MilestoneDemandConfig[] = [
    {
        milestoneId: 'm_token',
        milestoneName: '1. Booking Advance & Expression of Interest (EOI)',
        milestoneHindiName: 'टोकन रक्कम व प्राथमिक नोंदणी',
        percentageOfCost: 10,
        architectCertRef: 'RERA Registration Order Sanction',
        engineerCertRef: 'Site Layout Plan Approval',
        estimatedCompletionDate: 'Immediate'
    },
    {
        milestoneId: 'm_ats',
        milestoneName: '2. Execution of Registered Agreement for Sale (BBA)',
        milestoneHindiName: 'नोंदणीकृत विक्री करार',
        percentageOfCost: 10,
        architectCertRef: 'Sanctioned Architectural Building Plan #BBMP/LP/401',
        engineerCertRef: 'Soil Testing & Foundation Audit Report',
        estimatedCompletionDate: 'Within 30 Days of Booking'
    },
    {
        milestoneId: 'm_plinth',
        milestoneName: '3. Completion of Foundation & Plinth Level',
        milestoneHindiName: 'पाया व जोत्याचे बांधकाम पूर्ण',
        percentageOfCost: 15,
        architectCertRef: 'RERA Form 1 (Architect Certificate) #ARC-2026-081',
        engineerCertRef: 'RERA Form 2 (Structural Engineer Cert) #STR-2026-042',
        estimatedCompletionDate: 'Quarter 1'
    },
    {
        milestoneId: 'm_5th_slab',
        milestoneName: '4. Casting of 5th Floor RCC Roof Slab',
        milestoneHindiName: 'पाचव्या मजल्याचा स्लॅब पूर्ण',
        percentageOfCost: 15,
        architectCertRef: 'RERA Form 1 (Quarterly Progress Report)',
        engineerCertRef: 'Concrete Cube Strength & Steel Quality Test Cert',
        estimatedCompletionDate: 'Quarter 2'
    },
    {
        milestoneId: 'm_top_slab',
        milestoneName: '5. Casting of Top Terrace Roof Slab',
        milestoneHindiName: 'इमारतीचा अंतिम स्लॅब पूर्ण',
        percentageOfCost: 20,
        architectCertRef: 'RERA Form 1 Superstructure Completion Cert',
        engineerCertRef: 'RERA Form 2 RCC Framing Certified Record',
        estimatedCompletionDate: 'Quarter 3'
    },
    {
        milestoneId: 'm_flooring',
        milestoneName: '6. Internal Plaster, Plumbing & Vitrified Flooring',
        milestoneHindiName: 'प्लास्टर, प्लंबिंग व फरशीकाम पूर्ण',
        percentageOfCost: 15,
        architectCertRef: 'RERA Form 1 Internal Finishing Scrutiny',
        engineerCertRef: 'MEP (Mechanical, Electrical, Plumbing) Fitment Audit',
        estimatedCompletionDate: 'Quarter 4'
    },
    {
        milestoneId: 'm_handover',
        milestoneName: '7. Grant of Occupancy Certificate (OC) & Key Handover',
        milestoneHindiName: 'भोगवटा प्रमाणपत्र व ताबा पत्र',
        percentageOfCost: 10,
        architectCertRef: 'Municipal Corporation OC / Completion Order',
        engineerCertRef: 'Fire Safety NOC & Lift Safety Certificate',
        estimatedCompletionDate: 'Project Handover'
    }
];

export interface DemandNoteParams {
    projectName: string;
    unitNumber: string;
    reraNumber: string;
    developerName: string;
    allotteeName: string;
    totalConsideration: number;
    milestone: MilestoneDemandConfig;
    dueDate: string;
    escrowAccount: string;
    gstRatePercent?: number; // E.g. 5% under Indian RERA Real Estate GST rules
    demandNoteNumber?: string;
}

export interface DemandNoteCalculation {
    milestoneBaseAmount: number;
    gstAmount: number;
    totalPayable: number;
}

export function calculateDemandNoteAmounts(totalConsideration: number, percentageOfCost: number, gstRatePercent: number = 5): DemandNoteCalculation {
    const milestoneBaseAmount = Math.round((totalConsideration * percentageOfCost) / 100);
    const gstAmount = Math.round((milestoneBaseAmount * gstRatePercent) / 100);
    const totalPayable = milestoneBaseAmount + gstAmount;
    return {
        milestoneBaseAmount,
        gstAmount,
        totalPayable
    };
}

/**
 * Generates an institutional RERA Construction Milestone Demand Note PDF.
 */
export async function generateDemandNotePdf(params: DemandNoteParams): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]);
    const { width, height } = page.getSize();

    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const calc = calculateDemandNoteAmounts(params.totalConsideration, params.milestone.percentageOfCost, params.gstRatePercent ?? 5);

    // Border
    page.drawRectangle({
        x: 25,
        y: 25,
        width: width - 50,
        height: height - 50,
        borderColor: rgb(0.1, 0.4, 0.25),
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
        color: rgb(0.1, 0.4, 0.25)
    });

    y -= 14;
    page.drawText(`Project: ${params.projectName} • RERA Registration: ${params.reraNumber}`, {
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
        color: rgb(0.1, 0.4, 0.25),
        thickness: 1
    });

    y -= 25;

    page.drawText('STATUTORY CONSTRUCTION-LINKED MILESTONE DEMAND NOTE', {
        x: width / 2 - 180,
        y,
        size: 10,
        font: fontBold,
        color: rgb(0.08, 0.25, 0.15)
    });

    y -= 20;

    const noteNo = params.demandNoteNumber || `DN-${Date.now().toString().slice(-8)}`;
    page.drawText(`Demand Note Ref: ${noteNo}`, { x: 45, y, size: 8, font: fontBold, color: rgb(0.3, 0.3, 0.3) });
    page.drawText(`Due Date: ${params.dueDate}`, { x: width - 180, y, size: 8.5, font: fontBold, color: rgb(0.8, 0.2, 0.1) });

    y -= 25;

    // Allottee Box
    page.drawRectangle({
        x: 45,
        y: y - 55,
        width: width - 90,
        height: 55,
        borderColor: rgb(0.85, 0.88, 0.92),
        borderWidth: 1,
        color: rgb(0.97, 0.98, 0.99)
    });

    page.drawText(`To: ${params.allotteeName}`, { x: 55, y: y - 18, size: 9, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
    page.drawText(`Unit: ${params.unitNumber} | Total Consideration: Rs. ${params.totalConsideration.toLocaleString('en-IN')}/-`, { x: 55, y: y - 36, size: 8, font: fontRegular, color: rgb(0.3, 0.3, 0.3) });

    y -= 75;

    // Milestone Details
    page.drawText(`Milestone Achieved: ${params.milestone.milestoneName}`, { x: 45, y, size: 9, font: fontBold, color: rgb(0.05, 0.4, 0.2) });
    y -= 14;
    page.drawText(`Architect Verification: ${params.milestone.architectCertRef}`, { x: 45, y, size: 7.8, font: fontRegular, color: rgb(0.4, 0.45, 0.5) });
    y -= 12;
    page.drawText(`Engineer Certification: ${params.milestone.engineerCertRef}`, { x: 45, y, size: 7.8, font: fontRegular, color: rgb(0.4, 0.45, 0.5) });

    y -= 25;

    // Table of Charges
    const charges = [
        ['Milestone Slab Proportion', `${params.milestone.percentageOfCost}% of Cost`, `Rs. ${calc.milestoneBaseAmount.toLocaleString('en-IN')}/-`],
        ['Real Estate GST (5% Under RERA)', `5% Central + State GST`, `Rs. ${calc.gstAmount.toLocaleString('en-IN')}/-`],
    ];

    for (const [col1, col2, col3] of charges) {
        page.drawText(col1, { x: 50, y, size: 8.5, font: fontBold, color: rgb(0.2, 0.25, 0.3) });
        page.drawText(col2, { x: 280, y, size: 8, font: fontRegular, color: rgb(0.4, 0.4, 0.4) });
        page.drawText(col3, { x: 430, y, size: 8.5, font: fontBold, color: rgb(0.1, 0.1, 0.1) });

        page.drawLine({ start: { x: 45, y: y - 6 }, end: { x: width - 45, y: y - 6 }, color: rgb(0.9, 0.9, 0.9), thickness: 0.5 });
        y -= 25;
    }

    // Grand Total Banner
    page.drawRectangle({
        x: 45,
        y: y - 35,
        width: width - 90,
        height: 38,
        color: rgb(0.92, 0.97, 0.94),
        borderColor: rgb(0.05, 0.55, 0.25),
        borderWidth: 1.5
    });

    page.drawText('TOTAL AMOUNT PAYABLE:', { x: 55, y: y - 18, size: 9.5, font: fontBold, color: rgb(0.1, 0.4, 0.2) });
    page.drawText(`Rs. ${calc.totalPayable.toLocaleString('en-IN')}/-`, { x: width - 210, y: y - 18, size: 13, font: fontBold, color: rgb(0.05, 0.55, 0.25) });

    y -= 55;

    // Bank Wire / Escrow Instructions
    page.drawRectangle({
        x: 45,
        y: y - 85,
        width: width - 90,
        height: 85,
        color: rgb(0.97, 0.98, 1.0),
        borderColor: rgb(0.8, 0.85, 0.95),
        borderWidth: 1
    });

    page.drawText('REMITTANCE INSTRUCTIONS (RERA ESCROW ACCOUNT)', { x: 55, y: y - 16, size: 8.5, font: fontBold, color: rgb(0.1, 0.2, 0.5) });
    page.drawText(`Kindly remit funds strictly into the designated RERA Master Escrow account:`, { x: 55, y: y - 32, size: 7.8, font: fontRegular, color: rgb(0.3, 0.3, 0.3) });
    page.drawText(`Escrow Details: ${params.escrowAccount}`, { x: 55, y: y - 48, size: 8, font: fontBold, color: rgb(0.05, 0.45, 0.2) });
    page.drawText(`Note: For bank home loan disbursement, please submit this demand note to your lending branch.`, { x: 55, y: y - 66, size: 7.5, font: fontRegular, color: rgb(0.4, 0.45, 0.5) });

    y -= 105;

    page.drawText(`Issued by ${params.developerName} • Real Estate Regulatory Authority (RERA) Compliant.`, {
        x: 45,
        y: 40,
        size: 7.5,
        font: fontRegular,
        color: rgb(0.5, 0.5, 0.5)
    });

    return await pdfDoc.save();
}
