import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";
import { useTranslation } from "@/utils/translations";
import { useLanguage } from "@/context/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MobileNewsSectionProps, NewsArticle } from "@/types/news";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, ExternalLink } from "lucide-react";

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
 * Mobile News Card Component
 */
const MobileNewsCard: React.FC<{ article: any }> = ({ article }) => {
  const { theme } = useTheme();
  const { language } = useLanguage();

  // Theme-specific styles
  const cardBg = theme === "dark" ? "bg-dseza-dark-secondary-bg" : "bg-dseza-light-secondary-bg";
  const textColor = theme === "dark" ? "text-dseza-dark-main-text" : "text-dseza-light-main-text";
  const secondaryTextColor = theme === "dark" ? "text-dseza-dark-secondary-text" : "text-dseza-light-secondary-text";
  const titleHoverColor = theme === "dark" ? "hover:text-dseza-dark-primary-accent" : "hover:text-dseza-light-primary-accent";

  // Use translated content if available
  const displayTitle = language === 'en' && article.titleEn ? article.titleEn : article.title;
  const displayExcerpt = language === 'en' && article.excerptEn ? article.excerptEn : article.excerpt;

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(language === 'en' ? 'en-GB' : 'vi-VN');
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  return (
    <a
      href={`/news/${article.slug}`}
      className={cn(
        "block rounded-xl overflow-hidden transition-all duration-300 hover:transform hover:-translate-y-1",
        cardBg,
        theme === "dark" ? "hover:shadow-[0_4px_12px_rgba(0,0,0,0.3)]" : "hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
      )}
    >
      <div className="aspect-[16/9] overflow-hidden">
        <img
          src={article.imageUrl}
          alt={displayTitle}
          className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
          loading="lazy"
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
      </div>
      <div className="p-4">
        <p className={cn("text-xs mb-2", secondaryTextColor)}>{formatDate(article.publishDate)}</p>
        <h3 className={cn(
          "font-montserrat font-semibold mb-2 line-clamp-2 transition-colors duration-300 text-sm",
          textColor,
          titleHoverColor
        )}>
          {displayTitle}
        </h3>
        <p className={cn("text-xs line-clamp-2 mb-2", secondaryTextColor)}>
          {displayExcerpt}
        </p>
        {article.readingTime && (
          <p className={cn("text-xs", secondaryTextColor)}>
            {language === 'en' && article.readingTimeEn ? article.readingTimeEn : article.readingTime}
          </p>
        )}
      </div>
    </a>
  );
};

/**
 * Mobile News Card Skeleton
 */
const MobileNewsCardSkeleton: React.FC = () => {
  const { theme } = useTheme();
  const cardBg = theme === "dark" ? "bg-dseza-dark-secondary-bg" : "bg-dseza-light-secondary-bg";

  return (
    <div className={cn("rounded-xl overflow-hidden", cardBg)}>
      <Skeleton className="aspect-[16/9] w-full" />
      <div className="p-4">
        <Skeleton className="h-3 w-24 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3 mt-1" />
        <Skeleton className="h-3 w-16 mt-2" />
      </div>
    </div>
  );
};

/**
 * Mobile Error State Component
 */
const MobileNewsErrorState: React.FC<{ 
  error?: string; 
  onRetry?: () => void; 
  showRetry?: boolean;
}> = ({ 
  error = "Không thể tải tin tức. Vui lòng thử lại sau.", 
  onRetry, 
  showRetry = true 
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const textColor = theme === "dark" ? "text-dseza-dark-main-text" : "text-dseza-light-main-text";

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4">
      <Alert className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className={textColor}>
          {error}
        </AlertDescription>
      </Alert>
      {showRetry && onRetry && (
        <Button
          variant="outline"
          onClick={onRetry}
          className="flex items-center gap-2"
          size="sm"
        >
          <RefreshCw className="h-3 w-3" />
          {t('common.retry')}
        </Button>
      )}
    </div>
  );
};

/**
 * Mobile Empty State Component
 */
