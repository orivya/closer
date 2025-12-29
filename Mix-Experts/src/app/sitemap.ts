import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog';
import { BLOG_CATEGORIES } from '@/types/blog';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://mix-experts.com';

    // Get all posts
    const allPosts = getAllPosts(['slug', 'date', 'category']);

    const posts = allPosts
        .filter((post) => post && post.category && post.slug)
        .map((post) => ({
            url: `${baseUrl}/blog/${post!.category}/${post!.slug}`,
            lastModified: post!.date,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        }));

    // Get all categories
    const categories = BLOG_CATEGORIES.map((cat) => ({
        url: `${baseUrl}/blog/${cat.slug}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    const routes = [
        '',
        '/blog',
        '/features',
        '/pricing',
        '/examples',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.9,
    }));

    return [...routes, ...categories, ...posts];
}
