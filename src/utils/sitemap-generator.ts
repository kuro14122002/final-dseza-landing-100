import { getNavigationMenuItems } from '@/components/hero/navigation/menuData';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  alternateUrls?: {
    vi: string;
    en: string;
  };
}

class SitemapGenerator {
  private baseUrl: string;
  private urls: SitemapUrl[] = [];

  constructor(baseUrl: string = 'https://dseza.danang.gov.vn') {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
  }

  // Add static routes
  addStaticRoutes(): void {
    const staticRoutes: SitemapUrl[] = [
      {
        loc: `${this.baseUrl}/`,
        changefreq: 'daily',
        priority: 1.0,
        lastmod: new Date().toISOString().split('T')[0],
        alternateUrls: {
          vi: `${this.baseUrl}/`,
          en: `${this.baseUrl}/en`,
        }
      },
      {
        loc: `${this.baseUrl}/sitemap`,
        changefreq: 'monthly',
        priority: 0.3,
        alternateUrls: {
          vi: `${this.baseUrl}/sitemap`,
          en: `${this.baseUrl}/en/sitemap`,
        }
      },
      {
        loc: `${this.baseUrl}/events`,
        changefreq: 'weekly',
        priority: 0.8,
        alternateUrls: {
          vi: `${this.baseUrl}/events`,
          en: `${this.baseUrl}/en/events`,
        }
      },
      {
        loc: `${this.baseUrl}/search`,
        changefreq: 'never',
        priority: 0.1,
      },
      // Introduction pages
      {
        loc: `${this.baseUrl}/gioi-thieu/thu-ngo`,
        changefreq: 'yearly',
        priority: 0.6,
        alternateUrls: {
          vi: `${this.baseUrl}/gioi-thieu/thu-ngo`,
          en: `${this.baseUrl}/en/introduction/welcome-letter`,
        }
      },
      {
        loc: `${this.baseUrl}/gioi-thieu/tong-quan-ve-da-nang`,
        changefreq: 'yearly',
        priority: 0.6,
        alternateUrls: {
          vi: `${this.baseUrl}/gioi-thieu/tong-quan-ve-da-nang`,
          en: `${this.baseUrl}/en/introduction/danang-overview`,
        }
      },
      {
        loc: `${this.baseUrl}/tong-quan-ban-quan-ly/chuc-nang-nhiem-vu`,
        changefreq: 'yearly',
        priority: 0.7,
        alternateUrls: {
          vi: `${this.baseUrl}/tong-quan-ban-quan-ly/chuc-nang-nhiem-vu`,
          en: `${this.baseUrl}/en/organization-overview/functions-duties`,
        }
      },
      {
        loc: `${this.baseUrl}/tong-quan-ban-quan-ly/cac-phong-ban`,
        changefreq: 'yearly',
        priority: 0.6,
        alternateUrls: {
          vi: `${this.baseUrl}/tong-quan-ban-quan-ly/cac-phong-ban`,
          en: `${this.baseUrl}/en/organization-overview/departments`,
        }
      },
      {
        loc: `${this.baseUrl}/tong-quan-ban-quan-ly/don-vi-truc-thuoc`,
        changefreq: 'yearly',
        priority: 0.6,
        alternateUrls: {
          vi: `${this.baseUrl}/tong-quan-ban-quan-ly/don-vi-truc-thuoc`,
          en: `${this.baseUrl}/en/organization-overview/affiliated-units`,
        }
      },
      {
        loc: `${this.baseUrl}/cam-nang-dau-tu`,
        changefreq: 'monthly',
        priority: 0.9,
        alternateUrls: {
          vi: `${this.baseUrl}/cam-nang-dau-tu`,
          en: `${this.baseUrl}/en/investment-guide`,
        }
      },
      {
        loc: `${this.baseUrl}/cam-nang-dau-tu/chinh-sach-uu-dai`,
        changefreq: 'monthly',
        priority: 0.9,
        alternateUrls: {
          vi: `${this.baseUrl}/cam-nang-dau-tu/chinh-sach-uu-dai`,
          en: `${this.baseUrl}/en/investment-guide/investment-policy`,
        }
      },
      {
        loc: `${this.baseUrl}/cam-nang-dau-tu/brochure`,
        changefreq: 'monthly',
        priority: 0.7,
        alternateUrls: {
          vi: `${this.baseUrl}/cam-nang-dau-tu/brochure`,
          en: `${this.baseUrl}/en/investment-guide/brochure`,
        }
      },
    ];

    this.urls.push(...staticRoutes);
  }

