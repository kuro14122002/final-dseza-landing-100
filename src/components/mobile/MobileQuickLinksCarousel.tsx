import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { 
  Briefcase, 
  FileText, 
  CheckSquare, // Assuming SearchCheck was a typo and CheckSquare is intended, or use SearchCheck if available
  MessageSquare, 
  Calendar 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/utils/translations";

interface QuickLinkCardProps {
  icon: React.ReactNode;
  text: string;
  href: string;
}

/**
 * Mobile-specific quick links carousel component
 */
const MobileQuickLinksCarousel: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  
  // Define the quick link cards data
  const quickLinks: QuickLinkCardProps[] = [
    {
      icon: <Briefcase size={40} />, // Adjusted size for mobile
      text: t("quickAccess.onlinePublicService") || "Dịch vụ công trực tuyến",
      href: "https://dichvucong.danang.gov.vn/web/guest/dich-vu-cong"
    },
    {
      icon: <FileText size={40} />,
      text: t("quickAccess.administrativeProcedures") || "Thủ tục hành chính",
      href: "https://dichvucong.danang.gov.vn/web/guest/thu-tuc-hanh-chinh"
    },
    {
      icon: <CheckSquare size={40} />, // Using CheckSquare as in original mobile code
      text: t("quickAccess.publicResults") || "Công khai KQ giải quyết TTHC",
      href: "https://dichvucong.danang.gov.vn/web/guest/thu-tuc-hanh-chinh"
    },
    {
      icon: <MessageSquare size={40} />,
      text: t("quickAccess.feedbackChannel") || "Tiếp nhận phản ánh, kiến nghị",
      href: "https://dseza.danang.gov.vn/lien-he/"
    },
    {
      icon: <Calendar size={40} />,
      text: t("quickAccess.appointmentScheduling") || "Đặt lịch hẹn giao dịch",
      href: "http://49.156.54.87/index.php"
    }
  ];
  
  // Get theme-specific styles
  const sectionBg = theme === "dark" ? "bg-[#1E272F]" : "bg-white";
  const titleText = theme === "dark" ? "text-white" : "text-black"; // Kept for potential future use of title
  // const cardBg = theme === "dark" ? "bg-[#2C3640]" : "bg-[#F2F2F2]"; // Original
  // const cardHoverBg = theme === "dark" ? "hover:bg-[#3A4750]" : "hover:bg-[#E9E9E9]"; // Original
  const iconColor = theme === "dark" ? "text-[#19DBCF]" : "text-[#416628]";
  const textColor = theme === "dark" ? "text-white" : "text-black";
  const shadowStyle = theme === "dark" ? "shadow-md shadow-black/30" : "shadow-md";
  const hoverShadow = theme === "dark" ? "hover:shadow-xl hover:shadow-black/40" : "hover:shadow-xl";

  // New hover styles based on proposal
  const cardBaseBg = theme === "dark" ? "bg-dseza-dark-secondary-bg" : "bg-dseza-light-secondary-bg";
  const cardHoverBgAccent = theme === "dark" ? "hover:bg-dseza-dark-primary-accent/10" : "hover:bg-dseza-light-primary-accent/10";
  const cardHoverBorderAccent = theme === "dark" ? "hover:border-dseza-dark-primary-accent" : "hover:border-dseza-light-primary-accent";
  const iconHoverColor = theme === "dark" ? "group-hover:text-dseza-dark-primary-accent-hover" : "group-hover:text-dseza-light-primary-accent-hover";
  const textHoverColor = theme === "dark" ? "group-hover:text-dseza-dark-primary-accent" : "group-hover:text-dseza-light-primary-accent";
  const cardBaseBorder = theme === "dark" ? "border-dseza-dark-border" : "border-dseza-light-border";

  return (
    <section className={cn(sectionBg, "py-8 px-0 w-full")} aria-label="Quick access links">
      {/* Section title is now hidden in mobile version */}
      
      {/* Scrollable carousel container */}
      <div className="scrollbar-hide px-4 flex overflow-x-auto space-x-3 pb-4" 
        role="region" 
        aria-label="Scrollable quick access links">
        {quickLinks.map((link, index) => (
          <a
            key={index}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "group", // Added group class
              cardBaseBg,
              shadowStyle,
              cardHoverBgAccent, // Applied new hover background
              cardHoverBorderAccent, // Applied new hover border
              cardBaseBorder, // Base border
              "w-[140px] h-[160px] flex-shrink-0",
              "flex flex-col justify-center items-center text-center",
              "rounded-xl p-4 border", // Ensure border is applied for hover to take effect
              "cursor-pointer transition-all duration-300 ease-in-out",
              "hover:scale-105 active:scale-102", // Kept existing scale and active effects
              hoverShadow // Kept existing hover shadow
            )}
            aria-label={link.text}
          >
            <div className={cn(
              iconColor,
              iconHoverColor, // Icon hover color
              "mb-2.5 transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:-translate-y-1" // Icon animation
            )}>
              {link.icon}
            </div>
            <span className={cn(
              textColor,
              textHoverColor, // Text hover color
              "font-inter font-medium text-sm leading-snug transition-colors duration-300" // Added transition-colors
            )}>
              {link.text}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
};

export default MobileQuickLinksCarousel;