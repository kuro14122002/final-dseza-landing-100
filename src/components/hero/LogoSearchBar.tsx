// src/components/hero/LogoSearchBar.tsx
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/utils/translations";
import SearchBar from "@/components/SearchBar";

const LogoSearchBar: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const textColor = theme === "dark" ? "text-dseza-dark-main-text" : "text-dseza-light-main-text";
  const placeholderColor = theme === "dark" ? "placeholder-dseza-dark-secondary-text" : "placeholder-dseza-light-secondary-text";
  const hoverColor = theme === "dark" ? "hover:text-dseza-dark-primary-accent" : "hover:text-dseza-light-primary-accent";
  const focusBorderColor = theme === "dark" ? "focus:border-dseza-dark-primary-accent" : "focus:border-dseza-light-primary-accent";
  const focusShadow = theme === "dark" ? "focus:shadow-[0_0_0_2px_rgba(25,219,207,0.2)]" : "focus:shadow-[0_0_0_2px_rgba(65,102,40,0.2)]";
  
  const logoSrc = theme === "dark" ? "/media/darklogo3.png" : "/media/lightlogo3.png";

  // Sử dụng lớp glass-initial đã chuẩn hóa
  // z-index được đặt là 20 để nằm dưới TopBar (z-40) và trên NavigationBar ban đầu (nếu Nav có z-index thấp hơn khi chưa sticky)
  // Tuy nhiên, NavigationBar hiện tại là z-30, nên LogoSearchBar cần z-index cao hơn Nav nếu muốn nằm trên.
  // Hiện tại, Nav (top-36) nằm dưới LogoSearchBar (top-12, height h-24).
  // LogoSearchBar sẽ bị Nav (khi sticky) che phủ. Nếu đây là ý muốn thì giữ nguyên.
  // Để đảm bảo hiệu ứng glass nhất quán, ta dùng glass-initial.
  const logoSearchBarClasses = cn(
    "absolute top-12 left-0 right-0 z-20 h-24", // Điều chỉnh z-index nếu cần thiết so với NavigationBar
    "glass-initial" // Áp dụng hiệu ứng glass đã chuẩn hóa
    // Lớp glass-initial đã bao gồm border-b-transparent và shadow-none
  );

  const inputSpecificBg = theme === "dark" ? "bg-dseza-dark-secondary-bg/60" : "bg-white/60";
  const inputSpecificBorder = theme === "dark" ? "border-dseza-dark-border/50" : "border-gray-300/50";

  return (
    <div className={logoSearchBarClasses}>
      <div className="container mx-auto h-full px-8 flex justify-between items-center">
        <a href="/" className="flex items-center">
          <img
            src={logoSrc}
            alt="DSEZA Logo"
            className="h-12 md:h-24 w-auto" 
          />
        </a>
        
        <div className="flex-1 max-w-lg mx-auto">
          <SearchBar 
            placeholder={t('logoSearchBar.searchPlaceholder')}
            className="w-full"
          />
        </div>
        
        <div className={`${textColor} flex items-center`}>
          <a href="/admin/login" className={`${textColor} ${hoverColor} transition-colors duration-300`}>{t('logoSearchBar.login')}</a>
        </div>
      </div>
    </div>
  );
};

export default LogoSearchBar;