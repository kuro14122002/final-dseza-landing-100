
import React from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import HeroSection from "@/components/hero/HeroSection";
import QuickAccessButtons from "@/components/QuickAccessButtons";

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
            
            {/* More sections will be added in future iterations */}
          </div>
        </main>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default Index;
