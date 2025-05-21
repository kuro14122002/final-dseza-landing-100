
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { 
  Briefcase, 
  FileText, 
  CheckSquare, 
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
      icon: <Briefcase size={40} />,
      text: t("quickAccess.onlinePublicService") || "Dịch vụ công trực tuyến",
      href: "https://dichvucong.danang.gov.vn/web/guest/dich-vu-cong"
    },
    {
      icon: <FileText size={40} />,
      text: t("quickAccess.administrativeProcedures") || "Thủ tục hành chính",
      href: "https://dichvucong.danang.gov.vn/web/guest/thu-tuc-hanh-chinh"
    },
    {
      icon: <CheckSquare size={40} />,
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
  const titleText = theme === "dark" ? "text-white" : "text-black";
  const cardBg = theme === "dark" ? "bg-[#2C3640]" : "bg-[#F2F2F2]";
  const cardHoverBg = theme === "dark" ? "hover:bg-[#3A4750]" : "hover:bg-[#E9E9E9]";
  const iconColor = theme === "dark" ? "text-[#19DBCF]" : "text-[#416628]";
  const textColor = theme === "dark" ? "text-white" : "text-black";
  const shadowStyle = theme === "dark" ? "shadow-md shadow-black/30" : "shadow-md";
  const hoverShadow = theme === "dark" ? "hover:shadow-xl hover:shadow-black/40" : "hover:shadow-xl";
  
  return (
    <section className={cn(sectionBg, "py-8 px-0 w-full")} aria-label="Quick access links">
      <h2 className={cn(
        titleText,
        "font-montserrat font-semibold text-xl text-left mx-4 mb-5"
      )}>
        {t("quickAccess.sectionTitle") || "TIỆN ÍCH TRUY CẬP NHANH"}
      </h2>
      
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
              cardBg,
              shadowStyle,
              cardHoverBg,
              hoverShadow,
              "w-[140px] h-[160px] flex-shrink-0",
              "flex flex-col justify-center items-center text-center",
              "rounded-xl p-4 border border-transparent",
              "cursor-pointer transition-all duration-300 ease-in-out",
              "hover:scale-105 active:scale-102"
            )}
            aria-label={link.text}
          >
            <div className={cn(iconColor, "mb-2.5")}>
              {link.icon}
            </div>
            <span className={cn(
              textColor,
              "font-inter font-medium text-sm leading-snug"
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
