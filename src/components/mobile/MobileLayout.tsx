
import React from "react";
import MobileHeader from "./MobileHeader";
import MobileHero from "./MobileHero";
import { useIsMobile } from "@/hooks/use-mobile";

interface MobileLayoutProps {
  children?: React.ReactNode;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  
  // Only render mobile components if on mobile device
  if (!isMobile) {
    return <>{children}</>;
  }
  
  return (
    <div className="min-h-screen">
      <MobileHeader />
      <MobileHero />
      {children}
    </div>
  );
};

export default MobileLayout;
