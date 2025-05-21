// src/components/ResourcesSection.tsx
import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { Image as ImageIcon, Video as VideoIcon, File as FileIcon } from "lucide-react"; // Renamed to avoid conflict
import { Button } from "./ui/button";
import { AspectRatio } from "./ui/aspect-ratio";
import { useTranslation } from "@/utils/translations";

/**
 * Resources section with tabbed interface for Images, Videos, and Documents
 */
const ResourcesSection: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'images' | 'videos' | 'documents'>('images');

  // Theme-specific styles
  const textColor = theme === "dark" ? "text-dseza-dark-main-text" : "text-dseza-light-main-text";
  const secondaryTextColor = theme === "dark" ? "text-dseza-dark-secondary-text" : "text-dseza-light-secondary-text";
  const accentColor = theme === "dark" ? "text-dseza-dark-primary-accent" : "text-dseza-light-primary-accent";
  const accentBgColor = theme === "dark" ? "bg-dseza-dark-primary-accent" : "bg-dseza-light-primary-accent";
  const tabDefaultBg = theme === "dark" ? "bg-dseza-dark-secondary-bg" : "bg-dseza-light-secondary-bg"; // Renamed for clarity
  const panelContentBg = theme === "dark" ? "bg-dseza-dark-secondary-bg" : "bg-dseza-light-secondary-bg"; // For placeholder content

  // Hover styles for tabs
  const tabInactiveHoverBg = theme === "dark" ? "hover:bg-dseza-dark-hover-bg/70" : "hover:bg-dseza-light-hover-bg/70";
  const tabInactiveHoverTextColor = `hover:${accentColor}`;
  const tabActiveHover = "hover:scale-103 hover:shadow-md";

  // Hover styles for "View All" button
  const viewAllButtonHoverBg = theme === "dark" ? "hover:bg-dseza-dark-primary-accent/10" : "hover:bg-dseza-light-primary-accent/10";
  const viewAllButtonHoverText = `hover:${accentColor}`;
  const viewAllButtonBaseBorder = theme === "dark" ? "border-dseza-dark-border" : "border-dseza-light-border";


  // Real image resources
  const imageResources = [
    {
      id: 1,
      title: "Khu công nghệ cao Đà Nẵng",
      date: "15/05/2023",
      imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 2,
      title: "Lễ khởi công dự án mới",
      date: "08/07/2023",
      imageUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 3,
      title: "Hội thảo phát triển công nghệ cao",
      date: "21/04/2023",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 4,
      title: "Khánh thành nhà máy sản xuất",
      date: "03/03/2023",
      imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
    }
  ];

  const renderTabButton = (tabName: 'images' | 'videos' | 'documents', IconComponent: React.ElementType, labelKey: string) => (
    <button
      className={cn(
        "flex items-center px-4 py-2 rounded-md font-inter font-semibold text-base transition-all duration-300 ease-in-out",
        activeTab === tabName
          ? `${accentBgColor} text-white ${tabActiveHover}`
          : `${tabDefaultBg} ${secondaryTextColor} ${tabInactiveHoverBg} ${tabInactiveHoverTextColor}`
      )}
      onClick={() => setActiveTab(tabName)}
    >
      <IconComponent className="w-5 h-5 mr-2" />
      {t(labelKey)}
    </button>
  );

  return (
    <section className={cn(
      "py-12 px-4 sm:px-6 lg:px-8",
      theme === "dark" ? "bg-[#1D262E]" : "bg-[#FFFFFF]"
    )}>
      <div className="container mx-auto">
        <h2 className={cn(
          "font-montserrat font-bold text-3xl md:text-4xl mb-8",
          textColor,
          "text-center lg:text-left" 
        )}>
          {t('resourcesSection.sectionTitle')}
        </h2>
        
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {renderTabButton('images', ImageIcon, 'resourcesSection.tabImages')}
          {renderTabButton('videos', VideoIcon, 'resourcesSection.tabVideos')}
          {renderTabButton('documents', FileIcon, 'resourcesSection.tabDocuments')}
        </div>
        
        {/* Content Area based on active tab */}
        <div className="mb-8 min-h-[300px]"> {/* Added min-h to prevent layout shift */}
          {activeTab === 'images' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"> {/* Adjusted grid for better spacing */}
              {imageResources.map(resource => (
                <a
                  key={resource.id}
                  href="#" // Replace with actual link to resource detail or lightbox
                  className="block group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ease-in-out"
                >
                  <div className="overflow-hidden"> {/* Added overflow-hidden for image scale */}
                    <AspectRatio ratio={4/3} className="bg-gray-200 dark:bg-gray-700">
                      <img
                        src={resource.imageUrl}
                        alt={resource.title}
                        className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
                      />
                    </AspectRatio>
                  </div>
                  <div className={cn(
                    "p-4",
                    theme === "dark" ? "bg-dseza-dark-secondary-bg" : "bg-white"
                  )}>
                    <h3 className={cn(
                      "font-inter font-semibold text-lg mb-1 transition-colors duration-300", 
                      textColor,
                      `group-hover:${accentColor}` // Title color change on hover
                    )}>
                      {resource.title}
                    </h3>
                    <p className={cn(
                      "font-inter text-sm transition-colors duration-300", 
                      secondaryTextColor,
                      `group-hover:${accentColor}` // Date color change on hover
                    )}>
                      {t('resourcesSection.dateLabel')}: {resource.date}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          )}
          
          {activeTab === 'videos' && (
            <div className={cn("p-12 text-center rounded-lg", panelContentBg)}>
              <VideoIcon className={cn("w-16 h-16 mx-auto mb-4", secondaryTextColor)} />
              <h3 className={cn("text-xl font-semibold mb-2", textColor)}>
                {t('resourcesSection.comingSoonTitle')}
              </h3>
              <p className={cn("text-base", secondaryTextColor)}>
                {t('resourcesSection.comingSoonVideos')}
              </p>
            </div>
          )}
          
          {activeTab === 'documents' && (
            <div className={cn("p-12 text-center rounded-lg", panelContentBg)}>
              <FileIcon className={cn("w-16 h-16 mx-auto mb-4", secondaryTextColor)} />
              <h3 className={cn("text-xl font-semibold mb-2", textColor)}>
                {t('resourcesSection.comingSoonTitle')}
              </h3>
              <p className={cn("text-base", secondaryTextColor)}>
                {t('resourcesSection.comingSoonDocuments')}
              </p>
            </div>
          )}
        </div>
        
        {/* View All Resources button */}
        <div className="text-center">
          <Button
            variant="outline"
            className={cn(
              "font-inter font-semibold text-base",
              viewAllButtonBaseBorder, // Base border color
              textColor, // Base text color
              viewAllButtonHoverBg, // Hover background
              viewAllButtonHoverText, // Hover text color
              "hover:scale-105 hover:shadow-md transition-all duration-300 ease-in-out" // Scale and shadow
            )}
          >
            {t('resourcesSection.viewAll')}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ResourcesSection;