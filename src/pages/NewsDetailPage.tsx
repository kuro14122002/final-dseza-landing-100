import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/utils/translations";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

// Desktop Header Components
import TopBar from "@/components/hero/TopBar";
import LogoSearchBar from "@/components/hero/LogoSearchBar";
import NavigationBar from "@/components/hero/NavigationBar";

// Mobile Header Component
import MobileHeader from "@/components/mobile/MobileHeader";

// Footer Component
import Footer from "@/components/Footer";

// UI Components
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";

// Icons
import { Share2, Calendar, User, Clock, Tag, Mail } from "lucide-react";

interface NewsCardProps {
  date: string;
  title: string;
  titleEn?: string;
  excerpt: string;
  excerptEn?: string;
  image: string;
  url?: string;
}

const NewsCard: React.FC<NewsCardProps> = ({ 
  date, 
  title, 
  titleEn, 
  excerpt, 
  excerptEn, 
  image, 
  url = "#" 
}) => {
  const { theme } = useTheme();
  const { language } = useLanguage();

  const cardBg = theme === "dark" ? "bg-dseza-dark-secondary-bg" : "bg-dseza-light-secondary-bg";
  const textColor = theme === "dark" ? "text-dseza-dark-main-text" : "text-dseza-light-main-text";
  const secondaryTextColor = theme === "dark" ? "text-dseza-dark-secondary-text" : "text-dseza-light-secondary-text";
  const titleHoverColor = theme === "dark" ? "hover:text-dseza-dark-primary-accent" : "hover:text-dseza-light-primary-accent";

  const displayTitle = language === 'en' && titleEn ? titleEn : title;
  const displayExcerpt = language === 'en' && excerptEn ? excerptEn : excerpt;

  return (
    <a
      href={url}
      className={cn(
        "group block rounded-xl overflow-hidden transition-all duration-300 hover:transform hover:-translate-y-1 h-full",
        cardBg,
        theme === "dark" ? "hover:shadow-[0_8px_16px_rgba(0,0,0,0.3)]" : "hover:shadow-[0_8px_16px_rgba(0,0,0,0.15)]"
      )}
    >
      <AspectRatio ratio={16/9} className="overflow-hidden">
        <img
          src={image}
          alt={displayTitle}
          className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
        />
      </AspectRatio>
      <div className="p-4">
        <p className={cn("text-xs mb-1", secondaryTextColor)}>{date}</p>
        <h3 className={cn(
          "font-montserrat font-semibold mb-2 line-clamp-2 transition-colors duration-300 text-sm",
          textColor,
          titleHoverColor
        )}>
          {displayTitle}
        </h3>
        <p className={cn("text-xs line-clamp-2", secondaryTextColor)}>
          {displayExcerpt}
        </p>
      </div>
    </a>
  );
};