  // Add dynamic news URLs (this would typically fetch from API)
  async addNewsUrls(): Promise<void> {
    try {
      // In a real implementation, this would fetch from your news API
      const newsResponse = await fetch(`${this.baseUrl}/api/news`);
      if (newsResponse.ok) {
        const newsData = await newsResponse.json();
        
        if (newsData.success && newsData.data) {
          newsData.data.forEach((article: any) => {
            this.urls.push({
              loc: `${this.baseUrl}/news/${article.slug}`,
              lastmod: article.updated_at || article.created_at,
              changefreq: 'monthly',
              priority: 0.6,
              alternateUrls: {
                vi: `${this.baseUrl}/news/${article.slug}`,
                en: `${this.baseUrl}/en/news/${article.slug}`,
              }
            });
          });
        }
      }
    } catch (error) {
      console.warn('Failed to fetch news for sitemap:', error);
    }

    // Add news category pages
    try {
      const categoriesResponse = await fetch(`${this.baseUrl}/api/categories`);
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        
        if (categoriesData.success && categoriesData.data) {
          categoriesData.data.forEach((category: any) => {
            this.urls.push({
              loc: `${this.baseUrl}/news/category/${category.slug}`,
              changefreq: 'weekly',
              priority: 0.7,
              alternateUrls: {
                vi: `${this.baseUrl}/news/category/${category.slug}`,
                en: `${this.baseUrl}/en/news/category/${category.slug}`,
              }
            });
          });
        }
      }
    } catch (error) {
      console.warn('Failed to fetch categories for sitemap:', error);
    }
  }

  // Add dynamic event URLs
  async addEventUrls(): Promise<void> {
    try {
      const eventsResponse = await fetch(`${this.baseUrl}/api/events`);
      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json();
        
        if (eventsData.success && eventsData.data) {
          eventsData.data.forEach((event: any) => {
            this.urls.push({
              loc: `${this.baseUrl}/events/${event.slug}`,
              lastmod: event.updated_at || event.created_at,
              changefreq: 'weekly',
              priority: 0.7,
              alternateUrls: {
                vi: `${this.baseUrl}/events/${event.slug}`,
                en: `${this.baseUrl}/en/events/${event.slug}`,
              }
            });
          });
        }
      }
    } catch (error) {
      console.warn('Failed to fetch events for sitemap:', error);
    }
  }

  // Add menu-based URLs
  addMenuUrls(): void {
    const menuItems = getNavigationMenuItems();
    
    const processMenuItem = (item: any, parentPath: string = '') => {
      if (item.url && item.url !== '#' && !item.url.startsWith('http')) {
        this.urls.push({
          loc: `${this.baseUrl}${item.url}`,
          changefreq: 'monthly',
          priority: 0.6,
        });
      }

      if (item.megaMenuConfig?.columns) {
        item.megaMenuConfig.columns.forEach((column: any) => {
          if (column.contents) {
            column.contents.forEach((content: any) => {
              if (content.url && content.url !== '#' && !content.url.startsWith('http')) {
                this.urls.push({
                  loc: `${this.baseUrl}${content.url}`,
                  changefreq: 'monthly',
                  priority: 0.5,
                });
              }

              if (content.items) {
                content.items.forEach((subItem: any) => {
                  if (subItem.url && subItem.url !== '#' && !subItem.url.startsWith('http')) {
                    this.urls.push({
                      loc: `${this.baseUrl}${subItem.url}`,
                      changefreq: 'monthly',
                      priority: 0.4,
                    });
                  }
                });
              }
            });
          }
        });
      }
    };

    menuItems.forEach((item) => processMenuItem(item));
  }

  // Remove duplicate URLs
  removeDuplicates(): void {
    const uniqueUrls = new Map();
    
    this.urls.forEach(url => {
      const key = url.loc;
      if (!uniqueUrls.has(key) || (uniqueUrls.get(key).priority < url.priority)) {
        uniqueUrls.set(key, url);
      }
    });

    this.urls = Array.from(uniqueUrls.values());
  }

  // Generate XML sitemap
  generateXML(): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

    this.urls.forEach(url => {
      xml += '  <url>\n';
      xml += `    <loc>${url.loc}</loc>\n`;
      
      if (url.lastmod) {
        xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
      }
      
      if (url.changefreq) {
        xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
      }
      
      if (url.priority !== undefined) {
        xml += `    <priority>${url.priority.toFixed(1)}</priority>\n`;
      }

      // Add alternate language links
      if (url.alternateUrls) {
        Object.entries(url.alternateUrls).forEach(([lang, altUrl]) => {
          xml += `    <xhtml:link rel="alternate" hreflang="${lang}" href="${altUrl}" />\n`;
        });
      }

      xml += '  </url>\n';
    });

    xml += '</urlset>\n';
    return xml;
  }

  // Generate complete sitemap
  async generate(): Promise<string> {
    this.urls = []; // Reset URLs
    
    this.addStaticRoutes();
    this.addMenuUrls();
    await this.addNewsUrls();
    await this.addEventUrls();
    this.removeDuplicates();
    
    // Sort by priority (descending) and then by URL
    this.urls.sort((a, b) => {
      if (a.priority !== b.priority) {
        return (b.priority || 0) - (a.priority || 0);
      }
      return a.loc.localeCompare(b.loc);
    });

    return this.generateXML();
  }

  // Get URLs for sitemap page
  getUrls(): SitemapUrl[] {
    return this.urls;
  }
}

export default SitemapGenerator;
export type { SitemapUrl }; 