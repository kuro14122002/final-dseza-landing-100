
import { useRef, useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, User, Building, Clock, Book, FileText, Library, BookOpen } from 'lucide-react';
import { cn } from "@/lib/utils";
import MegaMenu from './MegaMenu';

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
  title: string;
  url: string;
  megaMenuConfig?: MegaMenuConfigType;
};

const NavigationBar = () => {
  const [activeMenuIndex, setActiveMenuIndex] = useState<number | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // Close the mega menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveMenuIndex(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMenuClick = (index: number) => {
    setActiveMenuIndex(activeMenuIndex === index ? null : index);
  };

  // Menu data structure based on the requirements and images provided
  const menuItems: MenuItem[] = [
    {
      title: "Giới thiệu",
      url: "https://dseza.danang.gov.vn/danh-sach-tin-tuc/gioi-thieu/",
      megaMenuConfig: {
        columns: [
          {
            title: "Giới thiệu chung",
            contents: [
              {
                title: "Thư ngỏ",
                url: "https://dseza.danang.gov.vn/chi-tiet-tin-tuc/thu-ngo/",
                iconName: "general-partner"
              },
              {
                title: "Tổng quan về Đà Nẵng",
                url: "https://dseza.danang.gov.vn/chi-tiet-tin-tuc/tong-quan-ve-tpda-nang/",
                iconName: "real-estate"
              },
              {
                title: "Tổng quan về Ban Quản lý",
                url: "https://dseza.danang.gov.vn/danh-sach-tin-tuc/gioi-thieu/tong-quan-ve-ban-quan-ly/",
                iconName: "building"
              },
              {
                title: "Chức năng, nhiệm vụ, quyền hạn Ban Quản lý",
                url: "https://dseza.danang.gov.vn/chi-tiet-tin-tuc/chuc-nang-nhiem-vu-quyen-han-ban-quan-ly/",
                iconName: "file-text"
              },
              {
                title: "Các phòng ban",
                url: "https://dseza.danang.gov.vn/chi-tiet-tin-tuc/cac-phong-ban/",
                iconName: "customer-relationship-management"
              },
              {
                title: "Đơn vị trực thuộc",
                url: "https://dseza.danang.gov.vn/chi-tiet-tin-tuc/don-vi-truc-thuoc/",
                iconName: "user-square"
              },
            ]
          },
          {
            title: "Các Khu chức năng",
            contents: [
              {
                title: "Khu công nghệ cao Đà Nẵng",
                url: "https://dseza.danang.gov.vn/chi-tiet-tin-tuc/khu-cong-nghe-cao-da-nang/",
                iconName: "venture-capital"
              },
              {
                title: "Khu thương mại tự do Đà Nẵng",
                url: "https://dseza.danang.gov.vn/chi-tiet-tin-tuc/khu-thuong-mai-tu-do-da-nang/",
                iconName: "business-development"
              },
              {
                title: "Khu CNTT tập trung",
                url: "https://dseza.danang.gov.vn/chi-tiet-tin-tuc/khu-cong-nghe-thong-tin-tap-trung/",
                iconName: "file-spreadsheet"
              },
              {
                title: "Các Khu công nghiệp Đà Nẵng",
                url: "https://dseza.danang.gov.vn/danh-sach-tin-tuc/gioi-thieu/khu-hanh-chinh/cac-khu-cong-nghiep-da-nang/",
                iconName: "building",
                items: [
                  {
                    title: "Khu công nghiệp Hòa ninh",
                    url: "https://dseza.danang.gov.vn/chi-tiet-tin-tuc/khu-cong-nghiep-hoa-ninh/"
                  },
                  {
                    title: "Khu công nghiệp Hòa Khánh",
                    url: "https://dseza.danang.gov.vn/chi-tiet-tin-tuc/khu-cong-nghiep-hoa-khanh/"
                  },
                  {
                    title: "Khu công nghiệp Hòa Khánh mở rộng",
                    url: "https://dseza.danang.gov.vn/chi-tiet-tin-tuc/khu-cong-nghiep-hoa-khanh-mo-rong/"
                  },
                  {
                    title: "Khu công nghiệp Hòa Cầm",
                    url: "https://dseza.danang.gov.vn/chi-tiet-tin-tuc/khu-cong-nghiep-hoa-cam/"
                  },
                  {
                    title: "Khu công nghiệp Liên Chiểu",
                    url: "https://dseza.danang.gov.vn/chi-tiet-tin-tuc/khu-cong-nghiep-lien-chieu/"
                  },
                  {
                    title: "Khu công nghiệp Dịch vụ Thủy sản Đà Nẵng",
                    url: "https://dseza.danang.gov.vn/chi-tiet-tin-tuc/khu-cong-nghiep-dich-vu-thuy-san-da-nang/"
                  },
                  {
                    title: "Khu công nghiệp Đà Nẵng",
                    url: "https://dseza.danang.gov.vn/chi-tiet-tin-tuc/khu-cong-nghiep-da-nang/"
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
                iconName: "chart"
              }
            ],
            specialContent: (
              <div className="p-4 rounded-lg bg-green-600 text-white mt-4">
                <h5 className="font-semibold mb-2">Thành tựu đã đạt được</h5>
                <p className="text-sm">Khu Công nghệ cao và các Khu Công nghiệp Đà Nẵng đã trở thành động lực quan trọng cho sự phát triển của thành phố.</p>
                <button className="mt-3 bg-white text-green-600 py-2 px-3 rounded text-sm font-medium">Tìm hiểu thêm</button>
              </div>
            )
          }
        ]
      }
    },
    {
      title: "Tin tức",
      url: "https://dseza.danang.gov.vn/danh-sach-tin-tuc/tin-tuc/",
      megaMenuConfig: {
        columns: [
          {
            title: "Tin tức | Sự kiện",
            contents: [
              {
                title: "Đầu tư - Hợp tác Quốc tế",
                url: "https://dseza.danang.gov.vn/danh-sach-tin-tuc/tin-tuc/dau-tu-hop-tac-quoc-te/",
                iconName: "file-spreadsheet"
              },
              {
                title: "Doanh nghiệp",
                url: "#",
                iconName: "business-development"
              },
              {
                title: "Chuyển đổi số",
                url: "https://dseza.danang.gov.vn/danh-sach-tin-tuc/tin-tuc/chuyen-doi-so/",
                iconName: "file-pie"
              },
              {
                title: "Đào tạo, Ươm tạo Khởi nghiệp",
                url: "https://dseza.danang.gov.vn/danh-sach-tin-tuc/tin-tuc/dao-tao-uom-tao-khoi-nghiep/",
                iconName: "customer-relationship-management"
              },
              {
                title: "Hoạt động Ban Quản lý",
                url: "https://dseza.danang.gov.vn/danh-sach-tin-tuc/tin-tuc/hoat-dong-ban-quan-ly/",
                iconName: "user-square"
              },
              {
                title: "Tin khác",
                url: "https://dseza.danang.gov.vn/danh-sach-tin-tuc/tin-tuc/tin-khac/",
                iconName: "newspaper"
              }
            ]
          },
          {
            title: "Xem thêm",
            contents: [
              {
                title: "Lịch công tác",
                url: "https://dseza.danang.gov.vn/lich-cong-tac/",
                iconName: "calendar"
              },
              {
                title: "Thông báo",
                url: "https://dseza.danang.gov.vn/danh-sach-tin-tuc/thong-bao/",
                iconName: "bell"
              },
              {
                title: "Thông tin báo chí",
                url: "https://dseza.danang.gov.vn/danh-sach-tin-tuc/tin-tuc/thong-tin-bao-chi/",
                iconName: "newspaper"
              }
            ]
          },
          {
            title: "Tin nổi bật",
            contents: [],
            specialContent: (
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                <img 
                  src="https://picsum.photos/400/200" 
                  alt="Featured news" 
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <h5 className="font-semibold text-sm mb-2 line-clamp-2">Tin tức mới nhất về hoạt động của Ban quản lý</h5>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">Cập nhật thông tin mới nhất về các hoạt động và sự kiện quan trọng.</p>
                  <a href="#" className="text-green-600 dark:text-green-500 text-xs font-medium">Xem thêm →</a>
                </div>
              </div>
            )
          }
        ]
      }
    },
    {
      title: "Doanh nghiệp",
      url: "https://dseza.danang.gov.vn/danh-sach-tin-tuc/doanh-nghiep/",
      megaMenuConfig: {
        columns: [
          {
            title: "Báo cáo & Dữ liệu",
            contents: [
              {
                title: "Báo cáo trực tuyến về DSEZA",
                url: "https://maps.dhpiza.vn/login?ReturnUrl=%2Fadmin%2Fbaocaonhadautu%2Fyeucaubaocao",
                iconName: "file-pie"
              },
              {
                title: "Báo cáo giám sát và đánh giá đầu tư",
                url: "https://dseza.danang.gov.vn/danh-sach-tin-tuc/doanh-nghiep/bao-cao-giam-sat-va-danh-gia-dau-tu/",
                iconName: "file-spreadsheet"
              },
              {
                title: "Mẫu | Bảng biểu báo cáo",
                url: "https://dseza.danang.gov.vn/danh-sach-tin-tuc/doanh-nghiep/mau-bang-bieu-bao-cao/",
                iconName: "file-text"
              }
            ]
          },
          {
            title: "Thông tin Doanh nghiệp",
            contents: [
              {
                title: "Thủ tục | Hồ sơ | Dữ liệu môi trường",
                url: "https://dseza.danang.gov.vn/danh-sach-tin-tuc/doanh-nghiep/thu-tuc-ho-so-du-lieu-moi-truong/",
                iconName: "file-search"
              },
              {
                title: "Thống kê doanh nghiệp",
                url: "https://dseza.danang.gov.vn/thong-ke-doanh-nghiep/",
                iconName: "chart"
              },
              {
                title: "Tuyển dụng",
                url: "https://dseza.danang.gov.vn/danh-sach-tin-tuc/doanh-nghiep/tuyen-dung/",
                iconName: "user-square"
              }
            ]
          },
          {
            title: "Hỗ trợ doanh nghiệp",
            contents: [],
            specialContent: (
              <div className="p-4 rounded-lg bg-green-600/10 dark:bg-green-600/20 mt-4">
                <h5 className="font-semibold mb-2 text-green-600 dark:text-green-500">Dịch vụ hỗ trợ</h5>
                <p className="text-sm">Chúng tôi cung cấp nhiều dịch vụ hỗ trợ cho doanh nghiệp trong các Khu công nghiệp.</p>
                <button className="mt-3 bg-green-600 text-white py-2 px-3 rounded text-sm font-medium">Liên hệ hỗ trợ</button>
              </div>
            )
          }
        ]
      }
    },
    {
      title: "Cẩm nang đầu tư",
      url: "https://dseza.danang.gov.vn/danh-sach-tin-tuc/cam-nang-dau-tu/",
      megaMenuConfig: {
        columns: [
          {
            title: "Thông tin đầu tư",
            contents: [
              {
                title: "Hướng dẫn đầu tư",
                url: "#",
                iconName: "customer-relationship-management"
              },
              {
                title: "Chính sách ưu đãi",
                url: "#",
                iconName: "chief-financial-officer"
              },
              {
                title: "Quy trình đầu tư",
                url: "#",
                iconName: "file-text"
              },
              {
                title: "Các mô hình đầu tư",
                url: "#",
                iconName: "business-development"
              }
            ]
          },
          {
            title: "Tài liệu tham khảo",
            contents: [
              {
                title: "Báo cáo thường niên",
                url: "#",
                iconName: "file-spreadsheet"
              },
              {
                title: "Tài liệu thu hút đầu tư",
                url: "#",
                iconName: "chart"
              },
              {
                title: "Thông tin thị trường",
                url: "#",
                iconName: "hedge-fund"
              }
            ]
          }
        ]
      }
    },
    {
      title: "Văn bản",
      url: "https://dseza.danang.gov.vn/van-ban/",
      megaMenuConfig: {
        columns: [
          {
            title: "Văn bản Pháp luật",
            contents: [
              {
                title: "Văn bản pháp quy trung ương",
                url: "https://dseza.danang.gov.vn/van-ban/van-ban-phap-quy-tw/",
                iconName: "user-square"
              },
              {
                title: "Văn bản pháp quy địa phương",
                url: "https://dseza.danang.gov.vn/van-ban/van-ban-phap-quy-dia-phuong/",
                iconName: "real-estate"
              },
              {
                title: "Văn bản chỉ đạo điều hành",
                url: "https://dseza.danang.gov.vn/van-ban/van-ban-chi-dao-dieu-hanh/",
                iconName: "file-text"
              },
              {
                title: "Văn bản CCHC",
                url: "https://dseza.danang.gov.vn/danh-sach-tin-tuc/van-ban/van-ban-cai-cach-hanh-chinh/",
                iconName: "scroll"
              }
            ]
          },
          {
            title: "Hướng dẫn & Góp ý",
            contents: [
              {
                title: "Văn bản hướng dẫn",
                url: "https://dseza.danang.gov.vn/danh-sach-tin-tuc/van-ban/van-ban-huong-dan/",
                iconName: "customer-relationship-management"
              },
              {
                title: "Góp ý dự thảo văn bản",
                url: "https://dseza.danang.gov.vn/gop-y-du-thao-van-ban/",
                iconName: "user-square"
              }
            ]
          },
          {
            title: "Tra cứu văn bản",
            contents: [
              {
                title: "Hệ thống tra cứu văn bản",
                url: "#",
                iconName: "file-search"
              }
            ],
            specialContent: (
              <div className="mt-4 p-4 border rounded-lg">
                <h5 className="font-semibold mb-2">Tra cứu văn bản nhanh</h5>
                <input 
                  type="text" 
                  placeholder="Nhập từ khóa tìm kiếm..."
                  className="w-full px-3 py-2 border rounded mt-2 mb-2 dark:bg-gray-800 dark:border-gray-700"
                />
                <button className="w-full bg-green-600 text-white py-2 rounded text-sm font-medium">
                  Tìm kiếm
                </button>
              </div>
            )
          }
        ]
      }
    },
    {
      title: "Cải cách hành chính",
      url: "https://dseza.danang.gov.vn/danh-sach-tin-tuc/moi-truong-dau-tu/cai-cach-hanh-chinh/",
      megaMenuConfig: {
        columns: [
          {
            title: "Ứng dụng & Dịch vụ",
            contents: [
              {
                title: "Dịch vụ công trực tuyến",
                url: "https://dichvucong.danang.gov.vn/",
                iconName: "file-pie"
              },
              {
                title: "Bưu chính công ích",
                url: "https://egov.danang.gov.vn/dailyDVc",
                iconName: "business-development"
              },
              {
                title: "Tra cứu hồ sơ",
                url: "https://dichvucong.danang.gov.vn/web/guest/tra-cuu-ho-so",
                iconName: "file-search"
              },
              {
                title: "Đặt lịch hẹn giao dịch trực tuyến",
                url: "http://49.156.54.87/index.php?option=com_hengio&view=hengioonline&task=formdangkyonline&tmpl=widget",
                iconName: "clock"
              },
              {
                title: "Đánh giá chất lượng dịch vụ HCC",
                url: "https://dichvucong.danang.gov.vn/web/guest/-anh-gia",
                iconName: "gauge"
              }
            ]
          },
          {
            title: "Thông tin & Quy trình",
            contents: [
              {
                title: "Thủ tục hành chính",
                url: "https://dichvucong.danang.gov.vn/",
                iconName: "file-spreadsheet"
              },
              {
                title: "Quy trình thực hiện thủ tục hành chính",
                url: "https://dseza.danang.gov.vn/danh-sach-tin-tuc/danh-cho-nha-dau-tu/quy-trinh-thuc-hien-thu-tuc-hanh-chinh/",
                iconName: "chart"
              },
              {
                title: "Quy trình lĩnh vực đầu tư",
                url: "https://dseza.danang.gov.vn/danh-sach-tin-tuc/danh-cho-nha-dau-tu/quy-trinh-linh-vuc-dau-tu/",
                iconName: "user-square"
              },
              {
                title: "Văn bản cải cách hành chính",
                url: "https://dseza.danang.gov.vn/danh-sach-tin-tuc/van-ban/van-ban-cai-cach-hanh-chinh/",
                iconName: "scroll"
              }
            ]
          },
          {
            title: "Dịch vụ công nổi bật",
            contents: [],
            specialContent: (
              <div className="mt-4 p-4 bg-green-600 text-white rounded-lg">
                <h5 className="font-semibold mb-2">Dịch vụ công nổi bật</h5>
                <p className="text-sm mb-3">Trải nghiệm dịch vụ công trực tuyến tại Ban quản lý Khu công nghệ cao và các Khu công nghiệp Đà Nẵng</p>
                <a 
                  href="https://dichvucong.danang.gov.vn/" 
                  className="inline-block bg-white text-green-600 py-2 px-4 rounded text-sm font-medium"
                >
                  Truy cập ngay
                </a>
              </div>
            )
          }
        ]
      }
    },
    {
      title: "Liên hệ",
      url: "https://dseza.danang.gov.vn/lien-he/",
      // No mega menu for this item
    }
  ];

  return (
    <nav ref={navRef} className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-6">
        <ul className="flex justify-center gap-x-8">
          {menuItems.map((item, index) => (
            <li key={index} className="relative py-3">
              <button 
                className={cn(
                  "flex items-center font-medium text-base transition-colors",
                  activeMenuIndex === index 
                    ? "text-green-600 dark:text-green-500" 
                    : "hover:text-green-600 dark:hover:text-green-500"
                )}
                onClick={() => handleMenuClick(index)}
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
              {activeMenuIndex === index && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600 dark:bg-green-500"></span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Mega Menu */}
      {activeMenuIndex !== null && menuItems[activeMenuIndex].megaMenuConfig && (
        <MegaMenu config={menuItems[activeMenuIndex].megaMenuConfig} />
      )}
    </nav>
  );
};

export default NavigationBar;
