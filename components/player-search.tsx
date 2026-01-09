'use client';

import { useState } from 'react';
import { Search, Loader2, Trophy, Target, ChevronDown, ChevronUp, X } from 'lucide-react';
import { searchADLPlayers, getADLPlayerDetails, type PlayerStats, type PlayerDetails } from '@/app/actions/adl';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function PlayerSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<PlayerStats[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [expandedPlayer, setExpandedPlayer] = useState<string | null>(null);
    const [details, setDetails] = useState<Record<string, PlayerDetails>>({});
    const [loadingDetails, setLoadingDetails] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError(null);
        setResults([]);
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
            <form onSubmit={handleSearch} className="relative flex gap-2">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <Input
                        type="text"
                        placeholder="Search player name (e.g. Smith)..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="pl-10 pr-10 h-10 bg-white/5 border-white/10 text-sm rounded-md focus:ring-[var(--color-primary)] placeholder:text-neutral-500"
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={() => {
                                setQuery('');
                                setResults([]);
                                setExpandedPlayer(null);
                                setError(null);
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
                <Button
                    type="submit"
                    disabled={loading || !query.trim()}
                    className="h-10 px-6 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-md"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
                </Button>
            </form>

            {error && (
                <div className="text-center p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                {results.map(player => (
                    <Card key={player.id} className="border-white/10 bg-white/5 overflow-hidden transition-all hover:border-white/20">
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
        </div>
    );
}
