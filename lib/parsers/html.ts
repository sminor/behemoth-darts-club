import * as cheerio from 'cheerio';
import { LeagueReport, ReportTable } from './types';

export function parseHtmlReport(html: string): LeagueReport {
    const $ = cheerio.load(html);
    const tables: ReportTable[] = [];

    // Extract Title
    const title = $('h2').first().text().trim() || $('h3').first().text().trim() || "League Report";

    // Find all tables
    $('table').each((index, element) => {
        const $table = $(element);

        // Attempt to find a section title preceding the table
        let tableName = "Section " + (index + 1);
        const prev = $table.prev();
        if (prev.is('h3') || prev.is('h4') || prev.is('div.title')) {
            tableName = prev.text().trim();
        }

        const headers: string[] = [];
        const rows: Array<Record<string, string | number>> = [];

        // Parse Headers
        $table.find('thead tr th').each((i, el) => {
            headers.push($(el).text().trim());
        });

        // If no thead, try first row of tbody
        if (headers.length === 0) {
            $table.find('tbody tr').first().find('td').each((i, el) => {
                headers.push($(el).text().trim());
            });
        }

        // Parse Rows
        $table.find('tbody tr').each((i, row) => {
            const $row = $(row);
            if ($row.find('th').length > 0) return; // Skip header row in body

            const firstCell = $row.find('td').first().text().trim();
            if (firstCell === headers[0]) return; // Skip duplicate headers

            const rowData: Record<string, string | number> = {};
            let hasData = false;

            $row.find('td').each((j, cell) => {
                const headerName = headers[j] || `col_${j}`;
                const val = $(cell).text().trim();

                const num = Number(val);
                rowData[headerName] = isNaN(num) || val === '' ? val : num;

                if (val !== '') hasData = true;
            });

            if (Object.keys(rowData).length > 0 && hasData) {
                rows.push(rowData);
            }
        });

        if (rows.length > 0) {
            tables.push({ name: tableName, headers, rows });
        }
    });

    return { title, tables };
}
