import { useLanguage } from "@/context/LanguageContext";

// Translation type definition
type TranslationObject = {
  [key: string]: string | TranslationObject | string[];
};

// Translation objects for Vietnamese and English
const viTranslations: TranslationObject = {
  // Common
  sitemap: "Sơ đồ site",
  
  // Nav Items
  nav: {
    intro: "Giới thiệu",
    news: "Tin tức",
    business: "Doanh nghiệp",
    services: "Dịch vụ",
    investments: "Đầu tư",
    contact: "Liên hệ",
    investmentGuide: "Cẩm nang đầu tư",
    documents: "Văn bản",
    adminReform: "Cải cách hành chính",
  },
  
  // Home Sections
  homepage: {
    featuredEvents: "SỰ KIỆN NỔI BẬT",
    latestNews: "TIN TỨC MỚI NHẤT",
    viewAll: "Xem tất cả",
    functionalZones: "CÁC KHU CHỨC NĂNG",
    investmentInfo: "THÔNG TIN ĐẦU TƯ",
    location: "VỊ TRÍ",
    resources: "TÀI NGUYÊN",
    businessesAndPartners: "DOANH NGHIỆP & ĐỐI TÁC",
  },
  
  // Investment Information Section
  investment: {
    forInvestors: "Dành cho nhà đầu tư",
    investmentEnvironment: "Môi trường đầu tư",
    investmentProcedures: "Thủ tục đầu tư",
    incentives: "Ưu đãi đầu tư",
    services: "Dịch vụ tiện ích",
    workforce: "Nguồn nhân lực",
    infrastructure: "Cơ sở hạ tầng",
    environment: "Môi trường",
  },
  
  // Footer
  footer: {
    management: "Ban Quản lý Khu công nghệ cao và các Khu công nghiệp Đà Nẵng",
    address: "Địa chỉ: Tòa nhà Danang Business Incubator, số 15 Đường Nam Trân, Phường Hòa Cường Bắc, Quận Hải Châu, Thành phố Đà Nẵng",
    tel: "Điện thoại",
    fax: "Fax",
    email: "Email",
    copyright: "Bản quyền © 2023 DSEZA. Đã đăng ký bản quyền.",
    legalInfo: "Thông tin pháp lý",
    networkCredibility: "Tín nhiệm mạng",
    license: "Giấy phép: Số 05/GP-STTTT do Sở TTTT Đà Nẵng cấp ngày 02/01/2020.",
    editor: "Trưởng Ban biên tập: Trần Văn Tỵ, Phó Trưởng ban BQL KCNC & các KCN Đà Nẵng.",
    citationConnect: "Trích dẫn & Kết nối",
    citationNote: "Ghi rõ nguồn \"www.dseza.danang.gov.vn\" khi trích dẫn lại thông tin.",
    visitorCount: "Số lượt truy cập",
  },
  
  // Date formatting
  date: {
    dayNames: ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"],
  },

  // Location Section
  location: {
    title: "BẢN ĐỒ VỊ TRÍ",
    vrTour: "VR 360 Tour - Khu CNC Đà Nẵng",
    digitalMap: "Bản đồ số khu CNC + Các KCN Đà Nẵng + Báo cáo trực tuyến",
    digitalMapTitle: "Bản đồ số và Báo cáo Đầu tư",
    digitalMapDescription: "Bản đồ tương tác với dữ liệu chi tiết về các khu công nghiệp, vị trí các doanh nghiệp và thông tin đầu tư.",
    accessDigitalMap: "Truy cập Bản đồ số",
  },
  
  // News Section
  news: {
    title: "TIN TỨC",
    categories: {
      investment: "Đầu tư – Hợp tác quốc tế",
      training: "Đào tạo, Ươm tạo khởi nghiệp",
      digital: "Chuyển đổi số",
      management: "Hoạt động Ban quản lý",
      other: "Tin khác",
    }
  },
  
  // Functional Zones Section
  functionalZones: {
    title: "KHU CÔNG NGHỆ CAO, TRUNG TÂM VI MẠCH BÁN DẪN VÀ TRÍ TUỆ NHÂN TẠO, CÁC KHU CÔNG NGHIỆP, KHU CNTT TẬP TRUNG, KHU THƯƠNG MẠI TỰ DO",
    enterprises: "Doanh nghiệp",
    occupancyRate: "Tỉ lệ lấp đầy",
    area: "Diện tích",
  },

  // Quick Access Buttons
  quickAccess: {
    onlinePublicService: "Dịch vụ công trực tuyến",
    administrativeProcedures: "Thủ tục hành chính",
    publicResults: "Công khai KQ giải quyết TTHC",
    feedbackChannel: "Kênh thông tin tiếp nhận phản ánh, kiến nghị",
    appointmentScheduling: "Đặt lịch hẹn giao dịch trực tuyến",
  },

  // Featured Events
  featuredEvents: {
    title: "SỰ KIỆN TIÊU ĐIỂM",
    eventPrefix: "Sự kiện nổi bật",
  },

  // Hero Background Tabs
  heroBackground: {
    tab1: "Khu công nghệ cao Đà Nẵng",
    tab2: "Khu thương mại tự do Đà Nẵng",
    tab3: "Khu công nghệ thông tin tập trung",
    tab4: "Các Khu công nghiệp Đà Nẵng",
  },

  // Special content in navigation menu
  menuSpecial: {
    achievementTitle: "Thành tựu đã đạt được",
    achievementDesc: "Khu Công nghệ cao và các Khu Công nghiệp Đà Nẵng đã trở thành động lực quan trọng cho sự phát triển của thành phố.",
    achievementBtn: "Tìm hiểu thêm",
    featuredServiceTitle: "Dịch vụ công nổi bật",
    featuredServiceDesc: "Trải nghiệm dịch vụ công trực tuyến tại Ban quản lý Khu công nghệ cao và các Khu công nghiệp Đà Nẵng",
    featuredServiceBtn: "Truy cập ngay",
    quickDocSearchTitle: "Tra cứu văn bản nhanh",
    quickDocSearchPlaceholder: "Nhập từ khóa tìm kiếm...",
    quickDocSearchBtn: "Tìm kiếm",
    supportServiceTitle: "Dịch vụ hỗ trợ",
    supportServiceDesc: "Chúng tôi cung cấp nhiều dịch vụ hỗ trợ cho doanh nghiệp trong các Khu công nghiệp.",
    supportServiceBtn: "Liên hệ hỗ trợ",
    newsCardTitle: "Tin tức mới nhất về hoạt động của Ban quản lý",
    newsCardDesc: "Cập nhật thông tin mới nhất về các hoạt động và sự kiện quan trọng.",
    newsCardBtn: "Xem thêm →",
  },
};

