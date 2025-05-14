
import React, { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { formatDateVi, formatTime } from "@/utils/dateFormatter";
import { Sun, Moon, Map } from "lucide-react";

/**
 * Top bar component for the hero section
 */
const TopBar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Background color based on theme
  const bgColor = theme === "dark" 
    ? "bg-black/20" 
    : "bg-white/20";
  
  // Text color based on theme
  const textColor = theme === "dark" 
    ? "text-dseza-dark-secondary-text" 
    : "text-dseza-light-secondary-text";
  
  // Accent color based on theme
  const accentColor = theme === "dark" 
    ? "text-dseza-dark-primary-accent" 
    : "text-dseza-light-primary-accent";
  
  // Hover color based on theme
  const hoverColor = theme === "dark" 
    ? "hover:text-dseza-dark-primary-accent" 
    : "hover:text-dseza-light-primary-accent";
  
  return (
    <div className={`absolute top-0 left-0 right-0 z-10 h-12 ${bgColor} backdrop-blur-sm`}>
      <div className="container mx-auto h-full flex items-center justify-between px-8">
        <div className={`flex items-center ${textColor}`}>
          <span>{formatDateVi(currentDate)}</span>
          <span className="mx-2 opacity-50">|</span>
          <span>{formatTime(currentDate)}</span>
        </div>
        
        <div className="flex items-center">
          <a 
            href="https://dseza.danang.gov.vn/so-do-site" 
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center ${textColor} ${hoverColor} transition-colors duration-300 mr-6`}
          >
            <Map className="w-4 h-4 mr-1" />
            <span className="text-sm">Sơ đồ site</span>
          </a>
          
          <div className="flex items-center mx-4">
            <button 
              onClick={toggleLanguage}
              className={`text-sm ${language === "vi" ? accentColor : textColor} ${hoverColor} font-medium transition-colors duration-300`}
            >
              VIE
            </button>
            <span className={`mx-1 ${textColor}`}>/</span>
            <button 
              onClick={toggleLanguage}
              className={`text-sm ${language === "en" ? accentColor : textColor} ${hoverColor} font-medium transition-colors duration-300`}
            >
              ENG
            </button>
          </div>
          
          <button 
            onClick={toggleTheme}
            className={`${textColor} ${hoverColor} transition-colors duration-300`}
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
