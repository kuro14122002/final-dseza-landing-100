
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

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
 * Right side image tabs component for the hero section
 */
const ImageTabs: React.FC<ImageTabsProps> = ({ tabs, activeTab, setActiveTab }) => {
  const { theme } = useTheme();

  return (
    <div className="absolute right-8 top-1/2 transform -translate-y-1/2 z-10 flex flex-col space-y-3">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={cn(
            "flex items-center w-64 h-20 px-3 py-2 rounded-md transition-colors duration-300 ease-in-out",
            activeTab === tab.id
              ? theme === "dark"
                ? "bg-dseza-dark-primary-accent text-dseza-dark-main-bg"
                : "bg-dseza-light-primary-accent text-white"
              : theme === "dark"
              ? "bg-dseza-dark-secondary-bg/70 text-dseza-dark-main-text hover:bg-dseza-dark-hover-bg/90"
              : "bg-dseza-light-secondary-bg/70 text-dseza-light-main-text hover:bg-dseza-light-hover-bg/90"
          )}
        >
          <div className="w-20 h-14 overflow-hidden rounded-sm mr-3">
            <img
              src={tab.thumbnailImage}
              alt={tab.title}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-xs">{tab.title}</span>
        </button>
      ))}
    </div>
  );
};

export default ImageTabs;
