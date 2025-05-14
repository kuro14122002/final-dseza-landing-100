
import React, { useState, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface InvestmentCard {
  id: string;
  title: string;
  image: string;
  link: string;
}

/**
 * Investment Information section with tabbed categories and image carousel
 */
const InvestmentInformation: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<"investors" | "environment">("investors");
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Theme-specific styles
  const textColor = theme === "dark" ? "text-dseza-dark-main-text" : "text-dseza-light-main-text";
  const secondaryTextColor = theme === "dark" ? "text-dseza-dark-secondary-text" : "text-dseza-light-secondary-text";
  const accentColor = theme === "dark" ? "text-dseza-dark-primary-accent" : "text-dseza-light-primary-accent";
  const accentHoverColor = theme === "dark" 
    ? "hover:text-dseza-dark-primary-accent-hover" 
    : "hover:text-dseza-light-primary-accent-hover";
  
  // Carousel data
  const investorCards: InvestmentCard[] = [
    { id: 'inv1', title: "Quy trình lĩnh vực đầu tư", image: "https://via.placeholder.com/400x250/CCCCCC/FFFFFF?text=Quy+trinh", link: "#investor-process" },
    { id: 'inv2', title: "Lĩnh vực thu hút đầu tư", image: "https://via.placeholder.com/400x250/CCCCCC/FFFFFF?text=Linh+vuc", link: "#investment-fields" },
    { id: 'inv3', title: "Quy hoạch khu chức năng", image: "https://via.placeholder.com/400x250/CCCCCC/FFFFFF?text=Quy+hoach", link: "#zoning-plans" },
    { id: 'inv4', title: "Đăng ký nộp hồ sơ qua bưu điện", image: "https://via.placeholder.com/400x250/CCCCCC/FFFFFF?text=Dang+ky+HS", link: "#postal-submission" },
    { id: 'inv5', title: "Tra cứu thủ tục hành chính", image: "https://via.placeholder.com/400x250/CCCCCC/FFFFFF?text=Tra+cuu+TTHC", link: "#admin-procedure-lookup" },
    { id: 'inv6', title: "Dịch vụ công trực tuyến", image: "https://via.placeholder.com/400x250/CCCCCC/FFFFFF?text=DVCTT", link: "#online-services" }
  ];

  const environmentCards: InvestmentCard[] = [
    { id: 'env1', title: "Hạ tầng khu công nghiệp", image: "https://via.placeholder.com/400x250/CCCCCC/FFFFFF?text=Ha+tang+KCN", link: "#iz-infrastructure" },
    { id: 'env2', title: "Hạ tầng giao thông", image: "https://via.placeholder.com/400x250/CCCCCC/FFFFFF?text=Ha+tang+GT", link: "#transport-infra" },
    { id: 'env3', title: "Khoa học công nghệ, môi trường", image: "https://via.placeholder.com/400x250/CCCCCC/FFFFFF?text=KHCN+Moi+truong", link: "#s&t-environment" },
    { id: 'env4', title: "Logistic", image: "https://via.placeholder.com/400x250/CCCCCC/FFFFFF?text=Logistic", link: "#logistics" },
    { id: 'env5', title: "Hạ tầng xã hội", image: "https://via.placeholder.com/400x250/CCCCCC/FFFFFF?text=Ha+tang+XH", link: "#social-infra" },
    { id: 'env6', title: "Nguồn nhân lực", image: "https://via.placeholder.com/400x250/CCCCCC/FFFFFF?text=Nhan+luc", link: "#human-resources" },
    { id: 'env7', title: "Cải cách hành chính", image: "https://via.placeholder.com/400x250/CCCCCC/FFFFFF?text=CCHC", link: "#admin-reform" },
    { id: 'env8', title: "Chuyển đổi số", image: "https://via.placeholder.com/400x250/CCCCCC/FFFFFF?text=Chuyen+doi+so", link: "#digital-transformation" }
  ];
  
  const currentCards = activeTab === "investors" ? investorCards : environmentCards;
  
  // Handle carousel scroll
  const scrollAmount = 300;
  
  const scrollCarousel = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    
    if (direction === "left") {
      carouselRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };
  
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <h2 className={cn(
          "font-montserrat font-bold text-3xl md:text-4xl mb-8",
          textColor
        )}>
          THÔNG TIN ĐẦU TƯ
        </h2>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column: tabs and navigation */}
          <div className="w-full lg:w-1/3">
            {/* Category tabs */}
            <div className="mb-8">
              <button 
                className={cn(
                  "block font-montserrat font-semibold text-xl mb-4 transition-colors",
                  activeTab === "investors" ? accentColor : secondaryTextColor,
                  activeTab !== "investors" && accentHoverColor
                )}
                onClick={() => setActiveTab("investors")}
              >
                Dành cho nhà đầu tư
              </button>
              
              <button 
                className={cn(
                  "block font-montserrat font-semibold text-xl mb-4 transition-colors",
                  activeTab === "environment" ? accentColor : secondaryTextColor,
                  activeTab !== "environment" && accentHoverColor
                )}
                onClick={() => setActiveTab("environment")}
              >
                Môi trường đầu tư
              </button>
            </div>
            
            {/* Carousel navigation arrows */}
            <div className="flex space-x-4">
              <button 
                className={cn(
                  "p-2 rounded-full transition-colors",
                  secondaryTextColor,
                  accentHoverColor
                )}
                onClick={() => scrollCarousel("left")}
              >
                <ArrowLeft className="w-8 h-8" />
              </button>
              
              <button 
                className={cn(
                  "p-2 rounded-full transition-colors",
                  secondaryTextColor,
                  accentHoverColor
                )}
                onClick={() => scrollCarousel("right")}
              >
                <ArrowRight className="w-8 h-8" />
              </button>
            </div>
          </div>
          
          {/* Right column: card carousel */}
          <div className="w-full lg:w-2/3">
            <div 
              ref={carouselRef}
              className="flex overflow-x-auto scrollbar-none gap-4 pb-4 snap-x"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {currentCards.map(card => (
                <a
                  key={card.id}
                  href={card.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-[280px] sm:min-w-[320px] h-64 rounded-lg overflow-hidden relative flex-shrink-0 snap-start transition-transform duration-300 hover:scale-[1.03]"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${card.image})` }}
                  ></div>
                  <div className="absolute inset-0 bg-black/30"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-montserrat font-semibold text-lg text-white">
                      {card.title}
                    </h3>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvestmentInformation;
