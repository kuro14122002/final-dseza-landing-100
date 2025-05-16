
import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/utils/translations";

interface NewsCardProps {
  image: string;
  date: string;
  title: string;
  excerpt: string;
  url: string;
  category: string;
}

/**
 * Individual news card component specifically for mobile
 */
const MobileNewsCard: React.FC<NewsCardProps> = ({ 
  image, 
  date, 
  title, 
  excerpt, 
  url 
}) => {
  const { theme } = useTheme();
  
  // Theme-specific styles
  const cardBg = theme === "dark" ? "bg-[#2C3640]" : "bg-[#F2F2F2]";
  const textColor = theme === "dark" ? "text-white" : "text-black";
  const secondaryTextColor = theme === "dark" ? "text-[#B0BEC5]" : "text-[#545454]";
  const shadowStyle = theme === "dark" ? "shadow-lg shadow-black/25" : "shadow-lg shadow-neutral-300/40";
  
  return (
    <a 
      href={url} 
      className={cn(
        "block rounded-xl overflow-hidden transition-all duration-200",
        "hover:transform hover:scale-[1.01] active:scale-[0.99]",
        cardBg,
        shadowStyle
      )}
    >
      <div className="aspect-[16/9] relative">
        <img 
          src={image} 
          alt={title} 
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <p className={cn("text-xs mb-1.5", secondaryTextColor)}>{date}</p>
        <h3 className={cn(
          "font-montserrat font-semibold text-lg mb-2 line-clamp-2",
          textColor
        )}>
          {title}
        </h3>
        <p className={cn(
          "text-sm line-clamp-3",
          secondaryTextColor
        )}>
          {excerpt}
        </p>
      </div>
    </a>
  );
};

/**
 * Mobile-specific news section with category filters and vertical card list
 */
