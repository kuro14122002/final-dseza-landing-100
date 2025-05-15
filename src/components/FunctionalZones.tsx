import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/utils/translations";
import { useLanguage } from "@/context/LanguageContext";

interface ZoneData {
  id: number;
  nameVi: string;
  nameEn: string;
  enterprises: number;
  occupancy: number;
  area: string;
  imageThumb: string;
  imageLarge: string;
}

/**
 * Functional Zones section displaying Da Nang's industrial and high-tech zones
 */
const FunctionalZones: React.FC = () => {
  const { theme } = useTheme();
  const [selectedZone, setSelectedZone] = useState<number>(1);
  const { t } = useTranslation();
  const { language } = useLanguage();
  
  // Theme-specific styles
  const textColor = theme === "dark" ? "text-dseza-dark-main-text" : "text-dseza-light-main-text";
  const primaryAccent = theme === "dark" ? "bg-dseza-dark-primary-accent" : "bg-dseza-light-primary-accent";
  const secondaryAccent = theme === "dark" ? "bg-dseza-dark-secondary-accent" : "bg-dseza-light-secondary-accent";
  
  // Zones data with real images
  const zonesData: ZoneData[] = [
    { 
      id: 1, 
      nameVi: "Khu công nghệ Cao Đà Nẵng", 
      nameEn: "Danang High-Tech Park",
      enterprises: 32, 
      occupancy: 42.85, 
      area: "1,128.4 ha", 
      imageThumb: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80", 
      imageLarge: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" 
    },
    { 
      id: 2, 
      nameVi: "Hòa Khánh mở rộng", 
      nameEn: "Hoa Khanh Expanded",
      enterprises: 42, 
      occupancy: 100, 
      area: "132.34 ha", 
      imageThumb: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80", 
      imageLarge: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" 
    },
    { 
      id: 3, 
      nameVi: "Khu công nghiệp Đà Nẵng", 
      nameEn: "Danang Industrial Zone",
      enterprises: 45, 
      occupancy: 100, 
      area: "50.1 ha", 
      imageThumb: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80", 
      imageLarge: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" 
    },
    { 
      id: 4, 
      nameVi: "Hòa Khánh", 
      nameEn: "Hoa Khanh",
      enterprises: 228, 
      occupancy: 100, 
      area: "394 ha", 
      imageThumb: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80", 
      imageLarge: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" 
    },
    { 
      id: 5, 
      nameVi: "Khu công nghiệp Liên Chiểu", 
      nameEn: "Lien Chieu Industrial Zone",
      enterprises: 36, 
      occupancy: 60.07, 
      area: "289.35 ha", 
      imageThumb: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80", 
      imageLarge: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" 
    },
    { 
      id: 6, 
      nameVi: "Khu công nghiệp dịch vụ Thủy sản Đà Nẵng", 
      nameEn: "Danang Seafood Service Industrial Zone",
      enterprises: 56, 
      occupancy: 100, 
      area: "50.63 ha", 
      imageThumb: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80", 
      imageLarge: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" 
    },
    { 
      id: 7, 
      nameVi: "Hòa Cầm", 
      nameEn: "Hoa Cam",
      enterprises: 81, 
      occupancy: 97.66, 
      area: "149.84 ha", 
      imageThumb: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80", 
      imageLarge: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" 
    },
    { 
      id: 8, 
      nameVi: "Khu công nghệ thông tin tập trung", 
      nameEn: "Concentrated IT Zone",
      enterprises: 5, 
      occupancy: 31.82, 
      area: "131.1 ha", 
      imageThumb: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80", 
      imageLarge: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" 
    }
  ];

  const getZoneName = (zone: ZoneData): string => {
    return language === 'vi' ? zone.nameVi : zone.nameEn;
  };

  const currentZone = zonesData.find(zone => zone.id === selectedZone) || zonesData[0];
  
  return (
    <section className={cn(
      "py-12 px-4 sm:px-6 lg:px-8",
      theme === "dark" ? "bg-[#2C363F]" : "bg-[#F2F2F2]"
    )}>
      <div className="container mx-auto">
        <h2 className={cn(
          "font-montserrat font-bold text-2xl md:text-3xl mb-8 text-left",
          textColor
        )}>
          {t('functionalZones.title')}
        </h2>
        
        {/* Large interactive display panel */}
        <div 
          className="relative h-80 sm:h-96 md:h-[400px] rounded-2xl overflow-hidden mb-8" 
          style={{
            backgroundImage: `url(${currentZone.imageLarge})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
          
          {/* Bottom left - Zone name and enterprise info */}
          <div className="absolute bottom-6 left-6">
            <h3 className="font-montserrat font-bold text-2xl md:text-3xl text-white mb-2">
              {getZoneName(currentZone)}
            </h3>
            <div className="flex items-center text-white">
              <Building2 className="w-5 h-5 mr-2" />
              <span className="font-inter text-lg">{currentZone.enterprises} {t('functionalZones.enterprises')}</span>
            </div>
          </div>
          
          {/* Bottom right - Occupancy and area info */}
          <div className="absolute bottom-6 right-6 text-right">
            <p className="text-white font-inter mb-1">{t('functionalZones.occupancyRate')}: {currentZone.occupancy}%</p>
            <div className="h-2 w-32 sm:w-48 bg-white/30 rounded-full mb-2">
              <div 
                className={`h-full rounded-full ${primaryAccent}`}
                style={{ width: `${currentZone.occupancy}%` }}
              ></div>
            </div>
            <p className="text-white font-inter">{t('functionalZones.area')}: {currentZone.area}</p>
          </div>
        </div>
        
        {/* Grid of zone thumbnails */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {zonesData.map(zone => (
            <div 
              key={zone.id}
              className={cn(
                "relative h-48 rounded-lg overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105",
                zone.id === selectedZone ? "ring-2 ring-offset-2" : "",
                theme === "dark" ? "ring-dseza-dark-primary-accent" : "ring-dseza-light-primary-accent"
              )}
              onClick={() => setSelectedZone(zone.id)}
              style={{
                backgroundImage: `url(${zone.imageThumb})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute bottom-0 left-0 right-0">
                <div className={cn(
                  "px-3 py-2 font-montserrat font-medium text-white text-xs",
                  zone.id === selectedZone ? primaryAccent : secondaryAccent
                )}>
                  {getZoneName(zone)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FunctionalZones;
