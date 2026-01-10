"use server";

import { fetchLeagueLeaderReport, LeagueReport } from "@/lib/leagueleader";

export async function getLeagueReport(url: string): Promise<LeagueReport> {
    if (!url) {
        throw new Error("No URL provided");
    }
    return await fetchLeagueLeaderReport(url);
}
