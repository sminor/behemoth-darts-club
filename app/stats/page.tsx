import { ArrowLeft, BarChart3, Home } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { fetchLeagueLeaderReport } from "@/lib/leagueleader";
import { StatsClient } from "@/components/stats-client";

export const dynamic = 'force-dynamic';

export default async function StatsPage({ searchParams }: { searchParams: { report?: string } }) {
    const resolvedSearchParams = await searchParams;
    const selectedReportId = resolvedSearchParams.report;

    // Fetch active reports
    const { data: reports } = await supabase
        .from('data_sources')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

    const activeReports = reports || [];

    // 4. Default Report Logic
    // Priority: Explicit is_default=true -> First in list (Most recent created)
    let defaultReport = activeReports?.find(r => r.is_default);

    if (!defaultReport && activeReports && activeReports.length > 0) {
        defaultReport = activeReports[0];
    }

    let selectedReport = activeReports.find(r => r.id === selectedReportId);

    if (!selectedReport && !selectedReportId) {
        selectedReport = defaultReport;
    }

    // Fetch data if we have a report
    let reportData = null;
    let reportError = null;

    if (selectedReport) {
        try {
            reportData = await fetchLeagueLeaderReport(selectedReport.url);
        } catch (e) {
            console.error('Failed to fetch report:', e);
            reportError = "Failed to load report data.";
        }
    }

    return (
        <main className="min-h-screen bg-[var(--background)] pb-24">
            {/* Header */}
            <header className="border-b border-white/10 bg-neutral-900/50 backdrop-blur-sm sticky top-0 z-20 mb-8">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="w-[100px] flex justify-start">
                        <Link href="/" className="hover:text-white transition-colors group">
                            <Home className="w-5 h-5 text-[var(--color-primary)] opacity-80 group-hover:opacity-100 transition-opacity" />
                        </Link>
                    </div>
                    <h1 className="text-xl font-bold text-white tracking-wider uppercase flex items-center gap-2">
                        Stats <span className="text-[var(--color-primary)]">Lookup</span>
                    </h1>
                    <div className="w-[100px] flex justify-end">
                        <BarChart3 className="w-5 h-5 text-[var(--color-primary)] opacity-80" />
                    </div>
                </div>
            </header>

            <div className="px-4 max-w-6xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-8 space-y-4">
                    <p className="text-neutral-400">
                        Find your stats across the Action Dart League and Behemoth Tournaments.
                    </p>
                </div>

                <StatsClient
                    initialReports={activeReports}
                    initialSelectedReport={selectedReport}
                    initialReportData={reportData}
                    initialReportError={reportError}
                />
            </div>
        </main>
    );
}
