import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/utils/translations";
import { getNavigationMenuItems } from "@/components/hero/navigation/menuData";
import TopBar from "@/components/hero/TopBar";
import LogoSearchBar from "@/components/hero/LogoSearchBar";
import NavigationBar from "@/components/hero/NavigationBar";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";

interface SitemapItem {
  title: string;
  titleEn?: string;
  url?: string;
  translatable?: boolean;
  items?: SitemapItem[];
}

const SitemapPage: React.FC = () => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const menuItems = getNavigationMenuItems();

  const textColor = theme === "dark" ? "text-gray-200" : "text-gray-700";
  const linkColor = theme === "dark" 
    ? "text-dseza-dark-primary hover:text-dseza-dark-hover" 
    : "text-dseza-light-primary hover:text-dseza-light-hover";

  const renderMenuItem = (item: any) => {
    const title = item.translatable ? t(item.title) : (language === 'en' ? (item.titleEn || item.title) : item.title);
    
    return (
      <li key={item.title} className="my-2">
        {item.url && item.url !== '#' ? (
          <a 
            href={item.url} 
            className={cn("inline-flex items-center transition-colors duration-200", linkColor)}
          >
            {title}
          </a>
        ) : (
          <span className={cn("font-semibold", textColor)}>{title}</span>
        )}
        
        {/* Render mega menu items */}
        {item.megaMenuConfig && (
          <ul className="ml-6 mt-2">
            {item.megaMenuConfig.columns.map((column: any) => (
              <li key={column.title} className="my-2">
                <span className={cn("font-medium", textColor)}>
                  {language === 'en' ? (column.titleEn || column.title) : column.title}
                </span>
                <ul className="ml-6 mt-1">
                  {column.contents.map((content: any) => (
                    <li key={content.title} className="my-1">
                      {content.url && content.url !== '#' ? (
                        <a 
                          href={content.url}
                          className={cn("inline-flex items-center transition-colors duration-200", linkColor)}
                        >
                          {language === 'en' ? (content.titleEn || content.title) : content.title}
                        </a>
                      ) : (
                        <span className={textColor}>
                          {language === 'en' ? (content.titleEn || content.title) : content.title}
                        </span>
                      )}
                      
                      {/* Render sub-items if they exist */}
                      {content.items && (
                        <ul className="ml-6 mt-1">
                          {content.items.map((subItem: any) => (
                            <li key={subItem.title} className="my-1">
                              <a 
                                href={subItem.url}
                                className={cn("inline-flex items-center transition-colors duration-200", linkColor)}
                              >
                                • {language === 'en' ? (subItem.titleEn || subItem.title) : subItem.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Desktop Header */}
      <div className="hidden lg:block">
        <TopBar />
        <LogoSearchBar />
        <NavigationBar />
      </div>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 mt-12 lg:mt-48">
          <h1 className={cn(
            "font-montserrat font-bold text-3xl md:text-4xl mb-8",
            textColor
          )}>
            {t('sitemap')}
          </h1>

          <nav aria-label="Sitemap">
            <ul className="space-y-3">
              {/* Home page */}
              <li className="my-2">
                <a 
                  href="/" 
                  className={cn("inline-flex items-center transition-colors duration-200 font-semibold text-lg", linkColor)}
                >
                  {t('home')}
                </a>
              </li>

              {/* Menu items */}
              {menuItems.map(renderMenuItem)}
            </ul>
          </nav>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default SitemapPage; 