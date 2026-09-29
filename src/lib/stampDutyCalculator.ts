import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import type { IndianState } from './eStampGenerator';

export type BuyerGender = 'male' | 'female' | 'joint' | 'company';
export type LocationType = 'urban_municipal' | 'gram_panchayat' | 'special_investment_region';

export interface StampDutyInput {
    state: IndianState;
    agreementValue: number; // In INR
    readyReckonerValue?: number; // Government circle rate (higher of agreement or RR value is taxed)
    buyerGender: BuyerGender;
    locationType: LocationType;
    isMetroArea?: boolean; // E.g., Mumbai MMRDA, Bangalore BBMP, Pune PMC
    propertyType: 'residential_apartment' | 'commercial_office' | 'residential_plot' | 'agricultural_land';
}

export interface StampDutyResult {
    taxableConsideration: number; // Max of agreementValue and readyReckonerValue
    stampDutyRate: number; // in %
    stampDutyAmount: number;
    cessSurchargeRate: number; // in % (e.g. 1% Metro Cess)
    cessSurchargeAmount: number;
    registrationFeeRate: number; // in %
    registrationFeeAmount: number;
    femaleConcessionSavings: number;
    totalStatutoryCharges: number;
    effectivePercentage: number;
    stateRuleSummary: string;
}

/**
 * Calculates official Indian State Stamp Duty and Registration Fees.
 */
