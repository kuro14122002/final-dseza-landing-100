// src/services/newsService.ts
import { NewsArticle, NewsCategory } from '@/types/news';

const MOCK_DELAY = 1000; // Giả lập độ trễ mạng

// Dữ liệu mẫu cho categories
const mockCategories: NewsCategory[] = [
  { 
    id: "investment", 
    slug: "dau-tu-hop-tac-quoc-te", 
    name: "Đầu tư – Hợp tác quốc tế", 
    nameEn: "Investment – Int'l Cooperation" 
  },
  { 
    id: "training", 
    slug: "dao-tao-uom-tao-khoi-nghiep", 
    name: "Đào tạo, Ươm tạo khởi nghiệp", 
    nameEn: "Training & Startup Incubation" 
  },
  { 
    id: "digital", 
    slug: "chuyen-doi-so", 
    name: "Chuyển đổi số", 
    nameEn: "Digital Transformation" 
  },
  { 
    id: "activities", 
    slug: "hoat-dong-ban-quan-ly", 
    name: "Hoạt động Ban quản lý", 
    nameEn: "Management Board Activities" 
  },
  { 
    id: "other", 
    slug: "tin-khac", 
    name: "Tin khác", 
    nameEn: "Other News" 
  }
];

// Dữ liệu mẫu cho articles (cập nhật với content field)
const mockArticles: NewsArticle[] = [
  {
    id: "inv1",
    slug: "dseza-thu-hut-fdi-100-trieu-usd",
    title: "DSEZA thu hút thành công dự án FDI 100 triệu USD từ Nhật Bản",
    titleEn: "DSEZA successfully attracts $100M FDI project from Japan",
    excerpt: "Dự án tập trung vào sản xuất linh kiện điện tử công nghệ cao, dự kiến tạo ra hàng ngàn việc làm cho người lao động địa phương và góp phần nâng cao năng lực cạnh tranh của khu vực.",
    excerptEn: "The project focuses on high-tech electronic component manufacturing, expected to create thousands of jobs for local workers and enhance regional competitiveness.",
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    publishDate: "2025-05-20T00:00:00Z",
    category: mockCategories[0],
    isFeatured: true,
    readingTime: "5 phút",
    readingTimeEn: "5 min",
    content: `
      <p>Sáng ngày 20/05/2025, Ban Quản lý Khu Công nghệ cao và các Khu Công nghiệp Đà Nẵng (DSEZA) đã chính thức ký kết thỏa thuận hợp tác với Tập đoàn Technova Industries của Nhật Bản cho dự án đầu tư sản xuất linh kiện điện tử công nghệ cao trị giá 100 triệu USD.</p>

      <h2>Dự án mang tính chiến lược cao</h2>
      <p>Dự án này được đánh giá là một bước tiến quan trọng trong chiến lược thu hút đầu tư nước ngoài của thành phố Đà Nẵng, đặc biệt trong lĩnh vực công nghệ cao. Nhà máy sản xuất sẽ được xây dựng trên diện tích 15 hecta tại Khu Công nghệ cao Đà Nẵng với công nghệ hiện đại nhất.</p>

      <h3>Các sản phẩm chính</h3>
      <ul>
        <li>Vi mạch bán dẫn cho thiết bị IoT</li>
        <li>Cảm biến thông minh cho ô tô điện</li>
        <li>Linh kiện điện tử cho thiết bị y tế</li>
        <li>Module điều khiển cho hệ thống năng lượng tái tạo</li>
      </ul>

      <p>Theo ông Tanaka Hiroshi, Giám đốc điều hành Technova Industries, việc chọn Đà Nẵng làm địa điểm đầu tư không chỉ dựa trên vị trí địa lý thuận lợi mà còn bởi chất lượng nguồn nhân lực và chính sách ưu đãi hấp dẫn của DSEZA.</p>

      <blockquote>
        "Chúng tôi tin tưởng rằng Đà Nẵng sẽ trở thành trung tâm sản xuất quan trọng của Technova Industries tại khu vực Đông Nam Á. Dự án này không chỉ mang lại lợi ích kinh tế mà còn góp phần vào sự phát triển bền vững của ngành công nghệ cao tại Việt Nam." - Ông Tanaka Hiroshi
      </blockquote>

      <h2>Tác động tích cực đến kinh tế địa phương</h2>
      <p>Dự án dự kiến sẽ tạo ra hơn 2.000 việc làm trực tiếp và 5.000 việc làm gián tiếp cho người lao động địa phương. Đặc biệt, 80% số việc làm được tạo ra sẽ dành cho kỹ sư và nhân viên kỹ thuật có trình độ cao.</p>
    `,
    contentEn: `
      <p>On the morning of May 20, 2025, the Management Board of Da Nang High-Tech Park and Industrial Zones (DSEZA) officially signed a cooperation agreement with Japan's Technova Industries Group for a $100 million high-tech electronic component manufacturing investment project.</p>

      <h2>A strategically important project</h2>
      <p>This project is considered an important step in Da Nang city's foreign investment attraction strategy, especially in the high-tech sector. The manufacturing plant will be built on 15 hectares in Da Nang High-Tech Park with the most modern technology.</p>

      <h3>Main products</h3>
      <ul>
        <li>Semiconductors for IoT devices</li>
        <li>Smart sensors for electric vehicles</li>
        <li>Electronic components for medical devices</li>
        <li>Control modules for renewable energy systems</li>
      </ul>

      <p>According to Mr. Tanaka Hiroshi, CEO of Technova Industries, choosing Da Nang as the investment location was based not only on its favorable geographical position but also on the quality of human resources and attractive incentive policies of DSEZA.</p>

      <blockquote>
        "We believe that Da Nang will become an important manufacturing center for Technova Industries in Southeast Asia. This project will not only bring economic benefits but also contribute to the sustainable development of the high-tech industry in Vietnam." - Mr. Tanaka Hiroshi
      </blockquote>

      <h2>Positive impact on local economy</h2>
      <p>The project is expected to create more than 2,000 direct jobs and 5,000 indirect jobs for local workers. Notably, 80% of the jobs created will be for highly qualified engineers and technical staff.</p>
    `
  },
  {
    id: "inv2",
    slug: "hoi-thao-xuc-tien-dau-tu-singapore",
    title: "Hội thảo xúc tiến đầu tư vào Đà Nẵng tổ chức tại Singapore",
    titleEn: "Da Nang investment promotion workshop held in Singapore",
    excerpt: "Nhiều nhà đầu tư Singapore bày tỏ sự quan tâm sâu sắc đến môi trường đầu tư tại các KCN, KCNC Đà Nẵng với nhiều ưu đãi hấp dẫn.",
    excerptEn: "Many Singaporean investors expressed deep interest in the investment environment in Da Nang's industrial and high-tech zones with attractive incentives.",
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    publishDate: "2025-05-18T00:00:00Z",
    category: mockCategories[0],
    isFeatured: false,
    readingTime: "3 phút",
    readingTimeEn: "3 min",
    content: `
      <p>Ngày 18/05/2025, Đoàn công tác của Ban Quản lý DSEZA đã tổ chức thành công hội thảo xúc tiến đầu tư tại Singapore, thu hút sự tham gia của hơn 100 doanh nghiệp và nhà đầu tư địa phương.</p>

      <h2>Sự quan tâm từ các nhà đầu tư Singapore</h2>
      <p>Trong buổi hội thảo, nhiều doanh nghiệp Singapore đã bày tỏ sự quan tâm đặc biệt đến các lĩnh vực công nghệ cao, logistics và dịch vụ tài chính tại Đà Nẵng.</p>

      <p>Ông Lee Wei Ming, Chủ tịch Hiệp hội Doanh nghiệp Singapore tại Việt Nam, cho biết: "Đà Nẵng đang ngày càng khẳng định vị thế là trung tâm kinh tế quan trọng của miền Trung và là cầu nối lý tưởng cho các doanh nghiệp Singapore mở rộng hoạt động tại Việt Nam."</p>
    `,
    contentEn: `
      <p>On May 18, 2025, the DSEZA management delegation successfully organized an investment promotion workshop in Singapore, attracting the participation of more than 100 local businesses and investors.</p>

      <h2>Interest from Singaporean investors</h2>
      <p>During the workshop, many Singaporean companies expressed special interest in the high-tech, logistics and financial services sectors in Da Nang.</p>

      <p>Mr. Lee Wei Ming, Chairman of the Singapore Business Association in Vietnam, said: "Da Nang is increasingly asserting its position as an important economic center in Central Vietnam and an ideal bridge for Singaporean businesses to expand their operations in Vietnam."</p>
    `
  },
  {
    id: "inv3",
    slug: "da-nang-nang-cao-nang-luc-canh-tranh",
    title: "Đà Nẵng nâng cao năng lực cạnh tranh trong thu hút đầu tư nước ngoài",
    titleEn: "Da Nang enhances competitiveness in attracting foreign investment",
    excerpt: "Thành phố đang tích cực cải thiện môi trường đầu tư, đơn giản hóa thủ tục hành chính để thu hút các dự án chất lượng cao.",
    excerptEn: "The city is actively improving the investment environment and simplifying administrative procedures to attract high-quality projects.",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    publishDate: "2025-05-15T00:00:00Z",
    category: mockCategories[0],
    isFeatured: false,
    readingTime: "4 phút",
    readingTimeEn: "4 min",
    content: `
      <p>Trong bối cảnh cạnh tranh gay gắt về thu hút đầu tư nước ngoài, Đà Nẵng đang thực hiện nhiều giải pháp đồng bộ để nâng cao sức hút với các nhà đầu tư quốc tế.</p>

      <h2>Cải thiện môi trường đầu tư</h2>
      <p>Thành phố đã triển khai nhiều chính sách ưu đãi mới, đặc biệt trong lĩnh vực công nghệ cao, năng lượng tái tạo và du lịch bền vững.</p>
    `,
    contentEn: `
      <p>In the context of intense competition for foreign investment attraction, Da Nang is implementing many synchronous solutions to enhance its attractiveness to international investors.</p>

      <h2>Improving investment environment</h2>
      <p>The city has deployed many new incentive policies, especially in high-tech, renewable energy and sustainable tourism sectors.</p>
    `
  },
  {
    id: "tr1",
    slug: "khoi-dong-chuong-trinh-uom-tao-khoi-nghiep",
    title: "Khởi động chương trình ươm tạo khởi nghiệp công nghệ DSEZA 2025",
    titleEn: "DSEZA Technology Startup Incubation Program 2025 launched",
    excerpt: "Chương trình năm nay dự kiến sẽ chọn 10 dự án tiềm năng để hỗ trợ phát triển sản phẩm và kết nối với nhà đầu tư.",
    excerptEn: "This year's program is expected to select 10 potential projects to support product development and connect with investors.",
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4",
    publishDate: "2025-05-19T00:00:00Z",
    category: mockCategories[1],
    isFeatured: false,
    readingTime: "6 phút",
    readingTimeEn: "6 min",
    content: `
      <p>DSEZA chính thức khởi động chương trình ươm tạo khởi nghiệp công nghệ năm 2025 với nhiều điểm mới đáng chú ý.</p>

      <h2>Các lĩnh vực ưu tiên</h2>
      <p>Chương trình tập trung vào các lĩnh vực: AI, IoT, FinTech, HealthTech và GreenTech.</p>
    `,
    contentEn: `
      <p>DSEZA officially launched the 2025 technology startup incubation program with many noteworthy new features.</p>

      <h2>Priority sectors</h2>
      <p>The program focuses on: AI, IoT, FinTech, HealthTech and GreenTech sectors.</p>
    `
  },
  {
    id: "tr2",
    slug: "dseza-hop-tac-dh-fpt-dao-tao-nhan-luc",
    title: "DSEZA hợp tác với ĐH FPT đào tạo nhân lực công nghệ cao",
    titleEn: "DSEZA cooperates with FPT University to train high-tech human resources",
    excerpt: "Thỏa thuận hợp tác nhằm đào tạo nguồn nhân lực chất lượng cao đáp ứng nhu cầu của các doanh nghiệp trong khu công nghệ cao.",
    excerptEn: "The cooperation agreement aims to train high-quality human resources to meet the needs of businesses in the high-tech park.",
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
    publishDate: "2025-05-16T00:00:00Z",
    category: mockCategories[1],
    isFeatured: false,
    readingTime: "4 phút",
    readingTimeEn: "4 min",
    content: `
      <p>Thỏa thuận hợp tác chiến lược giữa DSEZA và Đại học FPT nhằm đào tạo nguồn nhân lực chất lượng cao.</p>

      <h2>Nội dung hợp tác</h2>
      <p>Hai bên sẽ phối hợp trong việc thiết kế chương trình đào tạo, thực tập và tuyển dụng.</p>
    `,
    contentEn: `
      <p>Strategic cooperation agreement between DSEZA and FPT University to train high-quality human resources.</p>

      <h2>Cooperation content</h2>
      <p>Both parties will coordinate in designing training programs, internships and recruitment.</p>
    `
  },
  {
    id: "dg1",
    slug: "trien-khai-he-thong-quan-ly-thong-minh",
    title: "Triển khai hệ thống quản lý thông minh tại DSEZA",
    titleEn: "Implementing smart management system at DSEZA",
    excerpt: "Hệ thống quản lý thông minh sẽ giúp tối ưu hóa quy trình vận hành và nâng cao hiệu quả quản lý khu vực.",
    excerptEn: "The smart management system will help optimize operational processes and enhance management efficiency in the zone.",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
    publishDate: "2025-05-17T00:00:00Z",
    category: mockCategories[2],
    isFeatured: false,
    readingTime: "5 phút",
    readingTimeEn: "5 min",
    content: `
      <p>DSEZA đang triển khai hệ thống quản lý thông minh để nâng cao hiệu quả hoạt động.</p>

      <h2>Tính năng chính</h2>
      <p>Hệ thống bao gồm: giám sát an ninh, quản lý giao thông, và theo dõi môi trường.</p>
    `,
    contentEn: `
      <p>DSEZA is implementing a smart management system to improve operational efficiency.</p>

      <h2>Key features</h2>
      <p>The system includes: security monitoring, traffic management, and environmental monitoring.</p>
    `
  }
];

