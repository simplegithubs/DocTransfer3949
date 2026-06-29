import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import SEO from '../components/SEO';
import { getPageBySlug, type SEOCategory, type HowToPageData } from '../data/seoPages';

// Layout Imports
import AlternativeLayout from '../components/seo-layouts/AlternativeLayout';
import ComparisonLayout from '../components/seo-layouts/ComparisonLayout';
import TemplateLayout from '../components/seo-layouts/TemplateLayout';
import HowToLayout from '../components/seo-layouts/HowToLayout';
import IndustryLayout from '../components/seo-layouts/IndustryLayout';
import GenZLayout from '../components/seo-layouts/GenZLayout';

interface SEOCategoryPageProps {
  category: SEOCategory;
}

const SEOCategoryPage: React.FC<SEOCategoryPageProps> = ({ category }) => {
  const { slug } = useParams<{ slug: string }>();

  if (!slug) {
    return <NotFoundMessage category={category} />;
  }

  const pageData = getPageBySlug(category, slug);

  if (!pageData) {
    return <NotFoundMessage category={category} />;
  }

  // Set up dynamic canonical URL and structure
  const url = `https://www.doctransfer.app/${category}/${slug}`;

  // Construct dynamic schema markup (JSON-LD @graph)
  const schemas: Record<string, unknown>[] = [];

  // 1. Article Schema
  schemas.push({
    "@type": "Article",
    "headline": pageData.title,
    "description": pageData.description,
    "image": pageData.imageUrl || 'https://www.doctransfer.app/og-image.png',
    "author": {
      "@type": "Organization",
      "name": "DocTransfer Team",
      "url": "https://www.doctransfer.app"
    },
    "publisher": {
      "@type": "Organization",
      "name": "DocTransfer",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.doctransfer.app/logo.png"
      }
    },
    "datePublished": "2026-06-20",
    "dateModified": "2026-06-20"
  });

  // 2. Product / SoftwareApplication Schema
  if (category === 'alternatives' || category === 'comparisons') {
    schemas.push({
      "@type": "SoftwareApplication",
      "name": "DocTransfer",
      "operatingSystem": "All",
      "applicationCategory": "BusinessApplication",
      "offers": {
        "@type": "Offer",
        "price": "0.00",
        "priceCurrency": "USD"
      }
    });
  }

  // 2.5. BreadcrumbList Schema
  const categoryLabel = {
    'alternatives': 'Alternatives',
    'comparisons': 'Comparisons',
    'templates': 'Templates',
    'how-to': 'How-To Guides',
    'industry': 'Industry',
    'gen-z': 'Gen-Z'
  }[category] || category;

  schemas.push({
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.doctransfer.app"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": categoryLabel,
        "item": `https://www.doctransfer.app/${category}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": pageData.title
      }
    ]
  });

  // 3. FAQPage Schema
  if (pageData.faqs && pageData.faqs.length > 0) {
    schemas.push({
      "@type": "FAQPage",
      "mainEntity": pageData.faqs.map(f => ({
        "@type": "Question",
        "name": f.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.answer
        }
      }))
    });
  }

  // 4. HowTo Schema
  if (category === 'how-to' && (pageData as HowToPageData).steps) {
    const howToData = pageData as HowToPageData;
    schemas.push({
      "@type": "HowTo",
      "name": howToData.howToTitle || pageData.title,
      "description": pageData.description,
      "step": howToData.steps.map((s: { title: string; description: string }) => ({
        "@type": "HowToStep",
        "name": s.title,
        "text": s.description
      }))
    });
  }

  const schemaGraph = {
    "@context": "https://schema.org",
    "@graph": schemas
  };

  // Render correct layout based on category
  const renderLayout = () => {
    switch (pageData.category) {
      case 'alternatives':
        return <AlternativeLayout data={pageData} />;
      case 'comparisons':
        return <ComparisonLayout data={pageData} />;
      case 'templates':
        return <TemplateLayout data={pageData} />;
      case 'how-to':
        return <HowToLayout data={pageData} />;
      case 'industry':
        return <IndustryLayout data={pageData} />;
      case 'gen-z':
        return <GenZLayout data={pageData} />;
      default:
        return <NotFoundMessage category={category} />;
    }
  };

  return (
    <>
      <SEO
        title={pageData.title}
        description={pageData.description}
        keywords={pageData.keywords}
        url={url}
        schema={schemaGraph}
      />
      {/* Brand Header Navbar */}
      <header style={{
        height: '70px',
        background: 'white',
        borderBottom: '1px solid #f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        fontFamily: 'var(--font-family, system-ui, sans-serif)'
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#4f46e5', fontWeight: '800', fontSize: '1.25rem' }}>
          <Sparkles size={22} /> DocTransfer
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link to="/pricing" style={{ textDecoration: 'none', color: '#4b5563', fontWeight: 500, fontSize: '0.95rem' }}>Pricing</Link>
          <Link to="/comparisons" style={{ textDecoration: 'none', color: '#4b5563', fontWeight: 500, fontSize: '0.95rem' }}>Comparisons</Link>
          <Link to="/alternatives" style={{ textDecoration: 'none', color: '#4b5563', fontWeight: 500, fontSize: '0.95rem' }}>Alternatives</Link>
          <Link to="/blog" style={{ textDecoration: 'none', color: '#4b5563', fontWeight: 500, fontSize: '0.95rem' }}>Blog</Link>
          <Link to="/dataroom" style={{
            textDecoration: 'none',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '0.9rem',
            boxShadow: '0 4px 10px rgba(99, 102, 241, 0.2)'
          }}>
            Dashboard
          </Link>
        </div>
      </header>
      {renderLayout()}
    </>
  );
};

const NotFoundMessage: React.FC<{ category: string }> = ({ category }) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8fafc',
        fontFamily: 'var(--font-family, system-ui, sans-serif)',
        color: '#1e293b',
        padding: '2rem',
        textAlign: 'center'
      }}
    >
      <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', marginBottom: '1rem' }}>
        Page Not Found
      </h2>
      <p style={{ color: '#64748b', marginBottom: '2rem', maxWidth: '400px', lineHeight: 1.6 }}>
        The requested {category} page does not exist or has been moved.
      </p>
      <Link
        to="/"
        style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
          color: 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '12px',
          fontWeight: '600',
          textDecoration: 'none',
          boxShadow: '0 4px 10px rgba(99, 102, 241, 0.2)'
        }}
      >
        Return to Home Page
      </Link>
    </div>
  );
};

export default SEOCategoryPage;
