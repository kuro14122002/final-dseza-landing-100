import React, { useState, useEffect } from "react";
import HeroSection from "@/components/hero/HeroSection";
import QuickAccessButtons from "@/components/QuickAccessButtons";
import FeaturedEvents from "@/components/FeaturedEvents";
import NewsSection from "@/components/NewsSection";
import FunctionalZones from "@/components/FunctionalZones";
import InvestmentInformation from "@/components/InvestmentInformation";
import LocationSection from "@/components/LocationSection";
import ResourcesSection from "@/components/ResourcesSection";
import BusinessesAndPartners from "@/components/BusinessesAndPartners";
import Footer from "@/components/Footer";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileQuickLinksCarousel from "@/components/mobile/MobileQuickLinksCarousel";
import MobileFeaturedEvents from "@/components/mobile/MobileFeaturedEvents";
import MobileNewsSection from "@/components/mobile/MobileNewsSection";
import MobileFunctionalZonesCarousel from "@/components/mobile/MobileFunctionalZonesCarousel";
import MobileInvestmentInformation from "@/components/mobile/MobileInvestmentInformation";
import { NewsArticle, NewsCategory } from "@/types/news";
import { 
  fetchNewsCategories, 
  fetchFeaturedArticle, 
  fetchRegularNews, 
  fetchNewsArticles 
} from "@/services/newsService";

const Index: React.FC = () => {
  const isMobile = useIsMobile();
  
  // News state management
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [featuredArticle, setFeaturedArticle] = useState<NewsArticle | null>(null);
  const [regularNews, setRegularNews] = useState<NewsArticle[]>([]);
  const [mobileNewsArticles, setMobileNewsArticles] = useState<NewsArticle[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string>("investment");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        // Load categories first
        const categoriesData = await fetchNewsCategories();
        setCategories(categoriesData);
        
        // Load initial news data for the default category
        const [featured, regular, mobileArticlesResponse] = await Promise.all([
          fetchFeaturedArticle(),
          fetchRegularNews(activeCategoryId, 3),
          fetchNewsArticles(activeCategoryId, 1, 4) // page 1, limit 4 for mobile view
        ]);
        
        setFeaturedArticle(featured);
        setRegularNews(regular);
        setMobileNewsArticles(mobileArticlesResponse.articles);
      } catch (error) {
        console.error('Error loading news data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Handle category change
  const handleCategoryChange = async (categoryId: string) => {
    setActiveCategoryId(categoryId);
    setIsLoading(true);
    
    try {
      if (isMobile) {
        // For mobile, load all articles for the category
        const articlesResponse = await fetchNewsArticles(categoryId, 1, 4);
        setMobileNewsArticles(articlesResponse.articles);
      } else {
        // For desktop, load featured and regular articles separately
        const [featured, regular] = await Promise.all([
          fetchFeaturedArticle(), // Featured article doesn't change with category for now
          fetchRegularNews(categoryId, 3)
        ]);
        
        setFeaturedArticle(featured);
        setRegularNews(regular);
      }
    } catch (error) {
      console.error('Error loading news for category:', categoryId, error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Content Sections */}
      <div className="bg-background">
        {/* Quick Access Buttons - show desktop or mobile version based on viewport */}
        {isMobile ? <MobileQuickLinksCarousel /> : <QuickAccessButtons />}
        
        {/* Featured Events Section - show desktop or mobile version based on viewport */}
        {isMobile ? <MobileFeaturedEvents /> : <FeaturedEvents />}
        
        {/* News Section - show desktop or mobile version based on viewport */}
        {isMobile ? (
          <MobileNewsSection 
            newsArticles={mobileNewsArticles}
            categories={categories}
            activeCategoryId={activeCategoryId}
            onCategoryChange={handleCategoryChange}
            isLoading={isLoading}
          />
        ) : (
          <NewsSection 
            featuredArticle={featuredArticle}
            regularNews={regularNews}
            categories={categories}
            activeCategoryId={activeCategoryId}
            onCategoryChange={handleCategoryChange}
            isLoading={isLoading}
          />
        )}
        
        {/* Functional Zones Section - show desktop or mobile version based on viewport */}
        {isMobile ? <MobileFunctionalZonesCarousel /> : <FunctionalZones />}
        
        {/* Investment Information Section - show desktop or mobile version based on viewport */}
        {isMobile ? <MobileInvestmentInformation /> : <InvestmentInformation />}
        
        {/* Location Map Section */}
        <LocationSection />
        
        {/* Resources Section */}
        <ResourcesSection />
        
        {/* Businesses and Partners Section */}
        <BusinessesAndPartners />
      </div>
      
      {/* Footer */}
      <Footer />
    </main>
  );
};

export default Index;