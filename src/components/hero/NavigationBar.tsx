// src/components/hero/NavigationBar.tsx
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
    // Nếu mục menu không có megaMenuConfig, không làm gì cả (để cho phép điều hướng mặc định)
    if (!menuItems[index].megaMenuConfig) {
      setActiveMenuIndex(null); // Đảm bảo đóng bất kỳ mega menu nào đang mở
      return;
    }
    setActiveMenuIndex(activeMenuIndex === index ? null : index);
  };

  return (
    <nav ref={navRef} className="glass-nav absolute top-36 left-0 right-0 z-30">
      <div className="container mx-auto px-6">
        {/* Thay đổi ở dòng dưới: thêm class 'justify-center' */}
        <ul className="flex justify-center gap-x-8">
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
        <MegaMenu config={menuItems[activeMenuIndex].megaMenuConfig!} />
      )}
    </nav>
  );
};

export default NavigationBar;
