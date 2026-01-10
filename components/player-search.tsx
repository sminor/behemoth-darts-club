'use client';

import { useState, useEffect } from 'react';
import { Search, Loader2, Trophy, Target, ChevronDown, ChevronUp, X } from 'lucide-react';
import { searchADLPlayers, getADLPlayerDetails, type PlayerStats, type PlayerDetails } from '@/app/actions/adl';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PlayerSearchProps {
    query: string;
}

export function PlayerSearch({ query = "" }: PlayerSearchProps) {
    // Internal state for results and UI logic
    const [results, setResults] = useState<PlayerStats[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [expandedPlayer, setExpandedPlayer] = useState<string | null>(null);
    const [details, setDetails] = useState<Record<string, PlayerDetails>>({});
    const [loadingDetails, setLoadingDetails] = useState<string | null>(null);

    // Effect to trigger search when query changes
    useEffect(() => {
        const search = async () => {
            if (!query.trim()) {
                setResults([]);
                setError(null);
                return;
            }

            setLoading(true);
            setError(null);
            setExpandedPlayer(null);

            try {
                const data = await searchADLPlayers(query);
                setResults(data);
                if (data.length === 0) {
                    setError('No players found directly matching that name.');
                }
            } catch (err) {
                setError('Failed to fetch players. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        // Debounce search slightly to avoid excessive calls
        const timer = setTimeout(search, 500);
        return () => clearTimeout(timer);
    }, [query]);

    const toggleDetails = async (player: PlayerStats) => {
        if (expandedPlayer === player.id) {
            setExpandedPlayer(null);
            return;
        }

        setExpandedPlayer(player.id);

        if (!details[player.id]) {
            setLoadingDetails(player.id);
            try {
                const data = await getADLPlayerDetails(player.id);
                if (data) {
                    setDetails(prev => ({ ...prev, [player.id]: data }));
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingDetails(null);
            }
        }
    };

    return (
        <div className="space-y-8 max-w-2xl mx-auto w-full">
            {loading && (
                <div className="text-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-[var(--color-primary)]" />
                    <p className="text-neutral-400 mt-2">Searching ADL database...</p>
                </div>
            )}

            {error && (
                <div className="text-center p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                {!query.trim() && (
                    <div className="text-center py-16 text-neutral-500 bg-white/5 rounded-xl border border-white/5 flex flex-col items-center justify-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                            <Search className="w-6 h-6 opacity-50" />
                        </div>
                        <div>
                            <p className="font-medium text-white">Search to view stats</p>
                            <p className="text-sm">Enter a player name above to see their ADL stats.</p>
                        </div>
                    </div>
                )}
                {results.map(player => (
                    <Card key={player.id} className="border-white/10 bg-white/5 overflow-hidden transition-all hover:border-[var(--color-primary)]">
                        <div
                            className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                            onClick={() => toggleDetails(player)}
                        >
                            <div className="flex items-center gap-4 flex-grow">
                                <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)] flex-shrink-0">
                                    <Target className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between flex-grow gap-2 pr-4">
                                    <div className="font-bold text-white text-lg">{player.name}</div>
                                    <div className="flex gap-4 text-sm">
                                        <div className="flex items-center gap-1.5 text-neutral-400">
                                            <span className="text-xs uppercase tracking-wider font-bold">Start</span>
                                            <span className="text-white font-mono bg-black/30 px-1.5 rounded">{player.startRating}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[var(--color-primary)]">
                                            <span className="text-xs uppercase tracking-wider font-bold">Roll</span>
                                            <span className="text-white font-mono bg-black/30 px-1.5 rounded">{player.rollRating}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Button variant="ghost" size="icon" className="text-neutral-400 flex-shrink-0">
                                {expandedPlayer === player.id ? <ChevronUp /> : <ChevronDown />}
                            </Button>
                        </div>

                        {expandedPlayer === player.id && (
                            <div className="border-t border-white/10 bg-black/20 p-6">
                                {loadingDetails === player.id ? (
                                    <div className="py-4 text-center text-neutral-500 flex items-center justify-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" /> Loading stats...
                                    </div>
                                ) : details[player.id] ? (
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">Current Season</h3>

                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="bg-white/5 rounded-lg p-3 text-center border border-white/5">
                                                <div className="text-xs text-neutral-400 uppercase tracking-wider font-bold mb-1">01 Avg (PPD)</div>
                                                <div className="text-xl font-black text-white">{details[player.id].stats.ppd}</div>
                                            </div>
                                            <div className="bg-white/5 rounded-lg p-3 text-center border border-white/5">
                                                <div className="text-xs text-neutral-400 uppercase tracking-wider font-bold mb-1">Cricket Avg (MPR)</div>
                                                <div className="text-xl font-black text-white">{details[player.id].stats.mpr}</div>
                                            </div>
                                            <div className="bg-white/5 rounded-lg p-3 text-center border border-white/5">
                                                <div className="text-xs text-neutral-400 uppercase tracking-wider font-bold mb-1">01 Games</div>
                                                <div className="text-xl font-bold text-neutral-200">{details[player.id].stats.games01}</div>
                                            </div>
                                            <div className="bg-white/5 rounded-lg p-3 text-center border border-white/5">
                                                <div className="text-xs text-neutral-400 uppercase tracking-wider font-bold mb-1">Cricket Games</div>
                                                <div className="text-xl font-bold text-neutral-200">{details[player.id].stats.gamesCricket}</div>
                                            </div>
                                        </div>

                                        <div className="pt-2 text-center">
                                            <a
                                                href={`https://actiondartleague.com/player.php?id=${player.id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
                                            >
                                                View full profile on ADL <span aria-hidden="true">&rarr;</span>
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-red-400 text-sm text-center">Failed to load details.</div>
                                )}
                            </div>
                        )}
                    </Card>
                ))}

            </div>

            <p className="text-center text-xs text-neutral-500 mt-8">
                Data provided by Action Dart League.
            </p>
        </div>
    );
}
