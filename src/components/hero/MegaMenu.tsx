
import React from 'react';
import { 
  User,
  Building2,
  Users,
  CircleDollarSign,
  BarChart,
  Home as HomeIcon,
  Briefcase,
  FileText,
  Database,
  LineChart,
  BookOpen,
  GraduationCap,
  HeartHandshake
} from "lucide-react";
import { cn } from "@/lib/utils";

// Type definitions
type MegaMenuContentType = {
  title: string;
  url?: string;
  iconName?: string;
  items?: {
    title: string;
    url: string;
    subItems?: { title: string; url: string }[];
  }[];
};

type MegaMenuColumnType = {
  title: string;
  contents: MegaMenuContentType[];
  specialContent?: React.ReactNode;
};

type MegaMenuConfigType = {
  columns: MegaMenuColumnType[];
  featuredContent?: React.ReactNode;
};

type MegaMenuProps = {
  config: MegaMenuConfigType;
};

// Icon mapping with standard Lucide icons
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

const MegaMenu = ({ config }: MegaMenuProps) => {
  // Calculate grid columns based on number of columns in config
  const gridCols = config.columns.length <= 2 ? 
    `grid-cols-${config.columns.length}` : 
    "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  return (
    <div
      className={cn(
        "mega-menu-container w-full border-t",
        "bg-white/30 dark:bg-dseza-dark-secondary/50", // Reduced background opacity
        "backdrop-blur-lg", // Increased blur for glassmorphism effect
        "border-white/20 dark:border-dseza-dark-hover/30", // Softer borders
        "shadow-2xl" // Strong shadow for depth
      )}
    >
      <div className="max-w-6xl mx-auto p-8">
        <div className={`grid ${gridCols} gap-8`}>
          {config.columns.map((column, colIndex) => (
            <div key={colIndex} className="menu-column">
              <h5 className="text-lg font-semibold pb-3 mb-3 border-b border-foreground/10 dark:border-dseza-dark-hover/50">
                {column.title}
              </h5>

              <ul className="space-y-1">
                {column.contents.map((content, contentIndex) => (
                  <li key={contentIndex}>
                    <a
                      href={content.url || "#"}
                      className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-white/20 dark:hover:bg-dseza-dark-hover/70 transition-colors"
                    >
                      {content.iconName && iconMap[content.iconName] && (
                        <span className="text-dseza-light-primary dark:text-dseza-dark-primary">
                          {React.createElement(iconMap[content.iconName], { size: 20 })}
                        </span>
                      )}
                      <span className="font-medium">{content.title}</span>
                    </a>

                    {content.items && content.items.length > 0 && (
                      <ul className="ml-8 mt-1 space-y-1">
                        {content.items.map((subItem, subItemIndex) => (
                          <li key={subItemIndex}>
                            <a
                              href={subItem.url}
                              className="block py-1.5 px-3 rounded-md text-sm hover:bg-white/20 dark:hover:bg-dseza-dark-hover/70 transition-colors"
                            >
                              {subItem.title}
                            </a>

                            {subItem.subItems && subItem.subItems.length > 0 && (
                              <ul className="ml-5 mt-1 space-y-1">
                                {subItem.subItems.map((nestedItem, nestedIndex) => (
                                  <li key={nestedIndex}>
                                    <a
                                      href={nestedItem.url}
                                      className="block py-1 px-3 rounded-md text-xs hover:bg-white/20 dark:hover:bg-dseza-dark-hover/70 transition-colors"
                                    >
                                      {nestedItem.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>

              {/* Special content block */}
              {column.specialContent && (
                <div className="mt-5">
                  {column.specialContent}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Optional featured content */}
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
