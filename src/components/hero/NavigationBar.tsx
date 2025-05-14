
import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import MegaMenu from "./MegaMenu";
import { 
  User, 
  Building2, 
  Users,
  CircleDollarSign,
  BarChart,
  HomeIcon,
  Briefcase,
  FileText,
  Database,
  LineChart,
  BookOpen,
  GraduationCap,
  HeartHandshake,
  Clock,
  ChevronDown,
  ChevronUp
} from "lucide-react";

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

type MenuItem = {
  id: string;
  title: string;
  url?: string;
};

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

  // Toggle mega menu
  const handleMenuClick = (menuId: string) => {
    if (activeMegaMenu === menuId) {
      setActiveMegaMenu(null);
    } else {
      setActiveMegaMenu(menuId);
    }
  };

  // Define menu items
  const menuItems = [
    { id: "gioi-thieu", title: "Giới thiệu" },
    { id: "tin-tuc", title: "Tin tức" },
    { id: "doanh-nghiep", title: "Doanh nghiệp" },
    { id: "cam-nang-dau-tu", title: "Cẩm nang đầu tư" },
    { id: "van-ban", title: "Văn bản" },
    { id: "cai-cach-hanh-chinh", title: "Cải cách hành chính" },
    { id: "lien-he", title: "Liên hệ", url: "https://dseza.danang.gov.vn/lien-he/" }
  ];

  // Convert the existing megaMenus data to the new MegaMenu format
  const createMegaMenuConfig = (menuId: string) => {
    switch(menuId) {
      case "gioi-thieu":
        return {
          columns: [
            {
              title: "Giới thiệu chung",
              contents: [
                {
                  title: "Thư ngỏ",
                  url: "/chi-tiet-tin-tuc/thu-ngo/",
                  iconName: "general-partner"
                },
                {
                  title: "Tổng quan về Đà Nẵng",
                  url: "/chi-tiet-tin-tuc/tong-quan-ve-tpda-nang/",
                  iconName: "business-development"
                },
                {
                  title: "Tổng quan về Ban Quản lý",
                  url: "/danh-sach-tin-tuc/gioi-thieu/tong-quan-ve-ban-quan-ly/",
                  iconName: "customer-relationship-management",
                  items: [
                    {
                      title: "Chức năng, nhiệm vụ, quyền hạn Ban Quản lý",
                      url: "/chi-tiet-tin-tuc/chuc-nang-nhiem-vu-quyen-han-ban-quan-ly/"
                    },
                    {
                      title: "Các phòng ban",
                      url: "/chi-tiet-tin-tuc/cac-phong-ban/"
                    },
                    {
                      title: "Đơn vị trực thuộc",
                      url: "/chi-tiet-tin-tuc/don-vi-truc-thuoc/"
                    }
                  ]
                }
              ]
            },
            {
              title: "Các Khu chức năng",
              contents: [
                {
                  title: "Khu công nghệ cao Đà Nẵng",
                  url: "/chi-tiet-tin-tuc/khu-cong-nghe-cao-da-nang/",
                  iconName: "real-estate"
                },
                {
                  title: "Khu thương mại tự do Đà Nẵng",
                  url: "/chi-tiet-tin-tuc/khu-thuong-mai-tu-do-da-nang/",
                  iconName: "private-equity"
                },
                {
                  title: "Khu CNTT tập trung",
                  url: "/chi-tiet-tin-tuc/khu-cong-nghe-thong-tin-tap-trung/",
                  iconName: "venture-capital"
                },
                {
                  title: "Các Khu công nghiệp Đà Nẵng",
                  url: "/danh-sach-tin-tuc/gioi-thieu/khu-hanh-chinh/cac-khu-cong-nghiep-da-nang/",
                  iconName: "corporate-venture-capital",
                  items: [
                    {
                      title: "KCN Hòa Khánh",
                      url: "/chi-tiet-tin-tuc/kcn-hoa-khanh/"
                    },
                    {
                      title: "KCN Liên Chiểu",
                      url: "/chi-tiet-tin-tuc/kcn-lien-chieu/"
                    },
                    {
                      title: "KCN Hòa Cầm",
                      url: "/chi-tiet-tin-tuc/kcn-hoa-cam/"
                    }
                  ]
                }
              ]
            },
            {
              title: "Thành tựu nổi bật",
              contents: [
                {
                  title: "Thành tựu nổi bật của Đà Nẵng",
                  url: "#",
                  iconName: "hedge-fund"
                }
              ],
              specialContent: (
                <div className="p-4 rounded-lg bg-dseza-light-primary-accent dark:bg-dseza-dark-primary-accent text-white mt-4">
                  <h5 className="font-semibold mb-2">Thành tựu đã đạt được</h5>
                  <p className="text-sm">Khu Công nghệ cao và các Khu Công nghiệp Đà Nẵng đã trở thành động lực quan trọng cho sự phát triển của thành phố.</p>
                  <button className="mt-3 bg-white text-dseza-light-primary-accent dark:text-dseza-dark-primary-accent py-2 px-3 rounded text-sm font-medium">Tìm hiểu thêm</button>
                </div>
              )
            }
          ]
        };
      case "tin-tuc":
        return {
          columns: [
            {
              title: "Tin tức | Sự kiện",
              contents: [
                {
                  title: "Đầu tư - Hợp tác Quốc tế",
                  url: "/danh-sach-tin-tuc/tin-tuc/dau-tu-hop-tac-quoc-te/",
                  iconName: "investor-relations"
                },
                {
                  title: "Doanh nghiệp",
                  url: "/danh-sach-tin-tuc/doanh-nghiep/",
                  iconName: "business-development"
                },
                {
                  title: "Chuyển đổi số",
                  url: "/danh-sach-tin-tuc/tin-tuc/chuyen-doi-so/",
                  iconName: "corporate-venture-capital"
                }
              ]
            },
            {
              title: "Xem thêm:",
              contents: [
                {
                  title: "Lịch công tác",
                  url: "/lich-cong-tac/",
                  iconName: "chief-financial-officer"
                },
                {
                  title: "Thông báo",
                  url: "/danh-sach-tin-tuc/thong-bao/",
                  iconName: "private-debt"
                }
              ]
            }
          ]
        };
      case "doanh-nghiep":
        return {
          columns: [
            {
              title: "Báo cáo",
              contents: [
                {
                  title: "Báo cáo trực tuyến về DSEZA",
                  url: "https://external-report.com",
                  iconName: "hedge-fund"
                },
                {
                  title: "Báo cáo giám sát và đánh giá đầu tư",
                  url: "/danh-sach-tin-tuc/doanh-nghiep/bao-cao-giam-sat-va-danh-gia-dau-tu/",
                  iconName: "wealth-management"
                }
              ]
            },
            {
              title: "Xem thêm",
              contents: [
                {
                  title: "Thủ tục | Hồ sơ | Dữ liệu môi trường",
                  url: "/danh-sach-tin-tuc/doanh-nghiep/thu-tuc-ho-so-du-lieu-moi-truong/",
                  iconName: "database"
                }
              ]
            }
          ]
        };
      case "cam-nang-dau-tu":
        return {
          columns: [
            {
              title: "Cẩm nang đầu tư",
              contents: [
                {
                  title: "Khám phá Cẩm nang đầu tư",
                  url: "/danh-sach-tin-tuc/cam-nang-dau-tu/",
                  iconName: "corporate-venture-capital"
                },
                {
                  title: "Cơ hội đầu tư",
                  url: "/co-hoi-dau-tu/",
                  iconName: "private-equity"
                },
                {
                  title: "Quy trình đầu tư",
                  url: "/quy-trinh-dau-tu/",
                  iconName: "ria"
                },
                {
                  title: "Ưu đãi đầu tư",
                  url: "/uu-dai-dau-tu/",
                  iconName: "chief-financial-officer"
                }
              ]
            }
          ]
        };
      case "van-ban":
        return {
          columns: [
            {
              title: "Văn bản Pháp luật",
              contents: [
                {
                  title: "Văn bản pháp quy trung ương",
                  url: "/van-ban/van-ban-phap-quy-tw/",
                  iconName: "private-debt"
                },
                {
                  title: "Văn bản pháp quy địa phương",
                  url: "/van-ban/van-ban-phap-quy-dia-phuong/",
                  iconName: "private-debt"
                },
                {
                  title: "Văn bản chỉ đạo điều hành",
                  url: "/van-ban/van-ban-chi-dao-dieu-hanh/",
                  iconName: "private-debt"
                }
              ]
            },
            {
              title: "Tài liệu & Góp ý",
              contents: [
                {
                  title: "Văn bản hướng dẫn",
                  url: "/danh-sach-tin-tuc/van-ban/van-ban-huong-dan/",
                  iconName: "book-open"
                },
                {
                  title: "Góp ý dự thảo văn bản",
                  url: "/gop-y-du-thao-van-ban/",
                  iconName: "file-text"
                }
              ]
            }
          ]
        };
      case "cai-cach-hanh-chinh":
        return {
          columns: [
            {
              title: "Ứng dụng và dịch vụ",
              contents: [
                {
                  title: "Dịch vụ công trực tuyến",
                  url: "https://dichvucong.danang.gov.vn/web/guest/dich-vu-cong",
                  iconName: "database"
                },
                {
                  title: "Công khai KQ giải quyết TTHC",
                  url: "https://dichvucong.danang.gov.vn/web/guest/thu-tuc-hanh-chinh",
                  iconName: "database"
                },
                {
                  title: "Đặt lịch hẹn giao dịch trực tuyến",
                  url: "http://49.156.54.87/index.php",
                  iconName: "clock"
                }
              ]
            },
            {
              title: "Văn bản CCHC",
              contents: [
                {
                  title: "Thủ tục hành chính",
                  url: "https://dichvucong.danang.gov.vn/web/guest/thu-tuc-hanh-chinh",
                  iconName: "file-text"
                },
                {
                  title: "Mẫu đơn, tờ khai",
                  url: "/mau-don-to-khai/",
                  iconName: "file-text"
                }
              ]
            }
          ]
        };
      default:
        return {
          columns: [
            {
              title: "Menu",
              contents: [
                {
                  title: "No content available",
                  url: "#",
                }
              ]
            }
          ]
        };
    }
  };

  return (
    <div ref={megaMenuRef} className="absolute top-36 left-0 right-0 z-10">
      {/* Main Navigation */}
      <div className="container mx-auto flex justify-center items-center h-16 px-8">
        <nav className="flex items-center">
          {menuItems.map((menu) => (
            menu.url ? (
              <a
                key={menu.id}
                href={menu.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "px-5 py-3 font-medium text-base transition-colors duration-300 rounded-md mx-1",
                  textColor,
                  hoverBgColor
                )}
              >
                {menu.title}
              </a>
            ) : (
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
            )
          ))}
        </nav>
      </div>

      {/* Mega Menu */}
      {activeMegaMenu && (
        <MegaMenu config={createMegaMenuConfig(activeMegaMenu)} />
      )}
    </div>
  );
};

export default NavigationBar;
