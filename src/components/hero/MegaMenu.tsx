// src/components/hero/MegaMenu.tsx
import React, { useState } from 'react'; // Thêm useState
import {
  User, Building2, Users, CircleDollarSign, BarChart, HomeIcon,
  Briefcase, FileText, Database, LineChart, BookOpen, GraduationCap, HeartHandshake,
  ChevronDown, ChevronUp // Thêm ChevronDown và ChevronUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MegaMenuConfigType, MegaMenuContentType, MegaMenuItem } from './types/megaMenu'; // Đảm bảo import đúng các kiểu

// ... (iconMap giữ nguyên)
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
};

const MegaMenu = ({ config }: MegaMenuProps) => {
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});

  const toggleDropdown = (id: string) => {
    setOpenDropdowns(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const gridCols = config.columns.length <= 2 ?
    `grid-cols-${config.columns.length}` :
    "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

    return (
    <div
      className={cn(
        "mega-menu-container w-full border-t",
        // Áp dụng style giống glass-nav-sticky (hoặc trạng thái mong muốn khi sticky)
        "bg-white/70 dark:bg-dseza-dark-secondary/70",
        "backdrop-blur-md",
        "border-white/20 dark:border-dseza-dark-hover/30", // Viền này của MegaMenu có thể khác với Nav
        "shadow-2xl" // MegaMenu thường có bóng đổ lớn hơn
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
                {column.contents.map((content, contentIndex) => {
                  const dropdownId = `col-${colIndex}-content-${contentIndex}`;
                  const isDropdownOpen = openDropdowns[dropdownId];

                  return (
                    <li key={contentIndex}>
                      <div // Sử dụng div để bao bọc cả link và nút dropdown nếu có
                        className={cn(
                          "flex items-center justify-between gap-3 py-2 px-3 rounded-md hover:bg-white/20 dark:hover:bg-dseza-dark-hover/70 transition-colors",
                          { "cursor-pointer": !!content.items } // Thêm cursor-pointer nếu là mục có dropdown
                        )}
                        onClick={() => content.items && toggleDropdown(dropdownId)} // Chỉ toggle nếu có items
                      >
                        <a // Link chính
                          href={content.items ? undefined : content.url || "#"} // Không có href nếu là mục dropdown
                          className="flex items-center gap-3 flex-grow"
                          onClick={(e) => {
                            if (content.items) { // Ngăn chặn điều hướng nếu là mục dropdown
                              e.preventDefault();
                            }
                          }}
                        >
                          {content.iconName && iconMap[content.iconName] && (
                            <span className="text-dseza-light-primary dark:text-dseza-dark-primary">
                              {React.createElement(iconMap[content.iconName], { size: 20 })}
                            </span>
                          )}
                          <span className="font-medium">{content.title}</span>
                        </a>
                        {content.items && ( // Hiển thị nút dropdown nếu có items
                          <button
                            aria-expanded={isDropdownOpen}
                            className="focus:outline-none"
                          >
                            {isDropdownOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </button>
                        )}
                      </div>

                      {/* Render Dropdown Items */}
                      {content.items && isDropdownOpen && (
                        <ul className="ml-6 mt-1 space-y-1 pl-5 border-l border-gray-300 dark:border-gray-600">
                          {content.items.map((item, itemIndex) => (
                            <li key={itemIndex}>
                              <a
                                href={item.url}
                                className="block py-1.5 px-3 rounded-md text-sm hover:bg-white/10 dark:hover:bg-dseza-dark-hover/50 transition-colors"
                              >
                                {item.title}
                              </a>
                              {/* Có thể thêm logic cho subItems lồng nhau ở đây nếu cần */}
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