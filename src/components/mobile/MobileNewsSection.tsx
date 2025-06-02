import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";
import { useTranslation } from "@/utils/translations";
import { useLanguage } from "@/context/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MobileNewsSectionProps, NewsArticle } from "@/types/news";

/**
 * Individual news article card component
 */
const NewsCard: React.FC<NewsArticle> = ({
  imageUrl,
  publishDate,
  title,
  titleEn,
  excerpt,
  excerptEn,
  slug,
  readingTime,
  readingTimeEn
}) => {
  const { theme } = useTheme();
  const { language } = useLanguage();

  // Use translated content if available
  const displayTitle = language === 'en' && titleEn ? titleEn : title;
  const displayExcerpt = language === 'en' && excerptEn ? excerptEn : excerpt;
  const displayReadingTime = language === 'en' && readingTimeEn ? readingTimeEn : readingTime;

  // Theme-specific styles
  const cardBg = theme === "dark" ? "bg-[#2C3640]" : "bg-[#F2F2F2]";
  const mainText = theme === "dark" ? "text-white" : "text-black";
  const secondaryText = theme === "dark" ? "text-[#B0BEC5]" : "text-[#545454]";
  const shadowStyle = theme === "dark" ? "shadow-lg shadow-black/25" : "shadow-lg";
  const hoverShadow = theme === "dark" ? "hover:shadow-xl hover:shadow-black/35" : "hover:shadow-xl";

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'en' ? 'en-GB' : 'vi-VN');
  };

  return (
    <a
      href={`/news/${slug}`}
      className={cn(
        "block rounded-xl overflow-hidden",
        cardBg,
        shadowStyle,
        hoverShadow,
        "transition-transform duration-300 ease-in-out",
        "hover:scale-[1.01] active:scale-[0.99]",
        "cursor-pointer"
      )}
    >
      {/* News Article Image (16:9 aspect ratio) */}
      <div className="w-full aspect-video relative">
        <img
          src={imageUrl}
          alt={displayTitle}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Text Content Area */}
      <div className="p-3 sm:p-4">
        {/* News Date */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <Calendar className={cn("h-3.5 w-3.5", secondaryText)} />
          <p className={cn("text-xs font-inter font-normal", secondaryText)}>
            {formatDate(publishDate)}
          </p>
        </div>

        {/* News Title */}
        <h3 className={cn("font-montserrat font-semibold text-base sm:text-lg mb-2 line-clamp-2", mainText)}>
          {displayTitle}
        </h3>

        {/* News Snippet (if available) */}
        {displayExcerpt && (
          <p className={cn("font-inter font-normal text-sm line-clamp-2 mb-2", secondaryText)}>
            {displayExcerpt}
          </p>
        )}

        {/* Reading Time */}
        {displayReadingTime && (
          <p className={cn("text-xs font-inter", secondaryText)}>
            {displayReadingTime}
          </p>
        )}
      </div>
    </a>
  );
};

/**
 * Loading placeholder for news cards
 */
const NewsCardSkeleton: React.FC = () => {
  const { theme } = useTheme();
  const cardBg = theme === "dark" ? "bg-[#2C3640]" : "bg-[#F2F2F2]";

  return (
    <div className={cn("rounded-xl overflow-hidden", cardBg, "shadow-lg")}>
      <Skeleton className="w-full aspect-video" />
      <div className="p-3 sm:p-4">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Skeleton className="h-3.5 w-3.5 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4 mt-1" />
        <Skeleton className="h-3 w-16 mt-1" />
      </div>
    </div>
  );
};

/**
 * Mobile-specific news section with filtering tabs
 */
const MobileNewsSection: React.FC<MobileNewsSectionProps> = ({
  newsArticles,
  categories,
  activeCategoryId,
  onCategoryChange,
  isLoading
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { language } = useLanguage();

  // Theme-specific styles for the section container
  const sectionBg = theme === "dark" ? "bg-[#1E272F]" : "bg-white";
  const titleText = theme === "dark" ? "text-white" : "text-black";
  const buttonText = theme === "dark" ? "text-[#19DBCF]" : "text-[#416628]";
  const buttonBorder = theme === "dark" ? "border-[#19DBCF]" : "border-[#416628]";
  const buttonHoverBg = theme === "dark" ? "hover:bg-[#19DBCF]/10" : "hover:bg-[#416628]/10";

  const activeCategory = categories.find(cat => cat.id === activeCategoryId);
  const displayCategoryName = language === 'en' && activeCategory?.nameEn ? activeCategory.nameEn : activeCategory?.name;

  return (
    <section className={cn("py-6 px-4", sectionBg)}>
      <div className="container mx-auto max-w-6xl">
        {/* Section Title */}
        <h2 className={cn("font-montserrat font-bold text-2xl md:text-3xl mb-4", titleText)}>
          {t("news.title")}
        </h2>

        {/* Category Tabs using shadcn/ui Tabs component */}
        <Tabs 
          value={activeCategoryId} 
          onValueChange={onCategoryChange}
          className="w-full"
        >
          {/* Tabs List (horizontal scrollable for categories) */}
          <TabsList className={cn(
            "grid w-full grid-cols-2 md:grid-cols-5 h-auto p-1 mb-4",
            theme === "dark" ? "bg-[#2C3640]" : "bg-[#F2F2F2]"
          )}>
            {categories.map((category) => {
              const displayName = language === 'en' && category.nameEn ? category.nameEn : category.name;
              
              return (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className={cn(
                    "text-xs sm:text-sm font-inter font-medium py-2 px-2 sm:px-3 rounded-md whitespace-nowrap",
                    "transition-all duration-200",
                    "data-[state=active]:text-white",
                    theme === "dark" 
                      ? "text-[#B0BEC5] data-[state=active]:bg-[#19DBCF]" 
                      : "text-[#545454] data-[state=active]:bg-[#416628]",
                    "data-[state=inactive]:hover:bg-opacity-80"
                  )}
                  disabled={isLoading}
                >
                  {displayName}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Tab Contents */}
          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {isLoading ? (
                  // Loading skeletons
                  Array.from({ length: 4 }).map((_, index) => (
                    <NewsCardSkeleton key={index} />
                  ))
                ) : newsArticles.length > 0 ? (
                  // Display news articles
                  newsArticles.map((article) => (
                    <NewsCard key={article.id} {...article} />
                  ))
                ) : (
                  // No articles message
                  <div className="col-span-full text-center py-8">
                    <p className={cn("text-lg", theme === "dark" ? "text-[#B0BEC5]" : "text-[#545454]")}>
                      {t("news.noArticles") || "Không có bài viết nào"}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* View All Button */}
        <div className="text-center mt-6">
          <a
            href={`/news/category/${activeCategory?.slug || 'all'}`}
            className={cn(
              "inline-flex items-center px-6 py-3 border rounded-lg font-medium transition-all duration-300",
              buttonText,
              buttonBorder,
              buttonHoverBg
            )}
          >
            {t("news.viewAll") || "Xem tất cả"} {displayCategoryName && `${displayCategoryName.toLowerCase()}`}
            <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default MobileNewsSection;
