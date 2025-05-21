import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { Briefcase, FileText, SearchCheck, MessageSquare, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/utils/translations";

interface QuickAccessCard {
  textKey: string;
  href: string;
  icon: JSX.Element;
}

/**
 * Quick access cards component displaying important service links
 */
const QuickAccessButtons: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  
  // Define cards data
  const cards: QuickAccessCard[] = [
    {
      textKey: "quickAccess.onlinePublicService",
      href: "https://dichvucong.danang.gov.vn/web/guest/dich-vu-cong",
      icon: <Briefcase size={48} />
    },
    {
      textKey: "quickAccess.administrativeProcedures",
      href: "https://dichvucong.danang.gov.vn/web/guest/thu-tuc-hanh-chinh",
      icon: <FileText size={48} />
    },
    {
      textKey: "quickAccess.publicResults",
      href: "https://dichvucong.danang.gov.vn/web/guest/thu-tuc-hanh-chinh",
      icon: <SearchCheck size={48} />
    },
    {
      textKey: "quickAccess.feedbackChannel",
      href: "https://dseza.danang.gov.vn/lien-he/",
      icon: <MessageSquare size={48} />
    },
    {
      textKey: "quickAccess.appointmentScheduling",
      href: "http://49.156.54.87/index.php",
      icon: <Calendar size={48} />
    }
  ];
  
  // Get theme-specific styles
  const cardBg = theme === "dark" ? "bg-dseza-dark-secondary-bg" : "bg-dseza-light-secondary-bg";
  const cardText = theme === "dark" ? "text-dseza-dark-main-text" : "text-dseza-light-main-text";
  // const cardHoverBg = theme === "dark" ? "hover:bg-dseza-dark-hover-bg" : "hover:bg-dseza-light-hover-bg"; // Removed, will use new hover below
  const cardBorder = theme === "dark" ? "border-dseza-dark-border" : "border-dseza-light-border";
  const iconColor = theme === "dark" ? "text-dseza-dark-primary-accent" : "text-dseza-light-primary-accent";

  // New hover styles
  const cardHoverBgAccent = theme === "dark" ? "hover:bg-dseza-dark-primary-accent/10" : "hover:bg-dseza-light-primary-accent/10";
  const cardHoverBorderAccent = theme === "dark" ? "hover:border-dseza-dark-primary-accent" : "hover:border-dseza-light-primary-accent";
  const iconHoverColor = theme === "dark" ? "group-hover:text-dseza-dark-primary-accent-hover" : "group-hover:text-dseza-light-primary-accent-hover";
  const textHoverColor = theme === "dark" ? "group-hover:text-dseza-dark-primary-accent" : "group-hover:text-dseza-light-primary-accent";
  
  return (
    <section className={cn(
      "py-12 md:py-16 px-4 sm:px-6 lg:px-8",
      theme === "dark" ? "bg-[#1D262E]" : "bg-[#FFFFFF]"
    )}>
      <div className="container mx-auto max-w-screen-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {cards.map((card, index) => (
            <a
              key={index}
              href={card.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "group", // Added group class
                cardBg,
                cardText,
                cardBorder,
                cardHoverBgAccent, // Use new hover background
                cardHoverBorderAccent, // Use new hover border
                "flex flex-col items-center justify-center",
                "h-72 rounded-xl border transition-all duration-300 ease-in-out", // Added ease-in-out
                "p-6 text-center hover:scale-103 hover:shadow-xl" // Increased shadow on hover
              )}
            >
              <div className={cn(
                iconColor,
                iconHoverColor, // Icon hover color
                "mb-6 transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:-translate-y-1" // Icon animation
              )}>
                {card.icon}
              </div>
              <span className={cn(
                "font-inter font-semibold text-lg line-clamp-3 transition-colors duration-300", // Added transition-colors
                textHoverColor // Text hover color
              )}>
                {t(card.textKey)}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickAccessButtons;