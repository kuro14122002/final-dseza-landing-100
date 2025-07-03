import { useLanguage } from "@/context/LanguageContext";

// Translation type definition
type TranslationObject = {
  [key: string]: string | TranslationObject | string[];
};

// Translation objects for Vietnamese and English
const viTranslations: TranslationObject = {
  // Common
  home: "Trang chủ",
  sitemap: "Sơ đồ site",
  logoDSEZAAlt: "Logo DSEZA",



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
    utilities: "Tiện ích",
  },

  // Home Sections
  homepage: {
    featuredEvents: "SỰ KIỆN NỔI BẬT",
    latestNews: "TIN TỨC MỚI NHẤT",
    viewAll: "Xem tất cả",
    functionalZones: "CÁC KHU CHỨC NĂNG",
    functionalZonesMobile: "CÁC KHU CHỨC NĂNG",
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

  // Investment Guide Section
  investmentGuide: {
    subtitle: 'Tất cả thông tin cần thiết để bắt đầu hành trình đầu tư của bạn tại Đà Nẵng, từ thủ tục, chính sách đến các dịch vụ hỗ trợ.',
    proceduresDesc: 'Hướng dẫn chi tiết quy trình, hồ sơ và các bước cần thiết để thực hiện một dự án đầu tư.',
    incentivesDesc: 'Khám phá các chính sách ưu đãi về thuế, đất đai và các hỗ trợ khác cho nhà đầu tư.',
    workforceDesc: 'Thông tin về thị trường lao động, chất lượng nguồn nhân lực và các chương trình đào tạo.',
    infrastructureDesc: 'Tổng quan về hạ tầng giao thông, điện, nước và viễn thông tại các khu công nghiệp.',
    environmentDesc: 'Tìm hiểu về môi trường kinh doanh, chỉ số năng lực cạnh tranh và cam kết từ chính quyền.',
    servicesDesc: 'Các dịch vụ hỗ trợ doanh nghiệp như tài chính, ngân hàng, logistics và tư vấn pháp lý.'
  },

  // Footer
  footer: {
    management: "Ban Quản lý Khu công nghệ cao và các Khu công nghiệp Đà Nẵng",
    address: "Địa chỉ: Lô A17, đường Trung tâm, Khu công nghệ cao, xã Hòa Liên, huyện Hòa Vang, Đà Nẵng",
    tel: "Điện thoại",
    fax: "Fax",
    email: "Email",
    copyright: "Bản quyền © 2025 DSEZA. Đã đăng ký bản quyền.",
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
    subtitle: "Cập nhật thông tin mới nhất về hoạt động đầu tư và phát triển tại DSEZA",
    viewAll: "Xem tất cả",
    noFeatured: "Không có tin nổi bật",
    noArticles: "Không có bài viết nào",
    categoryNotFound: "Danh mục không tồn tại",
    categoryNotFoundDesc: "Danh mục bạn đang tìm kiếm không tồn tại.",
    categoryError: "Có lỗi xảy ra",
    categoryErrorDesc: "Không thể tải dữ liệu danh mục. Vui lòng thử lại sau.",
    categoryTotalArticles: "Tổng cộng {count} bài viết",
    noArticlesInCategory: "Chưa có bài viết nào",
    noArticlesInCategoryDesc: "Danh mục này chưa có bài viết nào. Vui lòng quay lại sau để xem thêm nội dung mới.",
    categories: {
      all: "Tất cả",
      investment: "Đầu tư – Hợp tác quốc tế",
      training: "Đào tạo, Ươm tạo khởi nghiệp",
      digital: "Chuyển đổi số",
      management: "Hoạt động Ban quản lý",
      other: "Tin khác",
    },
    detail: {
      share: "Chia sẻ",
      relatedNews: "Tin liên quan",
      recentNews: "Tin tức gần đây",
      categories: "Danh mục",
      newsletterSignup: "Đăng ký nhận tin",
      newsletterDescription: "Nhận thông tin mới nhất về các hoạt động đầu tư và phát triển tại DSEZA",
      emailPlaceholder: "Nhập email của bạn",
      subscribe: "Đăng ký",
      readingTime: "phút đọc",
      author: "Tác giả",
      publishDate: "Ngày đăng",
      notFound: "Bài viết không tìm thấy",
      notFoundDesc: "Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.",
      error: "Có lỗi xảy ra",
      errorDesc: "Không thể tải nội dung bài viết. Vui lòng thử lại sau.",
    },
    sampleNews: { // Giữ lại sample news nếu có nơi khác dùng, nếu không có thể xóa
      news1: {
        title: "Dự án Khu Công Nghệ Cao Đà Nẵng Mở Rộng Giai Đoạn 2 Chính Thức Khởi Động",
        excerpt: "Sáng nay, Ban Quản lý KCNC và các KCN Đà Nẵng đã tổ chức lễ khởi công giai đoạn 2 của dự án mở rộng Khu Công Nghệ Cao, hứa hẹn thu hút thêm nhiều tập đoàn công nghệ lớn..."
      },
      news2: {
        title: "Đà Nẵng Đẩy Mạnh Hợp Tác Quốc Tế Trong Lĩnh Vực Vi Mạch",
        excerpt: "Nhiều thỏa thuận hợp tác đã được ký kết nhằm phát triển nguồn nhân lực và công nghệ cho ngành vi mạch bán dẫn..."
      },
      news3: {
        title: "Chính Sách Ưu Đãi Mới Cho Doanh Nghiệp Đầu Tư Vào Khu Thương Mại Tự Do",
        excerpt: "Các chính sách mới tập trung vào việc giảm thiểu thủ tục hành chính và tăng cường các ưu đãi về thuế..."
      }
    }
  },

  // Search Section
  search: {
    title: "Tìm kiếm",
    searchPlaceholder: "Tìm kiếm tin tức, văn bản...",
    recentSearches: "Tìm kiếm gần đây",
    quickResults: "Kết quả nhanh",
    viewAllResults: "Xem tất cả kết quả",
    noResults: "Không tìm thấy kết quả",
    resultsFor: "Kết quả tìm kiếm cho",
    foundResults: "Tìm thấy {count} kết quả trong {time} giây",
    filters: "Bộ lọc",
    allTypes: "Tất cả",
    news: "Tin tức",
    documents: "Văn bản",
    document: "Văn bản",
    errorTitle: "Không thể tìm kiếm",
    tryAgain: "Thử lại",
    noResultsTitle: "Không tìm thấy kết quả",
    noResultsMessage: "Không có kết quả nào khớp với từ khóa tìm kiếm của bạn.",
    suggestions: "Gợi ý",
    suggestion1: "Kiểm tra chính tả từ khóa",
    suggestion2: "Thử sử dụng từ khóa khác",
    suggestion3: "Sử dụng từ khóa ngắn gọn hơn",
  },

  // Pagination
  pagination: {
    previous: "Trước",
    next: "Tiếp",
  },

  // Functional Zones Section
  functionalZones: {
    title: "KHU CÔNG NGHỆ CAO, TRUNG TÂM VI MẠCH BÁN DẪN VÀ TRÍ TUỆ NHÂN TẠO, CÁC KHU CÔNG NGHIỆP, KHU CNTT TẬP TRUNG, KHU THƯƠNG MẠI TỰ DO",
    enterprises: "Doanh nghiệp",
    occupancyRate: "Tỉ lệ lấp đầy",
    area: "Diện tích",
  },

  // Validation messages
  validation: {
    email: {
      required: "Email hoặc tên đăng nhập là bắt buộc",
      invalid: "Email hoặc tên đăng nhập không hợp lệ"
    },
    password: {
      required: "Mật khẩu là bắt buộc",
      minLength: "Mật khẩu phải có ít nhất {count} ký tự"
    }
  },

  // Admin Panel
  admin: {
    login: {
      title: "Đăng nhập Quản Trị",
      description: "Vui lòng nhập thông tin để truy cập.",
      emailLabel: "Email",
      emailPlaceholder: "admin@example.com",
      passwordLabel: "Mật khẩu",
      passwordPlaceholder: "********",
      loginButton: "Đăng nhập",
      loggingInButton: "Đang đăng nhập...",
      forgotPasswordLink: "Quên mật khẩu?",
      forgotPasswordWIP: "Chức năng quên mật khẩu đang được phát triển.",
      authError: "Email hoặc mật khẩu không chính xác.",
      loginSuccess: "Đăng nhập thành công!",
      footerNote: "Chỉ dành cho quản trị viên.",
      showPassword: "Hiện mật khẩu",
      hidePassword: "Ẩn mật khẩu",
    },
    nav: {
      dashboard: "Dashboard",
      news: "Tin tức",
      documents: "Tài liệu",
      categories: "Danh mục",
    },
    dashboard: {
      greeting: "Chào mừng trở lại!",
      welcomeMessage: "Chào mừng trở lại, {email}!",
      totalNews: "Tổng số Tin tức",
      totalEvents: "Tổng số Sự kiện",
      totalViews: "Lượt xem (Tháng này)",
      activeUsersThisMonth: "Người dùng hoạt động",
      createNewNews: "Tạo Tin tức mới",
      manageAllNews: "Quản lý Tất cả Tin tức",
      createNewEvent: "Tạo Sự kiện mới",
      manageAllEvents: "Quản lý Tất cả Sự kiện",
      sessionInfo: "Thông tin Phiên đăng nhập",
      userEmail: "Email",
      userRole: "Vai trò",
      loginTime: "Thời gian đăng nhập",
    },
    sidebar: {
      newsManagement: "Quản lý Tin tức",
      eventManagement: "Quản lý Sự kiện",
      categoryManagement: "Quản lý Danh mục",
      resourceManagement: "Quản lý Tài nguyên",
      userManagement: "Quản lý Người dùng",
      logout: "Đăng xuất",
    },
    logout: {
      success: "Đăng xuất thành công!",
    },
    common: {
      create: "Tạo mới",
      edit: "Chỉnh sửa",
    },
    newsList: {
      titlePage: "Quản lý Tin tức",
      button: {
        createNew: "Tạo Tin tức mới",
      },
      table: {
        header: {
          title: "Tiêu đề",
          category: "Danh mục",
          author: "Tác giả",
          status: "Trạng thái",
          date: "Ngày tạo",
          actions: "Hành động",
        },
      },
      status: {
        published: "Đã xuất bản",
        draft: "Bản nháp",
        pending: "Chờ duyệt",
      },
      actions: {
        preview: "Xem trước",
        edit: "Sửa",
        delete: "Xóa",
      },
      searchPlaceholder: "Tìm theo tiêu đề...",
      filter: {
        categoryPlaceholder: "Tất cả Danh mục",
        statusPlaceholder: "Tất cả Trạng thái",
      },
      deleteConfirm: {
        title: "Xác nhận Xóa",
        message: "Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác.",
        confirmButton: "Xóa",
        cancelButton: "Hủy",
      },
      toast: {
        deleteSuccess: "Xóa bài viết thành công!",
        previewWIP: "Chức năng Xem trước đang phát triển.",
      },
      noNewsFound: "Không tìm thấy bài viết nào.",
    },
    search: {
      placeholder: "Tìm kiếm tin tức...",
      noResults: "Không tìm thấy kết quả nào",
      searching: "Đang tìm kiếm...",
    },
    userManagement: {
      title: "Quản lý Người dùng",
      placeholder: "Coming soon: Tính năng quản lý người dùng đang được phát triển.",
    },
    categoryManagement: {
      title: "Quản lý Danh mục",
      placeholder: "Coming soon: Tính năng quản lý danh mục đang được phát triển.",
    },
    settings: {
      title: "Cài đặt",
      placeholder: "Coming soon: Trang cài đặt hệ thống đang được phát triển.",
    },
    // NEW: Admin News Form translations
    newsForm: {
      title: {
        create: "Tạo Tin tức mới",
        edit: "Chỉnh sửa Tin tức",
      },
      cardTitle: {
        create: "Thông tin Tin tức mới",
        edit: "Cập nhật thông tin Tin tức",
      },
      sections: {
        basicInfo: "Thông tin cơ bản",
        content: "Nội dung",
        media: "Hình ảnh",
        settings: "Cài đặt",
      },
      fields: {
        title: {
          label: "Tiêu đề (Tiếng Việt)",
          placeholder: "Nhập tiêu đề bài viết...",
        },
        titleEn: {
          label: "Tiêu đề (Tiếng Anh)",
          placeholder: "Enter article title in English...",
        },
        slug: {
          label: "Slug (URL)",
          placeholder: "vi-du-slug-bai-viet",
          description: "URL thân thiện cho bài viết. Tự động tạo từ tiêu đề, có thể chỉnh sửa.",
        },
        excerpt: {
          label: "Mô tả ngắn (Tiếng Việt)",
          placeholder: "Nhập mô tả ngắn cho bài viết...",
        },
        excerptEn: {
          label: "Mô tả ngắn (Tiếng Anh)",
          placeholder: "Enter short description in English...",
        },
        content: {
          label: "Nội dung (Tiếng Việt)",
          placeholder: "Nhập nội dung chi tiết bài viết...",
          description: "TODO: Sẽ được thay thế bằng WYSIWYG Editor",
        },
        contentEn: {
          label: "Nội dung (Tiếng Anh)",
          placeholder: "Enter detailed content in English...",
          description: "TODO: Sẽ được thay thế bằng WYSIWYG Editor",
        },
        image: {
          label: "Ảnh đại diện",
          select: "Chọn ảnh",
          change: "Thay đổi ảnh",
          remove: "Xóa ảnh",
          description: "TODO: Sẽ được tích hợp với Media Library",
        },
        category: {
          label: "Danh mục",
          placeholder: "Chọn danh mục...",
          noCategories: "Không có danh mục nào",
        },
        status: {
          label: "Trạng thái",
          placeholder: "Chọn trạng thái...",
        },
        publishDate: {
          label: "Ngày xuất bản",
          placeholder: "Chọn ngày xuất bản",
        },
        author: {
          label: "Tác giả",
          placeholder: "Nhập tên tác giả...",
        },
        readingTime: {
          label: "Thời gian đọc (Tiếng Việt)",
          placeholder: "5 phút",
        },
        readingTimeEn: {
          label: "Thời gian đọc (Tiếng Anh)",
          placeholder: "5 min read",
        },
        isFeatured: {
          label: "Tin nổi bật",
        },
      },
      buttons: {
        back: "Quay lại",
        cancel: "Hủy",
        save: "Lưu thay đổi",
        create: "Tạo Tin tức",
        saving: "Đang lưu...",
      },
      validation: {
        title: {
          required: "Tiêu đề là bắt buộc",
          maxLength: "Tiêu đề không được vượt quá {count} ký tự",
        },
        titleEn: {
          maxLength: "Tiêu đề tiếng Anh không được vượt quá {count} ký tự",
        },
        slug: {
          required: "Slug là bắt buộc",
          format: "Slug chỉ được chứa chữ thường, số và dấu gạch ngang",
        },
        excerpt: {
          maxLength: "Mô tả ngắn không được vượt quá {count} ký tự",
        },
        excerptEn: {
          maxLength: "Mô tả ngắn tiếng Anh không được vượt quá {count} ký tự",
        },
        content: {
          required: "Nội dung là bắt buộc",
        },
        category: {
          required: "Danh mục là bắt buộc",
        },
        status: {
          required: "Trạng thái là bắt buộc",
        },
        publishDate: {
          required: "Ngày xuất bản là bắt buộc",
        },
        author: {
          required: "Tác giả là bắt buộc",
        },
      },
      messages: {
        createSuccess: "Tạo tin tức thành công!",
        updateSuccess: "Cập nhật tin tức thành công!",
        createError: "Có lỗi xảy ra khi tạo tin tức",
        updateError: "Có lỗi xảy ra khi cập nhật tin tức",
        loadError: "Có lỗi xảy ra khi tải dữ liệu",
        articleNotFound: "Không tìm thấy bài viết",
      },
    },
  },

  // Error messages
  error: {
    title: "Lỗi",
    emailInvalid: "Email không hợp lệ.",
    passwordMinLength: "Mật khẩu phải có ít nhất 8 ký tự.",
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
    tab2: "Khu công nghệ cao Đà Nẵng",
    tab3: "Khu công nghệ cao Đà Nẵng",
    tab4: "Khu công nghệ cao Đà Nẵng",
  },

  // Special content in navigation menu AND Mobile Menu
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
    // Keys for mobile menu (ví dụ)
    letterOfGreeting: "Thư ngỏ",
    overviewDanang: "Tổng quan về Đà Nẵng",
    overviewAuthority: "Tổng quan về Ban Quản lý",
    functionsAndDuties: "Chức năng, nhiệm vụ, quyền hạn Ban Quản lý",
    departments: "Các phòng ban",
    affiliatedUnits: "Đơn vị trực thuộc",
    functionalAreas: "Các Khu chức năng",
    // Thêm các key khác cho các mục con của menu mobile tại đây
    // Ví dụ cho "Các Khu công nghiệp Đà Nẵng" và các mục con của nó
    izHoaKhanh: "Khu công nghiệp Hòa Khánh",
    izHoaKhanhExpanded: "Khu công nghiệp Hòa Khánh mở rộng",
    izDanang: "Khu công nghiệp Đà Nẵng",
    izSeafoodService: "Khu công nghiệp Dịch vụ Thủy sản Đà Nẵng",
    izHoaCam: "Khu công nghiệp Hòa Cầm",
    izLienChieu: "Khu công nghiệp Liên Chiểu",
    izHoaNinh: "Khu công nghiệp Hòa Ninh",
    // Ví dụ cho menu Tin tức
    newsEvents: "Tin tức | Sự kiện",
    newsInvestmentCooperation: "Đầu tư - Hợp tác Quốc tế",
    newsDigitalTransformation: "Chuyển đổi số",
    newsTrainingIncubation: "Đào tạo, Ươm tạo Khởi nghiệp",
    newsManagementActivities: "Hoạt động Ban Quản lý",
    newsOther: "Tin khác",
    seeMore: "Xem thêm",
    workSchedule: "Lịch công tác",
    announcements: "Thông báo",
    pressInformation: "Thông tin báo chí",
    // Ví dụ cho menu Doanh nghiệp
    reportsData: "Báo cáo & Dữ liệu",
    dsezaOnlineReports: "Báo cáo trực tuyến về DSEZA",
    investmentMonitoringReports: "Báo cáo giám sát và đánh giá đầu tư",
    reportTemplatesForms: "Mẫu | Bảng biểu báo cáo",
    businessInformation: "Thông tin Doanh nghiệp",
    envProceduresDocsData: "Thủ tục | Hồ sơ | Dữ liệu môi trường",
    businessStatistics: "Thống kê doanh nghiệp",
    recruitment: "Tuyển dụng",
    businessSupport: "Hỗ trợ doanh nghiệp",
    // Ví dụ cho menu Văn bản
    legalDocuments: "Văn bản Pháp luật",
    centralLegalDocs: "Văn bản pháp quy trung ương",
    localLegalDocs: "Văn bản pháp quy địa phương",
    administrativeDocs: "Văn bản chỉ đạo điều hành",
    adminReformDocs: "Văn bản CCHC",
    guidelinesFeedback: "Hướng dẫn & Góp ý",
    guidanceDocs: "Văn bản hướng dẫn",
    draftDocFeedback: "Góp ý dự thảo văn bản",
    docSearch: "Tra cứu văn bản",
    docSearchSystem: "Hệ thống tra cứu văn bản",
    // Ví dụ cho menu Cải cách hành chính
    applicationsServices: "Ứng dụng & Dịch vụ",
    postalServices: "Bưu chính công ích",
    docLookup: "Tra cứu hồ sơ",
    onlineAppointment: "Đặt lịch hẹn giao dịch trực tuyến",
    serviceQualityAssessment: "Đánh giá chất lượng dịch vụ HCC",
    infoProcedures: "Thông tin & Quy trình",
    adminProcedures: "Thủ tục hành chính", // Đã có ở quickAccess, có thể dùng chung hoặc tạo key mới
    adminProcProcess: "Quy trình thực hiện thủ tục hành chính",
    investmentProcProcess: "Quy trình lĩnh vực đầu tư",
  },

  // Resources Section
  resourcesSection: {
    sectionTitle: "TƯ LIỆU",
    tabImages: "Hình ảnh",
    tabVideos: "Video",
    tabDocuments: "Tài liệu",
    dateLabel: "Ngày đăng",
    comingSoonTitle: "Đang phát triển",
    comingSoonVideos: "Sắp ra mắt: Video liên quan đến hoạt động và các khu của DSEZA.",
    comingSoonDocuments: "Sắp ra mắt: Tài liệu, báo cáo và khung pháp lý có thể tải về.",
    viewAll: "Xem tất cả tư liệu",
  },

  // Logo Search Bar
  logoSearchBar: {
    searchPlaceholder: "Tìm kiếm...",
    register: "Đăng ký",
    login: "Đăng nhập",
  },

  // Language Switcher & Theme Toggle
  languageSwitcher: {
    vietnamese: "Tiếng Việt",
    english: "English",
    toggle: "VI/EN",
  },
  themeToggle: {
    lightMode: "Chế độ sáng",
    darkMode: "Chế độ tối",
  },

  // Common elements
  common: {
    goBack: "Quay lại",
    loading: "Đang tải...",
    error: "Lỗi",
    retry: "Thử lại",
    notFound: "Không tìm thấy",
  },
};