// Response type for paginated articles
export interface PaginatedNewsResponse {
  articles: NewsArticle[];
  totalArticles: number;
  totalPages: number;
  currentPage: number;
}

// API functions
export const fetchNewsCategories = async (): Promise<NewsCategory[]> => {
  return new Promise(resolve => 
    setTimeout(() => resolve(mockCategories), MOCK_DELAY)
  );
};

// UPDATED: Enhanced fetchNewsArticles with pagination support
export const fetchNewsArticles = async (
  categoryId?: string, 
  page: number = 1,
  limit: number = 9, 
  featured?: boolean
): Promise<PaginatedNewsResponse> => {
  return new Promise(resolve => {
    setTimeout(() => {
      let articles = [...mockArticles];
      
      if (categoryId && categoryId !== 'all') {
        articles = articles.filter(article => article.category.id === categoryId);
      }
      
      if (featured !== undefined) {
        articles = articles.filter(article => article.isFeatured === featured);
      }

      // Sort by publish date descending
      articles.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

      const totalArticles = articles.length;
      const totalPages = Math.ceil(totalArticles / limit);
      const startIndex = (page - 1) * limit;
      const paginatedArticles = articles.slice(startIndex, startIndex + limit);

      resolve({
        articles: paginatedArticles,
        totalArticles,
        totalPages,
        currentPage: page
      });
    }, MOCK_DELAY);
  });
};

