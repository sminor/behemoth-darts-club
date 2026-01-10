"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Trophy, Loader2 } from "lucide-react";
import { LeagueStructure } from "@/app/actions/leagues";
import { getLeagueReport } from "@/app/actions/reports";
import { LeagueReport } from "@/lib/leagueleader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface StandingsBrowserProps {
    leagues: LeagueStructure[];
}

export function StandingsBrowser({ leagues }: StandingsBrowserProps) {
    // Selection state
    const [selectedLeagueId, setSelectedLeagueId] = useState<string>("");
    const [selectedDivisionId, setSelectedDivisionId] = useState<string>("");
    const [selectedFlightId, setSelectedFlightId] = useState<string>("");

    // Report data state
    const [reportData, setReportData] = useState<LeagueReport | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initial Selection Logic: Auto-select latest active league
    useEffect(() => {
        if (leagues.length > 0 && !selectedLeagueId) {
            const activeLeague = leagues.find(l => l.is_active) || leagues[0];
            setSelectedLeagueId(activeLeague.id);
        }
    }, [leagues]);

    // Reset downstream selections when upstream changes
    useEffect(() => {
        setSelectedDivisionId("");
        setSelectedFlightId("");
        setReportData(null);
    }, [selectedLeagueId]);

    useEffect(() => {
        setSelectedFlightId("");
        setReportData(null);
    }, [selectedDivisionId]);

    // Effect to auto-select first options if available (optional UX enhancement)
    // Could implement: when league selected -> select first division?

    // Derived objects
    const selectedLeague = leagues.find(l => l.id === selectedLeagueId);

    // safe division filtering
    const divisions = selectedLeague?.divisions || [];
    const selectedDivision = divisions.find(d => d.id === selectedDivisionId);

    // safe flight filtering
    const flights = selectedDivision?.flights || [];
    const selectedFlight = flights.find(f => f.id === selectedFlightId);


    async function handleFetchReport() {
        if (!selectedFlight?.standings_url) return;

        setIsLoading(true);
        setError(null);
        try {
            const data = await getLeagueReport(selectedFlight.standings_url);
            setReportData(data);
        } catch (e) {
            console.error(e);
            setError("Failed to load standings. The report URL might be invalid or external service is down.");
        } finally {
            setIsLoading(false);
        }
    }

    // Sorting State: Map of table index -> { column, direction }
    const [sortConfig, setSortConfig] = useState<Record<number, { key: string; direction: 'asc' | 'desc' }>>({});

    const handleSort = (tableIndex: number, key: string) => {
        setSortConfig((prev) => {
            const current = prev[tableIndex];
            if (current && current.key === key) {
                // Toggle direction
                return {
                    ...prev,
                    [tableIndex]: { key, direction: current.direction === 'asc' ? 'desc' : 'asc' },
                };
            }
            // New selection defaults to ascending for strings, descending for numbers?
            // Let's default to ASC for simple predictive behavior, user can click again to flip.
            return {
                ...prev,
                [tableIndex]: { key, direction: 'asc' },
            };
        });
    };

    const getSortedRows = (table: any, index: number) => {
        const config = sortConfig[index];
        if (!config) return table.rows;

        return [...table.rows].sort((a: any, b: any) => {
            const valA = a[config.key];
            const valB = b[config.key];

            const numA = Number(valA);
            const numB = Number(valB);
            // Check if both are valid numbers (and not empty strings which Number() converts to 0)
            const isNumeric = !isNaN(numA) && !isNaN(numB) && valA !== '' && valB !== '';

            if (isNumeric) {
                return config.direction === 'asc' ? numA - numB : numB - numA;
            }

            // String sorting
            const strA = String(valA).toLowerCase();
            const strB = String(valB).toLowerCase();

            if (strA < strB) return config.direction === 'asc' ? -1 : 1;
            if (strA > strB) return config.direction === 'asc' ? 1 : -1;
            return 0;
        });
    };

    // Auto-fetch when flight changes to one with a URL
    useEffect(() => {
        if (selectedFlight?.standings_url) {
            handleFetchReport();
        } else {
            setReportData(null); // Clear report if no URL
        }
    }, [selectedFlight]);

    return (
        <div className="space-y-8">
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/5 p-4 rounded-lg border border-white/10">
                <div className="space-y-2">
                    <span className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">League</span>
                    <Select value={selectedLeagueId} onValueChange={setSelectedLeagueId}>
                        <SelectTrigger className="bg-neutral-900 border-white/10 text-white">
                            <SelectValue placeholder="Select League" />
                        </SelectTrigger>
                        <SelectContent className="bg-neutral-900 border-white/10 text-white">
                            {leagues.map(l => (
                                <SelectItem key={l.id} value={l.id}>{l.year} {l.name} {l.season}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <span className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">Division</span>
                    <Select value={selectedDivisionId} onValueChange={setSelectedDivisionId} disabled={!selectedLeagueId || divisions.length === 0}>
                        <SelectTrigger className="bg-neutral-900 border-white/10 text-white">
                            <SelectValue placeholder={divisions.length === 0 ? "No Divisions" : "Select Division"} />
                        </SelectTrigger>
                        <SelectContent className="bg-neutral-900 border-white/10 text-white">
                            {divisions.map(d => (
                                <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <span className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">Flight</span>
                    <Select value={selectedFlightId} onValueChange={setSelectedFlightId} disabled={!selectedDivisionId || flights.length === 0}>
                        <SelectTrigger className="bg-neutral-900 border-white/10 text-white">
                            <SelectValue placeholder={flights.length === 0 ? "No Flights" : "Select Flight"} />
                        </SelectTrigger>
                        <SelectContent className="bg-neutral-900 border-white/10 text-white">
                            {flights.map(f => (
                                <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Content Area */}
            <div className="min-h-[400px]">
                {!selectedFlightId ? (
                    <div className="flex flex-col items-center justify-center h-64 text-neutral-500 bg-white/5 rounded-lg border border-white/5 border-dashed">
                        <Trophy className="w-12 h-12 mb-4 opacity-20" />
                        <p>Select a Flight to view standings.</p>
                    </div>
                ) : isLoading ? (
                    <div className="flex flex-col items-center justify-center h-64 text-neutral-400">
                        <Loader2 className="w-8 h-8 animate-spin mb-4 text-[var(--color-primary)]" />
                        <p>Loading report data...</p>
                    </div>
                ) : error ? (
                    <div className="p-6 text-center bg-red-900/10 border border-red-500/20 rounded-lg text-red-200">
                        <p>{error}</p>
                    </div>
                ) : reportData ? (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        {reportData.tables.map((table: any, tIndex: number) => {
                            const sortedRows = getSortedRows(table, tIndex);
                            return (
                                <div key={tIndex} className="space-y-4">
                                    <h4 className="text-base font-bold text-[var(--color-primary)] uppercase tracking-wide">{table.name}</h4>
                                    <div className="overflow-x-auto rounded-lg border border-white/10 shadow-lg">
                                        <table className="w-full text-sm text-left border-collapse">
                                            <thead className="bg-black/50 text-xs uppercase font-bold text-white tracking-wider">
                                                <tr>
                                                    {table.headers.map((h: string, i: number) => (
                                                        <th
                                                            key={i}
                                                            className="px-4 py-3 whitespace-nowrap border-b border-white/10 cursor-pointer hover:bg-white/10 transition-colors select-none"
                                                            onClick={() => handleSort(tIndex, h)}
                                                        >
                                                            {h}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {sortedRows.map((row: any, i: number) => (
                                                    <tr key={i} className={`
                                                        transition-colors relative group
                                                        ${i % 2 === 0 ? 'bg-white/[0.02]' : 'bg-transparent'}
                                                        hover:bg-[var(--color-primary)]/5
                                                    `}>
                                                        {table.headers.map((h: string, j: number) => (
                                                            <td key={j} className="px-4 py-2 whitespace-nowrap text-white relative">
                                                                {/* Bottom border on hover for whole row */}
                                                                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--color-primary)] hidden group-hover:block z-10" />

                                                                <span>
                                                                    {row[h]}
                                                                </span>
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            );
                        })}

                        <div className="text-center mt-6 pt-4 border-t border-white/10">
                            <a
                                href={selectedFlight?.standings_url || "#"}
                                target="_blank"
                                className="text-xs text-[var(--color-primary)] hover:underline opacity-80"
                            >
                                View original report
                            </a>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-neutral-500 bg-white/5 rounded-lg border border-white/5 border-dashed">
                        <p>No valid report URL found for this flight.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
