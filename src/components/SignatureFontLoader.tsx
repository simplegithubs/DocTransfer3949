import { useEffect } from 'react';

/**
 * Lazy-loads the 20 Google Fonts signature families.
 * 
 * These fonts were previously loaded globally in index.html, adding 1MB+ to every page load.
 * Now they are only loaded when this component mounts (e.g., on the e-signature canvas pages).
 * 
 * Usage: Place <SignatureFontLoader /> inside any component/page that needs signature fonts.
 */
const SIGNATURE_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Allura&family=Cookie&family=Covered+By+Your+Grace&family=Dancing+Script&family=Gloria+Hallelujah&family=Great+Vibes&family=Homemade+Apple&family=Indie+Flower&family=La+Belle+Aurore&family=Meddon&family=Mr+Dafoe&family=Nothing+You+Could+Do&family=Parisienne&family=Pinyon+Script&family=Reenie+Beanie&family=Sacramento&family=Satisfy&family=Shadows+Into+Light&family=Tangerine&family=Zeyada&display=swap';

const SignatureFontLoader: React.FC = () => {
  useEffect(() => {
    // Check if already loaded to avoid duplicate stylesheets
    const existingLink = document.querySelector(`link[href="${SIGNATURE_FONTS_URL}"]`);
    if (existingLink) return;

    // Add preconnect hints
    const preconnect1 = document.createElement('link');
    preconnect1.rel = 'preconnect';
    preconnect1.href = 'https://fonts.googleapis.com';
    document.head.appendChild(preconnect1);

    const preconnect2 = document.createElement('link');
    preconnect2.rel = 'preconnect';
    preconnect2.href = 'https://fonts.gstatic.com';
    preconnect2.crossOrigin = 'anonymous';
    document.head.appendChild(preconnect2);

    // Load the font stylesheet
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = SIGNATURE_FONTS_URL;
    document.head.appendChild(link);

    return () => {
      // Cleanup on unmount (optional — fonts stay cached once loaded)
      // We intentionally don't remove them since they're cached by the browser
    };
  }, []);

  return null;
};

export default SignatureFontLoader;
