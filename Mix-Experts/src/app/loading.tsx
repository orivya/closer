export default function Loading() {
    return (
        <div className="fixed inset-0 bg-[var(--bg-base)] flex items-center justify-center z-50">
            <div className="flex flex-col items-center gap-4">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-t-2 border-[var(--accent)] animate-spin"></div>
                    <div className="absolute inset-2 rounded-full border-r-2 border-purple-500 animate-spin-reverse"></div>
                    <div className="absolute inset-4 rounded-full border-b-2 border-blue-400 animate-pulse"></div>
                </div>
                <p className="text-[var(--text-gray)] text-sm animate-pulse tracking-wide uppercase font-bold">Loading Frequency</p>
            </div>
        </div>
    );
}
