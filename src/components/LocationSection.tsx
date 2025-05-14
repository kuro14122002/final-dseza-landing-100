
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

/**
 * Location Map section with VR tour and digital map links
 */
const LocationSection: React.FC = () => {
  const { theme } = useTheme();
  
  // Theme-specific styles
  const textColor = theme === "dark" ? "text-dseza-dark-main-text" : "text-dseza-light-main-text";
  const secondaryTextColor = theme === "dark" ? "text-dseza-dark-secondary-text" : "text-dseza-light-secondary-text";
  const accentColor = theme === "dark" ? "text-dseza-dark-primary-accent" : "text-dseza-light-primary-accent";
  const accentBgColor = theme === "dark" ? "bg-dseza-dark-primary-accent" : "bg-dseza-light-primary-accent";
  const secondaryBgColor = theme === "dark" ? "bg-dseza-dark-secondary-bg" : "bg-dseza-light-secondary-bg";
  
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <h2 className={cn(
          "font-montserrat font-bold text-3xl md:text-4xl mb-8",
          textColor
        )}>
          BẢN ĐỒ VỊ TRÍ
        </h2>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column: links/tabs */}
          <div className="w-full lg:w-1/3">
            {/* VR Tour link */}
            <a 
              href="https://dseza.danang.gov.vn/vr360/" 
              target="_blank" 
              rel="noopener noreferrer"
              className={cn(
                "block mb-6 p-4 rounded-lg font-montserrat font-semibold text-lg transition-colors",
                accentBgColor,
                "text-white"
              )}
            >
              VR 360 Tour - Khu CNC Đà Nẵng
            </a>
            <p className={cn("mb-6 text-sm", secondaryTextColor)}>
              Khám phá Khu Công nghệ cao Đà Nẵng qua tour tham quan ảo 360° với trải nghiệm tương tác.
            </p>
            
            {/* Digital Map link */}
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer"
              className={cn(
                "block p-4 rounded-lg font-montserrat font-semibold text-lg",
                secondaryBgColor,
                textColor,
                "hover:bg-opacity-80 transition-colors"
              )}
            >
              Bản đồ số khu CNC + Các KCN Đà Nẵng + Báo cáo trực tuyến
            </a>
          </div>
          
          {/* Right column: content display */}
          <div className="w-full lg:w-2/3">
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
