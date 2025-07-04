import React from 'react';
import HeroSection from '@/components/hero/HeroSection';
import TopBar from '@/components/hero/TopBar';
import LogoSearchBar from '@/components/hero/LogoSearchBar';
import NavigationBar from '@/components/hero/NavigationBar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEO/SEOHead';

export interface PublicLayoutProps {
  children: React.ReactNode;
  
  /** Whether to show the full hero section with background (default: false) */
  showHeroBackground?: boolean;
  
  /** Whether to show the footer (default: true) */
  showFooter?: boolean;
  
  /** Additional CSS classes for the main content area */
  mainClassName?: string;
  
  /** Whether to add top padding for fixed header layouts (auto-determined) */
  addHeaderPadding?: boolean;
  
  /** Custom header component to replace default header */
  customHeader?: React.ReactNode;
  
  /** Custom footer component to replace default footer */
  customFooter?: React.ReactNode;
  
  /** Custom SEO props */
  seoProps?: {
    title?: string;
    description?: string;
    keywords?: string;
    canonical?: string;
  };
}

const PublicLayout: React.FC<PublicLayoutProps> = ({
  children,
  showHeroBackground = false,
  showFooter = true,
  mainClassName = '',
  addHeaderPadding,
  customHeader,
  customFooter,
  seoProps
}) => {
  // Auto-determine header padding if not explicitly set
  const shouldAddHeaderPadding = addHeaderPadding ?? !showHeroBackground;
  
  return (
    <div className="min-h-screen">
      {/* SEO Head */}
      <SEOHead 
        title={seoProps?.title}
        description={seoProps?.description}
        keywords={seoProps?.keywords}
        canonical={seoProps?.canonical}
      />
      
      {/* Header/Hero Section */}
      {showHeroBackground ? (
        <HeroSection />
      ) : (
        customHeader || (
          <div className="bg-background">
            <TopBar />
            <LogoSearchBar />
            <NavigationBar />
          </div>
        )
      )}
      
      {/* Main Content */}
      <main className={`
        ${shouldAddHeaderPadding ? 'pt-16 lg:pt-20' : ''}
        ${mainClassName}
      `}>
        {children}
      </main>
      
      {/* Footer */}
      {showFooter && (
        customFooter || <Footer />
      )}
    </div>
  );
};

export default PublicLayout; 