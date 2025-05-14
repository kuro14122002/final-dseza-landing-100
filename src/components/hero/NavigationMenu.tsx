
import React from 'react';
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";
import { MenuItem } from './types/megaMenu.types';

type NavigationMenuProps = {
  menuItems: MenuItem[];
  activeMegaMenu: string | null;
  onMenuClick: (menuId: string) => void;
};

const NavigationMenu: React.FC<NavigationMenuProps> = ({ 
  menuItems, 
  activeMegaMenu, 
  onMenuClick 
}) => {
  const { theme } = useTheme();

  // Get colors based on theme
  const textColor = theme === "dark" ? "text-dseza-dark-main-text" : "text-dseza-light-main-text";
  const activeTextColor = theme === "dark" ? "text-dseza-dark-primary-accent" : "text-dseza-light-primary-accent";
  const hoverBgColor = theme === "dark" ? "hover:bg-dseza-dark-hover-bg" : "hover:bg-dseza-light-hover-bg";
  const activeBgColor = theme === "dark" ? "bg-dseza-dark-hover-bg" : "bg-dseza-light-hover-bg";

  return (
    <div className="container mx-auto flex justify-center items-center h-16 px-8">
      <nav className="flex items-center">
        {menuItems.map((menu) => (
          <button
            key={menu.id}
            onClick={() => onMenuClick(menu.id)}
            className={cn(
              "px-5 py-3 font-medium text-base transition-colors duration-300 rounded-md mx-1",
              textColor,
              hoverBgColor,
              activeMegaMenu === menu.id ? `${activeTextColor} ${activeBgColor}` : ""
            )}
          >
            {menu.title}
          </button>
        ))}
        <a
          href="https://dseza.danang.gov.vn/lien-he/"
          target="_blank"
          rel="noopener noreferrer"
          className={`px-5 py-3 font-medium text-base transition-colors duration-300 rounded-md mx-1 ${textColor} ${hoverBgColor}`}
        >
          Liên hệ
        </a>
      </nav>
    </div>
  );
};

export default NavigationMenu;
