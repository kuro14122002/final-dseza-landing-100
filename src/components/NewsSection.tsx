// src/components/NewsSection.tsx
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/utils/translations";
import { useLanguage } from "@/context/LanguageContext";
import { NewsSectionProps, NewsArticle } from "@/types/news";
import { Skeleton } from "@/components/ui/skeleton";

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
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'en' ? 'en-GB' : 'vi-VN');
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
 * News section with category filters
 */
const NewsSection: React.FC<NewsSectionProps> = ({
  featuredArticle,
  regularNews,
  categories,
  activeCategoryId,
  onCategoryChange,
  isLoading
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { language } = useLanguage();

  // Theme-specific styles
  const textColor = theme === "dark" ? "text-dseza-dark-main-text" : "text-dseza-light-main-text";
  const secondaryTextColor = theme === "dark" ? "text-dseza-dark-secondary-text" : "text-dseza-light-secondary-text";
  const accentColor = theme === "dark" ? "text-dseza-dark-primary-accent" : "text-dseza-light-primary-accent";
  const buttonText = theme === "dark" ? "text-[#19DBCF]" : "text-[#416628]";
  const buttonBorder = theme === "dark" ? "border-[#19DBCF]" : "border-[#416628]";
  const buttonHoverBg = theme === "dark" ? "hover:bg-[#19DBCF]/10" : "hover:bg-[#416628]/10";

  const activeCategory = categories.find(cat => cat.id === activeCategoryId);
  const displayCategoryName = language === 'en' && activeCategory?.nameEn ? activeCategory.nameEn : activeCategory?.name;

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className={cn("text-3xl sm:text-4xl font-montserrat font-bold mb-3", textColor)}>
            {t("news.title")}
          </h2>
          <p className={cn("text-lg", secondaryTextColor)}>
            {t("news.subtitle") || "Cập nhật thông tin mới nhất về hoạt động đầu tư và phát triển tại DSEZA"}
          </p>
        </div>

        {/* Category Filter Buttons */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {categories.map((category) => {
              const isActive = category.id === activeCategoryId;
              const displayName = language === 'en' && category.nameEn ? category.nameEn : category.name;
              
              return (
                <button
                  key={category.id}
                  onClick={() => onCategoryChange(category.id)}
                  className={cn(
                    "px-3 py-2 sm:px-4 sm:py-2 rounded-full text-sm font-medium transition-all duration-300",
                    isActive
                      ? cn(
                          "text-white",
                          theme === "dark" ? "bg-[#19DBCF]" : "bg-[#416628]"
                        )
                      : cn(
                          "border",
                          buttonText,
                          buttonBorder,
                          buttonHoverBg,
                          theme === "dark" ? "bg-transparent" : "bg-transparent"
                        )
                  )}
                  disabled={isLoading}
                >
                  {displayName}
                </button>
              );
            })}
          </div>
        </div>

        {/* News Grid - New responsive layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Featured Article - Takes up more space */}
          <div className="lg:col-span-8">
            {isLoading ? (
              <NewsCardSkeleton size="large" />
            ) : featuredArticle ? (
              <NewsCard article={featuredArticle} size="large" />
            ) : (
              <div className={cn("text-center py-12", secondaryTextColor)}>
                {t("news.noFeatured") || "Không có tin nổi bật"}
              </div>
            )}
          </div>

          {/* Regular News - Sidebar */}
          <div className="lg:col-span-4">
            <div className="space-y-4">
              {isLoading ? (
                <>
                  <NewsCardSkeleton size="small" />
                  <NewsCardSkeleton size="small" />
                  <NewsCardSkeleton size="small" />
                </>
              ) : regularNews.length > 0 ? (
                regularNews.map((article) => (
                  <NewsCard key={article.id} article={article} size="small" />
                ))
              ) : (
                <div className={cn("text-center py-8", secondaryTextColor)}>
                  {t("news.noArticles") || "Không có bài viết nào"}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* View All Button */}
        <div className="mt-8 text-center">
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

export default NewsSection;