"use client";

import { Trophy, FilterX, ChevronDown, ChevronUp, Search } from "lucide-react";
import { LeagueReport } from "@/lib/leagueleader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface ClubStatsViewerProps {
    reportData: LeagueReport;
    reportUrl: string;
    reportTitle: string;
    searchQuery: string;
}

export function ClubStatsViewer({ reportData, reportUrl, reportTitle, searchQuery }: ClubStatsViewerProps) {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    // Collapse all cards when report or search changes
    useEffect(() => {
        setExpandedIndex(null);
    }, [reportUrl, searchQuery]);

    // Flatten all rows from all tables
    const allRows = reportData.tables.flatMap(table => table.rows);

    // Filter rows based on search query
    const filteredRows = allRows.filter((row) => {
        if (!searchQuery.trim()) return false;
        const query = searchQuery.toLowerCase();

        // Search across all values in the row
        return Object.values(row).some(val =>
            String(val).toLowerCase().includes(query)
        );
    });

    const hasResults = filteredRows.length > 0;

    // Helper to find specific columns loosely
    const findValue = (row: any, keys: string[]) => {
        const foundKey = Object.keys(row).find(k =>
            keys.some(searchKey => k.toLowerCase().includes(searchKey.toLowerCase()))
        );
        return foundKey ? row[foundKey] : '-';
    };

    const toggleExpand = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            {/* Header Removed as requested */}

            {/* Results Grid */}
            {hasResults ? (
                <div className="space-y-4">
                    {filteredRows.map((row, i) => {
                        // Extract relevant data points
                        const playerName = findValue(row, ['player', 'name', 'team']) || 'Unknown Player';
                        const games = findValue(row, ['games', 'gms']);
                        const ppd = findValue(row, ['ppd']);
                        const mpr = findValue(row, ['mpr']);

                        const isExpanded = expandedIndex === i;

                        return (
                            <Card key={i} className="border-white/10 bg-white/5 overflow-hidden transition-all hover:border-[var(--color-primary)]">
                                <div
                                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                                    onClick={() => toggleExpand(i)}
                                >
                                    <div className="flex items-center gap-4 flex-grow">
                                        <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)] flex-shrink-0">
                                            <Trophy className="w-5 h-5" />
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between flex-grow gap-2 pr-4">
                                            <div className="font-bold text-white text-lg">{playerName}</div>
                                            <div className="flex gap-4 text-sm">
                                                <div className="flex items-center gap-1.5 text-neutral-400">
                                                    <span className="text-xs uppercase tracking-wider font-bold">PPD</span>
                                                    <span className="text-white font-mono bg-black/30 px-1.5 rounded">{ppd}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-neutral-400">
                                                    <span className="text-xs uppercase tracking-wider font-bold">MPR</span>
                                                    <span className="text-white font-mono bg-black/30 px-1.5 rounded">{mpr}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Button variant="ghost" size="icon" className="text-neutral-400 flex-shrink-0">
                                        {isExpanded ? <ChevronUp /> : <ChevronDown />}
                                    </Button>
                                </div>

                                {isExpanded && (
                                    <div className="border-t border-white/10 bg-black/20 p-6">
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="bg-white/5 rounded-lg p-3 text-center border border-white/5">
                                                <div className="text-xs text-neutral-400 uppercase tracking-wider font-bold mb-1">Total Games</div>
                                                <div className="text-xl font-bold text-white">{games}</div>
                                            </div>
                                            <div className="bg-white/5 rounded-lg p-3 text-center border border-white/5">
                                                <div className="text-xs text-neutral-400 uppercase tracking-wider font-bold mb-1">01 AVG (PPD)</div>
                                                <div className="text-xl font-black text-white text-[var(--color-primary)]">{ppd}</div>
                                            </div>
                                            <div className="bg-white/5 rounded-lg p-3 text-center border border-white/5">
                                                <div className="text-xs text-neutral-400 uppercase tracking-wider font-bold mb-1">Cricket AVG (MPR)</div>
                                                <div className="text-xl font-black text-white">{mpr}</div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        );
                    })}
                </div>
            ) : !searchQuery.trim() ? (
                <div className="text-center py-16 text-neutral-500 bg-white/5 rounded-xl border border-white/5 flex flex-col items-center justify-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                        <Search className="w-6 h-6 opacity-50" />
                    </div>
                    <div>
                        <p className="font-medium text-white">Search to view stats</p>
                        <p className="text-sm">Enter a player name above to see their tournament stats.</p>
                    </div>
                </div>
            ) : (
                <div className="text-center py-16 text-neutral-500 bg-white/5 rounded-xl border border-white/5 flex flex-col items-center justify-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                        <FilterX className="w-6 h-6 opacity-50" />
                    </div>
                    <div>
                        <p className="font-medium text-white">No players found</p>
                        <p className="text-sm">Try searching for a different name.</p>
                    </div>
                </div>
            )}

            <p className="text-center text-xs text-neutral-500 mt-4">
                Data provided by LeagueLeader.
            </p>
        </div>
    );
}