export function calculateStampDuty(input: StampDutyInput): StampDutyResult {
    const consideration = Math.max(input.agreementValue, input.readyReckonerValue || 0);

    let stampDutyRate = 5.0;
    let cessRate = 0.0;
    let regFeeRate = 1.0;
    let regFeeCapped: number | null = null;
    let femaleSavingsRate = 0.0;
    let summary = '';

    switch (input.state) {
        case 'Maharashtra': {
            // Maharashtra: 5% base + 1% Metro Cess in urban areas (Mumbai/Pune)
            stampDutyRate = 5.0;
            if (input.isMetroArea || input.locationType === 'urban_municipal') {
                cessRate = 1.0; // 1% Metro / Transport Surcharge (MMRDA / PMC / NMMC)
            }
            if (input.buyerGender === 'female' && input.propertyType.startsWith('residential')) {
                stampDutyRate -= 1.0; // 1% Woman Buyer Rebate
                femaleSavingsRate = 1.0;
                summary = 'Maharashtra: 4% Stamp Duty (with 1% Female Rebate) + 1% Metro Cess + 1% Reg Fee (Capped Rs. 30k).';
            } else {
                summary = 'Maharashtra: 5% Stamp Duty + 1% Metro Cess + 1% Reg Fee (Capped Rs. 30,000).';
            }
            regFeeRate = 1.0;
            regFeeCapped = 30000; // Registration fee capped at Rs. 30,000 in Maharashtra for values > Rs. 30 Lakh
            break;
        }

        case 'Karnataka': {
            // Karnataka (Bangalore / BMRDA)
            if (consideration > 4500000) {
                stampDutyRate = 5.0;
            } else if (consideration > 2000000) {
                stampDutyRate = 3.0;
            } else {
                stampDutyRate = 2.0;
            }
            // 2% BBMP/BMRDA Cess + 1% Surcharge on Stamp Duty = ~0.6% effective
            cessRate = 0.6;
            regFeeRate = 1.0;
            regFeeCapped = null;
            summary = 'Karnataka: 5% Stamp Duty + 10% Surcharge/Cess on Duty + 1% Registration Fee.';
            break;
        }

        case 'Delhi': {
            if (input.buyerGender === 'female') {
                stampDutyRate = 4.0;
                femaleSavingsRate = 2.0;
                summary = 'Delhi NCR: 4% Stamp Duty (Female Sole Buyer Concession) + 1% Registration Fee.';
            } else if (input.buyerGender === 'joint') {
                stampDutyRate = 5.0;
                femaleSavingsRate = 1.0;
                summary = 'Delhi NCR: 5% Stamp Duty (Joint Male+Female Ownership) + 1% Registration Fee.';
            } else {
                stampDutyRate = 6.0;
                summary = 'Delhi NCR: 6% Stamp Duty (Male / Entity Buyer) + 1% Registration Fee.';
            }
            regFeeRate = 1.0;
            break;
        }

        case 'Haryana': {
            const isUrban = input.locationType === 'urban_municipal' || input.isMetroArea;
            if (input.buyerGender === 'female') {
                stampDutyRate = isUrban ? 5.0 : 3.0;
                femaleSavingsRate = 2.0;
                summary = `Haryana: ${stampDutyRate}% Stamp Duty (Female Concession) + Capped Registration Fee.`;
            } else if (input.buyerGender === 'joint') {
                stampDutyRate = isUrban ? 6.0 : 4.0;
                femaleSavingsRate = 1.0;
                summary = `Haryana: ${stampDutyRate}% Stamp Duty (Joint Ownership) + Capped Registration Fee.`;
            } else {
                stampDutyRate = isUrban ? 7.0 : 5.0;
                summary = `Haryana: ${stampDutyRate}% Stamp Duty (Standard Urban Rate) + Capped Registration Fee.`;
            }
            // Haryana registration slabs
            regFeeCapped = consideration > 2500000 ? 50000 : 25000;
            regFeeRate = 0.0;
            break;
        }

        case 'Uttar Pradesh': {
            stampDutyRate = 7.0;
            if (input.buyerGender === 'female' && consideration <= 10000000) {
                // 1% concession up to Rs. 10 Lakh reduction
                femaleSavingsRate = 1.0;
                summary = 'Uttar Pradesh: 7% Stamp Duty (Rs. 10,000 rebate for female buyer) + 1% Registration Fee.';
            } else {
                summary = 'Uttar Pradesh (Noida/Greater Noida): 7% Stamp Duty + 1% Registration Fee.';
            }
            regFeeRate = 1.0;
            break;
        }

        case 'Telangana': {
            stampDutyRate = 5.5;
            cessRate = 1.5; // Transfer duty
            regFeeRate = 0.5;
            summary = 'Telangana: 5.5% Stamp Duty + 1.5% Transfer Duty + 0.5% Registration Fee = 7.5% Total.';
            break;
        }

        case 'Tamil Nadu': {
            stampDutyRate = 7.0;
            regFeeRate = 4.0; // 4% registration fee in Tamil Nadu
            summary = 'Tamil Nadu: 7% Stamp Duty + 4% Registration Fee = 11% Total.';
            break;
        }

        case 'Gujarat': {
            if (input.buyerGender === 'female') {
                stampDutyRate = 0.0; // 0% basic stamp duty for females in Gujarat
                femaleSavingsRate = 4.9;
                cessRate = 1.0; // 1% surcharge
                summary = 'Gujarat: 0% Basic Stamp Duty (100% Female Exemption) + 1% Surcharge + 1% Reg Fee.';
            } else {
                stampDutyRate = 4.9;
                cessRate = 1.0;
                summary = 'Gujarat: 4.9% Stamp Duty + 1% Surcharge + 1% Registration Fee.';
            }
            regFeeRate = 1.0;
            break;
        }

        case 'West Bengal': {
            if (consideration > 4000000) {
                stampDutyRate = input.locationType === 'urban_municipal' ? 6.0 : 5.0;
            } else {
                stampDutyRate = input.locationType === 'urban_municipal' ? 5.0 : 4.0;
            }
            regFeeRate = 1.0;
            summary = 'West Bengal: 5-6% Stamp Duty (IGRS) + 1% Registration Fee.';
            break;
        }
    }

    const stampDutyAmount = Math.round((consideration * stampDutyRate) / 100);
    const cessSurchargeAmount = Math.round((consideration * cessRate) / 100);
    
    let registrationFeeAmount = Math.round((consideration * regFeeRate) / 100);
    if (regFeeCapped !== null && registrationFeeAmount > regFeeCapped) {
        registrationFeeAmount = regFeeCapped;
    }

    const femaleConcessionSavings = Math.round((consideration * femaleSavingsRate) / 100);
    const totalStatutoryCharges = stampDutyAmount + cessSurchargeAmount + registrationFeeAmount;
    const effectivePercentage = parseFloat(((totalStatutoryCharges / consideration) * 100).toFixed(2));

    return {
        taxableConsideration: consideration,
        stampDutyRate,
        stampDutyAmount,
        cessSurchargeRate: cessRate,
        cessSurchargeAmount,
        registrationFeeRate: regFeeRate,
        registrationFeeAmount,
        femaleConcessionSavings,
        totalStatutoryCharges,
        effectivePercentage,
        stateRuleSummary: summary
    };
}

/**
 * Generates an institutional PDF Assessment Certificate for the deal room.
 */
