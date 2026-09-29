/**
 * Institutional Indian KYC Validation Engine (PAN, Aadhaar, GSTIN)
 * Compliant with UIDAI masking guidelines and Income Tax Dept PAN structure.
 */

export interface PanValidationResult {
    isValid: boolean;
    pan: string;
    entityType: string;
    entityCode: string;
    holderTypeDescription: string;
    error?: string;
}

export interface AadhaarValidationResult {
    isValid: boolean;
    rawDigits: string;
    maskedAadhaar: string;
    error?: string;
}

export interface GstinValidationResult {
    isValid: boolean;
    gstin: string;
    stateCode: string;
    embeddedPan: string;
    error?: string;
}

const PAN_ENTITY_MAP: Record<string, string> = {
    'P': 'Individual',
    'C': 'Company (Pvt Ltd / Ltd)',
    'H': 'Hindu Undivided Family (HUF)',
    'F': 'Partnership Firm / LLP',
    'A': 'Association of Persons (AOP)',
    'T': 'Trust',
    'B': 'Body of Individuals (BOI)',
    'L': 'Local Authority',
    'J': 'Artificial Juridical Person',
    'G': 'Government Agency'
};

/**
 * Validates an Indian Income Tax PAN Card number.
 * Format: 5 Alphabets, 4 Digits, 1 Alphabet (e.g., ABCDE1234F)
 */
export function validatePan(pan: string): PanValidationResult {
    const cleanPan = pan.trim().toUpperCase().replace(/\s+/g, '');

    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
    if (!panRegex.test(cleanPan)) {
        return {
            isValid: false,
            pan: cleanPan,
            entityType: 'Invalid',
            entityCode: '',
            holderTypeDescription: 'Invalid PAN structure. Must be 5 letters, 4 numbers, 1 letter.',
            error: 'Invalid PAN format. Example: ABCDE1234F'
        };
    }

    const entityCode = cleanPan.charAt(3);
    const entityType = PAN_ENTITY_MAP[entityCode] || 'Unknown Entity';

    return {
        isValid: true,
        pan: cleanPan,
        entityType,
        entityCode,
        holderTypeDescription: `Valid PAN for ${entityType}`
    };
}

/**
 * Verhoeff Algorithm Tables for Aadhaar Checksum Validation
 */
const verhoeffD = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
    [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
    [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
    [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
    [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
    [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
    [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
    [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
];

const verhoeffP = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
    [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
    [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
    [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
    [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
    [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
    [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
];

const verhoeffInv = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];

export function generateVerhoeffCheckDigit(str11Digits: string): number {
    let c = 0;
    const reversed = str11Digits.split('').reverse().map(Number);
    for (let i = 0; i < reversed.length; i++) {
        c = verhoeffD[c][verhoeffP[(i + 1) % 8][reversed[i]]];
    }
    return verhoeffInv[c];
}

export function validateVerhoeff(str: string): boolean {
    let c = 0;
    const reversed = str.split('').reverse().map(Number);
    for (let i = 0; i < reversed.length; i++) {
        c = verhoeffD[c][verhoeffP[i % 8][reversed[i]]];
    }
    return c === 0;
}

/**
 * Validates a 12-digit Indian Aadhaar number using the official Verhoeff algorithm
 * and outputs a secure UIDAI-compliant masked representation (XXXX-XXXX-1234).
 */
export function validateAadhaar(aadhaar: string): AadhaarValidationResult {
    const cleanDigits = aadhaar.replace(/[^0-9]/g, '');

    if (cleanDigits.length !== 12) {
        return {
            isValid: false,
            rawDigits: cleanDigits,
            maskedAadhaar: cleanDigits.length >= 4 ? `XXXX-XXXX-${cleanDigits.slice(-4)}` : '',
            error: 'Aadhaar must be exactly 12 digits.'
        };
    }

    // Aadhaar cannot start with 0 or 1
    if (cleanDigits.startsWith('0') || cleanDigits.startsWith('1')) {
        return {
            isValid: false,
            rawDigits: cleanDigits,
            maskedAadhaar: `XXXX-XXXX-${cleanDigits.slice(-4)}`,
            error: 'Aadhaar cannot start with 0 or 1.'
        };
    }

    // Check Verhoeff checksum
    const isChecksumValid = validateVerhoeff(cleanDigits);
    const last4 = cleanDigits.slice(8);
    const maskedAadhaar = `XXXX-XXXX-${last4}`;

    if (!isChecksumValid) {
        return {
            isValid: false,
            rawDigits: cleanDigits,
            maskedAadhaar,
            error: 'Invalid Aadhaar checksum (Verhoeff validation failed).'
        };
    }

    return {
        isValid: true,
        rawDigits: cleanDigits,
        maskedAadhaar
    };
}

/**
 * Validates 15-character Indian GSTIN.
 */
export function validateGstin(gstin: string): GstinValidationResult {
    const clean = gstin.trim().toUpperCase().replace(/\s+/g, '');
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

    if (!gstinRegex.test(clean)) {
        return {
            isValid: false,
            gstin: clean,
            stateCode: '',
            embeddedPan: '',
            error: 'Invalid GSTIN format (15 characters).'
        };
    }

    const stateCode = clean.slice(0, 2);
    const embeddedPan = clean.slice(2, 12);

    return {
        isValid: true,
        gstin: clean,
        stateCode,
        embeddedPan
    };
}
