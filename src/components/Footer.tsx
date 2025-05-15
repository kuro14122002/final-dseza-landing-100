
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { MapPin, Phone, File, Mail, Facebook, Youtube, Linkedin } from "lucide-react";

/**
 * Footer component with contact information, legal details, and social media links
 */
const Footer: React.FC = () => {
  const { theme } = useTheme();
  
  // Theme-specific styles
  const bgColor = theme === "dark" ? "bg-dseza-dark-secondary-bg" : "bg-dseza-light-secondary-bg";
  const textColor = theme === "dark" ? "text-dseza-dark-main-text" : "text-dseza-light-main-text";
  const secondaryTextColor = theme === "dark" ? "text-dseza-dark-secondary-text" : "text-dseza-light-secondary-text";
  const accentColor = theme === "dark" ? "text-dseza-dark-primary-accent hover:text-dseza-dark-primary-accent-hover" : "text-dseza-light-primary-accent hover:text-dseza-light-primary-accent-hover";
  const bottomBarBgColor = theme === "dark" ? "bg-dseza-dark-hover-bg" : "bg-dseza-light-hover-bg";
  
  return (
    <footer className={cn(bgColor)}>
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Contact Information */}
          <div>
            <h3 className={cn(
              "font-montserrat font-semibold text-lg mb-4",
              textColor
            )}>
              Ban Quản lý KCNC & các KCN Đà Nẵng
            </h3>
            
            <div className="space-y-2">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                <p className={cn("font-inter text-sm", secondaryTextColor)}>
                  Địa chỉ: Lô A17, đường Trung tâm, KCNC, xã Hòa Liên, huyện Hòa Vang, Đà Nẵng
                </p>
              </div>
              
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-2 flex-shrink-0" />
                <p className={cn("font-inter text-sm", secondaryTextColor)}>
                  SĐT: 0236 3666117
                </p>
              </div>
              
              <div className="flex items-center">
                <File className="w-5 h-5 mr-2 flex-shrink-0" />
                <p className={cn("font-inter text-sm", secondaryTextColor)}>
                  Tiếp nhận hồ sơ: 0236.3666100
                </p>
              </div>
              
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-2 flex-shrink-0" />
                <p className={cn("font-inter text-sm", secondaryTextColor)}>
                  Email: dseza@danang.gov.vn
                </p>
              </div>
            </div>
          </div>
          
          {/* Column 2: Map Location */}
          <div>
            <h3 className={cn(
              "font-montserrat font-semibold text-lg mb-4",
              textColor
            )}>
              Bản đồ vị trí
            </h3>
            
            <div className={cn(
              "h-40 bg-gray-300 dark:bg-gray-700 rounded-lg flex items-center justify-center",
              secondaryTextColor
            )}>
              Google Map Embed
            </div>
          </div>
          
          {/* Column 3: Legal Information */}
          <div>
            <h3 className={cn(
              "font-montserrat font-semibold text-lg mb-4",
              textColor
            )}>
              Thông tin pháp lý
            </h3>
            
            <div className="space-y-2">
              <a href="#" className={cn("block font-inter text-sm", accentColor)}>
                Tín nhiệm mạng
              </a>
              
              <p className={cn("font-inter text-sm", secondaryTextColor)}>
                Giấy phép: Số 05/GP-STTTT do Sở TTTT Đà Nẵng cấp ngày 02/01/2020.
              </p>
              
              <p className={cn("font-inter text-sm", secondaryTextColor)}>
                Trưởng Ban biên tập: Trần Văn Tỵ, Phó Trưởng ban BQL KCNC & các KCN Đà Nẵng.
              </p>
            </div>
          </div>
          
          {/* Column 4: Citation and Connect */}
          <div>
            <h3 className={cn(
              "font-montserrat font-semibold text-lg mb-4",
              textColor
            )}>
              Trích dẫn & Kết nối
            </h3>
            
            <p className={cn("font-inter text-sm mb-4", secondaryTextColor)}>
              Ghi rõ nguồn "www.dseza.danang.gov.vn" khi trích dẫn lại thông tin.
            </p>
            
            <div className="flex space-x-4">
              <a 
                href="#" 
                aria-label="Facebook"
                className={cn("transition-colors", accentColor)}
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a 
                href="#" 
                aria-label="YouTube"
                className={cn("transition-colors", accentColor)}
              >
                <Youtube className="w-6 h-6" />
              </a>
              <a 
                href="#" 
                aria-label="LinkedIn"
                className={cn("transition-colors", accentColor)}
              >
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className={cn(
        "py-3 px-4 sm:px-6 lg:px-8",
        bottomBarBgColor
      )}>
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center text-xs">
          <p className={cn("font-inter mb-2 sm:mb-0 text-center sm:text-left", secondaryTextColor)}>
            © 2025 Bản quyền của Ban Quản lý Khu công nghệ cao và các Khu công nghiệp Đà Nẵng
          </p>
          <p className={cn("font-inter", secondaryTextColor)}>
            Số lượt truy cập: 28,734
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
