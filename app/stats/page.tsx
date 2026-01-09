import { PlayerSearch } from "@/components/player-search";
import { ArrowLeft, BarChart3 } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default function StatsPage() {
    return (
        <main className="min-h-screen bg-[var(--background)] pb-24">
            {/* Header */}
            <header className="border-b border-white/10 bg-neutral-900/50 backdrop-blur-sm sticky top-0 z-20 mb-8">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Link>
                    <h1 className="text-xl font-bold text-white tracking-wider uppercase flex items-center gap-2">
                        Stats <span className="text-[var(--color-primary)]">Lookup</span>
                    </h1>
                    <div className="w-[100px] flex justify-end">
                        <BarChart3 className="w-5 h-5 text-[var(--color-primary)] opacity-80" />
                    </div>
                </div>
            </header>

            <div className="px-4 max-w-6xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
                    <p className="text-neutral-400">
                        Search for any player in the Action Dart League to see their current rating and performance stats.
                        <br />
                        <span className="text-[var(--color-primary)]">Live data from ADL.</span>
                    </p>
                </div>

                <PlayerSearch />
            </div>
        </main>
    );
}
