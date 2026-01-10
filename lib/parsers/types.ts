export type ReportTable = {
    name: string;
    headers: string[];
    rows: Array<Record<string, string | number>>;
};

export type LeagueReport = {
    title: string;
    tables: ReportTable[];
};
