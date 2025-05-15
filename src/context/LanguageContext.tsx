
import React, { createContext, useContext, useState } from "react";

type Language = "vi" | "en";

// Define translation structure
interface Translations {
  [key: string]: {
    vi: string;
    en: string;
  };
}

// Common translations
export const translations: Translations = {
  // TopBar translations
  "site.map": {
    vi: "Sơ đồ site",
    en: "Site Map"
  },
  "language.vietnamese": {
    vi: "VIE",
    en: "VIE"
  },
  "language.english": {
    vi: "ENG",
    en: "ENG"
  },

  // Navigation Menu translations
  "nav.introduction": {
    vi: "Giới thiệu",
    en: "Introduction"
  },
  "nav.news": {
    vi: "Tin tức",
    en: "News"
  },
  "nav.business": {
    vi: "Doanh nghiệp",
    en: "Business"
  },
  "nav.investmentGuide": {
    vi: "Cẩm nang đầu tư",
    en: "Investment Guide"
  },
  "nav.documents": {
    vi: "Văn bản",
    en: "Documents"
  },
  "nav.administrativeReform": {
    vi: "Cải cách hành chính",
    en: "Administrative Reform"
  },
  "nav.contact": {
    vi: "Liên hệ",
    en: "Contact"
  },

  // Section titles
  "section.featuredEvents": {
    vi: "SỰ KIỆN TIÊU ĐIỂM",
    en: "FEATURED EVENTS"
  },
  "section.businessesAndPartners": {
    vi: "DOANH NGHIỆP VÀ ĐỐI TÁC",
    en: "BUSINESSES AND PARTNERS"
  },
  "section.functionalZones": {
    vi: "KHU CÔNG NGHỆ CAO, TRUNG TÂM VI MẠCH BÁN DẪN VÀ TRÍ TUỆ NHÂN TẠO,\nCÁC KHU CÔNG NGHIỆP, KHU CNTT TẬP TRUNG, KHU THƯƠNG MẠI TỰ DO",
    en: "HIGH-TECH ZONE, SEMICONDUCTOR AND AI CENTER,\nINDUSTRIAL ZONES, IT CONCENTRATED ZONE, FREE TRADE ZONE"
  },

  // Footer translations
  "footer.management": {
    vi: "Ban Quản lý KCNC & các KCN Đà Nẵng",
    en: "Management Board of Da Nang Hi-Tech Park & Industrial Zones"
  },
  "footer.address": {
    vi: "Địa chỉ: Lô A17, đường Trung tâm, KCNC, xã Hòa Liên, huyện Hòa Vang, Đà Nẵng",
    en: "Address: Lot A17, Center Road, DHTP, Hoa Lien Ward, Hoa Vang District, Da Nang"
  },
  "footer.phone": {
    vi: "SĐT: 0236 3666117",
    en: "Tel: 0236 3666117"
  },
  "footer.reception": {
    vi: "Tiếp nhận hồ sơ: 0236.3666100",
    en: "Document reception: 0236.3666100"
  },
  "footer.email": {
    vi: "Email: dseza@danang.gov.vn",
    en: "Email: dseza@danang.gov.vn"
  },
  "footer.location": {
    vi: "Bản đồ vị trí",
    en: "Location Map"
  },
  "footer.legal": {
    vi: "Thông tin pháp lý",
    en: "Legal Information"
  },
  "footer.trusted": {
    vi: "Tín nhiệm mạng",
    en: "Network Trust"
  },
  "footer.license": {
    vi: "Giấy phép: Số 05/GP-STTTT do Sở TTTT Đà Nẵng cấp ngày 02/01/2020.",
    en: "License: No. 05/GP-STTTT issued by Da Nang Department of Information and Communications on 02/01/2020."
  },
  "footer.editor": {
    vi: "Trưởng Ban biên tập: Trần Văn Tỵ, Phó Trưởng ban BQL KCNC & các KCN Đà Nẵng.",
    en: "Editor-in-Chief: Tran Van Ty, Deputy Head of Management Board of Da Nang HPTP & Industrial Zones."
  },
  "footer.citation": {
    vi: "Trích dẫn & Kết nối",
    en: "Citation & Connect"
  },
  "footer.citationInfo": {
    vi: "Ghi rõ nguồn \"www.dseza.danang.gov.vn\" khi trích dẫn lại thông tin.",
    en: "Please cite \"www.dseza.danang.gov.vn\" when referencing information."
  },
  "footer.copyright": {
    vi: "© 2025 Bản quyền của Ban Quản lý Khu công nghệ cao và các Khu công nghiệp Đà Nẵng",
    en: "© 2025 Copyright of Management Board of Da Nang Hi-Tech Park & Industrial Zones"
  },
  "footer.visits": {
    vi: "Số lượt truy cập:",
    en: "Number of visits:"
  },

  // FunctionalZones translations
  "zones.enterpriseCount": {
    vi: "Doanh nghiệp",
    en: "Enterprises"
  },
  "zones.occupancyRate": {
    vi: "Tỉ lệ lấp đầy:",
    en: "Occupancy rate:"
  },
  "zones.area": {
    vi: "Diện tích:",
    en: "Area:"
  },

  // Common buttons & links
  "button.learnMore": {
    vi: "Tìm hiểu thêm",
    en: "Learn More"
  },
  "button.seeMore": {
    vi: "Xem thêm",
    en: "See More"
  },
  "button.contact": {
    vi: "Liên hệ hỗ trợ",
    en: "Contact Support"
  },
  "button.search": {
    vi: "Tìm kiếm",
    en: "Search"
  },
  "button.access": {
    vi: "Truy cập ngay",
    en: "Access Now"
  },
};

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("vi");

  const toggleLanguage = () => {
    setLanguage(language === "vi" ? "en" : "vi");
  };

  // Translation function
  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    // Return the key if translation is not found, helpful for debugging
    console.warn(`Translation missing for key: ${key} in ${language}`);
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
