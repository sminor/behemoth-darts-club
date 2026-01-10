"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Trophy, FileText, BarChart3, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { PlayerSearch } from "@/components/player-search";
import { ClubStatsViewer } from "@/components/club-stats-viewer";
import Link from "next/link";
import { ReportData } from "@/lib/leagueleader";

interface Report {
    id: string;
    title: string;
    url: string;
    category: string;
    active: boolean;
}

interface StatsClientProps {
    initialReports: any[];
    initialSelectedReport: any;
    initialReportData: ReportData | null;
    initialReportError: string | null;
}

export function StatsClient({
    initialReports,
    initialSelectedReport,
    initialReportData,
    initialReportError
}: StatsClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Global Search State
    // Initialize from URL query param if present
    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
    const [activeTab, setActiveTab] = useState("adl-stats");

    // Update URL when search changes (debounced)
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (searchQuery) {
            params.set("q", searchQuery);
        } else {
            params.delete("q");
        }

        // Use replace to prevent history stack buildup
        // Only push if we want back button to undo typing 
        // For search-as-you-type, replace is usually better UX
        // But we'll debpunce the URL update
        const timer = setTimeout(() => {
            if (params.toString() !== searchParams.toString()) {
                router.replace(`?${params.toString()}`, { scroll: false });
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery, router, searchParams]);

    // Handle Report Switching
    // When a user clicks a report link, the server page reloads with new data
    // We just need to make sure we stay on the Tournament tab if a report is present in URL
    useEffect(() => {
        if (searchParams.get("report")) {
            setActiveTab("tournament-stats");
        }
    }, [searchParams]);

    // Sync URL if we have a selected report but it's not in the params (initial load default)
    useEffect(() => {
        if (activeTab === "tournament-stats" && initialSelectedReport && !searchParams.get("report")) {
            const params = new URLSearchParams(searchParams.toString());
            params.set("report", initialSelectedReport.id);
            if (searchQuery) params.set("q", searchQuery);
            router.replace(`?${params.toString()}`, { scroll: false });
        }
    }, [activeTab, initialSelectedReport, searchParams, router, searchQuery]);

    return (
        <div className="space-y-8">
            {/* ... Search Bar ... */}
            {/* ... Search Bar ... */}
            <div className="w-full max-w-2xl mx-auto relative">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search player name (e.g. Smith)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-white/10 bg-neutral-900 pl-10 pr-10 py-2 text-sm text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    />
                    {searchQuery && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-md hover:bg-white/10 text-neutral-400 hover:text-white"
                            onClick={() => setSearchQuery("")}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            </div>

            <Tabs
                value={activeTab}
                onValueChange={(val) => {
                    setActiveTab(val);
                    if (val === 'adl-stats') {
                        // Clear report param when switching back to ADL stats
                        const params = new URLSearchParams(searchParams.toString());
                        params.delete('report');
                        router.replace(`?${params.toString()}`, { scroll: false });
                    }
                }}
                className="space-y-8"
            >
                <div className="flex justify-center">
                    <TabsList className="bg-white/5 border border-white/10 p-1">
                        <TabsTrigger value="adl-stats" className="data-[state=active]:bg-[var(--color-primary)] data-[state=active]:text-white text-neutral-400 px-6 data-[state=active]:shadow-lg data-[state=active]:shadow-[var(--color-primary)]/20 dark:data-[state=active]:bg-[var(--color-primary)] dark:data-[state=active]:text-white transition-all">
                            <BarChart3 className="w-4 h-4 mr-2" /> ADL Stats
                        </TabsTrigger>
                        <TabsTrigger value="tournament-stats" className="data-[state=active]:bg-[var(--color-primary)] data-[state=active]:text-white text-neutral-400 px-6 data-[state=active]:shadow-lg data-[state=active]:shadow-[var(--color-primary)]/20 dark:data-[state=active]:bg-[var(--color-primary)] dark:data-[state=active]:text-white transition-all">
                            <Trophy className="w-4 h-4 mr-2" /> Tournament Stats
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="adl-stats" className="space-y-4 focus-visible:outline-none animation-fade-in">
                    <PlayerSearch query={searchQuery} />
                </TabsContent>

                <TabsContent value="tournament-stats" className="space-y-6 focus-visible:outline-none animation-fade-in">
                    {initialReports.length > 0 ? (
                        <div className="space-y-6">
                            {/* Report Selector */}
                            <div className="flex justify-center mb-6">
                                <div className="w-full max-w-xs">
                                    <label className="text-xs text-neutral-400 uppercase tracking-wider font-bold mb-2 block text-center">
                                        Select Report
                                    </label>
                                    <Select
                                        value={initialSelectedReport?.id}
                                        onValueChange={(val) => {
                                            const params = new URLSearchParams(searchParams.toString());
                                            params.set('report', val);
                                            // Ensure we keep the search query
                                            if (searchQuery) {
                                                params.set('q', searchQuery);
                                            }
                                            router.replace(`?${params.toString()}`, { scroll: false });
                                        }}
                                    >
                                        <SelectTrigger className="w-full bg-neutral-900 border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-0 transition-all">
                                            <SelectValue placeholder="Select a report" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-neutral-900 border-white/10 text-white">
                                            {initialReports.map((report: any) => (
                                                <SelectItem key={report.id} value={report.id} className="focus:bg-[var(--color-primary)] focus:text-white cursor-pointer">
                                                    {report.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Report Viewer */}
                            {initialReportError ? (
                                <div className="text-center py-12 text-red-400 bg-red-500/10 rounded-lg border border-red-500/20">
                                    <p>{initialReportError}</p>
                                </div>
                            ) : initialReportData ? (
                                <ClubStatsViewer
                                    reportData={initialReportData}
                                    reportUrl={initialSelectedReport!.url}
                                    reportTitle={initialSelectedReport!.title}
                                    searchQuery={searchQuery}
                                />
                            ) : (
                                <div className="text-center py-12 text-neutral-500 bg-white/5 rounded-lg border border-white/5">
                                    Loading report...
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-neutral-500 bg-white/5 rounded-lg border border-white/5">
                            No tournament reports available yet. Check back soon!
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
