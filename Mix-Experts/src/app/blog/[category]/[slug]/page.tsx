import { getPostBySlug } from '@/lib/blog';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Markdown from 'markdown-to-jsx';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/profile/Footer';
import { BlogPost } from '@/types/blog';
import { Metadata } from 'next';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ShareButtons } from '@/components/blog/ShareButtons';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { Callout } from '@/components/blog/Callout';
import { Accordion } from '@/components/blog/Accordion';

interface Props {
    params: Promise<{
        category: string;
        slug: string;
    }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = getPostBySlug(slug, ['title', 'excerpt', 'category']) as BlogPost;
    if (!post) return {};

    return {
        title: `${post.title} | Mix Experts`,
        description: post.excerpt,
    };
}

export default async function ArticlePage({ params }: Props) {
    const { slug, category } = await params;

    const post = getPostBySlug(slug, [
        'title',
        'date',
        'slug',
        'author',
        'content',
        'coverImage',
        'category',
        'readingTime'
    ]) as BlogPost;

    if (!post || post.category !== category) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-[var(--bg-base)]">
            <Navbar />
            <article className="pt-24 pb-20">

                {/* Breadcrumbs Navigation */}
                <div className="max-w-[1400px] mx-auto px-6 mb-8">
                    <Breadcrumbs items={[
                        { label: 'Blog', href: '/blog' },
                        { label: post.category, href: `/blog/${post.category}` },
                        { label: post.title }
                    ]} />
                </div>

                {/* Article Header */}
                <header className="max-w-4xl mx-auto px-6 mb-12 text-center">
                    <div className="flex items-center justify-center gap-4 mb-6 text-sm">
                        <span className="px-3 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 uppercase font-bold text-xs">
                            {post.category}
                        </span>
                        <span className="text-[var(--text-gray)]">{post.readingTime}</span>
                        <span className="text-[var(--text-gray)]">•</span>
                        <span className="text-[var(--text-gray)]">{post.date}</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
                        {post.title}
                    </h1>

                    <div className="flex flex-col items-center gap-6">
                        <div className="flex items-center justify-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent)] to-purple-600" />
                            <div className="text-left">
                                <p className="text-white font-medium text-sm">{post.author?.name}</p>
                                <p className="text-[var(--text-gray)] text-xs">Audio Engineer</p>
                            </div>
                        </div>

                        <ShareButtons title={post.title} slug={`${post.category}/${post.slug}`} />
                    </div>
                </header>

                {/* Hero Image */}
                <div className="max-w-5xl mx-auto px-6 mb-16">
                    <div className="relative aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl shadow-[var(--accent)]/10 border border-white/5">
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-base)] via-transparent to-transparent opacity-60" />
                        {post.coverImage ? (
                            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gray-900" />
                        )}
                    </div>
                </div>

                {/* Main Content Layout */}
                <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 mb-20">

                    {/* Content Body */}
                    <div className="prose prose-invert prose-lg prose-headings:text-white prose-headings:font-bold prose-headings:scroll-mt-32 prose-a:text-[var(--accent)] prose-strong:text-white prose-li:text-[var(--text-gray)] text-[var(--text-gray)] max-w-none">
                        <Markdown options={{
                            overrides: {
                                Callout: { component: Callout },
                                Accordion: { component: Accordion },
                                h2: {
                                    component: ({ children, ...props }) => {
                                        const id = children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                                        return <h2 id={id} {...props}>{children}</h2>;
                                    }
                                },
                                h3: {
                                    component: ({ children, ...props }) => {
                                        const id = children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                                        return <h3 id={id} {...props}>{children}</h3>;
                                    }
                                }
                            }
                        }}>
                            {post.content || ''}
                        </Markdown>
                    </div>

                    {/* Sidebar TOC */}
                    <div className="hidden lg:block">
                        <TableOfContents content={post.content} />
                    </div>
                </div>

                {/* Related Articles Divider */}
                <div className="max-w-[1400px] mx-auto px-6 py-10 border-t border-white/5">
                    <h3 className="text-2xl font-bold text-white mb-8">Ready to keep learning?</h3>
                    <div className="p-8 bg-white/5 rounded-3xl border border-white/10 text-center">
                        <p className="text-[var(--text-gray)] mb-4">Want more <span className="text-[var(--accent)] capitalize">{post.category}</span> tips?</p>
                        <Link href={`/blog/${post.category}`} className="inline-flex px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-[var(--accent)] hover:text-white transition-all">
                            View All {post.category} Guides
                        </Link>
                    </div>
                </div>

            </article>
            <Footer isMarketingPage={true} />
        </main>
    );
}
