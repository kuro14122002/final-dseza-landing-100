import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useTranslation } from "@/utils/translations";

/**
 * Location Map section with VR tour and digital map links
 */
const LocationSection: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("vr-tour");
  const { t } = useTranslation();
  
  // Theme-specific styles
  const textColor = theme === "dark" ? "text-dseza-dark-main-text" : "text-dseza-light-main-text";
  const secondaryTextColor = theme === "dark" ? "text-dseza-dark-secondary-text" : "text-dseza-light-secondary-text";
  const accentColor = theme === "dark" ? "text-dseza-dark-primary-accent" : "text-dseza-light-primary-accent";
  const accentBgColor = theme === "dark" ? "bg-dseza-dark-primary-accent" : "bg-dseza-light-primary-accent";
  const secondaryBgColor = theme === "dark" ? "bg-dseza-dark-secondary-bg" : "bg-dseza-light-secondary-bg";
  const tabActiveText = theme === "dark" ? "text-dseza-dark-main-bg" : "text-white";
  const tabDefaultBg = theme === "dark" ? "bg-dseza-dark-secondary-bg" : "bg-dseza-light-secondary-bg";
  const tabHoverBg = theme === "dark" ? "hover:bg-dseza-dark-hover-bg" : "hover:bg-dseza-light-hover-bg";
  
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <h2 className={cn(
          "font-montserrat font-bold text-3xl md:text-4xl mb-8",
          textColor
        )}>
          {t('location.title')}
        </h2>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column: tabs */}
          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            {/* VR Tour Tab */}
            <button 
              className={cn(
                "px-6 py-4 rounded-lg font-montserrat font-semibold text-lg transition-colors duration-300",
                activeTab === "vr-tour" ? 
                  cn(accentBgColor, tabActiveText) : 
                  cn(tabDefaultBg, textColor, tabHoverBg)
              )}
              onClick={() => setActiveTab("vr-tour")}
            >
              {t('location.vrTour')}
            </button>
            
            {/* Digital Map Tab */}
            <button 
              className={cn(
                "px-6 py-4 rounded-lg font-montserrat font-semibold text-lg transition-colors duration-300",
                activeTab === "digital-map" ? 
                  cn(accentBgColor, tabActiveText) : 
                  cn(tabDefaultBg, textColor, tabHoverBg)
              )}
              onClick={() => setActiveTab("digital-map")}
            >
              {t('location.digitalMap')}
            </button>
          </div>
          
          {/* Right column: content display */}
          <div className="w-full lg:w-2/3">
            {activeTab === "vr-tour" ? (
              <div className={cn(
                "rounded-lg h-80 sm:h-96 p-6 flex flex-col items-center justify-center",
                secondaryBgColor
              )}>
                <p className={cn("text-xl font-montserrat text-center", textColor)}>
                  VR 360 Tour Placeholder
                </p>
                <a 
                  href="https://dseza.danang.gov.vn/vr360/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={cn("mt-4", accentColor, "underline")}
                >
                  https://dseza.danang.gov.vn/vr360/
                </a>
              </div>
            ) : (
              <div className={cn(
                "rounded-lg h-80 sm:h-96 p-6 flex flex-col items-center justify-center",
                secondaryBgColor
              )}>
                <h3 className={cn("text-xl font-montserrat font-medium mb-4 text-center", textColor)}>
                  {t('location.digitalMapTitle')}
                </h3>
                <p className={cn("text-base font-inter text-center max-w-lg leading-relaxed", secondaryTextColor)}>
                  {t('location.digitalMapDescription')}
                </p>
                <Button 
                  asChild 
                  className={cn(
                    "mt-6 px-6 py-3", 
                    accentBgColor,
                    theme === "dark" ? "text-dseza-dark-main-bg hover:bg-dseza-dark-primary-accent-hover" : 
                    "text-white hover:bg-dseza-light-primary-accent-hover"
                  )}
                >
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    {t('location.accessDigitalMap')}
                  </a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