const enTranslations: TranslationObject = {
  // Common
  home: "Home",
  sitemap: "Sitemap",
  logoDSEZAAlt: "DSEZA Logo",



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
    utilities: "Utilities",
  },

  // Home Sections
  homepage: {
    featuredEvents: "FEATURED EVENTS",
    latestNews: "LATEST NEWS",
    viewAll: "View all",
    functionalZones: "FUNCTIONAL ZONES",
    functionalZonesMobile: "FUNCTIONAL ZONES",
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

  // Investment Guide Section
  investmentGuide: {
    subtitle: 'All the necessary information to start your investment journey in Da Nang, from procedures and policies to support services.',
    proceduresDesc: 'Detailed guide on processes, required documents, and necessary steps to implement an investment project.',
    incentivesDesc: 'Explore incentive policies on taxes, land, and other support for investors.',
    workforceDesc: 'Information on the labor market, human resource quality, and training programs.',
    infrastructureDesc: 'Overview of transport, electricity, water, and telecommunications infrastructure in industrial zones.',
    environmentDesc: 'Learn about the business environment, competitiveness index, and commitments from the authorities.',
    servicesDesc: 'Support services for businesses such as finance, banking, logistics, and legal consulting.'
  },

  // Footer
  footer: {
    management: "Da Nang Specific Economic Zones Authority",
    address: "Address: Lot A17, Center Road, High-Tech Park, Hoa Lien Commune, Hoa Vang District, Da Nang",
    tel: "Tel",
    fax: "Fax",
    email: "Email",
    copyright: "Copyright © 2025 DSEZA. All rights reserved.",
    legalInfo: "Legal Information",
    networkCredibility: "Network Credibility",
    license: "License: No. 05/GP-STTTT issued by Danang Department of Information and Communications on 01/02/2020.",
    editor: "Editor in Chief: Tran Van Ty, Deputy Head of the Management Board of Da Nang Specific Economic Zones Authority.",
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
    vrTour: "VR 360 Tour - Danang Hi-Tech Park",
    digitalMap: "Digital Map of High-Tech Park + Industrial Zones + Online Reports",
    digitalMapTitle: "Digital Map and Investment Reports",
    digitalMapDescription: "Interactive map with detailed data about industrial zones, business locations, and investment information.",
    accessDigitalMap: "Access Digital Map",
  },

  // News Section
  news: {
    title: "NEWS",
    subtitle: "Get the latest updates on investment and development activities at DSEZA",
    viewAll: "View all",
    noFeatured: "No featured articles",
    noArticles: "No articles found",
    categoryNotFound: "Category not found",
    categoryNotFoundDesc: "The category you are looking for does not exist.",
    categoryError: "An error occurred",
    categoryErrorDesc: "Unable to load category data. Please try again later.",
    categoryTotalArticles: "Total {count} articles",
    noArticlesInCategory: "No articles yet",
    noArticlesInCategoryDesc: "This category doesn't have any articles yet. Please check back later for new content.",
    categories: {
      investment: "Investment & International Cooperation",
      training: "Training & Business Incubation",
      digital: "Digital Transformation",
      management: "Management Activities",
      other: "Other News",
    },
    detail: {
      share: "Share",
      relatedNews: "Related News",
      recentNews: "Recent News",
      categories: "Categories",
      newsletterSignup: "Sign Up for Newsletter",
      newsletterDescription: "Get the latest updates on investment and development activities at DSEZA",
      emailPlaceholder: "Enter your email",
      subscribe: "Subscribe",
      readingTime: "minutes read",
      author: "Author",
      publishDate: "Published Date",
      notFound: "Article not found",
      notFoundDesc: "The article you are looking for does not exist or has been deleted.",
      error: "An error occurred",
      errorDesc: "Unable to load article content. Please try again later.",
    },
    sampleNews: { // Giữ lại sample news nếu có nơi khác dùng, nếu không có thể xóa
      news1: {
        title: "Danang Hi-Tech Park Phase 2 Expansion Project Officially Launched",
        excerpt: "This morning, the Danang Hi-Tech Park and Industrial Zones Authority held the groundbreaking ceremony for phase 2 of the High-Tech Park expansion project, promising to attract more major technology corporations..."
      },
      news2: {
        title: "Danang Boosts International Cooperation in Semiconductor Industry",
        excerpt: "Multiple cooperation agreements have been signed to develop human resources and technology for the semiconductor industry..."
      },
      news3: {
        title: "New Investment Incentives for Businesses in Free Trade Zone",
        excerpt: "New policies focus on streamlining administrative procedures and enhancing tax incentives..."
      }
    }
  },

  // Functional Zones Section
  functionalZones: {
    title: "HIGH-TECH PARK, SEMICONDUCTOR & AI CENTER, INDUSTRIAL ZONES, IT ZONES, FREE TRADE ZONE",
    enterprises: "Enterprises",
    occupancyRate: "Occupancy Rate",
    area: "Area",
  },

  // Admin Panel
  admin: {
    login: {
      title: "Admin Login",
      description: "Please enter your information to access.",
      emailLabel: "Email",
      emailPlaceholder: "admin@example.com",
      passwordLabel: "Password",
      passwordPlaceholder: "********",
      loginButton: "Login",
      loggingInButton: "Logging in...",
      forgotPasswordLink: "Forgot password?",
      forgotPasswordWIP: "Forgot password feature is under development.",
      authError: "Invalid email or password.",
      loginSuccess: "Login successful!",
      footerNote: "Only for administrators.",
      showPassword: "Show password",
      hidePassword: "Hide password",
    },
    sidebar: {
      dashboard: "Dashboard",
      newsManagement: "News Management",
      eventManagement: "Event Management",
      categoryManagement: "Category Management",
      resourceManagement: "Resource Management",
      userManagement: "User Management",
      logout: "Logout",
    },
    logout: {
      success: "Logout successful!",
    },
    common: {
      create: "Create",
      edit: "Edit",
    },
    dashboard: {
      welcomeMessage: "Welcome back, {email}!",
      greeting: "Good morning",
      totalNews: "Total News",
      totalEvents: "Total Events",
      totalViews: "Views (This Month)",
      activeUsersThisMonth: "Active Users",
      createNewNews: "Create New News",
      manageAllNews: "Manage All News",
      createNewEvent: "Create New Event",
      manageAllEvents: "Manage All Events",
      sessionInfo: "Session Information",
      userEmail: "Email",
      loginTime: "Login Time",
      userRole: "Role",
    },
    newsList: {
      titlePage: "News Management",
      button: {
        createNew: "Create News",
      },
      table: {
        header: {
          title: "Title",
          category: "Category",
          author: "Author",
          status: "Status",
          date: "Created Date",
          actions: "Actions",
        },
      },
      status: {
        published: "Published",
        draft: "Draft",
        pending: "Pending Approval",
      },
      actions: {
        preview: "Preview",
        edit: "Edit",
        delete: "Delete",
      },
      searchPlaceholder: "Search by title...",
      filter: {
        categoryPlaceholder: "All Categories",
        statusPlaceholder: "All Statuses",
      },
      deleteConfirm: {
        title: "Confirm Delete",
        message: "Are you sure you want to delete this article? This action cannot be undone.",
        confirmButton: "Delete",
        cancelButton: "Cancel",
      },
      toast: {
        deleteSuccess: "Article deleted successfully!",
        previewWIP: "Preview feature is under development.",
      },
      noNewsFound: "No articles found.",
    },
    search: {
      placeholder: "Search news...",
      noResults: "No results found",
      searching: "Searching...",
    },
    userManagement: {
      title: "User Management",
      placeholder: "Coming soon: User management feature is under development.",
    },
    categoryManagement: {
      title: "Category Management",
      placeholder: "Coming soon: Category management feature is under development.",
    },
    settings: {
      title: "Settings",
      placeholder: "Coming soon: System settings page is under development.",
    },
    // NEW: Admin News Form translations
    newsForm: {
      title: {
        create: "Create New News",
        edit: "Edit News",
      },
      cardTitle: {
        create: "New News Information",
        edit: "Update News Information",
      },
      sections: {
        basicInfo: "Basic Information",
        content: "Content",
        media: "Image",
        settings: "Settings",
      },
      fields: {
        title: {
          label: "Title (Vietnamese)",
          placeholder: "Enter article title...",
        },
        titleEn: {
          label: "Title (English)",
          placeholder: "Enter article title in English...",
        },
        slug: {
          label: "Slug (URL)",
          placeholder: "example-article-slug",
          description: "SEO-friendly URL for the article. Auto-generated from title, can be edited.",
        },
        excerpt: {
          label: "Short Description (Vietnamese)",
          placeholder: "Enter short description for the article...",
        },
        excerptEn: {
          label: "Short Description (English)",
          placeholder: "Enter short description in English...",
        },
        content: {
          label: "Content (Vietnamese)",
          placeholder: "Enter detailed article content...",
          description: "TODO: Will be replaced with WYSIWYG Editor",
        },
        contentEn: {
          label: "Content (English)",
          placeholder: "Enter detailed content in English...",
          description: "TODO: Will be replaced with WYSIWYG Editor",
        },
        image: {
          label: "Featured Image",
          select: "Select Image",
          change: "Change Image",
          remove: "Remove Image",
          description: "TODO: Will be integrated with Media Library",
        },
        category: {
          label: "Category",
          placeholder: "Select category...",
          noCategories: "No categories available",
        },
        status: {
          label: "Status",
          placeholder: "Select status...",
        },
        publishDate: {
          label: "Publish Date",
          placeholder: "Select publish date",
        },
        author: {
          label: "Author",
          placeholder: "Enter author name...",
        },
        readingTime: {
          label: "Reading Time (Vietnamese)",
          placeholder: "5 phút",
        },
        readingTimeEn: {
          label: "Reading Time (English)",
          placeholder: "5 min read",
        },
        isFeatured: {
          label: "Featured News",
        },
      },
      buttons: {
        back: "Back",
        cancel: "Cancel",
        save: "Save Changes",
        create: "Create News",
        saving: "Saving...",
      },
      validation: {
        title: {
          required: "Title is required",
          maxLength: "Title must not exceed {count} characters",
        },
        titleEn: {
          maxLength: "English title must not exceed {count} characters",
        },
        slug: {
          required: "Slug is required",
          format: "Slug can only contain lowercase letters, numbers, and hyphens",
        },
        excerpt: {
          maxLength: "Short description must not exceed {count} characters",
        },
        excerptEn: {
          maxLength: "English short description must not exceed {count} characters",
        },
        content: {
          required: "Content is required",
        },
        category: {
          required: "Category is required",
        },
        status: {
          required: "Status is required",
        },
        publishDate: {
          required: "Publish date is required",
        },
        author: {
          required: "Author is required",
        },
      },
      messages: {
        createSuccess: "News created successfully!",
        updateSuccess: "News updated successfully!",
        createError: "An error occurred while creating news",
        updateError: "An error occurred while updating news",
        loadError: "An error occurred while loading data",
        articleNotFound: "Article not found",
      },
    },
  },

  // Error messages
  error: {
    title: "Error",
    emailInvalid: "Invalid email.",
    passwordMinLength: "Password must be at least 8 characters long.",
  },

  // Validation messages
  validation: {
    email: {
      required: "Please enter email.",
      invalid: "Invalid email.",
    },
    password: {
      required: "Please enter password.",
      minLength: "Password must be at least {count} characters long.",
    },
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
    tab1: "Danang Hi-Tech Park",
    tab2: "Danang Hi-Tech Park",
    tab3: "Danang Hi-Tech Park",
    tab4: "Danang Hi-Tech Park",
  },

  // Special content in navigation menu AND Mobile Menu
  menuSpecial: {
    achievementTitle: "Outstanding Achievements",
    achievementDesc: "Danang Hi-Tech Park and Industrial Zones have become a key driving force for the city's development.",
    achievementBtn: "Learn more",
    featuredServiceTitle: "Featured Public Services",
    featuredServiceDesc: "Experience online public services at the Danang Hi-Tech Park and Industrial Zones Authority",
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
    // Keys for mobile menu (example)
    letterOfGreeting: "Welcome Letter",
    overviewDanang: "Overview of Da Nang",
    overviewAuthority: "Overview of the Authority",
    functionsAndDuties: "Functions, Duties, and Powers",
    departments: "Departments",
    affiliatedUnits: "Affiliated Units",
    functionalAreas: "Functional Zones",
    // Add other keys for mobile menu sub-items here
    izHoaKhanh: "Hoa Khanh Industrial Zone",
    izHoaKhanhExpanded: "Hoa Khanh Expanded Industrial Zone",
    izDanang: "Da Nang Industrial Zone",
    izSeafoodService: "Da Nang Seafood Service Industrial Zone",
    izHoaCam: "Hoa Cam Industrial Zone",
    izLienChieu: "Lien Chieu Industrial Zone",
    izHoaNinh: "Hoa Ninh Industrial Zone",
    // Example for News menu
    newsEvents: "News | Events",
    newsInvestmentCooperation: "Investment - International Cooperation",
    newsDigitalTransformation: "Digital Transformation",
    newsTrainingIncubation: "Training, Startup Incubation",
    newsManagementActivities: "Management Activities",
    newsOther: "Other News",
    seeMore: "See More",
    workSchedule: "Work Schedule",
    announcements: "Announcements",
    pressInformation: "Press Information",
    // Example for Business menu
    reportsData: "Reports & Data",
    dsezaOnlineReports: "DSEZA Online Reports",
    investmentMonitoringReports: "Investment Monitoring Reports",
    reportTemplatesForms: "Templates | Report Forms",
    businessInformation: "Business Information",
    envProceduresDocsData: "Procedures | Documents | Environmental Data",
    businessStatistics: "Business Statistics",
    recruitment: "Recruitment",
    businessSupport: "Business Support",
    // Example for Documents menu
    legalDocuments: "Legal Documents",
    centralLegalDocs: "Central Legal Documents",
    localLegalDocs: "Local Legal Documents",
    administrativeDocs: "Administrative Documents",
    adminReformDocs: "Administrative Reform Documents",
    guidelinesFeedback: "Guidelines & Feedback",
    guidanceDocs: "Guidance Documents",
    draftDocFeedback: "Draft Document Feedback",
    docSearch: "Document Search",
    docSearchSystem: "Document Search System",
    // Example for Administrative Reform menu
    applicationsServices: "Applications & Services",
    postalServices: "Postal Services",
    docLookup: "Document Lookup",
    onlineAppointment: "Online Appointment Scheduling",
    serviceQualityAssessment: "Service Quality Assessment",
    infoProcedures: "Information & Procedures",
    adminProcedures: "Administrative Procedures",
    adminProcProcess: "Administrative Procedure Process",
    investmentProcProcess: "Investment Process",
  },

  // Resources Section
  resourcesSection: {
    sectionTitle: "RESOURCES",
    tabImages: "Images",
    tabVideos: "Videos",
    tabDocuments: "Documents",
    dateLabel: "Date posted",
    comingSoonTitle: "Coming soon",
    comingSoonVideos: "Coming soon: Videos related to DSEZA's activities and zones.",
    comingSoonDocuments: "Coming soon: Downloadable documents, reports, and legal frameworks.",
    viewAll: "View all resources",
  },

  // Logo Search Bar
  logoSearchBar: {
    searchPlaceholder: "Search...",
    register: "Register",
    login: "Login",
  },

  // Language Switcher & Theme Toggle
  languageSwitcher: {
    vietnamese: "Vietnamese",
    english: "English",
    toggle: "VI/EN",
  },
  themeToggle: {
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
  },

  // Common elements
  common: {
    goBack: "Go Back",
    loading: "Loading...",
    error: "Error",
    retry: "Retry",
    notFound: "Not Found",
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
   * Get a translation by key with optional parameter interpolation
   * @param key - The translation key (can be a dot notation for nested keys)
   * @param params - Optional parameters for interpolation (e.g., { count: 8 })
   * @returns The translated string with interpolated parameters or the key itself if not found
   */
  const t = (key: string, params?: Record<string, any>): string => {
    const translationSet = translations[language];
    let translation = getNestedValue(translationSet, key);
    
    // Fallback to the key itself if translation is not found
    // or if the key points to an object (meaning it's a parent key, not a string leaf)
    if (translation === undefined || typeof translation !== 'string') {
        // console.warn(`Translation key not found or not a string: ${key}`); // Optional: for debugging
        return key;
    }

    // Perform parameter interpolation if params are provided
    if (params) {
      Object.keys(params).forEach(paramKey => {
        const placeholder = `{${paramKey}}`;
        // Use split and join for safer replacement instead of regex
        while (translation.includes(placeholder)) {
          translation = translation.replace(placeholder, String(params[paramKey]));
        }
      });
    }
    
    return translation;
  };

  return { t, language };
};

/**
 * Formats a date and time according to the current language
 * @param date - The date to format
 * @param includeTime - Whether to include time (HH:MM:SS) in the output. Defaults to false.
 * @returns A formatted date string, optionally with time
 */
export const formatDate = (date: Date, includeTime: boolean = false): string => {
  const { language } = useLanguage(); // This hook now correctly calls useLanguage from the context
  const translationSet = language === 'vi' ? viTranslations : enTranslations;

  const dateTranslation = translationSet.date as TranslationObject;
  const dayNames = dateTranslation.dayNames as string[];

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  let formattedDateString: string;

  if (language === 'vi') {
    formattedDateString = `${dayNames[date.getDay()]}, ${day}/${month}/${year}`;
  } else {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    formattedDateString = `${dayNames[date.getDay()]}, ${monthNames[date.getMonth()]} ${day}, ${year}`;
  }

  if (includeTime) {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    formattedDateString += ` | ${hours}:${minutes}:${seconds}`;
  }

  return formattedDateString;
};