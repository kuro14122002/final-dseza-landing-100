import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/utils/translations";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface InvestmentCard {
  id: string;
  titleKey: string;
  image: string;
  link: string;
}

const InvestmentInformation: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"investors" | "environment">("investors");
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Theme-specific styles (giữ nguyên)
  const textColor = theme === "dark" ? "text-dseza-dark-main-text" : "text-dseza-light-main-text";
  const secondaryTextColor = theme === "dark" ? "text-dseza-dark-secondary-text" : "text-dseza-light-secondary-text";
  const accentColor = theme === "dark" ? "text-dseza-dark-primary-accent" : "text-dseza-light-primary-accent";
  const accentHoverColor = theme === "dark" 
    ? "hover:text-dseza-dark-primary-accent-hover" 
    : "hover:text-dseza-light-primary-accent-hover";
  
  // Dữ liệu card (giữ nguyên)
  const investorCards: InvestmentCard[] = [
    { 
      id: 'inv1', 
      titleKey: "investment.investmentProcedures", 
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80", 
      link: "#investor-process" 
    },
    { 
      id: 'inv2', 
      titleKey: "investment.incentives", 
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80", 
      link: "#investment-fields" 
    },
    { 
      id: 'inv3', 
      titleKey: "investment.services", 
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80", 
      link: "#zoning-plans" 
    },
    { 
      id: 'inv4', 
      titleKey: "investment.workforce", 
      image: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80", 
      link: "#postal-submission" 
    },
    { 
      id: 'inv5', 
      titleKey: "investment.infrastructure", 
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80", 
      link: "#admin-procedure-lookup" 
    },
    { 
      id: 'inv6', 
      titleKey: "investment.services", 
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80", 
      link: "#online-services" 
    }
  ];

  const environmentCards: InvestmentCard[] = [
    { 
      id: 'env1', 
      titleKey: "investment.infrastructure", 
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80", 
      link: "#iz-infrastructure" 
    },
    { 
      id: 'env2', 
      titleKey: "investment.infrastructure", 
      image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80", 
      link: "#transport-infra" 
    },
    { 
      id: 'env3', 
      titleKey: "investment.environment", 
      image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80", 
      link: "#s&t-environment" 
    },
    { 
      id: 'env4', 
      titleKey: "investment.services", 
      image: "https://images.unsplash.com/photo-1473091534298-04dcbce3278c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80", 
      link: "#logistics" 
    },
    { 
      id: 'env5', 
      titleKey: "investment.infrastructure", 
      image: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80", 
      link: "#social-infra" 
    },
    { 
      id: 'env6', 
      titleKey: "investment.workforce", 
      image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80", 
      link: "#human-resources" 
    },
    { 
      id: 'env7', 
      titleKey: "investment.services", 
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80", 
      link: "#admin-reform" 
    },
    { 
      id: 'env8', 
      titleKey: "investment.services", 
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80", 
      link: "#digital-transformation" 
    }
  ];
  
  const currentCards = activeTab === "investors" ? investorCards : environmentCards;
  
  // Cập nhật scrollAmount để cuộn chính xác hơn từng card một
  // Giả sử mỗi card có chiều rộng 320px và khoảng cách giữa các card là 1rem (16px)
  const cardWidth = 320; // Chiều rộng của một card
  const cardGap = 16; // Khoảng cách giữa các card (tương ứng với gap-4)
  const scrollAmount = cardWidth + cardGap;

  // Logic cuộn vòng lặp
  const scrollCarousel = (direction: "left" | "right") => {
    if (!carouselRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    const maxScrollLeft = scrollWidth - clientWidth;

    if (direction === "left") {
      if (scrollLeft <= 0) {
        // Nếu đang ở đầu, cuộn đến cuối
        carouselRef.current.scrollTo({ left: maxScrollLeft, behavior: "smooth" });
      } else {
        carouselRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      }
    } else { // direction === "right"
      // Sử dụng một ngưỡng nhỏ để xác định đã đến cuối
      if (scrollLeft >= maxScrollLeft - 5) { // -5px là ngưỡng để tránh sai số float
        // Nếu đang ở cuối, cuộn về đầu
        carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };
  
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <h2 className={cn(
          "font-montserrat font-bold text-3xl md:text-4xl mb-8",
          textColor
        )}>
          {t('homepage.investmentInfo')}
        </h2>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column: tabs and navigation */}
          <div className="w-full lg:w-1/3">
            {/* Category tabs (giữ nguyên) */}
            <div className="mb-8">
              <button 
                className={cn(
                  "block font-montserrat font-semibold text-xl mb-4 transition-colors",
                  activeTab === "investors" ? accentColor : secondaryTextColor,
                  activeTab !== "investors" && accentHoverColor
                )}
                onClick={() => setActiveTab("investors")}
              >
                {t('investment.forInvestors')}
              </button>
              
              <button 
                className={cn(
                  "block font-montserrat font-semibold text-xl mb-4 transition-colors",
                  activeTab === "environment" ? accentColor : secondaryTextColor,
                  activeTab !== "environment" && accentHoverColor
                )}
                onClick={() => setActiveTab("environment")}
              >
                {t('investment.investmentEnvironment')}
              </button>
            </div>
            
            {/* Carousel navigation arrows (giữ nguyên giao diện, chỉ thay đổi logic) */}
            <div className="flex space-x-4">
              <button 
                className={cn(
                  "p-2 rounded-full transition-colors",
                  secondaryTextColor, // Giữ màu mặc định
                  accentHoverColor // Luôn cho phép hover
                )}
                onClick={() => scrollCarousel("left")}
              >
                <ArrowLeft className="w-8 h-8" />
              </button>
              
              <button 
                className={cn(
                  "p-2 rounded-full transition-colors",
                  secondaryTextColor, // Giữ màu mặc định
                  accentHoverColor // Luôn cho phép hover
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
                      {t(card.titleKey)}
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