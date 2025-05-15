
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { CalendarDays } from "lucide-react";

type EventCardProps = {
  image: string;
  date: string;
  title: string;
  excerpt?: string;
  featured?: boolean;
  isLarge?: boolean;
};

const EventCard = ({ image, date, title, excerpt, featured = false, isLarge = false }: EventCardProps) => {
  const isFeature = featured || isLarge;
  
  return (
    <div className={`relative overflow-hidden rounded-xl ${isFeature ? 'col-span-2 row-span-2' : ''}`}>
      <AspectRatio ratio={1/1}>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
        ></div>
      </AspectRatio>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
        <div className="flex items-center gap-2 mb-2 text-white/80">
          <CalendarDays className="h-4 w-4" />
          <span className="text-xs">{date}</span>
        </div>
        <h3 className={`font-bold text-white ${isFeature ? 'text-xl mb-2' : 'text-base'}`}>
          <a href="#" className="hover:underline">{title}</a>
        </h3>
        {isFeature && excerpt && (
          <p className="text-white/80 text-sm line-clamp-2">{excerpt}</p>
        )}
      </div>
    </div>
  );
};

/**
 * Featured events section displaying prominent events
 */
const FeaturedEvents: React.FC = () => {
  const { theme } = useTheme();
  const textColor = theme === "dark" ? "text-dseza-dark-main-text" : "text-dseza-light-main-text";

  // Sample event data - in a real app, this would come from an API
  const events = [
    {
      id: "1",
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
      date: "20/05/2023",
      title: "Sự kiện nổi bật 1",
      excerpt: "Hội nghị xúc tiến đầu tư công nghệ cao Đà Nẵng năm 2023 với sự tham gia của nhiều doanh nghiệp lớn trong và ngoài nước.",
      featured: true,
    },
    {
      id: "2",
      image: "https://images.unsplash.com/photo-1458668383970-8ddd3927deed",
      date: "15/05/2023",
      title: "Sự kiện nổi bật 2",
    },
    {
      id: "3",
      image: "https://images.unsplash.com/photo-1504893524553-b855bce32c67",
      date: "10/05/2023",
      title: "Sự kiện nổi bật 3",
    },
    {
      id: "4",
      image: "https://images.unsplash.com/photo-1426604966848-d7adac402bff",
      date: "05/05/2023",
      title: "Sự kiện nổi bật 4",
    },
    {
      id: "5",
      image: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843",
      date: "01/05/2023",
      title: "Sự kiện nổi bật 5",
    },
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
