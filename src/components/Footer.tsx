import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { MapPin, Phone, File, Mail, Facebook, Youtube, Linkedin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

/**
 * Footer component with contact information, legal details, and social media links
 */
const Footer: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  
  // Theme-specific styles
  const bgColor = theme === "dark" ? "bg-dseza-dark-secondary-bg" : "bg-dseza-light-secondary-bg";
  const textColor = theme === "dark" ? "text-dseza-dark-main-text" : "text-dseza-light-main-text";
  const secondaryTextColor = theme === "dark" ? "text-dseza-dark-secondary-text" : "text-dseza-light-secondary-text";
  const accentColor = theme === "dark" ? "text-dseza-dark-primary-accent hover:text-dseza-dark-primary-accent-hover" : "text-dseza-light-primary-accent hover:text-dseza-light-primary-accent-hover";
  const bottomBarBgColor = theme === "dark" ? "bg-dseza-dark-hover-bg" : "bg-dseza-light-hover-bg";
  
  return (
    <footer className={cn(bgColor)}>
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Contact Information */}
          <div>
            <h3 className={cn(
              "font-montserrat font-semibold text-lg mb-4",
              textColor
            )}>
              {t("footer.management")}
            </h3>
            
            <div className="space-y-2">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                <p className={cn("font-inter text-sm", secondaryTextColor)}>
                  {t("footer.address")}
                </p>
              </div>
              
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-2 flex-shrink-0" />
                <p className={cn("font-inter text-sm", secondaryTextColor)}>
                  {t("footer.phone")}
                </p>
              </div>
              
              <div className="flex items-center">
                <File className="w-5 h-5 mr-2 flex-shrink-0" />
                <p className={cn("font-inter text-sm", secondaryTextColor)}>
                  {t("footer.reception")}
                </p>
              </div>
              
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-2 flex-shrink-0" />
                <p className={cn("font-inter text-sm", secondaryTextColor)}>
                  {t("footer.email")}
                </p>
              </div>
            </div>
          </div>
          
          {/* Column 2: Map Location */}
          <div>
            <h3 className={cn(
              "font-montserrat font-semibold text-lg mb-4",
              textColor
            )}>
              {t("footer.location")}
            </h3>
            
            <div className={cn(
              "h-40 bg-gray-300 dark:bg-gray-700 rounded-lg flex items-center justify-center",
              secondaryTextColor
            )}>
              Google Map Embed
            </div>
          </div>
          
          {/* Column 3: Legal Information */}
          <div>
            <h3 className={cn(
              "font-montserrat font-semibold text-lg mb-4",
              textColor
            )}>
              {t("footer.legal")}
            </h3>
            
            <div className="space-y-2">
              <a href="#" className={cn("block font-inter text-sm", accentColor)}>
                {t("footer.trusted")}
              </a>
              
              <p className={cn("font-inter text-sm", secondaryTextColor)}>
                {t("footer.license")}
              </p>
              
              <p className={cn("font-inter text-sm", secondaryTextColor)}>
                {t("footer.editor")}
              </p>
            </div>
          </div>
          
          {/* Column 4: Citation and Connect */}
          <div>
            <h3 className={cn(
              "font-montserrat font-semibold text-lg mb-4",
              textColor
            )}>
              {t("footer.citation")}
            </h3>
            
            <p className={cn("font-inter text-sm mb-4", secondaryTextColor)}>
              {t("footer.citationInfo")}
            </p>
            
            <div className="flex space-x-4">
              <a 
                href="#" 
                aria-label="Facebook"
                className={cn("transition-colors", accentColor)}
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a 
                href="#" 
                aria-label="YouTube"
                className={cn("transition-colors", accentColor)}
              >
                <Youtube className="w-6 h-6" />
              </a>
              <a 
                href="#" 
                aria-label="LinkedIn"
                className={cn("transition-colors", accentColor)}
              >
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className={cn(
        "py-3 px-4 sm:px-6 lg:px-8",
        bottomBarBgColor
      )}>
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center text-xs">
          <p className={cn("font-inter mb-2 sm:mb-0 text-center sm:text-left", secondaryTextColor)}>
            {t("footer.copyright")}
          </p>
          <p className={cn("font-inter", secondaryTextColor)}>
            {t("footer.visits")} 28,734
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
