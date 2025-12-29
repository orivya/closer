import { BlogCard } from '@/components/blog/BlogCard';
import { getPostsByCategory } from '@/lib/blog';
import { BLOG_CATEGORIES, BlogPost } from '@/types/blog';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/profile/Footer';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Metadata } from 'next';

interface Props {
    params: Promise<{
        category: string;
    }>
}

// Next.js 13+ generateStaticParams for SSG
export async function generateStaticParams() {
    return BLOG_CATEGORIES.map((cat) => ({
        category: cat.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { category } = await params;
    const categoryData = BLOG_CATEGORIES.find(c => c.slug === category);
    if (!categoryData) return {};

    return {
        title: `${categoryData.name} | The Frequency`,
        description: categoryData.description,
    };
}

export default async function CategoryPage({ params }: Props) {
    const { category } = await params;
    const categoryData = BLOG_CATEGORIES.find(c => c.slug === category);

    if (!categoryData) {
        notFound();
    }

    const posts = getPostsByCategory(category, [
        'title', 'date', 'slug', 'author', 'coverImage', 'excerpt', 'category', 'readingTime'
    ]) as BlogPost[];

    return (
        <main className="min-h-screen bg-[var(--bg-base)]">
            <Navbar />
            <div className="pt-24 pb-20">
                <div className="max-w-[1400px] mx-auto px-6">

                    <Breadcrumbs items={[
                        { label: 'Blog', href: '/blog' },
                        { label: categoryData.name }
                    ]} />

                    {/* Category Header */}
                    <div className="mb-16 text-center md:text-left">
                        <span className="text-[var(--accent)] font-bold tracking-wider uppercase text-sm mb-2 block">Topic Cluster</span>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{categoryData.name}</h1>
                        <p className="text-xl text-[var(--text-gray)] max-w-2xl">{categoryData.description}</p>
                    </div>

                    {/* Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <BlogCard key={post.slug} post={post} />
                        ))}
                    </div>

                    {posts.length === 0 && (
                        <div className="text-center py-20 bg-white/5 rounded-3xl">
                            <p className="text-[var(--text-gray)]">Content coming soon to this cluster.</p>
                        </div>
                    )}

                </div>
            </div>
            <Footer isMarketingPage={true} />
        </main>
    );
}
