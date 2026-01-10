import Link from 'next/link';
import { ArrowLeft, Trophy } from "lucide-react";
import { getLeaguesStructure } from "@/app/actions/leagues";
import { StandingsBrowser } from "@/components/leagues/standings-browser";

export const dynamic = 'force-dynamic';

export default async function StandingsPage() {
    // Fetch all leagues data structure to pass to client browser
    const leagues = await getLeaguesStructure();

    return (
        <div className="min-h-screen bg-[var(--background)] pb-12">
            {/* Header */}
            <header className="border-b border-white/10 bg-neutral-900/50 backdrop-blur-sm sticky top-0 z-10 mb-8">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="w-[100px] flex justify-start">
                        <Link href="/leagues" className="hover:text-white transition-colors group">
                            <ArrowLeft className="w-5 h-5 text-[var(--color-primary)] opacity-80 group-hover:opacity-100 transition-opacity" />
                        </Link>
                    </div>
                    <h1 className="text-xl font-bold text-white tracking-wider uppercase flex items-center gap-2">
                        League <span className="text-[var(--color-primary)]">Standings</span>
                    </h1>
                    <div className="w-[100px] flex justify-end">
                        <Trophy className="w-5 h-5 text-[var(--color-primary)] opacity-80" />
                    </div>
                </div>
            </header>

            <main className="px-4 max-w-6xl mx-auto">
                <StandingsBrowser leagues={leagues} />
            </main>
        </div>
    );
}
