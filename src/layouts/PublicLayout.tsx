import React from 'react';
import HeroSection from '@/components/hero/HeroSection';
import TopBar from '@/components/hero/TopBar';
import LogoSearchBar from '@/components/hero/LogoSearchBar';
import NavigationBar from '@/components/hero/NavigationBar';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';

interface PublicLayoutProps {
  children: React.ReactNode;
  /**
   * Whether to show the full hero section with background
   * @default true
   */
  showHeroBackground?: boolean;
  /**
   * Whether to show the footer
   * @default true
   */
  showFooter?: boolean;
  /**
   * Additional CSS classes for the main content area
   */
  mainClassName?: string;
  /**
   * Whether to add top padding for fixed header layouts
   * @default false (true when showHeroBackground is false)
   */
  addHeaderPadding?: boolean;
  /**
   * Custom header component to replace default header
   */
  customHeader?: React.ReactNode;
  /**
   * Custom footer component to replace default footer
   */
  customFooter?: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ 
  children,
  showHeroBackground = true,
  showFooter = true,
  mainClassName,
  addHeaderPadding,
  customHeader,
  customFooter
}) => {
  // Auto-determine header padding if not explicitly set
  const shouldAddPadding = addHeaderPadding ?? !showHeroBackground;
  
  const mainClasses = cn(
    "flex-grow",
    shouldAddPadding && "pt-48", // Add padding for fixed header when no hero background
    mainClassName
  );

  const renderHeader = () => {
    if (customHeader) {
      return customHeader;
    }
    
    if (showHeroBackground) {
      return <HeroSection />;
    }
    
    // Simple header without hero background
    return (
      <header className="bg-white dark:bg-dseza-dark-main-bg shadow-sm">
        <TopBar />
        <LogoSearchBar />
        <NavigationBar />
      </header>
    );
  };

  const renderFooter = () => {
    if (!showFooter) return null;
    if (customFooter) return customFooter;
    return <Footer />;
  };

  return (
    <div className="flex flex-col min-h-screen">
      {renderHeader()}
      <main className={mainClasses}>
        {children}
      </main>
      {renderFooter()}
    </div>
  );
};

export default PublicLayout; 