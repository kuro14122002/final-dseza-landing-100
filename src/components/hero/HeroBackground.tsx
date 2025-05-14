
import React, { useState, useEffect } from "react";
import SocialBar from "./SocialBar";
import ImageTabs from "./ImageTabs";
import { cn } from "@/lib/utils";

// Define tab data structure
const tabsData = [
  {
    id: "tab1",
    title: "Khu công nghệ cao Đà Nẵng",
    image: "https://via.placeholder.com/1920x1080/4A90E2/FFFFFF?text=Khu+Cong+Nghe+Cao+Da+Nang",
    thumbnailImage: "https://via.placeholder.com/80x60/4A90E2/FFFFFF?text=KCNC"
  },
  {
    id: "tab2",
    title: "Khu thương mại tự do Đà Nẵng",
    image: "https://via.placeholder.com/1920x1080/50E3C2/FFFFFF?text=Khu+Thuong+Mai+Tu+Do",
    thumbnailImage: "https://via.placeholder.com/80x60/50E3C2/FFFFFF?text=KTMTD"
  },
  {
    id: "tab3",
    title: "Khu công nghệ thông tin tập trung",
    image: "https://via.placeholder.com/1920x1080/B8E986/FFFFFF?text=Khu+CNTT+Tap+Trung",
    thumbnailImage: "https://via.placeholder.com/80x60/B8E986/FFFFFF?text=CNTT"
  },
  {
    id: "tab4",
    title: "Các Khu công nghiệp Đà Nẵng",
    image: "https://via.placeholder.com/1920x1080/F8E71C/000000?text=Cac+Khu+Cong+Nghiep",
    thumbnailImage: "https://via.placeholder.com/80x60/F8E71C/000000?text=KCN"
  }
];

/**
 * Hero background component with dynamic image tabs
 */
const HeroBackground: React.FC = () => {
  const [activeTab, setActiveTab] = useState(tabsData[0].id);
  const [activeImage, setActiveImage] = useState(tabsData[0].image);
  const [prevImage, setPrevImage] = useState("");
  const [transitioning, setTransitioning] = useState(false);

  // Handle image transition when tab changes
  useEffect(() => {
    const newImage = tabsData.find(tab => tab.id === activeTab)?.image || tabsData[0].image;
    
    if (newImage !== activeImage) {
      setPrevImage(activeImage);
      setTransitioning(true);
      setActiveImage(newImage);
      
      const timer = setTimeout(() => {
        setTransitioning(false);
      }, 500); // Match transition duration
      
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  const activeTitle = tabsData.find(tab => tab.id === activeTab)?.title || "";

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Transition Background Images */}
      {transitioning && (
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
      
      {/* Overlay gradient for better text visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-0"></div>
      
      {/* Social Bar */}
      <SocialBar />
      
      {/* Image Tabs */}
      <ImageTabs 
        tabs={tabsData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      
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
