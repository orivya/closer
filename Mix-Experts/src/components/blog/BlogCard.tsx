import Link from 'next/link';
import { BlogPost } from '@/types/blog';

interface BlogCardProps {
    post: BlogPost;
    featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
    if (featured) {
        return (
            <Link
                href={`/blog/${post.category}/${post.slug}`}
                className="group relative grid md:grid-cols-2 gap-8 bg-[var(--card-bg)] rounded-3xl overflow-hidden border border-white/5 hover:border-[var(--accent)]/50 transition-all duration-300"
            >
                <div className="relative aspect-video md:aspect-auto overflow-hidden">
                    {/* Placeholder for actual image if we had one, for now utilizing gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br from-[var(--accent)]/20 to-purple-900/40 group-hover:scale-105 transition-transform duration-500`} />
                    {post.coverImage && (
                        <img
                            src={post.coverImage}
                            alt={post.title}
                            className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                        />
                    )}
                </div>
                <div className="p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-4 text-sm text-[var(--text-gray)]">
                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 uppercase tracking-wider text-xs font-bold">
                            {post.category}
                        </span>
                        <span>{post.readingTime}</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-[var(--accent)] transition-colors">
                        {post.title}
                    </h3>
                    <p className="text-[var(--text-gray)] text-lg mb-6 line-clamp-3">
                        {post.excerpt}
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent)] to-purple-600" />
                        <span className="text-sm font-medium text-white">{post.author.name}</span>
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <Link
            href={`/blog/${post.category}/${post.slug}`}
            className="group flex flex-col bg-[var(--card-bg)] rounded-2xl overflow-hidden border border-white/5 hover:border-[var(--accent)]/30 hover:-translate-y-1 transition-all duration-300"
        >
            <div className="relative aspect-[16/9] overflow-hidden bg-black/50">
                <div className={`absolute inset-0 bg-gradient-to-br from-[var(--accent)]/10 to-purple-900/20`} />
                {post.coverImage && (
                    <img
                        src={post.coverImage}
                        alt={post.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                    />
                )}
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-3 text-xs text-[var(--text-gray)]">
                    <span className="uppercase tracking-wider font-bold text-[var(--accent)]">
                        {post.category}
                    </span>
                    <span>{post.readingTime}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                    {post.title}
                </h3>
                <p className="text-[var(--text-gray)] text-sm mb-4 line-clamp-2 flex-grow">
                    {post.excerpt}
                </p>
                <div className="flex items-center gap-2 mt-auto pt-4 border-t border-white/5">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[var(--accent)] to-purple-600" />
                    <span className="text-xs font-medium text-white">{post.author.name}</span>
                </div>
            </div>
        </Link>
    );
}
