// src/components/hero/LogoSearchBar.tsx
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

const LogoSearchBar: React.FC = () => {
  const { theme } = useTheme();

  const textColor = theme === "dark" ? "text-dseza-dark-main-text" : "text-dseza-light-main-text";
  const placeholderColor = theme === "dark" ? "placeholder-dseza-dark-secondary-text" : "placeholder-dseza-light-secondary-text";
  const hoverColor = theme === "dark" ? "hover:text-dseza-dark-primary-accent" : "hover:text-dseza-light-primary-accent";
  const focusBorderColor = theme === "dark" ? "focus:border-dseza-dark-primary-accent" : "focus:border-dseza-light-primary-accent";
  const focusShadow = theme === "dark" ? "focus:shadow-[0_0_0_2px_rgba(25,219,207,0.2)]" : "focus:shadow-[0_0_0_2px_rgba(65,102,40,0.2)]";
  
  const logoSrc = theme === "dark" ? "/media/darklogo3.png" : "/media/lightlogo3.png";

  // Các class cho hiệu ứng glassmorphism của LogoSearchBar
  const logoSearchBarGlassClasses = cn(
    "absolute top-12 left-0 right-0 z-10 h-24",
    // Áp dụng kiểu giống TopBar khi chưa cuộn
    "bg-white/20 dark:bg-black/20",
    "backdrop-blur-sm",
    // Bạn có thể thêm border và shadow nếu muốn, ví dụ:
    "border-b border-white/20 dark:border-black/20", // Viền mờ
    "shadow-sm" // Bóng đổ nhẹ
  );

  // Màu nền và viền cho ô input để nó nổi bật hoặc phù hợp
  const inputSpecificBg = theme === "dark" ? "bg-dseza-dark-secondary-bg/60" : "bg-white/60";
  const inputSpecificBorder = theme === "dark" ? "border-dseza-dark-border/50" : "border-gray-300/50";


  return (
    <div className={logoSearchBarGlassClasses}>
      <div className="container mx-auto h-full px-8 flex justify-between items-center">
        <a href="/" className="flex items-center">
          <img
            src={logoSrc}
            alt="DSEZA Logo"
            className="h-12 md:h-24 w-auto" 
          />
        </a>
        
        <div className="flex-1 max-w-lg mx-auto relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className={`h-5 w-5 ${theme === "dark" ? "text-dseza-dark-secondary-text" : "text-dseza-light-secondary-text"}`} />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className={cn(
              "w-full py-3 pl-10 pr-4 rounded-lg transition-all duration-300 outline-none",
              inputSpecificBg, // Nền riêng cho input
              inputSpecificBorder, // Viền riêng cho input
              "border", // Để viền có hiệu lực
              textColor,
              placeholderColor,
              focusBorderColor,
              focusShadow
            )}
          />
        </div>
        
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