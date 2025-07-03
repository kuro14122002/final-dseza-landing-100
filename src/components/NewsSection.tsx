// src/components/NewsSection.tsx
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/utils/translations";
import { useLanguage } from "@/context/LanguageContext";
import { NewsSectionProps, NewsArticle } from "@/types/news";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, ExternalLink } from "lucide-react";

interface NewsCardProps {
  article: NewsArticle;
  size?: "large" | "medium" | "small";
}

/**
 * Individual news card component
 */
const NewsCard: React.FC<NewsCardProps> = ({ article, size = "medium" }) => {
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

  // Size-based styling
  const getImageAspect = () => {
    switch (size) {
      case "large":
        return "aspect-[16/10]";
      case "medium":
        return "aspect-[16/9]";
      case "small":
        return "aspect-[16/9]";
      default:
        return "aspect-[16/9]";
    }
  };

  const getTitleSize = () => {
    switch (size) {
      case "large":
        return "text-2xl lg:text-3xl mb-4";
      case "medium":
        return "text-lg lg:text-xl mb-3";
      case "small":
        return "text-base mb-2";
      default:
        return "text-lg mb-3";
    }
  };

  const getExcerptSize = () => {
    switch (size) {
      case "large":
        return "text-base mb-4";
      case "medium":
        return "text-sm mb-3";
      case "small":
        return "text-sm mb-2";
      default:
        return "text-sm mb-3";
    }
  };

  const getPadding = () => {
    switch (size) {
      case "large":
        return "p-6";
      case "medium":
        return "p-4 lg:p-5";
      case "small":
        return "p-3 lg:p-4";
      default:
        return "p-4";
    }
  };

  return (
    <a
      href={`/news/${article.slug}`}
      className={cn(
        "group block rounded-xl overflow-hidden transition-all duration-300 hover:transform hover:-translate-y-1 h-full",
        cardBg,
        theme === "dark" ? "hover:shadow-[0_8px_16px_rgba(0,0,0,0.3)]" : "hover:shadow-[0_8px_16px_rgba(0,0,0,0.15)]"
      )}
    >
      <div className={cn("relative overflow-hidden", getImageAspect())}>
        <img
          src={article.imageUrl}
          alt={displayTitle}
          className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
      </div>
      <div className={getPadding()}>
        <p className={cn("text-xs mb-2", secondaryTextColor)}>{formatDate(article.publishDate)}</p>
        <h3 className={cn(
          "font-montserrat font-semibold line-clamp-2 transition-colors duration-300",
          textColor, 
          titleHoverColor,
          getTitleSize()
        )}>
          {displayTitle}
        </h3>
        <p className={cn(
          "line-clamp-3",
          secondaryTextColor,
          getExcerptSize()
        )}>
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
 * Loading skeleton for news cards
 */
const NewsCardSkeleton: React.FC<{ size?: "large" | "medium" | "small" }> = ({ size = "medium" }) => {
  const { theme } = useTheme();
  const cardBg = theme === "dark" ? "bg-dseza-dark-secondary-bg" : "bg-dseza-light-secondary-bg";

  const getImageAspect = () => {
    switch (size) {
      case "large":
        return "aspect-[16/10]";
      case "medium":
        return "aspect-[16/9]";
      case "small":
        return "aspect-[16/9]";
      default:
        return "aspect-[16/9]";
    }
  };

  const getPadding = () => {
    switch (size) {
      case "large":
        return "p-6";
      case "medium":
        return "p-4 lg:p-5";
      case "small":
        return "p-3 lg:p-4";
      default:
        return "p-4";
    }
  };

  return (
    <div className={cn("rounded-xl overflow-hidden h-full", cardBg)}>
      <Skeleton className={cn("w-full", getImageAspect())} />
      <div className={getPadding()}>
        <Skeleton className="h-3 w-24 mb-2" />
        <Skeleton className={cn("w-full mb-2", size === "large" ? "h-8" : "h-6")} />
        <Skeleton className={cn("w-3/4 mb-3", size === "large" ? "h-8" : "h-6")} />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3 mt-1" />
        <Skeleton className="h-3 w-16 mt-2" />
      </div>
    </div>
  );
};

/**
 * Error component for when news loading fails
 */
const NewsErrorState: React.FC<{ 
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
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <Alert className="max-w-md mb-4">
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
        >
          <RefreshCw className="h-4 w-4" />
          {t('common.retry')}
        </Button>
      )}
    </div>
  );
};

