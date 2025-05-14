
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { Briefcase, Archive, CheckCircle, MessageSquare, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickAccessButton {
  text: string;
  href: string;
  icon: JSX.Element;
}

/**
 * Quick access buttons component displaying important links
 */
const QuickAccessButtons: React.FC = () => {
  const { theme } = useTheme();
  
  // Define buttons data
  const buttons: QuickAccessButton[] = [
    {
      text: "Dịch vụ công trực tuyến",
      href: "https://dichvucong.danang.gov.vn/web/guest/dich-vu-cong",
      icon: <Briefcase size={18} />
    },
    {
      text: "Thủ tục hành chính",
      href: "https://dichvucong.danang.gov.vn/web/guest/thu-tuc-hanh-chinh",
      icon: <Archive size={18} />
    },
    {
      text: "Công khai KQ giải quyết TTHC",
      href: "https://dichvucong.danang.gov.vn/web/guest/thu-tuc-hanh-chinh",
      icon: <CheckCircle size={18} />
    },
    {
      text: "Kênh thông tin tiếp nhận phản ánh, kiến nghị",
      href: "https://dseza.danang.gov.vn/lien-he/",
      icon: <MessageSquare size={18} />
    },
    {
      text: "Đặt lịch hẹn giao dịch trực tuyến",
      href: "http://49.156.54.87/index.php",
      icon: <Calendar size={18} />
    }
  ];
  
  // Get theme-specific styles
  const buttonBgColor = theme === "dark" ? "bg-dseza-dark-secondary-bg" : "bg-dseza-light-secondary-bg";
  const buttonTextColor = theme === "dark" ? "text-dseza-dark-main-text" : "text-dseza-light-main-text";
  const buttonHoverBg = theme === "dark" ? "hover:bg-dseza-dark-primary-accent" : "hover:bg-dseza-light-primary-accent";
  const buttonHoverText = theme === "dark" ? "hover:text-dseza-dark-main-bg" : "hover:text-white";
  const buttonBorder = theme === "dark" ? "border-dseza-dark-border" : "border-dseza-light-border";
  
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {buttons.map((button, index) => (
            <a
              key={index}
              href={button.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonBgColor,
                buttonTextColor,
                buttonBorder,
                buttonHoverBg,
                buttonHoverText,
                "flex items-center px-6 py-3 rounded-lg border transition-colors duration-300",
                "text-sm md:text-base font-medium whitespace-nowrap"
              )}
            >
              <span className="mr-2">{button.icon}</span>
              <span>{button.text}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickAccessButtons;
