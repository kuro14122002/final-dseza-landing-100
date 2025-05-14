
import React, { useState, useEffect } from "react";
import SocialBar from "./SocialBar";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";
import { AspectRatio } from "@/components/ui/aspect-ratio";

// Define theme-aware tab data structure with both light and dark mode images
const tabsData = [
  {
    id: "tab1",
    title: "Khu công nghệ cao Đà Nẵng",
    images: {
      light: {
        main: "https://via.placeholder.com/1920x1080/ADD8E6/000000?text=KCNC+Light+Main",
        thumbnail: "https://via.placeholder.com/320x180/E0F2FE/0EA5E9?text=KCNC+Light+16:9"
      },
      dark: {
        main: "https://via.placeholder.com/1920x1080/082F49/93C5FD?text=KCNC+Dark+Main",
        thumbnail: "https://via.placeholder.com/320x180/082F49/93C5FD?text=KCNC+Dark+16:9"
      }
    }
  },
  {
    id: "tab2",
    title: "Khu thương mại tự do Đà Nẵng",
    images: {
      light: {
        main: "https://via.placeholder.com/1920x1080/D1FAE5/000000?text=KTTTD+Light+Main",
        thumbnail: "https://via.placeholder.com/320x180/D1FAE5/10B981?text=KTTTD+Light+16:9"
      },
      dark: {
        main: "https://via.placeholder.com/1920x1080/064E3B/A7F3D0?text=KTTTD+Dark+Main",
        thumbnail: "https://via.placeholder.com/320x180/064E3B/A7F3D0?text=KTTTD+Dark+16:9"
      }
    }
  },
  {
    id: "tab3",
    title: "Khu công nghệ thông tin tập trung",
    images: {
      light: {
        main: "https://via.placeholder.com/1920x1080/FEF3C7/000000?text=KCNTT+Light+Main",
        thumbnail: "https://via.placeholder.com/320x180/FEF3C7/F59E0B?text=KCNTT+Light+16:9"
      },
      dark: {
        main: "https://via.placeholder.com/1920x1080/78350F/FDE68A?text=KCNTT+Dark+Main",
        thumbnail: "https://via.placeholder.com/320x180/78350F/FDE68A?text=KCNTT+Dark+16:9"
      }
    }
  },
  {
    id: "tab4",
    title: "Các Khu công nghiệp Đà Nẵng",
    images: {
      light: {
        main: "https://via.placeholder.com/1920x1080/FEE2E2/000000?text=KCN+Light+Main",
        thumbnail: "https://via.placeholder.com/320x180/FEE2E2/EF4444?text=KCN+Light+16:9"
      },
      dark: {
        main: "https://via.placeholder.com/1920x1080/7F1D1D/FECACA?text=KCN+Dark+Main",
        thumbnail: "https://via.placeholder.com/320x180/7F1D1D/FECACA?text=KCN+Dark+16:9"
      }
    }
  }
];

/**
 * Hero background component with dynamic image tabs and contrast overlay
 * Supports theme-aware images (different sets for dark and light modes)
 */
const HeroBackground: React.FC = () => {
  const [activeTab, setActiveTab] = useState(tabsData[0].id);
  const [activeImage, setActiveImage] = useState("");
  const [prevImage, setPrevImage] = useState("");
  const [transitioning, setTransitioning] = useState(false);
  const { theme } = useTheme();
  
  // Set initial image based on theme when component mounts
  useEffect(() => {
    const currentTheme = theme === "dark" ? "dark" : "light";
    const initialTab = tabsData[0];
    setActiveImage(initialTab.images[currentTheme].main);
  }, []);

  // Handle image transition when tab or theme changes
  useEffect(() => {
    const currentTheme = theme === "dark" ? "dark" : "light";
    const newImage = tabsData.find(tab => tab.id === activeTab)?.images[currentTheme].main || "";
    
    if (newImage !== activeImage && newImage) {
      setPrevImage(activeImage);
      setTransitioning(true);
      setActiveImage(newImage);
      
      const timer = setTimeout(() => {
        setTransitioning(false);
      }, 500); // Match transition duration
      
      return () => clearTimeout(timer);
    }
  }, [activeTab, theme]);

  const activeTitle = tabsData.find(tab => tab.id === activeTab)?.title || "";
  const currentTheme = theme === "dark" ? "dark" : "light";

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Transition Background Images */}
      {transitioning && prevImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 opacity-0 animate-fade-out"
          style={{ backgroundImage: `url(${prevImage})` }}
        />
      )}
      <div 
        className={cn(
          "absolute inset-0 bg-cover bg-center bg-no-repeat z-0",
          transitioning ? "animate-fade-in" : ""
        )}
        style={{ backgroundImage: `url(${activeImage})` }}
      />
      
      {/* Contrast overlay gradient for better text visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent z-1"></div>
      
      {/* Social Bar */}
      <SocialBar />
      
      {/* Image Thumbnails - Vertically centered on right side */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-3">
        {tabsData.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "w-36 transition-all duration-300 ease-in-out hover:scale-105 overflow-hidden rounded-md",
              tab.id === activeTab 
                ? theme === "dark" 
                  ? "border-2 border-dseza-dark-primary-accent" 
                  : "border-2 border-dseza-light-primary-accent"
                : "border-2 border-transparent"
            )}
          >
            <AspectRatio ratio={16/9}>
              <img 
                src={tab.images[currentTheme].thumbnail} 
                alt={tab.title}
                className="object-cover w-full h-full"
              />
            </AspectRatio>
          </button>
        ))}
      </div>
      
      {/* Dynamic Title Overlay */}
      <div className="absolute bottom-16 left-16 z-10">
        <h1 className="text-6xl font-bold text-white text-shadow-lg transition-opacity duration-500">
          {activeTitle}
        </h1>
      </div>
    </div>
  );
};

export default HeroBackground;
