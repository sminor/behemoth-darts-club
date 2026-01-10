import { EditReportForm } from "@/components/admin/edit-report-form"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function EditReportPage({ params }: { params: { id: string } }) {
    const resolvedParams = await params
    const id = resolvedParams.id

    const { data: report } = await supabase
        .from('data_sources')
        .select('*')
        .eq('id', id)
        .single()

    if (!report) {
        notFound()
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/reports" className="p-2 hover:bg-white/10 rounded-full transition-colors text-neutral-400 hover:text-white">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl font-bold text-white tracking-tight">Edit Report</h1>
            </div>

            <div className="border border-white/10 bg-white/5 rounded-lg p-6">
                <EditReportForm report={report} />
            </div>
        </div>
    )
}
