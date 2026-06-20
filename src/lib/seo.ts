/**
 * SEO Helpers for DocTransfer
 */

export const BASE_URL = 'https://doctransfer.app';

export const generateComparisonSchema = (competitor: string, url: string) => {
    return {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": `DocTransfer vs ${competitor}`,
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "description": `Detailed comparison between DocTransfer and ${competitor} for secure document sharing and analytics.`,
        "url": url,
        "publisher": {
            "@type": "Organization",
            "name": "DocTransfer"
        },
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        }
    };
};

export const generateFAQSchema = (items: { question: string; answer: string }[]) => {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": items.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
            }
        }))
    };
};

export const generateHowToSchema = (name: string, description: string, steps: { title: string; description: string }[]) => {
    return {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": name,
        "description": description,
        "step": steps.map((step, i) => ({
            "@type": "HowToStep",
            "position": i + 1,
            "name": step.title,
            "text": step.description
        }))
    };
};

export const generateSoftwareAppSchema = (name: string, description: string, url: string) => {
    return {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": name,
        "description": description,
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "url": url,
        "publisher": {
            "@type": "Organization",
            "name": "DocTransfer"
        },
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "156"
        }
    };
};

export const generateProductSchema = (name: string, description: string, url: string) => {
    return {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": name,
        "description": description,
        "url": url,
        "brand": {
            "@type": "Organization",
            "name": "DocTransfer"
        },
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
        }
    };
};

export const generateWebPageSchema = (title: string, description: string, url: string) => {
    return {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": title,
        "description": description,
        "url": url,
        "publisher": {
            "@type": "Organization",
            "name": "DocTransfer"
        }
    };
};