export const fetchFeaturedArticle = async (): Promise<NewsArticle | null> => {
  const featured = mockArticles.find(article => article.isFeatured);
  return new Promise(resolve => 
    setTimeout(() => resolve(featured || null), MOCK_DELAY)
  );
};

export const fetchRegularNews = async (
  categoryId?: string, 
  limit: number = 3
): Promise<NewsArticle[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      let articles = mockArticles.filter(article => !article.isFeatured);
      if (categoryId && categoryId !== 'all') {
        articles = articles.filter(article => article.category.id === categoryId);
      }
      resolve(articles.slice(0, limit));
    }, MOCK_DELAY);
  });
};

// NEW: Fetch category info by slug for CategoryNewsPage
export const fetchCategoryInfoBySlug = async (categorySlug: string): Promise<NewsCategory | null> => {
  console.log(`Fetching category with slug: ${categorySlug}`); // Debug log
  return new Promise(resolve => {
    setTimeout(() => {
      const category = mockCategories.find(c => c.slug === categorySlug);
      console.log('Found category:', category); // Debug log
      resolve(category || null);
    }, MOCK_DELAY);
  });
};

// NEW: Fetch articles by category slug with pagination
export const fetchArticlesByCategorySlug = async (
  categorySlug: string,
  page: number = 1,
  limit: number = 9
): Promise<PaginatedNewsResponse> => {
  console.log(`Fetching articles for category slug: ${categorySlug}, page: ${page}`); // Debug log
  
  return new Promise(resolve => {
    setTimeout(() => {
      // First find the category
      const category = mockCategories.find(c => c.slug === categorySlug);
      
      if (!category) {
        resolve({
          articles: [],
          totalArticles: 0,
          totalPages: 0,
          currentPage: page
        });
        return;
      }

      // Filter articles by category
      let articles = mockArticles.filter(article => article.category.id === category.id);
      
      // Sort by publish date descending
      articles.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

      const totalArticles = articles.length;
      const totalPages = Math.ceil(totalArticles / limit);
      const startIndex = (page - 1) * limit;
      const paginatedArticles = articles.slice(startIndex, startIndex + limit);

      console.log(`Found ${totalArticles} articles, returning page ${page} with ${paginatedArticles.length} articles`); // Debug log

      resolve({
        articles: paginatedArticles,
        totalArticles,
        totalPages,
        currentPage: page
      });
    }, MOCK_DELAY);
  });
};

