import { BlogCard } from '@/components/blog/BlogCard';
import { BlogSearch } from '@/components/blog/BlogSearch';
import { getAllPosts } from '@/lib/blog';
import { BLOG_CATEGORIES, BlogPost } from '@/types/blog';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/profile/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'The Frequency | Mix Experts Blog',
    description: 'Master your sound with professional mixing techniques, music business strategies, and industry insights.',
};

interface Props {
    searchParams?: {
        q?: string;
    };
}

export default function BlogIndex({ searchParams }: Props) {
    let allPosts = getAllPosts(['title', 'date', 'slug', 'author', 'coverImage', 'excerpt', 'category', 'readingTime']) as BlogPost[];

    // Filter by Search Query
    const query = searchParams?.q;
    if (query) {
        allPosts = allPosts.filter((post) =>
            post.title.toLowerCase().includes(query.toLowerCase()) ||
            post.excerpt?.toLowerCase().includes(query.toLowerCase()) ||
            post.category.toLowerCase().includes(query.toLowerCase())
        );
    }

    // Strategy: 1 Featured Post, Rest in Grid (only if not searching)
    const showFeatured = !query && allPosts.length > 0;
    const featuredPost = showFeatured ? allPosts[0] : null;
    const regularPosts = showFeatured ? allPosts.slice(1) : allPosts;

    return (
        <main className="min-h-screen bg-[var(--bg-base)]">
            <Navbar />
            <div className="pt-24 pb-20">

                {/* Hero Section */}
                <section className="relative px-6 mb-20">
                    <div className="max-w-[1400px] mx-auto text-center">
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-purple-400">Frequency</span>
                        </h1>
                        <p className="text-xl text-[var(--text-gray)] max-w-2xl mx-auto mb-10">
                            Master your sound with professional mixing techniques, music business strategies, and industry insights.
                        </p>

                        <BlogSearch />

                        {/* Category Phils */}
                        <div className="flex flex-wrap justify-center gap-3">
                            {BLOG_CATEGORIES.map((cat) => (
                                <Link
                                    key={cat.slug}
                                    href={`/blog/${cat.slug}`}
                                    className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-[var(--accent)] transition-all"
                                >
                                    {cat.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Content Area */}
                <div className="max-w-[1400px] mx-auto px-6">

                    {/* Featured Post */}
                    {featuredPost && (
                        <div className="mb-16">
                            <h2 className="text-2xl font-bold text-white mb-6">Latest Drop</h2>
                            <BlogCard post={featuredPost} featured={true} />
                        </div>
                    )}

                    {/* Regular Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {regularPosts.map((post) => (
                            <BlogCard key={post.slug} post={post} />
                        ))}
                    </div>

                    {regularPosts.length === 0 && !featuredPost && (
                        <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl">
                            <p className="text-[var(--text-gray)]">No articles found. Time to write some golden content!</p>
                        </div>
                    )}

                </div>
            </div>
            <Footer isMarketingPage={true} />
        </main>
    );
}
