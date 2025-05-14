
import React from "react";
import HeroBackground from "./HeroBackground";
import TopBar from "./TopBar";
import LogoSearchBar from "./LogoSearchBar";
import NavigationBar from "./NavigationBar";

/**
 * Complete hero section component
 */
const HeroSection: React.FC = () => {
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
