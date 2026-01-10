import Link from 'next/link';
import { ArrowLeft, Users, Calendar, Trophy, ClipboardList, Home } from "lucide-react";

export const dynamic = 'force-dynamic';

export default function LeaguesPage() {
    return (
        <div className="min-h-screen bg-[var(--background)] pb-12">
            {/* Header */}
            <header className="border-b border-white/10 bg-neutral-900/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="w-[100px] flex justify-start">
                        <Link href="/" className="hover:text-white transition-colors group">
                            <Home className="w-5 h-5 text-[var(--color-primary)] opacity-80 group-hover:opacity-100 transition-opacity" />
                        </Link>
                    </div>
                    <h1 className="text-xl font-bold text-white tracking-wider uppercase flex items-center gap-2">
                        Our <span className="text-[var(--color-primary)]">Leagues</span>
                    </h1>
                    <div className="w-[100px] flex justify-end">
                        <Users className="w-5 h-5 text-[var(--color-primary)] opacity-80" />
                    </div>
                </div>
            </header>

            <main className="px-4 max-w-6xl mx-auto py-8">
                {/* Hero Section */}
                <div className="text-center max-w-2xl mx-auto space-y-4 mb-8">
                    <p className="text-neutral-400">
                        Whether you're a seasoned pro or just getting started, we have a division for you.
                        Find schedules, check standings, or sign up for the next season below.
                        <br />
                        <span className="text-[var(--color-primary)]">Join the competition.</span>
                    </p>
                </div>

                {/* Navigation Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Sign Ups Card */}
                    <Link href="/leagues/sign-ups" className="group">
                        <div className="h-full bg-white/5 border border-white/10 rounded-xl p-8 transition-all duration-300 hover:border-[var(--color-primary)] hover:bg-white/10 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <ClipboardList className="w-8 h-8 text-[var(--color-primary)]" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[var(--color-primary)] transition-colors">Sign Ups</h3>
                            <p className="text-neutral-400 text-sm">
                                Register your team for the upcoming season or find a team to join.
                            </p>
                        </div>
                    </Link>

                    {/* Schedules Card */}
                    <Link href="/leagues/schedules" className="group">
                        <div className="h-full bg-white/5 border border-white/10 rounded-xl p-8 transition-all duration-300 hover:border-[var(--color-primary)] hover:bg-white/10 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Calendar className="w-8 h-8 text-[var(--color-primary)]" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[var(--color-primary)] transition-colors">Schedules</h3>
                            <p className="text-neutral-400 text-sm">
                                View match schedules, locations, and upcoming fixtures for all divisions.
                            </p>
                        </div>
                    </Link>

                    {/* Standings Card */}
                    <Link href="/leagues/standings" className="group">
                        <div className="h-full bg-white/5 border border-white/10 rounded-xl p-8 transition-all duration-300 hover:border-[var(--color-primary)] hover:bg-white/10 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Trophy className="w-8 h-8 text-[var(--color-primary)]" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[var(--color-primary)] transition-colors">Standings</h3>
                            <p className="text-neutral-400 text-sm">
                                Check current league standings, individual player stats, and division leaders.
                            </p>
                        </div>
                    </Link>
                </div>
            </main>
        </div>
    );
}