const NewsDetailPage: React.FC = () => {
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { t } = useTranslation();

  // Theme-specific styles
  const bgColor = theme === "dark" ? "bg-dseza-dark-main-bg" : "bg-dseza-light-main-bg";
  const textColor = theme === "dark" ? "text-dseza-dark-main-text" : "text-dseza-light-main-text";
  const secondaryTextColor = theme === "dark" ? "text-dseza-dark-secondary-text" : "text-dseza-light-secondary-text";
  const cardBg = theme === "dark" ? "bg-dseza-dark-secondary-bg" : "bg-dseza-light-secondary-bg";
  const borderColor = theme === "dark" ? "border-dseza-dark-border" : "border-dseza-light-border";
  const accentColor = theme === "dark" ? "text-dseza-dark-primary-accent" : "text-dseza-light-primary-accent";
  const buttonColor = theme === "dark" ? "text-dseza-dark-primary-accent border-dseza-dark-primary-accent hover:bg-dseza-dark-primary-accent/10" : "text-dseza-light-primary-accent border-dseza-light-primary-accent hover:bg-dseza-light-primary-accent/10";

  // Sample article data (placeholder)
  const articleData = {
    id: "news-001",
    category: "Đầu tư – Hợp tác quốc tế",
    categoryEn: "Investment – Int'l Cooperation",
    title: "DSEZA thu hút thành công dự án FDI 100 triệu USD từ Nhật Bản trong lĩnh vực sản xuất linh kiện điện tử công nghệ cao",
    titleEn: "DSEZA successfully attracts $100M FDI project from Japan in high-tech electronics manufacturing",
    author: "Ban Quản lý DSEZA",
    authorEn: "DSEZA Management Board",
    date: "20/05/2025",
    readTime: "5 phút đọc",
    readTimeEn: "5 min read",
    heroImage: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1200&q=80",
    content: {
      vi: `
        <p>Sáng ngày 20/05/2025, Ban Quản lý Khu Công nghệ cao và các Khu Công nghiệp Đà Nẵng (DSEZA) đã chính thức ký kết thỏa thuận hợp tác với Tập đoàn Technova Industries của Nhật Bản cho dự án đầu tư sản xuất linh kiện điện tử công nghệ cao trị giá 100 triệu USD.</p>

        <h2>Dự án mang tính chiến lược cao</h2>
        <p>Dự án này được đánh giá là một bước tiến quan trọng trong chiến lược thu hút đầu tư nước ngoài của thành phố Đà Nẵng, đặc biệt trong lĩnh vực công nghệ cao. Nhà máy sản xuất sẽ được xây dựng trên diện tích 15 hecta tại Khu Công nghệ cao Đà Nẵng với công nghệ hiện đại nhất.</p>

        <h3>Các sản phẩm chính</h3>
        <ul>
          <li>Vi mạch bán dẫn cho thiết bị IoT</li>
          <li>Cảm biến thông minh cho ô tô điện</li>
          <li>Linh kiện điện tử cho thiết bị y tế</li>
          <li>Module điều khiển cho hệ thống năng lượng tái tạo</li>
        </ul>

        <p>Theo ông Tanaka Hiroshi, Giám đốc điều hành Technova Industries, việc chọn Đà Nẵng làm địa điểm đầu tư không chỉ dựa trên vị trí địa lý thuận lợi mà còn bởi chất lượng nguồn nhân lực và chính sách ưu đãi hấp dẫn của DSEZA.</p>

        <blockquote>
          "Chúng tôi tin tưởng rằng Đà Nẵng sẽ trở thành trung tâm sản xuất quan trọng của Technova Industries tại khu vực Đông Nam Á. Dự án này không chỉ mang lại lợi ích kinh tế mà còn góp phần vào sự phát triển bền vững của ngành công nghệ cao tại Việt Nam." - Ông Tanaka Hiroshi
        </blockquote>

        <h2>Tác động tích cực đến kinh tế địa phương</h2>
        <p>Dự án dự kiến sẽ tạo ra hơn 2.000 việc làm trực tiếp và 5.000 việc làm gián tiếp cho người lao động địa phương. Đặc biệt, 80% số việc làm được tạo ra sẽ dành cho kỹ sư và nhân viên kỹ thuật có trình độ cao.</p>
      `,
      en: `
        <p>On the morning of May 20, 2025, the Management Board of Da Nang High-Tech Park and Industrial Zones (DSEZA) officially signed a cooperation agreement with Japan's Technova Industries Group for a $100 million high-tech electronic component manufacturing investment project.</p>

        <h2>A strategically important project</h2>
        <p>This project is considered an important step in Da Nang city's foreign investment attraction strategy, especially in the high-tech sector. The manufacturing plant will be built on 15 hectares in Da Nang High-Tech Park with the most modern technology.</p>

        <h3>Main products</h3>
        <ul>
          <li>Semiconductors for IoT devices</li>
          <li>Smart sensors for electric vehicles</li>
          <li>Electronic components for medical devices</li>
          <li>Control modules for renewable energy systems</li>
        </ul>

        <p>According to Mr. Tanaka Hiroshi, CEO of Technova Industries, choosing Da Nang as the investment location was based not only on its favorable geographical position but also on the quality of human resources and attractive incentive policies of DSEZA.</p>

        <blockquote>
          "We believe that Da Nang will become an important manufacturing center for Technova Industries in Southeast Asia. This project will not only bring economic benefits but also contribute to the sustainable development of the high-tech industry in Vietnam." - Mr. Tanaka Hiroshi
        </blockquote>

        <h2>Positive impact on local economy</h2>
        <p>The project is expected to create more than 2,000 direct jobs and 5,000 indirect jobs for local workers. Notably, 80% of the jobs created will be for highly qualified engineers and technical staff.</p>
      `
    }
  };

  // Related news data
  const relatedNews = [
    {
      date: "18/05/2025",
      title: "Hội thảo xúc tiến đầu tư vào Đà Nẵng tổ chức tại Singapore",
      titleEn: "Da Nang investment promotion workshop held in Singapore",
      excerpt: "Nhiều nhà đầu tư Singapore bày tỏ sự quan tâm sâu sắc đến môi trường đầu tư tại các KCN, KCNC Đà Nẵng...",
      excerptEn: "Many Singaporean investors expressed deep interest in the investment environment in Da Nang's industrial and high-tech zones...",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
      url: "#"
    },
    {
      date: "15/05/2025",
      title: "Đà Nẵng nâng cao năng lực cạnh tranh trong thu hút đầu tư nước ngoài",
      titleEn: "Da Nang enhances competitiveness in attracting foreign investment",
      excerpt: "Thành phố đang tích cực cải thiện môi trường đầu tư, đơn giản hóa thủ tục hành chính...",
      excerptEn: "The city is actively improving the investment environment and simplifying administrative procedures...",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
      url: "#"
    },
    {
      date: "12/05/2025",
      title: "Khu Công nghệ cao Đà Nẵng ký kết hợp tác với 3 trường đại học hàng đầu",
      titleEn: "Da Nang High-Tech Park signs cooperation with 3 leading universities",
      excerpt: "Thỏa thuận hợp tác nhằm đào tạo nguồn nhân lực chất lượng cao cho các doanh nghiệp...",
      excerptEn: "Cooperation agreement aims to train high-quality human resources for businesses...",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80",
      url: "#"
    },
    {
      date: "10/05/2025",
      title: "Triển khai dự án thành phố thông minh tại các khu công nghiệp",
      titleEn: "Smart city project deployment in industrial zones",
      excerpt: "Dự án sẽ ứng dụng công nghệ IoT, AI để nâng cao hiệu quả quản lý và vận hành...",
      excerptEn: "The project will apply IoT and AI technologies to improve management and operational efficiency...",
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80",
      url: "#"
    }
  ];

  // Recent news for sidebar
  const recentNews = [
    {
      title: "DSEZA khởi động chương trình hỗ trợ startup công nghệ 2025",
      titleEn: "DSEZA launches 2025 tech startup support program",
      url: "#"
    },
    {
      title: "Khai trương trung tâm R&D chung cho các doanh nghiệp công nghệ cao",
      titleEn: "Opening of shared R&D center for high-tech enterprises",
      url: "#"
    },
    {
      title: "Đà Nẵng tiếp đoàn đầu tư từ Hàn Quốc khảo sát cơ hội hợp tác",
      titleEn: "Da Nang receives Korean investment delegation to survey cooperation opportunities",
      url: "#"
    },
    {
      title: "Triển khai hệ thống quản lý thông minh tại các khu công nghiệp",
      titleEn: "Deploying smart management system in industrial zones",
      url: "#"
    },
    {
      title: "Hội nghị kết nối doanh nghiệp FDI với doanh nghiệp địa phương",
      titleEn: "Conference connecting FDI enterprises with local businesses",
      url: "#"
    }
  ];

  // Category tags for sidebar
  const categoryTags = [
    { name: "Đầu tư", nameEn: "Investment", count: 45 },
    { name: "Hợp tác quốc tế", nameEn: "International Cooperation", count: 32 },
    { name: "Công nghệ cao", nameEn: "High-tech", count: 28 },
    { name: "Startup", nameEn: "Startup", count: 19 },
    { name: "Đào tạo", nameEn: "Training", count: 15 },
    { name: "Chuyển đổi số", nameEn: "Digital Transformation", count: 12 }
  ];

  const displayCategory = language === 'en' && articleData.categoryEn ? articleData.categoryEn : articleData.category;
  const displayTitle = language === 'en' && articleData.titleEn ? articleData.titleEn : articleData.title;
  const displayAuthor = language === 'en' && articleData.authorEn ? articleData.authorEn : articleData.author;
  const displayReadTime = language === 'en' && articleData.readTimeEn ? articleData.readTimeEn : articleData.readTime;
  const displayContent = language === 'en' ? articleData.content.en : articleData.content.vi;

  return (
    <div className={cn("min-h-screen", bgColor)}>
      {/* Header */}
      {isMobile ? (
        <MobileHeader />
      ) : (
        <div className="relative">
          <TopBar />
          <LogoSearchBar />
          <NavigationBar />
        </div>
      )}

      {/* Content */}
      <main className="pt-24 md:pt-44">
        <div className="container mx-auto px-4 md:px-8 py-8">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-8">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className={textColor}>
                  {t('home')}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/news" className={textColor}>
                  {t('nav.news')}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className={secondaryTextColor}>
                  {displayCategory}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Article Content - 70% on desktop */}
            <article className="lg:w-[70%]">
              {/* Hero Image */}
              <AspectRatio ratio={16/9} className="mb-6 rounded-xl overflow-hidden">
                <img
                  src={articleData.heroImage}
                  alt={displayTitle}
                  className="w-full h-full object-cover"
                />
              </AspectRatio>

              {/* Article Meta */}
              <div className="mb-6">
                <Badge variant="secondary" className={cn("mb-4", accentColor)}>
                  {displayCategory}
                </Badge>

                <h1 className={cn("text-3xl md:text-4xl font-bold font-montserrat mb-4", textColor)}>
                  {displayTitle}
                </h1>

                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className={cn("flex items-center gap-2 text-sm", secondaryTextColor)}>
                    <User className="w-4 h-4" />
                    <span>{displayAuthor}</span>
                  </div>
                  <div className={cn("flex items-center gap-2 text-sm", secondaryTextColor)}>
                    <Calendar className="w-4 h-4" />
                    <span>{articleData.date}</span>
                  </div>
                  <div className={cn("flex items-center gap-2 text-sm", secondaryTextColor)}>
                    <Clock className="w-4 h-4" />
                    <span>{displayReadTime}</span>
                  </div>
                </div>

                {/* Share Buttons */}
                <div className="flex items-center gap-2">
                  <span className={cn("text-sm", secondaryTextColor)}>{t('news.detail.share')}:</span>
                  <Button variant="outline" size="sm" className={buttonColor}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Facebook
                  </Button>
                  <Button variant="outline" size="sm" className={buttonColor}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Twitter
                  </Button>
                  <Button variant="outline" size="sm" className={buttonColor}>
                    <Share2 className="w-4 h-4 mr-2" />
                    LinkedIn
                  </Button>
                </div>
              </div>

              <Separator className={cn("mb-8", borderColor)} />

              {/* Article Content */}
              <div 
                className={cn(
                  "prose prose-lg max-w-none", 
                  textColor,
                  // Override blockquote colors specifically
                  theme === "dark" && "[&_blockquote]:text-white [&_blockquote]:border-gray-600",
                  theme === "light" && "[&_blockquote]:text-gray-600 [&_blockquote]:border-gray-300"
                )}
                dangerouslySetInnerHTML={{ __html: displayContent }}
                style={{
                  color: theme === "dark" ? "#FFFFFF" : "#000000",
                  '--tw-prose-headings': theme === "dark" ? "#FFFFFF" : "#000000",
                  '--tw-prose-p': theme === "dark" ? "#FFFFFF" : "#000000",
                  '--tw-prose-strong': theme === "dark" ? "#FFFFFF" : "#000000",
                  '--tw-prose-blockquote': theme === "dark" ? "#FFFFFF" : "#545454",
                  '--tw-prose-hr': theme === "dark" ? "#455A64" : "#DCDCDC",
                  '--tw-prose-li': theme === "dark" ? "#FFFFFF" : "#000000",
                } as React.CSSProperties & Record<string, string>}
              />
            </article>

            {/* Sidebar - 30% on desktop, hidden on mobile */}
            {!isMobile && (
              <aside className="lg:w-[30%] lg:sticky lg:top-4 lg:self-start">
                <div className="space-y-8">
                  {/* Recent News */}
                  <div className={cn("rounded-xl p-6", cardBg)}>
                    <h3 className={cn("text-lg font-semibold font-montserrat mb-4", textColor)}>
                      {t('news.detail.recentNews')}
                    </h3>
                    <div className="space-y-4">
                      {recentNews.map((news, index) => {
                        const displayNewsTitle = language === 'en' && news.titleEn ? news.titleEn : news.title;
                        return (
                          <a
                            key={index}
                            href={news.url}
                            className={cn("block text-sm hover:underline transition-colors", textColor, "hover:" + accentColor.split(' ')[0])}
                          >
                            {displayNewsTitle}
                          </a>
                        );
                      })}
                    </div>
                  </div>

                  {/* Category Tags */}
                  <div className={cn("rounded-xl p-6", cardBg)}>
                    <h3 className={cn("text-lg font-semibold font-montserrat mb-4", textColor)}>
                      {t('news.detail.categories')}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {categoryTags.map((tag, index) => {
                        const displayTagName = language === 'en' && tag.nameEn ? tag.nameEn : tag.name;
                        return (
                          <Badge key={index} variant="outline" className={cn("text-xs", buttonColor)}>
                            <Tag className="w-3 h-3 mr-1" />
                            {displayTagName} ({tag.count})
                          </Badge>
                        );
                      })}
                    </div>
                  </div>

                  {/* Newsletter Signup */}
                  <div className={cn("rounded-xl p-6", cardBg)}>
                    <h3 className={cn("text-lg font-semibold font-montserrat mb-4", textColor)}>
                      {t('news.detail.newsletterSignup')}
                    </h3>
                    <p className={cn("text-sm mb-4", secondaryTextColor)}>
                      {t('news.detail.newsletterDescription')}
                    </p>
                    <div className="space-y-3">
                      <Input
                        type="email"
                        placeholder={t('news.detail.emailPlaceholder')}
                        className={cn("bg-transparent", borderColor)}
                      />
                      <Button className={cn("w-full", buttonColor)}>
                        <Mail className="w-4 h-4 mr-2" />
                        {t('news.detail.subscribe')}
                      </Button>
                    </div>
                  </div>
                </div>
              </aside>
            )}
          </div>

          {/* Related News Section */}
          <section className="mt-16">
            <h2 className={cn("text-2xl md:text-3xl font-bold font-montserrat mb-8", textColor)}>
              {t('news.detail.relatedNews')}
            </h2>
            <div className={cn(
              "grid gap-6",
              isMobile ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-4"
            )}>
              {relatedNews.map((news, index) => (
                <NewsCard key={index} {...news} />
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default NewsDetailPage; 