
import React, { useState, useEffect } from "react";
import SocialBar from "./SocialBar";
import ImageTabs from "./ImageTabs";
import { cn } from "@/lib/utils";

// Define tab data structure with placeholder images 
// (these should be replaced with actual high-quality images in production)
const tabsData = [
  {
    id: "tab1",
    title: "Khu công nghệ cao Đà Nẵng",
    image: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
    thumbnailImage: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "tab2",
    title: "Khu thương mại tự do Đà Nẵng",
    image: "https://images.unsplash.com/photo-1534007191209-e8216f636cde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
    thumbnailImage: "https://images.unsplash.com/photo-1534007191209-e8216f636cde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "tab3",
    title: "Khu công nghệ thông tin tập trung",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
    thumbnailImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "tab4",
    title: "Các Khu công nghiệp Đà Nẵng",
    image: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
    thumbnailImage: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
  }
];

/**
 * Hero background component with dynamic image tabs and contrast overlay
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
      
      {/* Contrast overlay gradient for better text visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent z-1"></div>
      
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
