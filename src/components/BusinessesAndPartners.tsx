import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

/**
 * Businesses and Partners section with continuous scrolling logo carousel
 */
const BusinessesAndPartners: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  
  // Theme-specific styles
  const textColor = theme === "dark" ? "text-dseza-dark-main-text" : "text-dseza-light-main-text";
  
  // Real company logos (using tech company logos as placeholders)
  const partnerLogos = [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1667px-Apple_logo_black.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/2560px-IBM_logo.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Firefox_logo%2C_2019.svg/1200px-Firefox_logo%2C_2019.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1200px-Facebook_Logo_%282019%29.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2048px-Google_%22G%22_Logo.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Logo_of_YouTube_%282015-2017%29.svg/2560px-Logo_of_YouTube_%282015-2017%29.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Dart-logo.png/768px-Dart-logo.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/PHP-logo.svg/2560px-PHP-logo.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1869px-Python-logo-notext.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/C_Programming_Language.svg/1853px-C_Programming_Language.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/ISO_C%2B%2B_Logo.svg/1822px-ISO_C%2B%2B_Logo.svg.png",
  ];
  
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <h2 className={cn(
          "font-montserrat font-bold text-3xl md:text-4xl mb-8",
          textColor
        )}>
          {t("section.businessesAndPartners")}
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
