
import { useState, useEffect, useRef } from 'react';

export const useNavigation = () => {
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close mega menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node)) {
        setActiveMegaMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle mega menu
  const handleMenuClick = (menuId: string) => {
    if (activeMegaMenu === menuId) {
      setActiveMegaMenu(null);
    } else {
      setActiveMegaMenu(menuId);
    }
  };

  // Close mega menu
  const closeMegaMenu = () => {
    setActiveMegaMenu(null);
  };

  return {
    activeMegaMenu,
    megaMenuRef,
    handleMenuClick,
    closeMegaMenu
  };
};
