/**
 * SEO Helpers for DocTransfer
 */

export const BASE_URL = 'https://doctransfer.io';

export interface BlogPostSchema {
    title: string;
    description: string;
    publishDate: string;
    author: string;
    image?: string;
    url: string;
}

export const generateBlogSchema = (data: BlogPostSchema) => {
    return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": data.title,
        "description": data.description,
        "author": {
            "@type": "Organization",
            "name": data.author
        },
        "publisher": {
            "@type": "Organization",
            "name": "DocTransfer",
            "logo": {
                "@type": "ImageObject",
                "url": `${BASE_URL}/logo.png`
            }
        },
        "datePublished": data.publishDate,
        "image": data.image || `${BASE_URL}/og-image.png`,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": data.url
        }
    };
};

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
