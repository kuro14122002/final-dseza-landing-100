
import { useRef, useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import MegaMenu from './MegaMenu';
import NavigationMenuItem from './NavigationMenuItem';
import { getNavigationMenuItems } from './navigation/menuData';
import { MenuItem } from './types/megaMenu';

const NavigationBar = () => {
  const [activeMenuIndex, setActiveMenuIndex] = useState<number | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const menuItems: MenuItem[] = getNavigationMenuItems();

  // Close the mega menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveMenuIndex(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMenuClick = (index: number) => {
    setActiveMenuIndex(activeMenuIndex === index ? null : index);
  };

  return (
    <nav ref={navRef} className="glass-nav sticky top-0 z-30">
      <div className="container mx-auto px-6">
        <ul className="flex gap-x-8">
          {menuItems.map((item, index) => (
            <NavigationMenuItem
              key={index}
              item={item}
              index={index}
              activeMenuIndex={activeMenuIndex}
              onMenuClick={handleMenuClick}
            />
          ))}
        </ul>
      </div>

      {/* Mega Menu */}
      {activeMenuIndex !== null && menuItems[activeMenuIndex].megaMenuConfig && (
        <MegaMenu config={menuItems[activeMenuIndex].megaMenuConfig} />
      )}
    </nav>
  );
};

export default NavigationBar;
