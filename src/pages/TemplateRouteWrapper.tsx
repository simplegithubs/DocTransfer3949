import React from 'react';
import { useParams } from 'react-router-dom';
import PublicTemplateSEO from './PublicTemplateSEO';
import PublicTemplateDetail from './PublicTemplateDetail';
import { templateSeoData } from '../data/templateSeoData';

const TemplateRouteWrapper: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  // If no slug param is present (which shouldn't happen with the route config),
  // fall through to PublicTemplateDetail to handle its own loading/fallback state.
  if (!slug) {
    return <PublicTemplateDetail />;
  }

  // Check if it is one of the rich dynamic template pages
  if (slug in templateSeoData) {
    return <PublicTemplateSEO />;
  }

  // If it's not a custom programmatic SEO page, render the original dynamic template page
  return <PublicTemplateDetail />;
};

export default TemplateRouteWrapper;

