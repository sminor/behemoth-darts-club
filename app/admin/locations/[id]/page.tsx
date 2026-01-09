import { LocationForm } from "@/components/admin/location-form"
import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"

export default async function EditLocationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const { data: location, error } = await supabase
        .from('locations')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !location) {
        notFound()
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white text-center">Edit Location</h1>
            <LocationForm location={location} />
        </div>
    )
}
