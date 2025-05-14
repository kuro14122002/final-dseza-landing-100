
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { Briefcase, FileText, SearchCheck, MessageSquare, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickAccessCard {
  text: string;
  href: string;
  icon: JSX.Element;
}

/**
 * Quick access cards component displaying important service links
 */
const QuickAccessButtons: React.FC = () => {
  const { theme } = useTheme();
  
  // Define cards data
  const cards: QuickAccessCard[] = [
    {
      text: "Dịch vụ công trực tuyến",
      href: "https://dichvucong.danang.gov.vn/web/guest/dich-vu-cong",
      icon: <Briefcase size={48} />
    },
    {
      text: "Thủ tục hành chính",
      href: "https://dichvucong.danang.gov.vn/web/guest/thu-tuc-hanh-chinh",
      icon: <FileText size={48} />
    },
    {
      text: "Công khai KQ giải quyết TTHC",
      href: "https://dichvucong.danang.gov.vn/web/guest/thu-tuc-hanh-chinh",
      icon: <SearchCheck size={48} />
    },
    {
      text: "Kênh thông tin tiếp nhận phản ánh, kiến nghị",
      href: "https://dseza.danang.gov.vn/lien-he/",
      icon: <MessageSquare size={48} />
    },
    {
      text: "Đặt lịch hẹn giao dịch trực tuyến",
      href: "http://49.156.54.87/index.php",
      icon: <Calendar size={48} />
    }
  ];
  
  // Get theme-specific styles
  const cardBg = theme === "dark" ? "bg-dseza-dark-secondary-bg" : "bg-dseza-light-secondary-bg";
  const cardText = theme === "dark" ? "text-dseza-dark-main-text" : "text-dseza-light-main-text";
  const cardHoverBg = theme === "dark" ? "hover:bg-dseza-dark-hover-bg" : "hover:bg-dseza-light-hover-bg";
  const cardBorder = theme === "dark" ? "border-dseza-dark-border" : "border-dseza-light-border";
  const iconColor = theme === "dark" ? "text-dseza-dark-primary-accent" : "text-dseza-light-primary-accent";
  
  return (
    <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-screen-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {cards.map((card, index) => (
            <a
              key={index}
              href={card.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                cardBg,
                cardText,
                cardBorder,
                cardHoverBg,
                "flex flex-col items-center justify-center",
                "h-72 rounded-xl border transition-all duration-300",
                "p-6 text-center hover:scale-103 hover:shadow-md"
              )}
            >
              <div className={cn(iconColor, "mb-6")}>
                {card.icon}
              </div>
              <span className="font-inter font-semibold text-lg line-clamp-3">
                {card.text}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickAccessButtons;
