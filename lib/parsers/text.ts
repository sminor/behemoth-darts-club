
import { LeagueReport, ReportTable } from './types';

export function parseTextReport(text: string): LeagueReport {
    const lines = text.split('\n');
    const tables: ReportTable[] = [];
    let title = "League Report";

    // Try to find title in first few lines
    for (let i = 0; i < Math.min(lines.length, 10); i++) {
        if (lines[i].includes('Dartboard Standings File')) {
            title = lines[i].replace(/.*Dartboard Standings File for/, '')
                .replace(/<\/?[^>]+(>|$)/g, "") // Remove HTML tags
                .trim();
            // Clean up title
            if (title.startsWith(' - ')) title = title.substring(3);
            break;
        }
    }

    let currentSectionName = "";
    let headers: string[] = [];
    let rows: Array<Record<string, string | number>> = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Detect Section Header (heuristic: contains "sorted by" or "Results")
        if (line.includes('sorted by') || line.includes('Results') || line.includes('Division')) {
            // If we were parsing a table, save it
            if (headers.length > 0 && rows.length > 0) {
                tables.push({ name: currentSectionName || "Section", headers, rows });
                headers = [];
                rows = [];
            }

            // Clean section name (remove dashes, extra text)
            currentSectionName = line
                .replace(/[-+]{3,}/g, '')
                .replace(/^Division [A-Z]/, '') // Remove "Division A" prefix if present
                .replace(/,?\s*sorted by.*/i, '') // Remove ", sorted by..." and everything after
                .replace(/:$/, '') // Remove trailing colon
                .trim();

            if (!currentSectionName) currentSectionName = line;
        }

        // Detect Table Header Separator e.g. "-------+-------+-------"
        if (line.match(/^[-+]{5,} \s*$/) || line.includes('-----+')) {
            continue;
        }

        // Detect Data/Header Row (contains pipes |)
        if (line.includes('|')) {
            const parts = line.split('|').map(s => s.trim()).filter(Boolean);

            // Check if this is a header row (repeated)
            if (headers.length > 0 && JSON.stringify(parts) === JSON.stringify(headers)) {
                continue;
            }

            // If we don't have headers for this section yet, assume this is header
            if (headers.length === 0) {
                headers = parts;
            } else {
                // Ensure column count matches reasonably well
                if (Math.abs(parts.length - headers.length) <= 2) {
                    const rowData: Record<string, string | number> = {};
                    headers.forEach((h, index) => {
                        const val = parts[index] || "";
                        const num = Number(val);
                        rowData[h] = isNaN(num) || val === '' ? val : num;
                    });
                    rows.push(rowData);
                }
            }
        } else if (line === "" && headers.length > 0 && rows.length > 0) {
            // Empty line might signal end of table
            tables.push({ name: currentSectionName || "Section", headers, rows });
            headers = [];
            rows = [];
        }
    }

    // Capture last table if exists
    if (headers.length > 0 && rows.length > 0) {
        tables.push({ name: currentSectionName || "Section", headers, rows });
    }

    return { title, tables };
}
