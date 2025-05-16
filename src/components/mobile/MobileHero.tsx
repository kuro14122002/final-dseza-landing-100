
import React, { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";

// Define the structure for hero tab data
interface HeroTab {
  id: string;
  title: string;
  image: string;
  thumbnailImage: string;
}

// Hero section tabs data
const heroTabs: HeroTab[] = [
  {
    id: "tech-park",
    title: "Khu công nghệ cao Đà Nẵng",
    image: "/media/khucongnghecaolight.jpg",
    thumbnailImage: "/media/khucongnghecaothumb.jpg"
  },
  {
    id: "free-trade",
    title: "Khu thương mại tự do Đà Nẵng",
    image: "/media/khuthuongmaitdlight.jpg",
    thumbnailImage: "/media/khuthuongmaitdthumb.jpg"
  },
  {
    id: "it-park",
    title: "Khu công nghệ thông tin tập trung",
    image: "/media/khucongnghethongtinlight.jpg",
    thumbnailImage: "/media/khucongnghethongtinthumb.jpg"
  },
  {
    id: "industrial-zones",
    title: "Các khu công nghiệp Đà Nẵng",
    image: "/media/khucongnghieplight.jpg",
    thumbnailImage: "/media/khucongnghiepthumb.jpg"
  }
];

const MobileHero: React.FC = () => {
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<string>(heroTabs[0].id);
  const [api, setApi] = useState<any>(null);

  // Handle theme changes for images
  const getHeroImage = (tab: HeroTab) => {
    // For the main hero image, we use different versions for light/dark mode
    const imagePath = tab.image.replace('light', theme === 'dark' ? 'dark' : 'light');
    return imagePath;
  };

  // When a thumbnail is clicked, update the active tab
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    
    // Find the index of the tab with the given id
    const tabIndex = heroTabs.findIndex(tab => tab.id === tabId);
    if (tabIndex !== -1 && api) {
      // Use the carousel API to scroll to the selected tab
      api.scrollTo(tabIndex);
    }
  };

  // When carousel changes, update active tab
  useEffect(() => {
    if (!api) return;
    
    const onSelect = () => {
      const selectedIndex = api.selectedScrollSnap();
      setActiveTab(heroTabs[selectedIndex].id);
    };
    
    api.on("select", onSelect);
    
    // Cleanup
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // Get theme-specific styles
  const getBackgroundColor = () => 
    theme === "dark" ? "bg-dseza-dark-secondary-bg" : "bg-dseza-light-secondary-bg";
  
  const getTextColor = () =>
    theme === "dark" ? "text-white" : "text-black";
  
  const getActiveBorderColor = () =>
    theme === "dark" 
      ? "border-dseza-dark-primary-accent" 
      : "border-dseza-light-primary-accent";
  
  const getDefaultBorderColor = () =>
    theme === "dark" ? "border-dseza-dark-border" : "border-dseza-light-border";
  
  const getHoverBorderColor = () =>
    theme === "dark" 
      ? "hover:border-dseza-dark-secondary-accent" 
      : "hover:border-dseza-light-secondary-accent";
  
  // Find the active tab object
  const activeTabData = heroTabs.find(tab => tab.id === activeTab) || heroTabs[0];

  return (
    <section className="mb-8">
      {/* Main Hero Image */}
      <div className="relative w-full overflow-hidden">
        <Carousel setApi={setApi}>
          <CarouselContent>
            {heroTabs.map((tab) => (
              <CarouselItem key={tab.id}>
                <AspectRatio ratio={16/9}>
                  <img
                    src={getHeroImage(tab)}
                    alt={tab.title}
                    className="w-full h-full object-cover"
                  />
                </AspectRatio>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-2 z-10" />
          <CarouselNext className="absolute right-2 z-10" />
        </Carousel>
      </div>

      {/* Thumbnails Section */}
      <div className={cn(
        "px-4 py-3",
        getBackgroundColor()
      )}>
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {heroTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "flex-shrink-0 overflow-hidden rounded-md transition-all duration-300 ease-in-out transform",
                "border-2 min-w-[80px] h-16",
                tab.id === activeTab
                  ? getActiveBorderColor()
                  : cn(getDefaultBorderColor(), getHoverBorderColor(), "hover:scale-105")
              )}
            >
              <img
                src={tab.thumbnailImage}
                alt={tab.title}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
        
        {/* Text Label */}
        <div className="pt-2 pb-4 px-4 text-center">
          <h2 className={cn(
            "font-montserrat font-semibold text-lg",
            getTextColor()
          )}>
            {activeTabData.title}
          </h2>
        </div>
      </div>
    </section>
  );
};

export default MobileHero;
