import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "vi" | "en";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("vi");
  const [isLoading, setIsLoading] = useState(true);

  // Load language from localStorage on initial load
  useEffect(() => {
    const savedLanguage = localStorage.getItem('dseza-language') as Language;
    if (savedLanguage && (savedLanguage === 'vi' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage);
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('en')) {
        setLanguageState('en');
      } else {
        setLanguageState('vi');
      }
    }
    setIsLoading(false);
  }, []);

  // Save language to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('dseza-language', language);
      
      // Update document language attribute for SEO
      document.documentElement.lang = language === 'vi' ? 'vi-VN' : 'en-US';
      
      // Dispatch custom event for potential URL updating
      window.dispatchEvent(new CustomEvent('languageChange', { detail: { language } }));
    }
  }, [language, isLoading]);

  const toggleLanguage = () => {
    setLanguageState(language === "vi" ? "en" : "vi");
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

// Utility function to get localized URL
export const getLocalizedUrl = (path: string, language: Language): string => {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // For Vietnamese (default), don't add language prefix
  if (language === 'vi') {
    return `/${cleanPath}`;
  }
  
  // For English, add /en prefix
  return `/en/${cleanPath}`;
};

// Utility function to extract language from URL
export const getLanguageFromUrl = (pathname: string): Language => {
  if (pathname.startsWith('/en/') || pathname === '/en') {
    return 'en';
  }
  return 'vi';
};

// Utility function to remove language prefix from URL
export const removeLanguagePrefix = (pathname: string): string => {
  if (pathname.startsWith('/en/')) {
    return pathname.slice(3);
  }
  if (pathname === '/en') {
    return '/';
  }
  return pathname;
};
