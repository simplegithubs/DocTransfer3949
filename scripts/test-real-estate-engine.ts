import { validatePan, validateAadhaar, validateGstin, generateVerhoeffCheckDigit } from '../src/lib/kycValidator';
import { calculateStampDuty, generateStampDutyAssessmentPdf } from '../src/lib/stampDutyCalculator';
import { generateEStampCoverPdf, mergeEStampWithDocument } from '../src/lib/eStampGenerator';
import { generateSec65BCertificatePdf } from '../src/lib/sec65bGenerator';
import { PRECONFIGURED_BANK_APFS, generatePermissionToMortgageNoc, generateTripartiteLoanAgreementPdf } from '../src/lib/tripartiteLoanEngine';
import { STANDARD_RERA_MILESTONES, calculateDemandNoteAmounts, generateDemandNotePdf } from '../src/lib/demandNoteGenerator';
import { calculateCPCommission, generateCPCommissionDisbursementPdf } from '../src/lib/cpCommissionEngine';
import { PDFDocument } from 'pdf-lib';

async function runTests() {
    console.log('🏛️ --- Running Comprehensive Indian Real Estate Engine Tests --- 🏛️\n');

    let passed = 0;
    let failed = 0;

    function assert(condition: boolean, testName: string) {
        if (condition) {
            console.log(`  ✅ PASS: ${testName}`);
            passed++;
        } else {
            console.error(`  ❌ FAIL: ${testName}`);
            failed++;
        }
    }

    // 1. PAN Validation Tests
    console.log('1️⃣ KYC: PAN Validation Engine');
    const panIndividual = validatePan('ABCPS1234K');
    assert(panIndividual.isValid && panIndividual.entityType === 'Individual', 'Valid Individual PAN');

    const panCompany = validatePan('AABCB1234C');
    assert(panCompany.isValid && panCompany.entityType === 'Company (Pvt Ltd / Ltd)', 'Valid Company PAN');

    const panInvalid = validatePan('INVALID123');
    assert(!panInvalid.isValid, 'Reject invalid PAN');

    // 2. Aadhaar Validation & Masking
    console.log('\n2️⃣ KYC: Aadhaar Checksum & UIDAI Masking');
    const prefix11 = '23456789012';
    const checkDigit = generateVerhoeffCheckDigit(prefix11);
    const validAadhaar12 = `${prefix11}${checkDigit}`;
    const aadhaarTest = validateAadhaar(validAadhaar12);
    assert(aadhaarTest.isValid && aadhaarTest.maskedAadhaar === `XXXX-XXXX-${validAadhaar12.slice(8)}`, 'Aadhaar Verhoeff validation and UIDAI masking (XXXX-XXXX-last4)');

    const aadhaarInvalid = validateAadhaar('12345678');
    assert(!aadhaarInvalid.isValid, 'Reject invalid Aadhaar length');

    // 3. GSTIN Validation
    console.log('\n3️⃣ KYC: GSTIN State Code & Entity PAN Extractor');
    const gstinTest = validateGstin('27ABCPS1234K1Z5');
    assert(gstinTest.isValid && gstinTest.stateCode === '27' && gstinTest.embeddedPan === 'ABCPS1234K', 'Valid Maharashtra GSTIN with embedded PAN');

    // 4. State-Wise Stamp Duty Engine
    console.log('\n4️⃣ Ready Reckoner & State Stamp Duty Engine');
    // Maharashtra Male (Urban + Metro Cess)
    const mhMale = calculateStampDuty({
        state: 'Maharashtra',
        agreementValue: 10000000, // 1 Crore
        buyerGender: 'male',
        locationType: 'urban_municipal',
        isMetroArea: true,
        propertyType: 'residential_apartment'
    });
    assert(mhMale.stampDutyRate === 5.0 && mhMale.cessSurchargeRate === 1.0 && mhMale.registrationFeeAmount === 30000, 'Maharashtra: 5% duty + 1% metro cess + capped ₹30k reg fee');

    // Maharashtra Female (1% Rebate)
    const mhFemale = calculateStampDuty({
        state: 'Maharashtra',
        agreementValue: 10000000,
        buyerGender: 'female',
        locationType: 'urban_municipal',
        isMetroArea: true,
        propertyType: 'residential_apartment'
    });
    assert(mhFemale.stampDutyRate === 4.0 && mhFemale.femaleConcessionSavings === 100000, 'Maharashtra Female Buyer: 1% concession savings (₹1,00,000 savings)');

    // Delhi Female Buyer
    const dlFemale = calculateStampDuty({
        state: 'Delhi',
        agreementValue: 8000000,
        buyerGender: 'female',
        locationType: 'urban_municipal',
        propertyType: 'residential_apartment'
    });
    assert(dlFemale.stampDutyRate === 4.0 && dlFemale.femaleConcessionSavings === 160000, 'Delhi Female Buyer: 4% duty (2% concession savings)');

    // Gujarat 100% Female Exemption
    const gjFemale = calculateStampDuty({
        state: 'Gujarat',
        agreementValue: 5000000,
        buyerGender: 'female',
        locationType: 'urban_municipal',
        propertyType: 'residential_apartment'
    });
    assert(gjFemale.stampDutyRate === 0.0 && gjFemale.femaleConcessionSavings === 245000, 'Gujarat Female Buyer: 0% basic duty (100% exemption)');

    // Karnataka
    const kaDuty = calculateStampDuty({
        state: 'Karnataka',
        agreementValue: 6000000,
        buyerGender: 'male',
        locationType: 'urban_municipal',
        propertyType: 'residential_apartment'
    });
    assert(kaDuty.stampDutyRate === 5.0 && kaDuty.cessSurchargeRate === 0.6, 'Karnataka: 5% stamp duty + 0.6% surcharge');

    // 5. PDF Generation & Merging
    console.log('\n5️⃣ PDF Assembly: e-Stamp Cover & Section 65B Certificate');
    const stampBytes = await generateEStampCoverPdf({
        certificateNo: 'IN-MH12948192841W',
        state: 'Maharashtra',
        issueDate: '29/09/2026',
        firstParty: 'Aditya Sharma',
        secondParty: 'Godrej Properties Ltd',
        stampDutyAmount: 50000,
        dutyPaidBy: 'Aditya Sharma',
        documentType: 'Article 5 Agreement for Sale (RERA)',
        propertyDescription: 'Unit 1402, Godrej Woodsman'
    });
    const parsedStampDoc = await PDFDocument.load(stampBytes);
    assert(parsedStampDoc.getPageCount() === 1, 'e-Stamp Cover PDF generated with 1 page');

    // Test Merge with sample deed
    const sampleDeedDoc = await PDFDocument.create();
    sampleDeedDoc.addPage([595, 842]);
    sampleDeedDoc.addPage([595, 842]);
    const sampleDeedBytes = await sampleDeedDoc.save();

    const mergedBytes = await mergeEStampWithDocument(sampleDeedBytes.buffer as ArrayBuffer, {
        certificateNo: 'IN-KA9918237128W',
        state: 'Karnataka',
        issueDate: '29/09/2026',
        firstParty: 'Rahul Sharma',
        secondParty: 'Prestige Group Ltd',
        stampDutyAmount: 100000,
        dutyPaidBy: 'Rahul Sharma',
        documentType: 'Article 5 Agreement for Sale'
    });
    const parsedMergedDoc = await PDFDocument.load(mergedBytes);
    assert(parsedMergedDoc.getPageCount() === 3, 'e-Stamp correctly stitched as Page 1 before 2-page deed (Total 3 pages)');

    // Test Stamp Duty Assessment PDF
    const assessmentPdfBytes = await generateStampDutyAssessmentPdf(
        {
            state: 'Maharashtra',
            agreementValue: 12000000,
            buyerGender: 'female',
            locationType: 'urban_municipal',
            propertyType: 'residential_apartment'
        },
        mhFemale,
        'Godrej Woodsman Unit 1402'
    );
    const parsedAssessmentDoc = await PDFDocument.load(assessmentPdfBytes);
    assert(parsedAssessmentDoc.getPageCount() === 1, 'Stamp Duty Assessment Sheet PDF successfully generated');

    // Test Section 65B Electronic Record Certificate
    const sec65bBytes = await generateSec65BCertificatePdf({
        documentName: 'Agreement for Sale (RERA ATS Deed)',
        signerName: 'Vikram Godrej (Director)',
        signerEmail: 'vikram@godrej.com',
        signerPhone: '+91 98200 11223',
        signedAt: new Date().toISOString(),
        ipAddress: '49.36.120.45 (Mumbai)',
        documentHashSha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
        reraRegNo: 'P51800001234',
        stampType: 'Section 32A Multi-Party Real Estate Execution'
    });
    const parsedSec65BDoc = await PDFDocument.load(sec65bBytes);
    assert(parsedSec65BDoc.getPageCount() === 1, 'Section 65B Electronic Audit Certificate PDF successfully generated');

    // 6. Bank APF Home Loan & Tripartite Agreement Engine (Gap 4)
    console.log('\n6️⃣ Bank APF & Tripartite Loan Engine (Gap 4)');
    assert(PRECONFIGURED_BANK_APFS.length >= 5, 'Pre-configured Bank APF master codes loaded (SBI, HDFC, ICICI, Axis, BOB)');

    const sbiApf = PRECONFIGURED_BANK_APFS[0];
    const ptmParams = {
        projectName: 'Prestige Falcon City',
        unitNumber: 'Tower B, Unit 1404',
        reraNumber: 'PRM/KA/RERA/1251/310/PR/170915/000234',
        developerName: 'Prestige Estates Projects Ltd',
        allotteeName: 'Rahul & Priya Sharma',
        bankName: sbiApf.bankName,
        apfCode: sbiApf.apfProjectCode,
        totalConsideration: 16500000,
        sanctionedLoanAmount: 13200000,
        escrowAccount: sbiApf.escrowAccountDesignated
    };

    const ptmPdfBytes = await generatePermissionToMortgageNoc(ptmParams);
    const parsedPtmDoc = await PDFDocument.load(ptmPdfBytes);
    assert(parsedPtmDoc.getPageCount() === 1, 'Builder Permission to Mortgage (PTM) NOC PDF successfully generated');

    const tripartitePdfBytes = await generateTripartiteLoanAgreementPdf(ptmParams);
    const parsedTripartiteDoc = await PDFDocument.load(tripartitePdfBytes);
    assert(parsedTripartiteDoc.getPageCount() === 1, 'Tripartite Home Loan Agreement (3-Party) PDF successfully generated');

    // 7. RERA Construction Milestone Demand Notes (Gap 4)
    console.log('\n7️⃣ RERA Milestone Demand Notes & 5% GST Engine (Gap 4)');
    const plinthMilestone = STANDARD_RERA_MILESTONES[2]; // Plinth 15%
    const demandCalc = calculateDemandNoteAmounts(16500000, plinthMilestone.percentageOfCost, 5);
    assert(demandCalc.milestoneBaseAmount === 2475000 && demandCalc.gstAmount === 123750 && demandCalc.totalPayable === 2598750, 'Demand Note: 15% Plinth (₹24,75,000) + 5% GST (₹1,23,750) = ₹25,98,750');

    const demandPdfBytes = await generateDemandNotePdf({
        projectName: 'Prestige Falcon City',
        unitNumber: 'Tower B, Unit 1404',
        reraNumber: 'PRM/KA/RERA/1251/310/PR/170915/000234',
        developerName: 'Prestige Estates Projects Ltd',
        allotteeName: 'Rahul & Priya Sharma',
        totalConsideration: 16500000,
        milestone: plinthMilestone,
        dueDate: '15/10/2026',
        escrowAccount: sbiApf.escrowAccountDesignated
    });
    const parsedDemandDoc = await PDFDocument.load(demandPdfBytes);
    assert(parsedDemandDoc.getPageCount() === 1, 'RERA Milestone Demand Note PDF with Escrow details generated');

    // 8. Channel Partner (CP) Commission & TDS 194H Ledger (Gap 4)
    console.log('\n8️⃣ Channel Partner (CP) Broker Commission, 18% GST & TDS 194H (Gap 4)');
    const cpInput = {
        brokerName: 'Apex Realty Advisory',
        brokerFirmName: 'Apex Advisory Pvt Ltd',
        reraBrokerRegNo: 'PRM/KA/RERA/1251/310/AG/180210/00142',
        brokerPan: 'AABCA1234F',
        brokerGstin: '29AABCA1234F1Z8',
        brokerPhone: '+91 98765 43210',
        projectName: 'Prestige Falcon City',
        unitNumber: 'Tower B, Unit 1404',
        allotteeName: 'Rahul & Priya Sharma',
        agreementValue: 16500000,
        commissionPercent: 2.0, // 2% of 1.65 Cr = ₹3,30,000
        isGstRegistered: true,
        kickerBonusAmount: 20000
    };

    const cpResult = calculateCPCommission(cpInput);
    // Base 3,30,000 + Kicker 20,000 = Gross 3,50,000
    // + 18% GST = 63,000
    // - 5% TDS = 17,500
    // Net = 3,50,000 + 63,000 - 17,500 = 3,95,500
    assert(cpResult.baseBrokerageAmount === 330000 && cpResult.totalBrokerageBeforeTax === 350000, 'CP Commission: 2% Base (₹3,30,000) + ₹20,000 Kicker = ₹3,50,000 Gross');
    assert(cpResult.gstAmount === 63000 && cpResult.tdsDeductionAmount === 17500 && cpResult.netPayableAmount === 395500, 'CP Tax Engine: +18% GST (₹63,000) - 5% TDS Sec 194H (₹17,500) = ₹3,95,500 Net Payable');

    const cpVoucherPdfBytes = await generateCPCommissionDisbursementPdf(cpInput, cpResult, 'Prestige Estates Projects Ltd');
    const parsedCpDoc = await PDFDocument.load(cpVoucherPdfBytes);
    assert(parsedCpDoc.getPageCount() === 1, 'RERA Channel Partner Commission Voucher PDF generated');

    console.log(`\n========================================`);
    console.log(`Summary: ${passed} Passed, ${failed} Failed`);
    console.log(`========================================\n`);

    if (failed > 0) {
        process.exit(1);
    }
}

runTests().catch(err => {
    console.error('Test execution error:', err);
    process.exit(1);
});
