/**
 * Test Suite: Mobile Number Gate (+91 OTP) — Phone Locking Feature
 * 
 * Tests the complete flow:
 * 1. Open OTP Gate (any valid 10-digit number proceeds)
 * 2. Designated OTP Gate (only matching number proceeds, mismatched blocked)
 * 3. OTP validation and document unlock
 * 
 * Run: node scripts/test-phone-otp-gate.js
 */

const PASS = '\x1b[32m✓ PASS\x1b[0m';
const FAIL = '\x1b[31m✗ FAIL\x1b[0m';
let passed = 0;
let failed = 0;

function assert(condition, testName) {
    if (condition) {
        console.log(`  ${PASS}  ${testName}`);
        passed++;
    } else {
        console.log(`  ${FAIL}  ${testName}`);
        failed++;
    }
}

// ===== Simulate the phone validation logic from ViewDocument.tsx =====

function isValidIndianPhone(phone) {
    const cleanDigits = phone.replace(/[^0-9]/g, '');
    return cleanDigits.length >= 10;
}

function checkPhoneAccess(enteredPhone, allowedPhone) {
    const cleanDigits = enteredPhone.replace(/[^0-9]/g, '');
    if (cleanDigits.length < 10) {
        return { allowed: false, reason: 'invalid_phone' };
    }

    const validDigits = cleanDigits.slice(-10);

    // Check if document is locked to a specific phone number
    if (allowedPhone) {
        const allowedDigits = allowedPhone.replace(/[^0-9]/g, '').slice(-10);
        if (validDigits !== allowedDigits) {
            const masked = allowedDigits.slice(-4).padStart(10, '*');
            return {
                allowed: false,
                reason: 'access_denied',
                message: `Access Denied: This confidential document is locked specifically for mobile number ending in ...${masked.slice(-4)}. Please contact the sender for access.`
            };
        }
    }

    return { allowed: true, reason: 'proceed_to_otp' };
}

function verifyOtp(enteredOtp, sentOtp) {
    return enteredOtp.trim() === sentOtp;
}

function buildUploadPayload(requirePhoneOtp, allowedPhone) {
    return {
        require_phone_otp: requirePhoneOtp,
        allowed_phone: requirePhoneOtp && allowedPhone && allowedPhone.trim() ? allowedPhone.trim() : null,
    };
}

// ======================================================================
// TEST GROUP 1: Upload Payload Construction (Dashboard Side)
// ======================================================================
console.log('\n\x1b[36m━━━ Test Group 1: Upload Payload (Dashboard) ━━━\x1b[0m');

(() => {
    const payload = buildUploadPayload(true, '9876543210');
    assert(payload.require_phone_otp === true, 'Phone OTP enabled in payload');
    assert(payload.allowed_phone === '9876543210', 'Allowed phone is stored');
})();

(() => {
    const payload = buildUploadPayload(true, '');
    assert(payload.require_phone_otp === true, 'Phone OTP enabled for open gate');
    assert(payload.allowed_phone === null, 'Allowed phone is NULL for open gate');
})();

(() => {
    const payload = buildUploadPayload(true, '   ');
    assert(payload.allowed_phone === null, 'Whitespace-only phone is treated as NULL');
})();

(() => {
    const payload = buildUploadPayload(false, '9876543210');
    assert(payload.require_phone_otp === false, 'Phone OTP disabled');
    assert(payload.allowed_phone === null, 'Allowed phone is NULL when OTP is disabled');
})();

// ======================================================================
// TEST GROUP 2: Open OTP Gate (No Designated Phone)
// ======================================================================
console.log('\n\x1b[36m━━━ Test Group 2: Open OTP Gate (Any Visitor) ━━━\x1b[0m');

(() => {
    const result = checkPhoneAccess('9876543210', null);
    assert(result.allowed === true, 'Valid 10-digit number proceeds (no restriction)');
})();

