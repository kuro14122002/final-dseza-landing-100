import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage, getLocalizedUrl } from '@/context/LanguageContext';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'article' | 'event' | 'organization';
  author?: string;
  publishDate?: string;
  modifiedDate?: string;
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
  alternateLanguages?: boolean;
  // Event specific props
  eventStartDate?: string;
  eventEndDate?: string;
  eventLocation?: string;
  eventPrice?: string;
  eventPriceRange?: string;
  eventStatus?: 'scheduled' | 'cancelled' | 'postponed' | 'rescheduled';
  // Article specific props
  articleSection?: string;
  tags?: string[];
  // Organization specific props
  organizationName?: string;
  organizationUrl?: string;
  organizationLogo?: string;
  organizationAddress?: string;
  organizationPhone?: string;
  organizationEmail?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  image,
  type = 'website',
  author,
  publishDate,
  modifiedDate,
  canonical,
  noindex = false,
  nofollow = false,
  alternateLanguages = true,
  eventStartDate,
  eventEndDate,
  eventLocation,
  eventPrice,
  eventPriceRange,
  eventStatus = 'scheduled',
  articleSection,
  tags = [],
  organizationName,
  organizationUrl,
  organizationLogo,
  organizationAddress,
  organizationPhone,
  organizationEmail,
}) => {
  const { language } = useLanguage();
  const location = useLocation();
  
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://dseza.danang.gov.vn';
  const siteName = language === 'vi' ? 'DSEZA - Ban Quản lý Khu công nghệ cao và các Khu công nghiệp Đà Nẵng' : 'DSEZA - Da Nang Hi-Tech Park and Industrial Zones Authority';
  
  // Default values based on language
  const defaultTitle = language === 'vi' 
    ? 'DSEZA - Ban Quản lý Khu công nghệ cao và các Khu công nghiệp Đà Nẵng'
    : 'DSEZA - Da Nang Hi-Tech Park and Industrial Zones Authority';
    
  const defaultDescription = language === 'vi'
    ? 'Cổng thông tin điện tử của Ban Quản lý Khu công nghệ cao và các Khu công nghiệp Đà Nẵng. Thông tin đầu tư, chính sách ưu đãi, thủ tục hành chính và tin tức mới nhất.'
    : 'Official website of Da Nang Hi-Tech Park and Industrial Zones Authority. Investment information, incentive policies, administrative procedures and latest news.';
  
  const defaultKeywords = language === 'vi'
    ? 'DSEZA, Đà Nẵng, khu công nghệ cao, khu công nghiệp, đầu tư, chính sách ưu đãi, thủ tục hành chính'
    : 'DSEZA, Da Nang, hi-tech park, industrial zones, investment, incentive policies, administrative procedures';

  const finalTitle = title ? `${title} - ${siteName}` : defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalKeywords = keywords || defaultKeywords;
  const finalImage = image || `${siteUrl}/media/lightlogo3.png`;
  const currentUrl = `${siteUrl}${location.pathname}`;
  const canonicalUrl = canonical || currentUrl;

  // Generate alternate language URLs
  const alternateUrls = alternateLanguages ? {
    vi: `${siteUrl}${getLocalizedUrl(location.pathname, 'vi')}`,
    en: `${siteUrl}${getLocalizedUrl(location.pathname, 'en')}`,
  } : {};

  // Generate structured data based on type
  const generateStructuredData = () => {
    const baseData = {
      "@context": "https://schema.org",
      "name": finalTitle,
      "description": finalDescription,
      "url": currentUrl,
      "image": finalImage,
      "inLanguage": language === 'vi' ? 'vi-VN' : 'en-US',
    };

    const organizationData = {
      "@type": "Organization",
      "name": organizationName || siteName,
      "url": organizationUrl || siteUrl,
      "logo": {
        "@type": "ImageObject",
        "url": organizationLogo || `${siteUrl}/media/lightlogo3.png`
      },
      ...(organizationAddress && { "address": organizationAddress }),
      ...(organizationPhone && { "telephone": organizationPhone }),
      ...(organizationEmail && { "email": organizationEmail }),
    };

    switch (type) {
      case 'article':
        return {
          ...baseData,
          "@type": "Article",
          "headline": title,
          "author": {
            "@type": "Person",
            "name": author || "DSEZA"
          },
          "publisher": organizationData,
          "datePublished": publishDate,
          "dateModified": modifiedDate || publishDate,
          ...(articleSection && { "articleSection": articleSection }),
          ...(tags.length > 0 && { "keywords": tags.join(', ') }),
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": currentUrl
          }
        };

      case 'event':
        return {
          ...baseData,
          "@type": "Event",
          "name": title,
          "startDate": eventStartDate,
          "endDate": eventEndDate,
          "eventStatus": `https://schema.org/Event${eventStatus.charAt(0).toUpperCase() + eventStatus.slice(1)}`,
          "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
          "location": eventLocation ? {
            "@type": "Place",
            "name": eventLocation,
            "address": eventLocation
          } : undefined,
          "organizer": organizationData,
          ...(eventPrice && {
            "offers": {
              "@type": "Offer",
              "price": eventPrice,
              "priceCurrency": "VND",
              "availability": "https://schema.org/InStock"
            }
          }),
          ...(eventPriceRange && {
            "offers": {
              "@type": "AggregateOffer",
              "lowPrice": eventPriceRange.split('-')[0],
              "highPrice": eventPriceRange.split('-')[1],
              "priceCurrency": "VND"
            }
          })
        };

      case 'organization':
        return {
          ...baseData,
          ...organizationData,
          "foundingDate": "2008",
          "foundingLocation": {
            "@type": "Place",
            "name": "Đà Nẵng, Việt Nam"
          },
          "areaServed": {
            "@type": "Place",
            "name": "Đà Nẵng"
          },
          "knowsAbout": [
            "High-tech park management",
            "Industrial zone development",
            "Investment promotion",
            "Business support services"
          ]
        };

      default:
        return {
          ...baseData,
          "@type": "WebSite",
          "publisher": organizationData,
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${siteUrl}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string"
          }
        };
    }
  };

  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="language" content={language === 'vi' ? 'vi-VN' : 'en-US'} />
      
      {/* Robots meta tags */}
      {(noindex || nofollow) && (
        <meta name="robots" content={`${noindex ? 'noindex' : 'index'},${nofollow ? 'nofollow' : 'follow'}`} />
      )}
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Alternate language URLs */}
      {alternateLanguages && (
        <>
          <link rel="alternate" hrefLang="vi" href={alternateUrls.vi} />
          <link rel="alternate" hrefLang="en" href={alternateUrls.en} />
          <link rel="alternate" hrefLang="x-default" href={alternateUrls.vi} />
        </>
      )}
      
      {/* Open Graph meta tags */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:type" content={type === 'event' ? 'article' : type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:image:alt" content={finalTitle} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={language === 'vi' ? 'vi_VN' : 'en_US'} />
      
      {/* Twitter Card meta tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />
      <meta name="twitter:image:alt" content={finalTitle} />
      
      {/* Article specific meta tags */}
      {type === 'article' && (
        <>
          {author && <meta name="author" content={author} />}
          {publishDate && <meta property="article:published_time" content={publishDate} />}
          {modifiedDate && <meta property="article:modified_time" content={modifiedDate} />}
          {author && <meta property="article:author" content={author} />}
          {articleSection && <meta property="article:section" content={articleSection} />}
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Event specific meta tags */}
      {type === 'event' && (
        <>
          {eventStartDate && <meta property="event:start_time" content={eventStartDate} />}
          {eventEndDate && <meta property="event:end_time" content={eventEndDate} />}
          {eventLocation && <meta property="event:location" content={eventLocation} />}
        </>
      )}
      
      {/* Additional meta tags for Vietnamese content */}
      {language === 'vi' && (
        <>
          <meta name="geo.region" content="VN-DN" />
          <meta name="geo.placename" content="Đà Nẵng" />
          <meta name="geo.position" content="16.0544;108.2022" />
          <meta name="ICBM" content="16.0544, 108.2022" />
        </>
      )}
      
      {/* JSON-LD structured data */}
      <script type="application/ld+json">
        {JSON.stringify(generateStructuredData())}
      </script>
    </Helmet>
  );
};

export default SEOHead; 