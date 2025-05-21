// src/components/mobile/MobileHeader.tsx
import React, { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/utils/translations"; // Thêm useTranslation
import { Menu, X, Map } from "lucide-react";
import { cn } from "@/lib/utils";
// import { useIsMobile } from "@/hooks/use-mobile"; // Không cần thiết trong component này nữa
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
// import { Separator } from "@/components/ui/separator"; // Không thấy sử dụng
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/translations";

// Type for menu item
type MobileMenuItem = {
  id: string;
  titleKey: string; // Đổi title thành titleKey
  titleEn?: string; // Có thể giữ lại nếu muốn fallback hoặc cấu trúc dữ liệu cũ
  url?: string;
  isExpandable?: boolean;
  items?: {
    headingKey: string; // Đổi heading thành headingKey
    headingEn?: string;
    links: {
      titleKey: string; // Đổi title thành titleKey
      titleEn?: string;
      url: string;
      children?: { 
        titleKey: string; // Đổi title thành titleKey
        titleEn?: string;
        url: string 
      }[];
    }[];
  }[];
};

// Cập nhật mobileMenuData để sử dụng keys cho việc dịch
const getMobileMenuData = (t: (key: string) => string): MobileMenuItem[] => [
  {
    id: "gioi-thieu",
    titleKey: "nav.intro",
    isExpandable: true,
    items: [
      {
        headingKey: "nav.intro", // Hoặc một key cụ thể hơn nếu cần
        links: [
          { titleKey: "menuSpecial.letterOfGreeting", url: "https://dseza.danang.gov.vn/chi-tiet-tin-tuc/thu-ngo/" }, // Giả sử key là 'menuSpecial.letterOfGreeting'
          { titleKey: "menuSpecial.overviewDanang", url: "https://dseza.danang.gov.vn/chi-tiet-tin-tuc/tong-quan-ve-tpda-nang/" },
          {
            titleKey: "menuSpecial.overviewAuthority",
            url: "https://dseza.danang.gov.vn/danh-sach-tin-tuc/gioi-thieu/tong-quan-ve-ban-quan-ly/",
            children: [
              { titleKey: "menuSpecial.functionsAndDuties", url: "https://dseza.danang.gov.vn/chi-tiet-tin-tuc/chuc-nang-nhiem-vu-quyen-han-ban-quan-ly/" },
              { titleKey: "menuSpecial.departments", url: "https://dseza.danang.gov.vn/chi-tiet-tin-tuc/cac-phong-ban/" },
              { titleKey: "menuSpecial.affiliatedUnits", url: "https://dseza.danang.gov.vn/chi-tiet-tin-tuc/don-vi-truc-thuoc/" }
            ]
          }
        ]
      },
      {
        headingKey: "menuSpecial.functionalAreas", // Ví dụ key
        links: [
          // ... (Tương tự cho các mục con khác, sử dụng titleKey)
          { titleKey: "heroBackground.tab1", url: "https://dseza.danang.gov.vn/chi-tiet-tin-tuc/khu-cong-nghe-cao-da-nang/" },
          { titleKey: "heroBackground.tab2", url: "https://dseza.danang.gov.vn/chi-tiet-tin-tuc/khu-thuong-mai-tu-do-da-nang/" },
          { titleKey: "heroBackground.tab3", url: "https://dseza.danang.gov.vn/chi-tiet-tin-tuc/khu-cong-nghe-thong-tin-tap-trung/" },
          {
            titleKey: "heroBackground.tab4",
            url: "https://dseza.danang.gov.vn/danh-sach-tin-tuc/gioi-thieu/khu-hanh-chinh/cac-khu-cong-nghiep-da-nang/",
            children: [
              // ... dịch các mục con
            ]
          }
        ]
      }
    ]
  },
  {
    id: "tin-tuc",
    titleKey: "nav.news",
    isExpandable: true,
    // ... (Cấu trúc tương tự, sử dụng titleKey và headingKey)
  },
  {
    id: "doanh-nghiep",
    titleKey: "nav.business",
    isExpandable: true,
    // ...
  },
  {
    id: "cam-nang-dau-tu",
    titleKey: "nav.investmentGuide",
    url: "https://dseza.danang.gov.vn/danh-sach-tin-tuc/cam-nang-dau-tu/"
  },
  {
    id: "van-ban",
    titleKey: "nav.documents",
    isExpandable: true,
    // ...
  },
  {
    id: "cai-cach-hanh-chinh",
    titleKey: "nav.adminReform",
    isExpandable: true,
    // ...
  },
  {
    id: "lien-he",
    titleKey: "nav.contact",
    url: "https://dseza.danang.gov.vn/lien-he/"
  }
];


const MobileHeader: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation(); // Sử dụng hook useTranslation
  // const isMobile = useIsMobile(); // Không cần thiết nếu component này chỉ dùng cho mobile
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [openCollapsibles, setOpenCollapsibles] = useState<{ [key: string]: boolean }>({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Lấy dữ liệu menu đã được bao bọc bởi hàm t
  const mobileMenuData = getMobileMenuData(t);


  useEffect(() => {
    const timerId = setInterval(() => setCurrentDateTime(new Date()), 60000);
    return () => clearInterval(timerId);
  }, []);

  const toggleCollapsible = (id: string) => {
    setOpenCollapsibles(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getBgColor = () => theme === "dark" ? "bg-dseza-dark-main-bg" : "bg-white";
  const getTextColor = () => theme === "dark" ? "text-white" : "text-black";
  const getSecondaryTextColor = () => theme === "dark" ? "text-dseza-dark-secondary-text" : "text-dseza-light-secondary-text";
  const getBorderColor = () => theme === "dark" ? "border-dseza-dark-border" : "border-dseza-light-border";
  const getPrimaryColor = () => theme === "dark" ? "text-dseza-dark-primary" : "text-dseza-light-primary";
  const getPrimaryBgColor = () => theme === "dark" ? "bg-dseza-dark-primary" : "bg-dseza-light-primary";
  const getPrimaryHoverBgColor = () => theme === "dark" ? "hover:bg-dseza-dark-primary-hover" : "hover:bg-dseza-light-primary-hover";
  const getShadowColor = () => theme === "dark" ? "shadow-neutral-700" : "shadow-neutral-200";

  const Logo = () => (
    <img
      src={theme === "dark" ? "/media/darklogo3.png" : "/media/lightlogo3.png"}
      alt="DSEZA Logo"
      className="h-8"
    />
  );

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 w-full h-16 z-50",
          getBgColor(),
          getShadowColor(),
          "shadow-md"
        )}
      >
        <div className="flex items-center justify-between h-full px-4">
          <Logo />
          
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <button
                aria-label="Open menu"
                className={cn(
                  "p-2 rounded-md",
                  getTextColor(),
                  "focus:outline-none focus:ring-2 focus:ring-offset-2",
                  theme === "dark" ? "focus:ring-dseza-dark-primary" : "focus:ring-dseza-light-primary"
                )}
              >
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            
            <SheetContent 
              side="right" 
              className={cn(
                "w-full sm:max-w-md p-0 border-none",
                getBgColor()
              )}
            >
            <div className="flex flex-col h-full">
              <div className={cn(
                "flex items-center justify-between h-16 px-4",
                getBgColor(),
                getShadowColor(),
                "shadow-md"
            )}>
              <Logo />
              <button
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close menu"
                className={cn(
                  "p-2 rounded-md",
                  getTextColor(),
                  "focus:outline-none focus:ring-2 focus:ring-offset-2",
                  theme === "dark" ? "focus:ring-dseza-dark-primary" : "focus:ring-dseza-light-primary"
                )}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
                
                <div className={cn(
                  "flex-1 overflow-y-auto p-6",
                  getBgColor()
                )}>
                  {mobileMenuData.map((item) => (
                    <div key={item.id} className="mb-1">
                      {item.isExpandable ? (
                        <Collapsible
                          open={openCollapsibles[item.id]}
                          onOpenChange={() => toggleCollapsible(item.id)}
                          className="w-full"
                        >
                          <CollapsibleTrigger asChild>
                            <button 
                              className={cn(
                                "flex items-center justify-between w-full py-3 px-2",
                                getTextColor(),
                                "font-montserrat font-semibold text-lg",
                                getBorderColor(),
                                "border-b"
                              )}
                            >
                              <span>{t(item.titleKey)}</span> {/* Dịch titleKey */}
                              <span className="transform transition-transform duration-200">
                                {openCollapsibles[item.id] ? "▼" : "▶"}
                              </span>
                            </button>
                          </CollapsibleTrigger>
                          
                          <CollapsibleContent className="pt-2 pb-3">
                            {item.items?.map((section, idx) => (
                              <div key={idx} className="mb-4">
                                <h3 className={cn(
                                  "pt-3 pb-2 px-4 font-montserrat font-medium text-base",
                                  theme === "dark" ? "text-dseza-dark-secondary-text" : "text-dseza-light-secondary-text"
                                )}>
                                  {t(section.headingKey)} {/* Dịch headingKey */}
                                </h3>
                                
                                <div className="space-y-1">
                                  {section.links.map((link, linkIdx) => (
                                    <div key={linkIdx}>
                                      {link.children ? (
                                        <>
                                          <div className={cn(
                                            "py-2 pl-4 pr-2 font-inter text-sm",
                                            getTextColor()
                                          )}>
                                            {t(link.titleKey)} {/* Dịch titleKey */}
                                          </div>
                                          <div className="pl-8"> 
                                            {link.children.map((child, childIdx) => (
                                              <a
                                                key={childIdx}
                                                href={child.url}
                                                className={cn(
                                                  "block py-2 pl-4 pr-2 font-inter text-sm", 
                                                  getTextColor(),
                                                  theme === "dark" ? "hover:text-dseza-dark-primary" : "hover:text-dseza-light-primary"
                                                )}
                                              >
                                                {t(child.titleKey)} {/* Dịch titleKey con */}
                                              </a>
                                            ))}
                                          </div>
                                        </>
                                      ) : (
                                        <a
                                          href={link.url}
                                          className={cn(
                                            "block py-2 pl-4 pr-2 font-inter text-sm", 
                                            getTextColor(),
                                            theme === "dark" ? "hover:text-dseza-dark-primary" : "hover:text-dseza-light-primary"
                                          )}
                                        >
                                          {t(link.titleKey)} {/* Dịch titleKey */}
                                        </a>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </CollapsibleContent>
                        </Collapsible>
                      ) : (
                        <a 
                          href={item.url}
                          className={cn(
                            "block py-3 px-2",
                            getTextColor(),
                            "font-montserrat font-semibold text-lg",
                            getBorderColor(),
                            "border-b"
                          )}
                        >
                          {t(item.titleKey)} {/* Dịch titleKey */}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className={cn(
                  "p-4 border-t",
                  getBorderColor(),
                  getBgColor()
                )}>
                  <div className="flex justify-between items-center">
                    <span className={cn(
                      "font-inter text-xs",
                      getSecondaryTextColor()
                    )}>
                      {formatDate(currentDateTime, true)}
                    </span>
                    
                    <a
                      href="https://dseza.danang.gov.vn/so-do-site"
                      className={cn(
                        "font-inter text-xs",
                        getPrimaryColor()
                      )}
                    >
                      <span className="flex items-center">
                        <Map className="w-3 h-3 mr-1" />
                        {t('sitemap')} {/* Dịch sitemap */}
                      </span>
                    </a>
                  </div>
                  
                  <div className="flex justify-between items-center mt-3">
                    <LanguageSwitcher />
                    <ThemeToggle />
                  </div>
                  
                  <div className="mt-4">
                    <Button
                      className={cn(
                        "w-full py-2.5 px-5 font-inter font-medium text-base rounded-md",
                        getPrimaryBgColor(),
                        getPrimaryHoverBgColor(),
                        theme === "dark" ? "text-dseza-dark-main-bg" : "text-white"
                      )}
                    >
                      {`${t('logoSearchBar.register')} / ${t('logoSearchBar.login')}`} {/* Dịch Register/Login */}
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      
      <div className="h-16"></div>
    </>
  );
};

// Language Switcher và ThemeToggle giữ nguyên, nhưng cần đảm bảo chúng cũng sử dụng `t` nếu có text tĩnh.
// Trong trường hợp này, "Tiếng Việt", "English", "Dark Mode", "Light Mode" có thể được thêm vào translations.ts nếu muốn.
// Tuy nhiên, vì chúng là tên ngôn ngữ và chế độ, việc giữ nguyên cũng có thể chấp nhận được.
// Nếu muốn dịch, bạn sẽ cần:
// 1. Thêm key vào translations.ts, ví dụ: "languageSwitcher.vietnamese", "languageSwitcher.english", "themeToggle.darkMode", "themeToggle.lightMode"
// 2. Gọi t(key) trong các component LanguageSwitcher và ThemeToggle.

const LanguageSwitcher = () => {
  const { language, toggleLanguage } = useLanguage();
  const { theme } = useTheme();
  const { t } = useTranslation(); // Đã có useTranslation

  const getActiveClass = (lang: string) => {
    const isActive = language === lang;
    return cn(
      "font-inter text-sm",
      isActive
        ? (theme === "dark" ? "text-dseza-dark-primary font-semibold" : "text-dseza-light-primary font-semibold")
        : (theme === "dark" ? "text-dseza-dark-secondary-text" : "text-dseza-light-secondary-text")
    );
  };

  return (
    <div className="flex items-center">
      <button
        onClick={toggleLanguage}
        className={getActiveClass("vi")}
        disabled={language === "vi"} // Bạn có thể thêm thuộc tính disabled
      >
        {t('languageSwitcher.vietnamese')} {/* Sử dụng key đã định nghĩa */}
      </button>
      <span className={cn(
        "mx-1",
        theme === "dark" ? "text-dseza-dark-border" : "text-dseza-light-border"
      )}>
        /
      </span>
      <button
        onClick={toggleLanguage}
        className={getActiveClass("en")}
        disabled={language === "en"} // Bạn có thể thêm thuộc tính disabled
      >
        {t('languageSwitcher.english')} {/* Sử dụng key đã định nghĩa */}
      </button>
    </div>
  );
};

// Theme Toggle Component
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation(); // Đã có useTranslation
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "flex items-center space-x-1 font-inter text-sm",
        isDark ? "text-dseza-dark-primary" : "text-dseza-light-primary"
      )}
    >
      {isDark ? (
        <>
          <span>{t('themeToggle.darkMode')}</span> {/* Sử dụng key đã định nghĩa */}
          <span className="rounded-full w-4 h-4 bg-dseza-dark-primary"></span>
        </>
      ) : (
        <>
          <span>{t('themeToggle.lightMode')}</span> {/* Sử dụng key đã định nghĩa */}
          <span className="rounded-full w-4 h-4 bg-dseza-light-primary"></span>
        </>
      )}
    </button>
  );
};

export default MobileHeader;