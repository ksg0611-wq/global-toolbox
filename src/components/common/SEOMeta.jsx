import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SEOMeta Component
 * 
 * 📌 Reusable component to dynamically inject SEO Meta Tags
 * in accordance with react-helmet-async standard guidelines.
 */
export default function SEOMeta({
  title = '',
  description = '',
  url = '',
  imageUrl = ''
}) {
  const defaultTitle = 'Global ToolBox - Professional Web Utilities for Creators & Developers';
  const displayTitle = title ? `${title} | Global ToolBox` : defaultTitle;
  const fullUrl = url ? (url.startsWith('http') ? url : `https://global-toolbox.com${url}`) : 'https://global-toolbox.com';
  const ogImageUrl = imageUrl || 'https://global-toolbox.com/assets/og-default.png';

  return (
    <Helmet>
      {/* Primary HTML Meta Tags */}
      <title>{displayTitle}</title>
      {description && <meta name="description" content={description} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={displayTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:image" content={ogImageUrl} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={displayTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={ogImageUrl} />
    </Helmet>
  );
}
