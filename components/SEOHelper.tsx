
import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  creatorName?: string;
}

export const SEOHelper: React.FC<SEOProps> = ({ 
  title, 
  description, 
  image = 'https://bakšis.net/og-default.png', 
  url = 'https://bakšis.net',
  creatorName 
}) => {
  useEffect(() => {
    document.title = `${title} | bakšis.net`;
    
    const metaTags = [
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:url', content: url },
      { name: 'twitter:card', content: 'summary_large_image' },
    ];

    metaTags.forEach(tag => {
      const key = tag.name ? `name="${tag.name}"` : `property="${tag.property}"`;
      let element = document.querySelector(`meta[${key}]`);
      if (!element) {
        element = document.createElement('meta');
        if (tag.name) element.setAttribute('name', tag.name);
        if (tag.property) element.setAttribute('property', tag.property);
        document.head.appendChild(element);
      }
      element.setAttribute('content', tag.content);
    });

    // JSON-LD for SEO Engine
    const structuredData = {
      "@context": "https://schema.org",
      "@type": creatorName ? "Person" : "Organization",
      "name": creatorName || "bakšis.net",
      "description": description,
      "url": url,
      "logo": "https://bakšis.net/logo.png",
      ...(creatorName && {
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": url
        }
      })
    };

    // Fix: Cast the element found via querySelector to HTMLScriptElement to fix the TypeScript error on the 'type' property.
    let script = document.querySelector('#json-ld') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = 'json-ld';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);

  }, [title, description, image, url, creatorName]);

  return null;
};
