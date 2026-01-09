import Link from 'next/link';
import { ArrowLeft, Users } from "lucide-react";

export const dynamic = 'force-dynamic';

export default function LeaguesPage() {
    return (
        <div className="min-h-screen bg-[var(--background)] pb-12">
            {/* Header */}
            <header className="border-b border-white/10 bg-neutral-900/50 backdrop-blur-sm sticky top-0 z-10 mb-12">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Link>
                    <h1 className="text-xl font-bold text-white tracking-wider uppercase flex items-center gap-2">
                        Our <span className="text-[var(--color-primary)]">Leagues</span>
                    </h1>
                    <div className="w-[100px] flex justify-end">
                        <Users className="w-5 h-5 text-[var(--color-primary)] opacity-80" />
                    </div>
                </div>
            </header>

            <main className="px-4 max-w-6xl mx-auto py-8">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <p className="text-neutral-400">
                        Check back soon for upcoming Fall/Winter season schedules, division standings, and registration information.
                        <br />
                        <span className="text-[var(--color-primary)]">Registration opening soon.</span>
                    </p>
                </div>

                <div className="max-w-md mx-auto bg-white/5 border border-white/10 rounded-xl p-8 text-center">
                    <div className="w-16 h-16 bg-[var(--color-primary)]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Users className="w-8 h-8 text-[var(--color-primary)]" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Coming Soon</h3>
                    <p className="text-neutral-400 text-sm">
                        We are currently finalizing the details for the next league season.
                    </p>
                </div>
            </main>
        </div>
    );
}
