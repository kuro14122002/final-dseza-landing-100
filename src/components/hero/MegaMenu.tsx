// src/components/hero/MegaMenu.tsx
import React from 'react';
import {
  User, Building2, Users, CircleDollarSign, BarChart, HomeIcon,
  Briefcase, FileText, Database, LineChart, BookOpen, GraduationCap, HeartHandshake,
  ChevronDown, ChevronUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MegaMenuConfigType, MegaMenuContentType } from './types/megaMenu';
import { useLanguage } from '@/context/LanguageContext';

const iconMap: Record<string, any> = {
  "general-partner": User,
  "chief-financial-officer": CircleDollarSign,
  "investor-relations": HeartHandshake,
  "business-development": Building2,
  "customer-relationship-management": Users,
  "real-estate": HomeIcon,
  "private-equity": Briefcase,
  "private-debt": FileText,
  "venture-capital": LineChart,
  "corporate-venture-capital": BookOpen,
  "hedge-fund": BarChart,
  "family-offices": Users,
  "ria": GraduationCap,
  "wealth-management": Database
};

type MegaMenuProps = {
  config: MegaMenuConfigType;
  currentLanguage: string;
};

const MegaMenu = ({ config, currentLanguage }: MegaMenuProps) => {
  const { t } = useLanguage();
  
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});

  const toggleDropdown = (id: string) => {
    setOpenDropdowns(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const gridCols = config.columns.length <= 2 ?
    `grid-cols-${config.columns.length}` :
    "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  // Function to get translated content
  const getTranslatedText = (text: string, translationKey?: string) => {
    if (translationKey) {
      return t(translationKey);
    }
    return text;
  };

  return (
    <div
      className={cn(
        "mega-menu-container w-full border-t",
        "bg-white/30 dark:bg-dseza-dark-secondary/50",
        "backdrop-blur-lg",
        "border-white/20 dark:border-dseza-dark-hover/30",
        "shadow-2xl"
      )}
    >
      <div className="max-w-6xl mx-auto p-8">
        <div className={`grid ${gridCols} gap-8`}>
          {config.columns.map((column, colIndex) => (
            <div key={colIndex} className="menu-column">
              <h5 className="text-lg font-semibold pb-3 mb-3 border-b border-foreground/10 dark:border-dseza-dark-hover/50">
                {getTranslatedText(column.title, column.translationKey)}
              </h5>
              <ul className="space-y-1">
                {column.contents.map((content, contentIndex) => {
                  const dropdownId = `col-${colIndex}-content-${contentIndex}`;
                  const isDropdownOpen = openDropdowns[dropdownId];
                  return (
                    <li key={contentIndex}>
                      <div
                        className={cn(
                          "flex items-center justify-between gap-3 py-2 px-3 rounded-md hover:bg-white/20 dark:hover:bg-dseza-dark-hover/70 transition-colors",
                          { "cursor-pointer": !!content.items }
                        )}
                        onClick={() => content.items && toggleDropdown(dropdownId)}
                      >
                        <a
                          href={content.items ? undefined : content.url || "#"}
                          className="flex items-center gap-3 flex-grow"
                          onClick={(e) => {
                            if (content.items) {
                              e.preventDefault();
                            }
                          }}
                        >
                          {content.iconName && iconMap[content.iconName] && (
                            <span className="text-dseza-light-primary dark:text-dseza-dark-primary">
                              {React.createElement(iconMap[content.iconName], { size: 20 })}
                            </span>
                          )}
                          <span className="font-medium">
                            {getTranslatedText(content.title, content.translationKey)}
                          </span>
                        </a>
                        {content.items && (
                          <button
                            aria-expanded={isDropdownOpen}
                            className="focus:outline-none"
                          >
                            {isDropdownOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </button>
                        )}
                      </div>
                      {content.items && isDropdownOpen && (
                        <ul className="ml-6 mt-1 space-y-1 pl-5 border-l border-gray-300 dark:border-gray-600">
                          {content.items.map((item, itemIndex) => (
                            <li key={itemIndex}>
                              <a
                                href={item.url}
                                className="block py-1.5 px-3 rounded-md text-sm hover:bg-white/10 dark:hover:bg-dseza-dark-hover/50 transition-colors"
                              >
                                {getTranslatedText(item.title, item.translationKey)}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
              {column.specialContent && (
                <div className="mt-5">
                  {column.specialContent}
                </div>
              )}
            </div>
          ))}
        </div>
        {config.featuredContent && (
          <div className="mt-8 border-t border-foreground/10 dark:border-dseza-dark-hover/50 pt-6">
            {config.featuredContent}
          </div>
        )}
      </div>
    </div>
  );
};

export default MegaMenu;
