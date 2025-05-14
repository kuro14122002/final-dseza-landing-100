
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { Search } from "lucide-react";

/**
 * Logo and search bar component
 */
const LogoSearchBar: React.FC = () => {
  const { theme } = useTheme();
  
  // Background and text colors based on theme
  const searchBgColor = theme === "dark" ? "bg-dseza-dark-secondary-bg/80" : "bg-dseza-light-secondary-bg/80";
  const borderColor = theme === "dark" ? "border-dseza-dark-border" : "border-dseza-light-border";
  const textColor = theme === "dark" ? "text-dseza-dark-main-text" : "text-dseza-light-main-text";
  const placeholderColor = theme === "dark" ? "placeholder-dseza-dark-secondary-text" : "placeholder-dseza-light-secondary-text";
  const hoverColor = theme === "dark" ? "hover:text-dseza-dark-primary-accent" : "hover:text-dseza-light-primary-accent";
  const focusBorderColor = theme === "dark" ? "focus:border-dseza-dark-primary-accent" : "focus:border-dseza-light-primary-accent";
  const focusShadow = theme === "dark" ? "focus:shadow-[0_0_0_2px_rgba(25,219,207,0.2)]" : "focus:shadow-[0_0_0_2px_rgba(65,102,40,0.2)]";

  return (
    <div className="absolute top-12 left-0 right-0 z-10 h-24">
      <div className="container mx-auto h-full px-8 flex justify-between items-center">
        {/* Logo */}
        <a href="/" className="h-14">
          <div className="text-3xl font-bold tracking-tight font-montserrat">
            <span className={theme === "dark" ? "text-white" : "text-black"}>DSEZA</span>
            <span className={theme === "dark" ? "text-dseza-dark-primary-accent" : "text-dseza-light-primary-accent"}>.</span>
          </div>
          <div className={`text-sm ${theme === "dark" ? "text-dseza-dark-secondary-text" : "text-dseza-light-secondary-text"}`}>
            Da Nang High-Tech Park and Industrial Zones Authority
          </div>
        </a>
        
        {/* Search Bar */}
        <div className="flex-1 max-w-lg mx-auto relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className={`h-5 w-5 ${theme === "dark" ? "text-dseza-dark-secondary-text" : "text-dseza-light-secondary-text"}`} />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className={`w-full py-3 pl-10 pr-4 ${searchBgColor} ${borderColor} border ${textColor} ${placeholderColor} rounded-lg transition-all duration-300 outline-none ${focusBorderColor} ${focusShadow}`}
          />
        </div>
        
        {/* Login/Register Links */}
        <div className={`${textColor} flex items-center`}>
          <a href="#" className={`${textColor} ${hoverColor} transition-colors duration-300`}>Đăng ký</a>
          <span className="mx-2 opacity-50">|</span>
          <a href="#" className={`${textColor} ${hoverColor} transition-colors duration-300`}>Đăng nhập</a>
        </div>
      </div>
    </div>
  );
};

export default LogoSearchBar;
