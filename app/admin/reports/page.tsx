import Link from "next/link"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { Plus, Eye, EyeOff, FileText, ExternalLink, Pencil, Star } from "lucide-react"
import { toggleDataSourceStatus, setReportAsDefault } from "@/app/actions/data-sources"
import { DeleteDataSourceButton } from "@/components/admin/delete-data-source-button"

export const dynamic = 'force-dynamic'

export default async function AdminReportsPage() {
    const { data: reports, error } = await supabase
        .from('data_sources')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching reports:', error)
    }

    const allReports = reports || []

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Stat Reports</h1>
                    <p className="text-neutral-400 mt-1">Manage external LeagueLeader reports for the stats page.</p>
                </div>
                <Button asChild className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white">
                    <Link href="/admin/reports/create">
                        <Plus className="w-4 h-4 mr-2" /> New Report
                    </Link>
                </Button>
            </div>

            {allReports.length === 0 ? (
                <div className="text-center py-12 text-neutral-500 bg-white/5 rounded-lg border border-white/5">
                    No reports found. Add one to get started.
                </div>
            ) : (
                <div className="rounded-md border border-white/10 bg-white/5 overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs uppercase bg-white/5 text-neutral-400">
                            <tr>
                                <th className="px-6 py-3 w-16 text-center">Default</th>
                                <th className="px-6 py-3">Report Title</th>
                                <th className="px-6 py-3">Category</th>
                                <th className="px-6 py-3 text-right"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {allReports.map((report) => (
                                <tr key={report.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 text-center">
                                        <form action={async () => {
                                            'use server'
                                            if (!report.is_default) {
                                                await setReportAsDefault(report.id)
                                            }
                                        }}>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className={`h-8 w-8 hover:bg-white/10 ${report.is_default ? "text-yellow-400 cursor-default hover:text-yellow-400 opacity-100" : "text-neutral-600 hover:text-yellow-400/50 opacity-40 hover:opacity-100"}`}
                                                title={report.is_default ? "Current Default" : "Set as Default"}
                                                type="submit"
                                                disabled={report.is_default}
                                            >
                                                <Star className={`w-4 h-4 ${report.is_default ? "fill-current" : ""}`} />
                                            </Button>
                                        </form>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <FileText className="w-4 h-4 text-[var(--color-primary)]" />
                                            <span className="font-medium text-white text-base">{report.title}</span>
                                        </div>
                                        <a
                                            href={report.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-neutral-500 hover:text-[var(--color-primary)] flex items-center gap-1 transition-colors"
                                        >
                                            {report.url.substring(0, 50)}... <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-white/10 text-neutral-300 border border-white/5">
                                            {report.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <form action={async () => {
                                                'use server'
                                                await toggleDataSourceStatus(report.id, report.is_active)
                                            }}>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className={`h-8 w-8 hover:bg-white/10 ${report.is_active ? "text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]" : "text-neutral-400 hover:text-white"}`}
                                                    title={report.is_active ? "Deactivate" : "Activate"}
                                                    type="submit"
                                                >
                                                    {report.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                </Button>
                                            </form>

                                            <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-neutral-400 hover:text-white hover:bg-white/10" title="Edit Report">
                                                <Link href={`/admin/reports/${report.id}`}>
                                                    <Pencil className="w-4 h-4" />
                                                </Link>
                                            </Button>

                                            <DeleteDataSourceButton id={report.id} title={report.title} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
