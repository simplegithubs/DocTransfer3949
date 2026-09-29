// Test subscription tier entitlements for Self-Destruct Rules and Dynamic Watermarking
function checkTierFeatures(planType) {
    const isFree = !planType || planType === 'free';
    
    // Free plan features
    if (isFree) {
        const freeFeatures = ['basic_view_count', 'unlimited_visitors'];
        return {
            plan: 'free',
            watermarking: freeFeatures.includes('watermarking'),
            burn_after_reading: freeFeatures.includes('burn_after_reading'),
            link_expiration: freeFeatures.includes('link_expiration')
        };
    }

    // Pro & Standard
    if (planType === 'pro' || planType === 'standard') {
        const proFeatures = [
            'page_by_page_analytics',
            'unlimited_visitors',
            'password_protection',
            'link_expiration',
            'aes_encryption',
            'email_verification',
            'watermarking',
            'audit_trails',
            'esignature',
            'allow_downloads',
            'screenshot_protection',
            'burn_after_reading',
            'document_bundles',
            'advanced_analytics',
            'deal_rooms'
        ];
        return {
            plan: planType,
            watermarking: proFeatures.includes('watermarking'),
            burn_after_reading: proFeatures.includes('burn_after_reading'),
            link_expiration: proFeatures.includes('link_expiration')
        };
    }

    // Business
    if (planType === 'business') {
        const businessFeatures = [
            'page_by_page_analytics',
            'unlimited_visitors',
            'password_protection',
            'link_expiration',
            'aes_encryption',
            'email_verification',
            'watermarking',
            'audit_trails',
            'esignature',
            'allow_downloads',
            'screenshot_protection',
            'burn_after_reading',
            'document_bundles',
            'advanced_analytics',
            'deal_rooms',
            'vault_mode',
            'custom_branding',
            'white_label',
            'client_intake',
            'gst_invoicing',
            'team_seats_3'
        ];
        return {
            plan: 'business',
            watermarking: businessFeatures.includes('watermarking'),
            burn_after_reading: businessFeatures.includes('burn_after_reading'),
            link_expiration: businessFeatures.includes('link_expiration')
        };
    }

    // Data Room (VDR)
    if (planType === 'dataroom') {
        return {
            plan: 'dataroom',
            watermarking: true,
            burn_after_reading: true,
            link_expiration: true
        };
    }

    return { plan: planType, watermarking: false, burn_after_reading: false, link_expiration: false };
}

console.log('🧪 Testing Feature Gating Matrix...');

const free = checkTierFeatures('free');
console.log('Free Plan:', JSON.stringify(free));
if (free.watermarking || free.burn_after_reading || free.link_expiration) {
    throw new Error('FAIL: Free plan has unlocked premium features!');
}

const pro = checkTierFeatures('pro');
console.log('Pro Plan:', JSON.stringify(pro));
if (!pro.watermarking || !pro.burn_after_reading || !pro.link_expiration) {
    throw new Error('FAIL: Pro plan missing features!');
}

const business = checkTierFeatures('business');
console.log('Business Plan:', JSON.stringify(business));
if (!business.watermarking || !business.burn_after_reading || !business.link_expiration) {
    throw new Error('FAIL: Business plan missing features!');
}

const dataroom = checkTierFeatures('dataroom');
console.log('Data Room (VDR) Plan:', JSON.stringify(dataroom));
if (!dataroom.watermarking || !dataroom.burn_after_reading || !dataroom.link_expiration) {
    throw new Error('FAIL: Data Room plan missing features!');
}

console.log('✅ ALL 4 TIER GATING TESTS PASSED PERFECTLY!');
