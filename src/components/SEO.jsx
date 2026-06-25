import { useEffect } from 'react';

const SEO = ({ title, description, image, url }) => {
  const defaultTitle = "Global ToolBox | 21+ Essential Web Utilities";
  const defaultDesc = "Free, blazing fast, and ad-free web utility platform with 21+ tools and a curated AI prompt library.";
  const defaultImage = "https://global-toolbox.com/assets/og-default.png"; 
  const defaultUrl = "https://global-toolbox.com";

  useEffect(() => {
    document.title = title ? `${title} | Global ToolBox` : defaultTitle;

    const updateMetaTag = (property, content, isName = false) => {
      const attribute = isName ? 'name' : 'property';
      let element = document.querySelector(`meta[${attribute}="${property}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, property);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    updateMetaTag('description', description || defaultDesc, true);
    updateMetaTag('og:title', title ? `${title} | Global ToolBox` : defaultTitle);
    updateMetaTag('og:description', description || defaultDesc);
    updateMetaTag('og:image', image || defaultImage);
    updateMetaTag('og:url', url ? `${defaultUrl}${url}` : defaultUrl);
    updateMetaTag('og:type', 'website');

    updateMetaTag('twitter:card', 'summary_large_image', true);
    updateMetaTag('twitter:title', title ? `${title} | Global ToolBox` : defaultTitle, true);
    updateMetaTag('twitter:description', description || defaultDesc, true);
    updateMetaTag('twitter:image', image || defaultImage, true);
  }, [title, description, image, url]);

  return null;
};

export default SEO;
