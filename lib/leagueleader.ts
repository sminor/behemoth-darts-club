import * as cheerio from 'cheerio';

export type ReportData = {
    headers: string[];
    rows: Array<Record<string, string | number>>;
    title?: string;
    lastUpdated?: string;
};

export async function fetchLeagueLeaderReport(url: string): Promise<ReportData> {
    try {
        const response = await fetch(url, {
            next: { revalidate: 3600 }, // Cache for 1 hour
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch report: ${response.statusText}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        // Find the stats table. 
        // Heuristic: Look for a table that contains "Player" and "Games" in the header
        let statsTable = $('table').filter((i, el) => {
            const text = $(el).text();
            return text.includes('Player') && text.includes('Games');
        }).first();

        // Fallback: Just get the first table with class 'report'
        if (statsTable.length === 0) {
            statsTable = $('table.report').first();
        }

        if (statsTable.length === 0) {
            throw new Error('Could not find stats table in report');
        }

        // Extract Title from h2 or h3
        const title = $('h2').first().text().trim() || $('h3').first().text().trim();

        // Extract "Created by" or date if available (often in the footer or top text)
        // For now, we'll just return what we find.

        const headers: string[] = [];
        const rows: Array<Record<string, string | number>> = [];

        // Parse Headers
        statsTable.find('thead tr th').each((i, el) => {
            headers.push($(el).text().trim());
        });

        // If no thead, try first row of tbody
        if (headers.length === 0) {
            statsTable.find('tbody tr').first().find('td').each((i, el) => {
                headers.push($(el).text().trim());
            });
            // Remove the header row from subsequent parsing if we just used it
            // Actually, usually table structure is consistent. Let's assume standard thead/tbody for now based on exploration.
        }

        // Parse Rows
        statsTable.find('tbody tr').each((i, row) => {
            const $row = $(row);
            // Skip if this row is just headers (sometimes they repeat headers)
            if ($row.find('th').length > 0) return;

            // Also skip if it matches our extracted headers exactly
            const firstCell = $row.find('td').first().text().trim();
            if (firstCell === headers[0]) return;

            const rowData: Record<string, string | number> = {};
            $row.find('td').each((j, cell) => {
                const headerName = headers[j] || `col_${j}`;
                const val = $(cell).text().trim();

                // Try to convert to number if possible and if it looks like a number
                // Be careful with "16.36" vs "3BD"
                const num = Number(val);
                rowData[headerName] = isNaN(num) || val === '' ? val : num;
            });

            // Only add if we have data
            if (Object.keys(rowData).length > 0) {
                rows.push(rowData);
            }
        });

        return {
            headers,
            rows,
            title
        };

    } catch (error) {
        console.error('Error parsing LeagueLeader report:', error);
        throw error;
    }
}