/**
 * Empty state component for when no news articles are available
 */
const NewsEmptyState: React.FC<{ message?: string }> = ({ 
  message = "Hiện tại chưa có tin tức nào." 
}) => {
  const { theme } = useTheme();
  const textColor = theme === "dark" ? "text-dseza-dark-main-text" : "text-dseza-light-main-text";
  const secondaryTextColor = theme === "dark" ? "text-dseza-dark-secondary-text" : "text-dseza-light-secondary-text";

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className={cn("w-16 h-16 rounded-full flex items-center justify-center mb-4", 
        theme === "dark" ? "bg-dseza-dark-secondary-bg" : "bg-dseza-light-secondary-bg")}>
        <ExternalLink className={cn("w-8 h-8", secondaryTextColor)} />
      </div>
      <h3 className={cn("text-lg font-semibold mb-2", textColor)}>
        Chưa có tin tức
      </h3>
      <p className={cn("text-sm", secondaryTextColor)}>
        {message}
      </p>
    </div>
  );
};

/**
 * News section with category filters
 */
const NewsSection: React.FC<NewsSectionProps & { 
  error?: string; 
  onRetry?: () => void;
}> = ({
  featuredArticle,
  regularNews,
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
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-8">
            <h2 className={cn("text-2xl lg:text-3xl font-bold font-montserrat mb-4", textColor)}>
              {t('news.title')}
            </h2>
            <p className={cn("text-sm lg:text-base", secondaryTextColor)}>
              {t('news.subtitle')}
            </p>
          </div>
          <NewsErrorState error={error} onRetry={onRetry} />
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className={cn("text-2xl lg:text-3xl font-bold font-montserrat mb-4", textColor)}>
            {t('news.title')}
          </h2>
          <p className={cn("text-sm lg:text-base", secondaryTextColor)}>
            {t('news.subtitle')}
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button
            onClick={() => onCategoryChange("all")}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border",
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
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border",
                activeCategoryId === category.id ? activeBg : cn("border-transparent", buttonColor)
              )}
              disabled={isLoading}
            >
              {language === 'en' && category.nameEn ? category.nameEn : category.name}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Featured article skeleton */}
            <div className="lg:col-span-2">
              <NewsCardSkeleton size="large" />
            </div>
            {/* Regular articles skeleton */}
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <NewsCardSkeleton key={index} size="medium" />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Check if we have any content to show */}
            {!featuredArticle && regularNews.length === 0 ? (
              <NewsEmptyState 
                message={activeCategoryId === "all" 
                  ? "Hiện tại chưa có tin tức nào." 
                  : "Hiện tại chưa có tin tức nào trong danh mục này."
                } 
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Featured Article */}
                {featuredArticle && (
                  <div className="lg:col-span-2">
                    <NewsCard article={featuredArticle} size="large" />
                  </div>
                )}

                {/* Regular Articles */}
                <div className={cn(
                  "space-y-6",
                  !featuredArticle && "lg:col-span-3"
                )}>
                  {regularNews.length > 0 ? (
                    <>
                      {!featuredArticle && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {regularNews.map((article) => (
                            <NewsCard key={article.id} article={article} size="medium" />
                          ))}
                        </div>
                      )}
                      {featuredArticle && regularNews.map((article) => (
                        <NewsCard key={article.id} article={article} size="small" />
                      ))}
                    </>
                  ) : featuredArticle ? (
                    <div className={cn("text-center py-8", secondaryTextColor)}>
                      <p className="text-sm">
                        Không có tin tức khác trong danh mục này.
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </>
        )}

        {/* View All Button */}
        {!isLoading && (featuredArticle || regularNews.length > 0) && (
          <div className="text-center mt-8">
            <a
              href="/news"
              className={cn(
                "inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 border",
                buttonColor
              )}
            >
              {t('news.viewAll')}
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsSection;