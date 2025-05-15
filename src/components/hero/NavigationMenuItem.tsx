import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from "@/lib/utils";
import { MenuItem } from './types/megaMenu';

type NavigationMenuItemProps = {
  item: MenuItem;
  index: number;
  activeMenuIndex: number | null;
  onMenuClick: (index: number) => void;
};

const NavigationMenuItem = ({ 
  item, 
  index, 
  activeMenuIndex, 
  onMenuClick 
}: NavigationMenuItemProps) => {
  const isActive = activeMenuIndex === index;
  
  const handleClick = (e: React.MouseEvent) => {
    if (item.megaMenuConfig) {
      e.preventDefault();
      onMenuClick(index);
    }
  };

  return (
    <li className="py-4">
      <a 
        href={item.url}
        className={cn(
          "flex items-center font-medium text-base transition-colors relative",
          isActive 
            ? "text-dseza-light-primary-hover dark:text-dseza-dark-primary" 
            : "hover:text-dseza-light-primary dark:hover:text-dseza-dark-primary"
        )}
        onClick={handleClick}
      >
        {item.title}
        {item.megaMenuConfig && (
          <span className="ml-1 transition-transform duration-300">
            {isActive ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </span>
        )}
        
        {/* Animated underline indicator */}
        <span 
          className={cn(
            "absolute -bottom-1 left-0 h-0.5 bg-dseza-light-primary dark:bg-dseza-dark-primary transition-all duration-300",
            isActive ? "w-full opacity-100" : "w-0 opacity-0"
          )}
        />
      </a>
    </li>
  );
};

export default NavigationMenuItem;
