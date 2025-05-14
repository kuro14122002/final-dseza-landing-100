
import React from "react";
import { useNavigation } from "./hooks/useNavigation";
import { menuItems } from "./data/menuItems";
import MegaMenu from "./MegaMenu";
import NavigationMenu from "./NavigationMenu";

/**
 * Navigation bar component with mega menus
 */
const NavigationBar: React.FC = () => {
  const { activeMegaMenu, megaMenuRef, handleMenuClick } = useNavigation();

  // Find active menu item
  const activeMenuItem = menuItems.find(item => item.id === activeMegaMenu);

  return (
    <div ref={megaMenuRef} className="absolute top-36 left-0 right-0 z-10">
      {/* Main Navigation */}
      <NavigationMenu 
        menuItems={menuItems}
        activeMegaMenu={activeMegaMenu}
        onMenuClick={handleMenuClick}
      />

      {/* Mega Menu */}
      {activeMegaMenu && activeMenuItem && activeMenuItem.config && (
        <div className="animate-fade-in">
          <MegaMenu config={activeMenuItem.config} />
        </div>
      )}
    </div>
  );
};

export default NavigationBar;