(() => {
    const result = checkPhoneAccess('8765432109', null);
    assert(result.allowed === true, 'Any valid number proceeds in open gate');
})();

(() => {
    const result = checkPhoneAccess('6000000001', null);
    assert(result.allowed === true, '6xxx numbers are valid');
})();

(() => {
    const result = checkPhoneAccess('12345', null);
    assert(result.allowed === false, 'Short number rejected');
    assert(result.reason === 'invalid_phone', 'Rejection reason is invalid_phone');
})();

(() => {
    const result = checkPhoneAccess('', null);
    assert(result.allowed === false, 'Empty number rejected');
})();

// ======================================================================
// TEST GROUP 3: Designated OTP Gate (Locked to Specific Number)
// ======================================================================
console.log('\n\x1b[36m━━━ Test Group 3: Designated OTP Gate (Specific Phone Lock) ━━━\x1b[0m');

(() => {
    const result = checkPhoneAccess('9876543210', '9876543210');
    assert(result.allowed === true, 'Matching number is allowed');
})();

(() => {
    const result = checkPhoneAccess('1234567890', '9876543210');
    assert(result.allowed === false, 'Mismatched number is blocked');
    assert(result.reason === 'access_denied', 'Rejection reason is access_denied');
    assert(result.message.includes('3210'), 'Error message shows last 4 digits of allowed number');
})();

(() => {
    const result = checkPhoneAccess('9876543211', '9876543210');
    assert(result.allowed === false, 'Off-by-one number is blocked');
})();

(() => {
    // Test with +91 prefix in allowed_phone
    const result = checkPhoneAccess('9876543210', '+919876543210');
    assert(result.allowed === true, 'Works even if allowed_phone has +91 prefix');
})();

(() => {
    // Test with +91 prefix in entered phone
    const result = checkPhoneAccess('+919876543210', '9876543210');
    assert(result.allowed === true, 'Works even if entered phone has +91 prefix');
})();

(() => {
    // Both have +91 prefix
    const result = checkPhoneAccess('+919876543210', '+919876543210');
    assert(result.allowed === true, 'Works when both have +91 prefix');
})();

// ======================================================================
// TEST GROUP 4: OTP Verification
// ======================================================================
console.log('\n\x1b[36m━━━ Test Group 4: OTP Verification ━━━\x1b[0m');

(() => {
    assert(verifyOtp('123456', '123456') === true, 'Correct OTP passes');
})();

(() => {
    assert(verifyOtp('000000', '123456') === false, 'Wrong OTP fails');
})();

(() => {
    assert(verifyOtp(' 123456 ', '123456') === true, 'OTP with whitespace trimmed');
})();

(() => {
    assert(verifyOtp('12345', '123456') === false, 'Incomplete OTP fails');
})();

// ======================================================================
// TEST GROUP 5: Input Sanitization
// ======================================================================
console.log('\n\x1b[36m━━━ Test Group 5: Input Sanitization ━━━\x1b[0m');

(() => {
    const sanitized = '98-765-432-10'.replace(/[^0-9]/g, '');
    assert(sanitized === '9876543210', 'Dashes are stripped');
})();

(() => {
    const sanitized = '(987) 654 3210'.replace(/[^0-9]/g, '');
    assert(sanitized === '9876543210', 'Parentheses and spaces are stripped');
})();

(() => {
    const sanitized = '+91 98765 43210'.replace(/[^0-9]/g, '');
    const last10 = sanitized.slice(-10);
    assert(last10 === '9876543210', '+91 prefix is handled by slicing last 10');
})();

// ======================================================================
// SUMMARY
// ======================================================================
console.log('\n\x1b[36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m');
console.log(`  Total: ${passed + failed} | \x1b[32mPassed: ${passed}\x1b[0m | \x1b[31mFailed: ${failed}\x1b[0m`);
console.log('\x1b[36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n');

if (failed > 0) {
    process.exit(1);
}
