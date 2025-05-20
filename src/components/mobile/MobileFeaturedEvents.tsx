
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";
import { useTranslation } from "@/utils/translations";
import { useLanguage } from "@/context/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";

// Define types for event data
interface EventCardProps {
  id: string;
  image: string;
  date: string;
  title: string;
  titleEn?: string;
  excerpt?: string;
  excerptEn?: string;
  url?: string;
}

/**
 * Individual mobile event card component
 */
const MobileEventCard: React.FC<EventCardProps> = ({ 
  image, date, title, titleEn, excerpt, excerptEn, url = "#" 
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
      {/* Event Image (16:9 aspect ratio) */}
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
        {/* Event Date */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <Calendar className={cn("h-3.5 w-3.5", secondaryText)} />
          <p className={cn("text-xs font-inter font-normal", secondaryText)}>
            {date}
          </p>
        </div>
        
        {/* Event Title */}
        <h3 className={cn("font-montserrat font-semibold text-lg mb-2 line-clamp-3", mainText)}>
          {displayTitle}
        </h3>
        
        {/* Event Snippet (if available) */}
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
 * Loading placeholder for event cards
 */
const EventCardSkeleton: React.FC = () => {
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
 * Mobile-specific featured events section
 */
const MobileFeaturedEvents: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  
  // Theme-specific styles for the section container
  const sectionBg = theme === "dark" ? "bg-[#1E272F]" : "bg-white";
  const titleText = theme === "dark" ? "text-white" : "text-black";
  
  // Sample event data - in a real app, this would come from an API
  const events = [
    {
      id: "1",
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
      date: "20/05/2025",
      title: "Hội nghị xúc tiến đầu tư công nghệ cao Đà Nẵng năm 2025",
      titleEn: "Da Nang High-Tech Investment Promotion Conference 2025",
      excerpt: "Hội nghị xúc tiến đầu tư công nghệ cao Đà Nẵng năm 2025 với sự tham gia của nhiều doanh nghiệp lớn trong và ngoài nước.",
      excerptEn: "Da Nang High-Tech Investment Promotion Conference 2025 with the participation of many large domestic and foreign enterprises.",
      url: "#event1"
    },
    {
      id: "2",
      image: "https://images.unsplash.com/photo-1458668383970-8ddd3927deed",
      date: "15/05/2025",
      title: "Triển lãm công nghệ và đổi mới sáng tạo khu công nghệ cao",
      titleEn: "High-Tech Park Technology and Innovation Exhibition",
      excerpt: "Triển lãm giới thiệu các thành tựu công nghệ mới nhất và các dự án đổi mới sáng tạo từ các doanh nghiệp trong khu công nghệ cao.",
      excerptEn: "Exhibition introducing the latest technological achievements and innovation projects from businesses in the high-tech park.",
      url: "#event2"
    },
    {
      id: "3",
      image: "https://images.unsplash.com/photo-1504893524553-b855bce32c67",
      date: "10/05/2025",
      title: "Hội thảo ứng dụng AI trong sản xuất công nghiệp",
      titleEn: "Workshop on AI Applications in Industrial Production",
      excerpt: "Hội thảo chia sẻ kinh nghiệm và giải pháp ứng dụng trí tuệ nhân tạo vào quy trình sản xuất công nghiệp hiện đại.",
      excerptEn: "Workshop sharing experiences and solutions for applying artificial intelligence to modern industrial production processes.",
      url: "#event3"
    },
    {
      id: "4",
      image: "https://images.unsplash.com/photo-1426604966848-d7adac402bff",
      date: "05/05/2025",
      title: "Khóa đào tạo chuyên sâu về phát triển phần mềm",
      titleEn: "Advanced Software Development Training Course",
      excerpt: "Khóa đào tạo nâng cao kỹ năng lập trình và phát triển phần mềm cho các kỹ sư công nghệ thông tin.",
      excerptEn: "Training course to enhance programming and software development skills for IT engineers.",
      url: "#event4"
    },
    {
      id: "5",
      image: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843",
      date: "01/05/2025",
      title: "Lễ khánh thành nhà máy sản xuất chip bán dẫn",
      titleEn: "Opening Ceremony of Semiconductor Chip Manufacturing Plant",
      excerpt: "Lễ khánh thành nhà máy sản xuất chip bán dẫn công nghệ cao đầu tiên tại Khu công nghệ cao Đà Nẵng.",
      excerptEn: "Opening ceremony of the first high-tech semiconductor chip manufacturing plant in Da Nang High-Tech Park.",
      url: "#event5"
    }
  ];

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
        {t('featuredEvents.title') || "SỰ KIỆN TIÊU ĐIỂM"}
      </h2>
      
      {/* Events List (Vertical Stack) */}
      <div className="flex flex-col space-y-4">
        {events.map((event) => (
          <MobileEventCard
            key={event.id}
            id={event.id}
            image={event.image}
            date={event.date}
            title={event.title}
            titleEn={event.titleEn}
            excerpt={event.excerpt}
            excerptEn={event.excerptEn}
            url={event.url}
          />
        ))}
      </div>
    </section>
  );
};

export default MobileFeaturedEvents;
