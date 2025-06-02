import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { AspectRatio } from "@/components/ui/aspect-ratio";

/**
 * Hero image and metadata skeleton
 */
export const ArticleHeroSkeleton: React.FC = () => {
  const { theme } = useTheme();
  const cardBg = theme === "dark" ? "bg-dseza-dark-secondary-bg" : "bg-dseza-light-secondary-bg";

  return (
    <div className="lg:w-[70%]">
      {/* Hero Image Skeleton */}
      <AspectRatio ratio={16/9} className="mb-6 rounded-xl overflow-hidden">
        <Skeleton className="w-full h-full" />
      </AspectRatio>

      {/* Article Meta Skeleton */}
      <div className="mb-6">
        <Skeleton className="h-6 w-32 mb-4 rounded-full" />
        <Skeleton className="h-12 w-full mb-2" />
        <Skeleton className="h-12 w-3/4 mb-4" />

        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>

        {/* Share Buttons Skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>

      {/* Separator */}
      <div className="mb-8">
        <Skeleton className="h-px w-full" />
      </div>
    </div>
  );
};

/**
 * Article content skeleton
 */
export const ArticleBodySkeleton: React.FC = () => {
  return (
    <div className="lg:w-[70%] space-y-4">
      {/* Paragraph skeletons */}
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-3/4" />
      
      <div className="my-6">
        <Skeleton className="h-8 w-1/2 mb-3" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-2/3" />
      </div>

      <div className="my-6">
        <Skeleton className="h-6 w-1/3 mb-3" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>

      {/* Blockquote skeleton */}
      <div className="my-6 pl-4 border-l-4">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      <div className="my-6">
        <Skeleton className="h-8 w-2/5 mb-3" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-4/5" />
      </div>
    </div>
  );
};

/**
 * Sidebar skeleton for desktop
 */
export const SidebarSkeleton: React.FC = () => {
  const { theme } = useTheme();
  const cardBg = theme === "dark" ? "bg-dseza-dark-secondary-bg" : "bg-dseza-light-secondary-bg";

  return (
    <aside className="lg:w-[30%] lg:sticky lg:top-4 lg:self-start">
      <div className="space-y-8">
        {/* Recent News Skeleton */}
        <div className={cn("rounded-xl p-6", cardBg)}>
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-4 w-full" />
            ))}
          </div>
        </div>

        {/* Category Tags Skeleton */}
        <div className={cn("rounded-xl p-6", cardBg)}>
          <Skeleton className="h-6 w-24 mb-4" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-6 w-20 rounded-full" />
            ))}
          </div>
        </div>

        {/* Newsletter Signup Skeleton */}
        <div className={cn("rounded-xl p-6", cardBg)}>
          <Skeleton className="h-6 w-36 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-4" />
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </aside>
  );
};

/**
 * Related news section skeleton
 */
export const RelatedNewsSkeleton: React.FC<{ isMobile?: boolean }> = ({ isMobile = false }) => {
  const { theme } = useTheme();
  const cardBg = theme === "dark" ? "bg-dseza-dark-secondary-bg" : "bg-dseza-light-secondary-bg";

  return (
    <section className="mt-16">
      <Skeleton className="h-8 w-48 mb-8" />
      <div className={cn(
        "grid gap-6",
        isMobile ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-4"
      )}>
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className={cn("rounded-xl overflow-hidden", cardBg)}>
            <AspectRatio ratio={16/9}>
              <Skeleton className="w-full h-full" />
            </AspectRatio>
            <div className="p-4">
              <Skeleton className="h-3 w-24 mb-1" />
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4 mt-1" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

/**
 * Complete page skeleton combining all components
 */
export const NewsDetailPageSkeleton: React.FC<{ isMobile?: boolean }> = ({ isMobile = false }) => {
  return (
    <div className="container mx-auto px-4 md:px-8 py-8">
      {/* Breadcrumb Skeleton */}
      <div className="mb-8 flex items-center gap-2">
        <Skeleton className="h-4 w-16" />
        <span>/</span>
        <Skeleton className="h-4 w-20" />
        <span>/</span>
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        <ArticleHeroSkeleton />
        {!isMobile && <SidebarSkeleton />}
      </div>

      {/* Article Body */}
      <div className="flex flex-col lg:flex-row gap-8 mt-8">
        <ArticleBodySkeleton />
      </div>

      {/* Related News */}
      <RelatedNewsSkeleton isMobile={isMobile} />
    </div>
  );
}; 