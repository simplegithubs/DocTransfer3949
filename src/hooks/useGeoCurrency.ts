import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export type GeoCurrencyCode = 'USD' | 'INR' | 'AED' | 'EUR' | 'GBP';

interface GeoCurrencyState {
    country: string;
    currency: GeoCurrencyCode;
    isUSVisitor: boolean;
    showCurrencySwitcher: boolean;
    isLoading: boolean;
}

const US_TIMEZONES = [
    'America/New_York',
    'America/Detroit',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'America/Phoenix',
    'America/Anchorage',
    'America/Boise',
    'America/Juneau',
    'America/Sitka',
    'America/Yakutat',
    'America/Nome',
    'America/Adak',
    'America/Menominee',
    'Pacific/Honolulu'
];

function isUSTimezone(tz: string): boolean {
    if (!tz) return false;
    if (US_TIMEZONES.includes(tz)) return true;
    if (tz.startsWith('America/Indiana/') || tz.startsWith('America/Kentucky/') || tz.startsWith('America/North_Dakota/')) {
        return true;
    }
    return false;
}

const EU_COUNTRIES = [
    'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'IE', 'PT', 'FI',
    'GR', 'LU', 'CY', 'MT', 'SK', 'SI', 'EE', 'LV', 'LT'
];

function detectInitialGeo(): { country: string; currency: GeoCurrencyCode; isUS: boolean } {
    try {
        // 1. Check URL parameters first (allows manual testing e.g. ?country=US or ?geo=US)
        if (typeof window !== 'undefined' && window.location) {
            const urlParams = new URLSearchParams(window.location.search);
            const overrideCountry = (urlParams.get('country') || urlParams.get('geo') || urlParams.get('preview'))?.toUpperCase();
            const overrideCurrency = urlParams.get('currency')?.toUpperCase() as GeoCurrencyCode | undefined;

            if (overrideCountry === 'US' || overrideCountry === 'USA' || overrideCurrency === 'USD') {
                return { country: 'US', currency: 'USD', isUS: true };
            }
            if (overrideCountry === 'IN' || overrideCurrency === 'INR') {
                return { country: 'IN', currency: 'INR', isUS: false };
            }
            if (overrideCountry === 'AE' || overrideCountry === 'UAE' || overrideCurrency === 'AED') {
                return { country: 'AE', currency: 'AED', isUS: false };
            }
            if (overrideCountry === 'GB' || overrideCountry === 'UK' || overrideCurrency === 'GBP') {
                return { country: 'GB', currency: 'GBP', isUS: false };
            }
            if (EU_COUNTRIES.includes(overrideCountry || '') || overrideCurrency === 'EUR') {
                return { country: overrideCountry || 'DE', currency: 'EUR', isUS: false };
            }
        }

        // 2. Check SessionStorage cache
        if (typeof window !== 'undefined' && window.sessionStorage) {
            const cachedCountry = sessionStorage.getItem('dt_geo_country');
            if (cachedCountry) {
                const isUS = cachedCountry === 'US';
                const currency: GeoCurrencyCode = isUS
                    ? 'USD'
                    : (cachedCountry === 'IN' ? 'INR' : (cachedCountry === 'AE' ? 'AED' : (cachedCountry === 'GB' ? 'GBP' : (EU_COUNTRIES.includes(cachedCountry) ? 'EUR' : 'USD'))));
                return { country: cachedCountry, currency, isUS };
            }
        }

        // 3. Fast Client-Side Heuristics (0ms, zero latency, zero layout shift)
        if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';

            if (isUSTimezone(tz)) {
                return { country: 'US', currency: 'USD', isUS: true };
            }
            if (tz === 'Asia/Kolkata' || tz === 'Asia/Calcutta') {
                return { country: 'IN', currency: 'INR', isUS: false };
            }
            if (tz === 'Asia/Dubai' || tz === 'Asia/Muscat') {
                return { country: 'AE', currency: 'AED', isUS: false };
            }
            if (tz === 'Europe/London') {
                return { country: 'GB', currency: 'GBP', isUS: false };
            }
            if (tz.startsWith('Europe/')) {
                return { country: 'DE', currency: 'EUR', isUS: false };
            }
            // Check US browser locale fallback
            if (navigator && navigator.language === 'en-US' && tz.startsWith('America/')) {
                return { country: 'US', currency: 'USD', isUS: true };
            }
        }
    } catch (e) {
        console.warn('Geo-currency initial heuristic notice:', e);
    }

    // Default global fallback
    return { country: 'GLOBAL', currency: 'USD', isUS: false };
}

