
import React from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import HeroSection from "@/components/hero/HeroSection";
import QuickAccessButtons from "@/components/QuickAccessButtons";
import FeaturedEvents from "@/components/FeaturedEvents";
import NewsSection from "@/components/NewsSection";
import FunctionalZones from "@/components/FunctionalZones";
import InvestmentInformation from "@/components/InvestmentInformation";
import LocationSection from "@/components/LocationSection";
import ResourcesSection from "@/components/ResourcesSection";
import BusinessesAndPartners from "@/components/BusinessesAndPartners";
import Footer from "@/components/Footer";

const Index: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <main className="min-h-screen">
          {/* Hero Section */}
          <HeroSection />
          
          {/* Content Sections */}
          <div className="bg-background">
            {/* Quick Access Buttons */}
            <QuickAccessButtons />
            
            {/* Featured Events Section */}
            <FeaturedEvents />
            
            {/* News Section */}
            <NewsSection />
            
            {/* Functional Zones Section */}
            <FunctionalZones />
            
            {/* Investment Information Section */}
            <InvestmentInformation />
            
            {/* Location Map Section */}
            <LocationSection />
            
            {/* Resources Section */}
            <ResourcesSection />
            
            {/* Businesses and Partners Section */}
            <BusinessesAndPartners />
          </div>
          
          {/* Footer */}
          <Footer />
        </main>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default Index;
