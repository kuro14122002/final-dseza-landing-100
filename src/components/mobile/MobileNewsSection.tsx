
import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";
import { useTranslation } from "@/utils/translations";
import { useLanguage } from "@/context/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define interfaces for news data types
interface NewsCategory {
  id: string;
  name: string;
  nameEn?: string;
}

interface NewsArticle {
  id: string;
  categoryId: string;
  image: string;
  date: string;
  title: string;
  titleEn?: string;
  excerpt?: string;
  excerptEn?: string;
  url?: string;
}

/**
 * Individual news article card component
 */
const NewsCard: React.FC<NewsArticle> = ({
  image,
  date,
  title,
  titleEn,
  excerpt,
  excerptEn,
  url = "#"
}) => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  
  // Use translated content if available
  const displayTitle = language === 'en' && titleEn ? titleEn : title;
  const displayExcerpt = language === 'en' && excerptEn ? excerptEn : excerpt;
  
  // Theme-specific styles
  const cardBg = theme === "dark" ? "bg-[#2C3640]" : "bg-[#F2F2F2]";
  const mainText = theme === "dark" ? "text-white" : "text-black";
  const secondaryText = theme === "dark" ? "text-[#B0BEC5]" : "text-[#545454]";
  const shadowStyle = theme === "dark" ? "shadow-lg shadow-black/25" : "shadow-lg";
  const hoverShadow = theme === "dark" ? "hover:shadow-xl hover:shadow-black/35" : "hover:shadow-xl";
  
  return (
    <a
      href={url}
      className={cn(
        "block rounded-xl overflow-hidden",
        cardBg,
        shadowStyle,
        hoverShadow,
        "transition-transform duration-300 ease-in-out",
        "hover:scale-[1.01] active:scale-[0.99]",
        "cursor-pointer"
      )}
    >
      {/* News Article Image (16:9 aspect ratio) */}
      <div className="w-full aspect-video relative">
        <img
          src={image}
          alt={displayTitle}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Text Content Area */}
      <div className="p-4">
        {/* News Date */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <Calendar className={cn("h-3.5 w-3.5", secondaryText)} />
          <p className={cn("text-xs font-inter font-normal", secondaryText)}>
            {date}
          </p>
        </div>
        
        {/* News Title */}
        <h3 className={cn("font-montserrat font-semibold text-lg mb-2 line-clamp-3", mainText)}>
          {displayTitle}
        </h3>
        
        {/* News Snippet (if available) */}
        {displayExcerpt && (
          <p className={cn("font-inter font-normal text-sm line-clamp-2", secondaryText)}>
            {displayExcerpt}
          </p>
        )}
      </div>
    </a>
  );
};

/**
 * Loading placeholder for news cards
 */
const NewsCardSkeleton: React.FC = () => {
  const { theme } = useTheme();
  const cardBg = theme === "dark" ? "bg-[#2C3640]" : "bg-[#F2F2F2]";
  
  return (
    <div className={cn("rounded-xl overflow-hidden", cardBg, "shadow-lg")}>
      <Skeleton className="w-full aspect-video" />
      <div className="p-4">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Skeleton className="h-3.5 w-3.5 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-7 w-full mb-2" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4 mt-1" />
      </div>
    </div>
  );
};

/**
 * Mobile-specific news section with filtering tabs
 */