export function useGeoCurrency() {
    const [searchParams] = useSearchParams();
    const initial = detectInitialGeo();

    const [country, setCountry] = useState<string>(initial.country);
    const [currency, setCurrency] = useState<GeoCurrencyCode>(initial.currency);
    const [isUSVisitor, setIsUSVisitor] = useState<boolean>(initial.isUS);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        // Check if explicit URL override exists
        const urlOverride = searchParams.get('country') || searchParams.get('geo') || searchParams.get('preview');
        const urlCurrency = searchParams.get('currency')?.toUpperCase() as GeoCurrencyCode | undefined;

        if (urlOverride || urlCurrency) {
            const forcedCountry = (urlOverride || '').toUpperCase();
            if (forcedCountry === 'US' || forcedCountry === 'USA' || urlCurrency === 'USD') {
                setCountry('US');
                setCurrency('USD');
                setIsUSVisitor(true);
                return;
            }
            if (forcedCountry === 'IN' || urlCurrency === 'INR') {
                setCountry('IN');
                setCurrency('INR');
                setIsUSVisitor(false);
                return;
            }
            if (forcedCountry === 'AE' || urlCurrency === 'AED') {
                setCountry('AE');
                setCurrency('AED');
                setIsUSVisitor(false);
                return;
            }
            if (forcedCountry === 'GB' || urlCurrency === 'GBP') {
                setCountry('GB');
                setCurrency('GBP');
                setIsUSVisitor(false);
                return;
            }
            if (EU_COUNTRIES.includes(forcedCountry) || urlCurrency === 'EUR') {
                setCountry(forcedCountry || 'DE');
                setCurrency('EUR');
                setIsUSVisitor(false);
                return;
            }
        }

        // If already cached or confirmed as US, no need to make network request
        if (sessionStorage.getItem('dt_geo_country')) {
            return;
        }

        // Background IP lookup for precision verification
        let isCancelled = false;
        const verifyCountryViaIp = async () => {
            try {
                setIsLoading(true);
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 2500); // 2.5s maximum timeout

                const res = await fetch('https://api.country.is/', {
                    signal: controller.signal
                });
                clearTimeout(timeoutId);

                if (!res.ok) return;
                const data = await res.json();
                const detected = (data?.country || '').toUpperCase();

                if (!isCancelled && detected) {
                    sessionStorage.setItem('dt_geo_country', detected);
                    setCountry(detected);

                    if (detected === 'US') {
                        setIsUSVisitor(true);
                        setCurrency('USD');
                    } else if (detected === 'IN') {
                        setIsUSVisitor(false);
                        setCurrency('INR');
                    } else if (detected === 'AE') {
                        setIsUSVisitor(false);
                        setCurrency('AED');
                    } else if (detected === 'GB') {
                        setIsUSVisitor(false);
                        setCurrency('GBP');
                    } else if (EU_COUNTRIES.includes(detected)) {
                        setIsUSVisitor(false);
                        setCurrency('EUR');
                    } else {
                        setIsUSVisitor(false);
                        setCurrency('USD');
                    }
                }
            } catch (err) {
                // Heuristic already applied seamlessly, fail silently
            } finally {
                if (!isCancelled) {
                    setIsLoading(false);
                }
            }
        };

        verifyCountryViaIp();

        return () => {
            isCancelled = true;
        };
    }, [searchParams]);

    // If the visitor is in the US, strictly DO NOT show the currency switcher.
    // They only see USD ($).
    const showCurrencySwitcher = !isUSVisitor;

    return {
        country,
        currency,
        setCurrency,
        isUSVisitor,
        showCurrencySwitcher,
        isLoading
    };
}

