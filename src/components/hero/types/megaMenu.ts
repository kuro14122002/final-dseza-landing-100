export type MegaMenuContentType = {
  title: string;
  titleEn?: string;
  url?: string;
  iconName?: string;
  items?: {
    title: string;
    titleEn?: string;
    url: string;
    subItems?: { 
      title: string; 
      titleEn?: string;
      url: string 
    }[];
  }[];
};

export type MegaMenuColumnType = {
  title: string;
  titleEn?: string;
  contents: MegaMenuContentType[];
  specialContent?: React.ReactNode;
};

export type MegaMenuConfigType = {
  columns: MegaMenuColumnType[];
  featuredContent?: React.ReactNode;
};

export type MenuItem = {
  title: string;
  titleEn?: string;
  translatable?: boolean;
  url: string;
  megaMenuConfig?: MegaMenuConfigType;
};