const MobileNewsSection: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<string>("investment");
  
  // Theme-specific styles for the section container
  const sectionBg = theme === "dark" ? "bg-[#1E272F]" : "bg-white";
  const titleText = theme === "dark" ? "text-white" : "text-black";
  const buttonText = theme === "dark" ? "text-[#19DBCF]" : "text-[#416628]";
  const buttonBorder = theme === "dark" ? "border-[#19DBCF]" : "border-[#416628]";
  const buttonHoverBg = theme === "dark" ? "hover:bg-[#19DBCF]/10" : "hover:bg-[#416628]/10";
  
  // News categories data
  const categories: NewsCategory[] = [
    { 
      id: "investment", 
      name: "Đầu tư – Hợp tác quốc tế",
      nameEn: "Investment – Int'l Cooperation" 
    },
    { 
      id: "training", 
      name: "Đào tạo, Ươm tạo khởi nghiệp",
      nameEn: "Training & Startup Incubation" 
    },
    { 
      id: "digital", 
      name: "Chuyển đổi số",
      nameEn: "Digital Transformation" 
    },
    { 
      id: "activities", 
      name: "Hoạt động Ban quản lý",
      nameEn: "Management Board Activities" 
    },
    { 
      id: "other", 
      name: "Tin khác",
      nameEn: "Other News" 
    }
  ];
  
  // Sample news articles data for each category
  const newsArticles: { [key: string]: NewsArticle[] } = {
    "investment": [
      {
        id: "inv1",
        categoryId: "investment",
        image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
        date: "20/05/2025",
        title: "DSEZA thu hút thành công dự án FDI 100 triệu USD từ Nhật Bản",
        titleEn: "DSEZA successfully attracts $100M FDI project from Japan",
        excerpt: "Dự án tập trung vào sản xuất linh kiện điện tử công nghệ cao, dự kiến tạo ra hàng ngàn việc làm...",
        excerptEn: "The project focuses on high-tech electronic component manufacturing, expected to create thousands of jobs...",
        url: "#news-inv1"
      },
      {
        id: "inv2",
        categoryId: "investment",
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
        date: "18/05/2025",
        title: "Hội thảo xúc tiến đầu tư vào Đà Nẵng tổ chức tại Singapore",
        titleEn: "Da Nang investment promotion workshop held in Singapore",
        excerpt: "Nhiều nhà đầu tư Singapore bày tỏ sự quan tâm sâu sắc đến môi trường đầu tư tại các KCN, KCNC Đà Nẵng...",
        excerptEn: "Many Singaporean investors expressed deep interest in the investment environment in Da Nang's industrial and high-tech zones...",
        url: "#news-inv2"
      },
      {
        id: "inv3",
        categoryId: "investment",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
        date: "15/05/2025",
        title: "Đà Nẵng nâng cao năng lực cạnh tranh trong thu hút đầu tư nước ngoài",
        titleEn: "Da Nang enhances competitiveness in attracting foreign investment",
        excerpt: "Thành phố đang tích cực cải thiện môi trường đầu tư, đơn giản hóa thủ tục hành chính để thu hút các dự án chất lượng cao...",
        excerptEn: "The city is actively improving the investment environment and simplifying administrative procedures to attract high-quality projects...",
        url: "#news-inv3"
      }
    ],
    "training": [
      {
        id: "tr1",
        categoryId: "training",
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4",
        date: "19/05/2025",
        title: "Khởi động chương trình ươm tạo khởi nghiệp công nghệ DSEZA 2025",
        titleEn: "DSEZA Technology Startup Incubation Program 2025 launched",
        excerpt: "Chương trình năm nay dự kiến sẽ chọn 10 dự án tiềm năng để hỗ trợ phát triển sản phẩm và kết nối với nhà đầu tư...",
        excerptEn: "This year's program is expected to select 10 potential projects to support product development and connect with investors...",
        url: "#news-tr1"
      },
      {
        id: "tr2",
        categoryId: "training",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
        date: "16/05/2025",
        title: "DSEZA hợp tác với ĐH FPT đào tạo nhân lực công nghệ cao",
        titleEn: "DSEZA cooperates with FPT University to train high-tech human resources",
        excerpt: "Thỏa thuận hợp tác nhằm đào tạo nguồn nhân lực chất lượng cao đáp ứng nhu cầu của các doanh nghiệp trong khu công nghệ cao...",
        excerptEn: "The cooperation agreement aims to train high-quality human resources to meet the needs of businesses in the high-tech park...",
        url: "#news-tr2"
      },
      {
        id: "tr3",
        categoryId: "training",
        image: "https://images.unsplash.com/photo-1531482615713-2afd69097998",
        date: "10/05/2025",
        title: "10 startup công nghệ Đà Nẵng được chọn tham gia chương trình tăng tốc khởi nghiệp",
        titleEn: "10 Da Nang tech startups selected for acceleration program",
        excerpt: "Các startup sẽ được hỗ trợ về mặt kỹ thuật, tài chính và kết nối thị trường trong 6 tháng...",
        excerptEn: "Startups will receive technical, financial support and market connections for 6 months...",
        url: "#news-tr3"
      }
    ],
    "digital": [
      {
        id: "dig1",
        categoryId: "digital",
        image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12",
        date: "17/05/2025",
        title: "DSEZA triển khai nền tảng số hóa quản lý khu công nghiệp",
        titleEn: "DSEZA implements digital platform for industrial zone management",
        excerpt: "Nền tảng mới giúp tối ưu hóa quy trình quản lý và tăng cường hiệu quả hoạt động của các khu công nghiệp...",
        excerptEn: "The new platform helps optimize management processes and enhance the operational efficiency of industrial zones...",
        url: "#news-dig1"
      },
      {
        id: "dig2",
        categoryId: "digital",
        image: "https://images.unsplash.com/photo-1573164713988-8665fc963095",
        date: "14/05/2025",
        title: "Các doanh nghiệp trong KCN Đà Nẵng đẩy mạnh chuyển đổi số",
        titleEn: "Businesses in Da Nang Industrial Zone accelerate digital transformation",
        excerpt: "Hơn 70% doanh nghiệp đã ứng dụng công nghệ số vào quy trình sản xuất và quản lý...",
        excerptEn: "More than 70% of businesses have applied digital technology to production and management processes...",
        url: "#news-dig2"
      },
      {
        id: "dig3",
        categoryId: "digital",
        image: "https://images.unsplash.com/photo-1526498460520-4c246339dccb",
        date: "12/05/2025",
        title: "Hội thảo về AI và tự động hóa trong sản xuất công nghiệp tại KCNC Đà Nẵng",
        titleEn: "Workshop on AI and automation in industrial production at Da Nang High-Tech Park",
        excerpt: "Sự kiện thu hút sự tham gia của nhiều chuyên gia công nghệ và đại diện doanh nghiệp để thảo luận về xu hướng tương lai...",
        excerptEn: "The event attracted many technology experts and business representatives to discuss future trends...",
        url: "#news-dig3"
      }
    ],
    "activities": [
      {
        id: "act1",
        categoryId: "activities",
        image: "https://images.unsplash.com/photo-1530973428-5bf2db2e4d71",
        date: "21/05/2025",
        title: "Ban quản lý DSEZA tổ chức đối thoại với doanh nghiệp quý II/2025",
        titleEn: "DSEZA Management Board organizes Q2/2025 dialogue with businesses",
        excerpt: "Buổi đối thoại nhằm lắng nghe ý kiến, giải quyết khó khăn và đề xuất từ các doanh nghiệp trong khu công nghiệp...",
        excerptEn: "The dialogue aims to listen to opinions, resolve difficulties and proposals from businesses in the industrial zone...",
        url: "#news-act1"
      },
      {
        id: "act2",
        categoryId: "activities",
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4",
        date: "11/05/2025",
        title: "DSEZA làm việc với đoàn đại biểu đến từ Hàn Quốc",
        titleEn: "DSEZA works with delegation from South Korea",
        excerpt: "Đoàn đại biểu bày tỏ mong muốn tìm kiếm cơ hội hợp tác và mở rộng hoạt động tại Đà Nẵng...",
        excerptEn: "The delegation expressed their desire to seek cooperation opportunities and expand activities in Da Nang...",
        url: "#news-act2"
      },
      {
        id: "act3",
        categoryId: "activities",
        image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0",
        date: "09/05/2025",
        title: "Ban quản lý DSEZA công bố kế hoạch phát triển 5 năm (2026-2030)",
        titleEn: "DSEZA Management Board announces 5-year development plan (2026-2030)",
        excerpt: "Kế hoạch đặt ra mục tiêu thu hút 3 tỷ USD vốn đầu tư và phát triển các ngành công nghệ cao...",
        excerptEn: "The plan sets a target of attracting $3 billion in investment capital and developing high-tech industries...",
        url: "#news-act3"
      }
    ],
    "other": [
      {
        id: "oth1",
        categoryId: "other",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
        date: "19/05/2025",
        title: "Đà Nẵng phát triển hạ tầng giao thông kết nối các khu công nghiệp",
        titleEn: "Da Nang develops transportation infrastructure connecting industrial zones",
        excerpt: "Dự án đường cao tốc mới sẽ giúp rút ngắn thời gian di chuyển và tăng hiệu quả logistic cho các doanh nghiệp...",
        excerptEn: "The new expressway project will help shorten travel time and increase logistics efficiency for businesses...",
        url: "#news-oth1"
      },
      {
        id: "oth2",
        categoryId: "other",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab",
        date: "16/05/2025",
        title: "Triển lãm công nghệ xanh tại KCNC Đà Nẵng",
        titleEn: "Green technology exhibition at Da Nang High-Tech Park",
        excerpt: "Triển lãm giới thiệu những giải pháp công nghệ mới nhất giúp doanh nghiệp phát triển bền vững và thân thiện với môi trường...",
        excerptEn: "The exhibition introduces the latest technological solutions to help businesses develop sustainably and environmentally friendly...",
        url: "#news-oth2"
      },
      {
        id: "oth3",
        categoryId: "other",
        image: "https://images.unsplash.com/photo-1523287562758-66c7fc58967f",
        date: "13/05/2025",
        title: "Khu công nghệ cao Đà Nẵng được vinh danh là một trong những KCNC xanh nhất Đông Nam Á",
        titleEn: "Da Nang High-Tech Park honored as one of the greenest in Southeast Asia",
        excerpt: "Giải thưởng ghi nhận những nỗ lực trong việc xây dựng môi trường công nghiệp xanh và bền vững...",
        excerptEn: "The award recognizes efforts in building a green and sustainable industrial environment...",
        url: "#news-oth3"
      }
    ]
  };
  
  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
  };
  
  // Get the current category's articles
  const currentArticles = newsArticles[activeCategory] || [];
  
  return (
    <section className={cn(
      sectionBg,
      "py-8 px-4 w-full"
    )}>
      {/* Section Title */}
      <h2 className={cn(
        "font-montserrat font-bold text-2xl text-left mb-6",
        titleText
      )}>
        {t('newsSection.title') || "TIN TỨC"}
      </h2>
      
      {/* Tabs navigation for filtering news */}
      <Tabs
        defaultValue={activeCategory}
        value={activeCategory}
        onValueChange={handleCategoryChange}
        className="w-full"
      >
        {/* Custom TabsList wrapper to allow horizontal scrolling */}
        <div className="overflow-x-auto scrollbar-hide pb-2 mb-6 -mx-1 px-1">
          <TabsList className="bg-transparent p-0 h-auto flex space-x-3 min-w-max">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className={cn(
                  "py-2 px-4 rounded-full font-inter text-sm font-medium whitespace-nowrap flex-shrink-0",
                  "transition-colors duration-200 ease-in-out",
                  "data-[state=active]:bg-dseza-dark-primary data-[state=active]:text-dseza-dark-main-bg data-[state=active]:font-semibold dark:data-[state=active]:bg-[#19DBCF] dark:data-[state=active]:text-[#1E272F]",
                  "data-[state=inactive]:bg-dseza-light-hover dark:data-[state=inactive]:bg-[#3A4750]",
                  "data-[state=inactive]:text-dseza-light-secondary-text dark:data-[state=inactive]:text-[#B0BEC5]",
                  "hover:data-[state=inactive]:bg-dseza-light-border dark:hover:data-[state=inactive]:bg-[#455A64]",
                  "focus-visible:ring-offset-0 focus-visible:ring-0"
                )}
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        {/* Tab content sections */}
        {categories.map((category) => (
          <TabsContent
            key={category.id}
            value={category.id}
            className="mt-0 focus-visible:outline-none focus-visible:ring-0"
          >
            {/* News Articles List (Vertical Stack) */}
            <div className="flex flex-col space-y-5">
              {newsArticles[category.id]?.map((article) => (
                <NewsCard
                  key={article.id}
                  id={article.id}
                  categoryId={article.categoryId}
                  image={article.image}
                  date={article.date}
                  title={article.title}
                  titleEn={article.titleEn}
                  excerpt={article.excerpt}
                  excerptEn={article.excerptEn}
                  url={article.url}
                />
              ))}
            </div>
            
            {/* View More Button */}
            <div className="flex justify-center mt-6">
              <a
                href={`#view-more-${category.id}`}
                className={cn(
                  "py-2.5 px-6 rounded-full font-inter font-medium text-sm",
                  "border transition-colors duration-200",
                  buttonText,
                  buttonBorder,
                  buttonHoverBg
                )}
              >
                {t('newsSection.viewMore') || "XEM THÊM TIN TỨC"}
              </a>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
};

export default MobileNewsSection;