export async function generateStampDutyAssessmentPdf(
    input: StampDutyInput,
    result: StampDutyResult,
    propertyName: string = 'Residential Property Unit'
): Promise<Uint8Array> {
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
        borderColor: rgb(0.1, 0.4, 0.25),
        borderWidth: 1.5,
    });

    // Header
    page.drawText('STATUTORY STAMP DUTY & REGISTRATION ASSESSMENT', {
        x: 40,
        y: height - 60,
        size: 13,
        font: fontBold,
        color: rgb(0.1, 0.35, 0.2),
    });

    page.drawText(`State Revenue Board & Inspector General of Registration (IGR) • ${input.state.toUpperCase()}`, {
        x: 40,
        y: height - 78,
        size: 8.5,
        font: fontRegular,
        color: rgb(0.4, 0.45, 0.5),
    });

    // Property Box
    page.drawRectangle({
        x: 40,
        y: height - 170,
        width: width - 80,
        height: 75,
        color: rgb(0.97, 0.98, 0.99),
        borderColor: rgb(0.85, 0.88, 0.92),
        borderWidth: 1,
    });

    page.drawText(`Property: ${propertyName}`, { x: 55, y: height - 110, size: 10, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
    page.drawText(`Agreement Consideration: Rs. ${input.agreementValue.toLocaleString('en-IN')}`, { x: 55, y: height - 130, size: 9, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });
    page.drawText(`Taxable Base (Ready Reckoner Check): Rs. ${result.taxableConsideration.toLocaleString('en-IN')}`, { x: 55, y: height - 150, size: 9, font: fontBold, color: rgb(0.05, 0.4, 0.2) });

    // Table of Charges
    const startTableY = height - 200;
    const tableData = [
        ['Basic Stamp Duty', `${result.stampDutyRate}%`, `Rs. ${result.stampDutyAmount.toLocaleString('en-IN')}/-`],
        ['Local Body / Metro Surcharge / Cess', `${result.cessSurchargeRate}%`, `Rs. ${result.cessSurchargeAmount.toLocaleString('en-IN')}/-`],
        ['Registration Fee (IGR)', `${result.registrationFeeRate}% (Capped)`, `Rs. ${result.registrationFeeAmount.toLocaleString('en-IN')}/-`],
        ['Female Buyer Rebate Savings', `${result.femaleConcessionSavings > 0 ? 'Applied' : 'N/A'}`, `- Rs. ${result.femaleConcessionSavings.toLocaleString('en-IN')}/-`],
    ];

    let rY = startTableY;
    for (const [charge, rate, amt] of tableData) {
        page.drawText(charge, { x: 50, y: rY, size: 9, font: fontBold, color: rgb(0.2, 0.25, 0.3) });
        page.drawText(rate, { x: 300, y: rY, size: 9, font: fontRegular, color: rgb(0.3, 0.3, 0.3) });
        page.drawText(amt, { x: 440, y: rY, size: 9, font: fontBold, color: amt.startsWith('-') ? rgb(0.1, 0.6, 0.2) : rgb(0.1, 0.1, 0.1) });

        page.drawLine({
            start: { x: 40, y: rY - 8 },
            end: { x: width - 40, y: rY - 8 },
            color: rgb(0.9, 0.9, 0.9),
            thickness: 0.5
        });
        rY -= 32;
    }

    // Grand Total Banner
    page.drawRectangle({
        x: 40,
        y: rY - 45,
        width: width - 80,
        height: 45,
        color: rgb(0.92, 0.97, 0.94),
        borderColor: rgb(0.1, 0.6, 0.3),
        borderWidth: 1.5,
    });

    page.drawText('TOTAL STATUTORY PAYABLE:', { x: 55, y: rY - 25, size: 10, font: fontBold, color: rgb(0.1, 0.4, 0.2) });
    page.drawText(`Rs. ${result.totalStatutoryCharges.toLocaleString('en-IN')}/- (${result.effectivePercentage}%)`, {
        x: width - 260,
        y: rY - 25,
        size: 13,
        font: fontBold,
        color: rgb(0.05, 0.5, 0.2),
    });

    // State rule notes
    page.drawText(`Statutory Basis: ${result.stateRuleSummary}`, {
        x: 40,
        y: rY - 75,
        size: 8,
        font: fontRegular,
        color: rgb(0.4, 0.45, 0.5),
    });

    page.drawText(`Assessment Generated on ${new Date().toLocaleDateString('en-IN')} via DocTransfer Indian Real Estate Engine.`, {
        x: 40,
        y: 40,
        size: 7.5,
        font: fontRegular,
        color: rgb(0.6, 0.6, 0.6),
    });

    return await pdfDoc.save();
}
