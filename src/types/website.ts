export interface WebsiteComponent {
  id: string;
  type: 'hero' | 'card' | 'form' | 'cta' | 'testimonial' | 'gallery' | 'text' | 'image';
  props: Record<string, any>;
  children?: WebsiteComponent[];
  styles?: Record<string, any>;
}

export interface WebsitePage {
  id: string;
  slug: string;
  title: string;
  description?: string;
  components: WebsiteComponent[];
  seo?: {
    title: string;
    description: string;
    keywords: string[];
    og_image?: string;
  };
  is_published: boolean;
}

export interface Website {
  id: string;
  project_id: string;
  user_id: string;
  name: string;
  description?: string;
  domain?: string;
  custom_domain?: string;
  theme: {
    colors: Record<string, string>;
    fonts: Record<string, string>;
    spacing: Record<string, string>;
  };
  pages: WebsitePage[];
  published_at?: string;
  created_at: string;
  updated_at: string;
  version: number;
}

export interface WebsiteTemplate {
  id: string;
  name: string;
  description: string;
  category: 'business' | 'portfolio' | 'ecommerce' | 'blog' | 'saas';
  thumbnail: string;
  pages: WebsitePage[];
  theme: Website['theme'];
  rating: number;
  downloads: number;
}

export interface WebsiteVersion {
  id: string;
  website_id: string;
  version_number: number;
  snapshot: Website;
  created_at: string;
  created_by: string;
}
