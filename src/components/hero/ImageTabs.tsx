
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface TabData {
  id: string;
  title: string;
  image: string;
  thumbnailImage: string;
}

interface ImageTabsProps {
  tabs: TabData[];
  activeTab: string;
  setActiveTab: (id: string) => void;
}

/**
 * Image-only thumbnails component for the hero section
 */
const ImageTabs: React.FC<ImageTabsProps> = ({ tabs, activeTab, setActiveTab }) => {
  const { theme } = useTheme();
  
  // Theme-specific styles for borders
  const activeBorder = theme === "dark" ? "border-dseza-dark-primary-accent" : "border-dseza-light-primary-accent";
  const hoverBorder = theme === "dark" ? "hover:border-dseza-dark-secondary-accent" : "hover:border-dseza-light-secondary-accent";
  const defaultBorder = theme === "dark" ? "border-dseza-dark-border" : "border-dseza-light-border";
  
  return (
    <div className="absolute right-8 top-1/2 transform -translate-y-1/2 z-10 flex flex-col space-y-3">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={cn(
            "overflow-hidden rounded-md transition-all duration-300 ease-in-out transform",
            "w-36 border",
            tab.id === activeTab 
              ? `border-2 ${activeBorder}` 
              : `border-1 ${defaultBorder} ${hoverBorder} hover:scale-105`
          )}
        >
          <AspectRatio ratio={16/9}>
            <img
              src={tab.thumbnailImage}
              alt={tab.title}
              className="w-full h-full object-cover"
            />
          </AspectRatio>
        </button>
      ))}
    </div>
  );
};

export default ImageTabs;
