import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { Facebook, Twitter, Linkedin, Instagram, Youtube } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Vertical social media bar component for the hero section
 */
const SocialBar: React.FC = () => {
  const { theme } = useTheme();
  
  const socialLinks = [
    { icon: <Facebook size={20} />, href: "#", label: "Facebook" },
    { icon: <Twitter size={20} />, href: "#", label: "Twitter" },
    { icon: <Linkedin size={20} />, href: "#", label: "LinkedIn" },
    { icon: <Instagram size={20} />, href: "#", label: "Instagram" },
    { icon: <Youtube size={20} />, href: "#", label: "Youtube" },
  ];
  
  return (
    <div className="fixed left-8 top-1/2 transform -translate-y-1/2 z-10 flex-col items-center space-y-5 hidden md:flex">
      <div className="h-16 w-px bg-gradient-to-b from-transparent via-dseza-light-primary/30 dark:via-dseza-dark-primary/30 to-transparent mb-2" />
      
      {socialLinks.map((social, index) => (
        <a 
          key={index}
          href={social.href} 
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.label}
          className={cn(
            "transition-all duration-300 ease-in-out text-foreground/60 hover:text-dseza-light-primary dark:hover:text-dseza-dark-primary",
            "hover:scale-110 transform"
          )}
        >
          {social.icon}
        </a>
      ))}
      
      <div className="h-16 w-px bg-gradient-to-b from-transparent via-dseza-light-primary/30 dark:via-dseza-dark-primary/30 to-transparent mt-2" />
    </div>
  );
};

export default SocialBar;
