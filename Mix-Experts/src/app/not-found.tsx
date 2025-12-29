import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/profile/Footer';

export default function NotFound() {
    return (
        <main className="min-h-screen bg-[var(--bg-base)] flex flex-col">
            <Navbar />
            <div className="flex-grow flex items-center justify-center relative overflow-hidden">
                {/* Background Atmosphere */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--accent)]/10 blur-[120px] rounded-full" />

                <div className="relative z-10 text-center px-6">
                    <h1 className="text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--text-gray)]/20 to-[var(--text-gray)]/40 mb-4 select-none">
                        404
                    </h1>
                    <h2 className="text-3xl font-bold text-white mb-6">Signal Not Found</h2>
                    <p className="text-lg text-[var(--text-gray)] max-w-md mx-auto mb-10">
                        It looks like this track hasn't been recorded yet. Let's get you back to the session.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link href="/" className="px-8 py-3 bg-[var(--accent)] text-white font-bold rounded-full hover:bg-[var(--accent-light)] transition-all">
                            Return Home
                        </Link>
                        <Link href="/blog" className="px-8 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-full hover:bg-white/10 transition-all">
                            Visit the Blog
                        </Link>
                    </div>
                </div>
            </div>
            <Footer isMarketingPage={true} />
        </main>
    );
}
