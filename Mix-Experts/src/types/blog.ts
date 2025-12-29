export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  date: string;
  author: {
    name: string;
    picture: string;
  };
  category: string;
  tags?: string[];
  content: string; // Markdown content
  readingTime?: string;
};

export type BlogCategory = {
  slug: string;
  name: string;
  description: string;
  coverImage?: string;
};

export const BLOG_CATEGORIES: BlogCategory[] = [
  {
    slug: 'mixing',
    name: 'Mixing Techniques',
    description: 'Professional guides to achieving the perfect balance.',
  },
  {
    slug: 'business',
    name: 'Music Business',
    description: 'Strategies for independent artists to grow and monetize.',
  },
  {
    slug: 'resources',
    name: 'Free Resources',
    description: 'Presets, templates, and tools to speed up your workflow.',
  },
];
