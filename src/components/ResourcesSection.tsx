
import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { Image } from "lucide-react";
import { Video } from "lucide-react";
import { File } from "lucide-react";
import { Button } from "./ui/button";
import { AspectRatio } from "./ui/aspect-ratio";

/**
 * Resources section with tabbed interface for Images, Videos, and Documents
 */
const ResourcesSection: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'images' | 'videos' | 'documents'>('images');
  
  // Theme-specific styles
  const textColor = theme === "dark" ? "text-dseza-dark-main-text" : "text-dseza-light-main-text";
  const secondaryTextColor = theme === "dark" ? "text-dseza-dark-secondary-text" : "text-dseza-light-secondary-text";
  const accentColor = theme === "dark" ? "text-dseza-dark-primary-accent" : "text-dseza-light-primary-accent";
  const accentBgColor = theme === "dark" ? "bg-dseza-dark-primary-accent" : "bg-dseza-light-primary-accent";
  const secondaryBgColor = theme === "dark" ? "bg-dseza-dark-secondary-bg" : "bg-dseza-light-secondary-bg";
  const buttonHoverBgColor = theme === "dark" ? "hover:bg-dseza-dark-primary-accent" : "hover:bg-dseza-light-primary-accent";
  const buttonHoverTextColor = theme === "dark" ? "hover:text-dseza-dark-main-bg" : "hover:text-white";
  
  // Placeholder image resources
  const imageResources = [
    {
      id: 1,
      title: "Khu công nghệ cao Đà Nẵng",
      date: "15/05/2023",
      imageUrl: "https://via.placeholder.com/400x300/444444/FFFFFF?text=Khu+công+nghệ+cao+Đà+Nẵng"
    },
    {
      id: 2,
      title: "Lễ khởi công dự án mới",
      date: "08/07/2023",
      imageUrl: "https://via.placeholder.com/400x300/444444/FFFFFF?text=Lễ+khởi+công+dự+án+mới"
    },
    {
      id: 3,
      title: "Hội thảo phát triển công nghệ cao",
      date: "21/04/2023",
      imageUrl: "https://via.placeholder.com/400x300/444444/FFFFFF?text=Hội+thảo+phát+triển"
    },
    {
      id: 4,
      title: "Khánh thành nhà máy sản xuất",
      date: "03/03/2023",
      imageUrl: "https://via.placeholder.com/400x300/444444/FFFFFF?text=Khánh+thành+nhà+máy"
    }
  ];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <h2 className={cn(
          "font-montserrat font-bold text-3xl md:text-4xl mb-8",
          textColor
        )}>
          Tư liệu
        </h2>
        
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            className={cn(
              "flex items-center px-4 py-2 rounded-md font-inter font-semibold text-base transition-all",
              activeTab === 'images' 
                ? `${accentBgColor} text-white` 
                : `${secondaryBgColor} ${secondaryTextColor} hover:${accentColor}`
            )}
            onClick={() => setActiveTab('images')}
          >
            <Image className="w-5 h-5 mr-2" />
            Hình ảnh
          </button>
          
          <button
            className={cn(
              "flex items-center px-4 py-2 rounded-md font-inter font-semibold text-base transition-all",
              activeTab === 'videos' 
                ? `${accentBgColor} text-white` 
                : `${secondaryBgColor} ${secondaryTextColor} hover:${accentColor}`
            )}
            onClick={() => setActiveTab('videos')}
          >
            <Video className="w-5 h-5 mr-2" />
            Video
          </button>
          
          <button
            className={cn(
              "flex items-center px-4 py-2 rounded-md font-inter font-semibold text-base transition-all",
              activeTab === 'documents' 
                ? `${accentBgColor} text-white` 
                : `${secondaryBgColor} ${secondaryTextColor} hover:${accentColor}`
            )}
            onClick={() => setActiveTab('documents')}
          >
            <File className="w-5 h-5 mr-2" />
            Tài liệu
          </button>
        </div>
        
        {/* Content Area based on active tab */}
        <div className="mb-8">
          {activeTab === 'images' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {imageResources.map(resource => (
                <a 
                  key={resource.id}
                  href="#"
                  className="block group rounded-lg overflow-hidden hover:shadow-lg transition-all"
                >
                  <div className="aspect-w-4 aspect-h-3 w-full">
                    <AspectRatio ratio={4/3} className="bg-gray-200">
                      <img 
                        src={resource.imageUrl} 
                        alt={resource.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </AspectRatio>
                  </div>
                  <div className="p-4 bg-white dark:bg-gray-800">
                    <h3 className={cn("font-inter font-semibold text-lg mb-1", textColor)}>
                      {resource.title}
                    </h3>
                    <p className={cn("font-inter text-sm", secondaryTextColor)}>
                      Ngày đăng: {resource.date}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          )}
          
          {activeTab === 'videos' && (
            <div className={cn("p-12 text-center rounded-lg", secondaryBgColor)}>
              <h3 className={cn("text-xl font-semibold mb-2", textColor)}>
                Đang phát triển
              </h3>
              <p className={cn("text-base", secondaryTextColor)}>
                Coming soon: Videos related to DSEZA's activities and zones.
              </p>
            </div>
          )}
          
          {activeTab === 'documents' && (
            <div className={cn("p-12 text-center rounded-lg", secondaryBgColor)}>
              <h3 className={cn("text-xl font-semibold mb-2", textColor)}>
                Đang phát triển
              </h3>
              <p className={cn("text-base", secondaryTextColor)}>
                Coming soon: Downloadable documents, reports, and legal frameworks.
              </p>
            </div>
          )}
        </div>
        
        {/* View All Resources button */}
        <div className="text-center">
          <Button 
            variant="outline"
            className={cn(
              "font-inter font-semibold text-base border border-gray-300 dark:border-gray-600",
              buttonHoverBgColor,
              buttonHoverTextColor
            )}
          >
            Xem tất cả tư liệu
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ResourcesSection;