const MobileNewsEmptyState: React.FC<{ message?: string }> = ({ 
  message = "Hiện tại chưa có tin tức nào." 
}) => {
  const { theme } = useTheme();
  const textColor = theme === "dark" ? "text-dseza-dark-main-text" : "text-dseza-light-main-text";
  const secondaryTextColor = theme === "dark" ? "text-dseza-dark-secondary-text" : "text-dseza-light-secondary-text";

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
      <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mb-3", 
        theme === "dark" ? "bg-dseza-dark-secondary-bg" : "bg-dseza-light-secondary-bg")}>
        <ExternalLink className={cn("w-6 h-6", secondaryTextColor)} />
      </div>
      <h3 className={cn("text-base font-semibold mb-1", textColor)}>
        Chưa có tin tức
      </h3>
      <p className={cn("text-sm", secondaryTextColor)}>
        {message}
      </p>
    </div>
  );
};

/**
 * Mobile News Section Component
 */
const MobileNewsSection: React.FC<MobileNewsSectionProps & { 
  error?: string; 
  onRetry?: () => void;
}> = ({
  newsArticles,
  categories,
  activeCategoryId,
  onCategoryChange,
  isLoading,
  error,
  onRetry
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { language } = useLanguage();

  // Theme-specific styles
  const textColor = theme === "dark" ? "text-dseza-dark-main-text" : "text-dseza-light-main-text";
  const secondaryTextColor = theme === "dark" ? "text-dseza-dark-secondary-text" : "text-dseza-light-secondary-text";
  const buttonColor = theme === "dark" ? "text-dseza-dark-primary-accent border-dseza-dark-primary-accent hover:bg-dseza-dark-primary-accent/10" : "text-dseza-light-primary-accent border-dseza-light-primary-accent hover:bg-dseza-light-primary-accent/10";
  const activeBg = theme === "dark" ? "bg-dseza-dark-primary-accent text-white" : "bg-dseza-light-primary-accent text-white";

  // Handle error state
  if (error && !isLoading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className={cn("text-xl font-bold font-montserrat mb-2", textColor)}>
              {t('news.title')}
            </h2>
            <p className={cn("text-sm", secondaryTextColor)}>
              {t('news.subtitle')}
            </p>
          </div>
          <MobileNewsErrorState error={error} onRetry={onRetry} />
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-6">
          <h2 className={cn("text-xl font-bold font-montserrat mb-2", textColor)}>
            {t('news.title')}
          </h2>
          <p className={cn("text-sm", secondaryTextColor)}>
            {t('news.subtitle')}
          </p>
        </div>

        {/* Category Filter - Mobile horizontal scroll */}
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => onCategoryChange("all")}
              className={cn(
                "flex-shrink-0 px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 border whitespace-nowrap",
                activeCategoryId === "all" ? activeBg : cn("border-transparent", buttonColor)
              )}
              disabled={isLoading}
            >
              {t('news.categories.all')}
            </button>
            {Array.isArray(categories) && categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={cn(
                  "flex-shrink-0 px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 border whitespace-nowrap",
                  activeCategoryId === category.id ? activeBg : cn("border-transparent", buttonColor)
                )}
                disabled={isLoading}
              >
                {language === 'en' && category.nameEn ? category.nameEn : category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <MobileNewsCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <>
            {/* Check if we have any content to show */}
            {newsArticles.length === 0 ? (
              <MobileNewsEmptyState 
                message={activeCategoryId === "all" 
                  ? "Hiện tại chưa có tin tức nào." 
                  : "Hiện tại chưa có tin tức nào trong danh mục này."
                } 
              />
            ) : (
              <>
                {/* News Articles Grid */}
                <div className="grid grid-cols-1 gap-4 mb-6">
                  {newsArticles.map((article) => (
                    <MobileNewsCard key={article.id} article={article} />
                  ))}
                </div>

                {/* View All Button */}
                <div className="text-center">
                  <a
                    href="/news"
                    className={cn(
                      "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 border text-sm",
                      buttonColor
                    )}
                  >
                    {t('news.viewAll')}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default MobileNewsSection;
