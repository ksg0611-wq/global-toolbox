import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, image, url }) => {
  const defaultTitle = "Global ToolBox | 24+ Essential Web Utilities";
  const defaultDesc = "Instant access to professional web utilities with 24+ tools and a curated AI prompt library.";
  const defaultImage = "https://global-toolbox.com/assets/og-default.png"; 
  const defaultUrl = "https://global-toolbox.com";

  const displayTitle = title ? `${title} | Global ToolBox` : defaultTitle;
  const fullDesc = description || defaultDesc;
  const ogImageUrl = image || defaultImage;
  const fullUrl = url ? `${defaultUrl}${url}` : defaultUrl;

  return (
    <Helmet>
      {/* Primary HTML Meta Tags */}
      <title>{displayTitle}</title>
      <meta name="description" content={fullDesc} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={displayTitle} />
      <meta property="og:description" content={fullDesc} />
      <meta property="og:image" content={ogImageUrl} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={displayTitle} />
      <meta name="twitter:description" content={fullDesc} />
      <meta name="twitter:image" content={ogImageUrl} />
    </Helmet>
  );
};

export default SEO;
