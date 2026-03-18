import { useEffect } from 'react';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: 'website' | 'article' | 'product';
    schema?: object;
}

/**
 * SEO Component - Updates page meta tags dynamically
 * Primary SEO is defined in index.html with structured data (JSON-LD)
 * This component handles page-specific overrides and dynamic structured data
 */
const SEO: React.FC<SEOProps> = ({
    title = 'Secure Document Sharing with E2E Encryption & Analytics',
    description = 'Share documents securely with end-to-end encryption, dynamic watermarking, real-time analytics & e-signatures. Free DocSend alternative.',
    keywords = 'secure document sharing, document analytics, DocSend alternative, end-to-end encryption',
    image = 'https://doctransfer.io/og-image.png',
    url = 'https://doctransfer.io',
    schema,
}) => {
    const fullTitle = title.includes('DocTransfer') ? title : `${title} | DocTransfer`;

    useEffect(() => {
        // Update document title
        document.title = fullTitle;

        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', description);
        }

        // Update meta keywords
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords) {
            metaKeywords.setAttribute('content', keywords);
        }

        // Update Open Graph tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', fullTitle);

        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription) ogDescription.setAttribute('content', description);

        const ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage) ogImage.setAttribute('content', image);

        const ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) ogUrl.setAttribute('content', url);

        // Update Canonical URL
        let canonicalLink = document.querySelector('link[rel="canonical"]');
        if (!canonicalLink) {
            canonicalLink = document.createElement('link');
            canonicalLink.setAttribute('rel', 'canonical');
            document.head.appendChild(canonicalLink);
        }
        canonicalLink.setAttribute('href', url);

        // Update Twitter tags
        const twitterTitle = document.querySelector('meta[name="twitter:title"]');
        if (twitterTitle) twitterTitle.setAttribute('content', fullTitle);

        const twitterDescription = document.querySelector('meta[name="twitter:description"]');
        if (twitterDescription) twitterDescription.setAttribute('content', description);

        const twitterImage = document.querySelector('meta[name="twitter:image"]');
        if (twitterImage) twitterImage.setAttribute('content', image);

        // Update / Add Schema Script
        if (schema) {
            let schemaScript = document.getElementById('page-schema');
            if (!schemaScript) {
                schemaScript = document.createElement('script');
                schemaScript.id = 'page-schema';
                schemaScript.setAttribute('type', 'application/ld+json');
                document.head.appendChild(schemaScript);
            }
            schemaScript.textContent = JSON.stringify(schema);
        } else {
            const existingSchema = document.getElementById('page-schema');
            if (existingSchema) existingSchema.remove();
        }

    }, [fullTitle, description, keywords, image, url, schema]);

    return null; // This component doesn't render anything
};

export default SEO;
