// src/components/mobile/MobileFunctionalZonesCarousel.tsx
import React, { useState, useRef, useEffect } from "react";
import { Building2 } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/utils/translations";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface ZoneData {
  id: number;
  nameVi: string;
  nameEn: string;
  enterprises: number;
  occupancy: number;
  area: string;
  imageThumb: string;
}

const MobileFunctionalZonesCarousel: React.FC = () => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [autoPlay, setAutoPlay] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Zone data
  const zonesData: ZoneData[] = [
    {
      id: 1,
      nameVi: "Khu công nghệ Cao ‎ ‎ Đà Nẵng",
      nameEn: "Danang High-Tech Park",
      enterprises: 32,
      occupancy: 42.85,
      area: "1.128,4 ha",
      imageThumb: "/media/FunctionalZones/KCNC1.jpg"
    },
    {
      id: 2,
      nameVi: "Hòa Khánh mở rộng",
      nameEn: "Hoa Khanh Expanded",
      enterprises: 42,
      occupancy: 100,
      area: "132,34 ha",
      imageThumb: "/media/FunctionalZones/HKMR.jpg"
    },
    {
      id: 3,
      nameVi: "Khu công nghiệp ‎ ‎ ‎ ‎ ‎  ‎  Đà Nẵng",
      nameEn: "Danang Industrial Zone",
      enterprises: 45,
      occupancy: 100,
      area: "50,1 ha",
      imageThumb: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
    },
    {
      id: 4,
      nameVi: "Hòa Khánh",
      nameEn: "Hoa Khanh",
      enterprises: 228,
      occupancy: 100,
      area: "394 ha",
      imageThumb: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
    },
    {
      id: 5,
      nameVi: "Khu công nghiệp ‎ ‎ ‎ ‎ ‎  Liên Chiểu",
      nameEn: "Lien Chieu Industrial Zone",
      enterprises: 36,
      occupancy: 60.07,
      area: "289,35 ha",
      imageThumb: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
    },
    {
      id: 6,
      nameVi: "KCN dịch vụ Thủy sản Đà Nẵng",
      nameEn: "Danang Seafood Service Industrial Zone",
      enterprises: 56,
      occupancy: 100,
      area: "50,63 ha",
      imageThumb: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
    },
    {
      id: 7,
      nameVi: "Hòa Cầm",
      nameEn: "Hoa Cam",
      enterprises: 81,
      occupancy: 97.66,
      area: "149,84 ha",
      imageThumb: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
    },
    {
      id: 8,
      nameVi: "Khu công nghệ thông tin tập trung",
      nameEn: "Concentrated IT Zone",
      enterprises: 5,
      occupancy: 31.82,
      area: "131,1 ha",
      imageThumb: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
    }
  ];

  const getZoneName = (zone: ZoneData): string => {
    return language === 'vi' ? zone.nameVi : zone.nameEn;
  };

  // Background and text colors based on theme
  const backgroundClass = theme === "dark" ? "bg-[#2C3640]" : "bg-[#F2F2F2]";
  const textClass = theme === "dark" ? "text-white" : "text-black";
  const secondaryTextClass = theme === "dark" ? "text-[#B0BEC5]" : "text-[#545454]";
  const fillBarTrackClass = theme === "dark" ? "bg-[#455A64]" : "bg-[#DCDCDC]";
  const fillBarActiveClass = theme === "dark" ? "bg-[#19DBCF]" : "bg-[#416628]";

  // Touch interactions
  const handleItemTouch = () => {
    setAutoPlay(false);
    // Resume auto-play after 5 seconds of inactivity
    setTimeout(() => setAutoPlay(true), 5000);
  };

  // Ước lượng chiều cao của một dòng chữ text-base và text-xs
  // Giả sử text-base có line-height khoảng 1.5 * 16px = 24px
  // Giả sử text-xs có line-height khoảng 1.5 * 12px = 18px
  const titleLineHeight = 1.5 * 1; // 1em for text-base line-height
  const infoLineHeight = 1.5 * 0.75; // 0.75em for text-xs line-height (approx)

  return (
    <section className={cn("py-8 overflow-x-hidden", backgroundClass)}>
      {/* Section title */}
      <h2 className={cn(
        "font-montserrat font-bold text-2xl mb-6 mx-4 text-center",
        textClass
      )}>
        {t('homepage.functionalZonesMobile')}
      </h2>

      {/* Carousel */}
      <Carousel
        opts={{
          align: "start",
          loop: true,
          skipSnaps: false,
        }}
        className="w-full"
        ref={carouselRef}
      >
        <CarouselContent className="px-4">
          {zonesData.map((zone) => (
            <CarouselItem key={zone.id} className="basis-[220px] pl-2 pr-2" onTouchStart={handleItemTouch}>
              <div className="h-full flex flex-col transition-all duration-300 ease-in-out hover:scale-[1.03] active:scale-[0.98]">
                {/* Image card */}
                <div className="rounded-lg overflow-hidden shadow-md">
                  <div className="aspect-[4/3] relative">
                    <img
                      src={zone.imageThumb}
                      alt={getZoneName(zone)}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Info block */}
                <div className={cn(
                  "pt-3 px-1 pb-1 text-left flex-grow flex flex-col justify-between",
                   // Giữ chiều cao cố định cho toàn bộ info block nếu cần,
                   // nhưng chúng ta sẽ cố gắng làm đều bằng chiều cao từng phần tử con
                )}>
                  {/* Phần trên của info block (Tên khu và số doanh nghiệp) */}
                  <div className="flex-grow">
                    <h3 className={cn(
                      "font-montserrat font-semibold text-base mb-1.5 line-clamp-2",
                      "min-h-[calc(2*1.5em)]", // Chiều cao tối thiểu cho 2 dòng của text-base
                      textClass
                    )}>
                      {getZoneName(zone)}
                    </h3>
                    <div className={cn(
                      "flex items-center text-xs mb-1",
                      "min-h-[calc(1*1.5em)]", // Chiều cao tối thiểu cho 1 dòng của text-xs
                      secondaryTextClass
                    )}>
                      <Building2 className="w-4 h-4 mr-1.5 flex-shrink-0" />
                      <span>{zone.enterprises} {t('functionalZones.enterprises')}</span>
                    </div>
                  </div>

                  {/* Phần dưới của info block (Tỷ lệ và diện tích) */}
                  <div>
                    <div className={cn(
                      "text-xs mb-0.5",
                      "min-h-[calc(1*1.5em)]", // Chiều cao tối thiểu cho 1 dòng của text-xs
                      secondaryTextClass
                    )}>
                      {t('functionalZones.occupancyRate')}: {zone.occupancy}%
                    </div>
                    <div className={cn("h-2 w-full rounded-full mb-1", fillBarTrackClass)}>
                      <div
                        className={cn("h-full rounded-full", fillBarActiveClass)}
                        style={{ width: `${zone.occupancy}%` }}
                      ></div>
                    </div>
                    <div className={cn(
                      "text-xs",
                      "min-h-[calc(1*1.5em)]", // Chiều cao tối thiểu cho 1 dòng của text-xs
                      secondaryTextClass
                    )}>
                      {t('functionalZones.area')}: {zone.area}
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
};

export default MobileFunctionalZonesCarousel;