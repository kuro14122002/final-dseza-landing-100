
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
  return (
    <li className="py-4">
      <button 
        className={cn(
          "flex items-center font-medium text-base transition-colors",
          activeMenuIndex === index 
            ? "text-dseza-light-primary-hover dark:text-dseza-dark-primary" 
            : "hover:text-dseza-light-primary dark:hover:text-dseza-dark-primary"
        )}
        onClick={() => onMenuClick(index)}
      >
        {item.title}
        {item.megaMenuConfig && (
          <span className="ml-1">
            {activeMenuIndex === index ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </span>
        )}
      </button>
    </li>
  );
};

export default NavigationMenuItem;