const MobileNewsSection: React.FC = () => {
  const { theme } = useTheme();
  const [activeCategory, setActiveCategory] = useState("investment");
  const { t } = useTranslation();
  
  // Theme-specific styles
  const sectionBg = theme === "dark" ? "bg-[#1E272F]" : "bg-white";
  const textColor = theme === "dark" ? "text-white" : "text-black";
  
  // Tab categories
  const categories = [
    { id: "investment", name: t('news.categories.investment') || "Đầu tư – Hợp tác quốc tế" },
    { id: "training", name: t('news.categories.training') || "Đào tạo, Ươm tạo khởi nghiệp" },
    { id: "digital", name: t('news.categories.digital') || "Chuyển đổi số" },
    { id: "management", name: t('news.categories.management') || "Hoạt động Ban quản lý" },
    { id: "other", name: t('news.categories.other') || "Tin khác" }
  ];
  
  // Styling for tabs
  const getTabStyles = (isActive: boolean) => {
    // Base styles
    let styles = "px-4 py-2 rounded-md font-inter font-medium text-sm transition-colors duration-200 ease-in-out border";
    
    if (isActive) {
      // Active tab
      if (theme === "dark") {
        styles += " bg-[#19DBCF] text-[#1E272F] border-[#19DBCF]";
      } else {
        styles += " bg-[#416628] text-white border-[#416628]";
      }
    } else {
      // Inactive tab
      if (theme === "dark") {
        styles += " bg-[#2C3640] text-[#B0BEC5] border-transparent hover:bg-[#3A4750]";
      } else {
        styles += " bg-[#F2F2F2] text-[#545454] border-transparent hover:bg-[#E9E9E9]";
      }
    }
    
    return styles;
  };
  
  // Dummy news data - in a real implementation, this would come from props or an API
  const newsData = [
    {
      id: 1,
      category: "investment",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
      date: "15/05/2025",
      title: t('news.sampleNews.news1.title') || "Ban Quản lý các Khu công nghệ cao và các Khu công nghiệp Đà Nẵng tiếp và làm việc với Tập đoàn CFLD - Trung Quốc",
      excerpt: t('news.sampleNews.news1.excerpt') || "Sáng ngày 15/5, tại trụ sở Ban Quản lý các Khu công nghệ cao và các Khu công nghiệp Đà Nẵng đã diễn ra buổi tiếp và làm việc với đoàn công tác của Tập đoàn China Fortune Land Development (CFLD) - Trung Quốc do ông Zhang Bo, Phó Chủ tịch Tập đoàn CFLD làm Trưởng đoàn...",
      url: "#news-1"
    },
    {
      id: 2,
      category: "investment",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
      date: "14/05/2025",
      title: t('news.sampleNews.news2.title') || "Đà Nẵng tổ chức Hội nghị xúc tiến đầu tư công nghệ cao 2025",
      excerpt: t('news.sampleNews.news2.excerpt') || "Ngày 14/5, tại Trung tâm Hành chính thành phố Đà Nẵng, UBND thành phố Đà Nẵng và Ban Quản lý các Khu công nghệ cao và các Khu công nghiệp Đà Nẵng đã tổ chức Hội nghị Xúc tiến đầu tư vào Khu công nghệ cao Đà Nẵng và các Khu công nghiệp trên địa bàn thành phố Đà Nẵng năm 2025...",
      url: "#news-2"
    },
    {
      id: 3,
      category: "investment",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
      date: "12/05/2025",
      title: t('news.sampleNews.news3.title') || "Thủ tướng Chính phủ phê duyệt Đề án phát triển các Khu công nghiệp sinh thái tại Việt Nam",
      excerpt: t('news.sampleNews.news3.excerpt') || "Ngày 12/5, Thủ tướng Chính phủ đã ký Quyết định số 123/QĐ-TTg phê duyệt Đề án phát triển các Khu công nghiệp sinh thái tại Việt Nam. Đề án đặt mục tiêu đến năm 2030, Việt Nam sẽ có ít nhất 20 Khu công nghiệp sinh thái được phát triển theo tiêu chí quốc tế...",
      url: "#news-3"
    },
    {
      id: 4,
      category: "training",
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
      date: "10/05/2025",
      title: "Chương trình đào tạo khởi nghiệp cho sinh viên công nghệ",
      excerpt: "Ban Quản lý các Khu công nghệ cao phối hợp với các trường đại học tại Đà Nẵng tổ chức chương trình đào tạo khởi nghiệp dành cho sinh viên ngành công nghệ thông tin và kỹ thuật điện tử...",
      url: "#news-4"
    },
    {
      id: 5,
      category: "digital",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
      date: "08/05/2025",
      title: "Hội thảo về chuyển đổi số cho doanh nghiệp trong Khu công nghệ cao",
      excerpt: "Ngày 08/5, tại Trung tâm Đổi mới sáng tạo Đà Nẵng đã diễn ra Hội thảo về giải pháp chuyển đổi số toàn diện cho các doanh nghiệp đang hoạt động trong Khu công nghệ cao Đà Nẵng...",
      url: "#news-5"
    }
  ];
  
  // Filter news by active category
  const filteredNews = newsData.filter(item => item.category === activeCategory);
  
  return (
    <section className={cn("py-8 px-4", sectionBg)} aria-label="Tin tức">
      <h2 className={cn(
        "font-montserrat font-bold text-3xl mb-5",
        textColor
      )}>
        {t('news.title') || "TIN TỨC"}
      </h2>
      
      {/* Scrollable Filter Tabs */}
      <div className="scrollbar-hide overflow-x-auto flex space-x-3 py-1 mb-6">
        {categories.map((category) => (
          <button
            key={category.id}
            className={getTabStyles(activeCategory === category.id)}
            onClick={() => setActiveCategory(category.id)}
            aria-pressed={activeCategory === category.id}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      {/* Vertical Stack of News Cards */}
      <div className="space-y-5">
        {filteredNews.map((news) => (
          <MobileNewsCard
            key={news.id}
            image={news.image}
            date={news.date}
            title={news.title}
            excerpt={news.excerpt}
            url={news.url}
            category={news.category}
          />
        ))}
      </div>
    </section>
  );
};

export default MobileNewsSection;
