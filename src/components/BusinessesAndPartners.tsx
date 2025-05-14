
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

/**
 * Businesses and Partners section with continuous scrolling logo carousel
 */
const BusinessesAndPartners: React.FC = () => {
  const { theme } = useTheme();
  
  // Theme-specific styles
  const textColor = theme === "dark" ? "text-dseza-dark-main-text" : "text-dseza-light-main-text";
  
  // Placeholder logos for partners and businesses
  const partnerLogos = [
    "https://via.placeholder.com/150x60/AAAAAA/FFFFFF?text=Logo+1",
    "https://via.placeholder.com/180x60/AAAAAA/FFFFFF?text=Logo+2",
    "https://via.placeholder.com/120x60/AAAAAA/FFFFFF?text=Logo+3",
    "https://via.placeholder.com/160x60/AAAAAA/FFFFFF?text=Logo+4",
    "https://via.placeholder.com/140x60/AAAAAA/FFFFFF?text=Logo+5",
    "https://via.placeholder.com/170x60/AAAAAA/FFFFFF?text=Logo+6",
    "https://via.placeholder.com/130x60/AAAAAA/FFFFFF?text=Logo+7",
    "https://via.placeholder.com/150x60/AAAAAA/FFFFFF?text=Logo+8",
    "https://via.placeholder.com/165x60/AAAAAA/FFFFFF?text=Logo+9",
    "https://via.placeholder.com/155x60/AAAAAA/FFFFFF?text=Logo+10",
    "https://via.placeholder.com/175x60/AAAAAA/FFFFFF?text=Logo+11",
    "https://via.placeholder.com/145x60/AAAAAA/FFFFFF?text=Logo+12",
    "https://via.placeholder.com/135x60/AAAAAA/FFFFFF?text=Logo+13",
    "https://via.placeholder.com/160x60/AAAAAA/FFFFFF?text=Logo+14",
    "https://via.placeholder.com/170x60/AAAAAA/FFFFFF?text=Logo+15",
  ];
  
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <h2 className={cn(
          "font-montserrat font-bold text-3xl md:text-4xl mb-8",
          textColor
        )}>
          DOANH NGHIỆP VÀ ĐỐI TÁC
        </h2>
        
        {/* Continuous scrolling logo carousel */}
        <div className="relative w-full overflow-hidden">
          <div className="flex animate-[scroll_60s_linear_infinite] hover:pause">
            {/* First set of logos */}
            {partnerLogos.map((logo, index) => (
              <div 
                key={`logo-1-${index}`} 
                className="flex-shrink-0 mx-8 transition-all duration-300 filter grayscale hover:grayscale-0 hover:scale-105"
              >
                <img 
                  src={logo} 
                  alt={`Partner Logo ${index + 1}`} 
                  className="h-12 md:h-16 w-auto"
                />
              </div>
            ))}
            
            {/* Duplicate set of logos for seamless scrolling */}
            {partnerLogos.map((logo, index) => (
              <div 
                key={`logo-2-${index}`} 
                className="flex-shrink-0 mx-8 transition-all duration-300 filter grayscale hover:grayscale-0 hover:scale-105"
              >
                <img 
                  src={logo} 
                  alt={`Partner Logo ${index + 1}`} 
                  className="h-12 md:h-16 w-auto"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessesAndPartners;
