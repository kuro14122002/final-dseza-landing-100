
import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

// Define the mega menu structure
interface MenuLink {
  title: string;
  url: string;
  subLinks?: MenuLink[];
}

interface MenuColumn {
  heading: string;
  links: MenuLink[];
}

interface MegaMenu {
  id: string;
  title: string;
  columns: MenuColumn[];
}

// Define all mega menus
const megaMenus: MegaMenu[] = [
  {
    id: "gioi-thieu",
    title: "Giới thiệu",
    columns: [
      {
        heading: "Giới thiệu",
        links: [
          { title: "Thư ngỏ", url: "/chi-tiet-tin-tuc/thu-ngo/" },
          { title: "Tổng quan về Đà Nẵng", url: "/chi-tiet-tin-tuc/tong-quan-ve-tpda-nang/" },
          { 
            title: "Tổng quan về Ban Quản lý", 
            url: "/danh-sach-tin-tuc/gioi-thieu/tong-quan-ve-ban-quan-ly/",
            subLinks: [
              { title: "Chức năng, nhiệm vụ, quyền hạn Ban Quản lý", url: "/chi-tiet-tin-tuc/chuc-nang-nhiem-vu-quyen-han-ban-quan-ly/" },
              { title: "Các phòng ban", url: "/chi-tiet-tin-tuc/cac-phong-ban/" },
              { title: "Đơn vị trực thuộc", url: "/chi-tiet-tin-tuc/don-vi-truc-thuoc/" }
            ]
          }
        ]
      },
      {
        heading: "Khu hành chính",
        links: [
          { title: "Khu công nghệ cao Đà Nẵng", url: "/chi-tiet-tin-tuc/khu-cong-nghe-cao-da-nang/" },
          { title: "Khu thương mại tự do Đà Nẵng", url: "/chi-tiet-tin-tuc/khu-thuong-mai-tu-do-da-nang/" },
          { title: "Khu CNTT tập trung", url: "/chi-tiet-tin-tuc/khu-cong-nghe-thong-tin-tap-trung/" },
          { 
            title: "Các Khu công nghiệp Đà Nẵng", 
            url: "/danh-sach-tin-tuc/gioi-thieu/khu-hanh-chinh/cac-khu-cong-nghiep-da-nang/",
            subLinks: [
              { title: "KCN Hòa Khánh", url: "/chi-tiet-tin-tuc/kcn-hoa-khanh/" },
              { title: "KCN Liên Chiểu", url: "/chi-tiet-tin-tuc/kcn-lien-chieu/" },
              { title: "KCN Hòa Cầm", url: "/chi-tiet-tin-tuc/kcn-hoa-cam/" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "tin-tuc",
    title: "Tin tức",
    columns: [
      {
        heading: "Tin tức | Sự kiện",
        links: [
          { title: "Đầu tư - Hợp tác Quốc tế", url: "/danh-sach-tin-tuc/tin-tuc/dau-tu-hop-tac-quoc-te/" },
          { title: "Doanh nghiệp", url: "/danh-sach-tin-tuc/doanh-nghiep/" },
          { title: "Chuyển đổi số", url: "/danh-sach-tin-tuc/tin-tuc/chuyen-doi-so/" }
        ]
      },
      {
        heading: "Xem thêm:",
        links: [
          { title: "Lịch công tác", url: "/lich-cong-tac/" },
          { title: "Thông báo", url: "/danh-sach-tin-tuc/thong-bao/" }
        ]
      }
    ]
  },
  {
    id: "doanh-nghiep",
    title: "Doanh nghiệp",
    columns: [
      {
        heading: "Báo cáo",
        links: [
          { title: "Báo cáo trực tuyến về DSEZA", url: "https://external-report.com" },
          { title: "Báo cáo giám sát và đánh giá đầu tư", url: "/danh-sach-tin-tuc/doanh-nghiep/bao-cao-giam-sat-va-danh-gia-dau-tu/" }
        ]
      },
      {
        heading: "Xem thêm",
        links: [
          { title: "Thủ tục | Hồ sơ | Dữ liệu môi trường", url: "/danh-sach-tin-tuc/doanh-nghiep/thu-tuc-ho-so-du-lieu-moi-truong/" }
        ]
      }
    ]
  },
  {
    id: "cam-nang-dau-tu",
    title: "Cẩm nang đầu tư",
    columns: [
      {
        heading: "Cẩm nang đầu tư",
        links: [
          { title: "Khám phá Cẩm nang đầu tư", url: "/danh-sach-tin-tuc/cam-nang-dau-tu/" },
          { title: "Cơ hội đầu tư", url: "/co-hoi-dau-tu/" },
          { title: "Quy trình đầu tư", url: "/quy-trinh-dau-tu/" },
          { title: "Ưu đãi đầu tư", url: "/uu-dai-dau-tu/" }
        ]
      }
    ]
  },
  {
    id: "van-ban",
    title: "Văn bản",
    columns: [
      {
        heading: "Văn bản Pháp luật",
        links: [
          { title: "Văn bản pháp quy trung ương", url: "/van-ban/van-ban-phap-quy-tw/" },
          { title: "Văn bản pháp quy địa phương", url: "/van-ban/van-ban-phap-quy-dia-phuong/" },
          { title: "Văn bản chỉ đạo điều hành", url: "/van-ban/van-ban-chi-dao-dieu-hanh/" }
        ]
      },
      {
        heading: "Tài liệu & Góp ý",
        links: [
          { title: "Văn bản hướng dẫn", url: "/danh-sach-tin-tuc/van-ban/van-ban-huong-dan/" },
          { title: "Góp ý dự thảo văn bản", url: "/gop-y-du-thao-van-ban/" }
        ]
      }
    ]
  },
  {
    id: "cai-cach-hanh-chinh",
    title: "Cải cách hành chính",
    columns: [
      {
        heading: "Ứng dụng và dịch vụ",
        links: [
          { title: "Dịch vụ công trực tuyến", url: "https://dichvucong.danang.gov.vn/web/guest/dich-vu-cong" },
          { title: "Công khai KQ giải quyết TTHC", url: "https://dichvucong.danang.gov.vn/web/guest/thu-tuc-hanh-chinh" },
          { title: "Đặt lịch hẹn giao dịch trực tuyến", url: "http://49.156.54.87/index.php" }
        ]
      },
      {
        heading: "Văn bản CCHC",
        links: [
          { title: "Thủ tục hành chính", url: "https://dichvucong.danang.gov.vn/web/guest/thu-tuc-hanh-chinh" },
          { title: "Mẫu đơn, tờ khai", url: "/mau-don-to-khai/" }
        ]
      }
    ]
  }
];

/**
 * Navigation bar component with mega menus
 */
const NavigationBar: React.FC = () => {
  const { theme } = useTheme();
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close mega menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node)) {
        setActiveMegaMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get colors based on theme
  const textColor = theme === "dark" ? "text-dseza-dark-main-text" : "text-dseza-light-main-text";
  const activeTextColor = theme === "dark" ? "text-dseza-dark-primary-accent" : "text-dseza-light-primary-accent";
  const hoverBgColor = theme === "dark" ? "hover:bg-dseza-dark-hover-bg" : "hover:bg-dseza-light-hover-bg";
  const activeBgColor = theme === "dark" ? "bg-dseza-dark-hover-bg" : "bg-dseza-light-hover-bg";
  const megaMenuBgColor = theme === "dark" ? "bg-dseza-dark-main-bg" : "bg-dseza-light-main-bg";
  const secondaryTextColor = theme === "dark" ? "text-dseza-dark-secondary-text" : "text-dseza-light-secondary-text";
  const linkHoverColor = theme === "dark" ? "hover:text-dseza-dark-primary-accent" : "hover:text-dseza-light-primary-accent";

  // Toggle mega menu
  const handleMenuClick = (menuId: string) => {
    if (activeMegaMenu === menuId) {
      setActiveMegaMenu(null);
    } else {
      setActiveMegaMenu(menuId);
    }
  };

  // Close mega menu
  const closeMegaMenu = () => {
    setActiveMegaMenu(null);
  };

  return (
    <div ref={megaMenuRef} className="absolute top-36 left-0 right-0 z-10">
      {/* Main Navigation */}
      <div className="container mx-auto flex justify-center items-center h-16 px-8">
        <nav className="flex items-center">
          {megaMenus.map((menu) => (
            <button
              key={menu.id}
              onClick={() => handleMenuClick(menu.id)}
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

      {/* Mega Menu */}
      {activeMegaMenu && (
        <div 
          className={`${megaMenuBgColor} shadow-2xl rounded-b-lg animate-fade-in`}
        >
          <div className="container mx-auto p-8 lg:p-12">
            <div className="flex">
              {megaMenus
                .find(menu => menu.id === activeMegaMenu)
                ?.columns.map((column, colIndex) => (
                  <div key={colIndex} className="flex-1 px-6 first:pl-0 last:pr-0">
                    <h4 className="text-lg font-semibold font-montserrat mb-4">{column.heading}</h4>
                    <ul className="space-y-3">
                      {column.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <a 
                            href={link.url}
                            target={link.url.startsWith("http") ? "_blank" : "_self"}
                            rel={link.url.startsWith("http") ? "noopener noreferrer" : ""}
                            onClick={closeMegaMenu}
                            className={`${secondaryTextColor} ${linkHoverColor} transition-colors duration-300`}
                          >
                            {link.title}
                          </a>
                          
                          {link.subLinks && (
                            <ul className="mt-2 ml-4 space-y-2">
                              {link.subLinks.map((subLink, subLinkIndex) => (
                                <li key={subLinkIndex}>
                                  <a 
                                    href={subLink.url}
                                    target={subLink.url.startsWith("http") ? "_blank" : "_self"}
                                    rel={subLink.url.startsWith("http") ? "noopener noreferrer" : ""}
                                    onClick={closeMegaMenu}
                                    className={`${secondaryTextColor} ${linkHoverColor} transition-colors duration-300 text-sm`}
                                  >
                                    {subLink.title}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavigationBar;
