// src/components/mobile/MobileHero.tsx
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
// import { useIsMobile } from "@/hooks/use-is-mobile"; // Không dùng trong component này
import { useTranslation } from "@/utils/translations"; // THÊM DÒNG NÀY

// Define the structure for hero tab data
interface HeroTab {
  id: string;
  titleKey: string; // ĐỔI TỪ title SANG titleKey
  image: string;
  thumbnailImage: string;
}

// Hero section tabs data - SỬ DỤNG titleKey
const heroTabs: HeroTab[] = [
  {
    id: "tech-park",
    titleKey: "heroBackground.tab1", // Sử dụng key từ translations.ts
    image: "/media/khucongnghecaolight.jpg",
    thumbnailImage: "/media/khucongnghecaothumb.jpg"
  },
  {
    id: "free-trade",
    titleKey: "heroBackground.tab2", // Sử dụng key từ translations.ts
    image: "/media/khuthuongmaitdlight.jpg",
    thumbnailImage: "/media/khuthuongmaitdthumb.jpg"
  },
  {
    id: "it-park",
    titleKey: "heroBackground.tab3", // Sử dụng key từ translations.ts
    image: "/media/khucongnghethongtinlight.jpg",
    thumbnailImage: "/media/khucongnghethongtinthumb.jpg"
  },
  {
    id: "industrial-zones",
    titleKey: "heroBackground.tab4", // Sử dụng key từ translations.ts
    image: "/media/khucongnghieplight.jpg",
    thumbnailImage: "/media/khucongnghiepthumb.jpg"
  }
];

const MobileHero: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation(); // KHỞI TẠO HOOK useTranslation
  // const isMobile = useIsMobile(); // Không cần thiết nếu component này chỉ cho mobile
  const [activeTab, setActiveTab] = useState<string>(heroTabs[0].id);
  const [api, setApi] = useState<any>(null);

  const getHeroImage = (tab: HeroTab) => {
    const imagePath = tab.image.replace('light', theme === 'dark' ? 'dark' : 'light');
    return imagePath;
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    const tabIndex = heroTabs.findIndex(tab => tab.id === tabId);
    if (tabIndex !== -1 && api) {
      api.scrollTo(tabIndex);
    }
  };

  useEffect(() => {
    if (!api) return;
    const onSelect = () => {
      const selectedIndex = api.selectedScrollSnap();
      setActiveTab(heroTabs[selectedIndex].id);
    };
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

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

  const activeTabData = heroTabs.find(tab => tab.id === activeTab) || heroTabs[0];

  return (
    <section className="mb-8">
      {/* Main Hero Image */}
      <div className="relative w-full overflow-hidden">
        <Carousel setApi={setApi}>
          <CarouselContent>
            {heroTabs.map((tab) => (
              <CarouselItem key={tab.id}>
                <AspectRatio ratio={16 / 9}>
                  <img
                    src={getHeroImage(tab)}
                    alt={t(tab.titleKey)} // DỊCH ALT TEXT
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
                alt={t(tab.titleKey)} // DỊCH ALT TEXT
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
            {t(activeTabData.titleKey)} {/* DỊCH TIÊU ĐỀ HIỂN THỊ */}
          </h2>
        </div>
      </div>
    </section>
  );
};

export default MobileHero;