const enTranslations: TranslationObject = {
  // Common
  sitemap: "Site Map",
  
  // Nav Items
  nav: {
    intro: "Introduction",
    news: "News",
    business: "Business",
    services: "Services",
    investments: "Investments",
    contact: "Contact",
    investmentGuide: "Investment Guide",
    documents: "Documents",
    adminReform: "Administrative Reform",
  },
  
  // Home Sections
  homepage: {
    featuredEvents: "FEATURED EVENTS",
    latestNews: "LATEST NEWS",
    viewAll: "View all",
    functionalZones: "FUNCTIONAL ZONES",
    investmentInfo: "INVESTMENT INFORMATION",
    location: "LOCATION",
    resources: "RESOURCES",
    businessesAndPartners: "BUSINESSES & PARTNERS",
  },
  
  // Investment Information Section
  investment: {
    forInvestors: "For Investors",
    investmentEnvironment: "Investment Environment",
    investmentProcedures: "Investment Procedures",
    incentives: "Investment Incentives",
    services: "Utilities & Services",
    workforce: "Human Resources",
    infrastructure: "Infrastructure",
    environment: "Environment",
  },
  
  // Footer
  footer: {
    management: "Danang High-Tech Park and Industrial Zones Authority",
    address: "Address: Danang Business Incubator Building, 15 Nam Tran Street, Hoa Cuong Bac Ward, Hai Chau District, Danang City",
    tel: "Tel",
    fax: "Fax",
    email: "Email",
    copyright: "Copyright © 2023 DSEZA. All rights reserved.",
    legalInfo: "Legal Information",
    networkCredibility: "Network Credibility",
    license: "License: No. 05/GP-STTTT issued by Danang Department of Information and Communications on 01/02/2020.",
    editor: "Editor in Chief: Tran Van Ty, Deputy Director of Danang High-Tech Park and Industrial Zones Authority.",
    citationConnect: "Citation & Connect",
    citationNote: "Please cite \"www.dseza.danang.gov.vn\" when referencing our information.",
    visitorCount: "Visitor count",
  },
  
  // Date formatting
  date: {
    dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  },

  // Location Section
  location: {
    title: "LOCATION MAP",
    vrTour: "VR 360 Tour - Danang High-Tech Park",
    digitalMap: "Digital Map of High-Tech Park + Industrial Zones + Online Reports",
    digitalMapTitle: "Digital Map and Investment Reports",
    digitalMapDescription: "Interactive map with detailed data about industrial zones, business locations, and investment information.",
    accessDigitalMap: "Access Digital Map",
  },
  
  // News Section
  news: {
    title: "NEWS",
    categories: {
      investment: "Investment & International Cooperation",
      training: "Training & Business Incubation",
      digital: "Digital Transformation",
      management: "Management Activities",
      other: "Other News",
    }
  },
  
  // Functional Zones Section
  functionalZones: {
    title: "HIGH-TECH PARK, SEMICONDUCTOR & AI CENTER, INDUSTRIAL ZONES, IT ZONES, FREE TRADE ZONE",
    enterprises: "Enterprises",
    occupancyRate: "Occupancy Rate",
    area: "Area",
  },

  // Quick Access Buttons
  quickAccess: {
    onlinePublicService: "Online Public Services",
    administrativeProcedures: "Administrative Procedures",
    publicResults: "Public Administrative Results",
    feedbackChannel: "Feedback & Suggestion Channel",
    appointmentScheduling: "Online Appointment Scheduling",
  },

  // Featured Events
  featuredEvents: {
    title: "FEATURED EVENTS",
    eventPrefix: "Featured event",
  },

  // Hero Background Tabs
  heroBackground: {
    tab1: "Danang High-Tech Park",
    tab2: "Danang Free Trade Zone",
    tab3: "Concentrated IT Zone",
    tab4: "Danang Industrial Zones",
  },

  // Special content in navigation menu
  menuSpecial: {
    achievementTitle: "Outstanding Achievements",
    achievementDesc: "Danang High-Tech Park and Industrial Zones have become a key driving force for the city's development.",
    achievementBtn: "Learn more",
    featuredServiceTitle: "Featured Public Services",
    featuredServiceDesc: "Experience online public services at the Danang High-Tech Park and Industrial Zones Authority",
    featuredServiceBtn: "Access now",
    quickDocSearchTitle: "Quick Document Search",
    quickDocSearchPlaceholder: "Enter search keywords...",
    quickDocSearchBtn: "Search",
    supportServiceTitle: "Support Services",
    supportServiceDesc: "We provide a variety of support services for businesses in the industrial zones.",
    supportServiceBtn: "Contact support",
    newsCardTitle: "Latest news on Management Authority activities",
    newsCardDesc: "Get the latest updates on important activities and events.",
    newsCardBtn: "See more →",
  },
};

