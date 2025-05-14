
import React from "react";
import { MegaMenuConfigType, MenuItem } from "../types/megaMenu.types";

// Define menu items with their configurations
export const menuItems: MenuItem[] = [
  {
    id: "gioi-thieu",
    title: "Giới thiệu",
    config: {
      columns: [
        {
          title: "Giới thiệu",
          contents: [
            {
              title: "Thư ngỏ",
              url: "/chi-tiet-tin-tuc/thu-ngo/",
              iconName: "business-development",
            },
            {
              title: "Tổng quan về Đà Nẵng",
              url: "/chi-tiet-tin-tuc/tong-quan-ve-tpda-nang/",
              iconName: "real-estate",
            },
            {
              title: "Tổng quan về Ban Quản lý",
              url: "/danh-sach-tin-tuc/gioi-thieu/tong-quan-ve-ban-quan-ly/",
              iconName: "general-partner",
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
          ],
        },
        {
          title: "Khu hành chính",
          contents: [
            {
              title: "Khu công nghệ cao Đà Nẵng",
              url: "/chi-tiet-tin-tuc/khu-cong-nghe-cao-da-nang/",
              iconName: "corporate-venture-capital",
            },
            {
              title: "Khu thương mại tự do Đà Nẵng",
              url: "/chi-tiet-tin-tuc/khu-thuong-mai-tu-do-da-nang/",
              iconName: "private-equity",
            },
            {
              title: "Khu CNTT tập trung",
              url: "/chi-tiet-tin-tuc/khu-cong-nghe-thong-tin-tap-trung/",
              iconName: "private-debt",
            },
            {
              title: "Các Khu công nghiệp Đà Nẵng",
              url: "/danh-sach-tin-tuc/gioi-thieu/khu-hanh-chinh/cac-khu-cong-nghiep-da-nang/",
              iconName: "business-development",
              items: [
                { title: "KCN Hòa Khánh", url: "/chi-tiet-tin-tuc/kcn-hoa-khanh/" },
                { title: "KCN Liên Chiểu", url: "/chi-tiet-tin-tuc/kcn-lien-chieu/" },
                { title: "KCN Hòa Cầm", url: "/chi-tiet-tin-tuc/kcn-hoa-cam/" }
              ]
            }
          ],
        }
      ]
    }
  },
  {
    id: "tin-tuc",
    title: "Tin tức",
    config: {
      columns: [
        {
          title: "Tin tức | Sự kiện",
          contents: [
            {
              title: "Đầu tư - Hợp tác Quốc tế",
              url: "/danh-sach-tin-tuc/tin-tuc/dau-tu-hop-tac-quoc-te/",
              iconName: "investor-relations",
            },
            {
              title: "Doanh nghiệp",
              url: "/danh-sach-tin-tuc/doanh-nghiep/",
              iconName: "customer-relationship-management",
            },
            {
              title: "Chuyển đổi số",
              url: "/danh-sach-tin-tuc/tin-tuc/chuyen-doi-so/",
              iconName: "corporate-venture-capital",
            }
          ],
        },
        {
          title: "Xem thêm:",
          contents: [
            {
              title: "Lịch công tác",
              url: "/lich-cong-tac/",
              iconName: "investor-relations",
            },
            {
              title: "Thông báo",
              url: "/danh-sach-tin-tuc/thong-bao/",
              iconName: "chief-financial-officer",
            }
          ],
        }
      ]
    }
  },
  {
    id: "doanh-nghiep",
    title: "Doanh nghiệp",
    config: {
      columns: [
        {
          title: "Báo cáo",
          contents: [
            {
              title: "Báo cáo trực tuyến về DSEZA",
              url: "https://external-report.com",
              iconName: "venture-capital",
            },
            {
              title: "Báo cáo giám sát và đánh giá đầu tư",
              url: "/danh-sach-tin-tuc/doanh-nghiep/bao-cao-giam-sat-va-danh-gia-dau-tu/",
              iconName: "chief-financial-officer",
            }
          ],
        },
        {
          title: "Xem thêm",
          contents: [
            {
              title: "Thủ tục | Hồ sơ | Dữ liệu môi trường",
              url: "/danh-sach-tin-tuc/doanh-nghiep/thu-tuc-ho-so-du-lieu-moi-truong/",
              iconName: "family-offices",
            }
          ],
        }
      ]
    }
  },
  {
    id: "cam-nang-dau-tu",
    title: "Cẩm nang đầu tư",
    config: {
      columns: [
        {
          title: "Cẩm nang đầu tư",
          contents: [
            {
              title: "Khám phá Cẩm nang đầu tư",
              url: "/danh-sach-tin-tuc/cam-nang-dau-tu/",
              iconName: "business-development",
            },
            {
              title: "Cơ hội đầu tư",
              url: "/co-hoi-dau-tu/",
              iconName: "private-equity",
            },
            {
              title: "Quy trình đầu tư",
              url: "/quy-trinh-dau-tu/",
              iconName: "wealth-management",
            },
            {
              title: "Ưu đãi đầu tư",
              url: "/uu-dai-dau-tu/",
              iconName: "private-debt",
            }
          ],
        }
      ]
    }
  },
  {
    id: "van-ban",
    title: "Văn bản",
    config: {
      columns: [
        {
          title: "Văn bản Pháp luật",
          contents: [
            {
              title: "Văn bản pháp quy trung ương",
              url: "/van-ban/van-ban-phap-quy-tw/",
              iconName: "hedge-fund",
            },
            {
              title: "Văn bản pháp quy địa phương",
              url: "/van-ban/van-ban-phap-quy-dia-phuong/",
              iconName: "hedge-fund",
            },
            {
              title: "Văn bản chỉ đạo điều hành",
              url: "/van-ban/van-ban-chi-dao-dieu-hanh/",
              iconName: "hedge-fund",
            }
          ],
        },
        {
          title: "Tài liệu & Góp ý",
          contents: [
            {
              title: "Văn bản hướng dẫn",
              url: "/danh-sach-tin-tuc/van-ban/van-ban-huong-dan/",
              iconName: "ria",
            },
            {
              title: "Góp ý dự thảo văn bản",
              url: "/gop-y-du-thao-van-ban/",
              iconName: "ria",
            }
          ],
        }
      ]
    }
  },
  {
    id: "cai-cach-hanh-chinh",
    title: "Cải cách hành chính",
    config: {
      columns: [
        {
          title: "Ứng dụng và dịch vụ",
          contents: [
            {
              title: "Dịch vụ công trực tuyến",
              url: "https://dichvucong.danang.gov.vn/web/guest/dich-vu-cong",
              iconName: "wealth-management",
            },
            {
              title: "Công khai KQ giải quyết TTHC",
              url: "https://dichvucong.danang.gov.vn/web/guest/thu-tuc-hanh-chinh",
              iconName: "database",
            },
            {
              title: "Đặt lịch hẹn giao dịch trực tuyến",
              url: "http://49.156.54.87/index.php",
              iconName: "investor-relations",
            }
          ],
        },
        {
          title: "Văn bản CCHC",
          contents: [
            {
              title: "Thủ tục hành chính",
              url: "https://dichvucong.danang.gov.vn/web/guest/thu-tuc-hanh-chinh",
              iconName: "private-debt",
            },
            {
              title: "Mẫu đơn, tờ khai",
              url: "/mau-don-to-khai/",
              iconName: "private-debt",
            }
          ],
        }
      ]
    }
  }
];
