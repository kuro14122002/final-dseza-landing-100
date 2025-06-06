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

          {/* Additional Utilities Section */}
          <div className="mt-12">
            <h3 className="text-xl font-semibold mb-2 text-primary">Tiện ích</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Hỏi đáp | Góp ý</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><a href="https://dseza.danang.gov.vn/hoi-dap/" target="_blank" rel="noopener noreferrer" className="hover:underline">Hỏi | Đáp</a></li>
                  <li><a href="https://dseza.danang.gov.vn/cau-hoi-thuong-gap/" target="_blank" rel="noopener noreferrer" className="hover:underline">Câu hỏi thường gặp</a></li>
                  <li><a href="https://gopy.danang.gov.vn/" target="_blank" rel="noopener noreferrer" className="hover:underline">Cổng góp ý TP. Đà Nẵng</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Kết nối doanh nghiệp</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><a href="https://docs.google.com/forms/d/e/1FAIpQLSc7gyKy8ESi7k9Hxja0Mi9YAnWLf_yU3fQPnyzYp9hWGLLREg/viewform" target="_blank" rel="noopener noreferrer" className="hover:underline">Cà phê cùng DSEZA</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Xem thêm</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><a href="https://dseza.danang.gov.vn/lich-cong-tac/" target="_blank" rel="noopener noreferrer" className="hover:underline">Lịch công tác</a></li>
                  <li><a href="https://dseza.danang.gov.vn/" target="_blank" rel="noopener noreferrer" className="hover:underline">Dữ liệu chuyên ngành</a></li>
                  <li><a href="https://dseza.danang.gov.vn/" target="_blank" rel="noopener noreferrer" className="hover:underline">Mua sắm công</a></li>
                  <li><a href="https://dseza.danang.gov.vn/media/i1kpng1s/t%C3%A0i-li%E1%BB%87u-s%E1%BB%AD-d%E1%BB%A5ng.pdf" target="_blank" rel="noopener noreferrer" className="hover:underline">Làm theo năng lực | Hưởng theo lao động</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default SitemapPage; 