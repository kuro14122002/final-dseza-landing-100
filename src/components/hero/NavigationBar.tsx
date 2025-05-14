// src/components/hero/NavigationBar.tsx
import React, { useRef, useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import MegaMenu from './MegaMenu';
import NavigationMenuItem from './NavigationMenuItem';
import { getNavigationMenuItems } from './navigation/menuData';
import { MenuItem as NavigationMenuItemType } from './types/megaMenu'; // Đổi tên import để tránh xung đột

// Ước tính chiều cao của TopBar. Tailwind h-12 là 3rem.
// Đảm bảo giá trị này khớp với chiều cao thực tế của TopBar.
const TOP_BAR_HEIGHT_STRING = "3rem"; // Ví dụ: "48px" hoặc "3rem"

// Vị trí top ban đầu của NavigationBar (ví dụ: top-36 là 9rem)
const INITIAL_NAV_TOP_STRING = "9rem";

// Ngưỡng cuộn để NavigationBar trở nên sticky.
// Đây là khoảng cách từ đỉnh mà khi cuộn qua, NavigationBar sẽ dính lại.
// Ví dụ: chiều cao của LogoSearchBar (h-24 ~ 6rem) + vị trí top của nó (top-12 ~ 3rem) = 9rem
// Hoặc một giá trị pixel cụ thể hơn sau khi đo đạc.
const SCROLL_THRESHOLD_PX = 96; // Ví dụ: (6rem + 3rem) * 16px/rem (nếu 1rem = 16px)
// Hoặc bạn có thể đặt một giá trị mà bạn thấy hợp lý, ví dụ: 100px

const NavigationBar: React.FC = () => {
  const [activeMenuIndex, setActiveMenuIndex] = useState<number | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const menuItems: NavigationMenuItemType[] = getNavigationMenuItems();

  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > SCROLL_THRESHOLD_PX) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
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
      // Cho phép điều hướng nếu không có megaMenuConfig
      // (Hành vi này đã đúng, không cần return sớm nếu mục đó là link)
    } else {
      // Nếu có megaMenuConfig, toggle menu
      setActiveMenuIndex(activeMenuIndex === index ? null : index);
    }
  };

  // Chọn class glassmorphism dựa trên trạng thái isSticky
  const navClasses = isSticky ? "glass-nav-sticky" : "glass-nav-initial";

  return (
    <nav
      ref={navRef}
      className={cn(
        "left-0 right-0 z-30 transition-all duration-300 ease-in-out",
        navClasses, // Áp dụng style glass động
        isSticky
          ? `fixed` // Khi sticky, top sẽ được set bên dưới
          : `absolute` // Vị trí ban đầu
      )}
      style={{
        top: isSticky ? TOP_BAR_HEIGHT_STRING : INITIAL_NAV_TOP_STRING,
      }}
    >
      <div className="container mx-auto px-6">
        {/* Điều chỉnh màu chữ cho các mục menu nếu cần, tương tự như TopBar.
          Các lớp glass-nav-initial/sticky có thể đã bao gồm màu chữ phù hợp.
          Nếu không, bạn cần thêm logic đổi màu chữ cho NavigationMenuItem.
        */}
        <ul className="flex justify-center gap-x-8">
          {menuItems.map((item, index) => (
            <NavigationMenuItem
              key={index}
              item={item}
              index={index}
              activeMenuIndex={activeMenuIndex}
              onMenuClick={handleMenuClick}
              // Bạn có thể truyền isSticky xuống đây nếu NavigationMenuItem cần thay đổi style chữ
              // isSticky={isSticky}
            />
          ))}
        </ul>
      </div>

      {activeMenuIndex !== null && menuItems[activeMenuIndex].megaMenuConfig && (
        // MegaMenu cũng nên sử dụng style glass tương ứng
        // Hiện tại, MegaMenu đã được cấu hình để có style glass riêng,
        // bạn có thể muốn nó đồng bộ hoàn toàn với navClasses ở đây.
        <MegaMenu config={menuItems[activeMenuIndex].megaMenuConfig!} />
      )}
    </nav>
  );
};

export default NavigationBar;