// All translations
const translations = {
  vi: viTranslations,
  en: enTranslations,
};

/**
 * Gets the value from a nested object using a dot-notation path
 * @param obj - The object to get the value from
 * @param path - The path to the value (e.g., "nav.intro")
 * @returns The value at the path or undefined if not found
 */
const getNestedValue = (obj: any, path: string): string | undefined => {
  const keys = path.split('.');
  let value = obj;
  
  for (const key of keys) {
    if (value === undefined || value === null) {
      return undefined;
    }
    value = value[key];
  }
  
  return typeof value === 'string' ? value : undefined;
};

/**
 * Hook to get translations based on the current language
 * @returns An object with t function to get translations
 */
export const useTranslation = () => {
  const { language } = useLanguage();
  
  /**
   * Get a translation by key
   * @param key - The translation key (can be a dot notation for nested keys)
   * @returns The translated string or the key itself if not found
   */
  const t = (key: string): string => {
    const translationSet = translations[language];
    const translation = getNestedValue(translationSet, key);
    return translation || key;
  };
  
  return { t, language };
};

/**
 * Formats a date according to the current language
 * @param date - The date to format
 * @returns A formatted date string
 */
export const formatDate = (date: Date): string => {
  const { language } = useLanguage();
  const translationSet = language === 'vi' ? viTranslations : enTranslations;
  
  // Ensure we can access the dayNames array safely
  const dateTranslation = translationSet.date as TranslationObject;
  const dayNames = dateTranslation.dayNames as string[];
  
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  
  if (language === 'vi') {
    // Vietnamese format: Thứ Ba, 01/01/2023
    return `${dayNames[date.getDay()]}, ${day}/${month}/${year}`;
  } else {
    // English format: Tuesday, Jan 01, 2023
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${dayNames[date.getDay()]}, ${monthNames[date.getMonth()]} ${day}, ${year}`;
  }
}; 