
// src/components/hero/NavigationBar.tsx
import React, { useRef, useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import MegaMenu from './MegaMenu';
import NavigationMenuItem from './NavigationMenuItem';
import { getNavigationMenuItems } from './navigation/menuData';
import { MenuItem as NavigationMenuItemType } from './types/megaMenu';
import { useLanguage } from '@/context/LanguageContext';

const TOP_BAR_HEIGHT_STRING = "3rem"; 
const INITIAL_NAV_TOP_STRING = "9rem";
const SCROLL_THRESHOLD_PX = 96; 

const NavigationBar: React.FC = () => {
  const [activeMenuIndex, setActiveMenuIndex] = useState<number | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const menuItems: NavigationMenuItemType[] = getNavigationMenuItems();
  const [isSticky, setIsSticky] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsSticky(offset > SCROLL_THRESHOLD_PX);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
    if (!menuItems[index].megaMenuConfig) {
      setActiveMenuIndex(null);
    } else {
      setActiveMenuIndex(activeMenuIndex === index ? null : index);
    }
  };

  // Sử dụng các lớp glass đã chuẩn hóa
  const navClasses = isSticky ? "glass-sticky" : "glass-initial";

  return (
    <nav
      ref={navRef}
      className={cn(
        "left-0 right-0 z-30", // Bỏ các lớp transition vì đã có trong .glass-base
        navClasses,
        isSticky ? `fixed` : `absolute`
      )}
      style={{
        top: isSticky ? TOP_BAR_HEIGHT_STRING : INITIAL_NAV_TOP_STRING,
      }}
    >
      <div className="container mx-auto px-6">
        <ul className="flex justify-center gap-x-8">
          {menuItems.map((item, index) => (
            <NavigationMenuItem
              key={index}
              item={item}
              index={index}
              activeMenuIndex={activeMenuIndex}
              onMenuClick={handleMenuClick}
              currentLanguage={language}
            />
          ))}
        </ul>
      </div>

      {activeMenuIndex !== null && menuItems[activeMenuIndex].megaMenuConfig && (
        // MegaMenu sẽ kế thừa hiệu ứng glass từ navClasses của NavigationBar
        // Chỉ cần thêm style riêng cho MegaMenu nếu muốn (ví dụ: shadow)
        <MegaMenu config={menuItems[activeMenuIndex].megaMenuConfig!} currentLanguage={language} />
      )}
    </nav>
  );
};

export default NavigationBar;
