
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
        main: "media/khucongnghecaolight.jpg",
        thumbnail: "media/khucongnghecaothumb.jpg"
      },
      dark: {
        main: "media/khucongnghecaodark.jpg",
        thumbnail: "media/khucongnghecaothumb.jpg"
      }
    }
  },
  {
    id: "tab2",
    title: "Khu thương mại tự do Đà Nẵng",
    images: {
      light: {
        main: "media/khuthuongmaitdlight.jpg",
        thumbnail: "media/khuthuongmaitdthumb.jpg"
      },
      dark: {
        main: "media/khuthuongmaitddark.jpg",
        thumbnail: "media/khuthuongmaitdthumb.jpg"
      }
    }
  },
  {
    id: "tab3",
    title: "Khu công nghệ thông tin tập trung",
    images: {
      light: {
        main: "media/khucongnghethongtinlight.jpg",
        thumbnail: "media/khucongnghethongtinthumb.jpg"
      },
      dark: {
        main: "media/khucongnghethongtindark.jpg",
        thumbnail: "media/khucongnghethongtinthumb.jpg"
      }
    }
  },
  {
    id: "tab4",
    title: "Các Khu công nghiệp Đà Nẵng",
    images: {
      light: {
        main: "media/khucongnghieplight.jpg",
        thumbnail: "media/khucongnghiepthumb.jpg"
      },
      dark: {
        main: "media/khucongnghiephdark.jpg",
        thumbnail: "media/khucongnghiepthumb.jpg"
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
