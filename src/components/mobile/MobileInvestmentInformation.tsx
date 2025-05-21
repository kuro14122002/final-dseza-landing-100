import React, { useState, useRef } from "react";
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

const MobileInvestmentInformation: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] =
    useState<"investors" | "environment">("investors");
  const carouselRef = useRef<HTMLDivElement>(null);

  // Theme-specific styles
  const sectionBg = theme === "dark" ? "bg-[#1E272F]" : "bg-white"; // Mobile section background
  const textColor =
    theme === "dark" ? "text-dseza-dark-main-text" : "text-dseza-light-main-text";
  const secondaryTextColor =
    theme === "dark"
      ? "text-dseza-dark-secondary-text"
      : "text-dseza-light-secondary-text";
  const accentColor =
    theme === "dark"
      ? "text-dseza-dark-primary-accent"
      : "text-dseza-light-primary-accent";
  const accentHoverColor =
    theme === "dark"
      ? "hover:text-dseza-dark-primary-accent-hover"
      : "hover:text-dseza-light-primary-accent-hover";
  const cardTitleColor = "text-white"; // Luôn là màu trắng cho dễ đọc trên ảnh nền

  // Dữ liệu card (giữ nguyên từ component gốc, có thể tùy chỉnh nếu cần cho mobile)
  const investorCards: InvestmentCard[] = [
    {
      id: "inv1",
      titleKey: "investment.investmentProcedures",
      image:
        "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=70", // Giảm chất lượng ảnh một chút
      link: "#investor-process",
    },
    {
      id: "inv2",
      titleKey: "investment.incentives",
      image:
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=70",
      link: "#investment-fields",
    },
    {
      id: "inv3",
      titleKey: "investment.services",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=70",
      link: "#zoning-plans",
    },
    {
      id: "inv4",
      titleKey: "investment.workforce",
      image:
        "https://images.unsplash.com/photo-1483058712412-4245e9b90334?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=70",
      link: "#postal-submission",
    },
    {
      id: "inv5",
      titleKey: "investment.infrastructure",
      image:
        "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=70",
      link: "#admin-procedure-lookup",
    },
    {
      id: "inv6",
      titleKey: "investment.services",
      image:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=70",
      link: "#online-services",
    },
  ];

  const environmentCards: InvestmentCard[] = [
    {
      id: "env1",
      titleKey: "investment.infrastructure",
      image:
        "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=70",
      link: "#iz-infrastructure",
    },
    {
      id: "env2",
      titleKey: "investment.infrastructure",
      image:
        "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=70",
      link: "#transport-infra",
    },
    // Thêm các card khác tương tự nếu cần
  ];

  const currentCards =
    activeTab === "investors" ? investorCards : environmentCards;

  const cardWidth = 280; // Chiều rộng card trên mobile
  const cardGap = 16; // gap-4
  const scrollAmount = cardWidth + cardGap;

  const scrollCarousel = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    const maxScrollLeft = scrollWidth - clientWidth;

    if (direction === "left") {
      if (scrollLeft <= 0) {
        carouselRef.current.scrollTo({ left: maxScrollLeft, behavior: "smooth" });
      } else {
        carouselRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      }
    } else {
      if (scrollLeft >= maxScrollLeft - 5) {
        carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  return (
    <section className={cn("py-8 px-4", sectionBg)}> {/* Giảm padding cho mobile */}
      {/* Tiêu đề section - căn trái */}
      <h2
        className={cn(
          "font-montserrat font-bold text-2xl mb-6 text-center", // text-2xl và text-left
          textColor
        )}
      >
        {t("homepage.investmentInfo")}
      </h2>

      {/* Tabs chọn loại thông tin */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex space-x-3">
            <button
            className={cn(
                "font-montserrat font-semibold text-base py-2 px-3 rounded-md transition-colors",
                activeTab === "investors"
                ? (theme === "dark" ? "bg-dseza-dark-primary text-dseza-dark-main-bg" : "bg-dseza-light-primary text-white")
                : (theme === "dark" ? "bg-dseza-dark-secondary-bg text-dseza-dark-secondary-text hover:bg-dseza-dark-hover" : "bg-dseza-light-secondary-bg text-dseza-light-secondary-text hover:bg-dseza-light-hover")
            )}
            onClick={() => setActiveTab("investors")}
            >
            {t("investment.forInvestors")}
            </button>
            <button
            className={cn(
                "font-montserrat font-semibold text-base py-2 px-3 rounded-md transition-colors",
                activeTab === "environment"
                ? (theme === "dark" ? "bg-dseza-dark-primary text-dseza-dark-main-bg" : "bg-dseza-light-primary text-white")
                : (theme === "dark" ? "bg-dseza-dark-secondary-bg text-dseza-dark-secondary-text hover:bg-dseza-dark-hover" : "bg-dseza-light-secondary-bg text-dseza-light-secondary-text hover:bg-dseza-light-hover")
            )}
            onClick={() => setActiveTab("environment")}
            >
            {t("investment.investmentEnvironment")}
            </button>
        </div>
        {/* Nút điều khiển carousel */}
        <div className="flex space-x-2">
            <button
                className={cn(
                "p-2 rounded-full transition-colors",
                secondaryTextColor,
                accentHoverColor
                )}
                onClick={() => scrollCarousel("left")}
                aria-label="Scroll left"
            >
                <ArrowLeft className="w-5 h-5" />
            </button>
            <button
                className={cn(
                "p-2 rounded-full transition-colors",
                secondaryTextColor,
                accentHoverColor
                )}
                onClick={() => scrollCarousel("right")}
                aria-label="Scroll right"
            >
                <ArrowRight className="w-5 h-5" />
            </button>
        </div>
      </div>


      {/* Carousel cards */}
      <div
        ref={carouselRef}
        className="flex overflow-x-auto scrollbar-hide gap-4 pb-4 snap-x" // scrollbar-hide cho mobile
      >
        {currentCards.map((card) => (
          <a
            key={card.id}
            href={card.link}
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-[280px] h-56 rounded-lg overflow-hidden relative flex-shrink-0 snap-start group" // Giảm chiều cao card
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
              style={{ backgroundImage: `url(${card.image})` }}
            ></div>
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors"></div> {/* Tăng độ mờ khi hover */}
            <div className="absolute bottom-0 left-0 right-0 p-3"> {/* Giảm padding card */}
              <h3
                className={cn(
                  "font-montserrat font-semibold text-md", // Giảm kích thước font title card
                  cardTitleColor
                )}
              >
                {t(card.titleKey)}
              </h3>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default MobileInvestmentInformation;