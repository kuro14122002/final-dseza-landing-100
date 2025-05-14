
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

interface EventCardProps {
  date: string;
  title: string;
  excerpt: string;
  image: string;
  isLarge?: boolean;
}

/**
 * Individual event card component
 */
const EventCard: React.FC<EventCardProps> = ({ date, title, excerpt, image, isLarge }) => {
  const { theme } = useTheme();
  
  // Theme-specific styles
  const cardBg = theme === "dark" ? "bg-dseza-dark-secondary-bg" : "bg-dseza-light-secondary-bg";
  const textColor = theme === "dark" ? "text-dseza-dark-main-text" : "text-dseza-light-main-text";
  const secondaryTextColor = theme === "dark" ? "text-dseza-dark-secondary-text" : "text-dseza-light-secondary-text";
  
  return (
    <a 
      href="#" 
      className={cn(
        "block rounded-xl overflow-hidden transition-all duration-300 hover:transform hover:-translate-y-1",
        cardBg,
        isLarge ? "col-span-2 row-span-2" : "col-span-1 row-span-1",
        theme === "dark" ? "hover:shadow-[0_8px_16px_rgba(0,0,0,0.3)]" : "hover:shadow-[0_8px_16px_rgba(0,0,0,0.15)]"
      )}
    >
      <div className="h-0 pb-[56.25%] relative">
        <img 
          src={image} 
          alt={title} 
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div className="p-4 sm:p-5">
        <p className={cn("text-xs mb-1", secondaryTextColor)}>{date}</p>
        <h3 className={cn("font-montserrat font-semibold mb-2 line-clamp-2", textColor, isLarge ? "text-lg sm:text-xl" : "text-base")}>
          {title}
        </h3>
        <p className={cn("text-sm line-clamp-3", secondaryTextColor)}>
          {excerpt}
        </p>
      </div>
    </a>
  );
};

/**
 * Featured events section displaying prominent events
 */
const FeaturedEvents: React.FC = () => {
  const { theme } = useTheme();
  const textColor = theme === "dark" ? "text-dseza-dark-main-text" : "text-dseza-light-main-text";

  // Dummy data for the events
  const events = [
    {
      id: 1,
      date: "25/10/2025",
      title: "Sự kiện Đầu tư Quốc tế Đà Nẵng 2025",
      excerpt: "Cơ hội kết nối, hợp tác và phát triển cùng các nhà đầu tư hàng đầu trong và ngoài nước tại thành phố Đà Nẵng...",
      image: "https://via.placeholder.com/800x600/4A90E2/FFFFFF?text=Sự+kiện+Đầu+tư+Quốc+tế+Đà+Nẵng+2025"
    },
    {
      id: 2,
      date: "15/09/2025",
      title: "Hội thảo Chuyển đổi số Doanh nghiệp",
      excerpt: "Giải pháp toàn diện cho doanh nghiệp trong kỷ nguyên số...",
      image: "https://via.placeholder.com/400x300/50E3C2/FFFFFF?text=Hội+thảo+Chuyển+đổi+số"
    },
    {
      id: 3,
      date: "20/08/2025",
      title: "Ngày hội Việc làm Công nghệ cao",
      excerpt: "Cơ hội việc làm cho hàng nghìn kỹ sư, chuyên gia công nghệ...",
      image: "https://via.placeholder.com/400x300/B8E986/FFFFFF?text=Ngày+hội+Việc+làm"
    },
    {
      id: 4,
      date: "10/07/2025",
      title: "Diễn đàn Khởi nghiệp Sáng tạo",
      excerpt: "Không gian tương tác cho các startup và nhà đầu tư tiềm năng...",
      image: "https://via.placeholder.com/400x300/F8E71C/000000?text=Diễn+đàn+Khởi+nghiệp"
    },
    {
      id: 5,
      date: "05/06/2025",
      title: "Lễ Khánh thành Khu Nghiên cứu Mới",
      excerpt: "Cơ sở nghiên cứu hiện đại với trang thiết bị tiên tiến bậc nhất...",
      image: "https://via.placeholder.com/400x300/BD10E0/FFFFFF?text=Khu+Nghiên+cứu+Mới"
    }
  ];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <h2 className={cn(
          "font-montserrat font-bold text-3xl md:text-4xl mb-8 text-center",
          textColor
        )}>
          SỰ KIỆN TIÊU ĐIỂM
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {events.map((event, index) => (
            <EventCard 
              key={event.id}
              date={event.date}
              title={event.title}
              excerpt={event.excerpt}
              image={event.image}
              isLarge={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;
