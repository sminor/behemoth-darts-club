import Link from 'next/link';
import { ArrowLeft, ClipboardList } from "lucide-react";

export const dynamic = 'force-dynamic';

export default function SignUpsPage() {
    return (
        <div className="min-h-screen bg-[var(--background)] pb-12">
            {/* Header */}
            <header className="border-b border-white/10 bg-neutral-900/50 backdrop-blur-sm sticky top-0 z-10 mb-12">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="w-[100px] flex justify-start">
                        <Link href="/leagues" className="hover:text-white transition-colors group">
                            <ArrowLeft className="w-5 h-5 text-[var(--color-primary)] opacity-80 group-hover:opacity-100 transition-opacity" />
                        </Link>
                    </div>
                    <h1 className="text-xl font-bold text-white tracking-wider uppercase flex items-center gap-2">
                        League <span className="text-[var(--color-primary)]">Sign Ups</span>
                    </h1>
                    <div className="w-[100px] flex justify-end">
                        <ClipboardList className="w-5 h-5 text-[var(--color-primary)] opacity-80" />
                    </div>
                </div>
            </header>

            <main className="px-4 max-w-6xl mx-auto py-8">
                <div className="max-w-md mx-auto bg-white/5 border border-white/10 rounded-xl p-8 text-center">
                    <div className="w-16 h-16 bg-[var(--color-primary)]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ClipboardList className="w-8 h-8 text-[var(--color-primary)]" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Sign Ups Coming Soon</h3>
                    <p className="text-neutral-400 text-sm">
                        Registration for the upcoming league season hasn't opened yet. Please check back later!
                    </p>
                </div>
            </main>
        </div>
    );
}