// Fetch article by slug for detail page
export const fetchNewsArticleBySlug = async (slug: string): Promise<NewsArticle | null> => {
  console.log(`Fetching article with slug: ${slug}`); // Debug log
  return new Promise(resolve => {
    setTimeout(() => {
      const article = mockArticles.find(a => a.slug === slug);
      console.log('Found article:', article); // Debug log
      resolve(article || null);
    }, MOCK_DELAY);
  });
};

// Fetch related news (same category, exclude current article)
export const fetchRelatedNews = async (
  currentArticleSlug: string, 
  categoryId: string, 
  limit: number = 4
): Promise<NewsArticle[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const related = mockArticles.filter(
        article => article.category.id === categoryId && article.slug !== currentArticleSlug
      ).slice(0, limit);
      resolve(related);
    }, MOCK_DELAY);
  });
};

// Fetch recent news for sidebar (exclude current article)
export const fetchRecentNews = async (
  currentArticleSlug?: string, 
  limit: number = 5
): Promise<NewsArticle[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      let articles = [...mockArticles];
      if (currentArticleSlug) {
        articles = articles.filter(article => article.slug !== currentArticleSlug);
      }
      // Sort by date descending
      articles.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
      resolve(articles.slice(0, limit));
    }, MOCK_DELAY);
  });
}; 