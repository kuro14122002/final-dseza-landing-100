
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { Facebook, Twitter, Linkedin, Instagram, Youtube } from "lucide-react";

/**
 * Vertical social media bar component for the hero section
 */
const SocialBar: React.FC = () => {
  const { theme } = useTheme();
  
  const iconColor = theme === "dark" ? "#FFFFFF" : "#000000";
  const hoverColor = theme === "dark" ? "#66FFEB" : "#5A8C3E";
  
  const socialLinks = [
    { icon: <Facebook size={24} />, href: "#" },
    { icon: <Twitter size={24} />, href: "#" },
    { icon: <Linkedin size={24} />, href: "#" },
    { icon: <Instagram size={24} />, href: "#" },
    { icon: <Youtube size={24} />, href: "#" },
  ];
  
  return (
    <div className="absolute left-8 top-1/2 transform -translate-y-1/2 z-10 flex flex-col items-center space-y-5">
      {socialLinks.map((social, index) => (
        <a 
          key={index}
          href={social.href} 
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors duration-300 ease-in-out hover:text-dseza-dark-primary-accent-hover dark:hover:text-dseza-dark-primary-accent-hover"
          style={{ color: iconColor }}
          onMouseOver={(e) => (e.currentTarget.style.color = hoverColor)}
          onMouseOut={(e) => (e.currentTarget.style.color = iconColor)}
        >
          {social.icon}
        </a>
      ))}
    </div>
  );
};

export default SocialBar;
