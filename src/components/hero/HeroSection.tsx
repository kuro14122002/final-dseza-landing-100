
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import HeroBackground from "./HeroBackground";
import TopBar from "./TopBar";
import LogoSearchBar from "./LogoSearchBar";
import NavigationBar from "./NavigationBar";

/**
 * Complete hero section component
 */
const HeroSection: React.FC = () => {
  const isMobile = useIsMobile();
  
  // Don't render desktop hero on mobile
  if (isMobile) {
    return null;
  }
  
  return (
    <section className="relative h-screen w-screen overflow-hidden">
      <HeroBackground />
      <TopBar />
      <LogoSearchBar />
      <NavigationBar />
    </section>
  );
};

export default HeroSection;
