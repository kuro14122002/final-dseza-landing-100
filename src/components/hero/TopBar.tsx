// src/components/hero/TopBar.tsx
import React, { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { formatDateVi, formatTime } from "@/utils/dateFormatter";
import { Sun, Moon, Map } from "lucide-react";
import { cn } from "@/lib/utils";

const TopBar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Xác định màu chữ dựa trên theme và trạng thái cuộn
  // Màu chữ cho trạng thái chưa cuộn (isScrolled = false) -> glass-nav-initial
  const initialTextColor = theme === "dark" ? "text-white/80 hover:text-dseza-dark-primary" : "text-gray-700 hover:text-dseza-light-primary"; // Hoặc "text-black/70" nếu nền sáng
  const initialLangActiveColor = theme === "dark" ? "text-dseza-dark-primary" : "text-dseza-light-primary";
  const initialLangInactiveColor = theme === "dark" ? "text-white/70 hover:text-dseza-dark-primary" : "text-gray-600 hover:text-dseza-light-primary";
  const initialSeparatorColor = theme === "dark" ? "text-white/50" : "text-gray-500/70";


  // Màu chữ cho trạng thái đã cuộn (isScrolled = true) -> glass-nav-sticky
  const scrolledTextColor = theme === "dark" ? "text-gray-200 hover:text-dseza-dark-primary" : "text-gray-700 hover:text-dseza-light-primary";
  const scrolledLangActiveColor = theme === "dark" ? "text-dseza-dark-primary" : "text-dseza-light-primary";
  const scrolledLangInactiveColor = theme === "dark" ? "text-gray-300 hover:text-dseza-dark-primary" : "text-gray-600 hover:text-dseza-light-primary";
  const scrolledSeparatorColor = theme === "dark" ? "text-gray-400" : "text-gray-500";

  const dateTextColor = isScrolled
    ? (theme === "dark" ? "text-gray-300" : "text-gray-600")
    : (theme === "dark" ? "text-white/90" : "text-neutral-700"); // Ví dụ: text-neutral-700 cho nền sáng, trong suốt

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-40 h-12 transition-all duration-300 ease-in-out",
        isScrolled ? "glass-nav-sticky" : "glass-nav-initial"
      )}
    >
      <div className="container mx-auto h-full flex items-center justify-between px-8">
        {/* Ngày giờ */}
        <div className={cn("flex items-center", dateTextColor)}>
          <span>{formatDateVi(currentDate)}</span>
          <span className={cn(
            "mx-2 opacity-50",
            isScrolled ? (theme === "dark" ? "text-gray-500" : "text-gray-400")
                       : (theme === "dark" ? "text-white/60" : "text-neutral-600/80")
          )}>|</span>
          <span>{formatTime(currentDate)}</span>
        </div>

        {/* Sơ đồ site, Ngôn ngữ, Theme */}
        <div className="flex items-center">
          {/* Sơ đồ site */}
          <a
            href="https://dseza.danang.gov.vn/so-do-site"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex items-center transition-colors duration-300 mr-6 text-sm",
              isScrolled ? scrolledTextColor : initialTextColor
            )}
          >
            <Map className="w-4 h-4 mr-1" />
            <span>Sơ đồ site</span>
          </a>

          {/* Ngôn ngữ */}
          <div className="flex items-center mx-4">
            <button
              onClick={toggleLanguage}
              className={cn(
                "text-sm font-medium transition-colors duration-300",
                language === "vi"
                  ? (isScrolled ? scrolledLangActiveColor : initialLangActiveColor)
                  : (isScrolled ? scrolledLangInactiveColor : initialLangInactiveColor)
              )}
            >
              VIE
            </button>
            <span className={cn(
                "mx-1",
                isScrolled ? scrolledSeparatorColor : initialSeparatorColor
            )}>
                /
            </span>
            <button
              onClick={toggleLanguage}
              className={cn(
                "text-sm font-medium transition-colors duration-300",
                language === "en"
                  ? (isScrolled ? scrolledLangActiveColor : initialLangActiveColor)
                  : (isScrolled ? scrolledLangInactiveColor : initialLangInactiveColor)
              )}
            >
              ENG
            </button>
          </div>

          {/* Nút chuyển Theme */}
          <button
            onClick={toggleTheme}
            className={cn(
              "transition-colors duration-300",
              isScrolled ? scrolledTextColor : initialTextColor
            )}
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