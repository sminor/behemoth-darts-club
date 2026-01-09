import { EventForm } from "@/components/admin/event-form"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    // Fetch the event
    const { data: event, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !event) {
        notFound()
    }

    // Fetch active locations
    const { data: locations } = await supabase
        .from('locations')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true })

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/events" className="p-2 hover:bg-white/10 rounded-full transition-colors text-neutral-400 hover:text-white">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl font-bold text-white tracking-tight">Edit Event</h1>
            </div>

            <div className="border border-white/10 bg-white/5 rounded-lg p-6">
                <EventForm event={event} locations={locations || []} />
            </div>
        </div>
    )
}
