
// Cập nhật các type để thêm khóa dịch

export interface MenuItem {
  title: string;
  url: string;
  translationKey?: string; // Thêm khóa dịch
  megaMenuConfig?: MegaMenuConfig;
}

export interface MegaMenuConfig {
  columns: MegaMenuColumn[];
  featuredContent?: React.ReactNode;
}

export interface MegaMenuColumn {
  title: string;
  translationKey?: string; // Thêm khóa dịch
  contents: MegaMenuContent[];
  specialContent?: React.ReactNode;
}

export interface MegaMenuContent {
  title: string;
  translationKey?: string; // Thêm khóa dịch
  url?: string;
  iconName?: string;
  items?: MegaMenuSubItem[];
}

export interface MegaMenuSubItem {
  title: string;
  translationKey?: string; // Thêm khóa dịch
  url: string;
  subItems?: MegaMenuNestedItem[];
}

export interface MegaMenuNestedItem {
  title: string;
  translationKey?: string; // Thêm khóa dịch
  url: string;
}
