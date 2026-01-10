
import { parseHtmlReport } from './parsers/html';
import { parseTextReport } from './parsers/text';
import { LeagueReport, ReportTable } from './parsers/types';

// Re-export types for consumers
export type { LeagueReport, ReportTable };

// Keep deprecated type for backward compatibility if possible, or alias it
// ReportData was previously: { title: string, headers: string[], rows: any[] }
// Use 'any' to avoid breaking consumers immediately, but we should fix them.
export type ReportData = {
    title: string;
    headers: string[]; // Mocking single table structure
    rows: Array<Record<string, string | number>>;
};


export async function fetchLeagueLeaderReport(url: string): Promise<LeagueReport> {
    try {
        const response = await fetch(url, {
            next: { revalidate: 300 }, // Cache for 5 minutes
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.ok) {
            console.error(`Fetch failed: ${response.status} ${response.statusText}`);
            throw new Error(`Failed to fetch report: ${response.statusText}`);
        }

        const text = await response.text();
        console.log(`Fetched report, length: ${text.length}`);

        // Strategy: Check if it's an HTML table report or a text-based report
        // "Dartboard Standings File" is a strong indicator of the text report format.
        if (text.includes('Dartboard Standings File') || text.trim().startsWith('League:')) {
            console.log("Parsing as Text report (signature detected)");
            return parseTextReport(text);
        }

        if (text.includes('<table') && text.includes('</table>')) {
            console.log("Parsing as HTML report");
            return parseHtmlReport(text);
        } else {
            console.log("Parsing as Text report (fallback)");
            return parseTextReport(text);
        }

    } catch (error) {
        console.error('Error parsing LeagueLeader report:', error);
        throw error;
    }
}
