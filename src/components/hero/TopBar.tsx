import React, { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { formatDateVi, formatTime } from "@/utils/dateFormatter";
import { Sun, Moon, Map } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Top bar component for the hero section
 */
const TopBar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <div className={cn(
      "fixed top-0 left-0 right-0 z-40 h-12 transition-all duration-300 ease-in-out",
      isScrolled 
        ? "bg-white/70 dark:bg-dseza-dark-secondary/70 backdrop-blur-md"
        : "bg-white/20 dark:bg-black/20 backdrop-blur-sm"
    )}>
      <div className="container mx-auto h-full flex items-center justify-between px-8">
        <div className="flex items-center text-foreground/80">
          <span>{formatDateVi(currentDate)}</span>
          <span className="mx-2 opacity-50">|</span>
          <span>{formatTime(currentDate)}</span>
        </div>
        
        <div className="flex items-center">
          <a 
            href="https://dseza.danang.gov.vn/so-do-site" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-foreground/80 hover:text-dseza-light-primary dark:hover:text-dseza-dark-primary transition-colors duration-300 mr-6"
          >
            <Map className="w-4 h-4 mr-1" />
            <span className="text-sm">Sơ đồ site</span>
          </a>
          
          <div className="flex items-center mx-4">
            <button 
              onClick={toggleLanguage}
              className={cn(
                "text-sm font-medium transition-colors duration-300",
                language === "vi" 
                  ? "text-dseza-light-primary dark:text-dseza-dark-primary" 
                  : "text-foreground/80 hover:text-dseza-light-primary dark:hover:text-dseza-dark-primary"
              )}
            >
              VIE
            </button>
            <span className="mx-1 text-foreground/80">/</span>
            <button 
              onClick={toggleLanguage}
              className={cn(
                "text-sm font-medium transition-colors duration-300",
                language === "en" 
                  ? "text-dseza-light-primary dark:text-dseza-dark-primary" 
                  : "text-foreground/80 hover:text-dseza-light-primary dark:hover:text-dseza-dark-primary"
              )}
            >
              ENG
            </button>
          </div>
          
          <button 
            onClick={toggleTheme}
            className="text-foreground/80 hover:text-dseza-light-primary dark:hover:text-dseza-dark-primary transition-colors duration-300"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
